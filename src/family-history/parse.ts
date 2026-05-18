// ----------------------------------------------------------------------------
// Family Health History — defensive parser for untrusted input.
//
// `parseFamilyHistoryAnswers` is the engine half of what was a storage
// normaliser in the closed product repo. It coerces an arbitrary `unknown`
// (e.g. parsed JSON from a backup file, a previous app version, or
// hand-written fixtures) into a fully-formed `FamilyHistoryAnswers`
// object that the detectors can safely read without crashing on a
// missing `diagnoses` array or a mistyped field.
//
// DETERMINISM. This function is pure and deterministic — parsing the same
// input twice always returns equal output. In particular: when a
// DiagnosisDuringLife arrives without an `id`, the fallback is a
// content-derived ID `dx_<relativeId>_<index>`, NOT a random one. Relatives
// without an `id` are dropped entirely (they can't be referenced from
// diagnosis fallback IDs or from KnownGeneticTest.subjectRelativeId, so
// salvaging them would be unsafe). KnownGeneticTest records without an
// `id` are likewise dropped.
//
// The defaults chosen for missing enum fields are the safest, most
// information-poor option ("unknown", "shared", "unknown" status). This
// means a malformed record will not accidentally fire a signal — it will
// instead surface in `whatsMissing` as a gap.
// ----------------------------------------------------------------------------

import { EMPTY_FAMILY_HISTORY } from "./types";
import type {
  CancerType,
  Confidence,
  DiagnosisCondition,
  DiagnosisDuringLife,
  FamilyHistoryAnswers,
  GeneticTestCondition,
  GeneticTestResult,
  GeneticTestSubject,
  GeneticTestVariantContext,
  KnownGeneticTest,
  Relationship,
  Relative,
  RelativeStatus,
  SexAtBirth,
  Side,
  SmokingHistory,
} from "./types";

function isObj(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function normaliseDiagnosis(
  value: unknown,
  relativeId: string,
  index: number,
): DiagnosisDuringLife {
  const d = (isObj(value) ? value : {}) as Record<string, unknown>;
  return {
    // Stable, content-derived fallback. Never random — re-parsing the same
    // input must return the same id.
    id: typeof d.id === "string" ? d.id : `dx_${relativeId}_${index}`,
    condition: (typeof d.condition === "string"
      ? d.condition
      : "other") as DiagnosisCondition,
    cancerType:
      typeof d.cancerType === "string"
        ? (d.cancerType as CancerType)
        : undefined,
    ageAtDx: typeof d.ageAtDx === "number" ? d.ageAtDx : "unknown",
    confidence: (typeof d.confidence === "string"
      ? d.confidence
      : "unknown") as Confidence,
    freeText: typeof d.freeText === "string" ? d.freeText : undefined,
  };
}

function normaliseRelative(value: unknown): Relative | null {
  if (!isObj(value)) return null;
  // Drop relatives with no string id — they can't be referenced from
  // diagnosis fallback IDs or KnownGeneticTest.subjectRelativeId, so
  // salvaging them would create dangling references.
  if (typeof value.id !== "string") return null;

  const id = value.id;
  const rawDiagnoses = Array.isArray(value.diagnoses) ? value.diagnoses : [];
  const diagnoses = rawDiagnoses.map((d, i) => normaliseDiagnosis(d, id, i));

  return {
    id,
    relationship: (typeof value.relationship === "string"
      ? value.relationship
      : "parent") as Relationship,
    side: (typeof value.side === "string" ? value.side : "shared") as Side,
    sexAtBirth: (typeof value.sexAtBirth === "string"
      ? value.sexAtBirth
      : "unknown") as SexAtBirth,
    status: (typeof value.status === "string"
      ? value.status
      : "unknown") as RelativeStatus,
    currentAge:
      typeof value.currentAge === "number" ? value.currentAge : undefined,
    ageAtDeath:
      typeof value.ageAtDeath === "number" ? value.ageAtDeath : undefined,
    causeOfDeath:
      typeof value.causeOfDeath === "string"
        ? (value.causeOfDeath as Relative["causeOfDeath"])
        : undefined,
    causeOfDeathConfidence:
      typeof value.causeOfDeathConfidence === "string"
        ? (value.causeOfDeathConfidence as Confidence)
        : undefined,
    causeOfDeathCancerType:
      typeof value.causeOfDeathCancerType === "string"
        ? (value.causeOfDeathCancerType as CancerType)
        : undefined,
    causeOfDeathOther:
      typeof value.causeOfDeathOther === "string"
        ? value.causeOfDeathOther
        : undefined,
    unexplainedSuddenDeath:
      typeof value.unexplainedSuddenDeath === "boolean"
        ? value.unexplainedSuddenDeath
        : undefined,
    diagnoses,
    smoking:
      typeof value.smoking === "string"
        ? (value.smoking as SmokingHistory)
        : undefined,
    notes: typeof value.notes === "string" ? value.notes : undefined,
  };
}

function normaliseGeneticTest(value: unknown): KnownGeneticTest | null {
  if (!isObj(value)) return null;
  if (typeof value.id !== "string") return null;
  return {
    id: value.id,
    subject: (typeof value.subject === "string"
      ? value.subject
      : "relative") as GeneticTestSubject,
    subjectRelativeId:
      typeof value.subjectRelativeId === "string"
        ? value.subjectRelativeId
        : undefined,
    condition: (typeof value.condition === "string"
      ? value.condition
      : "unknown_condition") as GeneticTestCondition,
    conditionOther:
      typeof value.conditionOther === "string"
        ? value.conditionOther
        : undefined,
    result: (typeof value.result === "string"
      ? value.result
      : "unknown_result") as GeneticTestResult,
    variantContext: (typeof value.variantContext === "string"
      ? value.variantContext
      : "unknown_what_was_tested") as GeneticTestVariantContext,
  };
}

/**
 * Defensive constructor for `FamilyHistoryAnswers`. Coerces an arbitrary
 * `unknown` (typically parsed JSON from storage or a backup file) into
 * a fully-formed answers object, applying safe defaults for missing
 * fields. Pure and deterministic — repeated calls on the same input
 * return equal output.
 */
export function parseFamilyHistoryAnswers(raw: unknown): FamilyHistoryAnswers {
  if (!isObj(raw)) return EMPTY_FAMILY_HISTORY;

  const selfRaw = (isObj(raw.self) ? raw.self : {}) as Record<string, unknown>;

  return {
    self: {
      age:
        typeof selfRaw.age === "number"
          ? selfRaw.age
          : selfRaw.age === null
            ? null
            : EMPTY_FAMILY_HISTORY.self.age,
      sexAtBirth: (typeof selfRaw.sexAtBirth === "string"
        ? selfRaw.sexAtBirth
        : "unknown") as SexAtBirth,
      adoptedLimitedHistory: !!selfRaw.adoptedLimitedHistory,
      donorConceivedLimitedHistory: !!selfRaw.donorConceivedLimitedHistory,
    },
    relatives: Array.isArray(raw.relatives)
      ? raw.relatives
          .map(normaliseRelative)
          .filter((x): x is Relative => x !== null)
      : [],
    knownGeneticTests: Array.isArray(raw.knownGeneticTests)
      ? raw.knownGeneticTests
          .map(normaliseGeneticTest)
          .filter((x): x is KnownGeneticTest => x !== null)
      : [],
  };
}
