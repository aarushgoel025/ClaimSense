# ── Document Checklist Engine ─────────────────────────────────────────
# Maps rejection categories to the specific supporting documents
# the policyholder should attach when submitting their appeal.
#
# Structure:
#   BASE_DOCUMENTS     → Always required regardless of rejection type
#   CATEGORY_DOCUMENTS → Extra documents specific to a rejection category
# ──────────────────────────────────────────────────────────────────────

BASE_DOCUMENTS = [
    {
        "name": "Claim Rejection Letter (Original Copy)",
        "why": "Proof of the insurer's stated reason for denial — the foundation of your appeal.",
        "priority": "mandatory"
    },
    {
        "name": "Health Insurance Policy Document",
        "why": "Needed to verify policy terms, coverage limits, exclusions, and waiting period clauses.",
        "priority": "mandatory"
    },
    {
        "name": "Hospital Discharge Summary",
        "why": "Medical evidence of diagnosis, treatment given, and duration of hospitalization.",
        "priority": "mandatory"
    },
    {
        "name": "All Hospital Bills & Invoices (Itemized)",
        "why": "Proof of expenses incurred — must be itemized, not just a lump sum receipt.",
        "priority": "mandatory"
    },
    {
        "name": "Prescription & Doctor's Notes",
        "why": "Shows the treating doctor's medical reasoning for the treatment or hospitalization.",
        "priority": "mandatory"
    },
    {
        "name": "Copy of Your Appeal Letter",
        "why": "Keep a signed copy of the appeal letter you are submitting for your own records.",
        "priority": "recommended"
    },
    {
        "name": "Policy Premium Payment Receipts",
        "why": "Proves continuous coverage and timely premium payment — essential if lapse is alleged.",
        "priority": "recommended"
    }
]

CATEGORY_DOCUMENTS = {
    "NON_DISCLOSURE": [
        {"name": "Previous Medical Records (Last 4 Years)", "why": "Proves the condition was not diagnosed or treated before policy inception.", "priority": "mandatory"},
        {"name": "Doctor's Certificate of Current Health Status", "why": "Independent medical opinion that the current ailment has no nexus to any undisclosed condition.", "priority": "recommended"}
    ],
    "ACTIVE_TREATMENT": [
        {"name": "Treating Doctor's Letter Justifying Hospitalization", "why": "A letter from the treating doctor stating why hospital admission (not just OPD) was medically necessary.", "priority": "mandatory"},
        {"name": "Nursing Charts / Vitals Record", "why": "Proves active medical monitoring was happening during the hospital stay.", "priority": "recommended"}
    ],
    "WAITING_PERIOD": [
        {"name": "Policy Start Date Certificate / Welcome Letter", "why": "Official proof of policy commencement date to verify waiting period calculation.", "priority": "mandatory"},
        {"name": "Previous Policy Certificates (if ported)", "why": "If ported from another insurer, proves continuity and waiting period already served.", "priority": "mandatory"}
    ],
    "24_HOUR_HOSPITALIZATION": [
        {"name": "Doctor's Certificate Confirming Daycare Procedure", "why": "Medical confirmation that the procedure is a recognized daycare surgery requiring <24 hours.", "priority": "mandatory"},
        {"name": "IRDAI Daycare Procedure List Reference", "why": "Reference to the standardized IRDAI daycare procedure list showing your procedure is included.", "priority": "recommended"}
    ],
    "DELAYED_INTIMATION": [
        {"name": "Proof of Emergency / ICU Admission", "why": "Demonstrates the policyholder was in a medical emergency and physically unable to intimate earlier.", "priority": "mandatory"},
        {"name": "Any Communication Records with Insurer/TPA", "why": "SMS, email, or call logs showing you attempted to contact the insurer as soon as possible.", "priority": "recommended"}
    ],
    "CONSUMABLES_DEDUCTION": [
        {"name": "Itemized Hospital Bill with Consumables Breakdown", "why": "Shows exactly which consumables were used and their individual costs.", "priority": "mandatory"},
        {"name": "Doctor's Note on Medical Necessity of Consumables", "why": "Confirmation that items like PPE, gloves, or nebulizer kits were part of the treatment protocol.", "priority": "recommended"}
    ],
    "PRE_EXISTING_DEFINITION": [
        {"name": "Medical Records from Last 48 Months", "why": "Proves no diagnosis or treatment for the alleged pre-existing condition in the defined 48-month window.", "priority": "mandatory"},
        {"name": "Independent Doctor's Certificate", "why": "A second medical opinion confirming the condition was not pre-existing.", "priority": "recommended"}
    ],
    "EXCLUSION_MISINTERPRETATION": [
        {"name": "Treating Doctor's Letter on Medical Necessity", "why": "Confirms the procedure was medically necessary, not cosmetic or elective.", "priority": "mandatory"},
        {"name": "Medical Literature / Guidelines Reference", "why": "Published medical evidence supporting that the treatment is therapeutic, not aesthetic.", "priority": "recommended"}
    ],
    "MENTAL_HEALTH": [
        {"name": "Psychiatrist's Treatment Record", "why": "Official psychiatric diagnosis and treatment plan from a registered mental health professional.", "priority": "mandatory"},
        {"name": "Mental Healthcare Act 2017 Reference", "why": "Citation of Section 21(4) mandating insurance parity for mental health conditions.", "priority": "recommended"}
    ],
    "PORTABILITY": [
        {"name": "Previous Insurer's Policy Certificate", "why": "Proves policy continuity and waiting period credits accrued with the previous insurer.", "priority": "mandatory"},
        {"name": "Portability Approval Letter", "why": "The new insurer's written acceptance of the ported policy with continuity benefits.", "priority": "mandatory"}
    ],
    "DAYCARE_MISCLASSIFICATION": [
        {"name": "Doctor's Certificate Confirming Daycare Procedure", "why": "Medical confirmation that the procedure is a recognized daycare surgery.", "priority": "mandatory"},
        {"name": "Policy Schedule Showing Daycare Coverage", "why": "Proof that the specific procedure appears in the policy's daycare procedure list.", "priority": "recommended"}
    ],
    "PROPORTIONATE_DEDUCTION": [
        {"name": "Detailed Room Category Invoice", "why": "Shows the actual room category used vs. the entitled room category under the policy.", "priority": "mandatory"},
        {"name": "Breakup of Deducted Items", "why": "Insurer's settlement sheet showing which items were proportionally reduced and by how much.", "priority": "mandatory"}
    ],
    "CASHLESS_REJECTION": [
        {"name": "Cashless Request Form (Copy)", "why": "Proof that cashless authorization was requested at the network hospital.", "priority": "mandatory"},
        {"name": "Hospital's Confirmation of Network Status", "why": "Proves the hospital was part of the insurer's network at the time of admission.", "priority": "recommended"}
    ],
    "SENIOR_RENEWAL_DENIAL": [
        {"name": "All Previous Years' Premium Receipts", "why": "Proves continuous, unbroken policy renewal history.", "priority": "mandatory"},
        {"name": "Renewal Reminder / Communication from Insurer", "why": "Any communication from the insurer about renewal to establish their awareness of the policy.", "priority": "recommended"}
    ],
    "CLAIM_SETTLEMENT_DELAY": [
        {"name": "All Claim Submission Receipts with Dates", "why": "Proof of when you submitted the claim and all requested documents.", "priority": "mandatory"},
        {"name": "Follow-up Communication Records", "why": "Emails, letters, or call logs showing your follow-ups and the insurer's delays.", "priority": "mandatory"}
    ],
    "AMBULANCE_CHARGES": [
        {"name": "Ambulance Service Receipt / Invoice", "why": "Proof of ambulance charges with date, time, pickup and drop locations.", "priority": "mandatory"},
        {"name": "Emergency Admission Record", "why": "Hospital's record confirming the patient arrived via emergency ambulance.", "priority": "recommended"}
    ],
    "TPA_WRONGFUL_REJECTION": [
        {"name": "TPA Rejection Communication (Original)", "why": "The TPA's written rejection with stated reasons — evidence of the wrongful decision.", "priority": "mandatory"},
        {"name": "Direct Communication with Insurer (if any)", "why": "Any correspondence directly with the insurer (not TPA) regarding this claim.", "priority": "recommended"}
    ],
    "MORATORIUM_PERIOD": [
        {"name": "Policy Renewal Receipts for 8+ Years", "why": "Proof of continuous coverage beyond the 8-year moratorium period.", "priority": "mandatory"},
        {"name": "Policy Inception Certificate", "why": "Official document showing the original policy start date.", "priority": "mandatory"}
    ],
    "MATERNITY_WAITING": [
        {"name": "Policy Inception Certificate", "why": "Proof that the policy was active for 24+ months before conception.", "priority": "mandatory"},
        {"name": "Doctor's Certificate with Expected Delivery Date", "why": "Medical proof of conception date to verify it falls after the waiting period.", "priority": "mandatory"}
    ],
    "POLICY_LAPSE_GRACE": [
        {"name": "Premium Payment Receipt (within Grace Period)", "why": "Proof that the renewal was paid within the 30-day grace period.", "priority": "mandatory"},
        {"name": "Bank Transaction Statement", "why": "Independent bank proof of the payment date in case the insurer disputes the receipt.", "priority": "recommended"}
    ]
}


def get_document_checklist(rejection_category: str, is_challengeable: bool) -> list:
    """
    Returns the complete document checklist for a given rejection category.
    Base documents are always included. Category-specific extras are appended
    if a matching category exists in our mapping.
    Returns empty list if the rejection is valid (not challengeable).
    """
    if not is_challengeable:
        return []

    checklist = list(BASE_DOCUMENTS)  # Copy base docs

    # Add category-specific documents if available
    category_extras = CATEGORY_DOCUMENTS.get(rejection_category, [])
    checklist.extend(category_extras)

    return checklist
