import fitz  # PyMuPDF
import re

def clean_text(raw_text: str) -> str:
    """Removes extra whitespaces and noisy characters from text."""
    text = re.sub(r'\s+', ' ', raw_text)
    return text.strip()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file byte stream using PyMuPDF."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    
    return clean_text(text)
