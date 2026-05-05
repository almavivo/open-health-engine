# Known limitations

> The document a hostile reviewer would write, written by the
> maintainers instead. Updated as gaps are closed.

This engine is published as a research-grade rules base, not as
clinical software. The `MEDICAL-DISCLAIMER.md` makes the legal
position; this file makes the technical one. We list what's missing
publicly because most projects in this space don't, and because the
gaps are exactly the contributions we most want to receive.

## Scope of medication interaction modeling

The engine models a fixed set of named drug classes. The
questionnaire asks about each one; the `RiskFlag` system carries
each one; supplement rules read each one.

**What we model:**

- Anticoagulants: warfarin and DOACs
- Daily aspirin and NSAIDs (synthetically promoted to anticoagulant
  status to fire the same gates)
- SSRIs, SNRIs, MAOIs, tramadol, triptans, lithium (serotonergic)
- Glucose-lowering medications generally
- Metformin specifically (B12 depletion)
- Statins
- Levothyroxine and other thyroid hormones (absorption timing)
- Proton-pump inhibitors (B12 / Mg / Ca absorption)
- Immunosuppressants (cyclosporine, tacrolimus, mycophenolate,
  methotrexate, biologics)

**What we do not model.** The engine does not collect a free-text
or autocomplete medication list. Anything outside the named classes
above is invisible to the rules. Examples of clinically important
drug-supplement interactions we cannot catch:

- Beta-blockers + hawthorn / coleus
- ACE inhibitors / ARBs + potassium supplements
- Calcium channel blockers + grapefruit-active botanicals
- Antiepileptics + several botanicals (CYP induction)
- Antiretrovirals + St. John's Wort (St. John's Wort is excluded
  from the catalog entirely; see `EXCLUDED_SUPPLEMENTS`)
- Opioid users + serotonergic botanicals
- QT-prolonging drugs + supplements with QT signal
- Specific oncology agents

Whenever a user reports `medication_profile = some_rx` or
`polypharmacy`, the engine raises an `unlisted_medications` risk
flag. The UI surfaces this as a banner: *"We did not collect a full
medication list. Discuss any supplement with your pharmacist before
starting."* This is the structural honesty rather than implied
safety.

## Catalog gaps

122 supplements is a sample, not a census. Notable items currently
absent or only partially covered:

- Some rare regional adaptogens (e.g. shilajit, wild blue-green algae)
- The full long tail of mushroom extracts beyond reishi, lions mane,
  cordyceps
- Specialty nootropic compounds (racetams, noopept) — deliberately out
  of scope for a wellness engine
- Deuterated water, hydrogen water, and similar — pseudoscience, will
  remain out of scope
- Comprehensive sport-specific stacks (pre-workout, intra-workout) —
  scoped to single-ingredient items only

Items deliberately excluded entirely live in the
`EXCLUDED_SUPPLEMENTS` array in
[`src/supplements.ts`](../src/supplements.ts) with reasoning per
item.

## Questionnaire gaps

Questions a thorough clinician would expect that we do not yet ask:

- Family history (cardiovascular, metabolic, malignancy)
- Cancer history or active cancer treatment
- Bariatric surgery history (changes absorption profoundly for iron,
  B12, fat-soluble vitamins, calcium)
- Eating disorder history
- Recent surgery or hospitalization
- Specific antibiotic recent use (gut flora context)
- Specific anticonvulsant or antipsychotic use
- A free-text or autocomplete medication list (see above)

These are tracked as roadmap items. Until they exist, users with
those histories should treat the engine's output as a starting
point for a clinician conversation, not a recommendation set.

## Pediatric dosing

The `PEDIATRIC_ALLOWED` allow-list defines which supplements an
under-18 user can be auto-recommended at all. Currently there is **no
weight-based dose adjustment** within that list. A 7-year-old and a
17-year-old receive the same `doseGuidance` text. This is intentional
in v0.1.x: the allow-list signals which items are appropriate to
*consider with a paediatrician*, and actual dosing must come from the
clinician. A future version will add weight-band stratification.

## Pregnancy granularity

The engine treats pregnancy as a single state. There is no trimester
specificity. Several supplements have trimester-specific evidence
(ginger nausea protocols, iron requirements escalating in T2/T3,
specific B-vitamin needs around neural tube closure). For now the
engine routes pregnant users almost entirely to clinician review
with a small pregnancy-safe allow-list (vitamin D3, omega-3, iron).
Trimester-aware logic is a roadmap item.

## CYP450 / P-glycoprotein modeling

The engine does not have a generalized CYP450 / PGP interaction
matrix. Where individual supplement-drug interactions have a known
mechanism, the rule encodes it directly (berberine + CYP3A4
substrates is mentioned in the rationale; St. John's Wort is
excluded entirely). The engine cannot, however, automatically warn
about every CYP3A4 substrate when a CYP3A4-active supplement is
recommended.

A CYP-aware extension is a meaningful future feature but requires
either an authoritative interaction database (DrugBank, NDF-RT) or
hand-curated coverage at scale. We have not committed to either path.

## Renal / hepatic dose adjustment

The engine asks about kidney and liver history and raises
`kidney_disease` / `liver_disease` risk flags. Several supplements
hard-exclude on these flags. The engine does **not** continuously
adjust doses based on eGFR or Child-Pugh class — it treats these
flags as binary gates. Mild CKD (stage 2–3) and well-compensated
liver disease may benefit from supplements the engine excludes
outright; severe disease may warrant exclusions the engine doesn't
make. A clinician with the lab values is the right venue.

## Citation freshness

Most evidence references in the catalog were stamped with a uniform
`lastReviewed` date during initial assembly. The underlying studies
are largely 2015–2023. The `EvidenceReference.lastReviewed` field's
TypeScript comment now makes the import-marker semantics explicit.
Treat any date older than 18 months as a hint that the source
deserves another look.

The highest-value contributions this project can receive are PRs
that re-review individual citations against current literature and
update the `lastReviewed` field per item with a real date.

## Lab engine scope

The lab engine covers baseline adult screening anchored to:

- USPSTF (US Preventive Services Task Force)
- AAFP (American Academy of Family Physicians)
- ATA (American Thyroid Association)
- Endocrine Society
- ADA (American Diabetes Association)
- ACC/AHA (American College of Cardiology / American Heart Association)
- ACG (American College of Gastroenterology)
- AAAAI (American Academy of Allergy, Asthma & Immunology)
- ASRM (American Society for Reproductive Medicine)
- ACOG (American College of Obstetricians and Gynecologists)
- KDIGO (Kidney Disease: Improving Global Outcomes)
- AASLD (American Association for the Study of Liver Diseases)
- NICE (UK National Institute for Health and Care Excellence)
- ESC (European Society of Cardiology)
- BSH (British Society for Haematology)

Out of scope: oncology workups, rheumatology workups (beyond basic
ANA where indicated), specialty neurology, infectious disease
workups beyond standard adult screening. The
`EXCLUDED_TESTS` array documents the specific functional-medicine
tests we refuse to recommend, with reasoning per test.

The `EXCLUDED_TESTS` list is *documentation, not enforcement*. It
exists so contributors can see the editorial position. A test
mistakenly added through the regular `LAB_SPECS` table won't be
caught by the blacklist at runtime. A static check that
asserts no item in `EXCLUDED_TESTS.name` matches a `LabSpec.name`
is a planned addition.

## What this engine should never be used for

- Diagnostic decision-making
- Acute care
- Pediatric prescribing
- Pregnancy prescribing
- Oncology adjunct decision-making
- Replacing pharmacist or physician interaction screening for any
  patient on more than one prescription medication
- Driving consumer purchases without a clinician check on safety
  guards relevant to the individual

If you are building a product on top of this engine, your obligations
under medical-device, advertising, data-protection, and consumer-
protection laws are independent of this list — and likely more
expansive. See [MEDICAL-DISCLAIMER.md](../MEDICAL-DISCLAIMER.md).

---

*This document is updated as gaps close. The most recent commits to
this file are the most reliable signal of where the project actually
stands.*
