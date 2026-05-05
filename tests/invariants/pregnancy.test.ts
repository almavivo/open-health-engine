import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildRecommendationPlan } from "../../src/rules-engine";
import type { AnswerMap } from "../../src/types";

describe("pregnancy invariant", () => {
  it("pregnant users never see status=recommended without explicit pregnancy safety", () => {
    fc.assert(
      fc.property(
        fc.record({
          pregnant_or_breastfeeding: fc.constant("yes" as const),
          age_band: fc.constantFrom("18_29", "30_44", "45_59"),
          sex: fc.constant("female" as const),
          primary_goal: fc.constantFrom(
            "energy",
            "general_nutrition",
            "stress",
            "immune_support",
          ),
          medication_profile: fc.constantFrom("no", "some_rx"),
          blood_thinner_use: fc.constant("no" as const),
          daily_aspirin_or_nsaid: fc.constant("no" as const),
          red_flag_symptoms: fc.constant("no_red_flags" as const),
          diet_pattern: fc.constantFrom(
            "omnivore",
            "vegetarian",
            "pescatarian",
          ),
          fruit_veg_servings: fc.constantFrom(
            "fv_zero_to_1",
            "fv_2_to_3",
            "fv_4",
          ),
          alcohol_units_weekly: fc.constant("alc_zero" as const),
          tobacco_use: fc.constant("smoking_never" as const),
          sleep_quality: fc.constantFrom("poor", "fair", "good"),
          stress_load: fc.constantFrom("none_or_low", "moderate", "high"),
          exercise_pattern: fc.constantFrom(
            "mostly_sedentary",
            "light_activity",
          ),
        }),
        (answers) => {
          const plan = buildRecommendationPlan(answers as AnswerMap);
          // The contract: pregnancy must register as a risk flag.
          expect(plan.riskFlags).toContain("pregnancy_or_breastfeeding");
          // No supplement should be recommended without an explicit
          // pregnancy-safe affordance — in practice the engine routes most
          // items to clinician review for pregnant users.
          for (const item of plan.stack) {
            if (item.status === "recommended") {
              // The very small allow-list of items the engine considers
              // safe to auto-recommend during pregnancy. Anything outside
              // this set being "recommended" is a regression.
              expect([
                "vitamin_d3",
                "omega3",
                "iron",
              ]).toContain(item.supplementId);
            }
          }
        },
      ),
      { numRuns: 150 },
    );
  });
});
