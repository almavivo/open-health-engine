// ---------------------------------------------------------------------------
// Lab-as-authority override
// ---------------------------------------------------------------------------
// Translates banded numeric lab values into the QuestionOptionValue the
// existing engine already gates on (lab_ferritin_status / lab_b12_status /
// lab_vitamin_d_status / lab_triglycerides_status). Numeric values
// supersede the user's coarse self-reported status answers.
//
// Kept in its own module (no rules-engine imports) so rules-engine can call
// it without creating a circular dependency with lab-interpreter.
// ---------------------------------------------------------------------------

import {
  bandValue,
  findMarker,
  selectRange,
  type LabBand,
} from "./lab-markers";
import type { AnswerMap, QuestionId, QuestionOptionValue } from "./types";

export interface LabValue {
  markerId: string;
  /** Stored in the marker's canonical unit. */
  value: number;
  /** ISO date the lab was collected, if the user provided it. */
  collectedAt?: string;
}

export interface LabResultSet {
  values: LabValue[];
  updatedAt: string;
}

function bandToLabStatus(band: LabBand): QuestionOptionValue | null {
  switch (band) {
    case "low":
      return "known_low";
    case "borderline_low":
      return "borderline_low";
    case "normal":
    case "borderline_high":
      return "normal";
    case "high":
      return "high";
    default:
      return null;
  }
}

export function applyLabOverrides(
  answers: AnswerMap,
  results: LabResultSet | null | undefined,
): AnswerMap {
  if (!results || results.values.length === 0) return answers;
  const out: AnswerMap = { ...answers };
  const sex = answers.sex;
  const sexNarrow = sex === "female" || sex === "male" ? sex : undefined;
  const ageBand = typeof answers.age_band === "string" ? answers.age_band : undefined;

  for (const v of results.values) {
    const marker = findMarker(v.markerId);
    if (!marker?.linkedLabStatusQuestion) continue;
    const range = selectRange(marker, sexNarrow, ageBand);
    if (!range) continue;
    const band = bandValue(marker, v.value, range);
    const mapped = bandToLabStatus(band);
    if (!mapped) continue;
    const target: QuestionId = marker.linkedLabStatusQuestion;
    out[target] = mapped;
  }
  return out;
}
