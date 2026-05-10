import { answerIncludes, answerValues, firstAnswer } from "./rules-engine";
import { AnswerMap, RiskFlag } from "./types";

// ---------------------------------------------------------------------------
// Annual physical prep sheet
// ---------------------------------------------------------------------------
// Generates a printable list of:
//   1. SCREENING QUESTIONS — things to ask the GP at an annual physical,
//      framed by age/sex/risk profile. USPSTF-leaning, mainstream.
//   2. CADENCE REMINDERS — recurring screenings (mammogram, colonoscopy, etc)
//      the user may be due or overdue for, anchored to current US/UK guidance.
//   3. RED-FLAG ESCALATIONS — when the intake reports an urgent symptom,
//      flag it explicitly so the prep sheet doesn't bury it.
//
// This complements the existing lab-recommendations.ts engine, which produces
// the recommended *test panel*. The prep sheet is everything OTHER than tests:
// the conversation prompts and the cadence reminders. Both surfaces are
// printed and emailed together via clinician-export.tsx.
//
// Pediatric guard: same as lab-recommendations.ts — under-18 returns a single
// "speak with a paediatrician" entry.
// Pregnancy guard: avoids cadence reminders that don't apply during pregnancy
// (mammogram cadence stays; colonoscopy cadence still applies but with caveats).
// ---------------------------------------------------------------------------

export type PrepTier = "important" | "recommended" | "consider";

export type PrepCategory =
  | "lifestyle_review"
  | "medication_review"
  | "mental_health"
  | "screening"
  | "vaccination"
  | "history"
  | "risk_factor"
  | "specialist_referral";

export interface PrepQuestion {
  id: string;
  category: PrepCategory;
  tier: PrepTier;
  ask: string;          // The question to read aloud to the GP.
  why: string;          // One-line rationale tied to the user's intake.
  triggers: string[];   // Short labels of which signals contributed.
}

export interface PrepCadence {
  id: string;
  name: string;
  cadence: string;      // Human label: "every 2 years from 50", "annual"
  due: "likely_overdue" | "due_soon" | "track";
  why: string;
  guidelineAnchor?: string;
}

export interface PrepRedFlag {
  id: string;
  message: string;
}

export interface PhysicalPrepSheet {
  hasContent: boolean;
  questions: PrepQuestion[];
  cadenceReminders: PrepCadence[];
  redFlagEscalations: PrepRedFlag[];
  pediatricNotice?: string;
  redFlagInterception?: string;
}

// The intake's age_band enum is coarse: 18-29, 30-44, 45-59, 60-69, 70-79,
// 80+. Some screenings begin mid-band (mammogram at 40, colorectal at 45,
// AAA at 65). We can't sub-divide without breaking the intake, so cadence
// rules use the constants below alongside an `unambiguous` flag to control
// whether to label the screening "Due or due soon" (the band sits clearly
// inside the eligibility window) or "On your radar" (the band straddles
// the edge of eligibility).
//
// MAY_BE_DUE = the *earliest* band where eligibility could begin
// CLEARLY_DUE = the band(s) where the user is unambiguously inside the window
// LIKELY_TOO_OLD = bands above the typical upper bound, where stop-screening
//                  conversations apply

// Mammogram (USPSTF 2024 starts at 40; NHS BSP starts at 50; both end at
// ~74-75)
const MAMMOGRAM_MAY_BE_DUE = ["30_44"] as const;     // 40-44 within this band
const MAMMOGRAM_CLEARLY_DUE = ["45_59", "60_69"] as const;
const MAMMOGRAM_TAPER = ["70_79"] as const;          // 70-74 inside, 75+ tapering

// Colorectal (USPSTF 2021: 45-75; selective 76-85)
const COLORECTAL_MAY_BE_DUE = ["45_59"] as const;    // band straddles 45
const COLORECTAL_CLEARLY_DUE = ["60_69", "70_79"] as const;
const COLORECTAL_TAPER = ["80_plus", "60_plus"] as const;

// Cervical (NHS 25-64 / USPSTF 21-65)
const CERVICAL_DUE = ["18_29", "30_44", "45_59", "60_69"] as const;

// AAA (USPSTF 65-75 for ever-smoking men)
const AAA_WINDOW = ["60_69", "70_79", "60_plus"] as const;

// Lung LDCT (USPSTF 2021: 50-80 with ≥20 pack-year history and quit ≤15y)
// We don't collect pack-years, so this stays risk-prompted, not cadence-based.
const LUNG_RISK_AGE = ["45_59", "60_69", "70_79", "60_plus"] as const;

// Bone density (USPSTF: women 65+; postmenopausal <65 with risk factors)
const DXA_FEMALE_DUE = ["60_69", "70_79", "80_plus", "60_plus"] as const;
const DXA_FEMALE_RISK = ["45_59"] as const; // postmenopausal with risk factors

// Fall-risk screening (USPSTF: 65+)
const AGE_65_PLUS = ["60_69", "70_79", "80_plus", "60_plus"] as const;

// Lipid panel — adults 40+ should know risk; older bands more clearly
const LIPID_DUE = ["30_44", "45_59", "60_69", "70_79", "80_plus", "60_plus"] as const;

function ageBand(answers: AnswerMap): string | undefined {
  return firstAnswer(answers, "age_band");
}

function isAdult(answers: AnswerMap): boolean {
  const age = ageBand(answers);
  return age !== undefined && age !== "under_18";
}

function isFemale(answers: AnswerMap): boolean {
  return firstAnswer(answers, "sex") === "female";
}

function isMale(answers: AnswerMap): boolean {
  return firstAnswer(answers, "sex") === "male";
}

function ageIn(answers: AnswerMap, bands: readonly string[]): boolean {
  const age = ageBand(answers);
  return age !== undefined && bands.includes(age);
}

// ---------------------------------------------------------------------------
// Question rules
// ---------------------------------------------------------------------------

interface QuestionRule {
  id: string;
  category: PrepCategory;
  tier: PrepTier;
  ask: string;
  why: string;
  trigger: string;
  applies: (answers: AnswerMap, riskFlags: RiskFlag[]) => boolean;
}

const QUESTION_RULES: QuestionRule[] = [
  // ---------- Medication review ----------
  {
    id: "medication_review_polypharmacy",
    category: "medication_review",
    tier: "important",
    ask: "Can we go through every medication, supplement, and OTC product I'm using and review whether each is still needed at the current dose?",
    why: "You're taking multiple prescription medications — annual deprescribing review is standard of care.",
    trigger: "Polypharmacy",
    applies: (_a, flags) => flags.includes("polypharmacy"),
  },
  {
    id: "medication_review_unlisted",
    category: "medication_review",
    tier: "recommended",
    ask: "Can we confirm which of my prescriptions interact with common supplements, and whether any need timing changes?",
    why: "You're on a prescription medication — your pharmacist or GP is the authoritative source for interaction screening.",
    trigger: "Prescription medication",
    applies: (_a, flags) =>
      flags.includes("unlisted_medications") ||
      flags.includes("levothyroxine_use") ||
      flags.includes("ppi_use") ||
      flags.includes("metformin_use") ||
      flags.includes("statin_use" as RiskFlag) ||
      flags.includes("immunosuppressant_use"),
  },
  {
    id: "ppi_long_term_review",
    category: "medication_review",
    tier: "recommended",
    ask: "I've been on a PPI for a while — can we discuss whether long-term use is still indicated, and check B12, magnesium, and bone density?",
    why: "Long-term proton-pump inhibitor use depletes B12 and magnesium and is associated with bone-density loss.",
    trigger: "PPI use",
    applies: (_a, flags) => flags.includes("ppi_use"),
  },
  {
    id: "metformin_b12_review",
    category: "medication_review",
    tier: "recommended",
    ask: "Can we check my B12 — I've read metformin can lower it over time?",
    why: "Long-term metformin use lowers B12 in roughly 1 in 5 users; ADA recommends periodic monitoring.",
    trigger: "Metformin use",
    applies: (_a, flags) => flags.includes("metformin_use"),
  },
  {
    id: "anticoagulant_supplement_review",
    category: "medication_review",
    tier: "important",
    ask: "I want to make sure no supplement I'm taking interacts with my blood-thinner. Can we go through the list?",
    why: "Anticoagulants interact with omega-3 at high doses, vitamin K, fish oil, ginkgo, garlic, and others.",
    trigger: "Anticoagulant use",
    applies: (_a, flags) =>
      flags.includes("blood_thinner_use") || flags.includes("daily_aspirin_or_nsaid"),
  },

  // ---------- Lifestyle review ----------
  {
    id: "alcohol_review_high",
    category: "lifestyle_review",
    tier: "important",
    ask: "I'd like to talk honestly about my alcohol use — I'm drinking more than I'd like and would value your perspective.",
    why: "Your reported alcohol intake is in the higher-risk range — annual conversation is recommended.",
    trigger: "High alcohol intake",
    applies: (_a, flags) => flags.includes("high_alcohol"),
  },
  {
    id: "smoking_cessation",
    category: "lifestyle_review",
    tier: "important",
    ask: "Can we talk about smoking cessation options — what's available on prescription and what's worked for your other patients?",
    why: "Active smoking is the single biggest modifiable mortality risk; GPs can prescribe NRT and varenicline.",
    trigger: "Current smoker",
    applies: (_a, flags) => flags.includes("current_smoker"),
  },
  {
    id: "blood_pressure_check",
    category: "screening",
    tier: "important",
    ask: "Can we take a blood-pressure reading today and review whether home monitoring would help?",
    why: "Your intake reported high blood pressure (treated or untreated) — an annual reading at minimum is standard, with home monitoring often advised.",
    trigger: "High blood pressure",
    applies: (_a, flags) => flags.includes("high_blood_pressure"),
  },
  {
    id: "weight_loss_workup",
    category: "history",
    tier: "important",
    ask: "I've lost weight without trying — can we work out what's behind it?",
    why: "Unintentional weight loss is a red-flag symptom in adults and warrants a structured workup.",
    trigger: "Recent weight loss",
    applies: (_a, flags) => flags.includes("weight_loss_recent"),
  },
  {
    id: "diet_quality_conversation",
    category: "lifestyle_review",
    tier: "consider",
    ask: "Can you point me to a registered dietitian or evidence-based diet resources for someone in my situation?",
    why: "Your reported diet quality (low produce, high ultra-processed, or high sugar drinks) has long-term metabolic implications.",
    trigger: "Diet quality",
    applies: (a, _f) =>
      answerIncludes(a, "derived_diet_quality_risk", ["risk_high"]) ||
      answerIncludes(a, "derived_produce_risk", ["risk_high"]),
  },

  // ---------- Mental health ----------
  {
    id: "stress_load_screening",
    category: "mental_health",
    tier: "recommended",
    ask: "I've been carrying a lot of stress — can we talk about what's available, both NHS/GP-side and privately?",
    why: "You reported a high stress load. USPSTF supports depression screening in adults; anxiety screening is supported for adults under 65 (insufficient evidence for 65+). Your clinician can choose the right tool and interval.",
    trigger: "High stress",
    applies: (a, _f) => answerIncludes(a, "stress_load", ["high"]),
  },
  {
    id: "sleep_workup",
    category: "specialist_referral",
    tier: "recommended",
    ask: "My partner has noticed loud snoring or pauses in my breathing. Can we discuss a sleep-study referral?",
    why: "Loud snoring or witnessed apnea is the most common red flag for obstructive sleep apnea.",
    trigger: "Snoring or apnea",
    applies: (a, _f) => answerIncludes(a, "snoring_pattern", ["loud_snoring_or_apnea"]),
  },

  // ---------- Female-specific ----------
  {
    id: "perimenopause_review",
    category: "history",
    tier: "recommended",
    ask: "I'm having symptoms that may be perimenopause — can we talk about evaluation, lifestyle measures, and HRT pros/cons for someone in my situation?",
    why: "You reported perimenopausal symptoms; mainstream guidance now supports HRT discussions earlier than in the past.",
    trigger: "Perimenopausal symptoms",
    applies: (a, _f) =>
      answerIncludes(a, "perimenopause_symptoms", ["hot_flashes", "perimenopause_mixed"]) ||
      answerIncludes(a, "cycle_pattern", ["irregular_cycle"]),
  },
  {
    id: "heavy_menses_workup",
    category: "history",
    tier: "recommended",
    ask: "My periods have been heavy or irregular. Can we check ferritin, full blood count, and TSH, and discuss whether further evaluation is needed?",
    why: "Heavy or irregular menses with fatigue is a classic iron-deficiency pattern that also screens for thyroid dysfunction.",
    trigger: "Irregular cycle + fatigue signal",
    applies: (a, _f) =>
      isFemale(a) &&
      answerIncludes(a, "cycle_pattern", ["irregular_cycle"]) &&
      (answerIncludes(a, "energy_issue", ["low_energy"]) ||
        answerIncludes(a, "derived_iron_signal", ["signal_strong", "signal_moderate"])),
  },

  // ---------- Glycemic / metabolic ----------
  {
    id: "hba1c_request",
    category: "screening",
    tier: "important",
    ask: "Can we run an HbA1c if it hasn't been done in the last 12 months — I'd like to see where I am on glycemic control.",
    why: "Several signals from your intake (sugar drinks, BMI band, family history, or known glucose status) suggest periodic glycemic screening.",
    trigger: "Glycemic risk",
    applies: (_a, flags) => flags.includes("elevated_glycemic_risk"),
  },

  // ---------- Cardiovascular ----------
  {
    id: "lipid_panel",
    category: "screening",
    tier: "recommended",
    ask: "When was my last lipid panel? Can we review whether it's time to repeat it and discuss my 10-year cardiovascular risk?",
    why: "Adults from around 40 onwards benefit from knowing their lipid status and 10-year risk. ACC/AHA suggests repeat every 4–6 years for most adults; your clinician will adjust to context.",
    trigger: "Adult lipid review",
    applies: (a, _f) => ageIn(a, LIPID_DUE) && isAdult(a),
  },

  // ---------- Vaccinations (age/risk-driven) ----------
  {
    id: "vaccination_review",
    category: "vaccination",
    tier: "recommended",
    ask: "Can we review which vaccinations I'm due for — flu, COVID booster, shingles, pneumococcal, tetanus?",
    why: "Adult vaccination is under-utilised. The list expands at 50 (shingles), 65 (pneumococcal), and changes during pregnancy.",
    trigger: "Adult vaccination cadence",
    applies: (a, _f) => isAdult(a),
  },

  // ---------- Bone health ----------
  {
    id: "bone_density_review_routine",
    category: "screening",
    tier: "recommended",
    ask: "Am I due for a bone-density (DEXA) scan?",
    why: "USPSTF recommends osteoporosis screening for women 65+ — your age band falls inside that window.",
    trigger: "Female 65+",
    applies: (a, _f) => isFemale(a) && ageIn(a, DXA_FEMALE_DUE),
  },
  {
    id: "bone_density_review_risk",
    category: "screening",
    tier: "consider",
    ask: "Given my risk factors, should we discuss a bone-density (DEXA) scan?",
    why: "Postmenopausal women under 65 with fracture-risk factors (low body weight, long-term PPI, steroids, smoking) may benefit from earlier screening — your clinician can use a tool like FRAX to decide.",
    trigger: "Postmenopausal + risk factors",
    applies: (a, flags) =>
      isFemale(a) &&
      ageIn(a, DXA_FEMALE_RISK) &&
      (flags.includes("ppi_use") ||
        flags.includes("current_smoker") ||
        flags.includes("former_recent_smoker")),
  },
  {
    id: "bone_density_review_male_risk",
    category: "screening",
    tier: "consider",
    ask: "I have risk factors that affect bone — should we discuss a DEXA scan?",
    why: "USPSTF found insufficient evidence to recommend routine osteoporosis screening in men — but men with specific risk factors (long-term steroid use, hypogonadism, fragility fracture, long-term PPI) may still benefit. This is a clinician judgement call, not a routine cadence.",
    trigger: "Male with bone-risk factors",
    applies: (a, flags) =>
      isMale(a) &&
      ageIn(a, ["60_69", "70_79", "80_plus", "60_plus"]) &&
      flags.includes("ppi_use"),
  },

  // ---------- Functional / fall-risk for older adults ----------
  {
    id: "fall_risk_review",
    category: "history",
    tier: "recommended",
    ask: "I'd like to do a fall-risk check — gait, balance, vision, and a medication review for sedating drugs.",
    why: "Falls are the leading cause of injury in adults 65+. CDC STEADI provides the screen → assess → intervene framework; USPSTF supports targeted exercise / fall-prevention interventions for older adults at increased risk.",
    trigger: "Age 65+",
    applies: (a, _f) => ageIn(a, AGE_65_PLUS),
  },

  // ---------- Family planning / preconception ----------
  {
    id: "preconception_counselling",
    category: "specialist_referral",
    tier: "consider",
    ask: "If pregnancy could be relevant in the next year or two, can we do a quick preconception review — folate, vaccines, medication review?",
    why: "Preconception counselling improves outcomes; folate should ideally start ≥4 weeks before conception. Mention this only if it applies — we surface it for context, not as an assumption.",
    trigger: "Female reproductive age (informational)",
    applies: (a, _f) => isFemale(a) && ageIn(a, ["18_29", "30_44"]),
  },
];

// ---------------------------------------------------------------------------
// Cadence reminders (recurring screenings)
// ---------------------------------------------------------------------------

interface CadenceRule {
  id: string;
  name: string;
  cadence: string;
  why: string;
  guidelineAnchor?: string;
  applies: (answers: AnswerMap, riskFlags: RiskFlag[]) => "likely_overdue" | "due_soon" | "track" | null;
}

const CADENCE_RULES: CadenceRule[] = [
  {
    id: "cervical_screening",
    name: "Cervical screening (Pap / HPV)",
    cadence:
      "UK/NHS: invited from 25 to 64, usually every 5 years. US/USPSTF: from 21 to 65, interval depends on Pap/HPV method.",
    why: "Cervical screening reduces incidence and mortality. The right interval depends on which programme you sit under and which test was used.",
    guidelineAnchor: "USPSTF 2018, NHS",
    applies: (a) => {
      if (!isFemale(a)) return null;
      if (ageIn(a, CERVICAL_DUE)) return "track";
      return null;
    },
  },
  {
    id: "mammogram",
    name: "Mammogram",
    cadence:
      "USPSTF (2024): every 2 years from 40 to 74 for average risk. NHS BSP: routine invitations from 50 to 71. Earlier if family history.",
    why: "USPSTF moved the average-risk start age from 50 to 40 in 2024. The NHS Breast Screening Programme still begins at 50; clinicians outside the NHS programme may follow the USPSTF position.",
    guidelineAnchor: "USPSTF 2024, NHS BSP",
    applies: (a) => {
      if (!isFemale(a)) return null;
      if (ageIn(a, MAMMOGRAM_CLEARLY_DUE)) return "due_soon";
      if (ageIn(a, MAMMOGRAM_TAPER)) return "due_soon";
      // 30_44 band straddles 40 — flag for awareness, not certainty
      if (ageIn(a, MAMMOGRAM_MAY_BE_DUE)) return "track";
      if (ageIn(a, ["80_plus"])) return "track";
      return null;
    },
  },
  {
    id: "colorectal_screening",
    name: "Colorectal cancer screening (FIT or colonoscopy)",
    cadence:
      "USPSTF (2021): every 1–2 years (FIT) or every 10 years (colonoscopy) from 45 to 75. Selectively considered 76–85.",
    why: "Earlier if there's a family history. UK guidance differs: NHS bowel-cancer screening invitations are typically 50–74 in England, slightly different in Scotland and Wales.",
    guidelineAnchor: "USPSTF 2021, NHS",
    applies: (a) => {
      if (ageIn(a, COLORECTAL_CLEARLY_DUE)) return "due_soon";
      // 45_59 band straddles 45 — flag without overpromising due-ness
      if (ageIn(a, COLORECTAL_MAY_BE_DUE)) return "track";
      if (ageIn(a, COLORECTAL_TAPER)) return "track";
      return null;
    },
  },
  {
    id: "abdominal_aortic_aneurysm",
    name: "Abdominal aortic aneurysm screen (one-time ultrasound)",
    cadence: "USPSTF (B): one-time ultrasound for men 65–75 who have ever smoked.",
    why: "The intake age band 60–69 spans this start age, so this is flagged for awareness rather than certainty. NHS programmes typically invite men in their 65th year.",
    guidelineAnchor: "USPSTF, NHS AAA",
    applies: (a, flags) => {
      if (!isMale(a)) return null;
      if (!ageIn(a, AAA_WINDOW)) return null;
      const smokingHistory =
        flags.includes("current_smoker") || flags.includes("former_recent_smoker");
      return smokingHistory ? "track" : null;
    },
  },
  {
    id: "lung_cancer_screen_risk",
    name: "Lung cancer screening (low-dose CT) — risk-based",
    cadence:
      "USPSTF (2021): annual LDCT for ages 50–80 with a 20+ pack-year history who currently smoke or quit within 15 years.",
    why: "We don't ask about pack-years, so we can't tell whether you meet eligibility. If you have (or had) a substantial smoking history — roughly 1 pack/day for 20 years, or 2 packs/day for 10 — ask whether LDCT is appropriate.",
    guidelineAnchor: "USPSTF 2021",
    applies: (a, flags) => {
      if (!ageIn(a, LUNG_RISK_AGE)) return null;
      if (
        flags.includes("current_smoker") ||
        flags.includes("former_recent_smoker")
      ) {
        return "track";
      }
      return null;
    },
  },
  {
    id: "skin_check",
    name: "Skin examination by clinician",
    cadence: "Annual if family or personal history of skin cancer; otherwise as concerns arise.",
    why: "Routine whole-body screening isn't blanket-recommended, but high-risk skin types, family history of melanoma, or a changing lesion shift the calculus.",
    guidelineAnchor: "USPSTF (no general recommendation), AAD",
    applies: (a) => (isAdult(a) ? "track" : null),
  },
  {
    id: "dental_review",
    name: "Dental review and cleaning",
    cadence: "Every 6–12 months.",
    why: "Periodontal disease is associated with cardiovascular and metabolic risk. Often the first place B-vitamin deficiencies and reflux are noticed.",
    applies: (a) => (isAdult(a) ? "track" : null),
  },
  {
    id: "eye_exam",
    name: "Comprehensive eye exam",
    cadence: "Every 2 years (annual from 65, or annual if diabetic).",
    why: "Glaucoma and diabetic retinopathy are best caught at routine screening.",
    applies: (a, flags) => {
      if (!isAdult(a)) return null;
      if (flags.includes("elevated_glycemic_risk")) return "due_soon";
      if (ageIn(a, AGE_65_PLUS)) return "due_soon";
      return "track";
    },
  },
];

// ---------------------------------------------------------------------------
// Red-flag escalations
// ---------------------------------------------------------------------------

interface RedFlagRule {
  id: string;
  message: string;
  applies: (answers: AnswerMap) => boolean;
}

const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: "rf_chest_pain",
    message:
      "Mention chest pain or pressure first. New or unexplained chest pain warrants same-week evaluation; do not save it for the end of the visit.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_chest_pain"),
  },
  {
    id: "rf_blood_in_stool",
    message:
      "Mention blood in stool first. This needs evaluation regardless of age, even if you assume it's haemorrhoids.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_blood_in_stool"),
  },
  {
    id: "rf_blood_in_urine",
    message: "Mention blood in urine first — it warrants prompt urological evaluation.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_blood_in_urine"),
  },
  {
    id: "rf_unintentional_weight_loss",
    message:
      "Mention unintentional weight loss explicitly. Quantify it (kg or % body weight) and timeframe.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_unintentional_weight_loss"),
  },
  {
    id: "rf_suicidal_thoughts",
    message:
      "Tell your clinician about thoughts of self-harm at the start of the visit. If acute, contact emergency services or your local crisis line before reading this sheet.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_suicidal_thoughts"),
  },
  {
    id: "rf_severe_persistent_headache",
    message:
      "Mention the new-pattern severe headache first. Note any associated vision changes, weakness, or fever.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_severe_persistent_headache"),
  },
  {
    id: "rf_neurological_symptoms",
    message:
      "Mention neurological symptoms (weakness, numbness, vision changes, slurred speech) first — describe onset and laterality.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_neurological_symptoms"),
  },
  {
    id: "rf_breast_lump",
    message: "Mention the breast lump first and describe how long it's been present.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_breast_lump"),
  },
  {
    id: "rf_persistent_fever",
    message:
      "Mention the persistent fever and its duration. Bring temperature readings if you've been logging them.",
    applies: (a) => answerValues(a.red_flag_symptoms).includes("rf_persistent_fever"),
  },
];

// ---------------------------------------------------------------------------
// Build the prep sheet
// ---------------------------------------------------------------------------

export function buildPhysicalPrepSheet(
  answers: AnswerMap,
  riskFlags: RiskFlag[],
): PhysicalPrepSheet {
  const age = ageBand(answers);

  if (age === "under_18") {
    return {
      hasContent: true,
      questions: [],
      cadenceReminders: [],
      redFlagEscalations: [],
      pediatricNotice:
        "This sheet is built for adults. Please speak with a paediatrician or family doctor — under-18 visits follow age-specific schedules and screenings that aren't modelled here.",
    };
  }

  // Red-flag interception: if there's an urgent symptom, surface escalations
  // first; the rest of the sheet still renders but the urgent message leads.
  const redFlagEscalations: PrepRedFlag[] = RED_FLAG_RULES.filter((r) => r.applies(answers)).map(
    (r) => ({ id: r.id, message: r.message }),
  );

  const questions: PrepQuestion[] = QUESTION_RULES.filter((r) => r.applies(answers, riskFlags)).map(
    (r) => ({
      id: r.id,
      category: r.category,
      tier: r.tier,
      ask: r.ask,
      why: r.why,
      triggers: [r.trigger],
    }),
  );

  const cadenceReminders: PrepCadence[] = CADENCE_RULES.flatMap((r) => {
    const due = r.applies(answers, riskFlags);
    if (!due) return [];
    return [
      {
        id: r.id,
        name: r.name,
        cadence: r.cadence,
        due,
        why: r.why,
        guidelineAnchor: r.guidelineAnchor,
      },
    ];
  });

  // Sort questions by tier, then category
  const tierOrder: Record<PrepTier, number> = { important: 0, recommended: 1, consider: 2 };
  questions.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  // Sort cadence by due-ness
  const dueOrder: Record<PrepCadence["due"], number> = {
    likely_overdue: 0,
    due_soon: 1,
    track: 2,
  };
  cadenceReminders.sort((a, b) => dueOrder[a.due] - dueOrder[b.due]);

  const redFlagInterception =
    redFlagEscalations.length > 0
      ? "You reported an urgent symptom. Please book a clinical visit promptly — the items below are for that conversation, not a substitute for it."
      : undefined;

  const hasContent =
    questions.length > 0 ||
    cadenceReminders.length > 0 ||
    redFlagEscalations.length > 0;

  return {
    hasContent,
    questions,
    cadenceReminders,
    redFlagEscalations,
    redFlagInterception,
  };
}

export const prepCategoryLabel: Record<PrepCategory, string> = {
  lifestyle_review: "Lifestyle review",
  medication_review: "Medication & supplement review",
  mental_health: "Mental health",
  screening: "Screening",
  vaccination: "Vaccinations",
  history: "Symptom history",
  risk_factor: "Risk factor",
  specialist_referral: "Specialist referral",
};

export const prepTierLabel: Record<PrepTier, string> = {
  important: "Important",
  recommended: "Recommended",
  consider: "Consider",
};

export const prepCadenceDueLabel: Record<PrepCadence["due"], string> = {
  likely_overdue: "Likely overdue",
  due_soon: "Due or due soon",
  track: "On your radar",
};
