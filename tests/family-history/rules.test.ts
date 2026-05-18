import { describe, it, expect } from "vitest";
import {
  BANNED_DETERMINATION_PHRASES,
  buildReport,
  detectSignals,
  EMPTY_FAMILY_HISTORY,
  parseFamilyHistoryAnswers,
} from "../../src/family-history";
import type {
  FamilyHistoryAnswers,
  Relative,
} from "../../src/family-history";

// ----------------------------------------------------------------------------
// Fixture helpers — minimal Relative objects with sane defaults so tests
// read like prose. The detector code reads diagnoses and causeOfDeath
// independently, so fixtures only populate what each scenario needs.
// ----------------------------------------------------------------------------

let idCounter = 0;
function id(): string {
  idCounter += 1;
  return `r${idCounter}`;
}

function rel(overrides: Partial<Relative> = {}): Relative {
  return {
    id: id(),
    relationship: "parent",
    side: "shared",
    sexAtBirth: "unknown",
    status: "alive",
    diagnoses: [],
    ...overrides,
  };
}

function answers(relatives: Relative[]): FamilyHistoryAnswers {
  return { ...EMPTY_FAMILY_HISTORY, relatives };
}

// ----------------------------------------------------------------------------
// Premature CAD
// ----------------------------------------------------------------------------

describe("premature CAD signal", () => {
  it("fires when a male parent has MI before 55", () => {
    const a = answers([
      rel({
        relationship: "parent",
        sexAtBirth: "male",
        status: "deceased",
        ageAtDeath: 52,
        causeOfDeath: "cv_heart_attack",
      }),
    ]);
    const ids = detectSignals(a).map((s) => s.id);
    expect(ids).toContain("premature_cad_prompt");
  });

  it("does NOT fire when a male parent has MI at 75", () => {
    const a = answers([
      rel({
        relationship: "parent",
        sexAtBirth: "male",
        status: "deceased",
        ageAtDeath: 75,
        causeOfDeath: "cv_heart_attack",
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).not.toContain("premature_cad_prompt");
  });
});

// ----------------------------------------------------------------------------
// Sudden death (narrowed)
// ----------------------------------------------------------------------------

describe("sudden-death signal narrowing", () => {
  it("does NOT fire on a 92yo grandparent who 'died in their sleep' (natural causes)", () => {
    const a = answers([
      rel({
        relationship: "grandparent",
        side: "paternal",
        status: "deceased",
        ageAtDeath: 92,
        causeOfDeath: "natural_old_age",
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).not.toContain(
      "unexplained_or_early_sudden_death_prompt",
    );
  });

  it("fires when the user marks a death as unexplained sudden death", () => {
    const a = answers([
      rel({
        relationship: "grandparent",
        side: "maternal",
        status: "deceased",
        ageAtDeath: 60,
        causeOfDeath: "unknown",
        unexplainedSuddenDeath: true,
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).toContain(
      "unexplained_or_early_sudden_death_prompt",
    );
  });

  it("fires on SCD under 50", () => {
    const a = answers([
      rel({
        relationship: "aunt_uncle",
        side: "paternal",
        status: "deceased",
        ageAtDeath: 38,
        causeOfDeath: "cv_sudden_cardiac",
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).toContain(
      "unexplained_or_early_sudden_death_prompt",
    );
  });
});

// ----------------------------------------------------------------------------
// HBOC parent + same-side aunt (parent-lineage support)
// ----------------------------------------------------------------------------

describe("HBOC cluster includes parents with explicit side", () => {
  it("fires when mother (maternal) has breast cancer at 62 AND maternal aunt has ovarian", () => {
    const a = answers([
      rel({
        relationship: "parent",
        side: "maternal",
        sexAtBirth: "female",
        status: "deceased",
        ageAtDeath: 65,
        diagnoses: [
          { id: "d1", condition: "cancer", cancerType: "breast", ageAtDx: 62, confidence: "family_told" },
        ],
      }),
      rel({
        relationship: "aunt_uncle",
        side: "maternal",
        sexAtBirth: "female",
        status: "deceased",
        ageAtDeath: 68,
        causeOfDeath: "cancer",
        causeOfDeathCancerType: "ovarian",
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).toContain("hboc_discussion_prompt");
  });

  it("does NOT fire when relatives are on different sides", () => {
    const a = answers([
      rel({
        relationship: "aunt_uncle",
        side: "paternal",
        sexAtBirth: "female",
        diagnoses: [{ id: "d1", condition: "cancer", cancerType: "breast", ageAtDx: 70, confidence: "family_told" }],
      }),
      rel({
        relationship: "aunt_uncle",
        side: "maternal",
        sexAtBirth: "female",
        diagnoses: [{ id: "d2", condition: "cancer", cancerType: "ovarian", ageAtDx: 65, confidence: "family_told" }],
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).not.toContain("hboc_discussion_prompt");
  });
});

// ----------------------------------------------------------------------------
// Lynch spectrum
// ----------------------------------------------------------------------------

describe("Lynch spectrum signal", () => {
  it("fires on colorectal cancer under 50 in a parent", () => {
    const a = answers([
      rel({
        relationship: "parent",
        side: "maternal",
        diagnoses: [
          { id: "d1", condition: "cancer", cancerType: "colorectal", ageAtDx: 44, confidence: "family_told" },
        ],
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).toContain(
      "lynch_spectrum_discussion_prompt",
    );
  });

  it("output never claims Amsterdam II / Bethesda criteria are met", () => {
    const a = answers([
      rel({
        relationship: "parent",
        side: "maternal",
        diagnoses: [
          { id: "d1", condition: "cancer", cancerType: "colorectal", ageAtDx: 42, confidence: "family_told" },
        ],
      }),
    ]);
    const signal = detectSignals(a).find((s) => s.id === "lynch_spectrum_discussion_prompt");
    expect(signal).toBeDefined();
    const text = [signal!.label, signal!.trigger, ...signal!.clinicianDiscussion].join(" ").toLowerCase();
    expect(text).not.toContain("amsterdam");
    expect(text).not.toContain("bethesda");
  });
});

// ----------------------------------------------------------------------------
// Colorectal screening age modifier — both branches
// ----------------------------------------------------------------------------

describe("colorectal screening age modifier", () => {
  it("fires (branch A) on a 1st-degree relative with CRC at 48", () => {
    const a = answers([
      rel({
        relationship: "parent",
        diagnoses: [{ id: "d1", condition: "cancer", cancerType: "colorectal", ageAtDx: 48, confidence: "family_told" }],
      }),
    ]);
    const ids = detectSignals(a).map((s) => s.id);
    expect(ids).toContain("colon_screening_age_modifier");
  });

  it("fires (branch B) on TWO 1st-degree relatives with CRC at older ages", () => {
    const a = answers([
      rel({
        relationship: "parent",
        diagnoses: [{ id: "d1", condition: "cancer", cancerType: "colorectal", ageAtDx: 72, confidence: "family_told" }],
      }),
      rel({
        relationship: "sibling",
        diagnoses: [{ id: "d2", condition: "cancer", cancerType: "colorectal", ageAtDx: 75, confidence: "family_told" }],
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).toContain("colon_screening_age_modifier");
  });

  it("fires (branch B) on a 1st-degree relative with an advanced adenoma / large polyp", () => {
    const a = answers([
      rel({
        relationship: "sibling",
        diagnoses: [
          { id: "d1", condition: "advanced_adenoma_or_polyp", ageAtDx: 55, confidence: "medical_record" },
        ],
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).toContain("colon_screening_age_modifier");
  });

  it("does NOT fire on a single 1st-degree relative with CRC at 70+", () => {
    const a = answers([
      rel({
        relationship: "parent",
        diagnoses: [{ id: "d1", condition: "cancer", cancerType: "colorectal", ageAtDx: 78, confidence: "family_told" }],
      }),
    ]);
    expect(detectSignals(a).map((s) => s.id)).not.toContain("colon_screening_age_modifier");
  });
});

// ----------------------------------------------------------------------------
// Empty / all-unknown trees
// ----------------------------------------------------------------------------

describe("empty and all-unknown trees", () => {
  it("EMPTY_FAMILY_HISTORY emits no signals", () => {
    expect(detectSignals(EMPTY_FAMILY_HISTORY)).toEqual([]);
  });

  it("all-unknown tree emits no signals but What's missing dominates the report", () => {
    const a = answers([
      rel({ relationship: "grandparent", side: "paternal", status: "deceased", causeOfDeath: "unknown" }),
      rel({ relationship: "grandparent", side: "paternal", status: "deceased", causeOfDeath: "unknown" }),
      rel({ relationship: "grandparent", side: "maternal", status: "deceased", causeOfDeath: "unknown" }),
    ]);
    const r = buildReport(a);
    expect(r.signals).toEqual([]);
    expect(r.whatsMissing.length).toBeGreaterThan(0);
  });
});

// ----------------------------------------------------------------------------
// Discussion-prompt firewall — banned phrases never appear in any output
// ----------------------------------------------------------------------------

describe("discussion-prompt firewall", () => {
  it("no signal output contains any banned determination phrase", () => {
    // Build a tree that fires as many signals as possible at once.
    const a = answers([
      rel({
        relationship: "parent",
        sexAtBirth: "male",
        status: "deceased",
        ageAtDeath: 50,
        causeOfDeath: "cv_heart_attack",
      }),
      rel({
        relationship: "parent",
        sexAtBirth: "female",
        side: "maternal",
        diagnoses: [
          { id: "d1", condition: "cancer", cancerType: "breast", ageAtDx: 45, confidence: "family_told" },
          { id: "d2", condition: "type_2_diabetes", ageAtDx: 50, confidence: "family_told" },
        ],
      }),
      rel({
        relationship: "sibling",
        diagnoses: [{ id: "d3", condition: "type_2_diabetes", ageAtDx: 45, confidence: "family_told" }],
      }),
      rel({
        relationship: "aunt_uncle",
        side: "maternal",
        sexAtBirth: "female",
        diagnoses: [{ id: "d4", condition: "cancer", cancerType: "ovarian", ageAtDx: 55, confidence: "family_told" }],
      }),
      rel({
        relationship: "parent",
        status: "deceased",
        ageAtDeath: 60,
        causeOfDeath: "cv_aortic_thoracic",
        diagnoses: [{ id: "d5", condition: "early_onset_dementia", ageAtDx: 60, confidence: "family_told" }],
      }),
      rel({
        relationship: "sibling",
        diagnoses: [{ id: "d6", condition: "cancer", cancerType: "melanoma", ageAtDx: 35, confidence: "family_told" }],
      }),
    ]);
    const signals = detectSignals(a);
    expect(signals.length).toBeGreaterThan(0);
    for (const s of signals) {
      const corpus = [s.label, s.trigger, ...s.clinicianDiscussion].join(" ").toLowerCase();
      for (const phrase of BANNED_DETERMINATION_PHRASES) {
        expect(corpus, `signal ${s.id} contained banned phrase '${phrase}'`).not.toContain(phrase);
      }
    }
  });
});

// ----------------------------------------------------------------------------
// Defensive parser — ported from the closed product's storage normaliser
// tests plus a new determinism test (correction from 0.3.0 plan review).
// ----------------------------------------------------------------------------

describe("parseFamilyHistoryAnswers", () => {
  it("returns EMPTY on null / non-object input", () => {
    expect(parseFamilyHistoryAnswers(null).relatives).toEqual([]);
    expect(parseFamilyHistoryAnswers("garbage").relatives).toEqual([]);
  });

  it("repairs a relative missing the diagnoses array (would crash detectors otherwise)", () => {
    const malformed = {
      self: { age: 42, sexAtBirth: "male" },
      relatives: [{ id: "r1", relationship: "parent", side: "shared" /* no diagnoses */ }],
    };
    const parsed = parseFamilyHistoryAnswers(malformed);
    expect(parsed.relatives[0].diagnoses).toEqual([]);
    // detectSignals must not throw on this:
    expect(() => detectSignals(parsed)).not.toThrow();
  });

  it("drops relatives with no id (cannot be addressed safely)", () => {
    const malformed = {
      relatives: [{ relationship: "parent" }, { id: "r2", relationship: "sibling" }],
    };
    const parsed = parseFamilyHistoryAnswers(malformed);
    expect(parsed.relatives.length).toBe(1);
    expect(parsed.relatives[0].id).toBe("r2");
  });

  it("is deterministic — parsing the same malformed object twice returns equal output", () => {
    // A diagnosis without an id used to be filled with Math.random() in the
    // product repo. The engine fallback is `dx_<relativeId>_<index>` — a
    // stable, content-derived ID. This test exists to prevent any future
    // contributor swapping it back to a random one.
    const malformed = {
      relatives: [
        {
          id: "r1",
          relationship: "parent",
          side: "maternal",
          diagnoses: [
            { condition: "cancer", cancerType: "breast", ageAtDx: 45 }, // no id
            { condition: "type_2_diabetes", ageAtDx: 50 }, // no id
          ],
        },
        {
          id: "r2",
          relationship: "sibling",
          diagnoses: [{ condition: "myocardial_infarction" }], // no id, no age
        },
      ],
      knownGeneticTests: [
        { id: "g1", subject: "self", condition: "brca1", result: "negative" },
        { /* no id */ subject: "relative", condition: "brca2", result: "positive" },
      ],
    };
    const a = parseFamilyHistoryAnswers(malformed);
    const b = parseFamilyHistoryAnswers(malformed);
    expect(a).toEqual(b);

    // And the fallback IDs are the expected content-derived shape, not random:
    expect(a.relatives[0].diagnoses[0].id).toBe("dx_r1_0");
    expect(a.relatives[0].diagnoses[1].id).toBe("dx_r1_1");
    expect(a.relatives[1].diagnoses[0].id).toBe("dx_r2_0");

    // KnownGeneticTest without an id is dropped (can't be referenced).
    expect(a.knownGeneticTests.length).toBe(1);
    expect(a.knownGeneticTests[0].id).toBe("g1");
  });
});
