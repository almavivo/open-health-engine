# Evidence framework

Every supplement and lab citation in this engine carries an
evidence tier. The tier is not cosmetic — it constrains what
recommendation status the engine can assign. The thresholds are
enforced in [`src/rules-engine.ts`](../src/rules-engine.ts) and
locked in by the `recommended-implies-core-stack` invariant test.

## The four tiers

### Tier A — strong evidence

- Multiple high-quality RCTs **or** a Cochrane / equivalent
  systematic review with consistent effect direction
- Mechanistic plausibility is established
- Dose-response relationship is reasonably understood
- Effect size is clinically meaningful in a defined population

Examples in the catalog: vitamin D3 (deficiency repletion),
omega-3 EPA/DHA (cardiovascular endpoints in elevated triglyceride
populations), magnesium (specific deficiency contexts), creatine
monohydrate (strength + cognitive performance), folate
(periconceptional neural-tube defect prevention).

### Tier B — reasonable evidence

- At least one quality RCT with a meaningful effect size, **or**
- Strong observational evidence with biological plausibility, **or**
- A converging meta-analytic signal that is consistent but smaller
  in magnitude than Tier A

Examples: B12 in vegan or low-intake contexts, iron in confirmed
deficiency, calcium + D for osteoporosis prevention, fibre /
psyllium for LDL and bowel regularity, probiotic-strain-specific
indications, glycine for sleep onset, L-theanine for acute stress
response.

### Tier C — emerging or mixed evidence

- Mechanistic plausibility plus early human data
- Mixed trial results without clear methodological resolution
- Small effect sizes across heterogeneous populations
- Promising signals where larger trials are pending

Examples: bacopa for memory in older adults, ashwagandha for
stress, citicoline for attention, lion's mane for cognition,
saffron for mood adjunct (where SSRI use is excluded), tart
cherry for sleep.

### Tier D — traditional use only

- Long-standing traditional use without modern RCT validation
- Adaptogens broadly
- Botanicals where the modern evidence base is sparse, methodology
  is poor, or trials are inconsistent

Examples: rhodiola, holy basil, eleuthero, schisandra, maca,
cordyceps. These appear in the catalog so users searching for them
get a deliberate "this is traditional use, not validated" framing
rather than no information at all.

## How tiers constrain status

The status caps are structural — they are not advisory:

| Tier | Maximum reachable status |
|---|---|
| A | `recommended` |
| B | `recommended` |
| C | `worth_considering` |
| D | `traditional_use` |

Even a Tier C supplement with strong personal-relevance signals,
goal alignment, and schedule fit cannot be promoted to
`recommended`. This is enforced by the
[`recommended-implies-core-stack` invariant test](../tests/invariants/recommended-implies-core-stack.test.ts)
which runs ~200 random property checks per CI run.

There is one further structural constraint:
**`category: "core_stack"` is the only path to `status: "recommended"`.**
A Tier A supplement that is not in the `core_stack` category caps
at `worth_considering`. The two filters compose: status is the
intersection of (tier ≥ B) ∧ (category = core_stack).

## What "modern" means

The framework treats modern evidence as post-2000 RCTs published
in indexed journals with peer review. Older landmark trials are
acceptable as supporting evidence (they are how mechanism
becomes consensus) but cannot be the *sole* basis for a Tier A or
Tier B claim. This is a deliberate guard against the supplement
literature's tendency to cite single 1970s open-label studies as
foundational evidence.

## Evidence references in the code

Each supplement rule includes an `evidence: EvidenceReference[]`
array. Each reference has:

- `label` — short human-readable title
- `url` — canonical link (NIH ODS, NCCIH, PubMed, Cochrane,
  guideline-society publication, peer-reviewed journal)
- `lastReviewed` — ISO date the citation was last *manually*
  re-checked against current literature

A note on `lastReviewed`: most current entries carry a uniform
date stamped during initial catalog assembly. Treat any date older
than 18 months as a hint that the source deserves another look —
not that it's wrong. PRs updating individual references with
current re-review dates are some of the most valuable
contributions this project can receive. See
[known-limitations.md](./known-limitations.md) for full context.

## Lab evidence

The lab engine uses guideline anchors rather than evidence tiers.
Every lab specification names the issuing body (USPSTF, AAFP,
ATA, Endocrine Society, ADA, ACC/AHA, ACG, AAAAI, ASRM, ACOG,
KDIGO, AASLD, NICE, ESC, BSH). Tests outside guideline coverage
are documented in `EXCLUDED_TESTS` with reasoning. See
[exclusions.md](./exclusions.md).

## Changing a tier

Re-tiering an existing supplement is a substantive change. Use
the [Clinician Review PR template](../.github/PULL_REQUEST_TEMPLATE/clinician_review.md)
and include:

- The new tier and current tier
- Citations supporting the change (DOI / PMID)
- Whether any persona snapshot tests will shift as a result
- Conflict-of-interest disclosure
- Last-reviewed date for the cited evidence

Tier changes that move a supplement from Tier C → B (or D → C)
will typically shift its reachable status in the recommendation
output. The persona test snapshots will update; reviewers should
read those diffs as part of evaluating the change.
