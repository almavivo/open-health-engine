// Public API surface for @almavivo/engine.
// Anything not re-exported here is considered internal.

export * from "./types";
export {
  buildRecommendationPlan,
  collectRiskFlags,
  getVisibleQuestions,
  getQuestionIdsForFlow,
  answerValues,
  answerIncludes,
  firstAnswer,
} from "./rules-engine";
export { questionnaire } from "./questionnaire";
export { supplementCatalog, EXCLUDED_SUPPLEMENTS } from "./supplements";
export { deriveLabRecommendations, EXCLUDED_TESTS } from "./lab-recommendations";
export { withDerivedSignals } from "./derive-nutrient-signals";
export { deriveProfiles } from "./derive-profile";

// 0.2.0 additions ----------------------------------------------------------

// Lab interpretation: turn user-supplied numeric values into bands + flags
export {
  interpretLabs,
  applyLabOverrides,
  labFlagLabel,
  labMarkerDomainLabel,
} from "./lab-interpreter";
export type {
  LabFlag,
  LabInterpretation,
  LabResultSet,
  LabValue,
} from "./lab-interpreter";

// Lab marker definitions, units, and reference ranges
export {
  LAB_MARKERS,
  findMarker,
  selectRange,
  bandValue,
  labBandLabel,
} from "./lab-markers";
export type {
  LabUnit,
  UnitOption,
  LabBand,
  ReferenceRange,
  LabMarkerDomain,
  LabMarker,
} from "./lab-markers";

// Annual physical prep sheet
export {
  buildPhysicalPrepSheet,
  prepCategoryLabel,
  prepTierLabel,
  prepCadenceDueLabel,
} from "./physical-prep";
export type {
  PrepTier,
  PrepCategory,
  PrepQuestion,
  PrepCadence,
  PrepRedFlag,
  PhysicalPrepSheet,
} from "./physical-prep";

// Shift-pattern planning
export { deriveShiftPlan, isShiftWorker } from "./shift-planner";
export type {
  ShiftPattern,
  ShiftAnchor,
  RotationDayNote,
  ShiftPlan,
} from "./shift-planner";

// Medication review module
export {
  // Catalog
  lookupMedication,
  suggestMedications,
  listCatalog,
  // Classes + sources
  getMedicationClass,
  listMedicationClasses,
  MEDICATION_SOURCES,
  // Symptoms / contexts
  SYMPTOMS,
  CONTEXT_FLAGS,
  getSymptom,
  getContextFlag,
  // Rules
  listRules,
  applyRules,
  // Sheet builder
  MEDICATION_STORE_VERSION,
  buildReviewSheet,
  emptyStore,
  newMedicationId,
  addMedication,
  updateMedication,
  removeMedication,
  setSymptoms,
  setContextFlags,
} from "./medications";
export type {
  Medication,
  MedicationClass,
  MedicationClassId,
  MedicationStoreV1,
  ReviewPrompt,
  ReviewSheet,
  Symptom,
  SymptomId,
  ContextFlag,
  ContextFlagId,
  PromptTier,
  SourceCitation,
  SourceId,
  CatalogEntry,
  CatalogMatch,
  BuildOptions,
} from "./medications";

// 0.3.0 additions ----------------------------------------------------------

// Reaction-pattern classifier (symptom & trigger log). Classifies symptom
// + timing + suspected-food answers into one of seven pattern labels,
// emits a public list of hard exclusions for any self-trial worksheet,
// and exposes the worksheet's tier-B/C/D trigger specs + per-trigger
// gates so downstream consumers can build their own worksheet UIs.
export {
  classifyPattern,
  listExclusions,
  hasHardExclusion,
  patternGuidance,
  triggerSpec,
  triggerGate,
  allowedTriggers,
  PATTERN_LABEL,
  PATTERN_BAND_CLASS,
  TRIGGER_SPECS,
  EMPTY_LOG_ANSWERS,
} from "./reaction-pattern";
export type {
  LogAnswers,
  PatternClassification,
  ExclusionReason,
  ExclusionReasonId,
  SymptomKey,
  TimingKey,
  HivesDuration,
  PhysicalTrigger,
  RhinitisPattern,
  SuspectedFood,
  CoeliacStatus,
  PriorEliminationOutcome,
  FamilyHistoryItem,
  YesNo,
  TriggerEvidence,
  TriggerSpec,
  NextStep,
  PatternGuidance,
} from "./reaction-pattern";

// Family Health History — pattern detection over a user-built pedigree.
// Outputs are discussion prompts (clinician / genetic counselor), never
// determinations. Ships with `BANNED_DETERMINATION_PHRASES` +
// `enforceFirewall` as an auditable safety contract, and structured
// `GuidelineCitation` records (the canonical pattern going forward).
export {
  detectSignals,
  enforceFirewall,
  isFirstDegree,
  isSecondDegree,
  buildReport,
  whatsMissing,
  buildQuestionsForRelatives,
  standardLifestylePrompts,
  summariseRelative,
  summariseGeneticTest,
  parseFamilyHistoryAnswers,
  relationshipLabel,
  labelForCancer,
  BANNED_DETERMINATION_PHRASES,
  EMPTY_FAMILY_HISTORY,
  CITATIONS as FAMILY_HISTORY_CITATIONS,
  REVIEW_DATE as FAMILY_HISTORY_CITATIONS_REVIEWED_AT,
  CAUSE_LABELS,
  CANCER_LABELS,
  DIAGNOSIS_LABELS,
  RELATIONSHIP_LABELS,
  SIDE_LABELS,
} from "./family-history";
export type {
  FamilyHistoryAnswers,
  FamilyHistorySelf,
  Relative,
  DiagnosisDuringLife,
  KnownGeneticTest,
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
  GuidelineSource,
  GuidelineCitation,
  FamilyPatternSignalId,
  FamilyPatternSignal,
  MissingItem,
  RelativeQuestion,
  FamilyHistoryReport,
} from "./family-history";
