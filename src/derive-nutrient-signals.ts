import { AnswerMap, QuestionId } from "./types";
import { answerValues } from "./rules-engine";

// ---------------------------------------------------------------------------
// Derived nutrient signals
// ---------------------------------------------------------------------------
// Single body-sign symptoms are weak evidence. Real clinical reasoning combines
// signs with diet, risk factors, and (where available) labs before promoting a
// nutrient deficiency hypothesis to "act on it". This module encodes that
// reasoning in one place so it can be audited as a unit, and so genetic /
// non-nutritional confounders (familial greying, pattern hair loss, ageing
// nail ridges) are filtered *before* a supplement rule ever sees them.
//
// Each derive function returns a strength label:
//   "signal_strong"   — multiple corroborating inputs OR a low lab + plausible cause
//   "signal_moderate" — one strong sign with at least one supporting input
//   "signal_weak"     — a single sign on its own (rule may use this for "consider testing")
//   "signal_none"     — nothing pointing this way, or all hits were genetic confounders
//
// The output is merged back into AnswerMap so the existing rules-engine
// Condition mechanism can read derived signals exactly like user answers.
// ---------------------------------------------------------------------------

type SignalStrength =
  | "signal_strong"
  | "signal_moderate"
  | "signal_weak"
  | "signal_none";

type DerivedSignalId = Extract<QuestionId, `derived_${string}`>;

// A few derivations classify *risk* level rather than signal strength. We
// reuse the same AnswerMap-merge pattern so rules can read them via Conditions.
type RiskLevel = "risk_none" | "risk_low" | "risk_moderate" | "risk_high";
type SmokingLevel = "risk_none" | "former_remote" | "former_recent" | "current";
type Presence = "risk_none" | "present";

/**
 * Translate the new alcohol_units_weekly + alcohol_binge_frequency answers
 * into a single risk band, plus map any legacy alcohol_frequency answer onto
 * the same band so older saved intakes still produce a usable signal.
 */
function deriveAlcoholRisk(a: AnswerMap): RiskLevel {
  const units = a.alcohol_units_weekly;
  const binge = a.alcohol_binge_frequency;

  // Binge alone elevates risk independently of weekly total.
  let bingeBand: RiskLevel = "risk_none";
  if (binge === "binge_multiple_weekly") bingeBand = "risk_high";
  else if (binge === "binge_weekly") bingeBand = "risk_moderate";
  else if (binge === "binge_monthly") bingeBand = "risk_low";

  let weeklyBand: RiskLevel = "risk_none";
  if (units === "alc_zero") weeklyBand = "risk_none";
  else if (units === "alc_1_to_7") weeklyBand = "risk_low";
  else if (units === "alc_8_to_14") weeklyBand = "risk_low";
  else if (units === "alc_15_to_21") weeklyBand = "risk_moderate";
  else if (units === "alc_22_to_35") weeklyBand = "risk_high";
  else if (units === "alc_35_plus") weeklyBand = "risk_high";
  else {
    // Legacy mapping for older saved intakes that used alcohol_frequency.
    const legacy = a.alcohol_frequency;
    if (legacy === "rarely") weeklyBand = "risk_none";
    else if (legacy === "weekly") weeklyBand = "risk_low";
    else if (legacy === "most_days") weeklyBand = "risk_moderate";
    else if (legacy === "daily") weeklyBand = "risk_high";
  }

  const order: RiskLevel[] = ["risk_none", "risk_low", "risk_moderate", "risk_high"];
  return order.indexOf(bingeBand) > order.indexOf(weeklyBand) ? bingeBand : weeklyBand;
}

function deriveSmokingRisk(a: AnswerMap): SmokingLevel {
  const t = a.tobacco_use;
  if (t === "smoking_current_light" || t === "smoking_current_heavy") return "current";
  if (t === "smoking_former_recent") return "former_recent";
  if (t === "smoking_former_remote") return "former_remote";
  return "risk_none";
}

function deriveProduceRisk(a: AnswerMap): RiskLevel {
  const fv = a.fruit_veg_servings;
  const fibre = a.fibre_intake;

  let band: RiskLevel = "risk_none";
  if (fv === "fv_zero_to_1") band = "risk_high";
  else if (fv === "fv_2_to_3") band = "risk_moderate";
  // Legacy bucket (pre-2026-05-04) lumped 2–4 together. Treat as moderate.
  else if (fv === "fv_2_to_4") band = "risk_moderate";
  else if (fv === "fv_4") band = "risk_low";
  else if (fv === "fv_5_to_7") band = "risk_low";
  else if (fv === "fv_8_plus") band = "risk_none";

  if (fibre === "fibre_rarely" && (band === "risk_none" || band === "risk_low")) {
    band = "risk_moderate";
  }
  return band;
}

function deriveGlycemicRisk(a: AnswerMap): RiskLevel {
  let score = 0;
  if (a.ssb_intake === "ssb_four_plus") score += 3;
  else if (a.ssb_intake === "ssb_two_to_three") score += 2;
  else if (a.ssb_intake === "ssb_one") score += 1;
  if (a.glucose_status === "high") score += 3;
  else if (a.glucose_status === "borderline_low") score += 2;
  if (a.glucose_lowering_med === "yes") score += 2;
  if (a.weight_band === "obese_band") score += 1;
  if (score >= 4) return "risk_high";
  if (score >= 2) return "risk_moderate";
  if (score >= 1) return "risk_low";
  return "risk_none";
}

// ---------- Diet quality (UPF + SSB + produce convergence) ----------
// UPF share is the strongest single dietary correlate of all-cause mortality,
// CVD, T2D, and depression in recent umbrella reviews (Lane et al. 2024 BMJ).
// SSB and low produce intake reinforce the same pattern: nutrient-sparse,
// energy-dense, additive-rich. We combine them rather than ranking UPF alone
// because all three travel together in real diets.
function deriveDietQualityRisk(a: AnswerMap): RiskLevel {
  let score = 0;

  if (a.ultra_processed_intake === "upf_most") score += 3;
  else if (a.ultra_processed_intake === "upf_about_half") score += 2;
  else if (a.ultra_processed_intake === "upf_some") score += 1;

  if (a.ssb_intake === "ssb_four_plus") score += 2;
  else if (a.ssb_intake === "ssb_two_to_three") score += 1;
  else if (a.ssb_intake === "ssb_one") score += 1;

  if (a.fruit_veg_servings === "fv_zero_to_1") score += 1;

  if (score >= 4) return "risk_high";
  if (score >= 2) return "risk_moderate";
  if (score >= 1) return "risk_low";
  return "risk_none";
}

function deriveRedFlag(a: AnswerMap): Presence {
  const picks = answerValues(a.red_flag_symptoms);
  const meaningful = picks.filter((p) => p && p !== "no_red_flags");
  // Recent unintentional weight loss reported in the dedicated weight_change_recent
  // question is also a red flag worth wiring even if the user didn't pick it above.
  const weightLoss = a.weight_change_recent === "lost_weight";
  return meaningful.length > 0 || weightLoss ? "present" : "risk_none";
}

function isHighAlcohol(a: AnswerMap): boolean {
  const r = deriveAlcoholRisk(a);
  return r === "risk_moderate" || r === "risk_high";
}

function has(answers: AnswerMap, qid: QuestionId, value: string): boolean {
  return answerValues(answers[qid]).includes(value);
}

function hasAny(answers: AnswerMap, qid: QuestionId, values: string[]): boolean {
  const picks = answerValues(answers[qid]);
  return values.some((v) => picks.includes(v));
}

/**
 * Convert a count of corroborating inputs into a signal strength.
 * Two or more independent inputs = strong; one supported input = moderate;
 * one bare sign = weak; nothing = none.
 */
function strengthFromCount(
  bodySignHits: number,
  supportingFactors: number,
  labOverride: SignalStrength | null = null,
): SignalStrength {
  if (labOverride) return labOverride;
  const total = bodySignHits + supportingFactors;
  if (bodySignHits >= 2 || (bodySignHits >= 1 && supportingFactors >= 2)) {
    return "signal_strong";
  }
  if (bodySignHits >= 1 && supportingFactors >= 1) {
    return "signal_moderate";
  }
  if (total >= 1) return "signal_weak";
  return "signal_none";
}

// ---------- Iron ----------
// Body signs that point toward iron: spoon-shaped nails (koilonychia, very specific),
// pale nail beds, pale/sallow skin, diffuse hair shedding, cold extremities, restless legs.
// Supporting factors: female sex (menstrual losses), heavy/significant PMS or regular cycle,
// vegan/vegetarian diet, rare red meat intake, low energy as a goal.
// Lab override: known low ferritin → strong; high ferritin → none (suppressed).
function deriveIron(a: AnswerMap): SignalStrength {
  if (a.lab_ferritin_status === "high") return "signal_none";
  // Normal ferritin overrides body-sign noise: a documented normal lab is the
  // single best evidence iron isn't the limiting factor, regardless of cycle
  // status, diet, or non-specific symptoms.
  if (a.lab_ferritin_status === "normal") return "signal_none";

  let bodyHits = 0;
  if (hasAny(a, "nail_signs", ["nail_spoon_shaped"])) bodyHits += 2; // very specific sign
  if (hasAny(a, "nail_signs", ["nail_pale_beds"])) bodyHits += 1;
  if (hasAny(a, "skin_signs", ["skin_pale_sallow"])) bodyHits += 1;
  if (hasAny(a, "hair_signs", ["hair_diffuse_shedding"])) bodyHits += 1;
  if (hasAny(a, "other_signs", ["cold_extremities"])) bodyHits += 1;
  if (hasAny(a, "other_signs", ["muscle_twitches_restless_legs"])) bodyHits += 1;

  let support = 0;
  if (a.sex === "female") support += 1;
  if (a.cycle_pattern === "regular_cycle" || a.cycle_pattern === "irregular_cycle") support += 1;
  if (a.pms_pattern === "significant_pms") support += 1;
  if (hasAny(a, "diet_pattern", ["vegan", "vegetarian"])) support += 1;
  if (a.red_meat_intake === "rarely") support += 1;

  // Lab override: known low ferritin with any plausible cause → strong
  if (a.lab_ferritin_status === "known_low" || a.lab_ferritin_status === "borderline_low") {
    return bodyHits + support > 0 ? "signal_strong" : "signal_moderate";
  }

  return strengthFromCount(bodyHits, support);
}

// ---------- Zinc ----------
// Body signs: white nail spots (classic but non-specific), slow wound healing,
// adult acne, taste/smell changes (very specific), frequent infections, poor night vision.
// Supporting factors: vegan/vegetarian (phytates reduce zinc bioavailability),
// rare red meat, immune support as a goal, age 60+ (absorption decline).
function deriveZinc(a: AnswerMap): SignalStrength {
  let bodyHits = 0;
  if (hasAny(a, "other_signs", ["taste_smell_changes"])) bodyHits += 2; // very specific
  if (hasAny(a, "skin_signs", ["skin_slow_healing"])) bodyHits += 1;
  if (hasAny(a, "skin_signs", ["skin_adult_acne"])) bodyHits += 1;
  if (hasAny(a, "nail_signs", ["nail_white_spots"])) bodyHits += 1;
  if (hasAny(a, "other_signs", ["frequent_infections"])) bodyHits += 1;
  if (hasAny(a, "other_signs", ["poor_night_vision"])) bodyHits += 1;

  let support = 0;
  if (hasAny(a, "diet_pattern", ["vegan", "vegetarian"])) support += 1;
  if (a.red_meat_intake === "rarely") support += 1;
  if (hasAny(a, "primary_goal", ["immune_support"])) support += 1;
  if (a.age_band === "60_69" || a.age_band === "70_79" || a.age_band === "80_plus" || a.age_band === "60_plus") support += 1;

  return strengthFromCount(bodyHits, support);
}

// ---------- B12 ----------
// Body signs: smooth/sore tongue (classic glossitis — strong), pale skin,
// premature greying *only when not familial*. Familial greying or
// pattern hair loss are explicitly NOT counted (genetic guard).
// Supporting factors: vegan/vegetarian/pescatarian diet, age 60+ (absorption decline),
// proton-pump-inhibitor or metformin use is captured upstream (medication_profile).
function deriveB12(a: AnswerMap): SignalStrength {
  // Lab override
  if (a.lab_b12_status === "high" || a.lab_b12_status === "normal") return "signal_none";

  let bodyHits = 0;
  if (hasAny(a, "mouth_signs", ["mouth_sore_smooth_tongue"])) bodyHits += 2;
  if (hasAny(a, "skin_signs", ["skin_pale_sallow"])) bodyHits += 1;

  // Premature greying: only count if user did NOT also mark familial greying
  // and did NOT mark patterned hair loss (which suggests genetic baseline overall).
  const familialGreying = hasAny(a, "hair_signs", ["hair_familial_early_greying"]);
  const patternedLoss = hasAny(a, "hair_signs", ["hair_pattern_loss_genetic"]);
  if (
    hasAny(a, "hair_signs", ["hair_premature_greying"]) &&
    !familialGreying &&
    !patternedLoss
  ) {
    bodyHits += 1;
  }

  let support = 0;
  if (hasAny(a, "diet_pattern", ["vegan", "vegetarian", "pescatarian"])) support += 1;
  if (a.age_band === "60_69" || a.age_band === "70_79" || a.age_band === "80_plus" || a.age_band === "60_plus") support += 1;
  if (a.medication_profile === "polypharmacy") support += 1;

  if (a.lab_b12_status === "known_low" || a.lab_b12_status === "borderline_low") {
    return bodyHits + support > 0 ? "signal_strong" : "signal_moderate";
  }

  return strengthFromCount(bodyHits, support);
}

// ---------- B-complex (B2, B6 emphasis) ----------
// Body signs: cracks at corners of mouth (angular cheilitis — B2/B6/iron),
// horizontal nail ridges (B-vitamin status, but heavily age-confounded so
// we age-gate this signal: ridges in over-60s mostly = ageing).
// Supporting factors: low fish/dairy intake, high alcohol (depletes thiamine and B6),
// frequent migraines (B2 has prevention evidence).
function deriveBComplex(a: AnswerMap): SignalStrength {
  let bodyHits = 0;
  if (hasAny(a, "mouth_signs", ["mouth_cracks_corners"])) bodyHits += 2; // specific
  // Age-gate ridges: only count if under 60 (otherwise ageing dominates)
  const youngerAge =
    a.age_band === "under_18" ||
    a.age_band === "18_29" ||
    a.age_band === "30_44" ||
    a.age_band === "45_59";
  if (youngerAge && hasAny(a, "nail_signs", ["nail_ridges_horizontal"])) bodyHits += 1;

  let support = 0;
  if (isHighAlcohol(a)) support += 1;
  if (a.dairy_intake === "rarely") support += 1;
  if (a.fish_intake === "rarely") support += 1;
  if (a.migraine_pattern === "occasional_migraine" || a.migraine_pattern === "frequent_migraine") {
    support += 1;
  }

  return strengthFromCount(bodyHits, support);
}

// ---------- Vitamin C ----------
// Body signs: bleeding gums, easy bruising, slow wound healing.
// Supporting factors: low fruit/veg intake is not directly captured; we use
// rare red meat as a poor proxy and skip — instead we rely on the body signs.
function deriveVitaminC(a: AnswerMap): SignalStrength {
  let bodyHits = 0;
  if (hasAny(a, "mouth_signs", ["mouth_bleeding_gums"])) bodyHits += 2;
  if (hasAny(a, "skin_signs", ["skin_easy_bruising"])) bodyHits += 1;
  if (hasAny(a, "skin_signs", ["skin_slow_healing"])) bodyHits += 1;

  let support = 0;
  if (isHighAlcohol(a)) support += 1;

  return strengthFromCount(bodyHits, support);
}

// ---------- Vitamin D ----------
// Body signs: eczema/inflamed skin patches, frequent infections, diffuse hair shedding.
// Supporting factors: low sun exposure, immune support goal, age 60+.
// Lab override: known low → strong; normal/high → none.
function deriveVitaminD(a: AnswerMap): SignalStrength {
  if (a.lab_vitamin_d_status === "high" || a.lab_vitamin_d_status === "normal") {
    return "signal_none";
  }

  let bodyHits = 0;
  if (hasAny(a, "skin_signs", ["skin_eczema_inflamed"])) bodyHits += 1;
  if (hasAny(a, "other_signs", ["frequent_infections"])) bodyHits += 1;
  if (hasAny(a, "hair_signs", ["hair_diffuse_shedding"])) bodyHits += 1;

  let support = 0;
  if (a.sun_exposure === "none_or_low") support += 1;
  if (hasAny(a, "primary_goal", ["immune_support"])) support += 1;
  if (a.age_band === "60_69" || a.age_band === "70_79" || a.age_band === "80_plus" || a.age_band === "60_plus") support += 1;

  if (a.lab_vitamin_d_status === "known_low" || a.lab_vitamin_d_status === "borderline_low") {
    return bodyHits + support > 0 ? "signal_strong" : "signal_moderate";
  }

  return strengthFromCount(bodyHits, support);
}

// ---------- Omega-3 ----------
// Body signs: persistently dry/scaly skin, eczema-like patches, dry/brittle hair.
// Supporting factors: rare fish intake, vegan/vegetarian diet.
function deriveOmega3(a: AnswerMap): SignalStrength {
  let bodyHits = 0;
  if (hasAny(a, "skin_signs", ["skin_dry_scaly"])) bodyHits += 1;
  if (hasAny(a, "skin_signs", ["skin_eczema_inflamed"])) bodyHits += 1;
  if (hasAny(a, "hair_signs", ["hair_dry_brittle"])) bodyHits += 1;

  let support = 0;
  if (a.fish_intake === "rarely") support += 1;
  if (hasAny(a, "diet_pattern", ["vegan", "vegetarian"])) support += 1;

  return strengthFromCount(bodyHits, support);
}

// ---------- Magnesium ----------
// Body signs: muscle twitches, cramps at rest, restless legs.
// Supporting factors: high stress load, poor sleep quality, daily alcohol,
// frequent migraines (Mg has prevention evidence), endurance/strength training (sweat losses).
function deriveMagnesium(a: AnswerMap): SignalStrength {
  let bodyHits = 0;
  if (hasAny(a, "other_signs", ["muscle_twitches_restless_legs"])) bodyHits += 2;

  let support = 0;
  if (a.stress_load === "high") support += 1;
  if (a.sleep_quality === "poor" || a.sleep_quality === "fair") support += 1;
  if (isHighAlcohol(a)) support += 1;
  if (a.migraine_pattern === "occasional_migraine" || a.migraine_pattern === "frequent_migraine") {
    support += 1;
  }
  if (a.exercise_pattern === "endurance" || a.exercise_pattern === "strength_power") support += 1;

  return strengthFromCount(bodyHits, support);
}

// ---------- Vitamin A ----------
// Body signs: poor night vision (classic), dry/scaly skin.
// Supporting factors: vegan diet (preformed A only from animal sources;
// beta-carotene conversion varies), rare dairy intake.
function deriveVitaminA(a: AnswerMap): SignalStrength {
  let bodyHits = 0;
  if (hasAny(a, "other_signs", ["poor_night_vision"])) bodyHits += 2;
  if (hasAny(a, "skin_signs", ["skin_dry_scaly"])) bodyHits += 1;

  let support = 0;
  if (hasAny(a, "diet_pattern", ["vegan"])) support += 1;
  if (a.dairy_intake === "rarely") support += 1;

  return strengthFromCount(bodyHits, support);
}

// ---------- Vitamin K ----------
// Body signs: easy bruising, bleeding gums (overlap with vitamin C — rules
// engine handles convergence by both signals firing).
// Supporting factors: long-term antibiotic exposure not captured; blood thinner
// use SUPPRESSES this signal (do-not-recommend handled at supplement level).
function deriveVitaminK(a: AnswerMap): SignalStrength {
  // Hard suppression: blood thinners interact with vitamin K — do not even hint
  if (a.blood_thinner_use === "yes" || a.blood_thinner_use === "not_sure") {
    return "signal_none";
  }

  let bodyHits = 0;
  if (hasAny(a, "skin_signs", ["skin_easy_bruising"])) bodyHits += 1;
  if (hasAny(a, "mouth_signs", ["mouth_bleeding_gums"])) bodyHits += 1;

  let support = 0;
  if (hasAny(a, "diet_pattern", ["carnivore"])) support += 1; // no leafy greens

  return strengthFromCount(bodyHits, support);
}

// ---------------------------------------------------------------------------

const DERIVATIONS: Array<[DerivedSignalId, (a: AnswerMap) => SignalStrength]> = [
  ["derived_iron_signal", deriveIron],
  ["derived_zinc_signal", deriveZinc],
  ["derived_b12_signal", deriveB12],
  ["derived_b_complex_signal", deriveBComplex],
  ["derived_vitamin_c_signal", deriveVitaminC],
  ["derived_vitamin_d_signal", deriveVitaminD],
  ["derived_omega3_signal", deriveOmega3],
  ["derived_magnesium_signal", deriveMagnesium],
  ["derived_vitamin_a_signal", deriveVitaminA],
  ["derived_vitamin_k_signal", deriveVitaminK],
];

type RiskDerivation =
  | [Extract<DerivedSignalId, "derived_alcohol_risk" | "derived_produce_risk" | "derived_glycemic_risk" | "derived_diet_quality_risk">, (a: AnswerMap) => RiskLevel]
  | [Extract<DerivedSignalId, "derived_smoking_risk">, (a: AnswerMap) => SmokingLevel]
  | [Extract<DerivedSignalId, "derived_red_flag">, (a: AnswerMap) => Presence];

const RISK_DERIVATIONS: RiskDerivation[] = [
  ["derived_alcohol_risk", deriveAlcoholRisk],
  ["derived_smoking_risk", deriveSmokingRisk],
  ["derived_produce_risk", deriveProduceRisk],
  ["derived_glycemic_risk", deriveGlycemicRisk],
  ["derived_diet_quality_risk", deriveDietQualityRisk],
  ["derived_red_flag", deriveRedFlag],
];

/**
 * Returns a new AnswerMap with derived nutrient and risk signals merged in.
 * Idempotent. The original answers object is not mutated.
 */
export function withDerivedSignals(answers: AnswerMap): AnswerMap {
  const out: AnswerMap = { ...answers };
  for (const [id, fn] of DERIVATIONS) {
    out[id] = fn(answers);
  }
  for (const [id, fn] of RISK_DERIVATIONS) {
    out[id] = fn(answers);
  }
  return out;
}

export type { SignalStrength };
