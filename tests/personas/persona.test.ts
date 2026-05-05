import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { buildRecommendationPlan } from "../../src/rules-engine";
import type { AnswerMap } from "../../src/types";

const FIXTURE_DIR = join(__dirname, "fixtures");

const fixtures = readdirSync(FIXTURE_DIR)
  .filter((f) => f.endsWith(".input.json"))
  .map((f) => ({
    name: basename(f, ".input.json"),
    path: join(FIXTURE_DIR, f),
  }));

describe("persona snapshots", () => {
  for (const { name, path } of fixtures) {
    it(`plan for ${name} matches snapshot`, async () => {
      const answers = JSON.parse(readFileSync(path, "utf-8")) as AnswerMap;
      const plan = buildRecommendationPlan(answers);

      // Snapshot a deterministic, readable subset of the plan. The full plan
      // includes long copy fields and ordering that are noisy in diffs; the
      // shape below is what a clinician reviewing a PR actually wants to see.
      const snapshot = {
        riskFlags: plan.riskFlags.slice().sort(),
        stack: plan.stack.map((s) => ({
          id: s.supplementId,
          status: s.status,
          category: s.category,
        })),
        worthConsidering: plan.worthConsidering.map((s) => ({
          id: s.supplementId,
          status: s.status,
        })),
        excluded: plan.excluded.map((s) => ({
          id: s.supplementId,
          status: s.status,
        })),
        labCount: plan.labRecommendations.length,
        nudgeCount: plan.baselineNudges.length,
      };

      await expect(JSON.stringify(snapshot, null, 2)).toMatchFileSnapshot(
        join(__dirname, "snapshots", `${name}.plan.json`),
      );
    });
  }
});
