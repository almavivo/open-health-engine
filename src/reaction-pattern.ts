// ----------------------------------------------------------------------------
// Reaction pattern domain — pure module shared by the pattern-log tool and the
// delayed-intolerance trial worksheet. No React, no localStorage; classifier
// and gates are deterministic functions of the answer object so they can be
// re-run on either surface.
//
// This module describes *patterns*, never conditions. The output of
// classifyPattern() is a label the user can bring to a clinician, not a
// diagnosis. The worksheet is offered only for delayed-intolerance patterns
// with no immediate-reaction history for the candidate food, no emergency
// red flags, and no hard exclusion gates.
// ----------------------------------------------------------------------------

export type YesNo = "yes" | "no";

export type SymptomKey =
  | "hives_welts"
  | "skin_itch"
  | "eczema_flare"
  | "rhinitis"
  | "sneezing"
  | "itchy_eyes"
  | "wheeze"
  | "oral_itch_raw_produce"
  | "gi_bloating"
  | "gi_diarrhoea"
  | "gi_cramping"
  | "headache_migraine"
  | "flushing"
  | "post_meal_fatigue";

export type TimingKey =
  | "under_2h"
  | "two_to_8h"
  | "over_8h"
  | "not_food_related"
  | "unsure";

export type HivesDuration = "lt_6_weeks" | "ge_6_weeks" | "no_hives";

export type PhysicalTrigger =
  | "cold"
  | "exercise_sweating"
  | "pressure"
  | "sun"
  | "none";

export type RhinitisPattern =
  | "seasonal"
  | "perennial"
  | "indoor_worse"
  | "outdoor_worse"
  | "time_of_day"
  | "none";

export type SuspectedFood =
  | "dairy"
  | "gluten_wheat"
  | "fodmap_produce"
  | "histamine_aged"
  | "caffeine"
  | "alcohol"
  | "food_additives"
  | "common_allergens" // peanut/tree nut/shellfish/fish/sesame/egg/soy — grouped, never a worksheet trigger
  | "none_unsure";

export type CoeliacStatus =
  | "tested_while_eating_gluten_negative"
  | "discussed_with_clinician"
  | "tested_positive"
  | "tested_but_off_gluten"
  | "not_tested";

export type PriorEliminationOutcome = "yes_helped" | "yes_no_change" | "no";

export type FamilyHistoryItem =
  | "atopy"
  | "asthma"
  | "eczema"
  | "hayfever"
  | "coeliac"
  | "food_allergy"
  | "none";

export interface LogAnswers {
  // Emergency block — any yes → emergency_pattern (hard exit, no worksheet)
  everThroatOrTongueSwelling: YesNo | "";
  everBreathingDifficulty: YesNo | "";
  everHospitalisedForReaction: YesNo | "";
  everFaintedWithReaction: YesNo | "";
  epiPenEverPrescribed: YesNo | "";

  // Symptom pattern
  symptoms: SymptomKey[];
  foodTiming: TimingKey | "";
  hivesDuration: HivesDuration | "";
  physicalTriggers: PhysicalTrigger[];
  rhinitisPattern: RhinitisPattern[];

  // Suspected foods + per-food immediate-reaction probe
  suspectedFoods: SuspectedFood[];
  immediateReactionFoods: SuspectedFood[]; // foods with any <2h hives/swelling/wheeze history

  coeliacStatus: CoeliacStatus | "";
  priorElimination: PriorEliminationOutcome | "";

  // Hard exclusion gates
  pregnant: YesNo | "";
  under18: YesNo | "";
  eatingDisorderHistory: YesNo | "";
  diabetesOnGlucoseMeds: YesNo | "";
  redFlagGi: YesNo | ""; // blood in stool / unexplained weight loss / persistent vomiting / fever w GI / nighttime GI

  familyHistory: FamilyHistoryItem[];
}

export const EMPTY_LOG_ANSWERS: LogAnswers = {
  everThroatOrTongueSwelling: "",
  everBreathingDifficulty: "",
  everHospitalisedForReaction: "",
  everFaintedWithReaction: "",
  epiPenEverPrescribed: "",
  symptoms: [],
  foodTiming: "",
  hivesDuration: "",
  physicalTriggers: [],
  rhinitisPattern: [],
  suspectedFoods: [],
  immediateReactionFoods: [],
  coeliacStatus: "",
  priorElimination: "",
  pregnant: "",
  under18: "",
  eatingDisorderHistory: "",
  diabetesOnGlucoseMeds: "",
  redFlagGi: "",
  familyHistory: [],
};

// ----------------------------------------------------------------------------
// Classification
// ----------------------------------------------------------------------------

export type PatternClassification =
  | "emergency_pattern"
  | "immediate_reaction_pattern"
  | "recurring_hives_pattern"
  | "rhinitis_pattern"
  | "delayed_intolerance_pattern"
  | "mixed_pattern"
  | "no_clear_pattern";

export const PATTERN_LABEL: Record<PatternClassification, string> = {
  emergency_pattern: "Emergency or urgent allergy-safety pattern",
  immediate_reaction_pattern: "Immediate-reaction pattern worth clinician review",
  recurring_hives_pattern: "Recurring hives pattern",
  rhinitis_pattern: "Rhinitis / hayfever-like pattern",
  delayed_intolerance_pattern: "Delayed intolerance-style pattern",
  mixed_pattern: "Mixed pattern — bring to a clinician",
  no_clear_pattern: "No clear pattern from your answers",
};

export const PATTERN_BAND_CLASS: Record<PatternClassification, string> = {
  emergency_pattern: "very_high",
  immediate_reaction_pattern: "high",
  recurring_hives_pattern: "moderate",
  rhinitis_pattern: "moderate",
  delayed_intolerance_pattern: "slightly_elevated",
  mixed_pattern: "moderate",
  no_clear_pattern: "low",
};

function hasAny(a: YesNo | "", ...rest: (YesNo | "")[]): boolean {
  return [a, ...rest].some((v) => v === "yes");
}

function rhinitisIsh(a: LogAnswers): boolean {
  const rhinitisSymptoms: SymptomKey[] = ["rhinitis", "sneezing", "itchy_eyes"];
  const hasRhinitisSymptoms = a.symptoms.some((s) => rhinitisSymptoms.includes(s));
  const hasRhinitisPattern = a.rhinitisPattern.some((p) => p !== "none");
  return hasRhinitisSymptoms && hasRhinitisPattern;
}

function hivesChronic(a: LogAnswers): boolean {
  const hasHives = a.symptoms.includes("hives_welts");
  return hasHives && a.hivesDuration === "ge_6_weeks";
}

function delayedIntoleranceIsh(a: LogAnswers): boolean {
  const giSymptoms: SymptomKey[] = ["gi_bloating", "gi_diarrhoea", "gi_cramping"];
  const otherDelayed: SymptomKey[] = ["headache_migraine", "post_meal_fatigue", "flushing"];
  const hasGi = a.symptoms.some((s) => giSymptoms.includes(s));
  const hasOtherDelayed = a.symptoms.some((s) => otherDelayed.includes(s));
  const timingFits =
    a.foodTiming === "two_to_8h" ||
    a.foodTiming === "over_8h" ||
    (a.foodTiming === "unsure" && (hasGi || hasOtherDelayed));
  return (hasGi || hasOtherDelayed) && timingFits;
}

export function classifyPattern(a: LogAnswers): PatternClassification {
  // Emergency block — any yes wins. Conservative.
  if (
    hasAny(
      a.everThroatOrTongueSwelling,
      a.everBreathingDifficulty,
      a.everHospitalisedForReaction,
      a.everFaintedWithReaction,
      a.epiPenEverPrescribed,
    )
  ) {
    return "emergency_pattern";
  }

  // Any per-food immediate-reaction history (without emergency markers above)
  // → immediate reaction pattern. Worth clinician review, never worksheet.
  if (a.immediateReactionFoods.length > 0) {
    return "immediate_reaction_pattern";
  }

  // Immediate timing + hives/wheeze without a specific food flagged still
  // counts as immediate-reaction pattern.
  const immediateSymptoms: SymptomKey[] = ["hives_welts", "wheeze", "oral_itch_raw_produce"];
  if (a.foodTiming === "under_2h" && a.symptoms.some((s) => immediateSymptoms.includes(s))) {
    return "immediate_reaction_pattern";
  }

  const isRhinitis = rhinitisIsh(a);
  const isChronicHives = hivesChronic(a);
  const isDelayed = delayedIntoleranceIsh(a);

  const matches = [isRhinitis, isChronicHives, isDelayed].filter(Boolean).length;
  if (matches >= 2) return "mixed_pattern";

  if (isChronicHives) return "recurring_hives_pattern";
  if (isRhinitis) return "rhinitis_pattern";
  if (isDelayed) return "delayed_intolerance_pattern";

  return "no_clear_pattern";
}

// ----------------------------------------------------------------------------
// Hard exclusion gates — refuse any elimination trial
// ----------------------------------------------------------------------------

export type ExclusionReasonId =
  | "emergency_history"
  | "pregnant"
  | "under_18"
  | "eating_disorder_history"
  | "diabetes_on_glucose_meds"
  | "red_flag_gi";

export interface ExclusionReason {
  id: ExclusionReasonId;
  label: string;
  detail: string;
}

export function listExclusions(a: LogAnswers): ExclusionReason[] {
  const out: ExclusionReason[] = [];
  if (
    hasAny(
      a.everThroatOrTongueSwelling,
      a.everBreathingDifficulty,
      a.everHospitalisedForReaction,
      a.everFaintedWithReaction,
      a.epiPenEverPrescribed,
    )
  ) {
    out.push({
      id: "emergency_history",
      label: "History of severe reaction",
      detail:
        "Throat/tongue swelling, breathing difficulty, hospitalisation, fainting, or a prescribed adrenaline auto-injector are reasons to work with a clinician — self-trials are not safe in this context.",
    });
  }
  if (a.pregnant === "yes") {
    out.push({
      id: "pregnant",
      label: "Pregnancy",
      detail:
        "Restrictive elimination diets during pregnancy need clinician or dietitian oversight; this tool does not provide that.",
    });
  }
  if (a.under18 === "yes") {
    out.push({
      id: "under_18",
      label: "Under 18",
      detail:
        "Elimination trials in under-18s need paediatric / dietitian oversight; this tool is for adults only.",
    });
  }
  if (a.eatingDisorderHistory === "yes") {
    out.push({
      id: "eating_disorder_history",
      label: "Eating-disorder history",
      detail:
        "Food-restrictive trials can be unsafe alongside a current or prior eating disorder. Please discuss with a clinician.",
    });
  }
  if (a.diabetesOnGlucoseMeds === "yes") {
    out.push({
      id: "diabetes_on_glucose_meds",
      label: "Diabetes on glucose-lowering medication",
      detail:
        "Removing food groups can change carbohydrate intake unpredictably and risks hypoglycaemia. Speak with your prescriber first.",
    });
  }
  if (a.redFlagGi === "yes") {
    out.push({
      id: "red_flag_gi",
      label: "Red-flag GI symptoms",
      detail:
        "Blood in stool, unexplained weight loss, persistent vomiting, fever with GI symptoms, or nighttime-waking GI symptoms need a clinician before any self-trial.",
    });
  }
  return out;
}

export function hasHardExclusion(a: LogAnswers): boolean {
  return listExclusions(a).length > 0;
}

// ----------------------------------------------------------------------------
// Trigger catalogue for the worksheet. Common IgE allergens (peanut, tree
// nut, shellfish, fish, sesame, egg, soy) deliberately do NOT appear here.
// Each trigger has a per-trigger gate function so dairy with prior immediate
// dairy reaction is refused, gluten without coeliac gate is refused, etc.
// ----------------------------------------------------------------------------

export type TriggerEvidence = "tier_b" | "tier_c" | "tier_d";

export interface TriggerSpec {
  id: SuspectedFood;
  label: string;
  shortDescription: string;
  eliminationDays: number;
  reintroductionDays: number;
  avoidExamples: string[];
  insteadExamples: string[];
  evidence: TriggerEvidence;
  evidenceNote?: string; // shown as a banner when tier_c / tier_d
}

export const TRIGGER_SPECS: TriggerSpec[] = [
  {
    id: "dairy",
    label: "Lactose / dairy intolerance trial",
    shortDescription:
      "Lactose elimination is a reasonable self-trial for delayed GI symptoms. Note: this is intolerance, not dairy allergy.",
    eliminationDays: 14,
    reintroductionDays: 3,
    avoidExamples: [
      "Cow/goat/sheep milk and cream",
      "Yoghurt, kefir, ice cream",
      "Soft and many hard cheeses",
      "Whey- and casein-based protein powders",
      "Milk-chocolate, milky desserts, custards",
    ],
    insteadExamples: [
      "Oat, almond, soy or rice milks (unsweetened)",
      "Coconut yoghurt or lactose-free yoghurt",
      "Hard aged cheese only if you want to test lactose specifically (lower lactose)",
      "Plant-based protein powders",
    ],
    evidence: "tier_b",
  },
  {
    id: "fodmap_produce",
    label: "High-FODMAP foods trial (simple)",
    shortDescription:
      "A simplified low-FODMAP approach: cut out the highest-FODMAP groups for two weeks, then reintroduce one at a time. Best done with a dietitian for the full protocol.",
    eliminationDays: 14,
    reintroductionDays: 3,
    avoidExamples: [
      "Onion, garlic, leeks, shallots",
      "Apples, pears, mango, watermelon",
      "Honey, agave, high-fructose corn syrup",
      "Wheat (bread, pasta) — note overlap with gluten",
      "Legumes (chickpeas, kidney beans, lentils in large amounts)",
    ],
    insteadExamples: [
      "Garlic-infused oil (FODMAPs are not oil-soluble)",
      "Bananas (firm), berries, citrus, kiwi",
      "Maple syrup, glucose-only sweeteners",
      "Rice, oats, quinoa, gluten-free pasta",
      "Firm tofu, tempeh, eggs, meat, fish",
    ],
    evidence: "tier_b",
    evidenceNote:
      "A full low-FODMAP protocol is most effective with a dietitian. This is a simplified self-trial.",
  },
  {
    id: "gluten_wheat",
    label: "Gluten/wheat trial",
    shortDescription:
      "Only after coeliac testing has been discussed or completed while you were still eating gluten. Stopping gluten before coeliac testing makes that testing unreliable.",
    eliminationDays: 21,
    reintroductionDays: 3,
    avoidExamples: [
      "Wheat, rye, barley, spelt",
      "Bread, pasta, couscous, most cereals",
      "Beer and many ales",
      "Soy sauce (use tamari instead)",
      "Many sauces, soups and processed foods (check labels)",
    ],
    insteadExamples: [
      "Rice, quinoa, buckwheat, oats labelled gluten-free",
      "Gluten-free bread/pasta",
      "Potato, sweet potato, polenta",
      "Tamari instead of soy sauce",
    ],
    evidence: "tier_c",
    evidenceNote:
      "Non-coeliac gluten sensitivity is debated. Symptom relief without coeliac is real for some, but the mechanism is uncertain.",
  },
  {
    id: "alcohol",
    label: "Alcohol elimination",
    shortDescription:
      "A two-week alcohol-free period is a simple way to check whether alcohol is contributing to your symptom pattern.",
    eliminationDays: 14,
    reintroductionDays: 3,
    avoidExamples: [
      "Beer, wine, spirits, cocktails",
      "Alcoholic kombucha and kefirs",
      "Cooking with wine or spirits (high heat does not remove all alcohol)",
    ],
    insteadExamples: [
      "Sparkling water with citrus, herbs, or bitters (alcohol-free)",
      "Non-alcoholic beer/wine (check ABV — 0.5% is typical)",
      "Tea, kombucha labelled <0.5% ABV",
    ],
    evidence: "tier_b",
  },
  {
    id: "caffeine",
    label: "Caffeine elimination",
    shortDescription:
      "Removing caffeine for two weeks can clarify its role in GI symptoms, jitters, or sleep-related fatigue patterns.",
    eliminationDays: 14,
    reintroductionDays: 3,
    avoidExamples: [
      "Coffee (incl. decaf, which still has small amounts)",
      "Black, green, white, oolong, matcha tea",
      "Energy drinks, pre-workout, sodas with caffeine",
      "Dark chocolate in larger amounts",
      "Caffeine-containing pain relievers",
    ],
    insteadExamples: [
      "Herbal teas (rooibos, peppermint, chamomile)",
      "Chicory or barley 'coffee' alternatives",
      "Sparkling water, plain water",
    ],
    evidence: "tier_b",
  },
  {
    id: "histamine_aged",
    label: "Low-histamine trial",
    shortDescription:
      "Avoid aged, fermented and otherwise histamine-rich foods for two to four weeks. Evidence is limited and this is best treated as exploratory.",
    eliminationDays: 21,
    reintroductionDays: 3,
    avoidExamples: [
      "Aged cheeses (parmesan, blue, mature cheddar)",
      "Cured and fermented meats (salami, prosciutto)",
      "Fermented vegetables (sauerkraut, kimchi)",
      "Wine, beer, vinegar, soy sauce, kombucha",
      "Smoked fish, anchovies, mackerel",
      "Tomatoes, spinach, aubergine, avocado in large amounts",
      "Leftovers (histamine accumulates on storage)",
    ],
    insteadExamples: [
      "Freshly cooked meat or fish, eaten the same day",
      "Fresh dairy (if tolerated): milk, fresh ricotta, cottage cheese",
      "Apples, pears, berries (non-citrus), broccoli, courgette",
      "Rice, oats, quinoa",
    ],
    evidence: "tier_c",
    evidenceNote:
      "Histamine intolerance is a working hypothesis, not a confirmed condition. DAO blood tests are unreliable. Treat results as exploratory.",
  },
  {
    id: "food_additives",
    label: "Food-additive elimination (exploratory)",
    shortDescription:
      "Cut common food additives (sulphites, benzoates, MSG, artificial colourings) by sticking to whole, minimally-processed foods. Evidence is mixed; this is exploratory.",
    eliminationDays: 21,
    reintroductionDays: 3,
    avoidExamples: [
      "Sulphites: dried fruit, wine, some processed potato",
      "Benzoates and sorbates in soft drinks and processed foods",
      "MSG and yeast extract in stocks, snacks, sauces",
      "Artificial colourings in sweets, soft drinks",
    ],
    insteadExamples: [
      "Fresh whole foods cooked from scratch",
      "Fresh fruit instead of dried",
      "Home-made stocks or unsalted single-ingredient versions",
      "Plain water, sparkling water, herbal teas",
    ],
    evidence: "tier_d",
    evidenceNote:
      "Direct evidence linking common food additives to chronic intolerance symptoms is weak and inconsistent. Treat as exploratory.",
  },
];

export function triggerSpec(id: SuspectedFood): TriggerSpec | null {
  return TRIGGER_SPECS.find((t) => t.id === id) ?? null;
}

// Per-trigger gate. Returns null if allowed, or a reason string if refused.
export function triggerGate(a: LogAnswers, triggerId: SuspectedFood): string | null {
  if (a.immediateReactionFoods.includes(triggerId)) {
    return "You reported an immediate reaction (hives, swelling, wheeze, or feeling faint within 2 hours) after this food. That pattern needs a clinician, not a self-trial.";
  }
  if (triggerId === "gluten_wheat") {
    const ok =
      a.coeliacStatus === "tested_while_eating_gluten_negative" ||
      a.coeliacStatus === "discussed_with_clinician";
    if (!ok) {
      return "Don't start a gluten-free trial before discussing coeliac testing with a clinician. Coeliac testing only works while you're still eating gluten — cutting it first makes that testing unreliable.";
    }
  }
  return null;
}

export function allowedTriggers(a: LogAnswers): TriggerSpec[] {
  if (hasHardExclusion(a)) return [];
  return TRIGGER_SPECS.filter((t) => triggerGate(a, t.id) === null);
}

// ----------------------------------------------------------------------------
// Static guidance per pattern — rendered in the result band.
// ----------------------------------------------------------------------------

export interface NextStep {
  heading: string;
  body: string;
}

export interface PatternGuidance {
  summary: string;
  nextSteps: NextStep[];
  worksheetEligible: boolean;
  worksheetCta?: string;
}

export function patternGuidance(
  pattern: PatternClassification,
  a: LogAnswers,
): PatternGuidance {
  const exclusions = listExclusions(a);
  const hasExclusion = exclusions.length > 0;

  switch (pattern) {
    case "emergency_pattern":
      return {
        summary:
          "Your answers describe at least one severe reaction (throat/tongue swelling, breathing difficulty, hospitalisation, fainting, or a prescribed adrenaline auto-injector). This pattern is not suitable for any self-trial.",
        nextSteps: [
          {
            heading: "If you are having a reaction now",
            body: "Use your adrenaline auto-injector if prescribed and call emergency services. Do not wait to see if it gets better.",
          },
          {
            heading: "Otherwise — see a clinician",
            body: "Ask whether targeted allergy assessment is appropriate based on your history. This may include a clinician-supervised history review, skin-prick or specific IgE testing, and a written emergency action plan.",
          },
          {
            heading: "Do not self-test",
            body: "Re-exposure to a suspected trigger at home is not safe with this history. Any structured rechallenge needs to happen in a clinical setting.",
          },
        ],
        worksheetEligible: false,
      };

    case "immediate_reaction_pattern":
      return {
        summary:
          "Your answers describe immediate-onset reactions (within ~2 hours) to one or more foods. This pattern is worth a clinician review.",
        nextSteps: [
          {
            heading: "Ask your clinician about targeted allergy assessment",
            body: "A focused history with targeted testing — rather than broad panels — is the recommended approach. Bring this log to the appointment.",
          },
          {
            heading: "Carry an action plan if reactions have been significant",
            body: "If reactions have included widespread hives, swelling, throat tightness or breathing difficulty, ask about an emergency plan and whether an adrenaline auto-injector is appropriate.",
          },
          {
            heading: "Avoid self-rechallenge",
            body: "The intolerance trial worksheet is not offered for foods that have caused immediate reactions in you.",
          },
        ],
        worksheetEligible: false,
      };

    case "recurring_hives_pattern":
      return {
        summary:
          "Your answers describe hives that have been recurring for six weeks or more. In most cases this pattern is not caused by food, and elimination diets tend to be low-yield.",
        nextSteps: [
          {
            heading: "See a clinician — this is the main step",
            body: "Recurring hives lasting six weeks or longer (chronic urticaria) is typically managed with a stepped approach starting with regular non-sedating antihistamines. Ask whether that is appropriate for you.",
          },
          {
            heading: "Track triggers in the journal",
            body: "Log severity and possible triggers in the symptom journal so you can show patterns at the visit — physical triggers (cold, pressure, sweating, sun) and stress are common contributors and easy to miss in memory alone.",
          },
          {
            heading: "Diet trials are usually not the answer here",
            body: "Unless there is a clear timed trigger, broad food-elimination diets rarely help chronic hives and can cause unnecessary restriction.",
          },
        ],
        worksheetEligible: false,
      };

    case "rhinitis_pattern":
      return {
        summary:
          "Your answers describe a rhinitis / hayfever-like pattern (runny nose, sneezing, itchy eyes with seasonal, indoor or outdoor variation).",
        nextSteps: [
          {
            heading: "Identify and reduce environmental exposures",
            body: "Pollen, dust mite, pet dander and mould are the usual culprits. Track when symptoms are worst (season, indoor vs outdoor, time of day) and adjust exposures where you can.",
          },
          {
            heading: "Ask your clinician about treatment options",
            body: "First-line care typically involves intranasal corticosteroids and non-sedating antihistamines. Ask whether targeted allergy testing is appropriate based on your history.",
          },
          {
            heading: "Food trials are usually not relevant here",
            body: "Pure rhinitis patterns are environmental rather than dietary. The intolerance worksheet is not the right tool.",
          },
        ],
        worksheetEligible: false,
      };

    case "delayed_intolerance_pattern":
      if (hasExclusion) {
        return {
          summary:
            "Your symptom pattern (delayed GI, headache, or post-meal fatigue) would normally suit a structured self-trial — but one or more safety conditions apply for you, so the worksheet is not offered.",
          nextSteps: [
            {
              heading: "Why the worksheet isn't available",
              body: exclusions
                .map((e) => `${e.label}: ${e.detail}`)
                .join(" "),
            },
            {
              heading: "Bring this log to a clinician or dietitian",
              body: "A clinician or registered dietitian can supervise a structured trial safely. Print this page and share it.",
            },
          ],
          worksheetEligible: false,
        };
      }
      return {
        summary:
          "Your answers describe delayed (2–8+ hours) GI, headache, or post-meal fatigue patterns. This is the pattern where a structured 2–3 week single-food elimination and reintroduction can give useful information — when done carefully and shared with a clinician.",
        nextSteps: [
          {
            heading: "Pick one suspected trigger at a time",
            body: "Single-food trials are easier to interpret than cutting out many things at once.",
          },
          {
            heading: "Bring the log to a clinician or dietitian",
            body: "A structured worksheet does not replace clinical assessment. Coeliac testing in particular needs to be discussed before any gluten trial.",
          },
          {
            heading: "Watch for unintended restriction",
            body: "If a trial does not relearn a clear signal in 2–4 weeks, reintroduce the food and try a different approach rather than expanding restrictions.",
          },
        ],
        worksheetEligible: true,
        worksheetCta: "Start a single-food trial",
      };

    case "mixed_pattern":
      return {
        summary:
          "Your answers describe more than one pattern (for example, a rhinitis pattern alongside delayed GI symptoms). A mixed picture is common, and it is worth raising with a clinician before any self-trial.",
        nextSteps: [
          {
            heading: "Take this log to a clinician",
            body: "A mixed picture often deserves a focused history rather than home elimination. Ask whether targeted allergy testing is appropriate based on your history.",
          },
          {
            heading: "If you and your clinician agree a delayed-intolerance trial is reasonable",
            body: "The worksheet is available — but use it knowingly, with the clinician's awareness, and stick to one trigger at a time.",
          },
        ],
        worksheetEligible: !hasExclusion,
        worksheetCta: hasExclusion
          ? undefined
          : "Open the intolerance trial worksheet",
      };

    case "no_clear_pattern":
    default:
      return {
        summary:
          "Your answers don't currently point to a clear pattern. That's a useful result on its own — it means there isn't an obvious next step from this log.",
        nextSteps: [
          {
            heading: "Keep a symptom journal for a few weeks",
            body: "If symptoms recur, log severity, timing, and what you ate or were exposed to in the symptom journal. Patterns are easier to spot in a written log than in memory.",
          },
          {
            heading: "Re-take this log when you have more data",
            body: "Come back and re-take it after a few weeks of journal entries. The pattern may become clearer.",
          },
          {
            heading: "See a clinician if symptoms are getting worse",
            body: "Worsening symptoms, new symptoms, or anything affecting your daily life are reasons to see a clinician regardless of what this tool says.",
          },
        ],
        worksheetEligible: false,
      };
  }
}
