# @almavivo/engine

> An open, deterministic clinical rules engine for supplement, lab,
> medication-review, and physical-prep guidance. Audit the rules.
> Read the exclusions. If something's wrong, open an issue or a PR.

[![ci](https://github.com/almavivo/open-health-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/almavivo/open-health-engine/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-Apache_2.0-blue)](./LICENSE)
[![evidence framework](https://img.shields.io/badge/evidence-tiered-blue)](./docs/evidence-framework.md)

A pure TypeScript package, zero runtime dependencies. Takes 74 health
and lifestyle answers, runs them through deterministic rules, produces
a personalised stack of supplement, lab, and lifestyle recommendations
with rationale, citations, and safety guards. Powers
[almavivo.com](https://almavivo.com).

We open-sourced it because clinical credibility shouldn't rest on
"trust us, we cite studies." The rules, citations, and exclusions are
right there — audit them.

**Designed around three structural commitments**, each enforced by a
property-based test that runs in CI:

- **Red-flag interception.** Any of nine clinically urgent symptoms
  (chest pain, blood in stool, unintended weight loss, suicidal
  thoughts, severe headache, neurological deficits, breast lump,
  persistent fever, blood in urine) produces an empty stack and routes
  to clinician review. This is enforced before scoring, not after.
- **Refusal before recommendation.** What the engine **won't**
  recommend, and why, is a public artifact equal in weight to what
  it does. See `EXCLUDED_TESTS` and `EXCLUDED_SUPPLEMENTS`.
- **Determinism.** Same input → same output, every time. No
  `Date.now`, no `Math.random`, no environment dependencies. Verified
  by ~200 random property checks per CI run.

---

## What this engine refuses to recommend

Most supplement and lab tools optimize for breadth: more tests, more
products. We optimize the other way. The list of things we **won't**
recommend, and the reasoning behind each refusal, is part of the public
artifact.

A representative slice from [docs/exclusions.md](./docs/exclusions.md):

| Excluded | Why |
|---|---|
| Hair tissue mineral analysis | Same hair, different labs, different results (Seidel et al, JAMA 2001) |
| IgG food sensitivity panels | AAAAI, EAACI, CSACI position statements: reflects exposure, not pathology |
| DUTCH test, salivary sex hormone panels | Endocrine Society: not validated against serum |
| MTHFR genotyping (general population) | ACMG 2013: "not recommended" |
| 4-point salivary "adrenal fatigue" cortisol | Endocrine Society: "adrenal fatigue is not a real medical condition" |
| Reverse T3 as routine | Not in ATA or Endocrine Society guidelines |
| Live blood cell analysis, iridology, applied kinesiology | Pseudoscience |
| Provoked urinary toxic metals | AAP/ACMT: reference ranges are unprovoked, the method is invalid |
| GI-MAP / GI Effects "dysbiosis index" | Speculative; no validated decision rules |

Same applies to supplements. The `EXCLUDED_SUPPLEMENTS` array in
[`src/supplements.ts`](./src/supplements.ts) is documentation of what we
**won't** include in the auto-recommendation catalog at all. The lead
entry is St. John's Wort — its CYP3A4 induction wrecks oral
contraceptives, warfarin, immunosuppressants, antiretrovirals, and
many others. The interaction surface is so broad that this engine
cannot model it safely without a full medication list, which we
deliberately do not collect. Other excluded items: yohimbine, bitter
orange, ephedra, comfrey, kratom, DHEA, pregnenolone, colloidal
silver, black salve, MMS / chlorine dioxide.

Items that ARE in the catalog but heavily restricted: kava
(hepatotoxicity case reports — affiliate-ineligible); high-dose
vitamin A, niacin, red yeast rice, ashwagandha, curcumin (clinician-
context only). Full list and reasoning: [docs/exclusions.md](./docs/exclusions.md).

If you disagree with any exclusion, open a PR. Editorial decisions in
this codebase are public artifacts; changing them should be too.

---

## What this is

A TypeScript package, zero runtime dependencies, that exposes one
primary function:

```ts
import { buildRecommendationPlan } from "@almavivo/engine";

const plan = buildRecommendationPlan({
  age_band: "30_44",
  sex: "female",
  pregnant_or_breastfeeding: "yes",
  primary_goal: "general_nutrition",
  // ...
});

// plan.stack            → recommended supplements
// plan.worthConsidering → optional alternatives
// plan.excluded         → why each excluded item was excluded
// plan.riskFlags        → safety signals (pregnancy, anticoagulant, etc.)
// plan.labRecommendations → personalised lab tests with guideline anchors
// plan.baselineNudges   → lifestyle interventions before supplements
```

### What it actually does — two real personas

These are committed test fixtures, not marketing examples. The full
input answers and full output plans live at
[`tests/personas/`](./tests/personas/).

**Persona 1: 65-year-old male on warfarin, focused on cognitive
longevity.**

```json
// Input — tests/personas/fixtures/warfarin-65.input.json
{
  "primary_goal": "cognitive_longevity",
  "age_band": "60_69",
  "sex": "male",
  "blood_thinner_use": "yes",
  "medication_profile": "some_rx",
  "diet_pattern": "omnivore",
  "fish_intake": "weekly",
  "sun_exposure": "moderate"
  // ... 12 more answers
}
```

```json
// Output — tests/personas/snapshots/warfarin-65.plan.json
{
  "riskFlags": ["blood_thinner_use", "unlisted_medications"],
  "stack": [
    { "id": "vitamin_d3", "status": "recommended", "category": "core_stack" }
  ],
  "worthConsidering": [
    { "id": "citicoline", "status": "worth_considering" },
    { "id": "l_theanine", "status": "worth_considering" }
  ],
  "excluded": [
    { "id": "fish_oil", "status": "do_not_recommend" },
    { "id": "vitamin_e", "status": "do_not_recommend" },
    { "id": "ginkgo_biloba", "status": "do_not_recommend" },
    { "id": "garlic_extract", "status": "do_not_recommend" },
    { "id": "ginger", "status": "do_not_recommend" },
    { "id": "curcumin", "status": "do_not_recommend" },
    { "id": "panax_ginseng", "status": "do_not_recommend" }
    // ... 13 more anticoagulant-conflict items, each excluded
  ],
  "labRecommendations": [ /* 17 personalised lab tests */ ]
}
```

Note: the engine excludes 20 known anticoagulant-conflict items
automatically, surfaces a `unlisted_medications` flag (we did not
ask the user to list every medication — we cannot model what we
were not told), and still produces a single recommendation
(vitamin D3, given low sun exposure for the user's age band).

**Persona 2: 45-year-old male reporting new chest pain.**

```json
// Input — tests/personas/fixtures/red-flag-chest-pain.input.json
{
  "primary_goal": "energy",
  "age_band": "45_59",
  "sex": "male",
  "red_flag_symptoms": "rf_chest_pain",
  "stress_load": "high",
  "exercise_pattern": "mostly_sedentary"
  // ... rest of answers
}
```

```json
// Output — tests/personas/snapshots/red-flag-chest-pain.plan.json
{
  "riskFlags": ["needs_clinician_review", "urgent_clinical_review"],
  "stack": [],
  "worthConsidering": [],
  "excluded": [ /* every supplement, all demoted */ ],
  "labCount": 0,
  "nudgeCount": 2
}
```

Empty stack. Empty `worthConsidering`. Every supplement demoted.
Two lifestyle nudges only. The engine refuses to make a
recommendation in the presence of an unevaluated red-flag symptom,
no matter how aligned the user's goal is with available
supplements. This behaviour is locked in by the
[`red-flag` invariant test](./tests/invariants/red-flag.test.ts)
which runs ~100 random checks per CI.

## What this is not

- **Not medical advice.** Not clinically validated. Not FDA-approved.
  Not a substitute for a clinician. See [MEDICAL-DISCLAIMER.md](./MEDICAL-DISCLAIMER.md).
- **Not a recommendation system in the ML sense.** No collaborative
  filtering, no embeddings, no LLM. It's a deterministic rules engine.
- **Not a complete clinical decision support system.** It covers
  general adult supplementation and baseline lab screening, not
  diagnosis, treatment, or specialty care.

## What it gets right

- 7 named drug classes the engine actually models: anticoagulants
  (warfarin / DOACs), daily aspirin / NSAIDs, SSRIs and other
  serotonergic agents, glucose-lowering drugs, statins,
  levothyroxine, proton-pump inhibitors, metformin, and
  immunosuppressants. The questionnaire asks about each one; the
  `RiskFlag` set captures it; supplement rules read it. The engine
  also raises an explicit `unlisted_medications` flag whenever the
  user reports being on a prescription, with a banner that says
  "we did not collect a full medication list — discuss with your
  pharmacist." This is deliberate honesty about scope.
- 20 supplements with anticoagulant interaction guards (vitamin E,
  fish oil, ginkgo, garlic, ginger, turmeric/curcumin, ginseng,
  willow bark, feverfew, saw palmetto, krill oil, boswellia, vitamin
  K2, and others) automatically suppressed when
  `blood_thinner_use=yes` or `daily_aspirin_or_nsaid=yes` — the
  latter is synthetically promoted to fire the same gates
- Age-band stratification through 80+ (split 60–69 / 70–79 / 80+, with
  an explicit `ELDERLY_ALLOWED` guard for the oldest band)
- Pediatric allow-list (`PEDIATRIC_ALLOWED`): under-18 users only
  receive items from a narrow set; everything else routes to
  clinician review
- Pregnancy suppression with a tiny pregnancy-safe allow-list
- Red-flag interception: chest pain, blood in stool, unintended weight
  loss, suicidal thoughts, severe headache, neurological symptoms,
  breast lump, persistent fever — any of these triggers
  `urgent_clinical_review` and demotes every supplement out of
  `recommended`
- Confounder filtering on derived signals (e.g. familial premature
  greying does not trigger a B12-deficiency signal)
- Synthetic blood-thinner promotion: `daily_aspirin_or_nsaid=yes`
  fires every anticoagulant gate as if `blood_thinner_use=yes`
- Score thresholds, exclusion clauses, and the "core_stack-only path
  to `recommended`" structural promise — all enforced by tests

## What it gets wrong (probably)

Plenty. Notable known limitations:

- ~122 supplement rules cover the most common items but not the long
  tail of regional or niche compounds
- Drug interaction coverage is opinionated, not exhaustive — there
  are thousands of theoretical pairings; we encode the ones with
  meaningful clinical signal
- **Citation freshness is uneven.** Most references were stamped with
  a uniform `lastReviewed` date during initial catalog assembly —
  that's an import marker, not a guarantee. Underlying studies are
  largely 2015–2023. Treat any date older than 18 months as a hint
  that the source deserves another look. PRs updating individual
  references with current re-review dates are some of the
  highest-value contributions this project can receive.
- The lab engine covers baseline adult screening anchored to USPSTF/
  AAFP/ATA/Endocrine Society/ADA/ACC-AHA/ACG/AAAAI/ASRM/ACOG/KDIGO/
  AASLD/NICE/ESC/BSH guidelines, but specialty workups (oncology,
  rheumatology, neurology) are out of scope

PRs welcome. The exclusion list is where we own up to deliberate gaps;
the test suite is where we lock in the safety guards we've already
built. See [docs/known-limitations.md](./docs/known-limitations.md)
for the full honest accounting of what this engine doesn't yet do —
it's the document a hostile reviewer would write, written instead by
the maintainers.

---

## Architecture in 60 seconds

```
AnswerMap (74 questions, plus derived signals merged in)
  ↓
withDerivedSignals()      — merge nutrient + risk signals into AnswerMap
  ↓
collectRiskFlags()        — produce RiskFlag[] from answers
  ↓
scoreSupplement()         — per supplement: excludeIf → pediatric guard →
                             clinicianReviewIf → boostIf → optionalIf → status
  ↓
removeConflictingScores() — stack overlap deconfliction
  ↓
red-flag suppression      — if urgent_clinical_review, demote everything
  ↓
buildSchedule + buildDailyPlan + collectBaselineNudges
                          + collectLifestyleInterventions
                          + deriveLabRecommendations
  ↓
RecommendationPlan
```

Pure functions, no framework, no DOM, no I/O. Run it in Node, in a
browser, in a Cloudflare Worker, in a Deno script, anywhere TypeScript
runs.

## Evidence framework

Every supplement and lab citation carries an evidence tier:

- **Tier A** — multiple high-quality RCTs or systematic reviews with
  consistent effect
- **Tier B** — at least one quality RCT or strong observational
  consensus
- **Tier C** — emerging evidence, mechanistic plausibility, mixed
  trials
- **Tier D** — traditional use only; insufficient modern evidence

Only Tier A and Tier B items can reach `status: "recommended"`. Tier C
caps at `worth_considering`. Tier D caps at `traditional_use`. Full
criteria: [docs/evidence-framework.md](./docs/evidence-framework.md).

## Tests

The engine ships with a property-based and snapshot-based test suite.
Run with `npm test`. The suite includes:

**Snapshot tests for 13 personas:**
healthy 30-year-old, pregnant 30, under-18, warfarin user, daily
aspirin, red-flag chest pain, vegan with low B12, heavy alcohol,
heavy smoker, postmenopausal, sarcopenic 75-year-old, 80+ with
polypharmacy, UPF-heavy with low produce. Each snapshot is a
machine-readable record of what the engine actually recommends for
that persona. They double as documentation: a clinician reviewing a
PR can see exactly what changes for each persona.

**Property-based invariants** (each runs against ~100–200 random
answer sets):

- **Pediatric** — under-18 users never receive a non-allow-list
  supplement as `recommended`
- **Pregnancy** — pregnant users never receive a non-pregnancy-safe
  supplement as `recommended`
- **Anticoagulant** — users on blood thinners or daily aspirin never
  receive any of the 13 anticoagulant-conflict supplements as
  `recommended`
- **Red-flag** — any red-flag symptom triggers
  `urgent_clinical_review` and demotes everything from `recommended`
- **Determinism** — `buildRecommendationPlan(x)` always equals
  `buildRecommendationPlan(x)` (no `Date.now`, no `Math.random`, no
  unsorted Set/Map iteration)
- **Recommended-implies-core-stack** — only supplements with
  `category: "core_stack"` can ever reach `status: "recommended"`

These invariants are public commitments. They run in CI on every PR.

---

## Contributing

Two contributor paths:

**I'm a developer.** Read [CONTRIBUTING.md](./CONTRIBUTING.md). Find a
"good first issue" — many are simple citation updates or
`lastReviewed` date refreshes. Tests run on every PR.

**I'm a clinician.** You shouldn't need to read TypeScript to audit a
rule. Browse [`docs/supplements/`](./docs/supplements/) and
[`docs/labs/`](./docs/labs/) — every supplement rule and lab marker
has a plain-English Markdown view showing its indications,
contraindications, dosing window, evidence citations, and quality
requirements. Those files are *generated* from the TypeScript catalogs
(`src/supplements.ts`, `src/lab-markers.ts`) by `npm run docs:generate`
and re-verified on every PR, so they cannot silently drift from the
rules the engine actually runs.

To suggest a change, open an issue or a PR against the TypeScript
source. The repository ships a **Clinician Review** PR template that
asks for citation (DOI/PMID), conflict-of-interest disclosure, and
last-reviewed date — a maintainer will regenerate the Markdown on
merge.

Every merged contribution earns a credit line in
[CONTRIBUTORS.md](./CONTRIBUTORS.md) with name, credential, and
optional practice link. The almavivo.com **Trusted Reviewers** page
mirrors this list.

For substantive contributions (new supplement rules with full
evidence packages, deficiency signals with confounder analysis, lab
additions with guideline citations) we offer honoraria. Contact the
maintainers in advance.

## What's in the box

```
@almavivo/engine/
├── src/
│   ├── index.ts                    Public API surface
│   ├── types.ts                    Type system, RiskFlag union, EvidenceReference
│   ├── questionnaire.ts            Health/lifestyle questions
│   ├── rules-engine.ts             Scoring, risk-flag collection, plan assembly
│   ├── supplements.ts              Supplement rules + EXCLUDED_SUPPLEMENTS
│   ├── lab-recommendations.ts      Lab engine + EXCLUDED_TESTS (incl. discuss tier)
│   ├── lab-markers.ts              Marker definitions, units, reference ranges
│   ├── lab-overrides.ts            Apply user-supplied numeric values
│   ├── lab-interpreter.ts          Numeric values → bands + flags
│   ├── physical-prep.ts            Annual physical prep sheet
│   ├── shift-planner.ts            Shift-pattern circadian planner
│   ├── medications/                Medication review module
│   │   ├── catalog.ts              Branded → class lookup
│   │   ├── classes.ts              Class abstractions + named guideline sources
│   │   ├── rules.ts                Review-prompt rules (NICE/Beers/STOPP/ATA/BNF)
│   │   ├── symptoms.ts             Symptom + context flag definitions
│   │   ├── build-sheet.ts          Sheet assembly from intake
│   │   ├── types.ts                Module types
│   │   └── index.ts                Module surface
│   ├── derive-nutrient-signals.ts  Confounder-aware deficiency derivation
│   └── derive-profile.ts           Cognitive / stress / circadian / aspiration profiles
├── tests/
│   ├── invariants/                 6 property-based invariants
│   └── personas/
│       ├── fixtures/               13 hand-authored persona inputs
│       └── snapshots/              13 committed plan outputs
├── docs/
│   ├── evidence-framework.md       Tier A/B/C/D criteria, status caps
│   ├── exclusions.md               EXCLUDED_TESTS + EXCLUDED_SUPPLEMENTS in prose
│   ├── known-limitations.md        The document a hostile reviewer would write
│   ├── supplements/                Generated MD view of every supplement rule
│   └── labs/                       Generated MD view of every lab marker
├── scripts/
│   └── generate-docs.ts            TS catalogs → docs/supplements + docs/labs
├── README.md
├── LICENSE                         Apache 2.0
├── MEDICAL-DISCLAIMER.md
├── CONTRIBUTING.md                 Two paths: clinician vs developer
├── CONTRIBUTORS.md                 Credit list (populates via PRs)
├── package.json                    Library config; zero runtime deps
├── tsconfig.json                   Emits .d.ts for the package
├── vitest.config.ts
└── .github/
    ├── workflows/ci.yml            typecheck + test + build on Node 20/22
    └── PULL_REQUEST_TEMPLATE/clinician_review.md
```

11.9k lines of pure TypeScript. No runtime dependencies. Builds to
ESM with `.d.ts` declarations. Tested deterministically.

## License

Apache 2.0. The patent grant matters in this adjacent space; the "no
warranty" boilerplate matters even more. See [LICENSE](./LICENSE) and
[MEDICAL-DISCLAIMER.md](./MEDICAL-DISCLAIMER.md).

## A note on the closed product

Almavivo (the product at almavivo.com) is the consumer-facing
application of this engine. The product — UI, brand, copy, affiliate
relationships, distribution — is closed source. The clinical logic is
this package. Same separation of concerns Plausible and Cal.com use:
open core, closed hosted product.

If you ship a product on top of this engine, that's exactly what the
license allows. If you build on it commercially and it pays off, we'd
love to hear about it. If you find a bug or a missing safety guard,
that's not a feature request — that's the contribution we most need.
