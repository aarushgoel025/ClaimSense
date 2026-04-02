from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import json

from parser import extract_text_from_pdf, clean_text
from irdai_guidelines import IRDAI_GUIDELINES
from analyzer import analyze_rejection
from letter_generator import generate_appeal_letter

app = FastAPI(title="ClaimSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_claim(
    file: Optional[UploadFile] = File(default=None),
    text: Optional[str] = Form(default=None)
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Must provide either a PDF file or text content via Form data.")

    extracted_text = ""
    if file:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        try:
            file_bytes = await file.read()
            extracted_text = extract_text_from_pdf(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")
    elif text:
        extracted_text = clean_text(text)

    if len(extracted_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Extracted text is too short or empty. Please check the document or pasted text.")

    # 1. Analyze Rejection
    analysis_result = analyze_rejection(extracted_text, IRDAI_GUIDELINES)

    # 2. Generate Appeal Letter
    appeal_letter = ""
    if analysis_result.get("is_challengeable"):
        appeal_letter = generate_appeal_letter({
            "rejection_reason": analysis_result.get("rejection_reason"),
            "legal_basis": analysis_result.get("legal_basis"),
            "precedent_data": analysis_result.get("precedent_data")
        })

    # 3. Escalation Steps
    escalation_steps = [
        {"title": "Internal Grievance", "desc": "Write to insurer's Grievance Officer (15-day response window, mandatory first step)"},
        {"title": "IRDAI Bima Bharosa", "desc": "File online at bimabharosa.irdai.gov.in (free, takes 2-4 weeks)"},
        {"title": "Insurance Ombudsman", "desc": "Free, binding on insurer up to ₹30 lakhs, region-wise offices across India"},
        {"title": "Consumer Forum", "desc": "For amounts above ₹30 lakhs or if Ombudsman fails"}
    ]

    return {
        "rejection_reason": analysis_result.get("rejection_reason", "Analysis failed"),
        "plain_explanation": analysis_result.get("plain_explanation", "Could not analyze the document."),
        "is_challengeable": analysis_result.get("is_challengeable", False),
        "success_probability": analysis_result.get("success_probability", 0),
        "probability_reasoning": analysis_result.get("probability_reasoning", ""),
        "legal_basis": analysis_result.get("legal_basis", ""),
        "appeal_letter": appeal_letter,
        "escalation_steps": escalation_steps,
        "precedent_data": analysis_result.get("precedent_data")
    }

# Also support JSON payload for text-only
@app.post("/analyze/text")
async def analyze_claim_text(payload: TextPayload):
    extracted_text = clean_text(payload.text)
    
    if len(extracted_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Provided text is too short or empty.")

    analysis_result = analyze_rejection(extracted_text, IRDAI_GUIDELINES)

    appeal_letter = ""
    if analysis_result.get("is_challengeable"):
        appeal_letter = generate_appeal_letter({
            "rejection_reason": analysis_result.get("rejection_reason"),
            "legal_basis": analysis_result.get("legal_basis"),
            "precedent_data": analysis_result.get("precedent_data")
        })

    escalation_steps = [
        {"title": "Internal Grievance", "desc": "Write to insurer's Grievance Officer (15-day response window, mandatory first step)"},
        {"title": "IRDAI Bima Bharosa", "desc": "File online at bimabharosa.irdai.gov.in (free, takes 2-4 weeks)"},
        {"title": "Insurance Ombudsman", "desc": "Free, binding on insurer up to ₹30 lakhs, region-wise offices across India"},
        {"title": "Consumer Forum", "desc": "For amounts above ₹30 lakhs or if Ombudsman fails"}
    ]

    return {
        "rejection_reason": analysis_result.get("rejection_reason", "Analysis failed"),
        "plain_explanation": analysis_result.get("plain_explanation", "Could not analyze the document."),
        "is_challengeable": analysis_result.get("is_challengeable", False),
        "success_probability": analysis_result.get("success_probability", 0),
        "probability_reasoning": analysis_result.get("probability_reasoning", ""),
        "legal_basis": analysis_result.get("legal_basis", ""),
        "appeal_letter": appeal_letter,
        "escalation_steps": escalation_steps,
        "precedent_data": analysis_result.get("precedent_data")
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
