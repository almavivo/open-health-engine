# Changelog

All notable changes to `@almavivo/engine` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] — 2026-05-18

Purely additive release. No 0.2.0 module signatures or rule outputs were
modified; existing consumers do not need any code changes to upgrade.
Safety fixes from the 0.2.0 review are tracked separately and will ship
in a `0.2.1` patch release rather than being bundled here.

### New

- **Reaction-pattern classifier** (`src/reaction-pattern.ts`). Classifies a
  user-completed symptom & trigger log into one of seven pattern labels
  (`emergency_pattern`, `immediate_reaction_pattern`, `recurring_hives_pattern`,
  `rhinitis_pattern`, `delayed_intolerance_pattern`, `mixed_pattern`,
  `no_clear_pattern`), and emits a public list of hard exclusions any
  self-trial worksheet must refuse to run for (emergency reaction history,
  pregnancy, under-18, eating-disorder history, diabetes on glucose meds,
  GI red flags). Also exposes a tier-B/C/D `TRIGGER_SPECS` catalogue plus
  per-trigger gates (`triggerGate`, `allowedTriggers`) so consumers can
  build their own elimination-trial worksheets without re-implementing the
  safety logic. Common IgE allergens (peanut, tree nut, shellfish, fish,
  sesame, egg, soy) are deliberately excluded from the catalogue — those
  belong with a clinician, never a home trial.

- **Family Health History** (`src/family-history/`). Deterministic pattern
  detection over a user-built pedigree. Ten discussion-prompt signals
  anchored to USPSTF, ACC/AHA, ADA, ACG, AAD, NLA, AHA, and the
  Alzheimer's Association: premature CAD pattern, narrowed
  unexplained/early sudden-death pattern, T2D family cluster,
  HBOC-spectrum cluster, Lynch-spectrum pattern, familial-
  hypercholesterolemia hint, early dementia pattern, thoracic aortic
  disease in a first-degree relative, melanoma family pattern (framed as
  a skin-exam discussion prompt, not a screening recommendation), and a
  two-branch colorectal screening age modifier. Outputs are *discussion
  prompts*, never determinations that formal criteria (Amsterdam II,
  Bethesda, NCCN thresholds) are met. The What's-missing analysis and
  Questions-to-ask-relatives generator are first-class outputs — the
  feature is built for adopted, estranged, donor-conceived, and partial-
  history users whose pedigrees are inherently incomplete.

- **`BANNED_DETERMINATION_PHRASES`** (public list) +
  **`enforceFirewall()`** (runtime check). The engine's first auditable
  safety contract that operates on *output copy*, not just inputs. The
  firewall scans every emitted signal string for banned determination
  phrases ("you meet," "you have," "criteria are met," "diagnosed,"
  "high risk for," "lynch family," "hboc family"). Under `NODE_ENV=test`
  it throws so CI fails on a copy regression; in production it logs to
  `console.error` so the report still renders. Same shape, in spirit, as
  the existing `EXCLUDED_TESTS` and `EXCLUDED_SUPPLEMENTS` lists.

- **Structured `GuidelineCitation` shape** (in `src/family-history/types.ts`).
  Citations are now versioned, URL-bearing records with a `reviewedAt`
  date and an optional `reviewer` field, rather than free-text comments.
  0.3.0 introduces this pattern; existing 0.2.0 modules continue to use
  free-text comments and are explicitly not retrofitted in this release
  (no rule outputs changed). Future releases will retrofit other modules
  one at a time.

- **`parseFamilyHistoryAnswers`** — defensive constructor for untrusted
  input (e.g. JSON parsed from a backup file or a previous app version).
  Coerces an arbitrary `unknown` into a fully-formed `FamilyHistoryAnswers`
  with safe defaults so detectors can't crash on a missing field. Pure
  and **deterministic** — repeated calls on the same input return equal
  output. When a diagnosis arrives without an `id` the fallback is a
  content-derived `dx_<relativeId>_<index>`, never random; the
  determinism test guards against any future contributor swapping that
  back to `Math.random()`.

### Tests

- 16 new family-history rule tests (premature CAD positive + negative,
  narrowed sudden-death including the 92yo "natural causes" negative
  case, HBOC parent+aunt same-lineage positive plus cross-lineage
  negative, Lynch with explicit Amsterdam/Bethesda copy ban, both
  branches of the colorectal screening age modifier, empty-tree and
  all-unknown-tree cases, and a whole-tree firewall sweep).
- 3 new parser tests including a determinism assertion (parsing the same
  malformed object twice returns equal output, with content-derived
  fallback IDs).
- 18 new reaction-pattern classifier tests covering all 7 pattern
  labels, all 6 hard exclusions individually, plus a stacked-exclusion
  case.


### Safety

- **DEXA bone-density** rule split: women ≥65 remain `recommended`
  (USPSTF 2025 Grade B); men ≥70 moved to the new `discuss` tier
  (USPSTF Grade I — insufficient evidence for routine screening,
  risk-factor-based discussion preferred).
- **Vitamin D testing** restricted to populations the 2024 Endocrine
  Society guideline endorses for testing/supplementation: pregnancy,
  suspected malabsorption, CKD, and adults ≥75. Otherwise the rule
  lands in the `discuss` tier with copy explaining the 2024 guidance
  is against routine screening in healthy adults under 75. The
  `guidelineAnchor` is updated from "Endocrine Society 2011" to the
  2024 framing. Lab-marker and lab-interpreter copy softened around
  the sufficiency threshold.
- **Annual CBC + CMP** demoted from `recommended`/`strongly_recommended`
  to `discuss` for asymptomatic adults. USPSTF has no recommendation
  either way; the rule now points users toward the legitimate
  triggers (medication monitoring, symptoms, pregnancy, known
  condition).
- **Fall-risk screening** in adults 65+ re-anchored from a
  misattributed USPSTF claim to the CDC STEADI framework
  (screen → assess → intervene). USPSTF supports targeted exercise
  and fall-prevention interventions for older adults at risk.
- **Medication-review prompts** in the medications module: eight
  prompts that previously cited `sourceId: "general"` are now anchored
  to named NICE / ATA / BNF guidelines:
  - Anticoagulant + bruising / supplement review → NICE NG196
  - Metformin + B12 monitoring → NICE NG28
  - Levothyroxine timing → ATA 2014 hypothyroidism guidelines
  - Diuretic + dizziness → NICE CG182
  - ACE inhibitor cough → NICE NG136
  - Statin myalgia → NICE CG181
  - Pregnancy medication review → BNF / NICE prescribing-in-pregnancy
- Earlier in the cycle (commit `d66282c`):
  `lab-interpreter.ts` had `"smoking_never" as QuestionId` (a
  TypeScript cast-around-the-type-system bug). Now reads from the
  correct `tobacco_use` field. The smoking-context note for elevated
  hsCRP now actually fires.
- Earlier in the cycle (commit `d66282c`): `MARKER_SUPPLEMENTS` had
  `vitamin_d` and `omega_3` as supplement IDs; the canonical IDs are
  `vitamin_d3` and `omega3`. The marker-to-supplement cross-reference
  now resolves.

### New

- `LabTier` gains a fourth variant: `"discuss"` — for the case where
  guidelines don't back a routine order but the topic is worth raising
  with a clinician based on context. Display order:
  `strongly_recommended → recommended → discuss → optional`. This is
  additive; existing consumers continue to work.
- **Lab interpreter** (`lab-interpreter.ts`, `lab-markers.ts`,
  `lab-overrides.ts`): map user-supplied numeric lab values onto
  reference bands and emit clinician-review or urgent flags. Public
  exports: `interpretLabs`, `applyLabOverrides`, `LAB_MARKERS`,
  `findMarker`, `selectRange`, `bandValue`, plus the `LabBand`,
  `LabMarker`, `LabResultSet`, `LabValue`, `LabFlag`, `LabInterpretation`,
  and `LabMarkerDomain` types.
- **Physical prep sheet** (`physical-prep.ts`): generates a structured
  prep checklist for an annual physical (history, screening, vitals,
  exam, vaccines, labs, lifestyle, family planning, red flags). Public
  exports: `buildPhysicalPrepSheet`, `prepCategoryLabel`,
  `prepTierLabel`, `prepCadenceDueLabel`, plus the `PrepTier`,
  `PrepCategory`, `PrepQuestion`, `PrepCadence`, `PrepRedFlag`, and
  `PhysicalPrepSheet` types.
- **Shift planner** (`shift-planner.ts`): circadian guidance for shift
  workers. Public exports: `deriveShiftPlan`, `isShiftWorker`, plus
  the `ShiftPattern`, `ShiftAnchor`, `RotationDayNote`, and `ShiftPlan`
  types.
- **Medications module** (`src/medications/`): branded → class
  catalog, named-source citations, symptom + context flags, review
  prompts, and a sheet builder. Public exports listed in
  [`src/index.ts`](./src/index.ts).

### Catalog

- Supplement and medication catalog growth carried over from the
  closed repo since `0.1.0`.

### Engine refinements

- Updates to `derive-nutrient-signals.ts`, `derive-profile.ts`,
  `rules-engine.ts`, `supplements.ts`, `questionnaire.ts`,
  `lab-recommendations.ts`, and `types.ts` since `0.1.0`. No breaking
  changes to public-API shapes; the `LabTier` addition is additive.

### Behavioural diffs vs `0.1.0`

- Personas with male sex and age 70+ no longer see DEXA in the
  `recommended` tier — they now see it in the `discuss` tier with the
  risk-factor-led copy.
- Personas <75 with no pregnancy / malabsorption / CKD signals no
  longer see vitamin D in the `recommended`/`optional` tier — they
  see it in the `discuss` tier.
- Personas in midlife or older no longer see CBC/CMP in
  `recommended`/`strongly_recommended` — they see them in the
  `discuss` tier. (Symptom-driven CBC orders still fire at higher
  tiers.)

### Deprecations

None.

## [0.1.0] — 2026-05-05

Initial public release. Engine surface, supplement catalog, lab
recommender, deficiency signal derivation, profile derivation, and
13 persona snapshots + 6 property-based invariants.
