# ClaimSense — AI-Powered Health Insurance Claims Intelligence Platform

> **Fighting wrongful insurance rejections with precision legal precedents and AI-generated appeals.**

ClaimSense is a full-stack web application built for Indian health insurance policyholders. It analyzes claim rejection letters, cross-references them against IRDAI regulations and real Ombudsman judgments, evaluates their legal challengeability, and auto-drafts a professionally worded, legally-backed appeal letter — all in under a minute.

---

## 📋 Table of Contents

1. [Problem Statement](#problem-statement)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [How It Works — Step by Step](#how-it-works--step-by-step)
6. [Backend Deep Dive](#backend-deep-dive)
7. [Frontend Deep Dive](#frontend-deep-dive)
8. [API Reference](#api-reference)
9. [Project Structure](#project-structure)
10. [Getting Started (Local Setup)](#getting-started-local-setup)
11. [Environment Variables](#environment-variables)
12. [Escalation Framework](#escalation-framework)
13. [Legal Precedents Database](#legal-precedents-database)
14. [Author](#author)
15. [Disclaimer](#disclaimer)

---

## Problem Statement

Health insurance claim rejections in India are rampant and often wrongful. Insurers exploit complex legal language, hyper-technical policy clauses, and the average policyholder's lack of legal awareness to deny legitimate claims. Most policyholders simply accept the rejection — unaware they have strong legal grounds to challenge it.

**ClaimSense bridges this gap.** It puts the power of an experienced insurance law advisor into the hands of every policyholder.

---

## Key Features

- 📈 **AI Success Probability Score** — A weighted 0-100% score calculating the likelihood of a successful appeal based on precedent strength and regulatory alignment
- ⏱ **Recent Analysis History** — Persistent storage of the last 3 completed analysis reports using `localStorage` for quick reference
- 🔍 **Dual Input Support** — Upload a rejection letter as a PDF, or paste the raw text directly
- 🤖 **AI-Driven Legal Analysis** — Powered by Google Gemini `gemini-2.5-flash`, acting as an experienced Indian insurance legal advisor
- ⚖️ **IRDAI Regulation Cross-Reference** — Automatically checks rejection against 6 key IRDAI regulations
- 📚 **Ombudsman Precedent Engine** — Matches the rejection category to real Ombudsman case judgments
- ✅ **Challengeability Verdict** — Clear `CHALLENGEABLE` or `VALID REJECTION` tag with legal rationale
- ✉️ **Auto-Generated Appeal Letter** — Formal, professional letter citing exact IRDAI laws and Ombudsman precedents
- 📥 **PDF Export** — Download the appeal letter as a formatted PDF using jsPDF
- 🗺️ **4-Step Escalation Roadmap** — Guides users from internal grievance → IRDAI Bima Bharosa → Insurance Ombudsman → Consumer Forum

---

## Tech Stack

### Backend

| Technology | Version | Role |
|---|---|---|
| **Python** | 3.8+ | Core runtime |
| **FastAPI** | Latest | REST API framework |
| **Uvicorn** | Latest | ASGI server |
| **Google Gemini API** | `gemini-2.5-flash` | AI analysis & letter generation |
| **google-generativeai** | Latest | Official Google AI Python SDK |
| **PyMuPDF (`fitz`)** | Latest | PDF text extraction |
| **python-dotenv** | Latest | Environment variable management |
| **python-multipart** | Latest | Multipart form data (file uploads) |
| **Pydantic** | v2 | Request/response data validation |

### Frontend

| Technology | Version | Role |
|---|---|---|
| **React** | 18.x | UI component library |
| **Vite** | 5.x | Build tool & dev server |
| **TailwindCSS** | 3.x | Utility-first styling |
| **PostCSS + Autoprefixer** | Latest | CSS processing pipeline |
| **jsPDF** | 2.x | Client-side PDF generation |
| **Lucide React** | Latest | Icon library |
| **Google Fonts** | — | Sora (display), DM Sans (body), IBM Plex Mono (mono) |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     USER BROWSER                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │         React + Vite Frontend (Port 5173)          │  │
│  │                                                    │  │
│  │  UploadSection → App.jsx → ResultsCard             │  │
│  │                         → AppealLetter             │  │
│  │                         → EscalationGuide          │  │
│  └─────────────────────┬──────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────┘
                         │  HTTP POST /analyze
                         │  (multipart/form-data or JSON)
                         ▼
┌──────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                 │
│                                                          │
│  main.py  →  parser.py       (PDF text extraction)       │
│           →  analyzer.py     (Gemini AI analysis)        │
│           →  precedents_db.py (Legal case lookup)        │
│           →  letter_generator.py (AI letter drafting)    │
│           →  irdai_guidelines.py (Regulation rules)      │
│                                                          │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   Google Gemini API    │
         │  (gemini-2.5-flash)    │
         │                        │
         │  • JSON Analysis Mode  │
         │  • Letter Generation   │
         └────────────────────────┘
```

**Communication:** The frontend and backend are completely decoupled. The React frontend communicates with the FastAPI backend over a standard REST API (`http://localhost:8000`). CORS is fully enabled for local development.

---

## How It Works — Step by Step

### Step 1: Input
The user uploads a PDF rejection letter or pastes the raw rejection text into the web interface.

### Step 2: Text Extraction (`parser.py`)
- If a **PDF** is uploaded: `PyMuPDF (fitz)` extracts all text from every page of the PDF into a raw string.
- If **text** is pasted: it is taken as-is.
- In both cases, `clean_text()` normalizes whitespace and removes noise using regex.

### Step 3: AI Legal Analysis (`analyzer.py`)
- The cleaned text is sent to **Google Gemini `gemini-2.5-flash`** via the `google-generativeai` SDK.
- Gemini is prompted to act as *"an expert Indian health insurance legal advisor"* with a **highly structured JSON-only response** enforced via `response_mime_type="application/json"`.
- The prompt injects the full text of IRDAI regulations (`irdai_guidelines.py`) into context.
- Gemini returns a structured JSON containing:
  - `rejection_category` — Classifies into one of 6 predefined legal categories
  - `rejection_reason` — One-sentence summary of the insurer's stated reason
  - `plain_explanation` — 2-3 sentence plain-English explanation for the policyholder
  - `is_challengeable` — `true` or `false` verdict
  - `success_probability` — Integer (0-100) representing the chance of winning an appeal
  - `probability_reasoning` — One-sentence explanation for the success score based on clinical and legal factors
  - `legal_basis` — Cite of the specific law or clause that supports or refutes the rejection
  - `confidence` — `HIGH / MEDIUM / LOW`

### Step 4: Precedent Lookup (`precedents_db.py`)
- The `rejection_category` from Gemini is used to look up a matching entry in `PRECEDENTS_DB`.
- This is a **curated database of real Indian Insurance Ombudsman case judgments** and statutory citations covering:
  - Unnecessary hospitalization disputes
  - Non-disclosure / pre-existing disease (PED) rejections
  - Waiting period violations
  - Less-than-24-hours hospitalization (day care)
  - Maternity claim waiting periods
  - General unfair claim practices
- The matched precedent (case citation + ruling text) is appended to the analysis response.

### Step 5: AI Appeal Letter Generation (`letter_generator.py`)
- **Only triggered if `is_challengeable = true`.**
- Sends a second request to **Gemini `gemini-2.5-flash`**, instructing it to write a formal legal appeal letter.
- The prompt requires the letter to:
  - Address the **Grievance Officer** of the insurer
  - Reference **IRDAI Grievance Redressal Guidelines 2015**
  - Cite the **specific IRDAI regulation** that supports the appeal
  - Include the matched **Ombudsman precedent** (case reference + ruling)
  - Demand resolution within **15 days** (as per IRDAI mandate)
  - Warn of escalation to the **Insurance Ombudsman under Rule 14 of Insurance Ombudsman Rules, 2017**
  - List required supporting documents

### Step 6: Response Delivery & Dashboard (`main.py`)
- The backend consolidates everything into a single JSON response:
  - Full analysis result
  - Challengeability verdict with legal basis
  - The complete appeal letter text
  - The matching Ombudsman precedent
  - The AI Success Probability Score and detailed reasoning
  - A 4-step escalation roadmap
- The React frontend renders the **Claim Analysis Dashboard** showing a visual **Success Meter**, the verdict, legal explanation, precedent card, appeal letter preview, and escalation guide.
- **Persistence:** Successful analyses are automatically pushed to a local history array (limited to 3 items) and stored in the browser's `localStorage`.

### Step 7: PDF Export (Frontend — `jsPDF`)
- The user can click "Download as PDF" to export the generated appeal letter as a formatted PDF document directly in the browser — no server needed for this step.

---

## Backend Deep Dive

### `main.py` — FastAPI Application Entry Point
- Defines the REST API with two endpoints: `/analyze` (multipart form with optional PDF + text) and `/analyze/text` (JSON-only for text input).
- CORS middleware configured with `allow_origins=["*"]` for development.
- Orchestrates the full pipeline: parse → analyze → lookup precedent → generate letter → return.
- Also hardcodes a 4-step escalation guide in the response.

### `parser.py` — PDF & Text Processing
- `extract_text_from_pdf(file_bytes)`: Opens a PDF from raw bytes using `fitz.open()`, iterates over all pages, and concatenates `page.get_text()` output.
- `clean_text(raw_text)`: Uses regex to collapse all whitespace sequences into single spaces.

### `analyzer.py` — Gemini AI Analysis Engine
- Configures `google-generativeai` with the `GEMINI_API_KEY` from environment.
- Uses `GenerativeModel('gemini-2.5-flash')` with `response_mime_type="application/json"` enforced in `GenerationConfig` to guarantee structured JSON output.
- Includes two-level error handling: primary JSON parse → fallback markdown code-block strip → final graceful error dict.
- Calls `get_precedent()` to enrich the result with the matching legal case.

### `letter_generator.py` — AI Appeal Letter Drafting
- Uses a second Gemini call with a detailed letter-writing prompt.
- Conditionally injects the Ombudsman precedent citation as a `CRITICAL REQUIREMENT` in the prompt if one is matched.
- Returns raw letter text (no extra formatting), stripping any trailing whitespace.

### `precedents_db.py` — Ombudsman Precedent Database
- A Python dictionary serving as an in-memory curated legal knowledge base.
- 6 precedent categories: `ACTIVE_TREATMENT`, `NON_DISCLOSURE`, `WAITING_PERIOD`, `24_HOUR_HOSPITALIZATION`, `MATERNITY_WAITING`, `OTHER`.
- Each entry has: `title`, `citation` (statute or case reference), and `text` (ruling summary).

### `irdai_guidelines.py` — IRDAI Regulations Context
- A multiline string constant injected into every Gemini analysis prompt.
- Covers 6 core IRDAI regulations on: pre-existing conditions, non-disclosure moratorium, medical necessity, waiting period calculation, vague exclusions, and sub-limits.

---

## Frontend Deep Dive

### `App.jsx` — Main Application Shell
- Manages global state: `analysisResult`, `isLoading`, `error`, `loadingStep`.
- Renders three states: (1) Landing hero + upload form, (2) Loading spinner with animated step messages, (3) Full analysis dashboard.
- **History Logic:** Manages a `history` state populated from `localStorage`. When a new analysis completes, it prepends the result to history, ensures no duplicate rejection reasons, and caps the list at 3 items.
- Renders a **"Recent Analysis Reports"** section on the home page if any history exists, allowing users to re-open reports instantly.
- Uses animated loading messages that update every 1.5s to communicate backend progress to the user.

### `UploadSection.jsx` — Input Interface
- Handles both **PDF drag-and-drop/file-picker** and **text paste** modes.
- Validates file type (PDF only) and minimum text length before submission.
- Sends `multipart/form-data` POST to `/analyze` using `fetch`.

### `ResultsCard.jsx` — Analysis Display
- Renders the challengeability verdict with a color badge (`CHALLENGEABLE` in green / `VALID REJECTION` in red).
- **Success Meter:** A semi-circular SVG gauge visualizing the `success_probability` (Green > 70%, Yellow 40-70%, Red < 40%).
- Displays the `probability_reasoning`, rejection reason, plain English explanation, legal basis, and confidence level.
- Displays the matched Ombudsman precedent card with citation and ruling summary.

### `AppealLetter.jsx` — Letter Preview & Export
- Shows the full generated appeal letter in a scrollable text area.
- "Download as PDF" button triggers `jsPDF` to generate a formatted PDF client-side.

### `EscalationGuide.jsx` — Escalation Roadmap
- Renders the 4-step escalation path (Internal Grievance → IRDAI Bima Bharosa → Insurance Ombudsman → Consumer Forum) as a visual step-by-step guide.

---

## API Reference

### `POST /analyze`

Analyzes a health insurance rejection letter.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File (PDF) | Optional* | Rejection letter as PDF |
| `text` | String | Optional* | Raw rejection letter text |

> *One of `file` or `text` must be provided.

**Response (200 OK):**
```json
{
  "rejection_reason": "string",
  "plain_explanation": "string",
  "is_challengeable": true,
  "success_probability": 85,
  "probability_reasoning": "string",
  "legal_basis": "string",
  "appeal_letter": "string",
  "escalation_steps": [
    { "title": "string", "desc": "string" }
  ],
  "precedent_data": {
    "title": "string",
    "citation": "string",
    "text": "string"
  }
}
```

### `POST /analyze/text`

Text-only JSON alternative to `/analyze`.

**Content-Type:** `application/json`

```json
{ "text": "Full rejection letter text here..." }
```

**Response:** Same structure as `/analyze`.

---

## Project Structure

```
claimsense/
├── README.md
│
├── backend/
│   ├── main.py              # FastAPI app, API endpoints, pipeline orchestrator
│   ├── analyzer.py          # Gemini AI analysis engine
│   ├── letter_generator.py  # Gemini AI appeal letter drafting
│   ├── parser.py            # PDF extraction (PyMuPDF) & text cleaning
│   ├── precedents_db.py     # Curated Ombudsman legal precedents database
│   ├── irdai_guidelines.py  # IRDAI regulation rules (injected into AI prompt)
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (GEMINI_API_KEY)
│   └── venv/                # Python virtual environment (not committed)
│
└── frontend/
    ├── index.html           # Entry HTML
    ├── package.json         # Node.js dependencies
    ├── vite.config.js       # Vite build configuration
    ├── tailwind.config.js   # TailwindCSS theme (custom colors, fonts, shadows)
    ├── postcss.config.js    # PostCSS pipeline config
    └── src/
        ├── main.jsx         # React DOM entry point
        ├── App.jsx          # Main app shell, state management, routing
        ├── index.css        # Global styles, design tokens, CSS utilities
        └── components/
            ├── UploadSection.jsx   # PDF upload + text input form
            ├── ResultsCard.jsx     # Analysis verdict display
            ├── AppealLetter.jsx    # Letter viewer + jsPDF export
            └── EscalationGuide.jsx # 4-step escalation roadmap
```

---

## Getting Started (Local Setup)

### Prerequisites

- Python **3.8+**
- Node.js **18+** and npm
- A free **Google Gemini API Key** → [Get one here](https://aistudio.google.com/app/apikey)

---

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd claimsense
```

---

### Step 2: Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (Command Prompt):
.\venv\Scripts\activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Mac/Linux:
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

#### Configure your API Key

Create a `.env` file in the `backend/` folder (or edit the existing one):

```
GEMINI_API_KEY=your_actual_api_key_here
```

#### Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

The FastAPI backend will be live at: **`http://localhost:8000`**

You can explore the auto-generated API docs at: **`http://localhost:8000/docs`**

---

### Step 3: Frontend Setup

Open a **new terminal** (keep the backend running):

```bash
# Navigate to the frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

The React frontend will be live at: **`http://localhost:5173`**

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` | Your Google Gemini API key. Required for all AI functions. |

---

## Escalation Framework

When a rejection is `CHALLENGEABLE`, ClaimSense provides a 4-step legal escalation roadmap:

| Step | Action | Details |
|---|---|---|
| **1** | **Internal Grievance** | Write to the insurer's Grievance Officer. They have a **15-day mandatory response window** under IRDAI rules. |
| **2** | **IRDAI Bima Bharosa** | File a complaint online at [bimabharosa.irdai.gov.in](https://bimabharosa.irdai.gov.in). Free. Takes 2–4 weeks. |
| **3** | **Insurance Ombudsman** | Completely free. Binding on insurer for claims **up to ₹30 lakhs**. 17 regional offices across India. |
| **4** | **Consumer Forum** | For claims above ₹30 lakhs or if all other escalations fail. |

---

## Legal Precedents Database

ClaimSense includes a curated database of real Indian Ombudsman judgments and statutory citations:

| Category Key | Rejection Type | Legal Authority |
|---|---|---|
| `ACTIVE_TREATMENT` | Unnecessary hospitalization / lack of active treatment | Ombudsman Case Ref: DEL-H-051-2022 (Delhi) |
| `NON_DISCLOSURE` | Non-disclosure of pre-existing disease | Section 45, Insurance Act, 1938 |
| `WAITING_PERIOD` | General waiting period (30-day / 2-year) | IRDAI Master Circular on Waiting Periods (2020) |
| `24_HOUR_HOSPITALIZATION` | Less than 24 hours hospitalization | IRDAI Guidelines on Day Care Procedures |
| `MATERNITY_WAITING` | Maternity waiting period rejection | Ombudsman Case Ref: MUM-H-088-2023 |
| `OTHER` | General unfair claim settlement | IRDAI (Protection of Policyholders' Interests) Regulations, 2017 |

---

## Author

**Aarush Goel**
* **GitHub:** [@aarushgoel025](https://github.com/aarushgoel025)
* **LinkedIn:** [Aarush Goel](https://linkedin.com/in/aarush-goel-05129028a)
---
*If you like this project, please consider giving it a ⭐ on GitHub!*

## Disclaimer

ClaimSense is an AI-assisted decision-support tool for informational purposes only. It does not constitute legal advice. The analysis and letters generated are based on publicly available IRDAI regulations and curated Ombudsman precedents.

For complex legal disputes, high-value claims, or cases involving fraud allegations, please consult a qualified **insurance lawyer** or **consumer rights advocate**.

The IRDAI Bima Bharosa portal and Insurance Ombudsman offices are free, official government resources available to all Indian policyholders.

---

*Built with ❤️ for Indian health insurance consumers.*

