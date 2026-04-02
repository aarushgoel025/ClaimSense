import os
import google.generativeai as genai

def generate_appeal_letter(case_data: dict) -> str:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    precedent_text = ""
    precedent_data = case_data.get('precedent_data')
    if precedent_data and precedent_data.get('title') != "General Unfair Claim Settlement":
        precedent_text = f"CRITICAL REQUIREMENT: Cite this specific legal precedent in the letter: {precedent_data.get('citation')} - {precedent_data.get('text')}"

    prompt = f"""You are a professional legal letter writer specializing in Indian
insurance consumer rights.
Write a formal appeal letter for the following insurance rejection case:
Policyholder details: The Policyholder
Insurer: The Insurance Company
Claim amount: the claimed amount
Rejection reason given: {case_data.get('rejection_reason', 'N/A')}
Legal basis for appeal: {case_data.get('legal_basis', 'N/A')}
Policy duration: several years
The letter must:

Be addressed to: The Grievance Officer, [Insurer Name]
Reference: IRDAI Grievance Redressal Guidelines 2015
Clearly state the rejection is being disputed
Cite the specific IRDAI regulation that supports the appeal
Demand resolution within 15 days (as per IRDAI mandate)
Mention escalation to Insurance Ombudsman if unresolved
List documents to be attached (discharge summary, bills,
policy document, rejection letter copy)
{precedent_text}
Be firm but professional in tone
End with: "If this matter is not resolved within 15 days,
I will be compelled to file a complaint with the Insurance
Ombudsman under Rule 14 of the Insurance Ombudsman Rules, 2017."

Return only the letter text, no extra commentary."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Failed to generate letter: {str(e)}"
