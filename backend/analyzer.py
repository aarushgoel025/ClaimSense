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

    categories_desc = "\n".join(f"- '{k}': {v['title']}" for k, v in PRECEDENTS_DB.items())

    # Build the scoring rubric for the prompt
    scoring_rubric_lines = []
    for key, cat in SCORING_CATEGORIES.items():
        scoring_rubric_lines.append(
            f'    "{key}": {{"score": <integer 0-{cat["max_score"]}>, "reasoning": "<1 sentence>"}}'
        )
    scoring_rubric = ",\n".join(scoring_rubric_lines)

    prompt = f"""You are ClaimSense, an expert Indian health insurance legal advisor.
You help policyholders understand and challenge wrongful insurance
claim rejections.
Given a health insurance rejection letter and relevant IRDAI guidelines,
you must respond ONLY in this exact JSON format:
{{
"rejection_category": "MUST BE EXACTLY ONE OF the following keys based on the matching reason:\n{categories_desc}",
"rejection_reason": "One sentence: what reason did the insurer give",
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
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        result_json = json.loads(response.text)
        result_json = _compute_final_score(result_json)
        category = result_json.get("rejection_category", "OTHER")
        result_json["precedent_data"] = get_precedent(category)
        return result_json
    except Exception as e:
        # Fallback if json extraction fails
        try:
            # Handle possible markdown json codeblock
            raw_text = response.text if response else ""
            cleaned = raw_text.replace('```json', '').replace('```', '').strip()
            result_json = json.loads(cleaned)
            result_json = _compute_final_score(result_json)
            category = result_json.get("rejection_category", "OTHER")
            result_json["precedent_data"] = get_precedent(category)
            return result_json
        except Exception as inner_e:
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
