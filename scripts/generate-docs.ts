/**
 * Generate Markdown sidecar docs from the TypeScript catalogs.
 *
 * Reads:  src/supplements.ts, src/lab-markers.ts, src/questionnaire.ts
 * Writes: docs/supplements/<id>.md, docs/labs/<id>.md, docs/supplements/README.md,
 *         docs/labs/README.md
 *
 * The TypeScript source remains canonical. These Markdown files exist so that
 * clinicians and curious readers can audit every rule in plain English without
 * reading TypeScript. CI runs this generator on every PR and fails if the
 * committed Markdown differs from what would be generated — so the docs cannot
 * silently drift from the rules.
 *
 * Run: npm run docs:generate
 */

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { supplementCatalog } from "../src/supplements.js";
import { questionnaire } from "../src/questionnaire.js";
import { LAB_MARKERS } from "../src/lab-markers.js";
import type {
  Condition,
  QuestionDefinition,
  QuestionId,
  QuestionOptionValue,
  SupplementRule,
} from "../src/types.js";
import type { LabBand, LabMarker, ReferenceRange } from "../src/lab-markers.js";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SUPP_OUT = join(REPO_ROOT, "docs", "supplements");
const LABS_OUT = join(REPO_ROOT, "docs", "labs");

// ---------------------------------------------------------------------------
// Human-label maps, derived from the questionnaire (no hand-maintained tables)
// ---------------------------------------------------------------------------

const questionIndex: Map<QuestionId, QuestionDefinition> = new Map(
  questionnaire.map((q) => [q.id, q]),
);

const optionLabelByQuestion: Map<QuestionId, Map<QuestionOptionValue, string>> =
  new Map(
    questionnaire.map((q) => [
      q.id,
      new Map(q.options.map((o) => [o.value, o.label])),
    ]),
  );

/**
 * Some option values are used only by derived signals (e.g. `signal_strong`,
 * `risk_high`, `present`) and don't appear in any questionnaire option list.
 * Render them with a sensible fallback rather than the raw enum string.
 */
const DERIVED_VALUE_LABELS: Record<string, string> = {
  signal_strong: "strong signal",
  signal_moderate: "moderate signal",
  signal_weak: "weak signal",
  signal_none: "no signal",
  risk_none: "no risk",
  risk_low: "low risk",
  risk_moderate: "moderate risk",
  risk_high: "high risk",
  present: "present",
  current: "current",
  former_remote: "former (>10y)",
  former_recent: "former (≤10y)",
};

const DERIVED_QUESTION_LABELS: Partial<Record<QuestionId, string>> = {
  derived_iron_signal: "Iron signal",
  derived_zinc_signal: "Zinc signal",
  derived_b12_signal: "B12 signal",
  derived_b_complex_signal: "B-complex signal",
  derived_vitamin_c_signal: "Vitamin C signal",
  derived_vitamin_d_signal: "Vitamin D signal",
  derived_omega3_signal: "Omega-3 signal",
  derived_magnesium_signal: "Magnesium signal",
  derived_vitamin_a_signal: "Vitamin A signal",
  derived_vitamin_k_signal: "Vitamin K signal",
  derived_alcohol_risk: "Alcohol risk",
  derived_smoking_risk: "Smoking risk",
  derived_produce_risk: "Produce-intake risk",
  derived_glycemic_risk: "Glycemic risk",
  derived_diet_quality_risk: "Diet-quality risk",
  derived_red_flag: "Red-flag screen",
  // Back-compat questionIds — these used to be standalone yes/no questions
  // and are still referenced by older rules; the questionnaire now folds
  // them into `condition_history` (multi-select). Provide plain-English
  // titles so generated docs read cleanly.
  thyroid_disorder: "Thyroid disorder",
  autoimmune_condition: "Autoimmune condition",
  kidney_history: "History of kidney disease",
  liver_history: "History of liver problems",
  kidney_stones: "History of kidney stones",
  condition_history: "Medical condition history",
  blood_thinner_use: "Taking blood thinners",
  daily_aspirin_or_nsaid: "Daily aspirin or NSAID",
  ssri_or_serotonergic_use: "Taking SSRI or serotonergic medication",
  glucose_lowering_med: "Taking glucose-lowering medication",
  statin_use: "Taking a statin",
  alcohol_frequency: "Alcohol frequency (legacy)",
  red_flag_symptoms: "Red-flag symptoms",
  specific_medications: "Specific medications",
  existing_supplements: "Existing supplements",
  known_allergies: "Known allergies",
};

/**
 * Fallback labels for raw QuestionOptionValue strings that appear across many
 * questions (yes / no / not_sure / none) — used when the question's own option
 * list doesn't carry a label (e.g. back-compat questionIds with no matching
 * QuestionDefinition).
 */
const COMMON_VALUE_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  not_sure: "Not sure",
  none: "None",
  prefer_not_to_say: "Prefer not to say",
};

function questionTitle(id: QuestionId): string {
  const q = questionIndex.get(id);
  if (q) return q.title;
  const derived = DERIVED_QUESTION_LABELS[id];
  if (derived) return derived;
  return id;
}

function valueLabel(id: QuestionId, value: QuestionOptionValue): string {
  const optionMap = optionLabelByQuestion.get(id);
  const labelled = optionMap?.get(value);
  if (labelled) return labelled;
  if (DERIVED_VALUE_LABELS[value]) return DERIVED_VALUE_LABELS[value];
  if (COMMON_VALUE_LABELS[value]) return COMMON_VALUE_LABELS[value];
  return String(value).replace(/_/g, " ");
}

// ---------------------------------------------------------------------------
// Condition rendering
// ---------------------------------------------------------------------------

function renderConditionList(conditions: Condition[]): string[] {
  const lines: string[] = [];
  for (const c of conditions) {
    const title = questionTitle(c.questionId);
    const includes = (c.includes ?? []).map((v) => valueLabel(c.questionId, v));
    const excludes = (c.excludes ?? []).map((v) => valueLabel(c.questionId, v));
    const parts: string[] = [];
    if (includes.length > 0) {
      parts.push(`is **${includes.join("** or **")}**`);
    }
    if (excludes.length > 0) {
      parts.push(`is **not** ${excludes.join(" or ")}`);
    }
    if (parts.length === 0) {
      lines.push(`- ${title}`);
    } else {
      lines.push(`- **${title}** ${parts.join(" and ")}`);
    }
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Vocabulary → human prose
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<SupplementRule["category"], string> = {
  core_stack: "Core stack",
  conditional: "Conditional",
  exploratory: "Exploratory",
  alternative_traditional: "Alternative / traditional",
};

const TIER_LABELS: Record<string, string> = {
  tier_a: "Tier A — high-quality RCTs / meta-analyses",
  tier_b: "Tier B — supportive RCTs or strong observational",
  tier_c: "Tier C — small RCTs or mechanistic support",
  tier_d: "Tier D — traditional use or weak modern evidence",
};

const DOSE_WINDOW_LABELS: Record<string, string> = {
  morning: "Morning",
  evening: "Evening",
};

const AFFILIATE_LABELS: Record<string, string> = {
  eligible: "Eligible",
  needs_clinician_context: "Needs clinician context",
  ineligible: "Ineligible",
};

const CERTIFICATION_LABELS: Record<string, string> = {
  usp_verified: "USP Verified",
  nsf_certified: "NSF Certified",
  nsf_certified_for_sport: "NSF Certified for Sport",
  informed_sport: "Informed Sport",
  informed_choice: "Informed Choice",
  third_party_coa: "Third-party COA",
};

const CONTAMINANT_LABELS: Record<string, string> = {
  heavy_metals: "Heavy metals",
  oxidation_rancidity: "Oxidation / rancidity",
  microbial: "Microbial",
  pesticides: "Pesticides",
  solvent_residue: "Solvent residue",
  adulteration: "Adulteration",
  identity_substitution: "Identity substitution",
};

const WHY_NOT_PRIMARY_LABELS: Record<string, string> = {
  narrower_indication: "Narrower indication",
  smaller_effect_size: "Smaller effect size",
  weaker_modern_evidence: "Weaker modern evidence",
  overlap_with_primary: "Overlap with a primary recommendation",
  needs_self_experiment: "Needs self-experiment to confirm benefit",
  limited_safety_data: "Limited safety data",
};

const GOAL_LABELS: Record<string, string> = {
  sleep: "Sleep",
  energy: "Energy",
  stress: "Stress",
  performance: "Performance",
  cognitive_performance: "Cognitive performance",
  cognitive_longevity: "Cognitive longevity",
  joint_mobility: "Joint mobility",
  general_nutrition: "General nutrition",
  immune_support: "Immune support",
  gut_support: "Gut support",
  healthy_aging: "Healthy aging",
};

function labelGoal(g: string): string {
  return GOAL_LABELS[g] ?? g.replace(/_/g, " ");
}

// ---------------------------------------------------------------------------
// Supplement → Markdown
// ---------------------------------------------------------------------------

function frontmatter(obj: Record<string, unknown>): string {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map((x) => yamlScalar(x)).join(", ")}]`);
    } else {
      lines.push(`${k}: ${yamlScalar(v)}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

function yamlScalar(v: unknown): string {
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  const s = String(v);
  // Quote if contains characters that need quoting in YAML
  if (/[:#&*?{}\[\],|>!%@`]/.test(s) || /^\s|\s$/.test(s)) {
    return `"${s.replace(/"/g, '\\"')}"`;
  }
  return s;
}

function supplementToMarkdown(rule: SupplementRule): string {
  const fm = frontmatter({
    id: rule.id,
    slug: rule.slug,
    name: rule.name,
    category: rule.category,
    evidenceTier: rule.evidenceTier,
    primaryGoals: rule.primaryGoals,
    defaultDoseWindow: rule.defaultDoseWindow,
    baseScore: rule.baseScore,
    minScheduleFitScore: rule.minScheduleFitScore,
    affiliateEligibility: rule.affiliatePolicy.eligibility,
    sourceFile: "src/supplements.ts",
  });

  const sections: string[] = [];
  sections.push(`# ${rule.name}`);
  sections.push(
    "> **Generated from `src/supplements.ts`. Do not edit this file directly — " +
      "edit the TypeScript source and run `npm run docs:generate`.**",
  );

  sections.push("## At a glance");
  const glance: string[] = [];
  glance.push(`- **Category:** ${CATEGORY_LABELS[rule.category]}`);
  glance.push(`- **Evidence tier:** ${TIER_LABELS[rule.evidenceTier] ?? rule.evidenceTier}`);
  glance.push(`- **Primary goals:** ${rule.primaryGoals.map(labelGoal).join(", ")}`);
  glance.push(`- **Dose window:** ${DOSE_WINDOW_LABELS[rule.defaultDoseWindow]}`);
  glance.push(`- **Preferred forms:** ${rule.preferredForms.join(", ")}`);
  glance.push(`- **Base score:** ${rule.baseScore}`);
  sections.push(glance.join("\n"));

  sections.push("## Guidance");
  sections.push(
    [
      `**Dose:** ${rule.doseGuidance}`,
      `**Timing:** ${rule.timingGuidance}`,
      `**Reassessment:** ${rule.evaluationWindow}`,
    ].join("\n\n"),
  );

  if (rule.rationale.length > 0) {
    sections.push("## Rationale");
    sections.push(rule.rationale.map((r) => `- ${r}`).join("\n"));
  }

  if (rule.whyNotPrimary && rule.whyNotPrimary.length > 0) {
    sections.push("## Why not in the core stack");
    sections.push(
      rule.whyNotPrimary
        .map((w) => `- ${WHY_NOT_PRIMARY_LABELS[w] ?? w}`)
        .join("\n"),
    );
  }

  if (rule.excludeIf && rule.excludeIf.length > 0) {
    sections.push("## Excluded if (hard contraindications)");
    sections.push(
      "The supplement will **not be recommended** when any of these apply:",
    );
    sections.push(renderConditionList(rule.excludeIf).join("\n"));
  }

  if (rule.clinicianReviewIf && rule.clinicianReviewIf.length > 0) {
    sections.push("## Routes to clinician review");
    sections.push(
      "Triggers handing the decision to a clinician rather than auto-recommending:",
    );
    sections.push(renderConditionList(rule.clinicianReviewIf).join("\n"));
  }

  if (rule.includeIf && rule.includeIf.length > 0) {
    sections.push("## Considered when");
    sections.push(renderConditionList(rule.includeIf).join("\n"));
  }

  if (rule.optionalIf && rule.optionalIf.length > 0) {
    sections.push("## Surfaced as optional when");
    sections.push(renderConditionList(rule.optionalIf).join("\n"));
  }

  if (rule.boostIf && rule.boostIf.length > 0) {
    sections.push("## Score boosts");
    sections.push(
      "Score is boosted (+15 per matching condition) when:",
    );
    sections.push(renderConditionList(rule.boostIf).join("\n"));
  }

  if (rule.goalRelevance && rule.goalRelevance.length > 0) {
    sections.push("## Goal relevance");
    const rows = [
      "| Trigger | Studied for | Effect size |",
      "|---|---|---|",
      ...rule.goalRelevance.map((gr) => {
        const incl = (gr.when.includes ?? [])
          .map((v) => valueLabel(gr.when.questionId, v))
          .join(" or ");
        const trigger = `${questionTitle(gr.when.questionId)}: ${incl}`;
        return `| ${trigger} | ${gr.studiedFor} | ${gr.effectSize} |`;
      }),
    ];
    sections.push(rows.join("\n"));
  }

  if (rule.alreadyTakingIf && rule.alreadyTakingIf.length > 0) {
    sections.push("## Already-taking detection");
    sections.push(renderConditionList(rule.alreadyTakingIf).join("\n"));
  }

  if (rule.coveredByMultiIf && rule.coveredByMultiIf.length > 0) {
    sections.push("## Covered by multivitamin when");
    sections.push(renderConditionList(rule.coveredByMultiIf).join("\n"));
  }

  if (
    (rule.sameWindowConflicts && rule.sameWindowConflicts.length > 0) ||
    (rule.stackConflicts && rule.stackConflicts.length > 0)
  ) {
    sections.push("## Stack interactions");
    const items: string[] = [];
    if (rule.sameWindowConflicts && rule.sameWindowConflicts.length > 0) {
      items.push(
        `- **Same-window conflicts:** ${rule.sameWindowConflicts.join(", ")}`,
      );
    }
    if (rule.stackConflicts && rule.stackConflicts.length > 0) {
      items.push(`- **Stack conflicts:** ${rule.stackConflicts.join(", ")}`);
    }
    sections.push(items.join("\n"));
  }

  sections.push("## Quality requirements");
  const q = rule.qualityRequirements;
  const qLines: string[] = [];
  if (q.preferredCertifications.length > 0) {
    qLines.push(
      `- **Preferred certifications:** ${q.preferredCertifications
        .map((c) => CERTIFICATION_LABELS[c] ?? c)
        .join(", ")}`,
    );
  }
  if (q.contaminantConcerns.length > 0) {
    qLines.push(
      `- **Contaminant concerns:** ${q.contaminantConcerns
        .map((c) => CONTAMINANT_LABELS[c] ?? c)
        .join(", ")}`,
    );
  }
  if (q.identityNotes) qLines.push(`- **Identity:** ${q.identityNotes}`);
  if (q.formNotes) qLines.push(`- **Form notes:** ${q.formNotes}`);
  sections.push(qLines.join("\n"));

  sections.push("## Affiliate policy");
  const affLines = [
    `- **Status:** ${AFFILIATE_LABELS[rule.affiliatePolicy.eligibility] ?? rule.affiliatePolicy.eligibility}`,
  ];
  if (rule.affiliatePolicy.reason) {
    affLines.push(`- **Reason:** ${rule.affiliatePolicy.reason}`);
  }
  sections.push(affLines.join("\n"));

  if (rule.evidence.length > 0) {
    sections.push("## Evidence");
    sections.push(
      rule.evidence
        .map(
          (e) =>
            `- [${e.label}](${e.url}) — *last reviewed ${e.lastReviewed}*`,
        )
        .join("\n"),
    );
  }

  sections.push("## Clinician review");
  sections.push(
    "To suggest a change, open an issue or PR. Edits land in " +
      "`src/supplements.ts`; this file regenerates on merge. The " +
      "[Clinician Review PR template](../../.github/PULL_REQUEST_TEMPLATE/clinician_review.md) " +
      "captures citation (DOI/PMID), conflict-of-interest disclosure, and review date.",
  );

  return fm + "\n\n" + sections.join("\n\n") + "\n";
}

// ---------------------------------------------------------------------------
// Lab marker → Markdown
// ---------------------------------------------------------------------------

const LAB_DOMAIN_LABELS: Record<string, string> = {
  cbc: "Complete blood count",
  iron: "Iron status",
  metabolic: "Metabolic panel",
  lipids: "Lipids",
  glycemic: "Glycemic control",
  thyroid: "Thyroid",
  vitamins_minerals: "Vitamins and minerals",
  inflammation: "Inflammation",
};

function rangeLine(r: ReferenceRange, hasLowBand: boolean, unit: string): string {
  const parts: string[] = [];
  if (r.sex) parts.push(`**${r.sex}**`);
  if (r.ageBands && r.ageBands.length > 0) {
    parts.push(`ages ${r.ageBands.join(", ")}`);
  }
  if (parts.length === 0) parts.push("**all**");

  const bands: string[] = [];
  if (hasLowBand && r.low !== undefined) {
    bands.push(`low <${r.low}`);
  }
  if (hasLowBand && r.borderlineLow !== undefined && r.low !== undefined) {
    bands.push(`borderline-low ${r.low}–${r.borderlineLow}`);
  }
  if (r.borderlineLow !== undefined && r.borderlineHigh !== undefined) {
    bands.push(`normal ${r.borderlineLow}–${r.borderlineHigh}`);
  } else if (r.borderlineHigh !== undefined) {
    bands.push(`normal up to ${r.borderlineHigh}`);
  }
  if (r.borderlineHigh !== undefined && r.high !== undefined) {
    bands.push(`borderline-high ${r.borderlineHigh}–${r.high}`);
  }
  if (r.high !== undefined) {
    bands.push(`high ≥${r.high}`);
  }
  return `- ${parts.join(", ")}: ${bands.join(" · ")} ${unit}`;
}

function labMarkerToMarkdown(m: LabMarker): string {
  const fm = frontmatter({
    id: m.id,
    name: m.name,
    shortName: m.shortName,
    domain: m.domain,
    canonicalUnit: m.canonicalUnit,
    hasLowBand: m.hasLowBand,
    precision: m.precision,
    linkedLabStatusQuestion: m.linkedLabStatusQuestion,
    sourceFile: "src/lab-markers.ts",
  });

  const sections: string[] = [];
  sections.push(`# ${m.name}${m.shortName ? ` (${m.shortName})` : ""}`);
  sections.push(
    "> **Generated from `src/lab-markers.ts`. Do not edit this file directly — " +
      "edit the TypeScript source and run `npm run docs:generate`.**",
  );

  sections.push("## At a glance");
  sections.push(
    [
      `- **Domain:** ${LAB_DOMAIN_LABELS[m.domain] ?? m.domain}`,
      `- **Canonical unit:** ${m.canonicalUnit}`,
      `- **Accepted units:** ${m.units.map((u) => `${u.label} (×${u.toCanonical} → canonical)`).join(", ")}`,
      `- **Low-band meaningful:** ${m.hasLowBand ? "yes" : "no — only highs are flagged"}`,
      `- **Precision:** ${m.precision} decimal place${m.precision === 1 ? "" : "s"}`,
    ].join("\n"),
  );

  sections.push("## What it measures");
  sections.push(m.description);

  sections.push("## Reference ranges");
  sections.push("Ranges are stored in the canonical unit and applied after unit conversion:");
  sections.push(m.ranges.map((r) => rangeLine(r, m.hasLowBand, m.canonicalUnit)).join("\n"));

  if (m.linkedLabStatusQuestion) {
    sections.push("## Linked intake question");
    sections.push(
      `Numeric values for this marker are interpreted alongside the intake question \`${m.linkedLabStatusQuestion}\`. The lab-overrides module can promote or demote the user-reported status based on the entered value.`,
    );
  }

  sections.push("## Source");
  sections.push(
    "Edits land in `src/lab-markers.ts`. Range provenance lives in inline " +
      "comments next to each marker definition (USPSTF, ADA, ACC/AHA, ATA, " +
      "NICE, BSH where applicable). This file regenerates on merge.",
  );

  return fm + "\n\n" + sections.join("\n\n") + "\n";
}

// ---------------------------------------------------------------------------
// Index README files (the per-folder listing)
// ---------------------------------------------------------------------------

function supplementsIndex(rules: SupplementRule[]): string {
  const grouped = new Map<SupplementRule["category"], SupplementRule[]>();
  for (const r of rules) {
    const arr = grouped.get(r.category) ?? [];
    arr.push(r);
    grouped.set(r.category, arr);
  }
  const order: SupplementRule["category"][] = [
    "core_stack",
    "conditional",
    "exploratory",
    "alternative_traditional",
  ];
  const lines: string[] = [];
  lines.push("# Supplement rules");
  lines.push("");
  lines.push(
    "Plain-English readable views of every supplement rule in the engine. " +
      "Generated from `src/supplements.ts` — do not edit by hand.",
  );
  lines.push("");
  lines.push(`Total rules: **${rules.length}**`);
  lines.push("");
  for (const cat of order) {
    const items = grouped.get(cat);
    if (!items || items.length === 0) continue;
    lines.push(`## ${CATEGORY_LABELS[cat]} (${items.length})`);
    lines.push("");
    for (const r of [...items].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(
        `- [${r.name}](${r.id}.md) — ${TIER_LABELS[r.evidenceTier] ?? r.evidenceTier}, ${r.primaryGoals.map(labelGoal).join(" / ")}`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

function labsIndex(markers: LabMarker[]): string {
  const grouped = new Map<string, LabMarker[]>();
  for (const m of markers) {
    const arr = grouped.get(m.domain) ?? [];
    arr.push(m);
    grouped.set(m.domain, arr);
  }
  const lines: string[] = [];
  lines.push("# Lab markers");
  lines.push("");
  lines.push(
    "Plain-English readable views of every lab marker the engine interprets. " +
      "Generated from `src/lab-markers.ts` — do not edit by hand.",
  );
  lines.push("");
  lines.push(`Total markers: **${markers.length}**`);
  lines.push("");
  for (const [domain, items] of [...grouped.entries()].sort()) {
    lines.push(`## ${LAB_DOMAIN_LABELS[domain] ?? domain} (${items.length})`);
    lines.push("");
    for (const m of [...items].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(
        `- [${m.name}${m.shortName ? ` (${m.shortName})` : ""}](${m.id}.md) — ${m.canonicalUnit}`,
      );
    }
    lines.push("");
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Write helpers — clean and rewrite the whole folder so removals propagate
// ---------------------------------------------------------------------------

function resetDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function main(): void {
  resetDir(SUPP_OUT);
  resetDir(LABS_OUT);

  const sortedSupps = [...supplementCatalog].sort((a, b) => a.id.localeCompare(b.id));
  for (const rule of sortedSupps) {
    writeFileSync(join(SUPP_OUT, `${rule.id}.md`), supplementToMarkdown(rule));
  }
  writeFileSync(join(SUPP_OUT, "README.md"), supplementsIndex(sortedSupps) + "\n");

  const sortedLabs = [...LAB_MARKERS].sort((a, b) => a.id.localeCompare(b.id));
  for (const m of sortedLabs) {
    writeFileSync(join(LABS_OUT, `${m.id}.md`), labMarkerToMarkdown(m));
  }
  writeFileSync(join(LABS_OUT, "README.md"), labsIndex(sortedLabs) + "\n");

  const suppFiles = readdirSync(SUPP_OUT).length;
  const labFiles = readdirSync(LABS_OUT).length;
  console.log(`Wrote ${suppFiles} files to docs/supplements/`);
  console.log(`Wrote ${labFiles} files to docs/labs/`);
}

main();
