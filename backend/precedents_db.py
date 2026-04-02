PRECEDENTS_DB = {
    "ACTIVE_TREATMENT": {
        "title": "Unnecessary Hospitalization / Lack of Active Line of Treatment",
        "citation": "Ombudsman Case Ref: DEL-H-051-2022 (Delhi)",
        "text": "The Ombudsman ruled in favor of the policyholder, stating that the Treating Doctor is the ultimate authority on whether hospitalization was necessary. The insurer cannot arbitrarily reject a claim stating 'only oral medication was given' if the patient's condition required supervised medical observation."
    },
    "NON_DISCLOSURE": {
        "title": "Non-Disclosure of Pre-Existing Disease (PED)",
        "citation": "Section 45 of the Insurance Act, 1938 & Landmark Supreme Court Rulings",
        "text": "According to Section 45, no policy can be called into question on grounds of misstatement after 3 years. Furthermore, non-disclosure of common ailments (like mild hypertension or diabetes) that have no direct nexus to the current hospitalization (e.g., Dengue) cannot be grounds for claim repudiation."
    },
    "WAITING_PERIOD": {
        "title": "Rejection under General Waiting Period (30 Days / 2 Years)",
        "citation": "IRDAI Master Circular on Waiting Periods (2020)",
        "text": "As per IRDAI guidelines, the standard 30-day waiting period does not apply to hospitalization arising out of sudden accidents or acute emergencies that could not have been foreseen. If the condition was an acute medical emergency, the waiting period exception must apply."
    },
    "24_HOUR_HOSPITALIZATION": {
        "title": "Less than 24 Hours Hospitalization",
        "citation": "IRDAI Guidelines on Day Care Procedures",
        "text": "IRDAI mandates that insurers must cover advanced medical procedures that require less than 24 hours of hospitalization due to technological advancements. The arbitrary 24-hour rule is void if the procedure is a standard daylight surgery or necessitates specialized hospital equipment."
    },
    "OTHER": {
        "title": "General Unfair Claim Settlement",
        "citation": "IRDAI Protection of Policyholders' Interests Regulations, 2017",
        "text": "The insurer is bound by the IRDAI (Protection of Policyholders' Interests) Regulations, 2017, which mandates fair and transparent claim settlement practices without relying on hyper-technicalities to deny legitimate claims."
    },
    "MATERNITY_WAITING": {
        "title": "Maternity Waiting Period Rejection",
        "citation": "Ombudsman Case Ref: MUM-H-088-2023",
        "text": "The insurer cannot reject a maternity claim if the policyholder has completed the continuous 24-month waiting period before the pregnancy was conceived."
    },
    "CONSUMABLES_DEDUCTION": {
        "title": "Deduction of Non-Payable Items (Consumables/PPE)",
        "citation": "IRDAI Guidelines on Standardization of Health Insurance (2020)",
        "text": "Post-COVID, IRDAI has mandated that essential consumables (gloves, PPE, nebulizer kits) cannot be arbitrarily deducted if they are part of a recognized medical treatment protocol. The insurer must provide a transparent list of non-payable items and cannot vary them without medical justification."
    },
    "DELAYED_INTIMATION": {
        "title": "Delay in Intimation / Late Claim Filing",
        "citation": "IRDAI Circular: IRDA/HLT/MISC/CIR/216/09/2011 & Supreme Court Rulings",
        "text": "The Supreme Court and IRDAI have unequivocally ruled that genuine claims cannot be denied solely due to technical delays in intimation (e.g., informing within 24-48 hours). If a valid reason exists—such as a medical emergency or trauma—the insurer is legally bound to process the claim on its merits."
    },
    "DAYCARE_MISCLASSIFICATION": {
        "title": "Daycare Procedure Misclassification",
        "citation": "IRDAI Health Insurance Regulations & Standardized Definitions",
        "text": "Insurers cannot use the '24-hour hospitalization rule' to reject modern daylight surgeries (Cataract, Dialysis, Lithotripsy). If a procedure is listed in the 'Daycare Procedure' list of the policy, it must be covered regardless of the hours of hospital admission."
    },
    "EXCLUSION_MISINTERPRETATION": {
        "title": "Misinterpretation of Exclusion Clauses (Cosmetic vs. Reconstructive)",
        "citation": "Ombudsman Case Ref: KOL-H-012-2324 (Kolkata)",
        "text": "Treatments that are medically necessary to restore bodily function or result from an underlying pathology cannot be arbitrarily classified as 'Cosmetic'. Reconstructive surgery is distinct from aesthetic procedures and is generally covered under Indian health insurance mandates."
    },
    "POLICY_LAPSE_GRACE": {
        "title": "Policy Lapse and Renewal Grace Period",
        "citation": "IRDAI (Health Insurance) Regulations, 2016",
        "text": "Policyholders are entitled to a mandatory 30-day grace period for renewal. If renewed within this period, all continuity benefits (waiting period credits, etc.) are legally preserved. The insurer cannot reset waiting period clocks by treating a grace-period renewal as a 'Fresh Policy'."
    }

}

def get_precedent(category: str) -> dict:
    return PRECEDENTS_DB.get(category, PRECEDENTS_DB["OTHER"])
