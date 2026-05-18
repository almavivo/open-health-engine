import { describe, it, expect } from "vitest";
import {
  classifyPattern,
  EMPTY_LOG_ANSWERS,
  hasHardExclusion,
  listExclusions,
} from "../../src/reaction-pattern";
import type { LogAnswers } from "../../src/reaction-pattern";

// Build a "completed log" baseline so we don't have to keep restating the
// safety-question YesNos. Tests then override only the fields they care
// about. Default fills the form as "no emergency history, no exclusions,
// no symptoms, no foods" — which classifies as no_clear_pattern.
function log(overrides: Partial<LogAnswers> = {}): LogAnswers {
  return {
    ...EMPTY_LOG_ANSWERS,
    everThroatOrTongueSwelling: "no",
    everBreathingDifficulty: "no",
    everHospitalisedForReaction: "no",
    everFaintedWithReaction: "no",
    epiPenEverPrescribed: "no",
    foodTiming: "not_food_related",
    hivesDuration: "no_hives",
    coeliacStatus: "not_tested",
    priorElimination: "no",
    pregnant: "no",
    under18: "no",
    eatingDisorderHistory: "no",
    diabetesOnGlucoseMeds: "no",
    redFlagGi: "no",
    ...overrides,
  };
}

// ----------------------------------------------------------------------------
// Emergency block — any of the five YesNos → emergency_pattern
// ----------------------------------------------------------------------------

describe("emergency_pattern classification", () => {
  const emergencyFields: (keyof LogAnswers)[] = [
    "everThroatOrTongueSwelling",
    "everBreathingDifficulty",
    "everHospitalisedForReaction",
    "everFaintedWithReaction",
    "epiPenEverPrescribed",
  ];

  for (const field of emergencyFields) {
    it(`fires when ${field} === "yes"`, () => {
      const a = log({ [field]: "yes" } as Partial<LogAnswers>);
      expect(classifyPattern(a)).toBe("emergency_pattern");
    });
  }
});

// ----------------------------------------------------------------------------
// Immediate reaction
// ----------------------------------------------------------------------------

describe("immediate_reaction_pattern classification", () => {
  it("fires when at least one immediate-reaction food is flagged", () => {
    const a = log({ immediateReactionFoods: ["dairy"] });
    expect(classifyPattern(a)).toBe("immediate_reaction_pattern");
  });

  it("fires on <2h hives without a specific food flagged", () => {
    const a = log({
      foodTiming: "under_2h",
      symptoms: ["hives_welts"],
    });
    expect(classifyPattern(a)).toBe("immediate_reaction_pattern");
  });
});

// ----------------------------------------------------------------------------
// Rhinitis
// ----------------------------------------------------------------------------

describe("rhinitis_pattern classification", () => {
  it("fires on rhinitis symptoms with a specific rhinitis pattern", () => {
    const a = log({
      symptoms: ["rhinitis", "sneezing"],
      rhinitisPattern: ["seasonal"],
    });
    expect(classifyPattern(a)).toBe("rhinitis_pattern");
  });

  it("does NOT fire on rhinitis symptoms alone (no pattern selected)", () => {
    const a = log({ symptoms: ["rhinitis"], rhinitisPattern: ["none"] });
    expect(classifyPattern(a)).not.toBe("rhinitis_pattern");
  });
});

// ----------------------------------------------------------------------------
// Recurring hives
// ----------------------------------------------------------------------------

describe("recurring_hives_pattern classification", () => {
  it("fires when hives have lasted >=6 weeks", () => {
    const a = log({
      symptoms: ["hives_welts"],
      hivesDuration: "ge_6_weeks",
    });
    expect(classifyPattern(a)).toBe("recurring_hives_pattern");
  });

  it("does NOT fire when hives are <6 weeks", () => {
    const a = log({
      symptoms: ["hives_welts"],
      hivesDuration: "lt_6_weeks",
    });
    expect(classifyPattern(a)).not.toBe("recurring_hives_pattern");
  });
});

// ----------------------------------------------------------------------------
// Delayed intolerance
// ----------------------------------------------------------------------------

describe("delayed_intolerance_pattern classification", () => {
  it("fires on GI symptoms with 2–8h timing", () => {
    const a = log({
      symptoms: ["gi_bloating"],
      foodTiming: "two_to_8h",
    });
    expect(classifyPattern(a)).toBe("delayed_intolerance_pattern");
  });

  it("fires on post-meal fatigue with >8h timing", () => {
    const a = log({
      symptoms: ["post_meal_fatigue"],
      foodTiming: "over_8h",
    });
    expect(classifyPattern(a)).toBe("delayed_intolerance_pattern");
  });
});

// ----------------------------------------------------------------------------
// Mixed pattern (≥2 of the three "ish" matchers)
// ----------------------------------------------------------------------------

describe("mixed_pattern classification", () => {
  it("fires when chronic hives + delayed intolerance both match", () => {
    const a = log({
      symptoms: ["hives_welts", "gi_bloating"],
      hivesDuration: "ge_6_weeks",
      foodTiming: "two_to_8h",
    });
    expect(classifyPattern(a)).toBe("mixed_pattern");
  });
});

// ----------------------------------------------------------------------------
// Hard exclusions — each of the 6 reasons listed by listExclusions()
// ----------------------------------------------------------------------------

describe("listExclusions + hasHardExclusion", () => {
  it("empty answer set lists no exclusions", () => {
    expect(listExclusions(log())).toEqual([]);
    expect(hasHardExclusion(log())).toBe(false);
  });

  it("emergency_history when any emergency YesNo is yes", () => {
    const a = log({ everBreathingDifficulty: "yes" });
    const reasons = listExclusions(a).map((r) => r.id);
    expect(reasons).toContain("emergency_history");
    expect(hasHardExclusion(a)).toBe(true);
  });

  it("pregnant when pregnant === 'yes'", () => {
    expect(listExclusions(log({ pregnant: "yes" })).map((r) => r.id)).toContain(
      "pregnant",
    );
  });

  it("under_18 when under18 === 'yes'", () => {
    expect(listExclusions(log({ under18: "yes" })).map((r) => r.id)).toContain(
      "under_18",
    );
  });

  it("eating_disorder_history when eatingDisorderHistory === 'yes'", () => {
    expect(
      listExclusions(log({ eatingDisorderHistory: "yes" })).map((r) => r.id),
    ).toContain("eating_disorder_history");
  });

  it("diabetes_on_glucose_meds when diabetesOnGlucoseMeds === 'yes'", () => {
    expect(
      listExclusions(log({ diabetesOnGlucoseMeds: "yes" })).map((r) => r.id),
    ).toContain("diabetes_on_glucose_meds");
  });

  it("red_flag_gi when redFlagGi === 'yes'", () => {
    expect(listExclusions(log({ redFlagGi: "yes" })).map((r) => r.id)).toContain(
      "red_flag_gi",
    );
  });

  it("stacks multiple reasons", () => {
    const a = log({
      everHospitalisedForReaction: "yes",
      pregnant: "yes",
      under18: "yes",
    });
    const ids = listExclusions(a).map((r) => r.id);
    expect(ids).toContain("emergency_history");
    expect(ids).toContain("pregnant");
    expect(ids).toContain("under_18");
  });
});
