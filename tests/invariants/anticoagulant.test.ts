import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildRecommendationPlan } from "../../src/rules-engine";
import type { AnswerMap } from "../../src/types";

// The set of supplements with anticoagulant excludeIf gates in supplements.ts.
// If an item here ever appears as "recommended" for a user on a blood thinner
// or daily aspirin, the engine has regressed. Derived from a grep of
// `blood_thinner_use` and `daily_aspirin_or_nsaid` exclude clauses.
const ANTICOAGULANT_RISK_IDS = [
  "vitamin_e",
  "fish_oil_high_dose",
  "ginkgo_biloba",
  "garlic_extract",
  "ginger",
  "turmeric_curcumin",
  "boswellia",
  "willow_bark",
  "feverfew",
  "saw_palmetto",
  "krill_oil_high_dose",
  "ginseng",
  "high_dose_omega3",
];

describe("anticoagulant invariant", () => {
  it("users on blood thinners or daily aspirin never get anticoagulant-conflict supplements as recommended", () => {
    fc.assert(
      fc.property(
        fc.record({
          blood_thinner_use: fc.constantFrom("yes", "no"),
          daily_aspirin_or_nsaid: fc.constantFrom("yes", "no"),
          age_band: fc.constantFrom("30_44", "45_59", "60_69"),
          sex: fc.constantFrom("male", "female"),
          pregnant_or_breastfeeding: fc.constant("no" as const),
          primary_goal: fc.constantFrom(
            "cognitive_longevity",
            "joint_mobility",
            "general_nutrition",
            "energy",
          ),
          medication_profile: fc.constantFrom("some_rx", "polypharmacy"),
          red_flag_symptoms: fc.constant("no_red_flags" as const),
          diet_pattern: fc.constantFrom("omnivore", "mediterranean"),
          fruit_veg_servings: fc.constantFrom("fv_2_to_3", "fv_4"),
          alcohol_units_weekly: fc.constantFrom("alc_zero", "alc_1_to_7"),
          tobacco_use: fc.constant("smoking_never" as const),
          sleep_quality: fc.constantFrom("fair", "good"),
          stress_load: fc.constant("moderate" as const),
          exercise_pattern: fc.constantFrom("light_activity", "endurance"),
        }),
        (answers) => {
          // Skip generated cases where neither anticoagulant flag is set —
          // the invariant is about cases where a flag IS set.
          if (
            answers.blood_thinner_use !== "yes" &&
            answers.daily_aspirin_or_nsaid !== "yes"
          ) {
            return;
          }
          const plan = buildRecommendationPlan(answers as AnswerMap);
          for (const item of plan.stack) {
            if (
              item.status === "recommended" &&
              ANTICOAGULANT_RISK_IDS.includes(item.supplementId)
            ) {
              throw new Error(
                `Anticoagulant-conflict supplement "${item.supplementId}" was recommended for user with blood_thinner_use=${answers.blood_thinner_use}, daily_aspirin_or_nsaid=${answers.daily_aspirin_or_nsaid}`,
              );
            }
          }
        },
      ),
      { numRuns: 200 },
    );
  });
});
