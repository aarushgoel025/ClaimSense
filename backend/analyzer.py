import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from precedents_db import get_precedent, PRECEDENTS_DB

load_dotenv()

def analyze_rejection(text: str, irdai_rules: str) -> dict:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    categories_desc = "\n".join(f"- '{k}': {v['title']}" for k, v in PRECEDENTS_DB.items())
    
    prompt = f"""You are ClaimSense, an expert Indian health insurance legal advisor.
You help policyholders understand and challenge wrongful insurance
claim rejections.
Given a health insurance rejection letter and relevant IRDAI guidelines,
you must respond ONLY in this exact JSON format:
{{
"rejection_category": "MUST BE EXACTLY ONE OF the following keys based on the matching reason:\n{categories_desc}",
"rejection_reason": "One sentence: what reason did the insurer give",
"plain_explanation": "2-3 sentences in simple English explaining
what this means for the policyholder",
"is_challengeable": true or false,
"success_probability": "Integer (0-100) representing the chance of winning an appeal (Factor in IRDAI rules and matching precedents)",
"probability_reasoning": "One sentence explanation for the success score",
"legal_basis": "If challengeable: cite the specific IRDAI regulation and explain why the rejection may be wrongful. If valid: explain why it is legally sound.",
"confidence": "HIGH / MEDIUM / LOW"
}}
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
                "precedent_data": None
            }
