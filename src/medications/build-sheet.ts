import { CONTEXT_FLAGS, SYMPTOMS, getContextFlag, getSymptom } from "./symptoms";
import { applyRules } from "./rules";
import type {
  ContextFlag,
  ContextFlagId,
  Medication,
  MedicationStoreV1,
  ReviewSheet,
  Symptom,
  SymptomId,
} from "./types";

// ---------------------------------------------------------------------------
// Build the printable review sheet from the persisted store.
// ---------------------------------------------------------------------------

const PEDIATRIC_NOTICE =
  "This sheet is built for adults. For under-18s, please speak with a paediatrician or family doctor — children's medication review follows age-specific protocols not modelled here.";

export interface BuildOptions {
  /** Optional age band hint from the active profile, used only for the
   * pediatric guard — the medication-review tool does not otherwise
   * personalise based on age. */
  ageBandHint?: string;
}

export function buildReviewSheet(
  store: MedicationStoreV1,
  options: BuildOptions = {},
): ReviewSheet {
  if (options.ageBandHint === "under_18") {
    return {
      hasContent: true,
      prescription: [],
      otcAndSupplements: [],
      symptoms: [],
      contextFlags: [],
      prompts: [],
      pediatricNotice: PEDIATRIC_NOTICE,
      generatedAt: Date.now(),
    };
  }

  const prescription = store.medications.filter((m) => m.kind === "prescription");
  const otcAndSupplements = store.medications.filter(
    (m) => m.kind === "otc" || m.kind === "supplement",
  );

  const symptomIds = new Set<SymptomId>(store.symptomIds);
  const contextIds = new Set<ContextFlagId>(store.contextFlagIds);

  const symptoms: Symptom[] = [];
  for (const id of store.symptomIds) {
    const s = getSymptom(id);
    if (s) symptoms.push(s);
  }
  // Preserve catalog ordering for printed sheet
  symptoms.sort((a, b) => SYMPTOMS.findIndex((x) => x.id === a.id) - SYMPTOMS.findIndex((x) => x.id === b.id));

  const contextFlags: ContextFlag[] = [];
  for (const id of store.contextFlagIds) {
    const c = getContextFlag(id);
    if (c) contextFlags.push(c);
  }
  contextFlags.sort(
    (a, b) =>
      CONTEXT_FLAGS.findIndex((x) => x.id === a.id) -
      CONTEXT_FLAGS.findIndex((x) => x.id === b.id),
  );

  const prompts = applyRules({
    prescription,
    otcAndSupplements,
    symptomIds,
    contextIds,
  });

  const hasContent =
    prescription.length > 0 ||
    otcAndSupplements.length > 0 ||
    symptoms.length > 0 ||
    contextFlags.length > 0 ||
    prompts.length > 0;

  return {
    hasContent,
    prescription,
    otcAndSupplements,
    symptoms,
    contextFlags,
    prompts,
    generatedAt: Date.now(),
  };
}

export function emptyStore(): MedicationStoreV1 {
  return {
    version: 1,
    medications: [],
    symptomIds: [],
    contextFlagIds: [],
    updatedAt: Date.now(),
  };
}

export function newMedicationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function addMedication(store: MedicationStoreV1, med: Medication): MedicationStoreV1 {
  return {
    ...store,
    medications: [...store.medications, med],
    updatedAt: Date.now(),
  };
}

export function updateMedication(
  store: MedicationStoreV1,
  id: string,
  patch: Partial<Medication>,
): MedicationStoreV1 {
  return {
    ...store,
    medications: store.medications.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    updatedAt: Date.now(),
  };
}

export function removeMedication(store: MedicationStoreV1, id: string): MedicationStoreV1 {
  return {
    ...store,
    medications: store.medications.filter((m) => m.id !== id),
    updatedAt: Date.now(),
  };
}

export function setSymptoms(store: MedicationStoreV1, ids: SymptomId[]): MedicationStoreV1 {
  return {
    ...store,
    symptomIds: ids,
    updatedAt: Date.now(),
  };
}

export function setContextFlags(store: MedicationStoreV1, ids: ContextFlagId[]): MedicationStoreV1 {
  return {
    ...store,
    contextFlagIds: ids,
    updatedAt: Date.now(),
  };
}
