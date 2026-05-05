import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildRecommendationPlan } from "../../src/rules-engine";
import { supplementCatalog } from "../../src/supplements";
import type { AnswerMap } from "../../src/types";

// Structural invariant called out in CLAUDE.md:
// > category="core_stack" is the only path to status "recommended".
// > Everything else caps at worth_considering.
//
// If this ever changes, both this test and the documentation in
// docs/scoring.md (when it lands in the public repo) need to update together.

const CORE_STACK_IDS = new Set(
  supplementCatalog
    .filter((rule) => rule.category === "core_stack")
    .map((rule) => rule.id),
);

describe("recommended-implies-core-stack invariant", () => {
  it("any supplement with status=recommended must have category=core_stack", () => {
    fc.assert(
      fc.property(
        fc.record({
          age_band: fc.constantFrom("18_29", "30_44", "45_59", "60_69"),
          sex: fc.constantFrom("male", "female"),
          pregnant_or_breastfeeding: fc.constant("no" as const),
          primary_goal: fc.constantFrom(
            "sleep",
            "energy",
            "stress",
            "performance",
            "cognitive_performance",
            "cognitive_longevity",
            "general_nutrition",
            "immune_support",
            "joint_mobility",
            "healthy_aging",
          ),
          medication_profile: fc.constantFrom("no", "some_rx"),
          blood_thinner_use: fc.constant("no" as const),
          daily_aspirin_or_nsaid: fc.constant("no" as const),
          red_flag_symptoms: fc.constant("no_red_flags" as const),
          diet_pattern: fc.constantFrom(
            "omnivore",
            "vegan",
            "vegetarian",
            "pescatarian",
          ),
          fruit_veg_servings: fc.constantFrom(
            "fv_zero_to_1",
            "fv_2_to_3",
            "fv_4",
            "fv_5_to_7",
          ),
          fish_intake: fc.constantFrom("rarely", "weekly", "most_days"),
          alcohol_units_weekly: fc.constantFrom("alc_zero", "alc_1_to_7"),
          tobacco_use: fc.constant("smoking_never" as const),
          sleep_quality: fc.constantFrom("poor", "fair", "good"),
          stress_load: fc.constantFrom("none_or_low", "moderate", "high"),
          exercise_pattern: fc.constantFrom(
            "mostly_sedentary",
            "light_activity",
            "endurance",
            "strength_power",
            "mixed_training",
          ),
          sun_exposure: fc.constantFrom(
            "none_or_low",
            "moderate",
            "high",
          ),
        }),
        (answers) => {
          const plan = buildRecommendationPlan(answers as AnswerMap);
          for (const item of plan.stack) {
            if (item.status === "recommended") {
              expect(item.category).toBe("core_stack");
            }
          }
        },
      ),
      { numRuns: 200 },
    );
  });
});
