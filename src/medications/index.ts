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
} from "./types";
export { MEDICATION_STORE_VERSION } from "./types";

export { getMedicationClass, listMedicationClasses, MEDICATION_SOURCES } from "./classes";
export { lookupMedication, suggestMedications, listCatalog } from "./catalog";
export type { CatalogEntry, CatalogMatch } from "./catalog";
export { SYMPTOMS, CONTEXT_FLAGS, getSymptom, getContextFlag } from "./symptoms";
export { listRules, applyRules } from "./rules";
export {
  buildReviewSheet,
  emptyStore,
  newMedicationId,
  addMedication,
  updateMedication,
  removeMedication,
  setSymptoms,
  setContextFlags,
} from "./build-sheet";
export type { BuildOptions } from "./build-sheet";
