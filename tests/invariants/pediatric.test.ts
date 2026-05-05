import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildRecommendationPlan } from "../../src/rules-engine";
import type { AnswerMap } from "../../src/types";

// The pediatric allow-list inside scoreSupplement. If this list changes in
// rules-engine.ts, change it here too — and document the addition in the
// public exclusions doc.
const PEDIATRIC_ALLOWED = new Set([
  "vitamin_d3",
  "omega3",
  "multivitamin",
  "iron",
  "vitamin_b12",
  "calcium",
  "psyllium",
  "protein_powder",
  "probiotic",
]);

describe("pediatric invariant", () => {
  it("under-18 users never get a recommended supplement outside the allow-list", () => {
    fc.assert(
      fc.property(
        // Generate plausible answer sets with age_band locked to under_18
        // and a varied range of other answers. The engine should never let
        // a non-allow-listed supplement reach status "recommended".
        fc.record({
          age_band: fc.constant("under_18" as const),
          sex: fc.constantFrom("male", "female"),
          primary_goal: fc.constantFrom(
            "sleep",
            "energy",
            "stress",
            "cognitive_performance",
            "general_nutrition",
            "immune_support",
          ),
          sleep_quality: fc.constantFrom("good", "ok", "poor"),
          stress_load: fc.constantFrom("low", "moderate", "high"),
          exercise_pattern: fc.constantFrom(
            "sedentary",
            "light_active",
            "moderate_active",
            "very_active",
          ),
          diet_pattern: fc.constantFrom(
            "omnivore",
            "vegetarian",
            "vegan",
            "mediterranean",
          ),
          fruit_veg_servings: fc.constantFrom(
            "0_to_1",
            "1_to_2",
            "2_to_4",
            "5_plus",
          ),
          alcohol_units_weekly: fc.constant("0"),
          tobacco_use: fc.constant("never"),
          red_flag_symptoms: fc.constant("none"),
        }),
        (answers) => {
          const plan = buildRecommendationPlan(answers as AnswerMap);
          for (const item of plan.stack) {
            if (item.status === "recommended") {
              expect(PEDIATRIC_ALLOWED.has(item.supplementId)).toBe(true);
            }
          }
        },
      ),
      { numRuns: 200 },
    );
  });
});
