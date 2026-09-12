# ClaimSense — AI-Powered Health Insurance Claims Intelligence Platform

> **Fighting wrongful insurance rejections with precision legal precedents, automated statutory appeals, and actionable evidence checklists.**

ClaimSense is a production-ready, full-stack web application built for Indian health insurance policyholders. It analyzes claim rejection and deduction letters, cross-references them against IRDAI regulations and real Insurance Ombudsman judgments, calculates a multi-dimensional challengeability score, provides an interactive evidence checklist, and auto-drafts a professionally worded, legally-backed appeal letter — all in under a minute.

---

## 📋 Table of Contents

1. [Problem Statement](#problem-statement)
2. [Key Features & UI Highlights](#key-features--ui-highlights)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [How It Works — Step by Step](#how-it-works--step-by-step)
6. [UI Component Highlights](#ui-component-highlights)
7. [API Reference](#api-reference)
8. [Project Structure](#project-structure)
9. [Local Development Setup](#local-development-setup)
10. [Environment Variables](#environment-variables)
11. [Production Deployment Guide](#production-deployment-guide)
12. [Legal Escalation Framework](#legal-escalation-framework)
13. [Curated Legal Precedents Database](#curated-legal-precedents-database)
14. [Disclaimer](#disclaimer)

---

## Problem Statement

Health insurance claim repudiations and arbitrary proportionate deductions in India are rampant and often wrongful. Insurers frequently exploit complex legal jargon, hyper-technical policy clauses, and policyholders' lack of statutory awareness to deny legitimate claims (e.g., alleging non-disclosure of pre-existing diseases, day-care procedure exclusions, or applying blanket proportionate deductions across all hospital line items).

Most policyholders simply accept the rejection — unaware they have binding legal grounds to challenge it under IRDAI mandates.

**ClaimSense bridges this gap.** It acts as an experienced health insurance legal advisor in your browser, demystifying rejections and generating legally watertight appeals backed by statutory authorities.

---

## Key Features & UI Highlights

- 📈 **Multi-Category AI Success Score (0–90%)** — An objective probability score calculated across 6 independent legal and clinical criteria, with an expandable category-by-category rubric and reasoning breakdown.
- ⚖️ **Statutory Legal Breakdown** — Extracts the core legal issue and provides a plain-language explanation of why the insurer's repudiation violates specific IRDAI rules or court precedents.
- 📚 **Ombudsman Precedent Engine** — Cross-references the rejection against a curated database of real Ombudsman and National Consumer Commission (NCDRC) judgments, displaying the matched title, citation, and ruling.
- 📋 **Dynamic Evidence Checklist** — Context-aware checklist of mandatory and recommended documents tailored to the specific rejection category, complete with interactive checkboxes and a real-time progress tracker.
- ✉️ **Automated Grievance Appeal Draft** — Generates a formal, professional appeal letter addressed to the insurer's Grievance Redressal Officer (GRO), citing exact IRDAI regulations and mandating a 15-day statutory resolution.
- 📥 **Multi-Page A4 PDF Export** — Built-in client-side PDF export (`jsPDF`) with dynamic multi-page pagination, running headers, confidentiality notices, and automated page numbering (`Page X of Y`).
- 🗺️ **5-Stage Action Roadmap** — Clear escalation pathway from Appeal Letter &rarr; Grievance Officer &rarr; IRDAI Bima Bharosa &rarr; Insurance Ombudsman &rarr; Consumer Forum, complete with procedural RPAD (Registered Post with Acknowledgement Due) paper-trail guidance.
- 🔍 **Dual Input Processing** — Upload a rejection letter as a PDF (extracted via PyMuPDF) or paste the raw rejection text directly.
- ⏱ **Client-Side Analysis History** — Automatically persists the 3 most recent analysis reports in browser `localStorage` for instant review without account registration.
- 🌙 **Theme Modes (Arctic Light & Dark Mode)** — Seamlessly toggle between a crisp clinical light theme and a sleek dark theme.

---

## Tech Stack

### Backend
| Technology | Role |
|---|---|
| **Python 3.11+** | Core backend language |
| **FastAPI** | High-performance asynchronous REST API framework |
| **Uvicorn** | Production-ready ASGI server |
| **Google Gemini API (`gemini-3.6-flash`)** | Dual-pass LLM reasoning engine for analysis & letter generation |
| **google-generativeai** | Official Google AI SDK |
| **PyMuPDF (`fitz`)** | Fast client-side & server-side PDF text extraction |
| **asyncpg / PostgreSQL** | Precedents storage & connection pooling (with in-memory fallback) |
| **Pydantic v2** | Request validation & response schemas |
| **python-dotenv** | Environment configuration management |

### Frontend
| Technology | Role |
|---|---|
| **React 18** | Declarative component UI library |
| **Vite 5** | Lightning-fast bundler and local dev server |
| **TailwindCSS 3** | Utility-first responsive styling and theme tokens |
| **jsPDF** | Multi-page client-side PDF generation & formatting |
| **Lucide React** | Modern iconography |
| **Google Fonts** | Sora (display), DM Sans (body), IBM Plex Mono (code/legal) |

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                               USER BROWSER                                 │
│                                                                            │
│  React + Vite Single Page Application                                      │
│  ├── UploadSection   (PDF Dropzone / Text Area)                            │
│  ├── ResultsCard     (Success Meter, 6-Category Rubric, Precedent Card)    │
│  ├── AppealLetter    (Live Preview, Copy to Clipboard, Multi-Page PDF)     │
│  ├── DocumentChecklist (Interactive Mandatory & Recommended Evidence)      │
│  └── ActionRoadmap   (5-Stage Escalation Guide & RPAD Tips)                │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ HTTP POST /analyze or /analyze/text
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND (Python 3.11)                        │
│                                                                            │
│  main.py                → API routing, CORS, payload validation            │
│  ├── parser.py          → PyMuPDF extraction & regex cleaning              │
│  ├── analyzer.py        → Pass 1: Multi-category legal analysis & scoring  │
│  │                      → Pass 2: Strict precedent verification            │
│  ├── precedents_db.py   → In-memory legal judgments cache / PostgreSQL     │
│  ├── letter_generator.py→ Statutory grievance appeal letter generator      │
│  ├── document_checklist.py → Dynamic evidence checklist generator         │
│  └── irdai_guidelines.py→ Injected IRDAI statutory rules context           │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │   Google Gemini API    │
                         │   (gemini-3.6-flash)   │
                         └────────────────────────┘
```

---

## How It Works — Step by Step

### Step 1: Document Ingestion
The user uploads an insurer rejection/deduction letter as a PDF or pastes the text into the web interface.

### Step 2: Text Normalization (`parser.py`)
- If a PDF is provided, PyMuPDF extracts text across all pages.
- Regex removes noise, formatting artifacts, and collapses whitespace.

### Step 3: Two-Pass AI Legal Analysis (`analyzer.py`)
1. **Pass 1 (Analysis & 6-Category Scoring)**:
   Gemini analyzes the rejection against statutory IRDAI guidelines across 6 categories:
   - *Regulatory Violation Strength (Max 25)*: Direct infractions of IRDAI circulars.
   - *Legal Precedent Match (Max 25)*: Alignment with Ombudsman and court rulings.
   - *Documentation Strength (Max 15)*: Procedural lapses evident in the letter.
   - *Insurer Reasoning Weakness (Max 15)*: Contradictions or vague clauses in the rejection.
   - *Policyholder Compliance (Max 10)*: Timely intimation and valid hospitalization.
   - *Consumer Protection Applicability (Max 10)*: Applicability of *Contra Proferentem* and unfair trade practice rules.
   *The final score is capped at 90% to maintain realistic legal expectations.*
2. **Pass 2 (Precedent Verification)**:
   A dedicated legal logic call checks if any ruling in the precedent database is an exact factual and statutory match (avoiding shallow keyword hallucination).

### Step 4: Evidence Checklist Generation (`document_checklist.py`)
Generates a customized list of mandatory and recommended documents (e.g., discharge summaries, itemized bills, 4-year pre-policy records for PED disputes, or OT/surgeon fee breakdowns for proportionate deduction disputes).

### Step 5: Appeal Letter Generation (`letter_generator.py`)
If the claim is challengeable, Gemini drafts a formal appeal letter addressed to the insurer's Grievance Officer, citing the exact IRDAI guidelines, precedent rulings, and mandating a 15-day statutory resolution under the Insurance Ombudsman Rules, 2017.

### Step 6: Rendering & PDF Export
The frontend renders the interactive dashboard. The policyholder can review the analysis, track required documents, and download a multi-page A4 PDF ready to print or email.

---

## UI Component Highlights

### 1. Success Probability Meter & Score Breakdown
- **Visual Gauge**: Semi-circular circular SVG score meter color-coded by probability tier (Green > 70%, Amber 40–70%, Red < 40%).
- **Collapsible Rubric**: Expandable accordion displaying all 6 scoring categories with individual progress bars and single-sentence rationales.

### 2. Supported Legal Precedent Card
- Highlights verified rulings from the Insurance Ombudsman and Supreme Court / NCDRC.
- Displays case citation, court/authority, and verbatim excerpt of the legal principle.

### 3. Interactive Document Checklist
- Grouped into **Mandatory Documents** (red badge) and **Recommended Documents** (blue badge).
- Interactive checkboxes update a real-time progress percentage bar.
- Explains *why* each document is crucial for the appeal.

### 4. 5-Stage Action Roadmap
- **Step 1**: Download Appeal Letter.
- **Step 2**: Submit to Insurer Grievance Officer (15-day statutory window).
- **Step 3**: File on IRDAI Bima Bharosa Portal (with direct link).
- **Step 4**: Approach Insurance Ombudsman (binding up to ₹30 Lakhs).
- **Step 5**: Consumer Forum / Court (under Consumer Protection Act, 2019).
- **Pro Tip**: Guidance on sending physical letters via Registered Post with Acknowledgement Due (RPAD) for a verified legal paper trail.

### 5. Multi-Page Formatted PDF
- Automatically breaks long appeal letters across multiple A4 pages without cutting off text.
- Formats subject lines and headers with bold typography.
- Adds running headers, divider lines, confidentiality notices, and automated page numbering (`Page 1 of 2`, etc.).

---

## API Reference

### 1. `POST /analyze`
Analyzes a health insurance rejection letter via multipart form-data.

**Headers:** `Content-Type: multipart/form-data`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | File (`.pdf`) | Optional* | PDF rejection document |
| `text` | String | Optional* | Raw text of rejection letter |

*\*At least one of `file` or `text` must be provided.*

### 2. `POST /analyze/text`
Direct JSON alternative for text-only analyses.

**Headers:** `Content-Type: application/json`

```json
{
  "text": "Your claim dated 12/04/2026 is repudiated under Clause 4.1 citing pre-existing condition non-disclosure."
}
```

### Response Schema (`200 OK`)
```json
{
  "rejection_reason": "The insurer repudiated the claim citing non-disclosure of pre-existing disease.",
  "plain_explanation": "The insurer claims you had this disease before buying the policy...",
  "is_challengeable": true,
  "success_probability": 83,
  "probability_reasoning": "Score computed across 6 evaluation categories (raw total 83/100).",
  "score_breakdown": [
    {
      "key": "regulatory_violation",
      "label": "Regulatory Violation Strength",
      "score": 22,
      "max_score": 25,
      "reasoning": "Clear violation of IRDAI moratorium rules."
    }
  ],
  "legal_basis": "Under IRDAI regulations, policies continuous for over 5/8 years cannot be repudiated on non-disclosure grounds.",
  "appeal_letter": "To,\nThe Grievance Officer,\n...",
  "escalation_steps": [
    { "title": "Internal Grievance", "desc": "Write to insurer's Grievance Officer (15-day window)" }
  ],
  "precedent_data": {
    "title": "Non-Disclosure & Waiting Period",
    "citation": "Section 45, Insurance Act, 1938",
    "text": "The insurer cannot repudiate a policy after the statutory moratorium period..."
  },
  "document_checklist": [
    {
      "name": "Hospital Discharge Summary",
      "why": "Medical evidence of diagnosis and treatment given.",
      "priority": "mandatory"
    }
  ]
}
```

---

## Project Structure

```
ClaimSense/
├── README.md                    # Project documentation & deployment guide
│
├── backend/
│   ├── main.py                  # FastAPI application, lifespan, endpoints, CORS
│   ├── analyzer.py              # Gemini 3.6 Flash dual-pass analysis & 6-category rubric
│   ├── letter_generator.py      # AI statutory appeal letter generator
│   ├── parser.py                # PyMuPDF PDF extraction & text cleaner
│   ├── precedents_db.py         # Curated Indian Insurance Ombudsman precedents
│   ├── document_checklist.py    # Evidence checklist generator based on rejection type
│   ├── irdai_guidelines.py      # IRDAI regulation context rules
│   ├── database.py              # Optional asyncpg PostgreSQL database connector
│   ├── seed_precedents.py       # One-time database seed script
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Backend environment variables
│
└── frontend/
    ├── index.html               # Single-page application entry HTML
    ├── package.json             # Frontend dependencies & scripts
    ├── vite.config.js           # Vite dev and build configuration
    ├── tailwind.config.js       # Tailwind design tokens and color schemes
    ├── postcss.config.js        # PostCSS configuration
    └── src/
        ├── main.jsx             # React entry point
        ├── App.jsx              # Main dashboard, history state, theme controller
        ├── index.css            # Design tokens, custom scrollbars, dark mode tokens
        └── components/
            ├── UploadSection.jsx     # Dual PDF / text upload dropzone
            ├── ResultsCard.jsx       # Success meter, category rubric, precedent card
            ├── AppealLetter.jsx      # Letter preview & multi-page jsPDF export
            ├── DocumentChecklist.jsx # Interactive mandatory & recommended evidence list
            └── ActionRoadmap.jsx     # 5-stage escalation roadmap & RPAD tips
```

---

## Local Development Setup

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & `npm`
- **Google Gemini API Key** ([Get a free key on Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Backend Setup
```bash
cd backend

# Create virtual environment (using uv or python venv)
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure your .env file
# Create backend/.env with:
# GEMINI_API_KEY=your_gemini_api_key_here

# Run backend development server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API will be live at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Frontend will be live at `http://127.0.0.1:5173`.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for analysis and letter generation. |
| `DATABASE_URL` | No | Optional PostgreSQL connection string (falls back to built-in dictionary if not provided). |

### Frontend (`frontend/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:8000` | Backend API URL. Set this to your production backend URL during deployment. |

---

## Production Deployment Guide

ClaimSense frontend and backend can be deployed independently.

### Option A: Deploying Frontend (Vercel / Netlify / Cloudflare Pages)

1. **Build Command**: `npm run build`
2. **Publish / Output Directory**: `dist`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-deployed-backend.onrender.com
   ```
4. **SPA Rewrite (for Netlify/Vercel)**: Ensure fallback routing to `/index.html` is configured.

---

### Option B: Deploying Backend (Render / Railway / Fly.io)

#### Using Render / Railway:
1. **Root Directory**: `backend`
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `PYTHONIOENCODING`: `utf-8`
   - `DATABASE_URL`: (Optional) If connecting to hosted PostgreSQL.

#### CORS Configuration in Production:
In `backend/main.py`, CORS allows all origins by default (`allow_origins=["*"]`). For strict production environments, specify your exact frontend domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-claimsense-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Legal Escalation Framework

| Stage | Authority | Scope & Mandate |
|---|---|---|
| **1. Internal Grievance** | Insurer's Grievance Redressal Officer (GRO) | Mandatory first step under IRDAI 2015 regulations. Insurer must reply within **15 days**. |
| **2. IRDAI Bima Bharosa** | Regulatory Portal (`bimabharosa.irdai.gov.in`) | Free government escalation. IRDAI issues tracking token and requires insurer explanation. |
| **3. Insurance Ombudsman** | Office of Insurance Ombudsman | Free and binding on the insurer for claims up to **₹30 Lakhs** across 17 regional centers. |
| **4. Consumer Commission** | District / State Consumer Disputes Redressal Commission | For claims exceeding ₹30 Lakhs, or seeking damages for deficiency of service under Consumer Protection Act, 2019. |

---

## Curated Legal Precedents Database

ClaimSense features built-in case precedents covering key health insurance repudiation grounds in India:

| Category Key | Rejection Ground | Governing Authority & Precedents |
|---|---|---|
| `ACTIVE_TREATMENT` | Hospitalization deemed non-active / diagnostic | Ombudsman DEL-H-051-2022; Medical necessity doctor prerogative |
| `NON_DISCLOSURE` | Pre-existing disease (PED) non-disclosure | Section 45 Insurance Act, 1938 (Moratorium rule); NCDRC landmark rulings |
| `PROPORTIONATE_DEDUCTION` | Room rent capping applied across all bill items | IRDAI Standardized Exclusions; NCDRC room-type fee correlation rulings |
| `24_HOUR_HOSPITALIZATION` | Day-care / less than 24 hours stay | IRDAI Guidelines on Day Care Treatments |
| `WAITING_PERIOD` | 30-day / 2-year specific illness waiting clauses | IRDAI Master Circular on Health Insurance Waiting Periods |
| `MATERNITY_WAITING` | Maternity claim dispute | Ombudsman MUM-H-088-2023 |
| `OTHER` | Arbitrary or vague exclusions | IRDAI Protection of Policyholders' Interests Regulations |

---

## Disclaimer

ClaimSense is an AI-assisted decision-support platform built for informational and empowerment purposes. It does not constitute formal legal representation. While analysis is grounded in published IRDAI regulations and Ombudsman precedents, insurance legal proceedings vary based on specific contract terms. Always consult an IRDAI-licensed insurance advisor or legal counsel for complex or high-value claims.
