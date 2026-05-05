import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildRecommendationPlan } from "../../src/rules-engine";
import type { AnswerMap } from "../../src/types";

describe("determinism invariant", () => {
  it("identical inputs always produce identical outputs", () => {
    fc.assert(
      fc.property(
        fc.record({
          age_band: fc.constantFrom("18_29", "30_44", "45_59", "60_69"),
          sex: fc.constantFrom("male", "female"),
          primary_goal: fc.constantFrom(
            "sleep",
            "energy",
            "stress",
            "performance",
            "cognitive_performance",
            "general_nutrition",
          ),
          pregnant_or_breastfeeding: fc.constant("no" as const),
          medication_profile: fc.constantFrom("no", "some_rx"),
          blood_thinner_use: fc.constantFrom("yes", "no"),
          daily_aspirin_or_nsaid: fc.constantFrom("yes", "no"),
          red_flag_symptoms: fc.constant("no_red_flags" as const),
          diet_pattern: fc.constantFrom("omnivore", "vegan", "vegetarian"),
          fruit_veg_servings: fc.constantFrom(
            "fv_zero_to_1",
            "fv_2_to_3",
            "fv_5_to_7",
          ),
          alcohol_units_weekly: fc.constantFrom(
            "alc_zero",
            "alc_1_to_7",
            "alc_15_to_21",
          ),
          tobacco_use: fc.constantFrom(
            "smoking_never",
            "smoking_current_light",
          ),
          sleep_quality: fc.constantFrom("poor", "fair", "good"),
          stress_load: fc.constantFrom("moderate", "high"),
          exercise_pattern: fc.constantFrom(
            "mostly_sedentary",
            "light_activity",
            "endurance",
          ),
        }),
        (answers) => {
          const a = buildRecommendationPlan(answers as AnswerMap);
          const b = buildRecommendationPlan(answers as AnswerMap);
          // The plan must be a pure function of the inputs. If this fails,
          // something is reading from Date.now(), Math.random(), env vars,
          // or unsorted Set/Map iteration order.
          expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
        },
      ),
      { numRuns: 100 },
    );
  });
});
