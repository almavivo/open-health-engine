# What this engine refuses to recommend

Most supplement and lab-testing tools optimize for breadth: more tests, more
products, more recommendations. The pitch is that completeness equals quality.

This engine optimizes for the opposite. The list of things it **won't**
recommend — and the reasoning behind each refusal — is part of the public
artifact. Functional medicine has built an industry on tests and supplements
that fail clinical validation; this document is our editorial position on
where that line falls.

If you disagree with an exclusion, open a PR. The disagreement is the point —
better to argue about it in public than to silently include something
because the alternative is awkward.

## Lab tests we exclude

The full machine-readable list lives at [`src/lab-recommendations.ts`](../src/lab-recommendations.ts)
in the `EXCLUDED_TESTS` constant. The list is documentation, not runtime —
it exists so a clinician reading the source can confirm we considered each
common functional-medicine test and rejected it for stated reasons.

### Excluded by category

**Laboratory methods with reproducibility failures**

- **Hair tissue mineral analysis** — Same hair, different labs, different
  results (Seidel et al, JAMA 2001). No clinical validity for nutritional
  or toxic-element status.
- **Provoked (chelator-challenge) urinary toxic metals** — AAP and ACMT
  position statements: reference ranges are unprovoked, so the method is
  invalid. Generates artefactual "high" results that drive unnecessary
  chelation.
- **Spectracell / "intracellular micronutrient panel"** — No independent
  validation; reproducibility issues. Use serum/RBC nutrient assays from
  accredited labs instead.

**Tests rejected by allergy/immunology societies**

- **IgG food sensitivity panels** (LEAP, MRT, ALCAT, EverlyWell food
  sensitivity) — AAAAI, EAACI, and CSACI position statements: food-specific
  IgG reflects exposure, not pathology. Multiple position papers explicitly
  recommend against ordering.
- **Cyrex autoimmune arrays** — No independent validation; high
  false-positive rates.
- **DAO (diamine oxidase) for histamine intolerance** — Unreliable assay;
  not in any allergy society guidelines.

**Tests outside endocrine society guidance**

- **DUTCH test** (dried urine total hormones) — Metabolite ratios are
  marketed as actionable but lack outcome data and aren't validated
  against serum.
- **Salivary sex hormone panels** (general use) — Endocrine Society
  position: not validated against serum for clinical decision-making.
  (Late-night salivary cortisol IS validated for Cushing's screening —
  different use case.)
- **4-point salivary "adrenal fatigue" cortisol curve** — Endocrine
  Society explicit: "adrenal fatigue is not a real medical condition;
  there are no scientific facts to support the theory." The 4-point
  curve is validated for Cushing's screening only.
- **Reverse T3** as routine thyroid evaluation — Not in ATA or Endocrine
  Society guidelines.

**Genotyping with no clinical action**

- **MTHFR genotyping for general population** — ACMG 2013: "MTHFR
  polymorphism testing is not recommended" for general thrombophilia,
  recurrent pregnancy loss, or CVD workup.

**Speculative microbiome interpretations**

- **Comprehensive stool analysis / GI-MAP / GI Effects** — No validated
  clinical decision rules. The marketed "dysbiosis index" interpretations
  are speculative. (Pathogen detection ordered by indication is fine.)

**Pseudoscience**

- **Live blood cell analysis, iridology, applied kinesiology, electrodermal
  biofeedback** — Pseudoscience.

**Research-grade-only methods marketed as clinical**

- **Hair cortisol** — Research-grade only; not clinically actionable.
- **Zonulin / "leaky gut" lactulose-mannitol as clinical tests** — Assay
  validity questioned; clinical utility unproven outside research settings.
- **Organic Acids Test (urine OAT) for general nutrition** — Marketed
  interpretations are not peer-reviewed validated. Useful in specific
  inborn-errors-of-metabolism workups, not for general wellness.

**Questionnaire-driven panels with no decision pathway**

- **"Toxin burden" / "heavy metal load" panels driven by questionnaires**
  — No validated clinical decision pathway; tend to drive unnecessary
  chelation.

## Supplements we exclude entirely

The `EXCLUDED_SUPPLEMENTS` array in
[`src/supplements.ts`](../src/supplements.ts) is the
machine-readable list of items the engine refuses to include in the
auto-recommendation catalog at all, with reasoning per item.

The lead entry is **St. John's Wort (Hypericum perforatum)** — its
CYP3A4, CYP2C9, CYP2C19, and P-glycoprotein induction reduces serum
levels of warfarin, oral contraceptives, immunosuppressants, several
antiretrovirals, anticonvulsants, statins, calcium channel blockers,
and many other drugs. Combined with serotonergic agents it raises
serotonin syndrome risk. The interaction surface is so broad that this
engine cannot model it safely without a full medication list, which we
deliberately do not collect. A clinician with the patient's full
medication list is the right venue for any decision to use it.

Other excluded items: yohimbine / yohimbe (cardiovascular AE signal +
broad psychotropic interactions), bitter orange / synephrine
(sympathomimetic), ephedra (FDA-banned), comfrey internal use
(hepatic veno-occlusive disease from pyrrolizidine alkaloids), kratom
(opioid-receptor activity, dependence and withdrawal), DHEA and
pregnenolone (hormonal precursors — clinician-only), colloidal silver
(argyria), black salve / bloodroot extract (caustic), MMS / chlorine
dioxide (industrial bleach precursor — pseudoscience).

## Supplements we restrict but include

Beyond outright exclusion, there are clear editorial positions encoded
in affiliate policy and exclusion rules for items that *are* in the
catalog:

**Excluded entirely from affiliate promotion**

- **Kava** — Hepatotoxicity case reports, predominantly from non-noble
  cultivars and aerial parts. Real anxiolytic effect, but we don't promote
  it. Status: traditional use only, with explicit liver-history exclusion.

**Restricted to clinician-context use only**

The following are coded as `eligibility: "needs_clinician_context"` —
the engine may surface them, but never as primary recommendations and
never with affiliate links unless the clinical context is established:

- **Iron** — should only be used with deficiency context; avoid casual
  promotion.
- **Generic probiotics** — generic recommendations are not
  evidence-based; only strain-specific products tied to a use case.
- **Melatonin** — not appropriate as a chronic sleep aid; narrow
  indications only.
- **Vitamin A** — emerging signal of cardiovascular risk at high chronic
  doses; recommend with restraint.
- **Vitamin E** — significant interaction with warfarin; clear warning
  required.
- **Niacin (high-dose)** — well-documented neuropathy at chronic high
  doses; upper limit must be highlighted.
- **Red yeast rice** — significant interactions with statins, metformin,
  blood thinners, immunosuppressants; needs clinician framing.
- **Berberine** — FDA's stance has been ambiguous; clinician framing
  recommended.
- **Saffron** — interaction risk with serotonergic medications must be
  highlighted.
- **Curcumin (high-bioavailability extracts)** — hepatotoxicity case
  reports; caveats required.
- **Ashwagandha** — hepatotoxicity and thyroid signals warrant cautious
  exposure with explicit warnings.
- **Tongkat ali, tribulus** — botanical adulteration is widespread;
  strong identity verification required.

The full list of categorical safety guards (anticoagulant interaction,
pediatric allow-list, pregnancy suppression, kidney disease, liver
disease, thyroid disorder, polypharmacy) is encoded in
[`src/rules-engine.ts`](../src/rules-engine.ts) and
[`src/supplements.ts`](../src/supplements.ts). Each
exclusion rule is auditable — read the `excludeIf` clauses on any
supplement to see the conditions under which the engine refuses to
recommend it.

## What we don't exclude (but the industry often pretends to)

A few items that get marketed as dangerous or contraindicated when they
aren't, or that get framed as essential when they aren't. We try to be
honest about these too:

- **Most multivitamins** — for someone with adequate diet and no
  deficiency signals, the evidence for a daily multivitamin is thin. The
  engine won't recommend one unless converging dietary signals justify it.
- **NAD precursors (NMN, NR)** — promising preclinical data, weak human
  outcome data. Coded as exploratory; the engine won't recommend either
  as a primary stack item.
- **Most adaptogens for general wellness** — strong tradition, mixed
  modern evidence. Coded as `alternative_traditional`; the engine surfaces
  them honestly but never as `recommended`.

## How to propose changes

If you think an exclusion is wrong (or that something should be added to
the exclusion list), open a PR using the **Clinician Review** template.
The PR template asks for the citation (DOI/PMID), the conflict-of-interest
disclosure, and the last-reviewed date. Editorial decisions in this
codebase are public artifacts; changing them should be too.
