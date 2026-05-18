// ----------------------------------------------------------------------------
// Family Health History — human-readable label tables.
//
// These map enum values (CauseOfDeath, CancerType, DiagnosisCondition,
// Relationship, Side) to display strings. UIs are free to substitute their
// own translations; the labels here are the engine's default English copy.
// ----------------------------------------------------------------------------

import type {
  CancerType,
  CauseOfDeath,
  DiagnosisCondition,
  Relationship,
  Relative,
  Side,
} from "./types";

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  parent: "parent",
  sibling: "sibling",
  child: "child",
  grandparent: "grandparent",
  aunt_uncle: "aunt or uncle",
  half_sibling: "half-sibling",
  niece_nephew: "niece or nephew",
  great_grandparent: "great-grandparent",
  cousin: "cousin",
  self: "self",
};

export const SIDE_LABELS: Record<Side, string> = {
  paternal: "paternal",
  maternal: "maternal",
  self: "self",
  shared: "",
};

export function relationshipLabel(r: Relative): string {
  const base = RELATIONSHIP_LABELS[r.relationship] ?? r.relationship;
  const side = SIDE_LABELS[r.side];
  if (!side) return base;
  return `${side} ${base}`;
}

export const CAUSE_LABELS: Record<CauseOfDeath, string> = {
  cv_heart_attack: "Heart attack",
  cv_sudden_cardiac: "Sudden cardiac death",
  cv_heart_failure: "Heart failure",
  cv_stroke_ischemic: "Stroke (ischemic)",
  cv_stroke_hemorrhagic: "Stroke (hemorrhagic / brain bleed)",
  cv_stroke_unknown: "Stroke (type unknown)",
  cv_aortic_thoracic: "Thoracic aortic aneurysm or dissection",
  cv_aortic_abdominal: "Abdominal aortic aneurysm",
  cv_aortic_unknown_location: "Aneurysm (location unknown)",
  cv_pulmonary_embolism: "Pulmonary embolism",
  cv_other: "Other cardiovascular",
  cancer: "Cancer (type below)",
  cancer_unknown_type: "Cancer (type unknown)",
  endo_t1d_complications: "Complications of type-1 diabetes",
  endo_t2d_complications: "Complications of type-2 diabetes",
  endo_other: "Other endocrine",
  resp_copd: "COPD / emphysema",
  resp_pneumonia: "Pneumonia",
  resp_other: "Other respiratory",
  neuro_alzheimers: "Alzheimer's disease",
  neuro_other_dementia: "Other dementia",
  neuro_parkinsons: "Parkinson's disease",
  neuro_als: "ALS / motor neuron disease",
  neuro_huntington: "Huntington's disease",
  neuro_other: "Other neurological",
  liver_cirrhosis: "Cirrhosis / liver failure",
  kidney_failure: "Kidney failure",
  hepatorenal_other: "Other liver / kidney",
  inf_sepsis: "Sepsis / infection",
  inf_covid: "COVID-19",
  inf_tb: "Tuberculosis",
  inf_hiv: "HIV/AIDS-related",
  inf_other: "Other infectious",
  ext_accident: "Accident / injury",
  ext_suicide: "Suicide",
  ext_homicide: "Homicide",
  ext_overdose: "Overdose",
  natural_old_age: "Natural causes / old age",
  childbirth_related: "Childbirth-related",
  other_specify: "Other (specified)",
  unknown: "Unknown",
};

export const CANCER_LABELS: Record<CancerType, string> = {
  breast: "breast cancer",
  ovarian: "ovarian cancer",
  uterine_endometrial: "uterine / endometrial cancer",
  cervical: "cervical cancer",
  prostate: "prostate cancer",
  colorectal: "colorectal cancer",
  stomach_gastric: "gastric cancer",
  pancreatic: "pancreatic cancer",
  liver: "liver cancer",
  lung: "lung cancer",
  kidney_renal: "kidney cancer",
  bladder: "bladder cancer",
  thyroid: "thyroid cancer",
  brain_cns: "brain / CNS cancer",
  melanoma: "melanoma",
  leukemia: "leukemia",
  lymphoma: "lymphoma",
  multiple_myeloma: "multiple myeloma",
  sarcoma: "sarcoma",
  small_bowel: "small-bowel cancer",
  urothelial: "urothelial cancer",
  biliary: "biliary cancer",
  other: "cancer (other)",
  unknown_type: "cancer (type unknown)",
};

export const DIAGNOSIS_LABELS: Record<DiagnosisCondition, string> = {
  cancer: "Cancer",
  myocardial_infarction: "Heart attack",
  stroke: "Stroke",
  thoracic_aortic_aneurysm_or_dissection: "Thoracic aortic aneurysm or dissection",
  abdominal_aortic_aneurysm: "Abdominal aortic aneurysm",
  type_1_diabetes: "Type-1 diabetes",
  type_2_diabetes: "Type-2 diabetes",
  very_high_cholesterol_young: "Very high cholesterol from a young age",
  familial_hypercholesterolemia_known: "Familial hypercholesterolemia (known)",
  early_onset_dementia: "Early-onset dementia (<65)",
  alzheimers: "Alzheimer's disease",
  parkinsons: "Parkinson's disease",
  huntingtons: "Huntington's disease",
  polycystic_kidney_disease: "Polycystic kidney disease",
  hereditary_haemochromatosis: "Hereditary haemochromatosis",
  cardiomyopathy: "Cardiomyopathy",
  long_qt_or_arrhythmia_syndrome: "Long QT or arrhythmia syndrome",
  advanced_adenoma_or_polyp: "Advanced adenoma or large/serrated polyp",
  other: "Other",
};

export function labelForCancer(r: Relative): string {
  for (const d of r.diagnoses) {
    if (d.condition === "cancer" && d.cancerType) return CANCER_LABELS[d.cancerType];
  }
  if (r.causeOfDeath === "cancer" && r.causeOfDeathCancerType) {
    return CANCER_LABELS[r.causeOfDeathCancerType];
  }
  return "cancer";
}

export function capitalise(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
