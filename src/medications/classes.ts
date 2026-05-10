import type { MedicationClass, MedicationClassId, SourceCitation } from "./types";

// ---------------------------------------------------------------------------
// Medication classes
// ---------------------------------------------------------------------------
// Class-level abstractions used by the review-prompt rules. Sources are
// recorded per class to make the citation chain visible at every output.
// See docs/medication-catalog-sources.md.
// ---------------------------------------------------------------------------

const SOURCES: Record<string, SourceCitation> = {
  beers: {
    id: "beers-2023",
    label: "AGS Beers Criteria 2023",
  },
  stopp: {
    id: "stopp-v3",
    label: "STOPP/START v3 (2023)",
  },
  nhsSmr: {
    id: "nhs-smr",
    label: "NHS England — Structured Medication Reviews",
    url: "https://www.england.nhs.uk/primary-care/pharmacy/smr/",
  },
  nhsDeprescribing: {
    id: "nhs-deprescribing",
    label: "NHS deprescribing guidance",
  },
  nice: {
    id: "nice",
    label: "NICE NG5 — Medicines optimisation",
    url: "https://www.nice.org.uk/guidance/ng5",
  },
  niceNG196: {
    id: "nice-ng196",
    label: "NICE NG196 — Atrial fibrillation: diagnosis and management",
    url: "https://www.nice.org.uk/guidance/ng196",
  },
  niceNG28: {
    id: "nice-ng28",
    label: "NICE NG28 — Type 2 diabetes in adults: management",
    url: "https://www.nice.org.uk/guidance/ng28",
  },
  niceCG182: {
    id: "nice-cg182",
    label: "NICE CG182 — Chronic kidney disease in adults",
    url: "https://www.nice.org.uk/guidance/cg182",
  },
  niceNG136: {
    id: "nice-ng136",
    label: "NICE NG136 — Hypertension in adults",
    url: "https://www.nice.org.uk/guidance/ng136",
  },
  niceCG181: {
    id: "nice-cg181",
    label: "NICE CG181 — Cardiovascular disease: risk assessment and reduction",
    url: "https://www.nice.org.uk/guidance/cg181",
  },
  ata2014: {
    id: "ata-2014-hypothyroidism",
    label: "ATA 2014 — Guidelines for treatment of hypothyroidism",
    url: "https://www.thyroid.org/professionals/ata-professional-guidelines/",
  },
  bnfPregnancy: {
    id: "bnf-pregnancy",
    label: "BNF / NICE — Prescribing in pregnancy",
    url: "https://bnf.nice.org.uk/medicines-guidance/prescribing-in-pregnancy/",
  },
};

const CLASSES: MedicationClass[] = [
  {
    id: "ppi",
    label: "Proton-pump inhibitor (PPI)",
    shortLabel: "PPI",
    description:
      "Reduces stomach acid. Common examples include omeprazole, lansoprazole, esomeprazole, pantoprazole.",
    sources: [SOURCES.stopp, SOURCES.nhsDeprescribing],
  },
  {
    id: "h2_blocker",
    label: "H2 receptor blocker",
    shortLabel: "H2 blocker",
    description: "Reduces stomach acid. Examples: famotidine, ranitidine (where still available).",
    sources: [SOURCES.beers],
  },
  {
    id: "benzodiazepine",
    label: "Benzodiazepine",
    shortLabel: "Benzodiazepine",
    description:
      "Sedative / anti-anxiety / sleep medicine. Examples: diazepam, lorazepam, alprazolam, temazepam.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "z_drug",
    label: "Z-drug (sleep medicine)",
    shortLabel: "Z-drug",
    description: "Non-benzodiazepine sleep medicines. Examples: zopiclone, zolpidem, zaleplon.",
    sources: [SOURCES.beers, SOURCES.stopp, SOURCES.nhsDeprescribing],
  },
  {
    id: "ssri",
    label: "SSRI antidepressant",
    shortLabel: "SSRI",
    description: "Selective serotonin reuptake inhibitor. Examples: sertraline, citalopram, fluoxetine.",
    sources: [SOURCES.general],
  },
  {
    id: "snri",
    label: "SNRI antidepressant",
    shortLabel: "SNRI",
    description: "Serotonin-noradrenaline reuptake inhibitor. Examples: venlafaxine, duloxetine.",
    sources: [SOURCES.general],
  },
  {
    id: "tricyclic_antidepressant",
    label: "Tricyclic antidepressant",
    shortLabel: "TCA",
    description: "Older antidepressants also used for nerve pain. Examples: amitriptyline, nortriptyline.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "antipsychotic",
    label: "Antipsychotic",
    shortLabel: "Antipsychotic",
    description: "Used for psychosis, bipolar, and (off-label) sleep or agitation. Examples: olanzapine, quetiapine, risperidone.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "anticholinergic",
    label: "Anticholinergic",
    shortLabel: "Anticholinergic",
    description:
      "A property shared by many medicines that can cause dry mouth, constipation, and confusion at higher cumulative doses.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "first_gen_antihistamine",
    label: "First-generation antihistamine",
    shortLabel: "1st-gen antihistamine",
    description:
      "Older antihistamines that cause drowsiness. Examples: diphenhydramine, chlorpheniramine, promethazine.",
    sources: [SOURCES.beers],
  },
  {
    id: "opioid",
    label: "Opioid pain medicine",
    shortLabel: "Opioid",
    description:
      "Strong painkillers. Examples: codeine, tramadol, morphine, oxycodone, fentanyl, co-codamol.",
    sources: [SOURCES.beers, SOURCES.stopp, SOURCES.nhsDeprescribing],
  },
  {
    id: "nsaid",
    label: "NSAID (anti-inflammatory)",
    shortLabel: "NSAID",
    description:
      "Anti-inflammatory painkillers. Examples: ibuprofen, naproxen, diclofenac, aspirin (high dose).",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "anticoagulant",
    label: "Blood thinner (anticoagulant)",
    shortLabel: "Anticoagulant",
    description: "Reduces blood clotting. Examples: warfarin, apixaban, rivaroxaban, dabigatran, edoxaban.",
    sources: [SOURCES.general, SOURCES.nice],
  },
  {
    id: "antiplatelet",
    label: "Antiplatelet",
    shortLabel: "Antiplatelet",
    description: "Reduces platelet stickiness. Examples: low-dose aspirin, clopidogrel, ticagrelor.",
    sources: [SOURCES.general],
  },
  {
    id: "statin",
    label: "Statin (cholesterol)",
    shortLabel: "Statin",
    description: "Cholesterol-lowering medicine. Examples: atorvastatin, simvastatin, rosuvastatin, pravastatin.",
    sources: [SOURCES.general],
  },
  {
    id: "ace_inhibitor",
    label: "ACE inhibitor (blood pressure)",
    shortLabel: "ACE inhibitor",
    description: "Blood-pressure medicine. Examples: ramipril, lisinopril, enalapril, perindopril.",
    sources: [SOURCES.general],
  },
  {
    id: "arb",
    label: "ARB (blood pressure)",
    shortLabel: "ARB",
    description: "Blood-pressure medicine. Examples: losartan, valsartan, candesartan, irbesartan.",
    sources: [SOURCES.general],
  },
  {
    id: "beta_blocker",
    label: "Beta-blocker",
    shortLabel: "Beta-blocker",
    description:
      "Slows heart rate, lowers blood pressure. Examples: bisoprolol, atenolol, propranolol, metoprolol, carvedilol.",
    sources: [SOURCES.general],
  },
  {
    id: "calcium_channel_blocker",
    label: "Calcium-channel blocker",
    shortLabel: "CCB",
    description: "Blood-pressure medicine. Examples: amlodipine, diltiazem, verapamil, felodipine.",
    sources: [SOURCES.general],
  },
  {
    id: "diuretic_loop",
    label: "Loop diuretic",
    shortLabel: "Loop diuretic",
    description: "Strong water-pill. Examples: furosemide, bumetanide.",
    sources: [SOURCES.beers],
  },
  {
    id: "diuretic_thiazide",
    label: "Thiazide diuretic",
    shortLabel: "Thiazide",
    description: "Water-pill for blood pressure. Examples: bendroflumethiazide, indapamide, hydrochlorothiazide.",
    sources: [SOURCES.general],
  },
  {
    id: "sulfonylurea",
    label: "Sulfonylurea (diabetes)",
    shortLabel: "Sulfonylurea",
    description: "Diabetes medicine that increases insulin. Examples: gliclazide, glipizide, glimepiride.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "metformin",
    label: "Metformin",
    shortLabel: "Metformin",
    description: "First-line diabetes medicine. Long-term use can lower vitamin B12.",
    sources: [SOURCES.general],
  },
  {
    id: "insulin",
    label: "Insulin",
    shortLabel: "Insulin",
    description: "Injectable diabetes medicine.",
    sources: [SOURCES.beers],
  },
  {
    id: "levothyroxine",
    label: "Levothyroxine (thyroid)",
    shortLabel: "Levothyroxine",
    description: "Thyroid hormone replacement. Absorption is sensitive to timing with other medicines.",
    sources: [SOURCES.general],
  },
  {
    id: "bisphosphonate",
    label: "Bisphosphonate (bone)",
    shortLabel: "Bisphosphonate",
    description: "Bone-density medicine. Examples: alendronate, risedronate, zoledronic acid.",
    sources: [SOURCES.general],
  },
  {
    id: "corticosteroid_systemic",
    label: "Oral corticosteroid",
    shortLabel: "Steroid (oral)",
    description: "Systemic steroid. Examples: prednisolone, prednisone, dexamethasone.",
    sources: [SOURCES.general, SOURCES.nice],
  },
  {
    id: "antiepileptic",
    label: "Antiepileptic / mood stabiliser",
    shortLabel: "Antiepileptic",
    description: "Used for epilepsy, mood, or nerve pain. Examples: sodium valproate, carbamazepine, lamotrigine.",
    sources: [SOURCES.general],
  },
  {
    id: "muscle_relaxant",
    label: "Muscle relaxant",
    shortLabel: "Muscle relaxant",
    description: "Examples: cyclobenzaprine, baclofen, tizanidine.",
    sources: [SOURCES.beers],
  },
  {
    id: "alpha_blocker",
    label: "Alpha-blocker",
    shortLabel: "Alpha-blocker",
    description: "Used for prostate symptoms or blood pressure. Examples: tamsulosin, doxazosin.",
    sources: [SOURCES.beers],
  },
  {
    id: "anticholinergic_overactive_bladder",
    label: "Bladder anticholinergic",
    shortLabel: "Bladder antichol.",
    description: "Used for overactive bladder. Examples: oxybutynin, tolterodine, solifenacin.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "gabapentinoid",
    label: "Gabapentinoid",
    shortLabel: "Gabapentinoid",
    description: "Used for nerve pain or anxiety. Examples: gabapentin, pregabalin.",
    sources: [SOURCES.beers, SOURCES.stopp],
  },
  {
    id: "antibiotic_general",
    label: "Antibiotic",
    shortLabel: "Antibiotic",
    description: "Antimicrobial. Many examples; usually short-course.",
    sources: [SOURCES.general],
  },
  {
    id: "ssri_or_snri",
    label: "SSRI or SNRI antidepressant",
    shortLabel: "SSRI/SNRI",
    description: "Virtual grouping used by some review prompts.",
    sources: [SOURCES.general],
  },
  // -------------------------------------------------------------------
  // "Recognised but no class-level rules" classes
  // -------------------------------------------------------------------
  // These appear on the printed sheet so the pharmacist sees them, but
  // the rules engine has no class-level prompts attached — the
  // class-level signal is too low for a layperson-facing prompt.
  // Adding these does NOT change the regulatory shape of the tool.
  {
    id: "paracetamol",
    label: "Paracetamol / acetaminophen",
    shortLabel: "Paracetamol",
    description: "Common over-the-counter painkiller. UK name: paracetamol. US name: acetaminophen.",
    sources: [SOURCES.general],
  },
  {
    id: "second_gen_antihistamine",
    label: "Second-generation antihistamine",
    shortLabel: "Antihistamine (non-drowsy)",
    description: "Non-drowsy antihistamine for allergies. Examples: loratadine, cetirizine, fexofenadine.",
    sources: [SOURCES.general],
  },
  {
    id: "decongestant",
    label: "Decongestant",
    shortLabel: "Decongestant",
    description: "Cold and sinus decongestant. Examples: pseudoephedrine, phenylephrine, oxymetazoline.",
    sources: [SOURCES.general],
  },
  {
    id: "cough_suppressant",
    label: "Cough suppressant",
    shortLabel: "Cough suppressant",
    description: "Used to suppress dry cough. Examples: dextromethorphan, pholcodine.",
    sources: [SOURCES.general],
  },
  {
    id: "expectorant",
    label: "Expectorant / mucolytic",
    shortLabel: "Expectorant",
    description: "Loosens chest congestion. Examples: guaifenesin, bromhexine.",
    sources: [SOURCES.general],
  },
  {
    id: "antidiarrhoeal",
    label: "Antidiarrhoeal",
    shortLabel: "Antidiarrhoeal",
    description: "Used for diarrhoea. Examples: loperamide.",
    sources: [SOURCES.general],
  },
  {
    id: "laxative",
    label: "Laxative",
    shortLabel: "Laxative",
    description: "Used for constipation. Examples: senna, bisacodyl, lactulose, macrogol, docusate.",
    sources: [SOURCES.general],
  },
  {
    id: "melatonin",
    label: "Melatonin",
    shortLabel: "Melatonin",
    description: "Used for sleep or jet lag. Prescription-only in some jurisdictions.",
    sources: [SOURCES.general],
  },
  {
    id: "topical_steroid",
    label: "Topical steroid",
    shortLabel: "Topical steroid",
    description: "Skin steroid cream or ointment. Examples: hydrocortisone, betamethasone.",
    sources: [SOURCES.general],
  },
  {
    id: "topical_antifungal",
    label: "Topical antifungal",
    shortLabel: "Topical antifungal",
    description: "Skin antifungal. Examples: clotrimazole, miconazole, terbinafine.",
    sources: [SOURCES.general],
  },
  {
    id: "antacid",
    label: "Antacid",
    shortLabel: "Antacid",
    description: "Quick-acting indigestion remedy. Examples: Gaviscon, Rennies, Tums, calcium carbonate, aluminium hydroxide.",
    sources: [SOURCES.general],
  },
  {
    id: "inhaled_bronchodilator",
    label: "Inhaled bronchodilator",
    shortLabel: "Inhaler (reliever)",
    description: "Reliever inhaler for asthma or COPD. Examples: salbutamol (albuterol), terbutaline.",
    sources: [SOURCES.general],
  },
  {
    id: "inhaled_steroid",
    label: "Inhaled steroid",
    shortLabel: "Inhaler (preventer)",
    description: "Preventer inhaler. Examples: beclometasone, budesonide, fluticasone.",
    sources: [SOURCES.general],
  },
  {
    id: "nasal_steroid",
    label: "Nasal steroid",
    shortLabel: "Nasal steroid",
    description: "Steroid nasal spray for rhinitis. Examples: fluticasone, mometasone, beclometasone.",
    sources: [SOURCES.general],
  },
  {
    id: "ophthalmic",
    label: "Eye drops",
    shortLabel: "Eye drops",
    description: "Eye drops for dryness, allergy, or glaucoma. Examples: hypromellose, sodium cromoglicate, latanoprost.",
    sources: [SOURCES.general],
  },
  {
    id: "vitamin_or_mineral",
    label: "Vitamin or mineral",
    shortLabel: "Vitamin / mineral",
    description: "Single-ingredient vitamin or mineral. Examples: vitamin D, vitamin B12, iron, magnesium.",
    sources: [SOURCES.general],
  },
];

const CLASS_BY_ID: Record<MedicationClassId, MedicationClass> = CLASSES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<MedicationClassId, MedicationClass>,
);

export function getMedicationClass(id: MedicationClassId): MedicationClass {
  return CLASS_BY_ID[id];
}

export function listMedicationClasses(): MedicationClass[] {
  return CLASSES;
}

export const MEDICATION_SOURCES = SOURCES;
