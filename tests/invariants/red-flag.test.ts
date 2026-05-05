import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildRecommendationPlan } from "../../src/rules-engine";
import type { AnswerMap } from "../../src/types";

describe("red-flag invariant", () => {
  it("any red-flag symptom triggers urgent_clinical_review and demotes everything", () => {
    fc.assert(
      fc.property(
        fc.record({
          red_flag_symptoms: fc.constantFrom(
            "rf_chest_pain",
            "rf_blood_in_stool",
            "rf_unintentional_weight_loss",
            "rf_severe_persistent_headache",
            "rf_neurological_symptoms",
            "rf_suicidal_thoughts",
          ),
          age_band: fc.constantFrom("18_29", "30_44", "45_59", "60_69"),
          sex: fc.constantFrom("male", "female"),
          pregnant_or_breastfeeding: fc.constant("no" as const),
          primary_goal: fc.constantFrom(
            "energy",
            "stress",
            "general_nutrition",
            "sleep",
          ),
          medication_profile: fc.constantFrom("no", "some_rx"),
          blood_thinner_use: fc.constant("no" as const),
          daily_aspirin_or_nsaid: fc.constant("no" as const),
          diet_pattern: fc.constantFrom("omnivore", "vegetarian"),
          fruit_veg_servings: fc.constantFrom("fv_2_to_3", "fv_4"),
          alcohol_units_weekly: fc.constantFrom("alc_zero", "alc_1_to_7"),
          tobacco_use: fc.constant("smoking_never" as const),
          sleep_quality: fc.constantFrom("poor", "fair"),
          stress_load: fc.constantFrom("moderate", "high"),
          exercise_pattern: fc.constant("light_activity" as const),
        }),
        (answers) => {
          const plan = buildRecommendationPlan(answers as AnswerMap);
          // Red-flag screening must always raise urgent_clinical_review.
          expect(plan.riskFlags).toContain("urgent_clinical_review");
          // And it must demote every supplement out of "recommended" status.
          for (const item of plan.stack) {
            expect(item.status).not.toBe("recommended");
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
