// ----------------------------------------------------------------------------
// Family Health History — report assembly.
//
// `buildReport` is the convenience aggregator that produces the full
// report shape consumed by downstream UIs (on-screen + print). The
// "What's missing" and "Questions to ask relatives" outputs are first-
// class deliverables — they're the most useful part of the report for
// adopted / estranged / donor-conceived users whose pedigrees are
// inherently incomplete.
// ----------------------------------------------------------------------------

import { detectSignals } from "./rules";
import {
  CANCER_LABELS,
  CAUSE_LABELS,
  DIAGNOSIS_LABELS,
  capitalise,
  relationshipLabel,
} from "./labels";
import type {
  FamilyHistoryAnswers,
  FamilyHistoryReport,
  GeneticTestCondition,
  GeneticTestResult,
  GeneticTestVariantContext,
  KnownGeneticTest,
  MissingItem,
  Relative,
  RelativeQuestion,
  Side,
} from "./types";

function bySide(relatives: Relative[]): Record<Side, Relative[]> {
  const out: Record<Side, Relative[]> = {
    paternal: [],
    maternal: [],
    self: [],
    shared: [],
  };
  for (const r of relatives) out[r.side].push(r);
  return out;
}

// ----------------------------------------------------------------------------
// What's-missing analysis
//
// Surfaces the gaps that prevented a signal from firing, or that downgraded
// it to an ambiguous category (e.g. "aneurysm, location unknown"). The
// `id` strings are stable for a given input — they include the relative's
// own `id` — so a UI can render diffs across re-runs.
// ----------------------------------------------------------------------------

export function whatsMissing(answers: FamilyHistoryAnswers): MissingItem[] {
  const out: MissingItem[] = [];
  const rels = answers.relatives;
  const sides = bySide(rels);

  if (answers.self.adoptedLimitedHistory) {
    out.push({
      id: "self_adopted",
      description:
        "You've noted limited family history (adopted). The report below is based only on what you do know — clinicians work with that all the time.",
    });
  }
  if (answers.self.donorConceivedLimitedHistory) {
    out.push({
      id: "self_donor",
      description:
        "You've noted limited paternal/biological history (donor-conceived). Patterns from the side you do know remain useful.",
    });
  }

  // Whole-lineage gaps
  if (sides.paternal.length === 0) {
    out.push({
      id: "no_paternal",
      description:
        "No paternal-side relatives have been added. Even a grandparent or aunt with a known cause of death adds useful context.",
    });
  }
  if (sides.maternal.length === 0) {
    out.push({
      id: "no_maternal",
      description: "No maternal-side relatives have been added.",
    });
  }

  for (const r of rels) {
    const who = relationshipLabel(r);
    if (r.status === "deceased" && (!r.causeOfDeath || r.causeOfDeath === "unknown")) {
      out.push({
        id: `cod_unknown_${r.id}`,
        description: `Cause of death unknown for your ${who}. If reachable, ask family — even a rough cause helps.`,
      });
    }
    if (
      r.causeOfDeath === "cv_aortic_unknown_location" ||
      r.causeOfDeath === "cv_stroke_unknown"
    ) {
      out.push({
        id: `cod_imprecise_${r.id}`,
        description: `${capitalise(who)}'s cause of death is recorded as a general category — clarifying (thoracic vs abdominal aneurysm, ischemic vs hemorrhagic stroke) materially changes guidance.`,
      });
    }
    if (r.causeOfDeath === "cancer" && !r.causeOfDeathCancerType) {
      out.push({
        id: `cancer_type_${r.id}`,
        description: `${capitalise(who)} died of cancer of unspecified type. The type and age at diagnosis are the two most useful follow-up questions.`,
      });
    }
    for (const d of r.diagnoses) {
      if (d.condition === "cancer" && (!d.cancerType || d.cancerType === "unknown_type")) {
        out.push({
          id: `dx_cancer_type_${d.id}`,
          description: `${capitalise(who)} had a cancer diagnosis of unspecified type — try to find out which type and at what age.`,
        });
      }
      if (d.ageAtDx === "unknown") {
        out.push({
          id: `dx_age_unknown_${d.id}`,
          description: `${capitalise(who)}'s age at diagnosis is unknown — many guidelines key off early age (e.g. under 50 for several cancers).`,
        });
      }
    }
  }

  return out;
}

// ----------------------------------------------------------------------------
// Questions to ask relatives — built from gaps
// ----------------------------------------------------------------------------

export function buildQuestionsForRelatives(
  answers: FamilyHistoryAnswers,
): RelativeQuestion[] {
  const out: RelativeQuestion[] = [];
  for (const r of answers.relatives) {
    const who = relationshipLabel(r);
    if (r.status === "deceased" && (!r.causeOfDeath || r.causeOfDeath === "unknown")) {
      out.push({
        id: `q_cod_${r.id}`,
        text: `Ask the family: what did ${who} die of, and at what age?`,
      });
    }
    if (r.causeOfDeath === "cancer" && !r.causeOfDeathCancerType) {
      out.push({
        id: `q_cancer_type_${r.id}`,
        text: `Ask: what type of cancer did ${who} have, and how old were they at diagnosis?`,
      });
    }
    if (r.causeOfDeath === "cv_aortic_unknown_location") {
      out.push({
        id: `q_aortic_${r.id}`,
        text: `Ask: was ${who}'s aneurysm in the chest (thoracic) or in the belly (abdominal)? They have very different family implications.`,
      });
    }
    for (const d of r.diagnoses) {
      if (d.condition === "cancer" && (!d.cancerType || d.cancerType === "unknown_type")) {
        out.push({
          id: `q_dx_cancer_${d.id}`,
          text: `Ask: what type of cancer was ${who} diagnosed with, and at what age?`,
        });
      }
    }
  }
  return out;
}

// ----------------------------------------------------------------------------
// Standard lifestyle prompts — generic; renders even when no signals fire
// ----------------------------------------------------------------------------

export function standardLifestylePrompts(): string[] {
  return [
    "Aerobic exercise 150+ minutes per week plus 2× weekly resistance training.",
    "A Mediterranean- or DASH-style eating pattern; both have RCT support for cardiovascular and metabolic outcomes.",
    "Aim for 7+ hours of sleep on a regular schedule.",
    "Limit alcohol; don't smoke.",
    "Keep up with age-appropriate screenings (blood pressure, lipids, colorectal, cervical, etc.) at the intervals your clinician recommends.",
  ];
}

// ----------------------------------------------------------------------------
// Per-relative + per-test natural-language summarisers
// ----------------------------------------------------------------------------

export function summariseRelative(r: Relative): string {
  const who = relationshipLabel(r);
  const bits: string[] = [capitalise(who)];
  if (r.sexAtBirth !== "unknown")
    bits.push(r.sexAtBirth === "female" ? "female" : "male");
  if (r.status === "deceased") {
    const age =
      r.ageAtDeath !== undefined
        ? `, died age ${r.ageAtDeath}`
        : ", died (age unknown)";
    bits.push(age);
    if (r.causeOfDeath) {
      let cause = CAUSE_LABELS[r.causeOfDeath];
      if (r.causeOfDeath === "cancer" && r.causeOfDeathCancerType) {
        cause = `Cancer — ${CANCER_LABELS[r.causeOfDeathCancerType]}`;
      }
      bits.push(`— ${cause}`);
    }
  } else if (r.status === "alive") {
    if (r.currentAge !== undefined) bits.push(`, age ${r.currentAge}`);
  } else if (r.status === "estranged") {
    bits.push(", estranged (limited info)");
  } else if (r.status === "adopted_out_unknown") {
    bits.push(", adopted out (limited info)");
  } else {
    bits.push(", status unknown");
  }
  if (r.diagnoses.length > 0) {
    const dxs = r.diagnoses
      .map((d) => {
        const base =
          d.condition === "cancer" && d.cancerType
            ? CANCER_LABELS[d.cancerType]
            : DIAGNOSIS_LABELS[d.condition];
        const age = d.ageAtDx === "unknown" ? "" : ` (age ${d.ageAtDx})`;
        return `${base}${age}`;
      })
      .join("; ");
    bits.push(`. Diagnoses: ${dxs}`);
  }
  return bits.join("");
}

export function summariseGeneticTest(t: KnownGeneticTest): string {
  const subjectLabel = t.subject === "self" ? "You" : "A relative";
  const conditionLabel: Record<GeneticTestCondition, string> = {
    brca1: "BRCA1",
    brca2: "BRCA2",
    lynch: "Lynch syndrome",
    familial_hypercholesterolemia: "Familial hypercholesterolemia",
    cardiomyopathy_panel: "Cardiomyopathy panel",
    other_named_variant: t.conditionOther || "Other named variant",
    unknown_condition: "Test target unknown",
  };
  const resultLabel: Record<GeneticTestResult, string> = {
    positive: "positive",
    negative: "negative",
    vus: "variant of uncertain significance",
    unknown_result: "result unknown",
  };
  const contextLabel: Record<GeneticTestVariantContext, string> = {
    known_familial_variant_tested:
      "tested for a known familial variant — a negative result is meaningful in this context",
    panel_only_no_known_variant:
      "panel test only, no known familial variant — a negative result says little",
    unknown_what_was_tested:
      "what was tested isn't known — negative carries no information",
  };
  return `${subjectLabel}: ${conditionLabel[t.condition]} — ${resultLabel[t.result]} (${contextLabel[t.variantContext]}).`;
}

// ----------------------------------------------------------------------------
// Aggregator
// ----------------------------------------------------------------------------

export function buildReport(answers: FamilyHistoryAnswers): FamilyHistoryReport {
  const signals = detectSignals(answers);
  const missing = whatsMissing(answers);
  const questionsRel = buildQuestionsForRelatives(answers);
  const questionsClin = signals.flatMap((s) => s.clinicianDiscussion);
  const lifestyle = standardLifestylePrompts();
  const summary = answers.relatives.map((r) => ({
    id: r.id,
    line: summariseRelative(r),
  }));
  const geneticSummary = answers.knownGeneticTests.map(summariseGeneticTest);
  return {
    signals,
    whatsMissing: missing,
    questionsForRelatives: questionsRel,
    questionsForClinician: questionsClin,
    lifestylePrompts: lifestyle,
    relativeSummary: summary,
    knownGeneticTestsSummary: geneticSummary,
    hasContent:
      answers.relatives.length > 0 ||
      answers.knownGeneticTests.length > 0 ||
      answers.self.adoptedLimitedHistory ||
      answers.self.donorConceivedLimitedHistory,
  };
}
