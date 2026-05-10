// ---------------------------------------------------------------------------
// Medication review prep — types
// ---------------------------------------------------------------------------
// See docs/medication-review-prep-plan.md and
// docs/medication-review-regulatory-rationale.md for the design rationale.
//
// This module is intentionally isolated from src/domain/types.ts (the
// supplement engine's AnswerMap). The medication list is free-text and
// must NOT be read by the supplement engine — it expands the supplement
// engine's regulatory surface area without intent.
// ---------------------------------------------------------------------------

export type MedicationClassId =
  | "ppi"
  | "h2_blocker"
  | "benzodiazepine"
  | "z_drug"
  | "ssri"
  | "snri"
  | "tricyclic_antidepressant"
  | "antipsychotic"
  | "anticholinergic"
  | "first_gen_antihistamine"
  | "opioid"
  | "nsaid"
  | "anticoagulant"
  | "antiplatelet"
  | "statin"
  | "ace_inhibitor"
  | "arb"
  | "beta_blocker"
  | "calcium_channel_blocker"
  | "diuretic_loop"
  | "diuretic_thiazide"
  | "sulfonylurea"
  | "metformin"
  | "insulin"
  | "levothyroxine"
  | "bisphosphonate"
  | "corticosteroid_systemic"
  | "antiepileptic"
  | "muscle_relaxant"
  | "alpha_blocker"
  | "anticholinergic_overactive_bladder"
  | "gabapentinoid"
  | "antibiotic_general"
  | "ssri_or_snri" // virtual class used by some rules
  // ---- "Recognised but no class-level rules" classes ---------------
  // These exist so the drug is recognised on the printed sheet without
  // triggering class-level prompts. Each is genuinely low-yield for
  // class-level review prompting at the layperson level — the
  // pharmacist will review them anyway as part of any structured
  // medication review.
  | "paracetamol"
  | "second_gen_antihistamine"
  | "decongestant"
  | "cough_suppressant"
  | "expectorant"
  | "antidiarrhoeal"
  | "laxative"
  | "melatonin"
  | "topical_steroid"
  | "topical_antifungal"
  | "antacid"
  | "inhaled_bronchodilator"
  | "inhaled_steroid"
  | "nasal_steroid"
  | "ophthalmic"
  | "vitamin_or_mineral";

export type SourceId =
  | "beers-2023"
  | "stopp-v3"
  | "nhs-smr"
  | "nhs-deprescribing"
  | "nice"
  | "nice-ng196"
  | "nice-ng28"
  | "nice-cg182"
  | "nice-ng136"
  | "nice-cg181"
  | "ata-2014-hypothyroidism"
  | "bnf-pregnancy"
  | "general-practice";

export interface SourceCitation {
  id: SourceId;
  label: string;
  url?: string;
}

export interface MedicationClass {
  id: MedicationClassId;
  label: string;       // Human label shown in the class-confirmation UI
  shortLabel: string;  // Compact label for inline pills
  description: string; // One-liner explaining what this class is, in lay terms
  sources: SourceCitation[]; // Where the class-level review prompts come from
}

// A single user-entered medication. Free-text fields throughout.
// matchedClassId is set after the user CONFIRMS the catalog match;
// `classConfirmed` distinguishes a confirmed assignment from an unconfirmed
// suggestion or no match at all.
export interface Medication {
  id: string;                  // local-only UUID
  name: string;                // free-text, what the user typed
  kind: "prescription" | "otc" | "supplement";
  matchedClassId?: MedicationClassId;
  classConfirmed: boolean;     // user confirmed our class suggestion
  dose?: string;               // free-text, e.g. "20 mg"
  frequency?: string;          // free-text, e.g. "once daily"
  timeOfDay?: string;          // free-text, e.g. "morning, with food"
  prescriber?: string;         // free-text, e.g. "GP", "Dr Smith", "self"
  startedApprox?: string;      // free-text, e.g. "2019", "after surgery"
  perceivedReason?: string;    // free-text, "what you think it's for"
  stillKnowWhy?: "yes" | "no" | "unsure";
}

export type SymptomId =
  | "dizziness"
  | "falls"
  | "dry_mouth"
  | "constipation"
  | "confusion"
  | "drowsiness"
  | "bruising"
  | "frequent_urination"
  | "low_mood"
  | "poor_sleep"
  | "persistent_cough"
  | "swollen_ankles"
  | "muscle_aches"
  | "appetite_loss";

export interface Symptom {
  id: SymptomId;
  label: string;
  hint: string; // shown under the checkbox; non-diagnostic
}

export type ContextFlagId =
  | "pregnant_or_planning"
  | "breastfeeding"
  | "recent_hospital_discharge"
  | "multiple_prescribers"
  | "five_or_more_meds"
  | "kidney_or_liver_disease"
  | "over_75";

export interface ContextFlag {
  id: ContextFlagId;
  label: string;
  hint: string;
}

export type PromptTier = "important" | "recommended" | "consider";

export interface ReviewPrompt {
  id: string;
  tier: PromptTier;
  question: string;          // The exact question to ask
  why: string;               // One-line rationale shown to the user
  source: SourceCitation;
  triggeredBy: {
    medicationIds: string[];
    classIds: MedicationClassId[];
    symptomIds: SymptomId[];
    contextIds: ContextFlagId[];
  };
}

export interface ReviewSheet {
  hasContent: boolean;
  prescription: Medication[];
  otcAndSupplements: Medication[];
  symptoms: Symptom[];
  contextFlags: ContextFlag[];
  prompts: ReviewPrompt[];
  pediatricNotice?: string;
  generatedAt: number; // ms epoch
}

// Persisted shape stored in localStorage. Versioned.
export interface MedicationStoreV1 {
  version: 1;
  medications: Medication[];
  symptomIds: SymptomId[];
  contextFlagIds: ContextFlagId[];
  updatedAt: number;
}

export const MEDICATION_STORE_VERSION = 1 as const;
