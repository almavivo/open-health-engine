import { MEDICATION_SOURCES } from "./classes";
import type {
  ContextFlagId,
  Medication,
  MedicationClassId,
  PromptTier,
  ReviewPrompt,
  SymptomId,
} from "./types";

// ---------------------------------------------------------------------------
// Review-prompt rules
// ---------------------------------------------------------------------------
// Each rule pairs a class+symptom+context predicate with a question the user
// should ask their clinician. Every rule cites a published source. The rules
// produce QUESTIONS to ask, not answers.
//
// Adding a rule:
//   1. Pick the class(es) that gate the rule.
//   2. Pick any symptoms or context flags that further gate it.
//   3. Write a question phrased as something the user reads aloud.
//   4. Add a one-line rationale ("why").
//   5. Cite the source. If you can't cite a published source, the rule
//      doesn't ship.
// ---------------------------------------------------------------------------

export interface RuleInput {
  prescription: Medication[];
  otcAndSupplements: Medication[];
  symptomIds: Set<SymptomId>;
  contextIds: Set<ContextFlagId>;
}

interface RuleContext extends RuleInput {
  /** All confirmed-class medications (Rx + OTC + supplements). */
  allMeds: Medication[];
  /** Medications grouped by confirmed class. */
  byClass: Map<MedicationClassId, Medication[]>;
}

export interface ReviewRule {
  id: string;
  tier: PromptTier;
  question: string;
  why: string;
  sourceId: keyof typeof MEDICATION_SOURCES;
  applies: (ctx: RuleContext) => { medicationIds: string[]; classIds: MedicationClassId[] } | null;
  triggeredSymptoms?: SymptomId[];
  triggeredContexts?: ContextFlagId[];
}

function hasClass(ctx: RuleContext, id: MedicationClassId): Medication[] {
  return ctx.byClass.get(id) ?? [];
}

function anyClass(ctx: RuleContext, ids: MedicationClassId[]): Medication[] {
  return ids.flatMap((id) => hasClass(ctx, id));
}

const RULES: ReviewRule[] = [
  // ---------- Polypharmacy ----------
  {
    id: "polypharmacy_smr",
    tier: "important",
    question:
      "I take several medicines. Could we book a structured medication review to go through whether each is still needed?",
    why: "NHS England recommends a structured medication review when someone is on five or more regular medicines.",
    sourceId: "nhsSmr",
    triggeredContexts: ["five_or_more_meds"],
    applies: (ctx) => {
      const total = ctx.prescription.length + ctx.otcAndSupplements.length;
      if (ctx.contextIds.has("five_or_more_meds") || total >= 5) {
        return {
          medicationIds: ctx.allMeds.map((m) => m.id),
          classIds: [],
        };
      }
      return null;
    },
  },

  // ---------- PPIs ----------
  {
    id: "ppi_long_term",
    tier: "recommended",
    question:
      "I've been on a PPI for a while — can we discuss whether long-term use is still needed, and whether B12 or magnesium should be checked?",
    why: "NHS deprescribing guidance recommends periodic review of long-term PPI use; long-term use is associated with B12 and magnesium effects.",
    sourceId: "nhsDeprescribing",
    applies: (ctx) => {
      const meds = hasClass(ctx, "ppi");
      if (meds.length === 0) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["ppi"] };
    },
  },

  // ---------- Benzodiazepines / Z-drugs ----------
  {
    id: "benzo_or_zdrug_falls",
    tier: "important",
    question:
      "I take a sleep or anxiety medicine and I've had falls — can we review whether this medicine is still right for me?",
    why: "STOPP/START flags benzodiazepines and Z-drugs as medicines to review when there is a history of falls.",
    sourceId: "stopp",
    triggeredSymptoms: ["falls"],
    applies: (ctx) => {
      const meds = anyClass(ctx, ["benzodiazepine", "z_drug"]);
      if (meds.length === 0 || !ctx.symptomIds.has("falls")) return null;
      return {
        medicationIds: meds.map((m) => m.id),
        classIds: ["benzodiazepine", "z_drug"],
      };
    },
  },
  {
    id: "benzo_long_term",
    tier: "recommended",
    question:
      "I take a benzodiazepine — can we talk about whether long-term use is still appropriate and what tapering would look like?",
    why: "STOPP/START and NHS deprescribing both recommend periodic review of long-term benzodiazepine use.",
    sourceId: "stopp",
    applies: (ctx) => {
      const meds = hasClass(ctx, "benzodiazepine");
      if (meds.length === 0) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["benzodiazepine"] };
    },
  },
  {
    id: "zdrug_long_term",
    tier: "recommended",
    question: "I take a Z-drug for sleep — can we talk about long-term use and alternatives?",
    why: "NHS deprescribing guidance recommends periodic review of long-term Z-drug use.",
    sourceId: "nhsDeprescribing",
    applies: (ctx) => {
      const meds = hasClass(ctx, "z_drug");
      if (meds.length === 0) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["z_drug"] };
    },
  },

  // ---------- Anticholinergic burden ----------
  {
    id: "anticholinergic_burden",
    tier: "recommended",
    question:
      "I take medicines that can have anticholinergic effects, and I've had dry mouth or confusion — can we review the cumulative load?",
    why: "STOPP/START flags cumulative anticholinergic burden, particularly when symptoms like dry mouth or confusion are present.",
    sourceId: "stopp",
    triggeredSymptoms: ["dry_mouth", "confusion"],
    applies: (ctx) => {
      const meds = anyClass(ctx, [
        "anticholinergic",
        "first_gen_antihistamine",
        "tricyclic_antidepressant",
        "anticholinergic_overactive_bladder",
        "muscle_relaxant",
      ]);
      const symptomTouched = ctx.symptomIds.has("dry_mouth") || ctx.symptomIds.has("confusion");
      if (meds.length === 0 || !symptomTouched) return null;
      return {
        medicationIds: meds.map((m) => m.id),
        classIds: [
          "anticholinergic",
          "first_gen_antihistamine",
          "tricyclic_antidepressant",
          "anticholinergic_overactive_bladder",
          "muscle_relaxant",
        ],
      };
    },
  },

  // ---------- Anticoagulant / antiplatelet + bruising ----------
  {
    id: "anticoag_bruising",
    tier: "important",
    question:
      "I take a blood thinner and I've noticed easy bruising or bleeding — can we discuss whether this should be reviewed?",
    why: "Easy bruising on an anticoagulant or antiplatelet warrants clinician review.",
    sourceId: "niceNG196",
    triggeredSymptoms: ["bruising"],
    applies: (ctx) => {
      const meds = anyClass(ctx, ["anticoagulant", "antiplatelet"]);
      if (meds.length === 0 || !ctx.symptomIds.has("bruising")) return null;
      return {
        medicationIds: meds.map((m) => m.id),
        classIds: ["anticoagulant", "antiplatelet"],
      };
    },
  },
  {
    id: "anticoag_supplement_review",
    tier: "important",
    question:
      "I want to make sure none of the supplements or OTC medicines I take interact with my blood thinner — can we go through the list together?",
    why: "Anticoagulants have known interactions with several common supplements and OTC products; a pharmacist is the authoritative source.",
    sourceId: "niceNG196",
    applies: (ctx) => {
      const meds = anyClass(ctx, ["anticoagulant", "antiplatelet"]);
      if (meds.length === 0) return null;
      if (ctx.otcAndSupplements.length === 0) return null;
      return {
        medicationIds: meds.map((m) => m.id).concat(ctx.otcAndSupplements.map((m) => m.id)),
        classIds: ["anticoagulant", "antiplatelet"],
      };
    },
  },
  {
    id: "anticoag_with_nsaid",
    tier: "important",
    question:
      "I take both a blood thinner and an NSAID — can we discuss whether this combination is right for me?",
    why: "Combining anticoagulants or antiplatelets with NSAIDs increases bleeding risk; pharmacist review is appropriate.",
    sourceId: "stopp",
    applies: (ctx) => {
      const blood = anyClass(ctx, ["anticoagulant", "antiplatelet"]);
      const nsaid = hasClass(ctx, "nsaid");
      if (blood.length === 0 || nsaid.length === 0) return null;
      return {
        medicationIds: [...blood, ...nsaid].map((m) => m.id),
        classIds: ["anticoagulant", "antiplatelet", "nsaid"],
      };
    },
  },

  // ---------- Opioid review ----------
  {
    id: "opioid_long_term",
    tier: "recommended",
    question:
      "I take an opioid — can we discuss whether long-term use should be reviewed?",
    why: "NHS deprescribing guidance recommends periodic review of long-term opioid use; STOPP also flags it.",
    sourceId: "nhsDeprescribing",
    applies: (ctx) => {
      const meds = hasClass(ctx, "opioid");
      if (meds.length === 0) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["opioid"] };
    },
  },

  // ---------- Metformin + B12 ----------
  {
    id: "metformin_b12",
    tier: "recommended",
    question: "I've been on metformin for a while — can we check my B12?",
    why: "Long-term metformin use can lower vitamin B12 in a meaningful proportion of users; periodic monitoring is reasonable.",
    sourceId: "niceNG28",
    applies: (ctx) => {
      const meds = hasClass(ctx, "metformin");
      if (meds.length === 0) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["metformin"] };
    },
  },

  // ---------- Sulfonylurea + falls/confusion ----------
  {
    id: "sulfonylurea_review",
    tier: "recommended",
    question:
      "I take a sulfonylurea for diabetes — given my situation, can we discuss whether this should be reviewed and what monitoring is appropriate?",
    why: "Beers and STOPP flag sulfonylureas (especially long-acting) as a class to review when there are concerns about hypoglycaemia risk.",
    sourceId: "stopp",
    applies: (ctx) => {
      const meds = hasClass(ctx, "sulfonylurea");
      if (meds.length === 0) return null;
      const concerning =
        ctx.symptomIds.has("falls") ||
        ctx.symptomIds.has("dizziness") ||
        ctx.symptomIds.has("confusion") ||
        ctx.contextIds.has("over_75");
      if (!concerning) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["sulfonylurea"] };
    },
  },

  // ---------- Levothyroxine timing ----------
  {
    id: "levothyroxine_timing",
    tier: "consider",
    question:
      "I take levothyroxine — can we double-check the timing relative to other medicines and supplements (calcium, iron, PPIs)?",
    why: "Levothyroxine absorption is reduced by several common medicines and supplements; timing matters.",
    sourceId: "ata2014",
    applies: (ctx) => {
      const meds = hasClass(ctx, "levothyroxine");
      if (meds.length === 0) return null;
      const conflictClasses: MedicationClassId[] = ["ppi", "h2_blocker"];
      const hasConflict = conflictClasses.some((c) => hasClass(ctx, c).length > 0);
      const hasSupplements = ctx.otcAndSupplements.length > 0;
      if (!hasConflict && !hasSupplements) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["levothyroxine"] };
    },
  },

  // ---------- Diuretic + dizziness ----------
  {
    id: "diuretic_dizziness",
    tier: "recommended",
    question:
      "I take a water-pill and I've had dizziness or lightheadedness — can we check my blood pressure and electrolytes?",
    why: "Diuretics can cause low blood pressure and electrolyte changes; symptoms like dizziness warrant a check.",
    sourceId: "niceCG182",
    triggeredSymptoms: ["dizziness"],
    applies: (ctx) => {
      const meds = anyClass(ctx, ["diuretic_loop", "diuretic_thiazide"]);
      if (meds.length === 0 || !ctx.symptomIds.has("dizziness")) return null;
      return {
        medicationIds: meds.map((m) => m.id),
        classIds: ["diuretic_loop", "diuretic_thiazide"],
      };
    },
  },

  // ---------- ACE/ARB + persistent cough ----------
  {
    id: "ace_cough",
    tier: "recommended",
    question:
      "I take an ACE inhibitor and I've had a persistent dry cough — can we discuss whether the cough might be related?",
    why: "ACE inhibitors are a recognised cause of persistent dry cough; ARBs are an alternative if appropriate.",
    sourceId: "niceNG136",
    triggeredSymptoms: ["persistent_cough"],
    applies: (ctx) => {
      const meds = hasClass(ctx, "ace_inhibitor");
      if (meds.length === 0 || !ctx.symptomIds.has("persistent_cough")) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["ace_inhibitor"] };
    },
  },

  // ---------- Statin + muscle aches ----------
  {
    id: "statin_muscle",
    tier: "recommended",
    question:
      "I take a statin and I've had muscle aches — can we discuss whether the aches might be related and whether this should be reviewed?",
    why: "Statins can cause muscle symptoms in a minority of users; a clinician can decide whether further review is appropriate.",
    sourceId: "niceCG181",
    triggeredSymptoms: ["muscle_aches"],
    applies: (ctx) => {
      const meds = hasClass(ctx, "statin");
      if (meds.length === 0 || !ctx.symptomIds.has("muscle_aches")) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["statin"] };
    },
  },

  // ---------- Steroid + bone ----------
  {
    id: "steroid_bone",
    tier: "recommended",
    question:
      "I take an oral steroid — can we discuss whether bone health should be reviewed given the duration of treatment?",
    why: "Long-term oral corticosteroids are associated with bone-density loss; review of bone health is standard practice.",
    sourceId: "nice",
    applies: (ctx) => {
      const meds = hasClass(ctx, "corticosteroid_systemic");
      if (meds.length === 0) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["corticosteroid_systemic"] };
    },
  },

  // ---------- Antipsychotic in older adult ----------
  {
    id: "antipsychotic_older",
    tier: "important",
    question:
      "I take an antipsychotic — given my age, can we review whether this is still the right medicine for me?",
    why: "Beers Criteria flag antipsychotics for cautious use in older adults, particularly when used off-label for sleep or behaviour.",
    sourceId: "beers",
    triggeredContexts: ["over_75"],
    applies: (ctx) => {
      const meds = hasClass(ctx, "antipsychotic");
      if (meds.length === 0 || !ctx.contextIds.has("over_75")) return null;
      return { medicationIds: meds.map((m) => m.id), classIds: ["antipsychotic"] };
    },
  },

  // ---------- Pregnancy / planning ----------
  {
    id: "pregnancy_review",
    tier: "important",
    question:
      "I am pregnant or planning pregnancy — can we review every medicine I take to confirm each is appropriate in this context?",
    why: "Several medicines have specific guidance in pregnancy; a clinician should review each one explicitly.",
    sourceId: "bnfPregnancy",
    triggeredContexts: ["pregnant_or_planning", "breastfeeding"],
    applies: (ctx) => {
      const inContext =
        ctx.contextIds.has("pregnant_or_planning") || ctx.contextIds.has("breastfeeding");
      if (!inContext) return null;
      if (ctx.allMeds.length === 0) return null;
      return { medicationIds: ctx.allMeds.map((m) => m.id), classIds: [] };
    },
  },

  // ---------- Recent hospital discharge ----------
  {
    id: "post_discharge_reconciliation",
    tier: "important",
    question:
      "I was recently discharged from hospital — can we go through which medicines were started in hospital and confirm which should continue, stop, or change?",
    why: "Post-discharge medication reconciliation is a recognised priority; new in-hospital medicines are a known source of unintended continuation.",
    sourceId: "nice",
    triggeredContexts: ["recent_hospital_discharge"],
    applies: (ctx) => {
      if (!ctx.contextIds.has("recent_hospital_discharge")) return null;
      if (ctx.allMeds.length === 0) return null;
      return { medicationIds: ctx.allMeds.map((m) => m.id), classIds: [] };
    },
  },

  // ---------- Multiple prescribers ----------
  {
    id: "multiple_prescribers",
    tier: "recommended",
    question:
      "I see more than one prescriber. Can we make sure my full medicine list is on record with each of them?",
    why: "Multiple prescribers is a recognised driver of unintended polypharmacy; record reconciliation reduces it.",
    sourceId: "nhsSmr",
    triggeredContexts: ["multiple_prescribers"],
    applies: (ctx) => {
      if (!ctx.contextIds.has("multiple_prescribers")) return null;
      if (ctx.allMeds.length === 0) return null;
      return { medicationIds: ctx.allMeds.map((m) => m.id), classIds: [] };
    },
  },

  // ---------- Kidney/liver context ----------
  {
    id: "renal_hepatic_context",
    tier: "recommended",
    question:
      "I have kidney or liver disease — can we confirm each medicine is at an appropriate dose for me?",
    why: "Several medicines need adjustment in kidney or liver impairment; pharmacist review is standard.",
    sourceId: "nice",
    triggeredContexts: ["kidney_or_liver_disease"],
    applies: (ctx) => {
      if (!ctx.contextIds.has("kidney_or_liver_disease")) return null;
      if (ctx.allMeds.length === 0) return null;
      return { medicationIds: ctx.allMeds.map((m) => m.id), classIds: [] };
    },
  },

  // ---------- General "still know why" ----------
  {
    id: "still_know_why",
    tier: "recommended",
    question:
      "There are some medicines I take where I'm not sure why — can we go through each and confirm the reason?",
    why: "Knowing the indication for every regular medicine is a foundation of any structured medication review.",
    sourceId: "nhsSmr",
    applies: (ctx) => {
      const unsure = ctx.allMeds.filter((m) => m.stillKnowWhy === "no" || m.stillKnowWhy === "unsure");
      if (unsure.length === 0) return null;
      return { medicationIds: unsure.map((m) => m.id), classIds: [] };
    },
  },
];

export function listRules(): ReviewRule[] {
  return RULES;
}

export function applyRules(input: RuleInput): ReviewPrompt[] {
  const allMeds = [...input.prescription, ...input.otcAndSupplements].filter(
    (m) => m.classConfirmed && m.matchedClassId,
  );
  const allMedsIncludingUnclassified = [...input.prescription, ...input.otcAndSupplements];

  const byClass = new Map<MedicationClassId, Medication[]>();
  for (const m of allMeds) {
    if (!m.matchedClassId) continue;
    const existing = byClass.get(m.matchedClassId) ?? [];
    existing.push(m);
    byClass.set(m.matchedClassId, existing);
  }

  const ctx: RuleContext = {
    ...input,
    allMeds: allMedsIncludingUnclassified,
    byClass,
  };

  const prompts: ReviewPrompt[] = [];
  for (const rule of RULES) {
    const result = rule.applies(ctx);
    if (!result) continue;
    const sourceKey = rule.sourceId as keyof typeof MEDICATION_SOURCES;
    const source = MEDICATION_SOURCES[sourceKey];
    prompts.push({
      id: rule.id,
      tier: rule.tier,
      question: rule.question,
      why: rule.why,
      source,
      triggeredBy: {
        medicationIds: result.medicationIds,
        classIds: result.classIds,
        symptomIds: (rule.triggeredSymptoms ?? []).filter((s) => input.symptomIds.has(s)),
        contextIds: (rule.triggeredContexts ?? []).filter((c) => input.contextIds.has(c)),
      },
    });
  }

  // Order by tier, then preserve rule order within tier.
  const tierOrder: Record<PromptTier, number> = { important: 0, recommended: 1, consider: 2 };
  prompts.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  return prompts;
}
