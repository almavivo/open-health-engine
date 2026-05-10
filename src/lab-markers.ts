// ---------------------------------------------------------------------------
// Lab marker catalog
// ---------------------------------------------------------------------------
// Curated catalog of lab markers users can manually enter values for. Each
// marker has units, sex/age-aware reference ranges, and band thresholds.
//
// Every range here is conservative and anchored to mainstream sources
// (USPSTF, ADA, ACC/AHA, ATA, NICE, BSH). The interpreter (lab-interpreter.ts)
// consumes this catalog to band each value and produce intake-aware context.
//
// CONVENTIONS
// - Ranges are stored in a single canonical unit per marker. The UI accepts
//   alternative units and converts to canonical before storing.
// - "borderline" bands are intentionally narrow — they exist to soften the
//   normal/abnormal cliff, not to manufacture concern.
// - When a marker has no agreed lower bound (e.g. ferritin, hsCRP), `low`
//   bands are omitted and only `borderline_high` / `high` are returned.
// ---------------------------------------------------------------------------

export type LabUnit =
  | "g_per_dl"
  | "g_per_l"
  | "percent"
  | "fl"
  | "10e9_per_l"
  | "ng_per_ml"
  | "ug_per_l"
  | "umol_per_l"
  | "mg_per_dl"
  | "mmol_per_l"
  | "u_per_l"
  | "iu_per_l"
  | "miu_per_l"
  | "pmol_per_l"
  | "pg_per_ml"
  | "nmol_per_l"
  | "ml_per_min_1_73m2"
  | "mg_per_l";

export interface UnitOption {
  unit: LabUnit;
  label: string;
  /** Multiplicative factor to convert into the marker's canonical unit. */
  toCanonical: number;
}

export type LabBand =
  | "low"
  | "borderline_low"
  | "normal"
  | "borderline_high"
  | "high";

export interface ReferenceRange {
  /** Optional sex narrowing — undefined means "any". */
  sex?: "female" | "male";
  /** Optional age-band narrowing — list of `age_band` QuestionOptionValues that match. */
  ageBands?: string[];
  /** Bands map to value boundaries in the canonical unit. */
  low?: number;          // value < low → "low"
  borderlineLow?: number; // low ≤ value < borderlineLow → "borderline_low"
  borderlineHigh?: number; // borderlineLow ≤ value < borderlineHigh → "normal"; borderlineHigh ≤ value < high → "borderline_high"
  high?: number;          // value ≥ high → "high"
}

export type LabMarkerDomain =
  | "cbc"
  | "iron"
  | "metabolic"
  | "lipids"
  | "glycemic"
  | "thyroid"
  | "vitamins_minerals"
  | "inflammation";

export interface LabMarker {
  id: string;
  /** Maps to the existing intake `lab_*_status` QuestionId, when one exists. */
  linkedLabStatusQuestion?: "lab_ferritin_status" | "lab_b12_status" | "lab_vitamin_d_status" | "lab_triglycerides_status";
  name: string;
  shortName?: string;
  domain: LabMarkerDomain;
  canonicalUnit: LabUnit;
  units: UnitOption[];
  description: string;
  ranges: ReferenceRange[];
  /** When true, low values are clinically meaningful; otherwise only highs. */
  hasLowBand: boolean;
  /** Decimal places to render in inputs/outputs. */
  precision: number;
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export const LAB_MARKERS: LabMarker[] = [
  // ---------- CBC ----------
  {
    id: "haemoglobin",
    name: "Haemoglobin",
    shortName: "Hb",
    domain: "cbc",
    canonicalUnit: "g_per_dl",
    units: [
      { unit: "g_per_dl", label: "g/dL", toCanonical: 1 },
      { unit: "g_per_l", label: "g/L", toCanonical: 0.1 },
    ],
    description: "Oxygen-carrying protein in red blood cells. Low values define anaemia.",
    hasLowBand: true,
    precision: 1,
    ranges: [
      { sex: "female", low: 11.5, borderlineLow: 12.0, borderlineHigh: 15.5, high: 16.0 },
      { sex: "male", low: 13.0, borderlineLow: 13.5, borderlineHigh: 17.0, high: 17.5 },
    ],
  },
  {
    id: "mcv",
    name: "Mean corpuscular volume",
    shortName: "MCV",
    domain: "cbc",
    canonicalUnit: "fl",
    units: [{ unit: "fl", label: "fL", toCanonical: 1 }],
    description: "Average red-blood-cell size. Low MCV → microcytic (often iron). High MCV → macrocytic (often B12/folate).",
    hasLowBand: true,
    precision: 1,
    ranges: [{ low: 78, borderlineLow: 80, borderlineHigh: 100, high: 102 }],
  },

  // ---------- Iron ----------
  {
    id: "ferritin",
    linkedLabStatusQuestion: "lab_ferritin_status",
    name: "Ferritin",
    domain: "iron",
    canonicalUnit: "ng_per_ml",
    units: [
      { unit: "ng_per_ml", label: "ng/mL", toCanonical: 1 },
      { unit: "ug_per_l", label: "μg/L", toCanonical: 1 }, // 1:1
    ],
    description:
      "Body iron stores. Often the first iron marker to fall, even when haemoglobin is normal.",
    hasLowBand: true,
    precision: 0,
    ranges: [
      { sex: "female", low: 15, borderlineLow: 30, borderlineHigh: 200, high: 300 },
      { sex: "male", low: 30, borderlineLow: 40, borderlineHigh: 300, high: 400 },
    ],
  },
  {
    id: "transferrin_saturation",
    name: "Transferrin saturation",
    shortName: "TSAT",
    domain: "iron",
    canonicalUnit: "percent",
    units: [{ unit: "percent", label: "%", toCanonical: 1 }],
    description: "Proportion of transferrin carrying iron. <20% suggests deficiency, >45% suggests overload.",
    hasLowBand: true,
    precision: 0,
    ranges: [{ low: 16, borderlineLow: 20, borderlineHigh: 45, high: 50 }],
  },

  // ---------- Metabolic ----------
  {
    id: "creatinine",
    name: "Creatinine",
    domain: "metabolic",
    canonicalUnit: "umol_per_l",
    units: [
      { unit: "umol_per_l", label: "μmol/L", toCanonical: 1 },
      { unit: "mg_per_dl", label: "mg/dL", toCanonical: 88.4 },
    ],
    description: "Kidney filtration marker. Used with eGFR.",
    hasLowBand: false,
    precision: 0,
    ranges: [
      { sex: "female", borderlineHigh: 90, high: 110 },
      { sex: "male", borderlineHigh: 110, high: 125 },
    ],
  },
  {
    id: "egfr",
    name: "eGFR",
    domain: "metabolic",
    canonicalUnit: "ml_per_min_1_73m2",
    units: [{ unit: "ml_per_min_1_73m2", label: "mL/min/1.73m²", toCanonical: 1 }],
    description: "Estimated kidney filtration rate. <60 sustained suggests chronic kidney disease.",
    hasLowBand: true,
    precision: 0,
    ranges: [{ low: 45, borderlineLow: 60, borderlineHigh: 200, high: 250 }],
  },
  {
    id: "alt",
    name: "ALT",
    domain: "metabolic",
    canonicalUnit: "u_per_l",
    units: [{ unit: "u_per_l", label: "U/L", toCanonical: 1 }],
    description: "Liver-specific enzyme. Elevations point to hepatic stress (alcohol, fatty liver, viral hepatitis, drug effect).",
    hasLowBand: false,
    precision: 0,
    ranges: [
      { sex: "female", borderlineHigh: 33, high: 40 },
      { sex: "male", borderlineHigh: 40, high: 50 },
    ],
  },
  {
    id: "ast",
    name: "AST",
    domain: "metabolic",
    canonicalUnit: "u_per_l",
    units: [{ unit: "u_per_l", label: "U/L", toCanonical: 1 }],
    description: "Liver and muscle enzyme. AST/ALT >2 with elevations is a classic alcoholic-pattern finding.",
    hasLowBand: false,
    precision: 0,
    ranges: [{ borderlineHigh: 35, high: 45 }],
  },
  {
    id: "albumin",
    name: "Albumin",
    domain: "metabolic",
    canonicalUnit: "g_per_l",
    units: [
      { unit: "g_per_l", label: "g/L", toCanonical: 1 },
      { unit: "g_per_dl", label: "g/dL", toCanonical: 10 },
    ],
    description: "Liver synthetic function and nutritional status.",
    hasLowBand: true,
    precision: 0,
    ranges: [{ low: 32, borderlineLow: 35, borderlineHigh: 50, high: 55 }],
  },

  // ---------- Lipids ----------
  {
    id: "total_cholesterol",
    name: "Total cholesterol",
    domain: "lipids",
    canonicalUnit: "mmol_per_l",
    units: [
      { unit: "mmol_per_l", label: "mmol/L", toCanonical: 1 },
      { unit: "mg_per_dl", label: "mg/dL", toCanonical: 0.02586 },
    ],
    description: "Sum of all cholesterol fractions. Use LDL/HDL/TG split for decision making.",
    hasLowBand: false,
    precision: 1,
    ranges: [{ borderlineHigh: 5.0, high: 6.5 }],
  },
  {
    id: "ldl_c",
    name: "LDL cholesterol",
    shortName: "LDL-C",
    domain: "lipids",
    canonicalUnit: "mmol_per_l",
    units: [
      { unit: "mmol_per_l", label: "mmol/L", toCanonical: 1 },
      { unit: "mg_per_dl", label: "mg/dL", toCanonical: 0.02586 },
    ],
    description:
      "Atherogenic cholesterol. ACC/AHA targets vary by 10-year risk; <2.6 mmol/L is a common adult target without other risk factors.",
    hasLowBand: false,
    precision: 1,
    ranges: [{ borderlineHigh: 3.0, high: 4.1 }],
  },
  {
    id: "hdl_c",
    name: "HDL cholesterol",
    shortName: "HDL-C",
    domain: "lipids",
    canonicalUnit: "mmol_per_l",
    units: [
      { unit: "mmol_per_l", label: "mmol/L", toCanonical: 1 },
      { unit: "mg_per_dl", label: "mg/dL", toCanonical: 0.02586 },
    ],
    description: "Reverse cholesterol transport. Very high HDL (>2.5 mmol/L) is no longer assumed protective.",
    hasLowBand: true,
    precision: 1,
    ranges: [
      { sex: "female", low: 1.0, borderlineLow: 1.2, borderlineHigh: 2.3, high: 2.6 },
      { sex: "male", low: 0.9, borderlineLow: 1.0, borderlineHigh: 2.3, high: 2.6 },
    ],
  },
  {
    id: "triglycerides",
    linkedLabStatusQuestion: "lab_triglycerides_status",
    name: "Triglycerides",
    shortName: "TG",
    domain: "lipids",
    canonicalUnit: "mmol_per_l",
    units: [
      { unit: "mmol_per_l", label: "mmol/L", toCanonical: 1 },
      { unit: "mg_per_dl", label: "mg/dL", toCanonical: 0.01129 },
    ],
    description: "Best measured fasted. Elevations track with glycemic dysfunction and alcohol intake.",
    hasLowBand: false,
    precision: 1,
    ranges: [{ borderlineHigh: 1.7, high: 2.3 }],
  },

  // ---------- Glycemic ----------
  {
    id: "fasting_glucose",
    name: "Fasting glucose",
    domain: "glycemic",
    canonicalUnit: "mmol_per_l",
    units: [
      { unit: "mmol_per_l", label: "mmol/L", toCanonical: 1 },
      { unit: "mg_per_dl", label: "mg/dL", toCanonical: 0.05551 },
    ],
    description: "Fasting plasma glucose. ADA: 5.6–6.9 = pre-diabetes range, ≥7.0 on two occasions = diabetes.",
    hasLowBand: true,
    precision: 1,
    ranges: [{ low: 3.5, borderlineLow: 4.0, borderlineHigh: 5.6, high: 7.0 }],
  },
  {
    id: "hba1c",
    name: "HbA1c",
    domain: "glycemic",
    canonicalUnit: "percent",
    units: [
      { unit: "percent", label: "% (DCCT)", toCanonical: 1 },
      // mmol/mol → % using NGSP: % = (mmol/mol × 0.0915) + 2.15
      { unit: "mg_per_dl", label: "mmol/mol (IFCC)", toCanonical: 0 }, // converted in UI; placeholder
    ],
    description: "3-month average blood sugar. ADA: 5.7–6.4 = pre-diabetes, ≥6.5 = diabetes (confirm).",
    hasLowBand: false,
    precision: 1,
    ranges: [{ borderlineHigh: 5.7, high: 6.5 }],
  },

  // ---------- Thyroid ----------
  {
    id: "tsh",
    name: "TSH",
    domain: "thyroid",
    canonicalUnit: "miu_per_l",
    units: [{ unit: "miu_per_l", label: "mIU/L", toCanonical: 1 }],
    description: "First-line thyroid screen. ATA reference: 0.4–4.0 mIU/L (lab-specific; trimester-specific in pregnancy).",
    hasLowBand: true,
    precision: 2,
    ranges: [{ low: 0.3, borderlineLow: 0.4, borderlineHigh: 4.0, high: 5.0 }],
  },
  {
    id: "free_t4",
    name: "Free T4",
    domain: "thyroid",
    canonicalUnit: "pmol_per_l",
    units: [{ unit: "pmol_per_l", label: "pmol/L", toCanonical: 1 }],
    description: "Active circulating T4. Ordered when TSH is abnormal or central hypothyroidism is suspected.",
    hasLowBand: true,
    precision: 1,
    ranges: [{ low: 9, borderlineLow: 10, borderlineHigh: 22, high: 25 }],
  },

  // ---------- Vitamins / minerals ----------
  {
    id: "vitamin_d",
    linkedLabStatusQuestion: "lab_vitamin_d_status",
    name: "25-OH vitamin D",
    shortName: "Vitamin D",
    domain: "vitamins_minerals",
    canonicalUnit: "nmol_per_l",
    units: [
      { unit: "nmol_per_l", label: "nmol/L", toCanonical: 1 },
      { unit: "ng_per_ml", label: "ng/mL", toCanonical: 2.5 },
    ],
    description:
      "Best marker of vitamin D status. The 2011 Endocrine Society framework labelled ≥75 nmol/L (30 ng/mL) as sufficient and <50 nmol/L as deficient; the 2024 update is more measured about a single sufficiency threshold and discourages routine screening in healthy adults <75. Numerical bands are retained as a reference.",
    hasLowBand: true,
    precision: 0,
    ranges: [{ low: 30, borderlineLow: 50, borderlineHigh: 125, high: 250 }],
  },
  {
    id: "vitamin_b12",
    linkedLabStatusQuestion: "lab_b12_status",
    name: "Vitamin B12",
    domain: "vitamins_minerals",
    canonicalUnit: "pmol_per_l",
    units: [
      { unit: "pmol_per_l", label: "pmol/L", toCanonical: 1 },
      { unit: "pg_per_ml", label: "pg/mL", toCanonical: 0.7378 },
    ],
    description:
      "Total B12. Many labs report borderline-low values that warrant follow-up with MMA or holotranscobalamin if symptoms persist.",
    hasLowBand: true,
    precision: 0,
    ranges: [{ low: 150, borderlineLow: 220, borderlineHigh: 700, high: 1100 }],
  },
  {
    id: "folate_serum",
    name: "Folate (serum)",
    domain: "vitamins_minerals",
    canonicalUnit: "nmol_per_l",
    units: [
      { unit: "nmol_per_l", label: "nmol/L", toCanonical: 1 },
      { unit: "ng_per_ml", label: "ng/mL", toCanonical: 2.265 },
    ],
    description: "Recent dietary folate. Red-cell folate is more reliable for sustained status but less commonly run.",
    hasLowBand: true,
    precision: 1,
    ranges: [{ low: 7, borderlineLow: 10, borderlineHigh: 45, high: 60 }],
  },

  // ---------- Inflammation ----------
  {
    id: "hscrp",
    name: "hsCRP (high-sensitivity C-reactive protein)",
    shortName: "hsCRP",
    domain: "inflammation",
    canonicalUnit: "mg_per_l",
    units: [{ unit: "mg_per_l", label: "mg/L", toCanonical: 1 }],
    description:
      "Low-grade inflammation marker. AHA risk stratification: <1 low, 1–3 average, >3 high cardiovascular risk. Elevations during infection are non-specific.",
    hasLowBand: false,
    precision: 1,
    ranges: [{ borderlineHigh: 1.0, high: 3.0 }],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function findMarker(id: string): LabMarker | undefined {
  return LAB_MARKERS.find((m) => m.id === id);
}

/**
 * Pick the most-specific applicable reference range for a given user profile.
 * Falls back from sex+age to sex-only to age-only to "any".
 */
export function selectRange(
  marker: LabMarker,
  sex: "female" | "male" | undefined,
  ageBand: string | undefined,
): ReferenceRange | undefined {
  // sex+age first
  if (sex && ageBand) {
    const r = marker.ranges.find(
      (x) => x.sex === sex && x.ageBands && x.ageBands.includes(ageBand),
    );
    if (r) return r;
  }
  // sex only
  if (sex) {
    const r = marker.ranges.find((x) => x.sex === sex && !x.ageBands);
    if (r) return r;
  }
  // age only
  if (ageBand) {
    const r = marker.ranges.find((x) => !x.sex && x.ageBands && x.ageBands.includes(ageBand));
    if (r) return r;
  }
  // any
  return marker.ranges.find((x) => !x.sex && !x.ageBands);
}

export function bandValue(
  marker: LabMarker,
  value: number,
  range: ReferenceRange,
): LabBand {
  if (marker.hasLowBand) {
    if (range.low !== undefined && value < range.low) return "low";
    if (range.borderlineLow !== undefined && value < range.borderlineLow) return "borderline_low";
  }
  if (range.borderlineHigh !== undefined && value < range.borderlineHigh) return "normal";
  if (range.high !== undefined && value < range.high) return "borderline_high";
  if (range.high !== undefined && value >= range.high) return "high";
  return "normal";
}

export const labBandLabel: Record<LabBand, string> = {
  low: "Low",
  borderline_low: "Borderline low",
  normal: "Normal",
  borderline_high: "Borderline high",
  high: "High",
};

export const labMarkerDomainLabel: Record<LabMarkerDomain, string> = {
  cbc: "Complete blood count",
  iron: "Iron studies",
  metabolic: "Liver & kidney",
  lipids: "Lipids",
  glycemic: "Glycemic control",
  thyroid: "Thyroid",
  vitamins_minerals: "Vitamins & minerals",
  inflammation: "Inflammation",
};
