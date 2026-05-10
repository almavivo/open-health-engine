import { answerIncludes, firstAnswer } from "./rules-engine";
import {
  bandValue,
  findMarker,
  labBandLabel,
  labMarkerDomainLabel,
  selectRange,
  type LabBand,
  type LabMarker,
  type LabMarkerDomain,
} from "./lab-markers";
import type { AnswerMap, QuestionId, QuestionOptionValue } from "./types";
import { applyLabOverrides as applyLabOverridesImpl, type LabResultSet, type LabValue } from "./lab-overrides";

export type { LabResultSet, LabValue } from "./lab-overrides";

// ---------------------------------------------------------------------------
// Lab-result interpreter
// ---------------------------------------------------------------------------
// User-entered lab values are interpreted against:
//   1. Sex/age-specific reference ranges (selectRange + bandValue)
//   2. Their intake answers — to add CONTEXT, not change the band
//
// The interpreter does NOT diagnose. It bands a value (low / borderline_low /
// normal / borderline_high / high), explains what that band means in plain
// language, and adds intake-aware notes ("low ferritin + heavy menses + plant-
// forward diet is a classic pattern; ask about iron studies").
//
// LAB-AS-AUTHORITY for the rules engine
// -------------------------------------
// When a numeric value exists for a marker that maps to an existing intake
// question (lab_ferritin_status, lab_b12_status, lab_vitamin_d_status,
// lab_triglycerides_status), `applyLabOverrides` translates the band into
// the QuestionOptionValue the engine already understands (known_low /
// borderline_low / normal / high). Numeric > coarse: if a user has both,
// the numeric value wins.
//
// This means no supplement rule needs to learn about numeric labs — the
// engine continues to read `lab_ferritin_status: "known_low"` exactly as
// before, but that value can now come from a real ferritin reading instead
// of the user's recollection.
// ---------------------------------------------------------------------------

export type LabFlag = "clinician_review" | "urgent";

export interface LabInterpretation {
  markerId: string;
  markerName: string;
  domain: LabMarkerDomain;
  band: LabBand;
  bandLabel: string;
  value: number;
  unitLabel: string;
  /** The reference range that was applied (so the printout can show it). */
  referenceText: string;
  /** Plain-language meaning of the band (band-only, no intake context). */
  meaning: string;
  /** Intake-aware extra context, zero-or-more sentences. */
  context: string[];
  /** Existing supplement IDs the band points toward, computed from supplement rules. */
  relatedSupplementIds: string[];
  flags: LabFlag[];
}

// ---------------------------------------------------------------------------
// Banding meanings (band-only, no intake context)
// ---------------------------------------------------------------------------

const BAND_MEANING: Partial<Record<string, Partial<Record<LabBand, string>>>> = {
  haemoglobin: {
    low: "Below the standard adult reference range. Many causes look like this — iron, B12/folate, blood loss, chronic disease, renal anaemia — so the cause matters more than the number. Discuss with a clinician.",
    borderline_low: "Just below the cut-off — can be consistent with early iron deficiency or a transient post-illness dip. Pair with ferritin and MCV; a clinician's review will be more informative than this band alone.",
    high: "Sustained elevation is worth a clinician look — dehydration, smoking, sleep apnea, and less common marrow conditions can all push haemoglobin up.",
  },
  mcv: {
    low: "Below the reference range — can be consistent with iron deficiency or thalassaemia trait. Pair with iron studies and discuss with a clinician.",
    borderline_low: "Trending small. Pairing with ferritin will clarify; not diagnostic on its own.",
    borderline_high: "Trending large. Pair with B12 and folate; not diagnostic on its own.",
    high: "Above the reference range — can be consistent with B12 or folate deficiency, alcohol intake, or hypothyroidism. Discuss with a clinician for the cause.",
  },
  ferritin: {
    low: "Below the standard reference range, suggesting depleted iron stores. Common contributors include heavy menses, plant-forward diets, blood donation, and gastrointestinal blood loss — a clinician can help work out which.",
    borderline_low: "Stores trending low. BSH considers <30 ng/mL consistent with iron deficiency even when haemoglobin is normal — discuss with a clinician.",
    high: "Above the reference range — inflammation, liver issues, alcohol intake, or (less commonly) iron overload can all elevate ferritin. Pairing with transferrin saturation helps; >45% is the threshold a clinician would consider for further evaluation.",
  },
  transferrin_saturation: {
    low: "Below the reference range — can be consistent with iron-restricted red-cell production. Discuss with a clinician.",
    borderline_low: "Edges of iron sufficiency.",
    high: "Above the reference range. Worth raising with a clinician, especially if ferritin is also high.",
  },
  egfr: {
    low: "Sustained values <60 for ≥3 months meet the KDIGO criteria a clinician would use to evaluate chronic kidney disease. A single reading isn't a diagnosis — re-test with a clinician.",
    borderline_low: "Borderline kidney function — discuss re-testing in 3 months and an albumin/creatinine ratio with a clinician.",
  },
  alt: {
    borderline_high: "Mildly above the reference range — alcohol intake, fatty liver, viral hepatitis, and certain medications can all do this. Worth a clinician conversation if it persists.",
    high: "Frank elevation. Discuss with a clinician — context (alcohol, weight, medications, infections) decides what work-up is appropriate.",
  },
  ldl_c: {
    borderline_high: "Above the lower targets used for primary prevention. The right target depends on your 10-year cardiovascular risk — a clinician calculates that.",
    high: "Above standard targets — discuss with a clinician. The right next step depends on your other risk factors.",
  },
  hdl_c: {
    low: "Below the standard reference range. Lifestyle changes (movement, alcohol moderation, smoking cessation) tend to move HDL more reliably than supplements.",
    borderline_low: "Slightly below the reference range.",
    high: "Very high HDL is no longer assumed protective — clinical interpretation has shifted; raise it with a clinician if it stands out.",
  },
  triglycerides: {
    borderline_high: "Mildly above the reference range — often tracks with refined-carb intake, alcohol, and metabolic risk.",
    high: "Above standard reference. Values approaching 5 mmol/L raise pancreatitis risk — discuss with a clinician promptly at that level.",
  },
  fasting_glucose: {
    borderline_high: "Within the ADA pre-diabetes range (5.6–6.9 mmol/L). Not a diagnosis on its own — a clinician will confirm with HbA1c or repeat testing.",
    high: "At or above 7.0 mmol/L. Two readings at this level meet the ADA's diabetes threshold — confirm with a clinician using HbA1c.",
  },
  hba1c: {
    borderline_high: "Within the ADA pre-diabetes range (5.7–6.4%). Discuss with a clinician.",
    high: "At or above 6.5%. The ADA considers this consistent with a diabetes diagnosis when confirmed; discuss with a clinician.",
  },
  tsh: {
    low: "Below the reference range — can be consistent with hyperthyroidism or a pituitary issue. A clinician will pair with free T4 and free T3 to clarify.",
    borderline_low: "Slightly suppressed. Biotin supplements can falsely lower TSH on some assays — pause biotin 48h and re-test before drawing conclusions.",
    borderline_high: "In the subclinical hypothyroidism range — a clinician will typically re-test with free T4 and TPO antibodies.",
    high: "Above the reference range — can be consistent with primary hypothyroidism. Discuss with a clinician for confirmation and management.",
  },
  free_t4: {
    low: "Below the reference range. Together with a high TSH this picture can be consistent with primary hypothyroidism — a clinician confirms.",
    high: "Above the reference range. Together with a low TSH this picture can be consistent with hyperthyroidism — a clinician confirms.",
  },
  vitamin_d: {
    low: "Below the 2011 Endocrine Society deficiency threshold (<50 nmol/L). A clinician-supervised supplementation course typically corrects this; the 2024 Endocrine Society guidance still endorses testing and replacement in symptomatic or at-risk populations.",
    borderline_low: "In the 2011 Endocrine Society borderline band (50–75 nmol/L). The 2024 guideline is more measured about a single sufficiency threshold — discuss with your clinician whether supplementation is appropriate in your context (pregnancy, malabsorption, CKD, age ≥75, or symptoms).",
    high: "Above the safe-for-most range — usually from sustained high-dose supplementation. Worth raising with a clinician.",
  },
  vitamin_b12: {
    low: "Below the reference range. Common contributors include low intake (vegan/vegetarian without supplementation), pernicious anaemia, long-term metformin or PPI use, and gastric surgery — a clinician can work out which.",
    borderline_low: "Many labs flag this band as 'normal', but if symptoms persist a clinician may suggest follow-up testing (MMA, holotranscobalamin).",
  },
  folate_serum: {
    low: "Below the reference range. Common in restrictive diets and high alcohol intake; folate fortification has reduced this in many countries.",
    borderline_low: "Trending low.",
  },
  hscrp: {
    borderline_high: "In the AHA's average cardiovascular risk band (1–3 mg/L) — not diagnostic on its own.",
    high: "Above 3 mg/L sits in the AHA's high-risk band. Acute infections cause transient spikes — re-test when well, and discuss persistent elevation with a clinician.",
  },
};

const URGENT_THRESHOLDS: Record<string, { test: (v: number) => boolean; reason: string }> = {
  haemoglobin: {
    test: (v) => v < 8,
    reason: "Severe anaemia — book a same-week clinical review.",
  },
  fasting_glucose: {
    test: (v) => v >= 11.1,
    reason: "Glucose ≥11.1 mmol/L is in the diabetes range and warrants prompt follow-up.",
  },
  hba1c: {
    test: (v) => v >= 8.5,
    reason: "HbA1c ≥8.5% is well above target — discuss with a clinician promptly.",
  },
  triglycerides: {
    test: (v) => v >= 5,
    reason: "Triglycerides ≥5 mmol/L raise acute pancreatitis risk — discuss promptly.",
  },
  egfr: {
    test: (v) => v < 30,
    reason: "eGFR <30 indicates significant kidney impairment — clinical follow-up needed.",
  },
};

// ---------------------------------------------------------------------------
// Intake-aware context rules
// ---------------------------------------------------------------------------

interface ContextRule {
  marker: string;
  appliesToBands: LabBand[];
  applies: (a: AnswerMap) => boolean;
  note: string;
}

const CONTEXT_RULES: ContextRule[] = [
  // Iron / ferritin
  {
    marker: "ferritin",
    appliesToBands: ["low", "borderline_low"],
    applies: (a) =>
      firstAnswer(a, "sex") === "female" &&
      answerIncludes(a, "cycle_pattern", ["regular_cycle", "irregular_cycle"]),
    note:
      "Menstrual blood loss is a major contributor — heavy or irregular periods + low ferritin warrants iron studies and a gynae conversation.",
  },
  {
    marker: "ferritin",
    appliesToBands: ["low", "borderline_low"],
    applies: (a) => answerIncludes(a, "diet_pattern", ["vegan", "vegetarian"]),
    note:
      "Plant-forward diets reduce non-haem iron absorption. Pairing iron-rich foods with vitamin C, and a clinician-supervised iron trial, are reasonable next steps.",
  },
  {
    marker: "ferritin",
    appliesToBands: ["high"],
    applies: (a) => answerIncludes(a, "derived_alcohol_risk", ["risk_high", "risk_moderate"]),
    note: "Higher alcohol intake elevates ferritin via inflammation and direct hepatic effect — re-check after a few alcohol-free weeks before assuming overload.",
  },

  // Vitamin B12
  {
    marker: "vitamin_b12",
    appliesToBands: ["low", "borderline_low"],
    applies: (a) => answerIncludes(a, "diet_pattern", ["vegan", "vegetarian"]),
    note: "Without B12 supplementation, plant-forward diets reliably trend low — daily B12 supplementation is the standard recommendation.",
  },
  {
    marker: "vitamin_b12",
    appliesToBands: ["low", "borderline_low"],
    applies: (a) => answerIncludes(a, "specific_medications", ["med_metformin", "med_ppi"]),
    note: "Metformin and proton-pump inhibitors both lower B12 over time — periodic monitoring is appropriate.",
  },

  // Vitamin D
  {
    marker: "vitamin_d",
    appliesToBands: ["low", "borderline_low"],
    applies: (a) => answerIncludes(a, "sun_exposure", ["almost_never", "limited"]),
    note: "Low sun exposure aligns with the result — supplementation is the standard correction outside sunny months.",
  },

  // Lipids
  {
    marker: "ldl_c",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) => answerIncludes(a, "specific_medications", ["med_statin"]),
    note: "Already on a statin — discuss adherence, dose adequacy, or whether intensification is appropriate.",
  },
  {
    marker: "triglycerides",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) => answerIncludes(a, "derived_alcohol_risk", ["risk_high", "risk_moderate"]),
    note: "Alcohol intake is a major driver — reducing or stopping for 4–6 weeks and re-testing is more informative than any supplement.",
  },
  {
    marker: "triglycerides",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) => answerIncludes(a, "ssb_intake", ["ssb_two_to_three", "ssb_four_plus"]),
    note: "Sugar-sweetened beverages are a major triglyceride driver — cutting them often moves the number quickly.",
  },

  // HbA1c
  {
    marker: "hba1c",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) => answerIncludes(a, "specific_medications", ["med_metformin", "med_glucose_lowering"]),
    note: "On glucose-lowering medication — discuss whether the regimen needs adjusting.",
  },
  {
    marker: "hba1c",
    appliesToBands: ["borderline_high"],
    applies: (a) => answerIncludes(a, "weight_band", ["overweight_band", "obese_band"]),
    note: "Pre-diabetes range with elevated BMI — sustained 5–7% weight loss is the most evidence-based intervention.",
  },

  // ALT
  {
    marker: "alt",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) => answerIncludes(a, "derived_alcohol_risk", ["risk_high", "risk_moderate"]),
    note: "Alcohol intake fits the pattern. AST/ALT >2 strengthens that picture.",
  },
  {
    marker: "alt",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) =>
      answerIncludes(a, "weight_band", ["overweight_band", "obese_band"]) ||
      answerIncludes(a, "derived_glycemic_risk", ["risk_high"]),
    note: "Metabolic-associated steatotic liver disease (MASLD) is the most common cause of mild ALT elevation in adults — discuss imaging if it persists.",
  },

  // hsCRP
  {
    marker: "hscrp",
    appliesToBands: ["borderline_high", "high"],
    applies: (a) => answerIncludes(a, "tobacco_use", ["smoking_current_light", "smoking_current_heavy"]),
    note: "Smoking elevates hsCRP — cessation is the single highest-leverage change.",
  },

  // TSH
  {
    marker: "tsh",
    appliesToBands: ["borderline_low", "low"],
    applies: (a) => answerIncludes(a, "existing_supplements", ["supp_other"]),
    note: "Biotin in some hair/nail/B-complex supplements can falsely lower TSH on assays — pause biotin 48h and re-test if results don't fit symptoms.",
  },
];

// ---------------------------------------------------------------------------
// Marker → likely-related supplement IDs
// ---------------------------------------------------------------------------
// We do NOT introduce a parallel rule system — these are stable references
// to existing supplement IDs in supplements.ts. The lab interpreter surfaces
// "this lab points toward these supplements" as a navigational convenience;
// the actual recommendation still comes from the rules engine, which gates
// on lab_*_status (overridden by these numeric values).
const MARKER_SUPPLEMENTS: Record<string, string[]> = {
  ferritin: ["iron"],
  transferrin_saturation: ["iron"],
  haemoglobin: ["iron", "vitamin_b12"],
  mcv: ["iron", "vitamin_b12"],
  vitamin_d: ["vitamin_d3"],
  vitamin_b12: ["vitamin_b12"],
  folate_serum: ["folate"],
  triglycerides: ["omega3"],
  alt: [],
  hscrp: ["omega3"],
};

// ---------------------------------------------------------------------------
// Reference text for the printout
// ---------------------------------------------------------------------------

function formatRangeText(marker: LabMarker, value: number): string {
  const range = selectRange(
    marker,
    undefined,
    undefined,
  );
  // Caller will pass sex/age — we just describe the canonical range.
  void value;
  void range;
  return ""; // overridden in interpret()
}

void formatRangeText;

// ---------------------------------------------------------------------------
// Interpret a single value
// ---------------------------------------------------------------------------

function interpretSingle(
  value: LabValue,
  answers: AnswerMap,
): LabInterpretation | null {
  const marker = findMarker(value.markerId);
  if (!marker) return null;

  const sex = firstAnswer(answers, "sex");
  const ageBand = firstAnswer(answers, "age_band");
  const sexNarrow = sex === "female" || sex === "male" ? sex : undefined;

  const range = selectRange(marker, sexNarrow, ageBand);
  if (!range) return null;

  const band = bandValue(marker, value.value, range);

  const meaning =
    BAND_MEANING[marker.id]?.[band] ??
    (band === "normal"
      ? "Within the standard reference range."
      : `${labBandLabel[band]} for this marker.`);

  // Intake-aware context
  const context = CONTEXT_RULES.filter(
    (r) => r.marker === marker.id && r.appliesToBands.includes(band) && r.applies(answers),
  ).map((r) => r.note);

  // Flags
  const flags: LabFlag[] = [];
  if (band === "high" || band === "low") flags.push("clinician_review");
  const urgent = URGENT_THRESHOLDS[marker.id];
  if (urgent && urgent.test(value.value)) {
    flags.push("urgent");
    if (!context.includes(urgent.reason)) context.unshift(urgent.reason);
  }

  // Reference text
  const unitLabel =
    marker.units.find((u) => u.unit === marker.canonicalUnit)?.label ?? marker.canonicalUnit;
  const refParts: string[] = [];
  if (marker.hasLowBand && range.borderlineLow !== undefined && range.borderlineHigh !== undefined) {
    refParts.push(
      `Reference: ${range.borderlineLow.toFixed(marker.precision)}–${range.borderlineHigh.toFixed(
        marker.precision,
      )} ${unitLabel}`,
    );
  } else if (range.borderlineHigh !== undefined) {
    refParts.push(`Reference: <${range.borderlineHigh.toFixed(marker.precision)} ${unitLabel}`);
  }
  if (sexNarrow && marker.ranges.some((r) => r.sex)) {
    refParts.push(`(${sexNarrow})`);
  }
  const referenceText = refParts.join(" ").trim();

  return {
    markerId: marker.id,
    markerName: marker.name,
    domain: marker.domain,
    band,
    bandLabel: labBandLabel[band],
    value: value.value,
    unitLabel,
    referenceText,
    meaning,
    context,
    relatedSupplementIds: MARKER_SUPPLEMENTS[marker.id] ?? [],
    flags,
  };
}

export function interpretLabs(
  results: LabResultSet | null | undefined,
  answers: AnswerMap,
): LabInterpretation[] {
  if (!results || results.values.length === 0) return [];
  const out: LabInterpretation[] = [];
  for (const v of results.values) {
    const interp = interpretSingle(v, answers);
    if (interp) out.push(interp);
  }
  // Sort: urgent → clinician_review → others; then by domain
  const flagRank = (i: LabInterpretation): number => {
    if (i.flags.includes("urgent")) return 0;
    if (i.flags.includes("clinician_review")) return 1;
    return 2;
  };
  out.sort((a, b) => {
    const fa = flagRank(a);
    const fb = flagRank(b);
    if (fa !== fb) return fa - fb;
    return a.domain.localeCompare(b.domain);
  });
  return out;
}

// ---------------------------------------------------------------------------
// LAB-AS-AUTHORITY override (re-exported from lab-overrides for callers
// who already import lab-interpreter; rules-engine imports directly to avoid
// a circular dependency).
// ---------------------------------------------------------------------------

export { applyLabOverrides } from "./lab-overrides";

// ---------------------------------------------------------------------------
// Helpers for the UI
// ---------------------------------------------------------------------------

export const labFlagLabel: Record<LabFlag, string> = {
  clinician_review: "Discuss with a clinician",
  urgent: "Discuss promptly",
};

export { labMarkerDomainLabel } from "./lab-markers";
