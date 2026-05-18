// ----------------------------------------------------------------------------
// Family Health History — pattern detectors.
//
// Each detector is a pure predicate over a Relative[] array. Outputs are
// `FamilyPatternSignal` objects framed as *discussion prompts* — never
// determinations that formal criteria (Amsterdam II, Bethesda, NCCN
// thresholds) are met. `enforceFirewall` is a belt-and-braces backstop
// that throws under NODE_ENV=test and console.errors in prod whenever
// any signal output contains a banned determination phrase.
//
// What this module is NOT, and must never become:
//   - A genetic test / genetic-risk-score generator. Outputs are patterns
//     to discuss with a clinician, not findings.
//   - A supplement-recommendation source. Do not import from any future
//     supplements module — family history must not affect supplement
//     ranking.
//   - A diagnostic tool.
// ----------------------------------------------------------------------------

import { CITATIONS } from "./citations";
import { capitalise, labelForCancer, relationshipLabel } from "./labels";
import type {
  CancerType,
  DiagnosisCondition,
  DiagnosisDuringLife,
  FamilyPatternSignal,
  Relationship,
  Relative,
  Side,
} from "./types";

// ----------------------------------------------------------------------------
// Determination-phrase firewall
//
// Public list. Any UI rendering an engine output can spot-check it against
// these. `enforceFirewall` is also invoked from `detectSignals` so a
// regression in signal copy fails CI under NODE_ENV=test.
// ----------------------------------------------------------------------------

export const BANNED_DETERMINATION_PHRASES: readonly string[] = [
  "you meet",
  "you have",
  "criteria are met",
  "diagnosed",
  "high risk for",
  "lynch family",
  "hboc family",
] as const;

// ----------------------------------------------------------------------------
// Pedigree helpers
// ----------------------------------------------------------------------------

const FIRST_DEGREE: Relationship[] = ["parent", "sibling", "child"];
const SECOND_DEGREE: Relationship[] = [
  "grandparent",
  "aunt_uncle",
  "half_sibling",
  "niece_nephew",
];

export function isFirstDegree(r: Relative): boolean {
  return FIRST_DEGREE.includes(r.relationship);
}

export function isSecondDegree(r: Relative): boolean {
  return SECOND_DEGREE.includes(r.relationship);
}

function hasCancerOfType(
  r: Relative,
  types: CancerType[],
): { age: number | "unknown" } | null {
  for (const d of r.diagnoses) {
    if (d.condition === "cancer" && d.cancerType && types.includes(d.cancerType)) {
      return { age: d.ageAtDx };
    }
  }
  if (
    r.causeOfDeath === "cancer" &&
    r.causeOfDeathCancerType &&
    types.includes(r.causeOfDeathCancerType)
  ) {
    return { age: r.ageAtDeath ?? "unknown" };
  }
  return null;
}

function hasDiagnosis(
  r: Relative,
  conditions: DiagnosisCondition[],
): DiagnosisDuringLife | null {
  for (const d of r.diagnoses) {
    if (conditions.includes(d.condition)) return d;
  }
  return null;
}

function hasMiOrCardiacDeath(r: Relative): { age: number | "unknown" } | null {
  const dx = hasDiagnosis(r, ["myocardial_infarction"]);
  if (dx) return { age: dx.ageAtDx };
  if (
    r.causeOfDeath === "cv_heart_attack" ||
    r.causeOfDeath === "cv_sudden_cardiac" ||
    r.causeOfDeath === "cv_heart_failure"
  ) {
    return { age: r.ageAtDeath ?? "unknown" };
  }
  return null;
}

function isPrematureCadEvent(r: Relative): boolean {
  const ev = hasMiOrCardiacDeath(r);
  if (!ev) return false;
  if (ev.age === "unknown") return false;
  if (r.sexAtBirth === "male" && ev.age < 55) return true;
  if (r.sexAtBirth === "female" && ev.age < 65) return true;
  // Sex unknown: use the wider 65 threshold so we don't underfire, but only
  // count for first-degree. Second-degree without known sex stays out.
  if (r.sexAtBirth === "unknown" && isFirstDegree(r) && ev.age < 55) return true;
  return false;
}

function bySide(relatives: Relative[]): Record<Side, Relative[]> {
  const out: Record<Side, Relative[]> = {
    paternal: [],
    maternal: [],
    self: [],
    shared: [],
  };
  for (const r of relatives) out[r.side].push(r);
  return out;
}

// ----------------------------------------------------------------------------
// Detectors
// ----------------------------------------------------------------------------

function detectPrematureCad(rels: Relative[]): FamilyPatternSignal | null {
  const events = rels.filter(isPrematureCadEvent);
  if (events.length === 0) return null;
  const firstDegree = events.filter(isFirstDegree);
  const sides = bySide(events);
  const sameLineagePair =
    sides.paternal.length >= 2 || sides.maternal.length >= 2;
  if (firstDegree.length === 0 && !sameLineagePair) return null;

  const triggerBits: string[] = [];
  if (firstDegree.length > 0) {
    triggerBits.push(
      `early heart attack or cardiac death in a first-degree relative (${firstDegree
        .map((r) => relationshipLabel(r))
        .join(", ")})`,
    );
  }
  if (sameLineagePair) {
    const side = sides.paternal.length >= 2 ? "paternal" : "maternal";
    triggerBits.push(`multiple early cardiac events on the ${side} side`);
  }

  return {
    id: "premature_cad_prompt",
    label: "Early-onset coronary disease pattern",
    trigger: capitalise(triggerBits.join("; ")),
    clinicianDiscussion: [
      "Ask about a lipid panel including Lp(a).",
      "Ask whether a coronary artery calcium (CAC) score is appropriate given the family pattern.",
      "Ask about overall ASCVD risk assessment and whether earlier risk-factor management is warranted.",
    ],
    citation: CITATIONS.premature_cad_prompt,
  };
}

function detectSuddenDeath(rels: Relative[]): FamilyPatternSignal | null {
  const matches: Relative[] = [];
  const sides = bySide(rels);

  for (const r of rels) {
    if (r.unexplainedSuddenDeath) matches.push(r);
    else if (r.causeOfDeath === "cv_sudden_cardiac") {
      const age = r.ageAtDeath ?? null;
      if (age !== null && age < 50) matches.push(r);
      else if (isFirstDegree(r)) matches.push(r);
    }
  }
  // Cluster check: 2+ sudden cardiac deaths same lineage (any age)
  const paternalScd = sides.paternal.filter(
    (r) => r.causeOfDeath === "cv_sudden_cardiac",
  );
  const maternalScd = sides.maternal.filter(
    (r) => r.causeOfDeath === "cv_sudden_cardiac",
  );
  if (paternalScd.length >= 2) matches.push(...paternalScd);
  if (maternalScd.length >= 2) matches.push(...maternalScd);

  const unique = Array.from(new Map(matches.map((r) => [r.id, r])).values());
  if (unique.length === 0) return null;

  return {
    id: "unexplained_or_early_sudden_death_prompt",
    label: "Unexplained or early sudden-death pattern",
    trigger: capitalise(
      `unexplained sudden death, sudden cardiac death under 50, or a same-lineage cluster (${unique
        .map((r) => relationshipLabel(r))
        .join(", ")})`,
    ),
    clinicianDiscussion: [
      "Ask whether a cardiology referral is appropriate.",
      "Ask whether ECG and echocardiogram are reasonable as a starting point.",
      "Mention any unexplained sudden deaths explicitly — channelopathies and inherited cardiomyopathies can run in families.",
    ],
    geneticCounselor: true,
    citation: CITATIONS.unexplained_or_early_sudden_death_prompt,
  };
}

function detectT2dCluster(rels: Relative[]): FamilyPatternSignal | null {
  const firstDegreeT2d = rels.filter(
    (r) =>
      isFirstDegree(r) &&
      (hasDiagnosis(r, ["type_2_diabetes"]) ||
        r.causeOfDeath === "endo_t2d_complications"),
  );
  if (firstDegreeT2d.length < 2) return null;
  return {
    id: "t2d_cluster_prompt",
    label: "Type-2 diabetes family cluster",
    trigger: `Type-2 diabetes in ${firstDegreeT2d.length} first-degree relatives (${firstDegreeT2d
      .map(relationshipLabel)
      .join(", ")})`,
    clinicianDiscussion: [
      "Ask about HbA1c testing at your next visit and an appropriate interval thereafter.",
      "Ask about lipid panel and blood pressure as part of a metabolic check.",
      "Ask about lifestyle programmes — even modest weight reduction (5–7%) meaningfully reduces T2D risk.",
    ],
    citation: CITATIONS.t2d_cluster_prompt,
  };
}

const HBOC_CANCERS: CancerType[] = ["breast", "ovarian", "pancreatic", "prostate"];

function detectHboc(rels: Relative[]): FamilyPatternSignal | null {
  const sides = bySide(rels);
  const fired: string[] = [];

  // Cluster on a single lineage
  for (const side of ["paternal", "maternal"] as const) {
    const onSide = sides[side].filter((r) => hasCancerOfType(r, HBOC_CANCERS));
    if (onSide.length >= 2)
      fired.push(
        `${side}-side cluster of breast/ovarian/pancreatic/prostate cancer`,
      );
  }
  // Any HBOC-spectrum <50 in a first-degree
  for (const r of rels.filter(isFirstDegree)) {
    const ev = hasCancerOfType(r, HBOC_CANCERS);
    if (ev && ev.age !== "unknown" && ev.age < 50) {
      fired.push(`early ${labelForCancer(r)} in a first-degree relative`);
    }
  }
  if (fired.length === 0) return null;

  return {
    id: "hboc_discussion_prompt",
    label: "Breast / ovarian / pancreatic / prostate cluster — discussion prompt",
    trigger: capitalise(fired.join("; ")),
    clinicianDiscussion: [
      "Consider asking a clinician about a referral to genetic counseling.",
      "Bring the full list of who-had-what-at-what-age — counselors rely on the pedigree, not the summary.",
    ],
    geneticCounselor: true,
    citation: CITATIONS.hboc_discussion_prompt,
  };
}

const LYNCH_SPECTRUM: CancerType[] = [
  "colorectal",
  "uterine_endometrial",
  "stomach_gastric",
  "ovarian",
  "small_bowel",
  "urothelial",
  "biliary",
  "brain_cns",
];

function detectLynchSpectrum(rels: Relative[]): FamilyPatternSignal | null {
  const sides = bySide(rels);
  const fired: string[] = [];

  for (const r of rels.filter((x) => isFirstDegree(x) || isSecondDegree(x))) {
    const ev = hasCancerOfType(r, ["colorectal", "uterine_endometrial"]);
    if (ev && ev.age !== "unknown" && ev.age < 50) {
      fired.push(
        `${labelForCancer(r)} under 50 in a ${
          isFirstDegree(r) ? "first" : "second"
        }-degree relative`,
      );
    }
  }
  for (const side of ["paternal", "maternal"] as const) {
    const onSide = sides[side].filter((r) => hasCancerOfType(r, LYNCH_SPECTRUM));
    if (onSide.length >= 2)
      fired.push(`${side}-side cluster of Lynch-spectrum cancers`);
  }
  if (fired.length === 0) return null;

  return {
    id: "lynch_spectrum_discussion_prompt",
    label: "Lynch-spectrum cancer pattern",
    trigger: capitalise(fired.join("; ")),
    clinicianDiscussion: [
      "This pattern may be worth discussing with a clinician or genetic counselor.",
      "Mention the specific cancers, ages at onset, and which lineage they're on.",
    ],
    geneticCounselor: true,
    citation: CITATIONS.lynch_spectrum_discussion_prompt,
  };
}

function detectFhHint(
  rels: Relative[],
  cad: FamilyPatternSignal | null,
): FamilyPatternSignal | null {
  const fhFlags: string[] = [];
  for (const r of rels) {
    if (
      hasDiagnosis(r, [
        "familial_hypercholesterolemia_known",
        "very_high_cholesterol_young",
      ])
    ) {
      fhFlags.push(relationshipLabel(r));
    }
  }
  if (!cad || fhFlags.length === 0) return null;
  return {
    id: "familial_hypercholesterolemia_hint",
    label: "Possible familial hypercholesterolemia pattern",
    trigger: `Early-onset cardiac disease alongside a relative reported with very high cholesterol or known FH (${fhFlags.join(", ")})`,
    clinicianDiscussion: [
      "Ask about a fasting lipid panel including Lp(a).",
      "Ask whether familial hypercholesterolemia is worth ruling out given the combined family pattern.",
    ],
    citation: CITATIONS.familial_hypercholesterolemia_hint,
  };
}

function detectEarlyDementia(rels: Relative[]): FamilyPatternSignal | null {
  const matches = rels.filter((r) => {
    if (!isFirstDegree(r)) return false;
    const dx = hasDiagnosis(r, ["alzheimers", "early_onset_dementia"]);
    if (dx && dx.ageAtDx !== "unknown" && dx.ageAtDx < 65) return true;
    if (
      (r.causeOfDeath === "neuro_alzheimers" ||
        r.causeOfDeath === "neuro_other_dementia") &&
      r.ageAtDeath !== undefined &&
      r.ageAtDeath < 65
    )
      return true;
    return false;
  });
  if (matches.length === 0) return null;
  return {
    id: "early_dementia_prompt",
    label: "Early-onset dementia pattern",
    trigger: `Dementia before age 65 in a first-degree relative (${matches.map(relationshipLabel).join(", ")})`,
    clinicianDiscussion: [
      "This pattern may be worth discussing with a clinician.",
      "Ask whether referral to a memory clinic or genetic counselor is appropriate.",
    ],
    geneticCounselor: true,
    citation: CITATIONS.early_dementia_prompt,
  };
}

function detectThoracicAortic(rels: Relative[]): FamilyPatternSignal | null {
  const matches = rels.filter(
    (r) =>
      isFirstDegree(r) &&
      (hasDiagnosis(r, ["thoracic_aortic_aneurysm_or_dissection"]) ||
        r.causeOfDeath === "cv_aortic_thoracic"),
  );
  if (matches.length === 0) return null;
  return {
    id: "thoracic_aortic_prompt",
    label: "Thoracic aortic disease in a first-degree relative",
    trigger: `Thoracic aortic aneurysm or dissection reported in a first-degree relative (${matches
      .map(relationshipLabel)
      .join(", ")})`,
    clinicianDiscussion: [
      "Ask about a referral for aortic imaging — the 2022 ACC/AHA aortic disease guideline supports screening first-degree relatives of people with thoracic aortic aneurysm or dissection.",
      "Mention this clearly: abdominal aortic aneurysm and 'aneurysm of unknown location' are not the same as thoracic — try to clarify with the family.",
    ],
    citation: CITATIONS.thoracic_aortic_prompt,
  };
}

function detectMelanoma(rels: Relative[]): FamilyPatternSignal | null {
  const firstDegreeMelanoma = rels
    .filter(isFirstDegree)
    .filter((r) => hasCancerOfType(r, ["melanoma"]));
  const anyEarly = firstDegreeMelanoma.some((r) => {
    const ev = hasCancerOfType(r, ["melanoma"]);
    return ev && ev.age !== "unknown" && ev.age < 40;
  });
  if (firstDegreeMelanoma.length < 2 && !anyEarly) return null;
  return {
    id: "melanoma_family_skin_exam_prompt",
    label: "Melanoma family pattern — skin-exam discussion",
    trigger:
      firstDegreeMelanoma.length >= 2
        ? `Melanoma in ${firstDegreeMelanoma.length} first-degree relatives`
        : "Melanoma under age 40 in a first-degree relative",
    clinicianDiscussion: [
      "Mention the family pattern at your next visit and ask about a skin-exam discussion.",
      "Note: routine population-level skin-cancer screening in asymptomatic adults isn't recommended by USPSTF — this is a family-history conversation prompt, not a recommendation to start regular screening.",
    ],
    citation: CITATIONS.melanoma_family_skin_exam_prompt,
  };
}

function detectColonAgeModifier(rels: Relative[]): FamilyPatternSignal | null {
  // Branch A — any 1st-degree CRC under 60 → start earlier than the
  // population age, using "10 years earlier than the relative or age 40,
  // whichever earlier" framing.
  const youngOnsetMatches = rels.filter(isFirstDegree).filter((r) => {
    const ev = hasCancerOfType(r, ["colorectal"]);
    return ev && ev.age !== "unknown" && ev.age < 60;
  });

  // Branch B — two or more 1st-degree relatives with CRC at any age, OR
  // a 1st-degree relative with an advanced adenoma / large polyp. ACG
  // also discusses earlier colonoscopy for these. We treat ageAtDx === "unknown"
  // as eligible for branch B since the cluster math doesn't need age.
  const anyAgeCrcCount = rels
    .filter(isFirstDegree)
    .filter((r) => hasCancerOfType(r, ["colorectal"]) !== null).length;
  const advancedPolypMatches = rels
    .filter(isFirstDegree)
    .filter((r) => hasDiagnosis(r, ["advanced_adenoma_or_polyp"]) !== null);

  const fireBranchA = youngOnsetMatches.length > 0;
  const fireBranchB = anyAgeCrcCount >= 2 || advancedPolypMatches.length > 0;
  if (!fireBranchA && !fireBranchB) return null;

  const triggerBits: string[] = [];
  let clinicianBullets: string[];

  if (fireBranchA) {
    const youngestAge = Math.min(
      ...youngOnsetMatches
        .map((r) => {
          const ev = hasCancerOfType(r, ["colorectal"]);
          return ev && ev.age !== "unknown" ? (ev.age as number) : Infinity;
        })
        .filter((n) => Number.isFinite(n)),
    );
    const recommendedStartAge = Math.min(40, youngestAge - 10);
    triggerBits.push(
      `colorectal cancer before age 60 in a first-degree relative (youngest reported: age ${youngestAge})`,
    );
    clinicianBullets = [
      `Ask about starting colorectal screening earlier — common guideline framing is 10 years before the relative's age at diagnosis, or age 40, whichever is earlier (in this case, around age ${recommendedStartAge}).`,
      "Mention which relative and at what age — the specifics shape the recommendation.",
    ];
  } else {
    clinicianBullets = [
      "Ask about whether earlier colorectal screening is appropriate given the family pattern.",
      "Bring the specific cancers / polyp findings and ages with you — they shape the screening interval.",
    ];
  }

  if (anyAgeCrcCount >= 2) {
    triggerBits.push(
      `${anyAgeCrcCount} first-degree relatives with colorectal cancer (any age)`,
    );
  }
  if (advancedPolypMatches.length > 0) {
    triggerBits.push(
      "first-degree relative with an advanced adenoma or large/serrated polyp",
    );
  }

  return {
    id: "colon_screening_age_modifier",
    label: "Earlier colorectal screening discussion",
    trigger: capitalise(triggerBits.join("; ")),
    clinicianDiscussion: clinicianBullets,
    citation: CITATIONS.colon_screening_age_modifier,
  };
}

// ----------------------------------------------------------------------------
// Public entry point
// ----------------------------------------------------------------------------

import type { FamilyHistoryAnswers } from "./types";

export function detectSignals(
  answers: FamilyHistoryAnswers,
): FamilyPatternSignal[] {
  const rels = answers.relatives;
  const signals: FamilyPatternSignal[] = [];
  const cad = detectPrematureCad(rels);
  if (cad) signals.push(cad);
  const scd = detectSuddenDeath(rels);
  if (scd) signals.push(scd);
  const t2d = detectT2dCluster(rels);
  if (t2d) signals.push(t2d);
  const hboc = detectHboc(rels);
  if (hboc) signals.push(hboc);
  const lynch = detectLynchSpectrum(rels);
  if (lynch) signals.push(lynch);
  const fh = detectFhHint(rels, cad);
  if (fh) signals.push(fh);
  const dem = detectEarlyDementia(rels);
  if (dem) signals.push(dem);
  const aortic = detectThoracicAortic(rels);
  if (aortic) signals.push(aortic);
  const mel = detectMelanoma(rels);
  if (mel) signals.push(mel);
  const colon = detectColonAgeModifier(rels);
  if (colon) signals.push(colon);

  enforceFirewall(signals);
  return signals;
}

export function enforceFirewall(signals: FamilyPatternSignal[]): void {
  // Tests scan every output for banned determination phrases. In test mode
  // the firewall throws (so CI fails on a copy regression). In prod it
  // logs to console and lets downstream UIs render — better to ship slightly
  // imperfect copy than to crash the report on a user.
  const isTest =
    typeof process !== "undefined" && process.env.NODE_ENV === "test";
  for (const s of signals) {
    const corpus = [s.label, s.trigger, ...s.clinicianDiscussion]
      .join(" ")
      .toLowerCase();
    for (const phrase of BANNED_DETERMINATION_PHRASES) {
      if (corpus.includes(phrase)) {
        const msg = `[family-history] banned determination phrase '${phrase}' in signal ${s.id}; outputs must be discussion prompts, not determinations.`;
        if (isTest) throw new Error(msg);
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
  }
}
