# Contributing

Two contributor paths. Pick the one that fits.

## I'm a clinician

You don't need to touch TypeScript. Most of what this project needs from
clinicians lives in plain text and Markdown.

**Things we'd love from you, in rough order of value:**

1. **Errors in supplement evidence or dosing** — open an issue with the
   citation (DOI/PMID preferred). If you have an alternative citation
   you think we should be using, name it.

2. **Missing safety guards** — drug interactions, organ-specific
   contraindications, age-band restrictions we haven't encoded. The
   engine errs on the side of "too cautious" rather than "too
   permissive," but we routinely miss things.

3. **Tests we should be excluding** — if there's a lab test getting
   marketed in your specialty that lacks evidence, the
   [`EXCLUDED_TESTS`](./src/lab-recommendations.ts) list is
   where it should land. Open a PR or issue with the rationale.

4. **Tests we *should* be including** — particularly for specialty
   contexts (women's health, cardiometabolic, GI, sleep medicine).

5. **Clarifications in citation language** — when the rationale field
   on a supplement reads as overconfident or when a study we cite has
   been superseded.

**The Clinician Review PR template** asks for:

- The claim being changed (one sentence)
- The citation (DOI/PMID, study title, year)
- Conflict-of-interest disclosure (paid relationships with supplement
  brands, lab companies, advocacy groups)
- Last-reviewed date — when did you last verify the source?

Don't worry about TypeScript syntax. If you can write the change in
plain English in the PR description, a maintainer will encode it.

## I'm a developer

Standard open-source flow.

```bash
git clone <repo>
cd <repo>
npm install
npm test            # run the test suite
npm run typecheck   # tsc --noEmit
```

**Good first issues** are tagged `good-first-issue` — many are simple
citation refreshes (`lastReviewed` date updates) or improvements to the
exclusion documentation. The codebase has zero runtime dependencies, so
the build is fast and the surface area is small.

**Adding a supplement.** Append to `supplementCatalog` in `src/supplements.ts`.
Required fields are typed in `SupplementRule`. Always include
`qualityRequirements` (it's surfaced to the user) and at least one
`evidence` reference with `lastReviewed`. Add a snapshot test if the
rule introduces a new exclusion path.

**Adding a question.** Update `QuestionId` in `src/types.ts`, push to
`questionnaire.ts`, then wire any consumers (rules, derivers,
`excludeIf`/`boostIf`). `tsc --noEmit` catches most mismatches.

**Touching the scoring algorithm.** The score thresholds (45 for
`recommended`, 38 for `worth_considering`), boost magnitudes (+15),
optional bumps (+5), and schedule fit boost (+10) are concentrated in
`scoreSupplement`. They are deliberately undocumented constants —
touch them carefully and add tests that pin the new behavior.

**Tests required for engine changes.** Any change that affects the
plan output should either update an existing persona snapshot
intentionally or add a new persona that exercises the new path.
Property-based invariant tests should not need changes unless the
invariant itself is changing — and if it is, that's a design
decision, not a fix.

## Review expectations

Substantive PRs are reviewed against an explicit bar. The bar
varies by what is changing:

**Changes to evidence references (URLs, study citations, `lastReviewed` dates)**
- A current citation (DOI / PMID preferred, NIH ODS / NCCIH /
  Cochrane / guideline-society sources accepted)
- The reviewer's `lastReviewed` date
- Conflict-of-interest disclosure
- Reviewers will check: is the source present, is it the right
  citation for the claim, is the claim still accurate

**Changes to dosing (`doseGuidance`, `timingGuidance`, dose ceilings)**
- Cited evidence for the dose range or ceiling
- Confirmation that any upper-limit warning matches IOM / EFSA /
  guideline UL where one exists
- A persona snapshot diff if the change affects what the engine
  outputs
- Reviewers will check: does the dose stay below documented
  toxicity thresholds, is timing guidance physiologically sound

**Changes to contraindications (`excludeIf`, `clinicianReviewIf`)**
- Cited evidence for the interaction or contraindication
- Mechanism (CYP induction, serotonergic activity, anticoagulant
  potentiation, organ-system contraindication, etc.)
- A property-based invariant test if the contraindication is
  categorical (anticoagulant interaction, pregnancy suppression,
  pediatric exclusion all currently have invariants)
- Reviewers will check: does the engine actually fire the new
  guard for the right user profiles, do existing personas reflect
  the change

**Changes to exclusions (`EXCLUDED_SUPPLEMENTS`, `EXCLUDED_TESTS`)**
- Cited reasoning for adding or removing the exclusion
- A position-statement reference where one exists (AAAAI, ACMG,
  Endocrine Society, ATA, ACMT, etc.)
- Conflict-of-interest disclosure (especially relevant for
  removing an exclusion — who benefits from this item being
  recommendable?)
- Reviewers will check: is the reasoning accurate and current,
  does the exclusion's removal create a downstream safety gap

**Changes to scoring constants (45 / 38 thresholds, +15 / +5 boosts)**
- Documented rationale for the new value
- Snapshot diffs for at least 5 representative personas
- A clear statement of what the change is intended to *do*
  (more permissive recommendations? tighter? both?)
- These constants are deliberately undocumented in the code — the
  PR is the design document

**Pure code changes (refactors, build, tooling, formatting)**
- Standard code review applies. No clinical-evidence requirement.
- COI disclosure is not required.

A reviewer responding to a substantive PR will typically request
the missing pieces from this checklist before merging. Don't take
that as friction — it's the reviewer doing the same work the PR
author should have done. The Clinician Review PR template asks
for most of these items in its fields.

## Conflict of interest policy

Health-adjacent open source attracts contributions from people with
financial ties to supplement brands, lab companies, and advocacy
organizations. That's fine — the contributions are often the most
substantive — but the relationships need to be public.

The Clinician Review PR template has a COI disclosure field. Fill it
in honestly. Reviewers will weigh contributions accordingly. Hidden
conflicts that surface later are grounds for reverting changes.

We don't reject contributions because of COI. We reject them because
they're wrong, unsupported, or break the editorial principles in
[docs/exclusions.md](./docs/exclusions.md).

## Recognition

Every merged contribution earns a credit line in
[CONTRIBUTORS.md](./CONTRIBUTORS.md) with name, credential, and
optional practice link. The almavivo.com Trusted Reviewers page
mirrors this list.

For substantive contributions — new supplement rules with full
evidence packages, deficiency signals with confounder analysis, lab
additions with guideline citations — we offer honoraria. Contact the
maintainers in advance to discuss scope.

## Code of conduct

Standard [Contributor Covenant](https://www.contributor-covenant.org/).
Disagree about evidence, not about people.
