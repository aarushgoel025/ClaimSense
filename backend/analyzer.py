import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from precedents_db import get_precedent, PRECEDENTS_DB

load_dotenv()

# ── Scoring Categories ───────────────────────────────────────────────
# Each category has a max score. Gemini rates each one individually.
# The final success_probability = sum of all category scores.
SCORING_CATEGORIES = {
    "regulatory_violation": {
        "label": "Regulatory Violation Strength",
        "description": "How clearly and directly does the rejection violate IRDAI regulations, circulars, or mandated guidelines?",
        "max_score": 25
    },
    "legal_precedent_match": {
        "label": "Legal Precedent Match",
        "description": "How strongly does the case match known Ombudsman, Consumer Forum, or High Court/Supreme Court precedents that ruled in the consumer's favour?",
        "max_score": 25
    },
    "documentation_strength": {
        "label": "Documentation & Evidence Strength",
        "description": "Based on the rejection letter, how well-documented is the policyholder's case? Does the letter itself reveal procedural lapses by the insurer?",
        "max_score": 15
    },
    "insurer_reasoning_weakness": {
        "label": "Insurer's Reasoning Weakness",
        "description": "How weak, vague, contradictory, or technically flawed is the insurer's stated reason for rejection?",
        "max_score": 15
    },
    "policyholder_compliance": {
        "label": "Policyholder Compliance",
        "description": "Did the policyholder appear to follow policy terms (timely intimation, valid hospital, active policy)? Higher score = policyholder was compliant.",
        "max_score": 10
    },
    "consumer_protection_applicability": {
        "label": "Consumer Protection Applicability",
        "description": "Can the consumer invoke general consumer protection law (Contra Proferentem, unfair trade practice, deficiency in service) in addition to insurance-specific rules?",
        "max_score": 10
    }
}


def analyze_rejection(text: str, irdai_rules: str) -> dict:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.5-flash')

    # ── PASS 1: Case Analysis (no precedent selection) ────────────────
    # Gemini's only job here is to understand the rejection and score it.
    # We deliberately keep precedent selection OUT of this call to avoid
    # keyword hallucination from cognitive overload.

    # Build the scoring rubric for the prompt
    scoring_rubric_lines = []
    for key, cat in SCORING_CATEGORIES.items():
        scoring_rubric_lines.append(
            f'    "{key}": {{"score": <integer 0-{cat["max_score"]}>, "reasoning": "<1 sentence>"}}'
        )
    scoring_rubric = ",\n".join(scoring_rubric_lines)

    pass1_prompt = f"""You are ClaimSense, an expert Indian health insurance legal advisor.
Analyze the following health insurance rejection letter and respond ONLY in this exact JSON format:
{{
"rejection_reason": "One sentence: what reason did the insurer give",
"core_legal_issue": "One sentence: describe the SPECIFIC legal issue at stake (e.g. 'Insurer is excluding a claim citing medical negligence by a third-party doctor as proximate cause of death')",
"plain_explanation": "2-3 sentences in simple English explaining what this means for the policyholder",
"is_challengeable": true or false,
"category_scores": {{
{scoring_rubric}
}},
"legal_basis": "If challengeable: cite the specific IRDAI regulation and explain why the rejection may be wrongful. If valid: explain why it is legally sound.",
"confidence": "HIGH / MEDIUM / LOW"
}}

SCORING INSTRUCTIONS:
You MUST score EACH of the following categories independently. Be strict and fair.
{chr(10).join(f'- "{k}" (max {cat["max_score"]}): {cat["description"]}' for k, cat in SCORING_CATEGORIES.items())}
The sum of all category scores will become the final Success Score (max 100).
Do not add any text outside the JSON. Be direct and accurate.

Relevant IRDAI Guidelines:
{irdai_rules}

Rejection Letter Content:
{text}"""

    try:
        pass1_response = model.generate_content(
            pass1_prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        result_json = json.loads(pass1_response.text)
    except Exception as e:
        try:
            raw_text = pass1_response.text if pass1_response else ""
            cleaned = raw_text.replace('```json', '').replace('```', '').strip()
            result_json = json.loads(cleaned)
        except Exception:
            return {
                "rejection_reason": "Analysis processing error.",
                "plain_explanation": f"Failed to analyze the rejection letter. Ensure the API key is valid and try again. Error: {str(e)}",
                "is_challengeable": False,
                "legal_basis": "N/A",
                "confidence": "LOW",
                "success_probability": 0,
                "category_scores": {},
                "score_breakdown": [],
                "precedent_data": None
            }

    result_json = _compute_final_score(result_json)

    # ── PASS 2: Precedent Verification ───────────────────────────────
    # Only runs if Pass 1 says the claim is challengeable.
    # A separate, focused call verifies each candidate precedent
    # using logical legal reasoning — NOT keyword matching.
    result_json["precedent_data"] = None  # Safe default

    if result_json.get("is_challengeable"):
        core_issue = result_json.get("core_legal_issue", result_json.get("rejection_reason", ""))
        verified_precedent = _verify_precedent_match(model, text, core_issue)
        result_json["precedent_data"] = verified_precedent

    return result_json


def _verify_precedent_match(model, rejection_text: str, core_legal_issue: str) -> dict | None:
    """
    PASS 2: A dedicated, focused call whose ONLY job is to find a
    truly matching precedent using legal logic — not keyword overlap.

    Strategy:
    - Present the core legal issue extracted in Pass 1.
    - Ask Gemini to evaluate each precedent logically.
    - Require it to explain WHY the legal reasoning applies, not just
      that keywords match.
    - If no precedent passes, return None (no precedent shown in UI).
    """
    # Build a clean list with key + full text for verification
    precedent_list_lines = []
    for k, v in PRECEDENTS_DB.items():
        if k == "OTHER":
            continue  # Skip the generic fallback
        precedent_list_lines.append(
            f"KEY: {k}\n"
            f"Title: {v['title']}\n"
            f"Citation: {v['citation']}\n"
            f"Ruling: {v['text']}\n"
        )
    precedent_list = "\n---\n".join(precedent_list_lines)

    verify_prompt = f"""You are a strict Indian insurance law expert performing a precedent verification check.

TASK: Determine if ANY precedent in our database is a genuine legal match for the case below.
A genuine match means the precedent's LEGAL RULING directly resolves or challenges the SAME legal question raised by this rejection.
A match is NOT valid just because both use similar words like "exclusion", "claim", or "policy".

THE REJECTION CASE:
Core Legal Issue: {core_legal_issue}
Full Rejection Letter: {rejection_text}

VERIFICATION RULES (apply ALL of them):
1. The precedent's core ruling must address the SAME legal question (not just the same topic area).
2. The SPECIFIC FACTS must be comparable (e.g., a surgery exclusion case does NOT match a disease death claim).
3. The LEGAL REMEDY offered by the precedent must be applicable to this specific rejection.
4. If you are even slightly unsure, return NO_MATCH. A wrong precedent is far more damaging than no precedent.

AVAILABLE PRECEDENTS:
{precedent_list}

RESPONSE FORMAT (respond with ONLY valid JSON, nothing else):
If a genuine match exists:
{{"match": true, "key": "<EXACT KEY FROM LIST>", "reason": "One sentence explaining WHY the legal ruling directly applies to this specific case."}}

If no genuine match exists:
{{"match": false, "key": null, "reason": "One sentence explaining why no precedent specifically covers this legal situation."}}"""

    try:
        verify_response = model.generate_content(
            verify_prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        verify_json = json.loads(verify_response.text)
    except Exception:
        try:
            raw = verify_response.text if verify_response else ""
            cleaned = raw.replace('```json', '').replace('```', '').strip()
            verify_json = json.loads(cleaned)
        except Exception:
            return None  # If verification call fails, show no precedent (safe default)

    # Only attach precedent if the verifier explicitly confirmed a match
    if verify_json.get("match") is True:
        matched_key = verify_json.get("key", "")
        if matched_key and matched_key in PRECEDENTS_DB:
            return get_precedent(matched_key)

    return None  # No match confirmed — UI hides the precedent section


def _compute_final_score(result_json: dict) -> dict:
    """
    Reads the category_scores from Gemini's response,
    clamps each to its max, computes the total, and builds
    a clean breakdown list for the frontend.
    """
    raw_scores = result_json.get("category_scores", {})
    breakdown = []
    total = 0

    for key, cat in SCORING_CATEGORIES.items():
        entry = raw_scores.get(key, {})
        # Handle both dict format and direct int
        if isinstance(entry, dict):
            score = entry.get("score", 0)
            reasoning = entry.get("reasoning", "")
        elif isinstance(entry, (int, float)):
            score = entry
            reasoning = ""
        else:
            score = 0
            reasoning = ""

        # Clamp score to valid range
        score = max(0, min(int(score), cat["max_score"]))
        total += score

        breakdown.append({
            "key": key,
            "label": cat["label"],
            "score": score,
            "max_score": cat["max_score"],
            "reasoning": reasoning
        })

    # Cap at 90 — no legal outcome can ever be fully guaranteed
    capped_total = min(total, 90)
    result_json["success_probability"] = capped_total
    result_json["probability_reasoning"] = (
        f"Score computed across {len(breakdown)} evaluation categories "
        f"(raw total {total}/100)."
    )
    result_json["score_breakdown"] = breakdown
    return result_json
