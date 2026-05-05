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
