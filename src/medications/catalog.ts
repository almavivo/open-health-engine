import type { MedicationClassId } from "./types";

// ---------------------------------------------------------------------------
// Drug catalog — name → class lookup
// ---------------------------------------------------------------------------
// Hand-curated. Class assignments cross-checked against RxClass EPC and BNF
// chapter where appropriate. See docs/medication-catalog-sources.md.
//
// Each row has:
//   - lookupTerms: tokens we match against (lowercased substrings of what
//     the user typed, including generic + 1-2 common brand names)
//   - canonicalName: how we display the drug if we recognise it
//   - classId: the pharmacological class
//
// CRITICAL: the catalog is used only to *suggest* a class. The user must
// confirm the assignment before any class-level prompt is triggered. See
// derive-class.ts.
// ---------------------------------------------------------------------------

export interface CatalogEntry {
  lookupTerms: string[];
  canonicalName: string;
  classId: MedicationClassId;
}

const CATALOG: CatalogEntry[] = [
  // ---------- PPIs ----------
  { lookupTerms: ["omeprazole", "prilosec", "losec"], canonicalName: "Omeprazole", classId: "ppi" },
  { lookupTerms: ["lansoprazole", "prevacid", "zoton"], canonicalName: "Lansoprazole", classId: "ppi" },
  { lookupTerms: ["esomeprazole", "nexium"], canonicalName: "Esomeprazole", classId: "ppi" },
  { lookupTerms: ["pantoprazole", "protonix", "pantoloc"], canonicalName: "Pantoprazole", classId: "ppi" },
  { lookupTerms: ["rabeprazole", "aciphex", "pariet"], canonicalName: "Rabeprazole", classId: "ppi" },

  // ---------- Benzodiazepines ----------
  { lookupTerms: ["diazepam", "valium"], canonicalName: "Diazepam", classId: "benzodiazepine" },
  { lookupTerms: ["lorazepam", "ativan"], canonicalName: "Lorazepam", classId: "benzodiazepine" },
  { lookupTerms: ["alprazolam", "xanax"], canonicalName: "Alprazolam", classId: "benzodiazepine" },
  { lookupTerms: ["temazepam"], canonicalName: "Temazepam", classId: "benzodiazepine" },
  { lookupTerms: ["clonazepam", "klonopin"], canonicalName: "Clonazepam", classId: "benzodiazepine" },
  { lookupTerms: ["nitrazepam"], canonicalName: "Nitrazepam", classId: "benzodiazepine" },

  // ---------- Z-drugs ----------
  { lookupTerms: ["zopiclone", "imovane"], canonicalName: "Zopiclone", classId: "z_drug" },
  { lookupTerms: ["zolpidem", "ambien"], canonicalName: "Zolpidem", classId: "z_drug" },
  { lookupTerms: ["zaleplon", "sonata"], canonicalName: "Zaleplon", classId: "z_drug" },

  // ---------- SSRIs ----------
  { lookupTerms: ["sertraline", "zoloft", "lustral"], canonicalName: "Sertraline", classId: "ssri" },
  { lookupTerms: ["citalopram", "celexa", "cipramil"], canonicalName: "Citalopram", classId: "ssri" },
  { lookupTerms: ["escitalopram", "lexapro", "cipralex"], canonicalName: "Escitalopram", classId: "ssri" },
  { lookupTerms: ["fluoxetine", "prozac"], canonicalName: "Fluoxetine", classId: "ssri" },
  { lookupTerms: ["paroxetine", "paxil", "seroxat"], canonicalName: "Paroxetine", classId: "ssri" },

  // ---------- SNRIs ----------
  { lookupTerms: ["venlafaxine", "effexor"], canonicalName: "Venlafaxine", classId: "snri" },
  { lookupTerms: ["duloxetine", "cymbalta"], canonicalName: "Duloxetine", classId: "snri" },

  // ---------- TCAs ----------
  { lookupTerms: ["amitriptyline", "elavil"], canonicalName: "Amitriptyline", classId: "tricyclic_antidepressant" },
  { lookupTerms: ["nortriptyline", "pamelor"], canonicalName: "Nortriptyline", classId: "tricyclic_antidepressant" },

  // ---------- Antipsychotics ----------
  { lookupTerms: ["quetiapine", "seroquel"], canonicalName: "Quetiapine", classId: "antipsychotic" },
  { lookupTerms: ["olanzapine", "zyprexa"], canonicalName: "Olanzapine", classId: "antipsychotic" },
  { lookupTerms: ["risperidone", "risperdal"], canonicalName: "Risperidone", classId: "antipsychotic" },

  // ---------- First-generation antihistamines ----------
  { lookupTerms: ["diphenhydramine", "benadryl"], canonicalName: "Diphenhydramine", classId: "first_gen_antihistamine" },
  { lookupTerms: ["chlorpheniramine", "piriton"], canonicalName: "Chlorpheniramine", classId: "first_gen_antihistamine" },
  { lookupTerms: ["promethazine", "phenergan"], canonicalName: "Promethazine", classId: "first_gen_antihistamine" },

  // ---------- Opioids ----------
  { lookupTerms: ["codeine"], canonicalName: "Codeine", classId: "opioid" },
  { lookupTerms: ["co-codamol", "co codamol"], canonicalName: "Co-codamol (codeine + paracetamol)", classId: "opioid" },
  { lookupTerms: ["tramadol"], canonicalName: "Tramadol", classId: "opioid" },
  { lookupTerms: ["morphine", "oramorph", "ms contin"], canonicalName: "Morphine", classId: "opioid" },
  { lookupTerms: ["oxycodone", "oxycontin"], canonicalName: "Oxycodone", classId: "opioid" },
  { lookupTerms: ["fentanyl"], canonicalName: "Fentanyl", classId: "opioid" },

  // ---------- NSAIDs ----------
  { lookupTerms: ["ibuprofen", "nurofen", "advil", "brufen", "motrin"], canonicalName: "Ibuprofen", classId: "nsaid" },
  { lookupTerms: ["naproxen", "naprosyn", "naprogesic"], canonicalName: "Naproxen", classId: "nsaid" },
  { lookupTerms: ["diclofenac", "voltaren", "voltarol"], canonicalName: "Diclofenac", classId: "nsaid" },

  // ---------- Anticoagulants ----------
  { lookupTerms: ["warfarin", "coumadin"], canonicalName: "Warfarin", classId: "anticoagulant" },
  { lookupTerms: ["apixaban", "eliquis"], canonicalName: "Apixaban", classId: "anticoagulant" },
  { lookupTerms: ["rivaroxaban", "xarelto"], canonicalName: "Rivaroxaban", classId: "anticoagulant" },
  { lookupTerms: ["dabigatran", "pradaxa"], canonicalName: "Dabigatran", classId: "anticoagulant" },
  { lookupTerms: ["edoxaban", "lixiana", "savaysa"], canonicalName: "Edoxaban", classId: "anticoagulant" },

  // ---------- Antiplatelet ----------
  { lookupTerms: ["aspirin", "low dose aspirin", "low-dose aspirin", "aspro", "disprin", "ecotrin"], canonicalName: "Aspirin", classId: "antiplatelet" },
  { lookupTerms: ["clopidogrel", "plavix"], canonicalName: "Clopidogrel", classId: "antiplatelet" },
  { lookupTerms: ["ticagrelor", "brilinta"], canonicalName: "Ticagrelor", classId: "antiplatelet" },

  // ---------- Statins ----------
  { lookupTerms: ["atorvastatin", "lipitor", "lorstat", "atorvachol"], canonicalName: "Atorvastatin", classId: "statin" },
  { lookupTerms: ["simvastatin", "zocor", "lipex"], canonicalName: "Simvastatin", classId: "statin" },
  { lookupTerms: ["rosuvastatin", "crestor"], canonicalName: "Rosuvastatin", classId: "statin" },
  { lookupTerms: ["pravastatin"], canonicalName: "Pravastatin", classId: "statin" },

  // ---------- ACE inhibitors ----------
  { lookupTerms: ["ramipril"], canonicalName: "Ramipril", classId: "ace_inhibitor" },
  { lookupTerms: ["lisinopril"], canonicalName: "Lisinopril", classId: "ace_inhibitor" },
  { lookupTerms: ["enalapril"], canonicalName: "Enalapril", classId: "ace_inhibitor" },
  { lookupTerms: ["perindopril"], canonicalName: "Perindopril", classId: "ace_inhibitor" },

  // ---------- ARBs ----------
  { lookupTerms: ["losartan", "cozaar"], canonicalName: "Losartan", classId: "arb" },
  { lookupTerms: ["valsartan", "diovan"], canonicalName: "Valsartan", classId: "arb" },
  { lookupTerms: ["candesartan", "atacand"], canonicalName: "Candesartan", classId: "arb" },
  { lookupTerms: ["irbesartan"], canonicalName: "Irbesartan", classId: "arb" },

  // ---------- Beta-blockers ----------
  { lookupTerms: ["bisoprolol"], canonicalName: "Bisoprolol", classId: "beta_blocker" },
  { lookupTerms: ["atenolol"], canonicalName: "Atenolol", classId: "beta_blocker" },
  { lookupTerms: ["propranolol"], canonicalName: "Propranolol", classId: "beta_blocker" },
  { lookupTerms: ["metoprolol", "lopressor", "toprol"], canonicalName: "Metoprolol", classId: "beta_blocker" },
  { lookupTerms: ["carvedilol"], canonicalName: "Carvedilol", classId: "beta_blocker" },

  // ---------- Calcium-channel blockers ----------
  { lookupTerms: ["amlodipine", "norvasc"], canonicalName: "Amlodipine", classId: "calcium_channel_blocker" },
  { lookupTerms: ["diltiazem"], canonicalName: "Diltiazem", classId: "calcium_channel_blocker" },
  { lookupTerms: ["verapamil"], canonicalName: "Verapamil", classId: "calcium_channel_blocker" },
  { lookupTerms: ["felodipine"], canonicalName: "Felodipine", classId: "calcium_channel_blocker" },

  // ---------- Diuretics ----------
  { lookupTerms: ["furosemide", "lasix", "frusemide"], canonicalName: "Furosemide", classId: "diuretic_loop" },
  { lookupTerms: ["bumetanide", "bumex"], canonicalName: "Bumetanide", classId: "diuretic_loop" },
  { lookupTerms: ["bendroflumethiazide", "bendrofluazide"], canonicalName: "Bendroflumethiazide", classId: "diuretic_thiazide" },
  { lookupTerms: ["indapamide"], canonicalName: "Indapamide", classId: "diuretic_thiazide" },
  { lookupTerms: ["hydrochlorothiazide", "hctz"], canonicalName: "Hydrochlorothiazide", classId: "diuretic_thiazide" },

  // ---------- Diabetes ----------
  { lookupTerms: ["metformin", "glucophage", "diaformin", "diabex"], canonicalName: "Metformin", classId: "metformin" },
  { lookupTerms: ["gliclazide"], canonicalName: "Gliclazide", classId: "sulfonylurea" },
  { lookupTerms: ["glipizide"], canonicalName: "Glipizide", classId: "sulfonylurea" },
  { lookupTerms: ["glimepiride"], canonicalName: "Glimepiride", classId: "sulfonylurea" },
  { lookupTerms: ["insulin"], canonicalName: "Insulin (any)", classId: "insulin" },

  // ---------- Thyroid ----------
  { lookupTerms: ["levothyroxine", "synthroid", "eltroxin"], canonicalName: "Levothyroxine", classId: "levothyroxine" },

  // ---------- Bone ----------
  { lookupTerms: ["alendronate", "fosamax"], canonicalName: "Alendronate", classId: "bisphosphonate" },
  { lookupTerms: ["risedronate", "actonel"], canonicalName: "Risedronate", classId: "bisphosphonate" },
  { lookupTerms: ["zoledronic acid", "zoledronate"], canonicalName: "Zoledronic acid", classId: "bisphosphonate" },

  // ---------- Steroids ----------
  { lookupTerms: ["prednisolone", "prednisone"], canonicalName: "Prednisolone / prednisone", classId: "corticosteroid_systemic" },
  { lookupTerms: ["dexamethasone"], canonicalName: "Dexamethasone", classId: "corticosteroid_systemic" },

  // ---------- Antiepileptic / mood stabiliser ----------
  { lookupTerms: ["sodium valproate", "valproate", "depakote"], canonicalName: "Sodium valproate", classId: "antiepileptic" },
  { lookupTerms: ["carbamazepine", "tegretol"], canonicalName: "Carbamazepine", classId: "antiepileptic" },
  { lookupTerms: ["lamotrigine", "lamictal"], canonicalName: "Lamotrigine", classId: "antiepileptic" },

  // ---------- Gabapentinoids ----------
  { lookupTerms: ["gabapentin", "neurontin"], canonicalName: "Gabapentin", classId: "gabapentinoid" },
  { lookupTerms: ["pregabalin", "lyrica"], canonicalName: "Pregabalin", classId: "gabapentinoid" },

  // ---------- Bladder anticholinergics ----------
  { lookupTerms: ["oxybutynin", "ditropan"], canonicalName: "Oxybutynin", classId: "anticholinergic_overactive_bladder" },
  { lookupTerms: ["tolterodine", "detrol"], canonicalName: "Tolterodine", classId: "anticholinergic_overactive_bladder" },
  { lookupTerms: ["solifenacin", "vesicare"], canonicalName: "Solifenacin", classId: "anticholinergic_overactive_bladder" },

  // ---------- Alpha-blockers ----------
  { lookupTerms: ["tamsulosin", "flomax"], canonicalName: "Tamsulosin", classId: "alpha_blocker" },
  { lookupTerms: ["doxazosin", "cardura"], canonicalName: "Doxazosin", classId: "alpha_blocker" },

  // ---------- Muscle relaxants ----------
  { lookupTerms: ["cyclobenzaprine", "flexeril"], canonicalName: "Cyclobenzaprine", classId: "muscle_relaxant" },
  { lookupTerms: ["baclofen"], canonicalName: "Baclofen", classId: "muscle_relaxant" },
  { lookupTerms: ["tizanidine"], canonicalName: "Tizanidine", classId: "muscle_relaxant" },

  // ---------- H2 blockers ----------
  { lookupTerms: ["famotidine", "pepcid"], canonicalName: "Famotidine", classId: "h2_blocker" },
  { lookupTerms: ["ranitidine", "zantac"], canonicalName: "Ranitidine", classId: "h2_blocker" },

  // ---------- Paracetamol / acetaminophen ----------
  // UK + ZA name: paracetamol (Panado, Panamol). US name: acetaminophen (Tylenol).
  {
    lookupTerms: [
      "paracetamol",
      "acetaminophen",
      // UK
      "calpol",
      // ZA
      "panado",
      "panamol",
      // AU
      "panadol",
      "dymadon",
      "panamax",
      // US
      "tylenol",
    ],
    canonicalName: "Paracetamol (acetaminophen)",
    classId: "paracetamol",
  },

  // ---------- Second-generation antihistamines ----------
  { lookupTerms: ["loratadine", "claritin", "clarityne", "claratyne", "lorano"], canonicalName: "Loratadine", classId: "second_gen_antihistamine" },
  { lookupTerms: ["cetirizine", "zyrtec", "texa", "zilarex", "zirtek"], canonicalName: "Cetirizine", classId: "second_gen_antihistamine" },
  { lookupTerms: ["fexofenadine", "allegra", "telfast", "fexotabs"], canonicalName: "Fexofenadine", classId: "second_gen_antihistamine" },
  { lookupTerms: ["desloratadine", "neoclarityn", "aerius"], canonicalName: "Desloratadine", classId: "second_gen_antihistamine" },
  { lookupTerms: ["levocetirizine", "xyzal"], canonicalName: "Levocetirizine", classId: "second_gen_antihistamine" },

  // ---------- Decongestants ----------
  { lookupTerms: ["pseudoephedrine", "sudafed"], canonicalName: "Pseudoephedrine", classId: "decongestant" },
  { lookupTerms: ["phenylephrine"], canonicalName: "Phenylephrine", classId: "decongestant" },
  { lookupTerms: ["oxymetazoline", "iliadin", "drixine", "afrin"], canonicalName: "Oxymetazoline (nasal)", classId: "decongestant" },
  { lookupTerms: ["xylometazoline", "otrivin"], canonicalName: "Xylometazoline (nasal)", classId: "decongestant" },

  // ---------- Cough / cold ----------
  { lookupTerms: ["dextromethorphan"], canonicalName: "Dextromethorphan", classId: "cough_suppressant" },
  { lookupTerms: ["pholcodine"], canonicalName: "Pholcodine", classId: "cough_suppressant" },
  { lookupTerms: ["guaifenesin"], canonicalName: "Guaifenesin", classId: "expectorant" },
  { lookupTerms: ["bromhexine", "bisolvon"], canonicalName: "Bromhexine", classId: "expectorant" },
  { lookupTerms: ["acetylcysteine", "acc 200", "fluimucil"], canonicalName: "Acetylcysteine (mucolytic)", classId: "expectorant" },

  // ---------- Antidiarrhoeal & laxatives ----------
  { lookupTerms: ["loperamide", "imodium", "gastro-stop", "gastro stop"], canonicalName: "Loperamide", classId: "antidiarrhoeal" },
  { lookupTerms: ["senna", "senokot", "agiolax"], canonicalName: "Senna", classId: "laxative" },
  { lookupTerms: ["bisacodyl", "dulcolax"], canonicalName: "Bisacodyl", classId: "laxative" },
  { lookupTerms: ["lactulose", "duphalac"], canonicalName: "Lactulose", classId: "laxative" },
  { lookupTerms: ["macrogol", "movicol", "miralax", "osmolax"], canonicalName: "Macrogol (PEG)", classId: "laxative" },
  { lookupTerms: ["docusate", "coloxyl"], canonicalName: "Docusate (Coloxyl)", classId: "laxative" },

  // ---------- Antacids ----------
  { lookupTerms: ["gaviscon"], canonicalName: "Gaviscon", classId: "antacid" },
  { lookupTerms: ["rennies", "rennie"], canonicalName: "Rennies", classId: "antacid" },
  { lookupTerms: ["tums"], canonicalName: "Tums", classId: "antacid" },
  { lookupTerms: ["calcium carbonate"], canonicalName: "Calcium carbonate antacid", classId: "antacid" },
  { lookupTerms: ["aluminium hydroxide", "aluminum hydroxide", "maalox", "mylanta"], canonicalName: "Aluminium / magnesium antacid", classId: "antacid" },

  // ---------- Sleep / melatonin ----------
  { lookupTerms: ["melatonin", "circadin"], canonicalName: "Melatonin", classId: "melatonin" },

  // ---------- Topical steroids ----------
  { lookupTerms: ["hydrocortisone cream", "hydrocortisone"], canonicalName: "Hydrocortisone (topical)", classId: "topical_steroid" },
  { lookupTerms: ["betamethasone cream", "betamethasone topical", "betnovate"], canonicalName: "Betamethasone (topical)", classId: "topical_steroid" },

  // ---------- Topical antifungals ----------
  { lookupTerms: ["clotrimazole", "canesten"], canonicalName: "Clotrimazole", classId: "topical_antifungal" },
  { lookupTerms: ["miconazole", "daktarin"], canonicalName: "Miconazole", classId: "topical_antifungal" },
  { lookupTerms: ["terbinafine", "lamisil"], canonicalName: "Terbinafine", classId: "topical_antifungal" },

  // ---------- Inhalers ----------
  // ZA notes: salbutamol brands include Asthavent and Venteze; albuterol is the US name.
  {
    lookupTerms: [
      "salbutamol",
      "albuterol",
      // UK / global
      "ventolin",
      // ZA
      "asthavent",
      "venteze",
      // AU
      "asmol",
      "airomir",
      // US
      "proair",
      "proventil",
    ],
    canonicalName: "Salbutamol (albuterol)",
    classId: "inhaled_bronchodilator",
  },
  { lookupTerms: ["terbutaline", "bricanyl"], canonicalName: "Terbutaline", classId: "inhaled_bronchodilator" },
  { lookupTerms: ["budesonide inhaler", "pulmicort"], canonicalName: "Budesonide (inhaled)", classId: "inhaled_steroid" },
  { lookupTerms: ["fluticasone inhaler", "flixotide"], canonicalName: "Fluticasone (inhaled)", classId: "inhaled_steroid" },
  { lookupTerms: ["beclometasone", "beclomethasone", "becotide"], canonicalName: "Beclometasone (inhaled)", classId: "inhaled_steroid" },

  // ---------- Nasal sprays ----------
  { lookupTerms: ["fluticasone nasal", "avamys", "flonase", "flixonase"], canonicalName: "Fluticasone (nasal)", classId: "nasal_steroid" },
  { lookupTerms: ["mometasone nasal", "nasonex"], canonicalName: "Mometasone (nasal)", classId: "nasal_steroid" },

  // ---------- Vitamins / minerals (commonly conflated with supplements) ----------
  { lookupTerms: ["vitamin d", "vit d", "cholecalciferol"], canonicalName: "Vitamin D", classId: "vitamin_or_mineral" },
  { lookupTerms: ["vitamin b12", "vit b12", "cyanocobalamin"], canonicalName: "Vitamin B12", classId: "vitamin_or_mineral" },
  { lookupTerms: ["folic acid", "folate"], canonicalName: "Folic acid", classId: "vitamin_or_mineral" },
  { lookupTerms: ["iron tablet", "ferrous sulfate", "ferrous sulphate", "ferrograd"], canonicalName: "Iron supplement", classId: "vitamin_or_mineral" },
  { lookupTerms: ["magnesium"], canonicalName: "Magnesium", classId: "vitamin_or_mineral" },
];

// Lowercased, sorted by lookup-term length (longest first) so brand-name
// matches beat shorter generic substrings.
const NORMALISED = CATALOG.map((entry) => ({
  ...entry,
  lookupTerms: entry.lookupTerms.map((t) => t.toLowerCase()),
})).sort((a, b) => Math.max(...b.lookupTerms.map((t) => t.length)) - Math.max(...a.lookupTerms.map((t) => t.length)));

export interface CatalogMatch {
  entry: CatalogEntry;
  matchedTerm: string;
  exact: boolean;
}

/**
 * Look up a free-text drug name. Returns the best catalog match if any.
 *
 * Matching rules:
 *   - case-insensitive
 *   - whitespace-trimmed
 *   - exact match wins; otherwise prefix or substring
 *   - returns null if no match
 *
 * Misclassification is the primary regulatory failure mode. If in doubt
 * (ambiguous, very short input), prefer to return null and let the user
 * see "we don't recognise this — your pharmacist will know it."
 */
export function lookupMedication(input: string): CatalogMatch | null {
  const q = input.trim().toLowerCase();
  if (q.length < 3) return null;

  for (const entry of NORMALISED) {
    if (entry.lookupTerms.includes(q)) {
      return { entry, matchedTerm: q, exact: true };
    }
  }

  for (const entry of NORMALISED) {
    for (const term of entry.lookupTerms) {
      if (q.startsWith(term) || term.startsWith(q) || q.includes(term)) {
        return { entry, matchedTerm: term, exact: false };
      }
    }
  }

  return null;
}

/**
 * Autocomplete suggestions for the intake field. Returns up to `limit`
 * canonical names whose lookup terms start with the query.
 */
export function suggestMedications(input: string, limit = 6): CatalogEntry[] {
  const q = input.trim().toLowerCase();
  if (q.length < 2) return [];

  const seen = new Set<string>();
  const out: CatalogEntry[] = [];
  for (const entry of NORMALISED) {
    if (seen.has(entry.canonicalName)) continue;
    if (entry.lookupTerms.some((t) => t.startsWith(q))) {
      out.push(entry);
      seen.add(entry.canonicalName);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export function listCatalog(): CatalogEntry[] {
  return CATALOG;
}
