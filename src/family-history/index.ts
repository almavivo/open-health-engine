// Family Health History — public surface.
//
// Pattern detection over a user-built pedigree. Outputs are framed as
// discussion prompts (clinician / genetic counselor), never determinations
// of disease or risk. See ./types for the full data model, ./rules for
// the detectors, ./report for the aggregator, and ./parse for the
// defensive constructor used to load untrusted input.

export type {
  // Core data model
  FamilyHistoryAnswers,
  FamilyHistorySelf,
  Relative,
  DiagnosisDuringLife,
  KnownGeneticTest,
  // Picklist + enum types
  Confidence,
  Side,
  Relationship,
  SexAtBirth,
  RelativeStatus,
  SmokingHistory,
  CauseOfDeath,
  CancerType,
  DiagnosisCondition,
  GeneticTestSubject,
  GeneticTestVariantContext,
  GeneticTestCondition,
  GeneticTestResult,
  // Signal + citation
  GuidelineSource,
  GuidelineCitation,
  FamilyPatternSignalId,
  FamilyPatternSignal,
  // Report
  MissingItem,
  RelativeQuestion,
  FamilyHistoryReport,
} from "./types";

export { EMPTY_FAMILY_HISTORY } from "./types";

export {
  detectSignals,
  enforceFirewall,
  isFirstDegree,
  isSecondDegree,
  BANNED_DETERMINATION_PHRASES,
} from "./rules";

export {
  buildReport,
  whatsMissing,
  buildQuestionsForRelatives,
  standardLifestylePrompts,
  summariseRelative,
  summariseGeneticTest,
} from "./report";

export {
  CANCER_LABELS,
  CAUSE_LABELS,
  DIAGNOSIS_LABELS,
  RELATIONSHIP_LABELS,
  SIDE_LABELS,
  relationshipLabel,
  labelForCancer,
} from "./labels";

export { CITATIONS, REVIEW_DATE } from "./citations";

export { parseFamilyHistoryAnswers } from "./parse";
