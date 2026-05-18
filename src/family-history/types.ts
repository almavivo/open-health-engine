// ----------------------------------------------------------------------------
// Family Health History — shared types.
//
// All publicly-exported types live here so that consumers can construct
// Relative / FamilyHistoryAnswers values and read FamilyPatternSignal /
// FamilyHistoryReport outputs without reaching into other sub-modules.
//
// This module is intentionally type-only: no functions, no constants except
// EMPTY_FAMILY_HISTORY (which is a useful starting point for any consumer
// building up an answer object incrementally).
// ----------------------------------------------------------------------------

export type Confidence =
  | "medical_record"
  | "family_told"
  | "best_guess"
  | "unknown";

export type Side = "paternal" | "maternal" | "self" | "shared";
// "shared" is used for parents, siblings, children — i.e. relatives whose
// lineage doesn't reduce to one grandparent side. Note that parents MAY
// also carry "paternal" or "maternal" so that cluster math (HBOC / Lynch)
// can combine a parent with same-side grandparents and aunts/uncles.

export type Relationship =
  // first-degree
  | "parent" | "sibling" | "child"
  // second-degree
  | "grandparent" | "aunt_uncle" | "half_sibling" | "niece_nephew"
  // third-degree
  | "great_grandparent" | "cousin"
  // self
  | "self";

export type SexAtBirth = "male" | "female" | "unknown";

export type RelativeStatus =
  | "alive"
  | "deceased"
  | "unknown"
  | "estranged"
  | "adopted_out_unknown";

export type SmokingHistory = "current" | "former" | "never" | "unknown";

// ----------------------------------------------------------------------------
// Cause-of-death picklist (grouped, plain language; ICD-10 chapters internally)
// ----------------------------------------------------------------------------

export type CauseOfDeath =
  // Cardiovascular
  | "cv_heart_attack"
  | "cv_sudden_cardiac"
  | "cv_heart_failure"
  | "cv_stroke_ischemic"
  | "cv_stroke_hemorrhagic"
  | "cv_stroke_unknown"
  | "cv_aortic_thoracic" // thoracic aortic aneurysm / dissection
  | "cv_aortic_abdominal"
  | "cv_aortic_unknown_location"
  | "cv_pulmonary_embolism"
  | "cv_other"
  // Cancer (paired with a CancerType in `diagnoses` or `causeOfDeathCancerType`)
  | "cancer"
  | "cancer_unknown_type"
  // Metabolic / endocrine
  | "endo_t1d_complications"
  | "endo_t2d_complications"
  | "endo_other"
  // Respiratory
  | "resp_copd"
  | "resp_pneumonia"
  | "resp_other"
  // Neurological
  | "neuro_alzheimers"
  | "neuro_other_dementia"
  | "neuro_parkinsons"
  | "neuro_als"
  | "neuro_huntington"
  | "neuro_other"
  // Liver / kidney
  | "liver_cirrhosis"
  | "kidney_failure"
  | "hepatorenal_other"
  // Infectious
  | "inf_sepsis"
  | "inf_covid"
  | "inf_tb"
  | "inf_hiv"
  | "inf_other"
  // External causes
  | "ext_accident"
  | "ext_suicide"
  | "ext_homicide"
  | "ext_overdose"
  // Other / unclear
  | "natural_old_age"
  | "childbirth_related"
  | "other_specify"
  | "unknown";

export type CancerType =
  | "breast"
  | "ovarian"
  | "uterine_endometrial"
  | "cervical"
  | "prostate"
  | "colorectal"
  | "stomach_gastric"
  | "pancreatic"
  | "liver"
  | "lung"
  | "kidney_renal"
  | "bladder"
  | "thyroid"
  | "brain_cns"
  | "melanoma"
  | "leukemia"
  | "lymphoma"
  | "multiple_myeloma"
  | "sarcoma"
  | "small_bowel"
  | "urothelial"
  | "biliary"
  | "other"
  | "unknown_type";

// ----------------------------------------------------------------------------
// Diagnoses-during-life picklist
//
// Independent of cause of death — a relative who had breast cancer at 45
// but died in an accident at 70 is still a hereditary cancer signal. Storing
// these separately is deliberate; do not collapse them.
// ----------------------------------------------------------------------------

export type DiagnosisCondition =
  | "cancer" // requires cancerType
  | "myocardial_infarction"
  | "stroke"
  | "thoracic_aortic_aneurysm_or_dissection"
  | "abdominal_aortic_aneurysm"
  | "type_1_diabetes"
  | "type_2_diabetes"
  | "very_high_cholesterol_young"
  | "familial_hypercholesterolemia_known"
  | "early_onset_dementia"
  | "alzheimers"
  | "parkinsons"
  | "huntingtons"
  | "polycystic_kidney_disease"
  | "hereditary_haemochromatosis"
  | "cardiomyopathy"
  | "long_qt_or_arrhythmia_syndrome"
  | "advanced_adenoma_or_polyp"
  | "other";

export interface DiagnosisDuringLife {
  id: string;
  condition: DiagnosisCondition;
  cancerType?: CancerType; // when condition === "cancer"
  ageAtDx: number | "unknown";
  confidence: Confidence;
  freeText?: string; // for condition === "other"
}

export interface Relative {
  id: string;
  relationship: Relationship;
  side: Side;
  sexAtBirth: SexAtBirth;
  status: RelativeStatus;
  currentAge?: number;
  ageAtDeath?: number;
  causeOfDeath?: CauseOfDeath;
  causeOfDeathConfidence?: Confidence;
  causeOfDeathCancerType?: CancerType; // when causeOfDeath === "cancer"
  causeOfDeathOther?: string;
  unexplainedSuddenDeath?: boolean; // user-flagged
  diagnoses: DiagnosisDuringLife[];
  smoking?: SmokingHistory;
  notes?: string;
}

// ----------------------------------------------------------------------------
// Known genetic testing
//
// A relative's "negative" result is only meaningful when a known familial
// pathogenic variant was the specific target. `variantContext` captures
// that distinction so the report can frame a negative honestly.
// ----------------------------------------------------------------------------

export type GeneticTestSubject = "self" | "relative";

export type GeneticTestVariantContext =
  | "known_familial_variant_tested" // a specific known variant was the target — negative is meaningful
  | "panel_only_no_known_variant"   // generic panel — negative says little
  | "unknown_what_was_tested";       // negative says nothing

export type GeneticTestCondition =
  | "brca1"
  | "brca2"
  | "lynch"
  | "familial_hypercholesterolemia"
  | "cardiomyopathy_panel"
  | "other_named_variant"
  | "unknown_condition";

export type GeneticTestResult = "positive" | "negative" | "vus" | "unknown_result";

export interface KnownGeneticTest {
  id: string;
  subject: GeneticTestSubject;
  subjectRelativeId?: string; // when subject === "relative"
  condition: GeneticTestCondition;
  conditionOther?: string;
  result: GeneticTestResult;
  variantContext: GeneticTestVariantContext;
}

// ----------------------------------------------------------------------------
// Top-level answer shape
// ----------------------------------------------------------------------------

export interface FamilyHistorySelf {
  age: number | null;
  sexAtBirth: SexAtBirth;
  adoptedLimitedHistory: boolean;
  donorConceivedLimitedHistory: boolean;
}

export interface FamilyHistoryAnswers {
  self: FamilyHistorySelf;
  relatives: Relative[];
  knownGeneticTests: KnownGeneticTest[];
}

export const EMPTY_FAMILY_HISTORY: FamilyHistoryAnswers = {
  self: {
    age: null,
    sexAtBirth: "unknown",
    adoptedLimitedHistory: false,
    donorConceivedLimitedHistory: false,
  },
  relatives: [],
  knownGeneticTests: [],
};

// ----------------------------------------------------------------------------
// Guideline citations — structured, versioned, reviewable
//
// 0.3.0 introduces this shape as the canonical citation pattern for the
// engine. Existing 0.2.0 modules still cite guidelines as free-text
// comments; retrofitting them is deferred to a later release and is not
// gated on this one.
// ----------------------------------------------------------------------------

export type GuidelineSource =
  | "USPSTF"
  | "ACC_AHA"
  | "ADA"
  | "ACG"
  | "NCCN"
  | "AAD"
  | "NLA"
  | "AHA"
  | "ALZ_ASSOC"
  | "CDC";

export interface GuidelineCitation {
  source: GuidelineSource;
  title: string;
  version: string;
  url: string;
  /** ISO date the citation was last checked. Not a clinician-review marker. */
  reviewedAt: string;
  /** Initials/credential once a clinician sign-off is attached. */
  reviewer?: string;
}

// ----------------------------------------------------------------------------
// Signal definitions
// ----------------------------------------------------------------------------

export type FamilyPatternSignalId =
  | "premature_cad_prompt"
  | "unexplained_or_early_sudden_death_prompt"
  | "t2d_cluster_prompt"
  | "hboc_discussion_prompt"
  | "lynch_spectrum_discussion_prompt"
  | "familial_hypercholesterolemia_hint"
  | "early_dementia_prompt"
  | "thoracic_aortic_prompt"
  | "melanoma_family_skin_exam_prompt"
  | "colon_screening_age_modifier";

export interface FamilyPatternSignal {
  id: FamilyPatternSignalId;
  label: string;
  /** Human-readable explanation of what fired this signal. */
  trigger: string;
  clinicianDiscussion: string[];
  geneticCounselor?: boolean;
  citation: GuidelineCitation;
}

// ----------------------------------------------------------------------------
// Report output shape
// ----------------------------------------------------------------------------

export interface MissingItem {
  id: string;
  description: string;
}

export interface RelativeQuestion {
  id: string;
  text: string;
}

export interface FamilyHistoryReport {
  signals: FamilyPatternSignal[];
  whatsMissing: MissingItem[];
  questionsForRelatives: RelativeQuestion[];
  questionsForClinician: string[];
  lifestylePrompts: string[];
  relativeSummary: { id: string; line: string }[];
  knownGeneticTestsSummary: string[];
  hasContent: boolean;
}
