import type { ContextFlag, Symptom } from "./types";

// ---------------------------------------------------------------------------
// Symptom and context-flag catalogs
// ---------------------------------------------------------------------------
// Both catalogs are deliberately short. They feed the rules engine and they
// are listed verbatim on the printed sheet under "things to mention." No
// diagnostic interpretation is rendered.
// ---------------------------------------------------------------------------

export const SYMPTOMS: Symptom[] = [
  {
    id: "dizziness",
    label: "Dizziness or lightheadedness",
    hint: "Especially when standing up.",
  },
  {
    id: "falls",
    label: "Falls in the last 12 months",
    hint: "Any fall, even if you didn't get hurt.",
  },
  {
    id: "dry_mouth",
    label: "Dry mouth",
    hint: "Persistent, not just occasional.",
  },
  {
    id: "constipation",
    label: "Constipation",
    hint: "New or worsening.",
  },
  {
    id: "confusion",
    label: "Confusion or memory changes",
    hint: "New or worsening, noticed by you or others.",
  },
  {
    id: "drowsiness",
    label: "Daytime drowsiness",
    hint: "Sleepy during the day or struggling to stay alert.",
  },
  {
    id: "bruising",
    label: "Easy bruising or bleeding",
    hint: "Bruises with no clear cause, nosebleeds, gum bleeding.",
  },
  {
    id: "frequent_urination",
    label: "Frequent or urgent urination",
    hint: "More often than usual, including at night.",
  },
  {
    id: "low_mood",
    label: "Low mood or loss of interest",
    hint: "More days than not, in the last few weeks.",
  },
  {
    id: "poor_sleep",
    label: "Poor sleep",
    hint: "Difficulty falling or staying asleep.",
  },
  {
    id: "persistent_cough",
    label: "Persistent dry cough",
    hint: "Lasting more than a few weeks, no clear cause.",
  },
  {
    id: "swollen_ankles",
    label: "Swollen ankles or feet",
    hint: "New or worsening swelling.",
  },
  {
    id: "muscle_aches",
    label: "Unexplained muscle aches or weakness",
    hint: "Particularly if recent.",
  },
  {
    id: "appetite_loss",
    label: "Loss of appetite",
    hint: "Persistent, not just occasional.",
  },
];

export const CONTEXT_FLAGS: ContextFlag[] = [
  {
    id: "five_or_more_meds",
    label: "I take 5 or more medications regularly",
    hint: "Including OTC and supplements. NHS calls this polypharmacy.",
  },
  {
    id: "pregnant_or_planning",
    label: "Pregnant or planning pregnancy",
    hint: "Your pharmacist will want to review every medicine in this context.",
  },
  {
    id: "breastfeeding",
    label: "Breastfeeding",
    hint: "Your pharmacist will want to review every medicine in this context.",
  },
  {
    id: "recent_hospital_discharge",
    label: "Recently discharged from hospital",
    hint: "New medicines started in hospital are a known review priority.",
  },
  {
    id: "multiple_prescribers",
    label: "I see more than one prescriber",
    hint: "Different doctors may not always know what the others have prescribed.",
  },
  {
    id: "kidney_or_liver_disease",
    label: "I have kidney or liver disease",
    hint: "Some medicines need adjustment in this case — your pharmacist will know.",
  },
  {
    id: "over_75",
    label: "I am 75 or older",
    hint: "Some medicines have specific guidance for this age group.",
  },
];

const SYMPTOM_BY_ID: Record<string, Symptom> = SYMPTOMS.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, Symptom>,
);

const CONTEXT_BY_ID: Record<string, ContextFlag> = CONTEXT_FLAGS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<string, ContextFlag>,
);

export function getSymptom(id: string): Symptom | undefined {
  return SYMPTOM_BY_ID[id];
}

export function getContextFlag(id: string): ContextFlag | undefined {
  return CONTEXT_BY_ID[id];
}
