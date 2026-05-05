import { answerValues } from "./rules-engine";
import {
  AnswerMap,
  LabRecommendation,
  LabTier,
  RiskFlag,
} from "./types";

// ---------------------------------------------------------------------------
// Lab recommendations engine
// ---------------------------------------------------------------------------
// Generates a personalised, printable list of lab tests the user can take to
// a clinician or a lab. This is informational, not diagnostic — every entry
// carries a rationale the user can read and (where relevant) clinical caveats
// the clinician should see on the printout.
//
// Sources: USPSTF, AAFP, ATA, Endocrine Society, ADA, ACC/AHA, ACG, AAAAI,
// ASRM, ACOG, KDIGO, AASLD, NICE, ESC, BSH. Anything popular in functional
// medicine but lacking peer-reviewed validation is excluded — see
// EXCLUDED_TESTS at the bottom of the file for the explicit blacklist with
// reasoning. The blacklist is not used at runtime; it documents the editorial
// position so future contributors don't add pseudoscience by accident.
//
// Engine conventions:
// - All triggers read from AnswerMap (already augmented with derived signals).
// - Pediatric guard: under-18s get a single "see a paediatrician" entry only.
// - Pregnancy guard: AMH and several others suppress.
// - Tier escalation: a test promoted by multiple converging signals is moved
//   from "recommended" to "strongly_recommended". A test triggered by a
//   single weak signal stays "optional".
// - De-duplication: a test reached via multiple rules has its triggers merged
//   and tier escalated to the strongest matching tier.
// ---------------------------------------------------------------------------

interface LabSpec {
  id: string;
  name: string;
  synonyms?: string[];
  domain: LabRecommendation["domain"];
  measures: string;
  caveats?: string;
  fasting: LabRecommendation["fasting"];
  timing?: string;
  guidelineAnchor?: string;
}

// Catalogue of every test the engine can recommend. Domain-grouped, in roughly
// the order they're presented on the printable sheet. Editing or adding tests
// here is the canonical way to extend the engine.
const LAB_SPECS: Record<string, LabSpec> = {
  // -------------------- Anemia / iron --------------------
  cbc: {
    id: "cbc",
    name: "Complete blood count (CBC) with differential",
    synonyms: ["FBC", "full blood count"],
    domain: "anemia_iron",
    measures: "Red and white cells, haemoglobin, platelets, and red-cell size (MCV).",
    fasting: "none",
    guidelineAnchor: "USPSTF, AAFP, ACOG",
  },
  ferritin: {
    id: "ferritin",
    name: "Ferritin",
    synonyms: ["serum ferritin"],
    domain: "anemia_iron",
    measures: "Body iron stores. Often the first marker to drop in iron deficiency, even with a normal CBC.",
    caveats:
      "Ferritin is an acute-phase reactant — falsely elevated in inflammation, infection, liver disease, and obesity. Pair with CRP if inflammation is suspected. <30 ng/mL suggests iron deficiency even if haemoglobin is normal.",
    fasting: "none",
    guidelineAnchor: "BSH 2021, AAFP",
  },
  iron_panel: {
    id: "iron_panel",
    name: "Iron studies (serum iron, TIBC, transferrin saturation)",
    synonyms: ["Fe/TIBC", "TSAT"],
    domain: "anemia_iron",
    measures: "Iron transport status — useful when ferritin is ambiguous, or to screen for iron overload (haemochromatosis).",
    caveats:
      "Diurnal variation; iron supplements within 24 hours skew results. Transferrin saturation >45% raises a haemochromatosis flag worth investigating.",
    fasting: "preferred",
    timing: "Morning draw preferred",
  },
  reticulocytes: {
    id: "reticulocytes",
    name: "Reticulocyte count",
    domain: "anemia_iron",
    measures: "Bone marrow red-cell production — distinguishes hypoproliferative from haemolytic anaemia.",
    fasting: "none",
  },

  // -------------------- Thyroid --------------------
  tsh: {
    id: "tsh",
    name: "TSH (thyroid-stimulating hormone)",
    synonyms: ["thyrotropin"],
    domain: "thyroid",
    measures: "Pituitary signal that drives thyroid hormone production. The first-line thyroid screen.",
    caveats:
      "Biotin supplements >5 mg/day can cause falsely low TSH on some assays — pause biotin 48 hours before draw. Acute illness can suppress TSH transiently (sick euthyroid).",
    fasting: "none",
    timing: "Morning preferred",
    guidelineAnchor: "ATA 2014, Endocrine Society",
  },
  free_t4: {
    id: "free_t4",
    name: "Free T4",
    synonyms: ["FT4"],
    domain: "thyroid",
    measures: "Active circulating T4 — ordered when TSH is abnormal, or when central hypothyroidism is suspected.",
    fasting: "none",
    guidelineAnchor: "ATA",
  },
  free_t3: {
    id: "free_t3",
    name: "Free T3",
    synonyms: ["FT3"],
    domain: "thyroid",
    measures: "Active T3 — useful in suspected hyperthyroidism with normal FT4 (T3 toxicosis).",
    fasting: "none",
  },
  tpo_antibodies: {
    id: "tpo_antibodies",
    name: "Thyroid peroxidase antibodies (TPO)",
    synonyms: ["anti-TPO"],
    domain: "thyroid",
    measures: "Autoimmune thyroid marker — supports a Hashimoto's diagnosis when TSH is borderline.",
    caveats: "Positive in roughly 10% of healthy adults; not actionable alone in a euthyroid state.",
    fasting: "none",
  },

  // -------------------- Vitamin / mineral --------------------
  vitamin_d: {
    id: "vitamin_d",
    name: "25-hydroxy vitamin D",
    synonyms: ["25-OH vitamin D", "calcidiol"],
    domain: "vitamin_mineral",
    measures: "Vitamin D storage form — the standard test for vitamin D status.",
    caveats:
      "USPSTF says evidence is insufficient for universal screening — frame this as targeted, not routine. Do NOT order 1,25-OH vitamin D for deficiency screening; it's a different, specialist test.",
    fasting: "none",
    guidelineAnchor: "Endocrine Society 2011",
  },
  b12: {
    id: "b12",
    name: "Vitamin B12",
    synonyms: ["cobalamin"],
    domain: "vitamin_mineral",
    measures: "Serum B12 — useful in vegetarians/vegans, long-term metformin or PPI use, neuropathy, or unexplained cognitive symptoms.",
    caveats:
      "Insensitive at low-normal range (200–400 pg/mL). Add MMA and homocysteine if B12 is borderline and symptoms persist.",
    fasting: "none",
    guidelineAnchor: "BSH 2014, AAFP",
  },
  mma: {
    id: "mma",
    name: "Methylmalonic acid (MMA)",
    domain: "vitamin_mineral",
    measures: "Functional B12 marker — rises when B12 is biologically inadequate even if serum B12 looks normal.",
    caveats: "Renal impairment falsely elevates MMA.",
    fasting: "none",
  },
  folate: {
    id: "folate",
    name: "Folate",
    synonyms: ["serum folate"],
    domain: "vitamin_mineral",
    measures: "Recent folate intake. Useful with B12 in macrocytic anaemia, pre-conception, or alcohol use disorder.",
    caveats: "Reflects recent intake (days). RBC folate is more stable but more expensive.",
    fasting: "none",
  },
  rbc_folate: {
    id: "rbc_folate",
    name: "RBC folate",
    synonyms: ["erythrocyte folate"],
    domain: "vitamin_mineral",
    measures: "Tissue folate stores — reflects status over the past ~120 days, more stable than serum folate.",
    fasting: "none",
    guidelineAnchor: "NICE pre-conception",
  },
  homocysteine: {
    id: "homocysteine",
    name: "Homocysteine",
    domain: "vitamin_mineral",
    measures: "Sulfur amino acid — functional marker for B12, folate, and B6 status.",
    caveats:
      "Renal disease elevates homocysteine. Lowering homocysteine has not reduced cardiovascular events in RCTs — frame this as a deficiency marker, not a CVD intervention target.",
    fasting: "preferred",
  },
  serum_magnesium: {
    id: "serum_magnesium",
    name: "Serum magnesium",
    synonyms: ["Mg"],
    domain: "vitamin_mineral",
    measures: "Extracellular magnesium — first-line, often part of a CMP.",
    caveats: "Insensitive to chronic intracellular deficiency; serum stays normal until losses are large.",
    fasting: "none",
  },
  rbc_magnesium: {
    id: "rbc_magnesium",
    name: "RBC magnesium",
    synonyms: ["erythrocyte magnesium"],
    domain: "vitamin_mineral",
    measures: "Intracellular magnesium — more sensitive than serum to chronic deficiency.",
    caveats: "Limited insurance coverage; not all labs offer it. Serum magnesium is acceptable first-line.",
    fasting: "none",
  },
  serum_zinc: {
    id: "serum_zinc",
    name: "Serum zinc (or plasma)",
    domain: "vitamin_mineral",
    measures: "Zinc status — supports a deficiency diagnosis in recurrent infection, taste/smell loss, slow wound healing, or alopecia.",
    caveats:
      "Diurnal variation; falls during inflammation. Ask the lab for a trace-element tube (zinc-free) — standard tubes can leach zinc and skew results.",
    fasting: "preferred",
    timing: "Morning preferred",
  },
  thiamine: {
    id: "thiamine",
    name: "Whole-blood thiamine (B1)",
    synonyms: ["thiamine pyrophosphate", "TPP"],
    domain: "vitamin_mineral",
    measures: "Functional B1 — relevant in alcohol use disorder, post-bariatric surgery, refeeding, or heart failure with neuropathy.",
    caveats: "Whole-blood thiamine pyrophosphate is preferred over serum thiamine.",
    fasting: "none",
    guidelineAnchor: "ASMBS",
  },

  // -------------------- Metabolic / glucose --------------------
  fasting_glucose: {
    id: "fasting_glucose",
    name: "Fasting plasma glucose",
    synonyms: ["FPG"],
    domain: "metabolic_glucose",
    measures: "Fasting blood glucose — diabetes screening alongside HbA1c.",
    fasting: "required",
    timing: "Morning, after 8 hours fasting",
    guidelineAnchor: "ADA 2024, USPSTF",
  },
  hba1c: {
    id: "hba1c",
    name: "HbA1c",
    synonyms: ["glycated haemoglobin", "haemoglobin A1c"],
    domain: "metabolic_glucose",
    measures: "Three-month average blood glucose — diabetes screening and monitoring.",
    caveats:
      "Falsely low in haemolysis and recent transfusion; falsely high in iron-deficiency anaemia. Not valid for diagnosing gestational diabetes.",
    fasting: "none",
    guidelineAnchor: "ADA 2024, USPSTF",
  },
  fasting_insulin: {
    id: "fasting_insulin",
    name: "Fasting insulin",
    domain: "metabolic_glucose",
    measures: "Insulin secretion — useful in PCOS workup and suspected insulin resistance with normal glucose.",
    caveats: "Reference ranges vary widely between labs; not part of the ADA screening pathway.",
    fasting: "required",
    timing: "Morning, after 8 hours fasting",
  },
  uric_acid: {
    id: "uric_acid",
    name: "Uric acid",
    synonyms: ["urate"],
    domain: "metabolic_glucose",
    measures: "Serum urate — relevant for gout, metabolic syndrome, and kidney stones.",
    caveats: "Diet and alcohol affect short-term values.",
    fasting: "none",
  },

  // -------------------- Lipids / CV --------------------
  lipid_panel: {
    id: "lipid_panel",
    name: "Lipid panel (TC, LDL-C, HDL-C, triglycerides)",
    domain: "lipids_cardiovascular",
    measures: "Standard cholesterol fractions — the workhorse for cardiovascular risk assessment.",
    caveats: "Non-fasting is now acceptable for screening unless triglycerides are >400 mg/dL — refast in that case.",
    fasting: "none",
    guidelineAnchor: "ACC/AHA 2018, ESC 2019, USPSTF",
  },
  apob: {
    id: "apob",
    name: "Apolipoprotein B (ApoB)",
    domain: "lipids_cardiovascular",
    measures: "Count of atherogenic particles — refines risk in mixed dyslipidaemia, high triglycerides, or borderline LDL-C.",
    fasting: "none",
    guidelineAnchor: "ACC 2022, ESC 2019",
  },
  lpa: {
    id: "lpa",
    name: "Lipoprotein(a)",
    synonyms: ["Lp(a)"],
    domain: "lipids_cardiovascular",
    measures: "Genetic atherogenic particle — a once-in-a-lifetime measurement is enough.",
    caveats: "Levels are genetically determined; no need to repeat. Elevated in roughly 20% of the population.",
    fasting: "none",
    guidelineAnchor: "ACC 2018, ESC 2019, EAS 2022",
  },
  hs_crp: {
    id: "hs_crp",
    name: "High-sensitivity CRP (hs-CRP)",
    domain: "lipids_cardiovascular",
    measures: "Vascular inflammation marker — useful for borderline ASCVD risk to inform statin decisions.",
    caveats: "Any inflammation elevates it. Don't measure during illness; repeat if >10 to exclude infection.",
    fasting: "none",
    guidelineAnchor: "ACC/AHA 2013",
  },
  cac: {
    id: "cac",
    name: "Coronary artery calcium (CAC) score",
    synonyms: ["Agatston score"],
    domain: "lipids_cardiovascular",
    measures: "CT scan that quantifies coronary calcium — most useful for borderline 10-year ASCVD risk (5–20%).",
    caveats: "This is imaging, not a blood test. Involves a small dose of radiation; not for low- or high-risk patients where it won't change management.",
    fasting: "none",
    guidelineAnchor: "ACC/AHA 2018",
  },
  omega3_index: {
    id: "omega3_index",
    name: "Omega-3 index (RBC EPA + DHA %)",
    domain: "lipids_cardiovascular",
    measures: "Tissue omega-3 status — research-grade marker, not standard of care.",
    caveats: "Defensible in cardiovascular optimisation but not in major guidelines. Frame as optional.",
    fasting: "none",
  },

  // -------------------- Liver / kidney --------------------
  cmp: {
    id: "cmp",
    name: "Comprehensive metabolic panel (CMP)",
    synonyms: ["U&Es + LFTs", "chem-14"],
    domain: "liver_kidney",
    measures: "Glucose, kidney function (creatinine, eGFR), electrolytes, calcium, liver enzymes (ALT, AST, ALP, bilirubin), albumin and total protein.",
    fasting: "preferred",
    guidelineAnchor: "AAFP",
  },
  ggt: {
    id: "ggt",
    name: "Gamma-glutamyl transferase (GGT)",
    domain: "liver_kidney",
    measures: "Hepatobiliary marker, also a sensitive marker of alcohol use.",
    caveats: "Sensitive but non-specific; raised by many medications.",
    fasting: "none",
  },
  uacr: {
    id: "uacr",
    name: "Urine albumin-to-creatinine ratio (UACR)",
    synonyms: ["microalbumin"],
    domain: "liver_kidney",
    measures: "Early kidney damage — recommended annually in diabetes and hypertension.",
    fasting: "none",
    guidelineAnchor: "KDIGO, ADA",
  },
  fib4: {
    id: "fib4",
    name: "FIB-4 calculator (uses CMP + platelets)",
    domain: "liver_kidney",
    measures: "Calculated liver fibrosis estimate using age, AST, ALT, and platelets — high yield in suspected NAFLD/MASLD.",
    caveats: "It's a free calculation, not a separate blood draw — your clinician runs the numbers from existing labs.",
    fasting: "none",
    guidelineAnchor: "AASLD 2023",
  },

  // -------------------- Inflammation / autoimmune --------------------
  crp: {
    id: "crp",
    name: "C-reactive protein (CRP)",
    domain: "inflammation_autoimmune",
    measures: "Acute inflammation marker — different assay from hs-CRP.",
    fasting: "none",
  },
  esr: {
    id: "esr",
    name: "Erythrocyte sedimentation rate (ESR)",
    synonyms: ["sed rate"],
    domain: "inflammation_autoimmune",
    measures: "Slower inflammation marker — relevant in suspected polymyalgia rheumatica and giant cell arteritis (urgent if suspected).",
    caveats: "Influenced by age, sex, and anaemia.",
    fasting: "none",
  },
  ana: {
    id: "ana",
    name: "Antinuclear antibody (ANA)",
    domain: "inflammation_autoimmune",
    measures: "Autoimmune screen — useful when joint pain, rash, and fatigue cluster.",
    caveats: "Roughly 13% of healthy adults are ANA-positive — only order with clinical suspicion.",
    fasting: "none",
    guidelineAnchor: "ACR",
  },
  rf_anti_ccp: {
    id: "rf_anti_ccp",
    name: "Rheumatoid factor + anti-CCP",
    synonyms: ["RF, ACPA"],
    domain: "inflammation_autoimmune",
    measures: "Markers for rheumatoid arthritis — anti-CCP is more specific than RF.",
    fasting: "none",
    guidelineAnchor: "ACR",
  },

  // -------------------- Female hormones --------------------
  fsh_lh: {
    id: "fsh_lh",
    name: "FSH and LH",
    domain: "hormones_female",
    measures: "Pituitary hormones — for suspected menopause, amenorrhoea, fertility workup, or PCOS (LH:FSH ratio).",
    caveats: "If still cycling, draw on day 3 of the cycle.",
    fasting: "none",
    timing: "Day 3 of cycle if menstruating",
    guidelineAnchor: "ACOG, ASRM",
  },
  estradiol: {
    id: "estradiol",
    name: "Estradiol",
    synonyms: ["E2"],
    domain: "hormones_female",
    measures: "Active estrogen — interpretation depends heavily on cycle day.",
    caveats: "Highly cyclical — timing the draw to day 3 (or as your clinician directs) matters.",
    fasting: "none",
    timing: "Day 3 of cycle if menstruating",
  },
  progesterone: {
    id: "progesterone",
    name: "Progesterone",
    domain: "hormones_female",
    measures: "Confirms ovulation when measured in the luteal phase — useful in fertility workup.",
    caveats: "Day 21 is only meaningful in a regular 28-day cycle; otherwise time it 7 days before expected period.",
    fasting: "none",
    timing: "Day 21, or 7 days before expected period",
  },
  prolactin: {
    id: "prolactin",
    name: "Prolactin",
    synonyms: ["PRL"],
    domain: "hormones_female",
    measures: "Pituitary hormone — relevant in galactorrhoea, amenorrhoea, infertility, or unexplained low libido.",
    caveats: "Stress, exercise, and recent breast exam transiently elevate prolactin. Rest 30 minutes before draw.",
    fasting: "none",
    timing: "Morning, rested",
    guidelineAnchor: "Endocrine Society 2011",
  },
  testosterone_female: {
    id: "testosterone_female",
    name: "Total + free testosterone, SHBG (sensitive assay for women)",
    domain: "hormones_female",
    measures: "Androgen workup — relevant in PCOS, hirsutism, alopecia.",
    caveats: "Ask the lab for a sensitive (LC-MS/MS) testosterone assay — standard immunoassays are unreliable at female ranges.",
    fasting: "none",
    timing: "Morning",
  },
  dhea_s: {
    id: "dhea_s",
    name: "DHEA-sulfate (DHEA-S)",
    domain: "hormones_female",
    measures: "Adrenal androgen — useful in hirsutism or virilisation to localise the source.",
    fasting: "none",
  },
  amh: {
    id: "amh",
    name: "Anti-Müllerian hormone (AMH)",
    domain: "hormones_female",
    measures: "Ovarian reserve marker — used in fertility/IVF planning and suspected premature ovarian insufficiency.",
    caveats:
      "AMH does NOT predict natural fertility well in low-risk women. Frame as a tool for IVF planning or POI workup, not a general 'egg quality' test.",
    fasting: "none",
    guidelineAnchor: "ASRM 2015, NICE",
  },

  // -------------------- Male hormones --------------------
  testosterone_male: {
    id: "testosterone_male",
    name: "Total testosterone (with free testosterone, SHBG)",
    domain: "hormones_male",
    measures: "Testosterone status — relevant in low libido, ED, fatigue, gynaecomastia, infertility, or osteoporosis in men.",
    caveats:
      "Diurnal variation is significant — draw between 7 and 11 AM. A single low result needs a confirming second AM draw on a separate day. Acute illness suppresses testosterone transiently.",
    fasting: "preferred",
    timing: "Morning (7–11 AM), confirm low results with a second draw",
    guidelineAnchor: "AUA 2018, Endocrine Society 2018",
  },
  lh_fsh_male: {
    id: "lh_fsh_male",
    name: "LH and FSH",
    domain: "hormones_male",
    measures: "Pituitary hormones — distinguishes primary (testicular) from secondary (pituitary) hypogonadism once low T is confirmed.",
    fasting: "none",
    guidelineAnchor: "AUA, Endocrine Society",
  },
  prolactin_male: {
    id: "prolactin_male",
    name: "Prolactin",
    domain: "hormones_male",
    measures: "Pituitary screen — relevant when low testosterone is confirmed with low or normal LH, or in gynaecomastia.",
    fasting: "none",
    timing: "Morning, rested",
  },
  psa: {
    id: "psa",
    name: "PSA (prostate-specific antigen)",
    domain: "hormones_male",
    measures: "Prostate marker — shared decision-making 55–69 (USPSTF), earlier with Black ancestry or family history. Baseline before testosterone therapy.",
    caveats: "Avoid PSA measurement within 48 hours of digital rectal exam, ejaculation, or vigorous cycling — all transiently raise PSA.",
    fasting: "none",
    guidelineAnchor: "USPSTF, AUA 2023",
  },

  // -------------------- Adrenal --------------------
  am_cortisol: {
    id: "am_cortisol",
    name: "Morning serum cortisol",
    synonyms: ["8 AM cortisol"],
    domain: "adrenal",
    measures: "HPA axis function — to rule out adrenal insufficiency in fatigue with hypotension, hyperpigmentation, or hyponatraemia.",
    caveats:
      "Strong diurnal rhythm — only meaningful at 8 AM. A 4-point salivary 'adrenal fatigue' panel is NOT what this is — that's not a recognised condition (Endocrine Society). This test screens for true adrenal insufficiency, not for tiredness.",
    fasting: "none",
    timing: "8 AM draw",
    guidelineAnchor: "Endocrine Society 2016",
  },

  // -------------------- Gut --------------------
  celiac_panel: {
    id: "celiac_panel",
    name: "Coeliac panel (tTG-IgA + total IgA)",
    domain: "gut_digestive",
    measures: "Coeliac disease screen — must include total IgA so an IgA-deficient false negative can be detected.",
    caveats:
      "You must be eating gluten regularly for at least 6 weeks before testing — eliminating gluten beforehand will make the test falsely negative.",
    fasting: "none",
    guidelineAnchor: "ACG 2023, AGA, NICE",
  },
  h_pylori: {
    id: "h_pylori",
    name: "H. pylori stool antigen or urea breath test",
    domain: "gut_digestive",
    measures: "Active H. pylori infection — relevant in dyspepsia, peptic ulcer disease, unexplained iron deficiency.",
    caveats:
      "Stop proton-pump inhibitors at least 2 weeks before testing, and antibiotics or bismuth at least 4 weeks before. Serology (IgG) confirms exposure, not active infection — prefer stool or breath.",
    fasting: "none",
    guidelineAnchor: "ACG 2017, Maastricht VI",
  },
  fecal_calprotectin: {
    id: "fecal_calprotectin",
    name: "Faecal calprotectin",
    domain: "gut_digestive",
    measures: "Gut inflammation marker — distinguishes inflammatory bowel disease from IBS.",
    caveats: "NSAIDs and gut infection elevate calprotectin; not specific to IBD.",
    fasting: "none",
    guidelineAnchor: "ACG, ECCO, NICE",
  },
  fit: {
    id: "fit",
    name: "Faecal immunochemical test (FIT)",
    synonyms: ["iFOBT"],
    domain: "gut_digestive",
    measures: "Stool blood test for colorectal cancer screening, age 45–75, or in iron-deficiency workup.",
    fasting: "none",
    guidelineAnchor: "USPSTF 2021",
  },
  pancreatic_elastase: {
    id: "pancreatic_elastase",
    name: "Faecal pancreatic elastase",
    domain: "gut_digestive",
    measures: "Exocrine pancreatic function — relevant in chronic pancreatitis, suspected fat malabsorption (steatorrhoea).",
    fasting: "none",
  },

  // -------------------- Bone --------------------
  pth: {
    id: "pth",
    name: "Parathyroid hormone (intact PTH)",
    domain: "bone_health",
    measures: "Parathyroid function — order when calcium is abnormal, vitamin D is low, or primary hyperparathyroidism is suspected.",
    fasting: "none",
  },
  dexa: {
    id: "dexa",
    name: "DEXA bone density scan",
    domain: "bone_health",
    measures: "Bone mineral density — recommended in women ≥65 and men ≥70, earlier with risk factors.",
    caveats: "Low-dose imaging, not a blood test. Defer if pregnancy is possible.",
    fasting: "none",
    guidelineAnchor: "USPSTF",
  },

  // -------------------- Pre-conception / fertility --------------------
  preconception_infectious: {
    id: "preconception_infectious",
    name: "Rubella + varicella IgG, HIV, syphilis, hepatitis B/C",
    domain: "preconception_fertility",
    measures: "Standard pre-conception infectious screen — vaccinate or treat where non-immune or positive.",
    fasting: "none",
    guidelineAnchor: "ACOG, CDC pre-conception",
  },
  carrier_screen: {
    id: "carrier_screen",
    name: "Expanded carrier screen (CF, SMA, etc.)",
    domain: "preconception_fertility",
    measures: "Genetic carrier status for inheritable conditions — ACOG recommends offering to all reproductive-age patients.",
    fasting: "none",
    guidelineAnchor: "ACOG 2017",
  },
  hemoglobin_electrophoresis: {
    id: "hemoglobin_electrophoresis",
    name: "Haemoglobin electrophoresis",
    domain: "preconception_fertility",
    measures: "Haemoglobinopathy screen (sickle cell, thalassaemia) — recommended in at-risk ancestry.",
    fasting: "none",
  },

  // -------------------- Mast cell --------------------
  tryptase: {
    id: "tryptase",
    name: "Serum tryptase (baseline)",
    domain: "mast_cell",
    measures: "Mast cell burden — relevant in suspected mast cell activation syndrome or mastocytosis, or after anaphylaxis.",
    caveats: "MCAS diagnosis requires a triad: symptoms, biomarker rise during an episode, and response to anti-mediator therapy.",
    fasting: "none",
    guidelineAnchor: "AAAAI MCAS consensus 2019",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function has(answers: AnswerMap, qid: keyof AnswerMap, value: string): boolean {
  return answerValues(answers[qid]).includes(value);
}

function hasAny(answers: AnswerMap, qid: keyof AnswerMap, values: string[]): boolean {
  const picks = answerValues(answers[qid]);
  return values.some((v) => picks.includes(v));
}

function isAdult(answers: AnswerMap): boolean {
  return answers.age_band !== "under_18";
}

function isSenior(answers: AnswerMap): boolean {
  return (
    answers.age_band === "60_69" ||
    answers.age_band === "70_79" ||
    answers.age_band === "80_plus" ||
    answers.age_band === "60_plus"
  );
}

function isPregnantOrTrying(answers: AnswerMap): boolean {
  return (
    answers.pregnant_or_breastfeeding === "yes" ||
    answers.pregnant_or_breastfeeding === "not_sure"
  );
}

const TIER_RANK: Record<LabTier, number> = {
  optional: 0,
  recommended: 1,
  strongly_recommended: 2,
};

function strongerTier(a: LabTier, b: LabTier): LabTier {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

interface PendingLab {
  spec: LabSpec;
  tier: LabTier;
  rationaleParts: string[];
  triggers: Set<string>;
}

function add(
  acc: Map<string, PendingLab>,
  specId: string,
  tier: LabTier,
  rationale: string,
  trigger: string,
) {
  const spec = LAB_SPECS[specId];
  if (!spec) return;
  const existing = acc.get(specId);
  if (existing) {
    existing.tier = strongerTier(existing.tier, tier);
    if (!existing.rationaleParts.includes(rationale)) {
      existing.rationaleParts.push(rationale);
    }
    existing.triggers.add(trigger);
    return;
  }
  acc.set(specId, {
    spec,
    tier,
    rationaleParts: [rationale],
    triggers: new Set([trigger]),
  });
}

// ---------------------------------------------------------------------------
// Rule sets
// ---------------------------------------------------------------------------

// Baseline adult screening — ensures every adult sees a credible "while
// you're at the lab" panel even if no specific symptom triggers a rule.
// Tier escalates with age, since pre-test probability of finding something
// rises sharply past 35–45 and again past 60.
function applyBaselineAdultRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const age = answers.age_band;
  const young = age === "18_29";
  const earlyMidlife = age === "30_44";
  const lateMidlife = age === "45_59";
  const senior = isSenior(answers);
  const midlifeOrOlder = earlyMidlife || lateMidlife || senior;

  // CBC + CMP — annual physical workhorses. Recommended from 30, optional
  // for younger adults as a baseline.
  if (midlifeOrOlder) {
    add(
      acc,
      "cbc",
      senior ? "strongly_recommended" : "recommended",
      "From midlife onward, an annual CBC catches anaemia, infection markers, and platelet abnormalities long before symptoms appear.",
      "annual screen",
    );
    add(
      acc,
      "cmp",
      senior || lateMidlife ? "strongly_recommended" : "recommended",
      "A comprehensive metabolic panel covers kidney function, liver enzymes, electrolytes, glucose, and protein in one draw — the foundation of an annual check from midlife onward.",
      "annual screen",
    );
  } else if (young) {
    add(
      acc,
      "cbc",
      "optional",
      "A baseline CBC in your 20s is reasonable as a one-off reference point.",
      "baseline",
    );
    add(
      acc,
      "cmp",
      "optional",
      "A baseline metabolic panel in your 20s gives a useful reference for kidney, liver, and glucose status before the midlife screening era.",
      "baseline",
    );
  }

  // Lipid panel — USPSTF recommends ASCVD risk assessment from 40. We make
  // it recommended from 30 (early baseline is increasingly favoured) and
  // strongly recommended from 45.
  if (lateMidlife || senior) {
    add(
      acc,
      "lipid_panel",
      "strongly_recommended",
      "Cardiovascular risk assessment is recommended for adults 40–75 (USPSTF). A lipid panel is the foundation.",
      "CV screen",
    );
  } else if (earlyMidlife) {
    add(
      acc,
      "lipid_panel",
      "recommended",
      "An early baseline lipid panel in your 30s catches familial patterns earlier and informs lifestyle calibration.",
      "CV baseline",
    );
  } else if (young) {
    add(
      acc,
      "lipid_panel",
      "optional",
      "A one-off baseline lipid panel in your 20s is a reasonable reference point.",
      "baseline",
    );
  }

  // HbA1c — USPSTF recommends diabetes screening from 35 (or earlier with
  // overweight/obesity). We default it to recommended from 35 and senior.
  if (lateMidlife || senior || (earlyMidlife && answers.weight_band === "overweight_band")) {
    add(
      acc,
      "hba1c",
      senior ? "strongly_recommended" : "recommended",
      "USPSTF recommends diabetes screening for adults 35–70. HbA1c gives a 3-month average and is the simplest single screen.",
      "diabetes screen",
    );
  } else if (earlyMidlife) {
    add(
      acc,
      "hba1c",
      "optional",
      "An early baseline HbA1c is reasonable in your 30s, especially with any family history of type-2 diabetes.",
      "baseline",
    );
  }

  // TSH — not a universal screen, but Endocrine Society and AAFP support
  // periodic TSH from 35, especially in women, given the slow-onset nature
  // of subclinical hypothyroidism.
  if (senior) {
    add(
      acc,
      "tsh",
      "recommended",
      "Subclinical thyroid disease is common past 60 and often presents non-specifically (fatigue, low mood, cognitive complaints). Periodic TSH is reasonable.",
      "thyroid screen",
    );
  } else if (lateMidlife && answers.sex === "female") {
    add(
      acc,
      "tsh",
      "optional",
      "Subclinical hypothyroidism is more common in women from 45 onward. A periodic TSH is a low-cost screen.",
      "thyroid baseline",
    );
  }

  // Vitamin D — universal screening isn't supported by USPSTF, but it's
  // widely ordered and the cost is low. Optional baseline for any adult.
  add(
    acc,
    "vitamin_d",
    answers.sun_exposure === "none_or_low" || senior ? "recommended" : "optional",
    answers.sun_exposure === "none_or_low"
      ? "Low sun exposure makes a one-time vitamin D check informative before deciding on a dose."
      : senior
        ? "Vitamin D status drops with age and lower skin synthesis. A periodic check is reasonable."
        : "Vitamin D testing isn't universally recommended, but a one-off baseline is informative for most adults.",
    "vitamin D baseline",
  );

  // B12 — same logic. Cheap, common deficiency past 60 (absorption falls).
  if (senior) {
    add(
      acc,
      "b12",
      "recommended",
      "B12 absorption falls with age and PPI/metformin use; deficiency is common and easy to miss. A periodic serum B12 is worthwhile past 60.",
      "B12 screen",
    );
  } else if (midlifeOrOlder) {
    add(
      acc,
      "b12",
      "optional",
      "A baseline B12 is reasonable in midlife, especially with plant-leaning diets or long-term PPI/metformin use.",
      "B12 baseline",
    );
  }

  // Ferritin — most adults benefit from at least one baseline measurement,
  // especially cycling women. Recommended for cycling women, optional for
  // others.
  const cyclingFemale =
    answers.sex === "female" &&
    (answers.cycle_pattern === "regular_cycle" || answers.cycle_pattern === "irregular_cycle");
  if (cyclingFemale) {
    add(
      acc,
      "ferritin",
      "recommended",
      "Iron deficiency is common in cycling women and often missed when haemoglobin is still in range. A serum ferritin is the most sensitive single test.",
      "cycling female",
    );
  } else if (midlifeOrOlder) {
    add(
      acc,
      "ferritin",
      "optional",
      "A baseline ferritin gives a useful reference for iron stores — often deferred unless symptoms appear.",
      "baseline",
    );
  }

  // UACR + eGFR — kidney screen from age 60 (KDIGO recommendation).
  if (senior) {
    add(
      acc,
      "uacr",
      "recommended",
      "KDIGO recommends periodic kidney screening from age 60 — a simple urine albumin-to-creatinine ratio detects early damage before serum creatinine rises.",
      "kidney screen",
    );
  }

  // FIT — colorectal cancer screening 45–75 (USPSTF 2021).
  if (lateMidlife || (senior && age !== "80_plus")) {
    add(
      acc,
      "fit",
      "strongly_recommended",
      "USPSTF recommends colorectal cancer screening from age 45 to 75. Faecal immunochemical testing is the simplest annual option.",
      "CRC screen",
    );
  }

  // hs-CRP, ApoB, Lp(a) — sensible advanced cardiometabolic baselines for
  // adults from 30 onward. Lp(a) is genetically determined so a single
  // measurement is enough; framing as "once in your life".
  if (midlifeOrOlder) {
    add(
      acc,
      "lpa",
      "optional",
      "Lp(a) is genetically determined — once-in-a-lifetime measurement is enough. Roughly 1 in 5 adults has elevated Lp(a) and won't know unless tested.",
      "lifetime CV",
    );
    add(
      acc,
      "apob",
      "optional",
      "ApoB counts atherogenic particles directly and is increasingly favoured over LDL-C for refining cardiovascular risk.",
      "advanced lipids",
    );
    add(
      acc,
      "hs_crp",
      "optional",
      "hs-CRP refines cardiovascular risk in borderline cases and is informative when paired with a lipid panel.",
      "advanced CV",
    );
  }

  // Bone density — USPSTF recommends DEXA in women ≥65 and men ≥70.
  if (
    (answers.sex === "female" && (age === "60_69" || age === "70_79" || age === "80_plus")) ||
    (answers.sex === "male" && (age === "70_79" || age === "80_plus"))
  ) {
    add(
      acc,
      "dexa",
      "recommended",
      "USPSTF recommends DEXA bone-density screening for women ≥65 and men ≥70. Earlier with risk factors.",
      "bone screen",
    );
  } else if (answers.sex === "female" && lateMidlife) {
    add(
      acc,
      "dexa",
      "optional",
      "Post-menopausal women with risk factors (low BMI, smoking, family history of fracture, glucocorticoid use) may benefit from DEXA before age 65.",
      "bone baseline",
    );
  }

  // Male testosterone — optional baseline in midlife/senior males with any
  // low-energy or low-libido pattern is widely ordered. We default it here
  // as a conservative optional so it appears alongside other midlife labs.
  if (answers.sex === "male" && (lateMidlife || senior)) {
    add(
      acc,
      "testosterone_male",
      "optional",
      "A baseline morning testosterone (with SHBG and free T calculated) is reasonable in midlife males — symptoms of low T are non-specific and easy to miss.",
      "midlife male",
    );
  }

  // PSA — shared decision-making 50–69 (USPSTF). Surface as optional.
  if (answers.sex === "male" && (lateMidlife || age === "60_69")) {
    add(
      acc,
      "psa",
      "optional",
      "PSA is a shared decision (USPSTF): small mortality benefit, real overdiagnosis risk. Worth raising with your clinician between 50 and 69.",
      "PSA",
    );
  }

  // Female perimenopause baseline — FSH/LH not routinely needed but often
  // ordered when cycles change in midlife.
  if (answers.sex === "female" && lateMidlife && answers.cycle_pattern !== "post_menopause") {
    add(
      acc,
      "fsh_lh",
      "optional",
      "If cycles are changing or vasomotor symptoms appear, FSH and LH can help confirm where you are in the menopause transition.",
      "perimenopause baseline",
    );
  }

  // GGT — sensitive to alcohol; informative for anyone with regular intake.
  if (
    answers.derived_alcohol_risk === "risk_low" ||
    answers.derived_alcohol_risk === "risk_moderate"
  ) {
    add(
      acc,
      "ggt",
      "optional",
      "GGT is a sensitive marker of alcohol-related liver effects and a useful check for anyone drinking regularly.",
      "alcohol baseline",
    );
  }

  // Uric acid — easy add-on, informative for metabolic syndrome and gout
  // risk. Optional for midlife and overweight adults.
  if (midlifeOrOlder && answers.weight_band !== "underweight_band") {
    add(
      acc,
      "uric_acid",
      "optional",
      "Uric acid is an inexpensive add-on that flags gout and metabolic-syndrome risk — often ordered alongside a CMP.",
      "metabolic baseline",
    );
  }
}

function applyAnemiaIronRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const ironSignal = answers.derived_iron_signal;
  const ironStrong = ironSignal === "signal_strong";
  const ironModerate = ironSignal === "signal_moderate";
  const heavyMenses = answers.pms_pattern === "significant_pms";
  const female = answers.sex === "female";
  const cyclingFemale =
    female &&
    (answers.cycle_pattern === "regular_cycle" || answers.cycle_pattern === "irregular_cycle");
  const lowEnergy = hasAny(answers, "energy_issue", ["low_energy", "post_meal_fog"]);
  const restlessLegs = hasAny(answers, "other_signs", ["muscle_twitches_restless_legs"]);
  const vegetarianish = hasAny(answers, "diet_pattern", ["vegan", "vegetarian", "pescatarian"]);

  const cbcReason: string[] = [];
  if (ironStrong || ironModerate) cbcReason.push("convergent iron-deficiency signs");
  if (cyclingFemale && heavyMenses) cbcReason.push("heavy menstrual losses");
  if (lowEnergy) cbcReason.push("low energy");
  if (cbcReason.length > 0) {
    const tier: LabTier = ironStrong || (cyclingFemale && heavyMenses) ? "strongly_recommended" : "recommended";
    add(
      acc,
      "cbc",
      tier,
      `Baseline check for anaemia given ${cbcReason.join(", ")}. A CBC is the first test in any fatigue or iron workup.`,
      "fatigue / iron signs",
    );
    add(
      acc,
      "ferritin",
      tier,
      `Ferritin drops before haemoglobin in iron deficiency, so a normal CBC alone can miss it. Indicated by ${cbcReason.join(", ")}.`,
      "iron stores",
    );
  }

  // Iron studies escalate when ferritin alone is ambiguous (multiple signs present).
  if (ironStrong || (cyclingFemale && heavyMenses && ironModerate)) {
    add(
      acc,
      "iron_panel",
      "recommended",
      "Iron studies (serum iron, TIBC, transferrin saturation) help when ferritin is borderline or when iron overload (raised transferrin saturation) needs ruling out.",
      "iron workup",
    );
  }

  // Restless legs without a clear iron signal still warrants ferritin alone.
  if (restlessLegs && !cbcReason.length) {
    add(
      acc,
      "ferritin",
      "recommended",
      "Restless-legs symptoms respond to iron repletion when ferritin is low — a serum ferritin is the standard first step.",
      "restless legs",
    );
  }

  // Plant-leaning diets — ferritin once a year is reasonable, especially in cycling women.
  if (vegetarianish && cyclingFemale) {
    add(
      acc,
      "ferritin",
      "recommended",
      "Plant-leaning diets reduce haem iron intake; combined with menstrual losses this is the highest-yield place to check ferritin.",
      "vegetarian + cycling",
    );
  }
}

function applyThyroidRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const fatigue = hasAny(answers, "energy_issue", ["low_energy", "low_motivation"]);
  const cold = hasAny(answers, "other_signs", ["cold_extremities"]);
  const drySkin = hasAny(answers, "skin_signs", ["skin_dry_scaly"]);
  const hairShedding = hasAny(answers, "hair_signs", ["hair_diffuse_shedding"]);
  const cycleIrregular = answers.cycle_pattern === "irregular_cycle";
  const cogIssue = hasAny(answers, "cognitive_bottleneck", [
    "post_meal_fog",
    "deep_focus_stamina",
    "memory_recall",
    "stress_induced_fog",
  ]);
  const knownThyroid = answers.thyroid_disorder === "yes";

  const reasons: string[] = [];
  if (fatigue) reasons.push("fatigue");
  if (cold) reasons.push("cold intolerance");
  if (drySkin) reasons.push("dry skin");
  if (hairShedding) reasons.push("diffuse hair shedding");
  if (cycleIrregular) reasons.push("irregular cycles");
  if (cogIssue && (fatigue || cold)) reasons.push("cognitive complaints");

  // TSH triggers easily — even one symptom warrants a low-cost screen,
  // and converging symptoms escalate the tier.
  const score = reasons.length + (isSenior(answers) ? 1 : 0);
  if (score >= 1 || knownThyroid) {
    const tier: LabTier =
      knownThyroid || score >= 3 ? "strongly_recommended" : score >= 2 ? "recommended" : "optional";
    add(
      acc,
      "tsh",
      tier,
      `TSH is the first thyroid screen and is cheap to order. Triggered by ${reasons.join(", ") || "your reported thyroid history"}.`,
      "thyroid screen",
    );
    if (knownThyroid || score >= 2) {
      add(
        acc,
        "free_t4",
        score >= 3 || knownThyroid ? "recommended" : "optional",
        "Free T4 should be ordered reflexively if TSH is abnormal, or up-front when symptoms are strong.",
        "thyroid screen",
      );
    }
  }

  // Thyroid antibodies if subclinical thyroid suspected and family history (proxied by knownThyroid + signs).
  if (knownThyroid && score >= 1) {
    add(
      acc,
      "tpo_antibodies",
      "optional",
      "Thyroid peroxidase antibodies support a Hashimoto's diagnosis. Useful when TSH is borderline and an autoimmune cause is suspected.",
      "autoimmune thyroid",
    );
  }
}

function applyVitaminMineralRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const vdSignal = answers.derived_vitamin_d_signal;
  const b12Signal = answers.derived_b12_signal;
  const bComplexSignal = answers.derived_b_complex_signal;
  const magnesiumSignal = answers.derived_magnesium_signal;
  const zincSignal = answers.derived_zinc_signal;
  const vegan = has(answers, "diet_pattern", "vegan");
  const vegetarianish = hasAny(answers, "diet_pattern", ["vegan", "vegetarian", "pescatarian"]);
  const heavyAlcohol =
    answers.derived_alcohol_risk === "risk_high" || answers.derived_alcohol_risk === "risk_moderate";
  const polypharmacy = answers.medication_profile === "polypharmacy";
  const ocp = answers.contraception_type === "combined_pill";

  // Vitamin D — strongly recommended on convergent signal or high-risk profile.
  if (vdSignal === "signal_strong") {
    add(
      acc,
      "vitamin_d",
      "strongly_recommended",
      "Convergent signs in your answers (low sun exposure, frequent infections, eczema, diffuse hair shedding) point to possible low vitamin D status.",
      "vitamin D signs",
    );
  } else if (vdSignal === "signal_moderate" || answers.sun_exposure === "none_or_low" || isSenior(answers)) {
    add(
      acc,
      "vitamin_d",
      "recommended",
      "Low sun exposure, age, or several body signs make this a useful one-time check before deciding on a vitamin D dose.",
      "vitamin D context",
    );
  }

  // B12 — strong on signal_strong; recommended in vegans, polypharmacy, seniors.
  if (b12Signal === "signal_strong") {
    add(
      acc,
      "b12",
      "strongly_recommended",
      "Sore or smooth tongue, pale skin, or convergent dietary inputs point to possible low B12 — worth confirming before any dose.",
      "B12 signs",
    );
    add(
      acc,
      "mma",
      "recommended",
      "Methylmalonic acid is the functional B12 marker — useful when serum B12 is borderline (200–400 pg/mL).",
      "B12 confirmation",
    );
  } else if (b12Signal === "signal_moderate" || vegetarianish || isSenior(answers) || polypharmacy) {
    const reasons: string[] = [];
    if (vegetarianish) reasons.push(vegan ? "vegan diet" : "plant-leaning diet");
    if (isSenior(answers)) reasons.push("age (B12 absorption falls)");
    if (polypharmacy) reasons.push("medication load (PPIs and metformin reduce B12 absorption)");
    add(
      acc,
      "b12",
      vegan ? "strongly_recommended" : "recommended",
      `B12 deficiency develops slowly and is often missed. Triggered by ${reasons.join(", ") || "convergent body signs"}.`,
      "B12 risk",
    );
  }

  // Folate / RBC folate — pre-conception, alcohol, or B-complex signals.
  if (isPregnantOrTrying(answers) || heavyAlcohol || bComplexSignal === "signal_strong") {
    const tier: LabTier = isPregnantOrTrying(answers) ? "recommended" : "optional";
    add(
      acc,
      "folate",
      tier,
      isPregnantOrTrying(answers)
        ? "Folate status matters before and during pregnancy. Most countries fortify flour, so low folate is uncommon — but worth confirming."
        : heavyAlcohol
          ? "Heavy alcohol intake reduces folate absorption."
          : "Convergent B-vitamin signs make a folate check worthwhile.",
      "folate context",
    );
    if (isPregnantOrTrying(answers)) {
      add(
        acc,
        "rbc_folate",
        "optional",
        "RBC folate reflects 120-day status — more stable than serum folate for pre-conception planning.",
        "preconception",
      );
    }
  }

  // Homocysteine — when B12 borderline, cognitive complaints, or family CVD history.
  const cognitiveDecline =
    isSenior(answers) &&
    hasAny(answers, "cognitive_bottleneck", ["memory_recall", "deep_focus_stamina"]);
  if (b12Signal === "signal_strong" || cognitiveDecline || ocp) {
    add(
      acc,
      "homocysteine",
      "optional",
      cognitiveDecline
        ? "In older adults with cognitive complaints, raised homocysteine reflects B12/folate/B6 status worth correcting."
        : ocp
          ? "Combined hormonal contraceptives mildly raise homocysteine via B6/folate effects — context-dependent."
          : "A functional B-vitamin marker, useful when B12 status is borderline.",
      "homocysteine",
    );
  }

  // Magnesium — convergent signal or refractory cramps with poor sleep.
  if (magnesiumSignal === "signal_strong") {
    add(
      acc,
      "serum_magnesium",
      "recommended",
      "Muscle twitches, cramps, or restless legs alongside high stress, poor sleep, or alcohol all point to possible magnesium deficiency.",
      "magnesium signs",
    );
    add(
      acc,
      "rbc_magnesium",
      "optional",
      "RBC magnesium is more sensitive than serum to chronic intracellular deficiency, but isn't always covered. Serum first.",
      "magnesium",
    );
  }

  // Zinc — convergent signal AND immune/dermatology context.
  if (zincSignal === "signal_strong") {
    add(
      acc,
      "serum_zinc",
      "optional",
      "Convergent signs (taste/smell changes, slow wound healing, frequent infections, white nail spots) on a plant-leaning diet make a zinc check reasonable. Ask the lab for a trace-element tube.",
      "zinc signs",
    );
  }

  // Thiamine — heavy alcohol or recent rapid weight loss.
  if (
    answers.derived_alcohol_risk === "risk_high" ||
    answers.weight_change_recent === "lost_weight"
  ) {
    add(
      acc,
      "thiamine",
      "optional",
      answers.derived_alcohol_risk === "risk_high"
        ? "Heavy alcohol use depletes thiamine and raises the risk of Wernicke's encephalopathy. A whole-blood thiamine pyrophosphate is the right test."
        : "Recent unintentional weight loss raises the risk of refeeding-related thiamine deficiency.",
      "thiamine risk",
    );
  }
}

function applyMetabolicRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const glycemicHigh = answers.derived_glycemic_risk === "risk_high";
  const glycemicMod = answers.derived_glycemic_risk === "risk_moderate";
  const obese = answers.weight_band === "obese_band";
  const overweight = answers.weight_band === "overweight_band";
  const onMed = answers.glucose_lowering_med === "yes";
  const ageMidlife =
    answers.age_band === "30_44" ||
    answers.age_band === "45_59" ||
    isSenior(answers);
  const female = answers.sex === "female";
  const cycleIrreg = answers.cycle_pattern === "irregular_cycle";
  const skinAcne = hasAny(answers, "skin_signs", ["skin_adult_acne"]);

  if (glycemicHigh || onMed) {
    add(
      acc,
      "hba1c",
      "strongly_recommended",
      onMed
        ? "Standard monitoring for anyone on glucose-lowering medication."
        : "Convergent inputs (sugary drinks, glucose status, medication, weight) place you in a higher metabolic-risk band — HbA1c gives a 3-month average.",
      "diabetes screen",
    );
    add(
      acc,
      "fasting_glucose",
      "recommended",
      "Fasting glucose pairs with HbA1c — useful when one is borderline or when HbA1c may be unreliable (anaemia, recent transfusion).",
      "diabetes screen",
    );
  } else if (glycemicMod || (ageMidlife && (obese || overweight))) {
    add(
      acc,
      "hba1c",
      "recommended",
      "USPSTF recommends diabetes screening for adults 35–70 who are overweight or obese. HbA1c is the simplest single test.",
      "diabetes screen",
    );
  }

  // PCOS workup — irregular cycles + hirsutism/acne in female.
  if (female && cycleIrreg && skinAcne) {
    add(
      acc,
      "fasting_insulin",
      "optional",
      "Irregular cycles plus adult acne can fit a PCOS picture; fasting insulin and SHBG help evaluate insulin resistance in that context.",
      "PCOS workup",
    );
  }

  // Uric acid — gout proxies, kidney stones history.
  if (answers.kidney_stones === "yes" || (obese && glycemicMod)) {
    add(
      acc,
      "uric_acid",
      "optional",
      answers.kidney_stones === "yes"
        ? "Uric-acid stones are a common kidney-stone subtype — worth measuring."
        : "Metabolic syndrome and elevated urate often co-occur.",
      "uric acid",
    );
  }
}

function applyLipidsRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const ageScreen =
    answers.age_band === "45_59" ||
    answers.age_band === "30_44" ||
    isSenior(answers);
  const bp =
    answers.blood_pressure_status === "bp_high_treated" ||
    answers.blood_pressure_status === "bp_high_untreated" ||
    answers.blood_pressure_status === "bp_borderline";
  const triglyceridesHigh = answers.lab_triglycerides_status === "high";
  const lipidUnknown = answers.lipid_status === "not_sure" || !answers.lipid_status;
  const onStatin = answers.statin_use === "yes";
  const obese = answers.weight_band === "obese_band";

  if (ageScreen || bp || triglyceridesHigh || onStatin || obese) {
    add(
      acc,
      "lipid_panel",
      "strongly_recommended",
      "Standard cardiovascular risk assessment for adults 40–75 (USPSTF), or earlier with hypertension, obesity, or family history.",
      "CV risk",
    );
  } else if (lipidUnknown && (answers.age_band === "18_29")) {
    add(
      acc,
      "lipid_panel",
      "optional",
      "A baseline cholesterol check in your 20s is reasonable, even if not strictly required by guidelines.",
      "baseline lipids",
    );
  }

  // ApoB / Lp(a) — escalate when CVD risk is borderline or family-history flagged.
  if (bp || triglyceridesHigh || onStatin) {
    add(
      acc,
      "apob",
      "recommended",
      "ApoB counts atherogenic particles directly, refining risk when triglycerides are high or LDL-C is borderline.",
      "advanced lipids",
    );
    add(
      acc,
      "lpa",
      "recommended",
      "Lipoprotein(a) is genetically determined — one measurement in a lifetime is enough. About 1 in 5 adults has elevated Lp(a).",
      "advanced lipids",
    );
  }

  // hs-CRP — borderline ASCVD context.
  if ((bp || obese) && !onStatin) {
    add(
      acc,
      "hs_crp",
      "optional",
      "Useful for refining cardiovascular risk in borderline cases when a statin decision is on the table.",
      "CV risk refinement",
    );
  }

  // CAC — middle-aged with risk factors.
  const middleAged = answers.age_band === "45_59" || answers.age_band === "60_69";
  if (middleAged && (bp || triglyceridesHigh) && !onStatin && !isPregnantOrTrying(answers)) {
    add(
      acc,
      "cac",
      "optional",
      "A CAC score informs statin decisions when 10-year cardiovascular risk is in the borderline 5–20% range. Imaging, not a blood test.",
      "CAC",
    );
  }
}

function applyLiverKidneyRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const heavyAlc = answers.derived_alcohol_risk === "risk_high";
  const obese = answers.weight_band === "obese_band";
  const liverHx = answers.liver_history === "yes";
  const kidneyHx = answers.kidney_history === "yes";
  const polypharmacy = answers.medication_profile === "polypharmacy";
  const onStatin = answers.statin_use === "yes";
  const bp =
    answers.blood_pressure_status === "bp_high_treated" ||
    answers.blood_pressure_status === "bp_high_untreated";
  const onGlucoseMed = answers.glucose_lowering_med === "yes";
  const ageMidlife =
    answers.age_band === "45_59" ||
    isSenior(answers);

  if (
    heavyAlc ||
    obese ||
    liverHx ||
    kidneyHx ||
    polypharmacy ||
    onStatin ||
    bp ||
    onGlucoseMed ||
    ageMidlife
  ) {
    add(
      acc,
      "cmp",
      ageMidlife || polypharmacy || liverHx || kidneyHx ? "strongly_recommended" : "recommended",
      "A comprehensive metabolic panel covers liver enzymes, kidney function, electrolytes, and glucose in one draw — the workhorse baseline test.",
      "baseline panel",
    );
  }

  if (heavyAlc) {
    add(
      acc,
      "ggt",
      "optional",
      "GGT is a sensitive marker of alcohol-related liver effects.",
      "alcohol",
    );
  }

  if (obese) {
    add(
      acc,
      "fib4",
      "optional",
      "FIB-4 is a free calculation from age and existing liver enzymes that estimates fibrosis risk in NAFLD/MASLD — a high-yield, no-cost step.",
      "NAFLD",
    );
  }

  if (kidneyHx || onGlucoseMed || bp) {
    add(
      acc,
      "uacr",
      "recommended",
      "Urine albumin-to-creatinine ratio detects early kidney damage before serum creatinine rises. Annual screening is standard in diabetes and hypertension.",
      "kidney screen",
    );
  }
}

function applyInflammationAutoimmuneRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const autoimmuneHx = answers.autoimmune_condition === "yes";
  const persistentJoint = answers.joint_stiffness === "persistent_joint_pain";
  const morningStiff = answers.joint_stiffness === "morning_stiffness";
  const eczema = hasAny(answers, "skin_signs", ["skin_eczema_inflamed"]);

  if (persistentJoint || (morningStiff && autoimmuneHx)) {
    add(
      acc,
      "crp",
      "recommended",
      "Persistent joint pain, especially with morning stiffness, warrants an inflammation marker.",
      "joint pain",
    );
    add(
      acc,
      "esr",
      "optional",
      "ESR adds context to CRP, and is the standard marker if polymyalgia rheumatica or giant cell arteritis is suspected.",
      "joint pain",
    );
    add(
      acc,
      "rf_anti_ccp",
      "recommended",
      "If joints are symmetric, swollen, or stiff for >30 minutes in the morning, RF and anti-CCP help screen for rheumatoid arthritis.",
      "RA screen",
    );
  }

  if (autoimmuneHx && (persistentJoint || eczema)) {
    add(
      acc,
      "ana",
      "optional",
      "ANA helps screen for connective tissue disease when joint pain, rash, and fatigue cluster — but only with clinical suspicion (false positives are common).",
      "autoimmune screen",
    );
  }
}

function applyHormonesFemaleRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  if (answers.sex !== "female") return;

  const cycleIrreg = answers.cycle_pattern === "irregular_cycle";
  const noCycle = answers.cycle_pattern === "no_cycle";
  const hotFlashes =
    answers.perimenopause_symptoms === "hot_flashes" ||
    answers.perimenopause_symptoms === "perimenopause_mixed";
  const acne = hasAny(answers, "skin_signs", ["skin_adult_acne"]);
  const hairLoss = hasAny(answers, "hair_signs", ["hair_diffuse_shedding"]);
  const trying = isPregnantOrTrying(answers);

  // Perimenopause workup
  if (hotFlashes || (cycleIrreg && (answers.age_band === "45_59" || answers.age_band === "30_44"))) {
    add(
      acc,
      "fsh_lh",
      "recommended",
      "Vasomotor symptoms or cycle changes in midlife — FSH/LH and estradiol help confirm where you are in the menopause transition.",
      "perimenopause",
    );
    add(
      acc,
      "estradiol",
      "recommended",
      "Estradiol completes the picture alongside FSH/LH.",
      "perimenopause",
    );
  }

  // PCOS-style workup
  if (cycleIrreg && (acne || hairLoss)) {
    add(
      acc,
      "testosterone_female",
      "recommended",
      "Irregular cycles plus acne or hair loss can fit a PCOS picture. Ask the lab for a sensitive (LC-MS/MS) testosterone assay.",
      "PCOS workup",
    );
    add(
      acc,
      "dhea_s",
      "optional",
      "DHEA-S helps localise an adrenal vs ovarian source of androgens.",
      "PCOS workup",
    );
  }

  // Prolactin — galactorrhoea, amenorrhoea, infertility, headache + visual.
  if (noCycle || (cycleIrreg && trying)) {
    add(
      acc,
      "prolactin",
      "recommended",
      "Prolactin is a routine part of any amenorrhoea or fertility workup.",
      "prolactin screen",
    );
  }

  // Pre-conception female panel
  if (trying) {
    add(
      acc,
      "tsh",
      "strongly_recommended",
      "Thyroid status before and during pregnancy matters — ATA and ACOG recommend TSH ahead of conception.",
      "preconception thyroid",
    );
    add(
      acc,
      "ferritin",
      "recommended",
      "Entering pregnancy iron-replete improves outcomes.",
      "preconception iron",
    );
    add(
      acc,
      "vitamin_d",
      "recommended",
      "Vitamin D status is worth knowing before pregnancy, especially with low sun exposure or darker skin.",
      "preconception vitamin D",
    );
    add(
      acc,
      "preconception_infectious",
      "strongly_recommended",
      "Standard CDC/ACOG pre-conception infectious-disease screen — vaccinate where non-immune.",
      "preconception",
    );
    add(
      acc,
      "carrier_screen",
      "recommended",
      "ACOG (2017) recommends offering expanded carrier screening to all reproductive-age patients.",
      "preconception",
    );
    add(
      acc,
      "amh",
      "optional",
      "AMH is useful for IVF planning or if premature ovarian insufficiency is suspected — it doesn't predict natural fertility well in low-risk women.",
      "preconception",
    );
  }
}

function applyHormonesMaleRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  if (answers.sex !== "male") return;

  const lowEnergy = hasAny(answers, "energy_issue", ["low_energy", "low_motivation"]);
  const obese = answers.weight_band === "obese_band";
  const ageBand = answers.age_band;
  const olderMale =
    ageBand === "45_59" || ageBand === "60_69" || ageBand === "70_79";

  if (lowEnergy && (obese || olderMale)) {
    add(
      acc,
      "testosterone_male",
      "recommended",
      "Persistent low energy or low motivation in midlife or with obesity is the classic context for a testosterone check. Confirm a low result with a second AM draw.",
      "testosterone",
    );
    add(
      acc,
      "lh_fsh_male",
      "optional",
      "If testosterone is confirmed low, LH and FSH separate primary (testicular) from secondary (pituitary) hypogonadism.",
      "hypogonadism workup",
    );
    add(
      acc,
      "prolactin_male",
      "optional",
      "Prolactin completes the pituitary screen when low testosterone is confirmed.",
      "hypogonadism workup",
    );
  }

  // PSA shared decision-making 50–69 (or 40+ with FHx — proxy with autoimmune absent).
  if (ageBand === "45_59" || ageBand === "60_69") {
    add(
      acc,
      "psa",
      "optional",
      "PSA is a shared decision: small mortality benefit, real overdiagnosis risk. Worth discussing with your clinician.",
      "PSA",
    );
  }
}

function applyAdrenalRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  // Strict criteria: cortisol screening is for true adrenal insufficiency,
  // NOT "adrenal fatigue" (which is not a real condition). Trigger only when
  // multiple AI-suggestive features cluster: severe fatigue + low BP + recent
  // weight loss or hyperpigmentation. We approximate with red-flag weight loss.
  const severeFatigue = hasAny(answers, "energy_issue", ["low_energy"]);
  const weightLoss = answers.weight_change_recent === "lost_weight";
  const lowBP = answers.blood_pressure_status === "bp_normal" && weightLoss;

  if (severeFatigue && weightLoss && lowBP) {
    add(
      acc,
      "am_cortisol",
      "optional",
      "Severe fatigue with unintentional weight loss is one of the patterns where a true adrenal insufficiency screen is appropriate. This is not the same as a 4-point salivary 'adrenal fatigue' test, which isn't a recognised diagnostic tool.",
      "adrenal screen",
    );
  }
}

function applyGutRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const giSymptoms = answerValues(answers.gi_symptoms ?? "").filter((v) => v !== "no_gi_symptoms");
  const bloating = giSymptoms.includes("gi_bloating");
  const reflux = giSymptoms.includes("gi_reflux");
  const abdominal = giSymptoms.includes("gi_abdominal_pain");
  const alternating = giSymptoms.includes("gi_alternating_constipation_diarrhea");
  const ironLow =
    answers.derived_iron_signal === "signal_strong" ||
    answers.derived_iron_signal === "signal_moderate";
  const constipation = answers.bowel_pattern === "bowel_less_than_3_per_week";
  const ageScreen =
    answers.age_band === "45_59" || isSenior(answers);

  // Coeliac panel — broad indications: unexplained iron deficiency, IBS-like, autoimmune.
  if (
    ironLow ||
    alternating ||
    abdominal ||
    answers.autoimmune_condition === "yes"
  ) {
    add(
      acc,
      "celiac_panel",
      "recommended",
      "Coeliac disease is under-diagnosed and presents in many ways — unexplained iron deficiency, alternating bowel habits, abdominal pain, or alongside other autoimmune conditions. Stay on gluten until tested.",
      "celiac screen",
    );
  }

  // H. pylori — dyspepsia, reflux not on PPI, unexplained iron deficiency.
  if (reflux || (ironLow && abdominal) || (abdominal && bloating)) {
    add(
      acc,
      "h_pylori",
      "recommended",
      "H. pylori is a common cause of dyspepsia and a contributor to unexplained iron deficiency. Stool antigen or breath test, off PPIs for 2 weeks.",
      "H. pylori",
    );
  }

  // Faecal calprotectin — alternating bowel habits or chronic abdominal pain.
  if (alternating || (abdominal && bloating)) {
    add(
      acc,
      "fecal_calprotectin",
      "recommended",
      "Calprotectin distinguishes inflammatory bowel disease from IBS — high yield when symptoms are persistent.",
      "IBD vs IBS",
    );
  }

  // FIT — colorectal cancer screening 45–75, or unexplained iron deficiency.
  if (ageScreen || ironLow) {
    add(
      acc,
      "fit",
      "recommended",
      ageScreen
        ? "Faecal immunochemical testing is part of routine colorectal cancer screening from age 45."
        : "Unexplained iron deficiency in an adult warrants ruling out occult GI bleeding.",
      "FIT",
    );
  }

  // Pancreatic elastase — chronic loose stools or steatorrhoea proxy (constipation alternating + weight loss).
  if (alternating && answers.weight_change_recent === "lost_weight") {
    add(
      acc,
      "pancreatic_elastase",
      "optional",
      "Chronic loose stools with weight change can fit exocrine pancreatic insufficiency — faecal elastase is the right screen.",
      "EPI screen",
    );
  }

  // Constipation alone usually doesn't need labs — handled in lifestyle.
  void constipation;
}

function applyBoneRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  const female = answers.sex === "female";
  const postMeno = answers.cycle_pattern === "post_menopause";
  const ageBand = answers.age_band;
  const olderFemale = female && (postMeno || ageBand === "60_69" || ageBand === "70_79" || ageBand === "80_plus");
  const olderMale = answers.sex === "male" && (ageBand === "70_79" || ageBand === "80_plus");
  const lowBMI = answers.weight_band === "underweight_band";
  const lowSun = answers.sun_exposure === "none_or_low";
  const vegan = has(answers, "diet_pattern", "vegan");

  if (olderFemale || olderMale) {
    add(
      acc,
      "dexa",
      "recommended",
      olderFemale
        ? "DEXA bone-density screening is recommended for women ≥65 (or earlier post-menopause with risk factors)."
        : "DEXA is recommended for men ≥70.",
      "bone density",
    );
  } else if (lowBMI) {
    add(
      acc,
      "dexa",
      "optional",
      "Low BMI raises fracture risk — a DEXA gives a baseline.",
      "low BMI",
    );
  }

  // PTH — when calcium abnormal or vitamin D very low. We don't ask calcium directly,
  // so we trigger PTH when vitamin D is signalled strong AND in a senior to surface
  // the need for clinician-level interpretation.
  if (
    (lowSun || vegan) &&
    isSenior(answers) &&
    answers.derived_vitamin_d_signal === "signal_strong"
  ) {
    add(
      acc,
      "pth",
      "optional",
      "If vitamin D is very low, your clinician may add PTH to evaluate parathyroid response and bone-mineral homeostasis.",
      "PTH context",
    );
  }
}

function applyMastCellRules(answers: AnswerMap, acc: Map<string, PendingLab>) {
  // Conservative trigger: only when symptoms cluster strongly across systems.
  // We don't have a dedicated MCAS question — we trigger on multi-system flares
  // that include skin (eczema/itch) + GI (alternating BMs / reflux) + frequent
  // infections OR allergy load.
  const skin = hasAny(answers, "skin_signs", ["skin_eczema_inflamed"]);
  const flushing = answers.perimenopause_symptoms === "hot_flashes"; // imperfect proxy
  const giFlares = hasAny(answers, "gi_symptoms", [
    "gi_bloating",
    "gi_alternating_constipation_diarrhea",
  ]);
  const allergyLoad = answerValues(answers.known_allergies).filter((a) => a !== "no_known_allergies").length >= 2;

  if (skin && giFlares && allergyLoad && !flushing) {
    add(
      acc,
      "tryptase",
      "optional",
      "Multi-system symptoms (skin flares + GI flares + multiple food allergies) sometimes fit a mast-cell pattern. Baseline serum tryptase is the right starting point — MCAS diagnosis requires a clinical triad, not a single lab.",
      "mast cell",
    );
  }
}

// ---------------------------------------------------------------------------
// Top-level entry
// ---------------------------------------------------------------------------

export function deriveLabRecommendations(
  answers: AnswerMap,
  riskFlags: RiskFlag[],
): LabRecommendation[] {
  // Pediatric guard: don't generate a panel for under-18s. The supplement engine
  // already routes them to clinician review; lab recs follow the same policy.
  if (answers.age_band === "under_18") {
    return [];
  }

  // Red-flag interception: when an urgent symptom is reported, the right next
  // step is a clinical visit, not a self-assembled lab list. We return empty
  // so the UI can show a single "see a clinician first" card instead.
  if (riskFlags.includes("urgent_clinical_review")) {
    return [];
  }

  const acc = new Map<string, PendingLab>();

  applyBaselineAdultRules(answers, acc);
  applyAnemiaIronRules(answers, acc);
  applyThyroidRules(answers, acc);
  applyVitaminMineralRules(answers, acc);
  applyMetabolicRules(answers, acc);
  applyLipidsRules(answers, acc);
  applyLiverKidneyRules(answers, acc);
  applyInflammationAutoimmuneRules(answers, acc);
  applyHormonesFemaleRules(answers, acc);
  applyHormonesMaleRules(answers, acc);
  applyAdrenalRules(answers, acc);
  applyGutRules(answers, acc);
  applyBoneRules(answers, acc);
  applyMastCellRules(answers, acc);

  // If we generated nothing, the user is likely young, healthy, with no
  // converging signals. That's a valid output — the print sheet will say
  // "no lab tests stand out from your answers" rather than fabricating.
  const ordered: LabRecommendation[] = Array.from(acc.values())
    .map((p) => ({
      id: p.spec.id,
      name: p.spec.name,
      synonyms: p.spec.synonyms,
      domain: p.spec.domain,
      tier: p.tier,
      measures: p.spec.measures,
      rationale: p.rationaleParts.join(" "),
      caveats: p.spec.caveats,
      fasting: p.spec.fasting,
      timing: p.spec.timing,
      guidelineAnchor: p.spec.guidelineAnchor,
      triggers: Array.from(p.triggers),
    }))
    .sort((a, b) => {
      const tierDelta = TIER_RANK[b.tier] - TIER_RANK[a.tier];
      if (tierDelta !== 0) return tierDelta;
      return a.name.localeCompare(b.name);
    });

  return ordered;
}

// ---------------------------------------------------------------------------
// Editorial position: tests we DO NOT include and why.
//
// This list is documentation, not runtime. It exists so future contributors
// can see what's been considered and rejected — and why — before someone
// adds a test that's popular in functional medicine but lacks evidence.
// ---------------------------------------------------------------------------

export const EXCLUDED_TESTS: ReadonlyArray<{ name: string; reason: string }> = [
  {
    name: "Hair tissue mineral analysis",
    reason:
      "Sample-to-sample irreproducibility (Seidel et al, JAMA 2001 — same hair, different labs, different results). No clinical validity for nutritional or toxic-element status.",
  },
  {
    name: "IgG food sensitivity panels (LEAP, MRT, ALCAT, EverlyWell food sensitivity)",
    reason:
      "AAAAI, EAACI, and CSACI position statements: food-specific IgG reflects exposure, not pathology. Multiple position papers explicitly recommend against ordering.",
  },
  {
    name: "Comprehensive stool analysis / GI-MAP / GI Effects (microbiome interpretations)",
    reason:
      "No validated clinical decision rules; intervention RCTs based on these results are absent. Pathogen detection (e.g. C. diff) is fine when ordered by indication, but the marketed 'dysbiosis index' interpretations are speculative.",
  },
  {
    name: "DUTCH test (dried urine total hormones)",
    reason:
      "Metabolite ratios are marketed as actionable but lack outcome data and aren't validated against serum for clinical decision-making.",
  },
  {
    name: "Salivary sex hormone panels (general use)",
    reason:
      "Endocrine Society position: not validated against serum for clinical decision-making. Late-night salivary cortisol IS validated for Cushing's screening, but that's a different use case.",
  },
  {
    name: "4-point salivary 'adrenal fatigue' cortisol curve (as wellness test)",
    reason:
      "Endocrine Society explicit: 'adrenal fatigue is not a real medical condition; there are no scientific facts to support the theory.' The 4-point curve is validated for Cushing's screening only.",
  },
  {
    name: "MTHFR genotyping for general population",
    reason:
      "ACMG 2013: 'MTHFR polymorphism testing is not recommended' for general thrombophilia, recurrent pregnancy loss, or CVD workup.",
  },
  {
    name: "Spectracell / 'intracellular micronutrient panel'",
    reason:
      "No independent validation; reproducibility issues. Use serum/RBC nutrient assays from accredited labs instead.",
  },
  {
    name: "Organic Acids Test (urine OAT) for general nutrition",
    reason:
      "Marketed interpretations are not peer-reviewed validated. Useful in specific inborn-errors-of-metabolism workups, not for general wellness.",
  },
  {
    name: "Provoked (chelator-challenge) urinary toxic metals",
    reason:
      "AAP and ACMT statements: reference ranges are unprovoked, so the method is invalid. Generates artefactual 'high' results that drive unnecessary chelation.",
  },
  {
    name: "Zonulin / 'leaky gut' lactulose-mannitol as clinical tests",
    reason: "Assay validity questioned in literature; clinical utility unproven outside research settings.",
  },
  {
    name: "DAO (diamine oxidase) for histamine intolerance",
    reason: "Unreliable assay; not in any allergy society guidelines (AAAAI, EAACI).",
  },
  {
    name: "Reverse T3 as routine thyroid evaluation",
    reason:
      "Not in ATA or Endocrine Society guidelines. The 'thyroid resistance' or 'sick euthyroid' interpretations marketed in functional medicine aren't validated.",
  },
  {
    name: "Cyrex autoimmune arrays",
    reason: "No independent validation; high false-positive rates.",
  },
  {
    name: "Hair cortisol",
    reason: "Research-grade only; not clinically actionable.",
  },
  {
    name: "Live blood cell analysis, iridology, applied kinesiology, electrodermal biofeedback",
    reason: "Pseudoscience.",
  },
  {
    name: "'Toxin burden' / 'heavy metal load' panels driven by questionnaires",
    reason: "No validated clinical decision pathway; tend to drive unnecessary chelation.",
  },
];
