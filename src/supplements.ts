import { SupplementRule } from "./types";

const odsMagnesium = {
  label: "NIH ODS Magnesium Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/magnesium/",
  lastReviewed: "2026-04-30",
};

const odsVitaminD = {
  label: "NIH ODS Vitamin D Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

const odsOmega3 = {
  label: "NIH ODS Omega-3 Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

const odsIron = {
  label: "NIH ODS Iron Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

const odsB12 = {
  label: "NIH ODS Vitamin B12 Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

const odsProbiotics = {
  label: "NIH ODS Probiotics Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Probiotics-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

const nccihMelatonin = {
  label: "NCCIH Melatonin",
  url: "https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know/",
  lastReviewed: "2026-04-30",
};

const nccihAshwagandha = {
  label: "NCCIH Ashwagandha",
  url: "https://www.nccih.nih.gov/health/ashwagandha",
  lastReviewed: "2026-04-30",
};

const psylliumConstipationMetaAnalysis = {
  label: "Fiber Supplementation for Chronic Constipation Meta-analysis",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9535527/",
  lastReviewed: "2026-04-30",
};

const reishiSafetyReview = {
  label: "Ganoderma lucidum Safety Review",
  url: "https://pubmed.ncbi.nlm.nih.gov/40427395/",
  lastReviewed: "2026-04-30",
};

const issnCreatine = {
  label: "ISSN Creatine Position Stand",
  url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z",
  lastReviewed: "2026-04-30",
};

const issnProtein = {
  label: "ISSN Protein and Exercise Position Stand (Jäger et al., 2017)",
  url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8",
  lastReviewed: "2026-05-04",
};

const lTheanineReview = {
  label: "L-theanine for stress and anxiety: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/31758301/",
  lastReviewed: "2026-04-30",
};

const glycineSleepStudy = {
  label: "Glycine ingestion improves subjective sleep quality",
  url: "https://pubmed.ncbi.nlm.nih.gov/22529837/",
  lastReviewed: "2026-04-30",
};

const apigeninReview = {
  label: "Apigenin: pharmacology and CNS effects review",
  url: "https://pubmed.ncbi.nlm.nih.gov/30412395/",
  lastReviewed: "2026-04-30",
};

const holyBasilReview = {
  label: "Ocimum sanctum (holy basil / tulsi) clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/28400848/",
  lastReviewed: "2026-04-30",
};

const lionsManeReview = {
  label: "Hericium erinaceus (lion's mane) cognitive review",
  url: "https://pubmed.ncbi.nlm.nih.gov/31413233/",
  lastReviewed: "2026-04-30",
};

const rhodiolaReview = {
  label: "Rhodiola rosea for fatigue and stress: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/22228617/",
  lastReviewed: "2026-04-30",
};

const saffronDepressionMeta = {
  label: "Saffron for depressive symptoms: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/30036891/",
  lastReviewed: "2026-04-30",
};

const tryptophanSleepReview = {
  label: "L-tryptophan and sleep: clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/22142813/",
  lastReviewed: "2026-04-30",
};

const citicolineCognitionReview = {
  label: "Citicoline (CDP-choline) cognitive review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26083946/",
  lastReviewed: "2026-04-30",
};

const alphaGpcReview = {
  label: "Alpha-GPC and cognitive performance: clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/14653104/",
  lastReviewed: "2026-04-30",
};

const tyrosineStressReview = {
  label: "L-tyrosine for cognition under stress: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26424423/",
  lastReviewed: "2026-04-30",
};

const bacopaMemoryMeta = {
  label: "Bacopa monnieri for memory: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/24252493/",
  lastReviewed: "2026-04-30",
};

const phosphatidylserineReview = {
  label: "Phosphatidylserine and age-related cognitive decline",
  url: "https://pubmed.ncbi.nlm.nih.gov/25933483/",
  lastReviewed: "2026-04-30",
};

const caffeineTheanineReview = {
  label: "Caffeine + L-theanine for attention",
  url: "https://pubmed.ncbi.nlm.nih.gov/18681988/",
  lastReviewed: "2026-04-30",
};

const coq10QSymbio = {
  label: "Q-SYMBIO trial: CoQ10 in heart failure",
  url: "https://pubmed.ncbi.nlm.nih.gov/25282031/",
  lastReviewed: "2026-04-30",
};

const coq10StatinMyopathy = {
  label: "CoQ10 for statin-induced myopathy: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/29959930/",
  lastReviewed: "2026-04-30",
};

const coq10MigraineReview = {
  label: "CoQ10 for migraine prevention",
  url: "https://pubmed.ncbi.nlm.nih.gov/28278578/",
  lastReviewed: "2026-04-30",
};

const msmReview = {
  label: "MSM for joint pain and inflammation: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/28814067/",
  lastReviewed: "2026-04-30",
};

const glucosamineCochrane = {
  label: "Glucosamine for osteoarthritis (Cochrane review)",
  url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002946.pub2",
  lastReviewed: "2026-04-30",
};

const chondroitinReview = {
  label: "Chondroitin sulfate for osteoarthritis: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/25719520/",
  lastReviewed: "2026-04-30",
};

const collagenJointsReview = {
  label: "Collagen peptides for joint health: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/30368550/",
  lastReviewed: "2026-04-30",
};

const ucii_collagen = {
  label: "Undenatured type II collagen for OA: RCT",
  url: "https://pubmed.ncbi.nlm.nih.gov/27852213/",
  lastReviewed: "2026-04-30",
};

const k2BoneCardio = {
  label: "Vitamin K2 (MK-7) for bone and arterial health",
  url: "https://pubmed.ncbi.nlm.nih.gov/25694037/",
  lastReviewed: "2026-04-30",
};

const curcuminOAReview = {
  label: "Curcumin for osteoarthritis: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/27592402/",
  lastReviewed: "2026-04-30",
};

const boswelliaReview = {
  label: "Boswellia serrata for OA: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/29768848/",
  lastReviewed: "2026-04-30",
};

const hyaluronicAcidOral = {
  label: "Oral hyaluronic acid for joint pain: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/28675917/",
  lastReviewed: "2026-04-30",
};

// Quick fill: foundational
const odsVitaminC = {
  label: "NIH ODS Vitamin C Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const odsZinc = {
  label: "NIH ODS Zinc Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const riboflavinMigraine = {
  label: "Riboflavin for migraine prophylaxis",
  url: "https://pubmed.ncbi.nlm.nih.gov/28012184/",
  lastReviewed: "2026-04-30",
};
const odsMVM = {
  label: "NIH ODS Multivitamin/Mineral Supplements",
  url: "https://ods.od.nih.gov/factsheets/MVMS-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const odsCalcium = {
  label: "NIH ODS Calcium Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

// Performance batch
const issnBetaAlanine = {
  label: "ISSN position stand: Beta-alanine",
  url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-015-0090-y",
  lastReviewed: "2026-04-30",
};
const citrullineReview = {
  label: "L-citrulline supplementation: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/30895562/",
  lastReviewed: "2026-04-30",
};
const beetrootMeta = {
  label: "Dietary nitrate / beetroot for endurance: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/28011054/",
  lastReviewed: "2026-04-30",
};
const taurineEnduranceReview = {
  label: "Taurine and exercise performance: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/29546641/",
  lastReviewed: "2026-04-30",
};
const sodiumBicarbReview = {
  label: "Sodium bicarbonate and high-intensity exercise",
  url: "https://pubmed.ncbi.nlm.nih.gov/33392941/",
  lastReviewed: "2026-04-30",
};
const electrolytesReview = {
  label: "Electrolyte and fluid balance during exercise (ACSM)",
  url: "https://journals.lww.com/acsm-msse/Fulltext/2007/02000/Exercise_and_Fluid_Replacement.22.aspx",
  lastReviewed: "2026-04-30",
};
const hmbReview = {
  label: "HMB for sarcopenia and untrained adults: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/27732836/",
  lastReviewed: "2026-04-30",
};

// Cardiometabolic
const berberineMeta = {
  label: "Berberine for type 2 diabetes: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/22582091/",
  lastReviewed: "2026-04-30",
};
const nacReview = {
  label: "N-acetylcysteine: clinical applications review",
  url: "https://pubmed.ncbi.nlm.nih.gov/23892359/",
  lastReviewed: "2026-04-30",
};
const alaNeuropathy = {
  label: "Alpha-lipoic acid for diabetic neuropathy: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/22581338/",
  lastReviewed: "2026-04-30",
};
const plantSterolsReview = {
  label: "Plant sterols and LDL cholesterol: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/24667752/",
  lastReviewed: "2026-04-30",
};
const garlicBPMeta = {
  label: "Garlic extract for blood pressure: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/27557471/",
  lastReviewed: "2026-04-30",
};
const niacinLipidsReview = {
  label: "Niacin for dyslipidemia: clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/28038681/",
  lastReviewed: "2026-04-30",
};
const redYeastRiceMeta = {
  label: "Red yeast rice for hypercholesterolemia: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/26471202/",
  lastReviewed: "2026-04-30",
};

// Mood / sleep depth
const fiveHtpReview = {
  label: "5-HTP for depressive symptoms: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/12076373/",
  lastReviewed: "2026-04-30",
};
const sameDepressionMeta = {
  label: "SAM-e for depression: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/27310632/",
  lastReviewed: "2026-04-30",
};
const valerianSleepReview = {
  label: "Valerian for insomnia: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/16517240/",
  lastReviewed: "2026-04-30",
};
const lavenderSilexanReview = {
  label: "Lavender oil (Silexan) for anxiety: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/30523752/",
  lastReviewed: "2026-04-30",
};
const tartCherrySleepReview = {
  label: "Tart cherry juice for sleep and recovery",
  url: "https://pubmed.ncbi.nlm.nih.gov/29065852/",
  lastReviewed: "2026-04-30",
};
const lemonBalmAnxietyReview = {
  label: "Melissa officinalis (lemon balm) for anxiety",
  url: "https://pubmed.ncbi.nlm.nih.gov/24973963/",
  lastReviewed: "2026-04-30",
};
const passionflowerReview = {
  label: "Passionflower for anxiety: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/21294203/",
  lastReviewed: "2026-04-30",
};
const kavaReview = {
  label: "Kava for anxiety: efficacy and hepatotoxicity",
  url: "https://pubmed.ncbi.nlm.nih.gov/12519415/",
  lastReviewed: "2026-04-30",
};

// Lesser-known deficiency markers
const odsCholine = {
  label: "NIH ODS Choline Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Choline-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const odsIodine = {
  label: "NIH ODS Iodine Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const odsSelenium = {
  label: "NIH ODS Selenium Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const odsCopper = {
  label: "NIH ODS Copper Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const boronReview = {
  label: "Boron in human nutrition: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26770156/",
  lastReviewed: "2026-04-30",
};
const odsVitaminA = {
  label: "NIH ODS Vitamin A Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const odsVitaminE = {
  label: "NIH ODS Vitamin E Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const folateOdsRef = {
  label: "NIH ODS Folate Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const b6OdsRef = {
  label: "NIH ODS Vitamin B6 Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const thiamineOdsRef = {
  label: "NIH ODS Thiamin Fact Sheet",
  url: "https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/",
  lastReviewed: "2026-04-30",
};

// Women's health
const myoInositolPCOS = {
  label: "Myo-inositol for PCOS: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/30396407/",
  lastReviewed: "2026-04-30",
};
const soyIsoflavonesMeno = {
  label: "Soy isoflavones for menopausal symptoms",
  url: "https://pubmed.ncbi.nlm.nih.gov/22972105/",
  lastReviewed: "2026-04-30",
};
const blackCohoshReview = {
  label: "Black cohosh for menopausal symptoms (Cochrane)",
  url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007244.pub2",
  lastReviewed: "2026-04-30",
};
const vitexPMSReview = {
  label: "Vitex agnus-castus for PMS: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/28237884/",
  lastReviewed: "2026-04-30",
};
const eveningPrimroseReview = {
  label: "Evening primrose oil: clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/23625461/",
  lastReviewed: "2026-04-30",
};

// Skin / hair
const odsBiotin = {
  label: "NIH ODS Biotin Fact Sheet (with lab interference warning)",
  url: "https://ods.od.nih.gov/factsheets/Biotin-HealthProfessional/",
  lastReviewed: "2026-04-30",
};
const siliconBoneHair = {
  label: "Silicon for bone, hair and nails: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/17435956/",
  lastReviewed: "2026-04-30",
};

// GI / microbiome
const lggReview = {
  label: "Lactobacillus rhamnosus GG: clinical evidence",
  url: "https://pubmed.ncbi.nlm.nih.gov/27475511/",
  lastReviewed: "2026-04-30",
};
const sBoulardiiReview = {
  label: "Saccharomyces boulardii: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/26365389/",
  lastReviewed: "2026-04-30",
};
const bInfantis35624 = {
  label: "Bifidobacterium infantis 35624 for IBS",
  url: "https://pubmed.ncbi.nlm.nih.gov/16863564/",
  lastReviewed: "2026-04-30",
};
const inulinPrebioticReview = {
  label: "Inulin and oligofructose: prebiotic effects",
  url: "https://pubmed.ncbi.nlm.nih.gov/28611480/",
  lastReviewed: "2026-04-30",
};
const phggIBSReview = {
  label: "Partially hydrolyzed guar gum for IBS",
  url: "https://pubmed.ncbi.nlm.nih.gov/26350216/",
  lastReviewed: "2026-04-30",
};
const peppermintIBSMeta = {
  label: "Enteric peppermint oil for IBS: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/30586318/",
  lastReviewed: "2026-04-30",
};
const gingerNauseaMeta = {
  label: "Ginger for nausea: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/24559597/",
  lastReviewed: "2026-04-30",
};
const dglGerd = {
  label: "Deglycyrrhizinated licorice for dyspepsia",
  url: "https://pubmed.ncbi.nlm.nih.gov/22844861/",
  lastReviewed: "2026-04-30",
};
const lGlutamineGutReview = {
  label: "L-glutamine and intestinal permeability: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/29207087/",
  lastReviewed: "2026-04-30",
};

// Adaptogens
const eleutheroReview = {
  label: "Eleutherococcus senticosus: clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/19500070/",
  lastReviewed: "2026-04-30",
};
const panaxGinsengReview = {
  label: "Panax ginseng for cognition and fatigue: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/20633566/",
  lastReviewed: "2026-04-30",
};
const schisandraReview = {
  label: "Schisandra chinensis: pharmacology review",
  url: "https://pubmed.ncbi.nlm.nih.gov/18515024/",
  lastReviewed: "2026-04-30",
};
const cordycepsReview = {
  label: "Cordyceps for exercise performance",
  url: "https://pubmed.ncbi.nlm.nih.gov/27408987/",
  lastReviewed: "2026-04-30",
};
const macaReview = {
  label: "Maca (Lepidium meyenii) clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/22321870/",
  lastReviewed: "2026-04-30",
};
const eurycomaReview = {
  label: "Eurycoma longifolia (Tongkat ali) RCT review",
  url: "https://pubmed.ncbi.nlm.nih.gov/23613825/",
  lastReviewed: "2026-04-30",
};
const cinnamonGlucose = {
  label: "Cinnamon for glycemic control: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/24019277/",
  lastReviewed: "2026-04-30",
};
const alcarCognitionReview = {
  label: "Acetyl-L-carnitine for mild cognitive impairment",
  url: "https://pubmed.ncbi.nlm.nih.gov/12707937/",
  lastReviewed: "2026-04-30",
};

// Algae
const spirulinaReview = {
  label: "Spirulina: clinical evidence review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26742306/",
  lastReviewed: "2026-04-30",
};
const chlorellaReview = {
  label: "Chlorella supplementation: systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/27725782/",
  lastReviewed: "2026-04-30",
};
const krillOilReview = {
  label: "Krill oil vs fish oil: bioavailability and clinical effects",
  url: "https://pubmed.ncbi.nlm.nih.gov/26515719/",
  lastReviewed: "2026-04-30",
};

// Mitochondrial / longevity
const nmnHumanTrial = {
  label: "Nicotinamide mononucleotide (NMN) human safety trial",
  url: "https://pubmed.ncbi.nlm.nih.gov/31685720/",
  lastReviewed: "2026-04-30",
};
const nrTrials = {
  label: "Nicotinamide riboside human trials review",
  url: "https://pubmed.ncbi.nlm.nih.gov/30130301/",
  lastReviewed: "2026-04-30",
};
const pqqReview = {
  label: "PQQ: human clinical evidence",
  url: "https://pubmed.ncbi.nlm.nih.gov/24231099/",
  lastReviewed: "2026-04-30",
};
const resveratrolReview = {
  label: "Resveratrol clinical trials review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26878547/",
  lastReviewed: "2026-04-30",
};
const pterostilbeneReview = {
  label: "Pterostilbene clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/29687026/",
  lastReviewed: "2026-04-30",
};
const spermidineReview = {
  label: "Spermidine and longevity markers",
  url: "https://pubmed.ncbi.nlm.nih.gov/30310015/",
  lastReviewed: "2026-04-30",
};

// Anti-inflammatory plants
const quercetinReview = {
  label: "Quercetin clinical effects review",
  url: "https://pubmed.ncbi.nlm.nih.gov/30068622/",
  lastReviewed: "2026-04-30",
};
const bromelainReview = {
  label: "Bromelain clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/27049862/",
  lastReviewed: "2026-04-30",
};
const pycnogenolReview = {
  label: "Pycnogenol systematic review",
  url: "https://pubmed.ncbi.nlm.nih.gov/22920611/",
  lastReviewed: "2026-04-30",
};
const oliveLeafExtractBP = {
  label: "Olive leaf extract for blood pressure",
  url: "https://pubmed.ncbi.nlm.nih.gov/28391985/",
  lastReviewed: "2026-04-30",
};

// Metabolic / glucose
const chromiumPicolinateMeta = {
  label: "Chromium picolinate for glucose markers: meta-analysis",
  url: "https://pubmed.ncbi.nlm.nih.gov/24635480/",
  lastReviewed: "2026-04-30",
};
const gymnemaReview = {
  label: "Gymnema sylvestre for glucose: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/25356719/",
  lastReviewed: "2026-04-30",
};
const fenugreekReview = {
  label: "Fenugreek clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/27931184/",
  lastReviewed: "2026-04-30",
};

// Hormonal
const dimEstrogenReview = {
  label: "DIM and estrogen metabolism: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26780666/",
  lastReviewed: "2026-04-30",
};
const sawPalmettoBPH = {
  label: "Saw palmetto for BPH (Cochrane)",
  url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001423.pub3",
  lastReviewed: "2026-04-30",
};
const tribulusReview = {
  label: "Tribulus terrestris testosterone claims: review",
  url: "https://pubmed.ncbi.nlm.nih.gov/27090107/",
  lastReviewed: "2026-04-30",
};

// Specialty fats / aminos
const mctOilReview = {
  label: "MCT oil clinical effects review",
  url: "https://pubmed.ncbi.nlm.nih.gov/26505634/",
  lastReviewed: "2026-04-30",
};
const lCarnitineReview = {
  label: "L-carnitine clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/29550613/",
  lastReviewed: "2026-04-30",
};

// Specific probiotic strains
const lPlantarum299v = {
  label: "L. plantarum 299v for IBS",
  url: "https://pubmed.ncbi.nlm.nih.gov/22591465/",
  lastReviewed: "2026-04-30",
};
const lReuteriOralHealth = {
  label: "L. reuteri DSM 17938 clinical evidence",
  url: "https://pubmed.ncbi.nlm.nih.gov/22579643/",
  lastReviewed: "2026-04-30",
};
const bLactisBB12 = {
  label: "B. lactis BB-12 clinical review",
  url: "https://pubmed.ncbi.nlm.nih.gov/24330654/",
  lastReviewed: "2026-04-30",
};

// Magnesium L-threonate
const magThreonateCog = {
  label: "Magnesium L-threonate for cognition: small RCT",
  url: "https://pubmed.ncbi.nlm.nih.gov/26519439/",
  lastReviewed: "2026-04-30",
};

// Bovine colostrum
const colostrumReview = {
  label: "Bovine colostrum for athletic gut barrier",
  url: "https://pubmed.ncbi.nlm.nih.gov/27384498/",
  lastReviewed: "2026-04-30",
};

export const supplementCatalog: SupplementRule[] = [
  {
    id: "vitamin_d3",
    slug: "vitamin-d3",
    name: "Vitamin D3",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Cholecalciferol potency is commonly mislabeled; prefer third-party verified potency.",
      formNotes: "D3 (cholecalciferol) preferred over D2 for most users.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["cholecalciferol"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition", "immune_support", "healthy_aging"],
    minScheduleFitScore: 10,
    baseScore: 35,
    doseGuidance: "Conservative daily dose, escalated only if labs or risk support it.",
    timingGuidance: "Take in the morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks or with follow-up labs.",
    rationale: [
      "Useful when labs, intake pattern, or low sun exposure suggest higher risk of inadequacy.",
      "Should not be framed as a universal prevention supplement.",
    ],
    evidence: [odsVitaminD],
    boostIf: [
      { questionId: "sun_exposure", includes: ["none_or_low"] },
      { questionId: "lab_vitamin_d_status", includes: ["known_low", "borderline_low"] },
      { questionId: "derived_vitamin_d_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "derived_vitamin_d_signal", includes: ["signal_strong"] },
        because:
          "vitamin D-relevant inputs converged in your answers (e.g. low sun exposure, frequent infections, eczema, diffuse hair shedding)",
        studiedFor: "vitamin D status correction in suspected inadequacy",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_vitamin_d_signal", includes: ["signal_moderate"] },
        because: "you reported one or more vitamin D-relevant signs alongside a supporting risk factor",
        studiedFor: "vitamin D adequacy in mild inadequacy",
        effectSize: "modest",
      },
    ],
    optionalIf: [
      { questionId: "sun_exposure", includes: ["moderate"] },
    ],
    excludeIf: [
      { questionId: "lab_vitamin_d_status", includes: ["high"] },
      { questionId: "existing_supplements", includes: ["supp_vitamin_d"] },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_history", includes: ["yes", "not_sure"] },
    ],
  },
  {
    id: "magnesium",
    slug: "magnesium",
    name: "Magnesium",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["heavy_metals", "identity_substitution"],
      formNotes: "Glycinate or citrate preferred; avoid oxide-only products for absorption.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["glycinate", "citrate"],
    evidenceTier: "tier_b",
    primaryGoals: ["sleep", "stress", "performance", "general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 38,
    doseGuidance: "Single evening dose in a better-absorbed form.",
    timingGuidance: "Take in the late afternoon or evening.",
    evaluationWindow: "Reassess after 2 to 6 weeks.",
    rationale: [
      "May fit low-intake patterns and certain sleep or cramp contexts.",
      "Evening placement supports the two-dose schedule well.",
    ],
    evidence: [odsMagnesium],
    goalRelevance: [
      {
        when: { questionId: "sleep_quality", includes: ["poor", "fair"] },
        because: "you reported poor or fair sleep quality",
        studiedFor: "sleep quality and onset latency in subclinical insomnia",
        effectSize: "modest",
      },
      {
        when: { questionId: "recovery_issue", includes: ["cramps"] },
        because: "you flagged exercise-related cramps",
        studiedFor: "muscle cramping in low-intake or athletic populations",
        effectSize: "modest",
      },
      {
        when: { questionId: "stress_load", includes: ["high"] },
        because: "you reported a high stress load",
        studiedFor: "stress and anxiety symptoms in low-intake populations",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_magnesium_signal", includes: ["signal_strong"] },
        because:
          "magnesium-relevant signs converged in your answers (e.g. muscle twitches or restless legs alongside high stress, poor sleep, or frequent migraines)",
        studiedFor: "magnesium repletion in suspected mild deficiency",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_magnesium_signal", includes: ["signal_moderate"] },
        because: "you reported a magnesium-relevant sign with at least one supporting risk factor",
        studiedFor: "magnesium adequacy in mild inadequacy",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "sleep_quality", includes: ["poor", "fair"] },
      { questionId: "recovery_issue", includes: ["cramps"] },
      { questionId: "stress_load", includes: ["high"] },
      { questionId: "derived_magnesium_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_history", includes: ["yes", "not_sure"] },
    ],
  },
  {
    id: "omega3",
    slug: "omega-3",
    name: "Omega-3 EPA/DHA",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified", "third_party_coa"],
      contaminantConcerns: ["heavy_metals", "oxidation_rancidity", "identity_substitution"],
      identityNotes: "Verify EPA/DHA content per serving and oxidation (TOTOX) levels.",
      formNotes: "Triglyceride or re-esterified triglyceride forms preferred over ethyl ester for absorption.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["fish oil triglyceride", "algal oil"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition", "healthy_aging", "immune_support"],
    minScheduleFitScore: 9,
    baseScore: 30,
    doseGuidance: "Single daily dose with a meal.",
    timingGuidance: "Take in the morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Best fit when seafood intake is low or when a narrow cardiometabolic context is relevant.",
      "Avoid overclaiming general wellness benefit.",
    ],
    evidence: [odsOmega3],
    goalRelevance: [
      {
        when: { questionId: "fish_intake", includes: ["rarely", "weekly"] },
        because: "you reported low or modest fish intake",
        studiedFor: "EPA/DHA adequacy in low-seafood diets",
        effectSize: "modest",
      },
      {
        when: { questionId: "lab_triglycerides_status", includes: ["high"] },
        because: "you flagged elevated triglycerides",
        studiedFor: "triglyceride reduction at higher doses",
        effectSize: "moderate",
      },
      {
        when: { questionId: "primary_goal", includes: ["healthy_aging"] },
        because: "you prioritized healthy aging",
        studiedFor: "cardiovascular and cognitive markers in older adults",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_omega3_signal", includes: ["signal_strong", "signal_moderate"] },
        because:
          "skin and hair signs that often respond to omega-3 (e.g. dry/scaly skin, eczema-like patches, dry brittle hair) appeared in your answers alongside low fish intake",
        studiedFor: "skin barrier and inflammatory skin markers",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "fish_intake", includes: ["rarely"] },
      { questionId: "lab_triglycerides_status", includes: ["high"] },
      { questionId: "derived_omega3_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    optionalIf: [
      { questionId: "fish_intake", includes: ["weekly"] },
    ],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "daily_aspirin_or_nsaid", includes: ["yes", "not_sure"] },
      { questionId: "known_allergies", includes: ["allergy_fish", "allergy_shellfish"] },
      { questionId: "existing_supplements", includes: ["supp_omega3"] },
    ],
    clinicianReviewIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "creatine_monohydrate",
    slug: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["nsf_certified_for_sport", "informed_sport", "informed_choice"],
      contaminantConcerns: ["heavy_metals", "adulteration"],
      formNotes: "Creapure-grade or equivalent creatine monohydrate preferred; avoid blends of unproven forms.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["monohydrate"],
    evidenceTier: "tier_a",
    primaryGoals: ["performance", "healthy_aging", "cognitive_performance", "cognitive_longevity"],
    minScheduleFitScore: 10,
    baseScore: 42,
    doseGuidance: "Single daily dose of creatine monohydrate.",
    timingGuidance: "Take in the morning or after training; use the morning window in v1.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "One of the more supportable performance supplements.",
      "Simple once-daily use fits the product adherence model.",
    ],
    evidence: [issnCreatine],
    includeIf: [
      { questionId: "primary_goal", includes: ["performance", "healthy_aging", "cognitive_performance", "cognitive_longevity"] },
    ],
    boostIf: [
      { questionId: "exercise_pattern", includes: ["strength_power", "mixed_training"] },
      { questionId: "recovery_issue", includes: ["poor_recovery", "muscle_soreness"] },
      { questionId: "age_band", includes: ["70_79", "80_plus"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["deep_focus_stamina", "memory_recall", "afternoon_dip"] },
        because: "you flagged focus stamina or memory recall",
        studiedFor: "cognitive performance under sleep deprivation and in older adults",
        effectSize: "modest",
      },
      {
        when: { questionId: "age_band", includes: ["70_79", "80_plus"] },
        because: "you're 70+, where creatine combined with resistance training has the strongest evidence for preserving lean mass and strength",
        studiedFor: "lean mass, strength, and functional outcomes in sarcopenia",
        effectSize: "moderate",
      },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_history", includes: ["yes", "not_sure"] },
    ],
  },
  {
    id: "iron",
    slug: "iron",
    name: "Iron",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["heavy_metals", "identity_substitution"],
      formNotes: "Bisglycinate generally better tolerated; ferrous sulfate cheapest with most evidence.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Iron should only be used with deficiency context; avoid casual affiliate promotion.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["ferrous bisglycinate", "ferrous sulfate"],
    evidenceTier: "tier_a",
    primaryGoals: ["energy", "general_nutrition"],
    minScheduleFitScore: 6,
    baseScore: 45,
    doseGuidance: "Recommend only when deficiency risk or supportive labs exist.",
    timingGuidance: "Use a separate morning dose and avoid pairing with calcium-heavy items.",
    evaluationWindow: "Reassess after 6 to 12 weeks or with follow-up labs.",
    rationale: [
      "Should never be recommended casually.",
      "Convenience must not override deficiency logic or absorption constraints.",
    ],
    evidence: [odsIron],
    // Iron must earn a boost from documented deficiency or a converged
    // body-sign signal — not bare sex/diet which are too non-specific to
    // justify supplementing without a ferritin test.
    boostIf: [
      { questionId: "lab_ferritin_status", includes: ["known_low", "borderline_low"] },
      { questionId: "derived_iron_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    includeIf: [
      { questionId: "primary_goal", includes: ["energy", "general_nutrition"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "derived_iron_signal", includes: ["signal_strong"] },
        because:
          "several iron-relevant signs (e.g. spoon nails, pale skin, diffuse hair shedding, cold extremities) converge with risk factors in your answers",
        studiedFor: "iron repletion in deficient or at-risk individuals",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_iron_signal", includes: ["signal_moderate"] },
        because:
          "you reported one or more iron-relevant signs alongside a supporting risk factor",
        studiedFor: "iron repletion in deficient or at-risk individuals",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_iron_signal", includes: ["signal_weak"] },
        because:
          "a single iron-suggestive sign — worth a ferritin test before supplementing",
        studiedFor: "iron status assessment",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "lab_ferritin_status", includes: ["high"] },
      { questionId: "existing_supplements", includes: ["supp_iron"] },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_history", includes: ["yes", "not_sure"] },
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
    ],
    sameWindowConflicts: ["protein_powder"],
  },
  {
    id: "vitamin_b12",
    slug: "vitamin-b12",
    name: "Vitamin B12",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Cyanocobalamin is well-evidenced and stable; methylcobalamin is acceptable.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["cyanocobalamin", "methylcobalamin"],
    evidenceTier: "tier_a",
    primaryGoals: ["energy", "general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 40,
    doseGuidance: "Single morning dose if diet pattern or labs justify it.",
    timingGuidance: "Take in the morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks or with follow-up labs.",
    rationale: [
      "Strong fit for vegan or low animal-product intake patterns.",
      "Easy to keep inside the morning pack.",
    ],
    evidence: [odsB12],
    goalRelevance: [
      {
        when: { questionId: "diet_pattern", includes: ["vegan", "vegetarian", "pescatarian"] },
        because: "you reported a plant-leaning or pescatarian diet",
        studiedFor: "B12 status in low animal-product diets",
        effectSize: "moderate",
      },
      {
        when: { questionId: "lab_b12_status", includes: ["known_low", "borderline_low"] },
        because: "you flagged low or borderline B12 labs",
        studiedFor: "correcting documented B12 inadequacy",
        effectSize: "moderate",
      },
      {
        when: { questionId: "energy_issue", includes: ["low_energy"] },
        because: "you reported low energy",
        studiedFor: "fatigue in suboptimal-B12 contexts",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_b12_signal", includes: ["signal_strong"] },
        because:
          "B12-relevant signs converged in your answers (e.g. sore or smooth tongue, pale skin, plant-leaning diet) — note: greying that runs in your family is not counted as a signal",
        studiedFor: "B12 status correction in suspected deficiency",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_b12_signal", includes: ["signal_moderate"] },
        because: "one B12-relevant body sign appeared with at least one supporting risk factor",
        studiedFor: "B12 status correction in suspected deficiency",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "diet_pattern", includes: ["vegan", "vegetarian"] },
      { questionId: "lab_b12_status", includes: ["known_low", "borderline_low"] },
      { questionId: "derived_b12_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    optionalIf: [
      { questionId: "diet_pattern", includes: ["pescatarian"] },
    ],
  },
  {
    id: "psyllium",
    slug: "psyllium-fiber",
    name: "Psyllium Fiber",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["pesticides", "heavy_metals", "microbial"],
      formNotes: "Plain psyllium husk preferred; avoid sugar-laden mixes.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["powder", "capsules"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support", "general_nutrition", "healthy_aging"],
    minScheduleFitScore: 8,
    baseScore: 32,
    doseGuidance: "Single daily dose with enough water.",
    timingGuidance: "Use in the evening unless medication timing makes that unsafe.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Useful for some constipation and overall fiber-gap contexts.",
      "Needs medication separation logic in implementation.",
    ],
    evidence: [psylliumConstipationMetaAnalysis],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["constipation"] },
        because: "you flagged constipation",
        studiedFor: "stool frequency and consistency in chronic constipation",
        effectSize: "moderate",
      },
      {
        when: { questionId: "diet_pattern", includes: ["low_carb_high_fat", "carnivore"] },
        because: "your diet pattern tends to be low in fiber",
        studiedFor: "fiber adequacy and bowel regularity",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_diet_quality_risk", includes: ["risk_high", "risk_moderate"] },
        because: "ultra-processed-heavy diets are typically fibre-poor — psyllium closes that gap directly",
        studiedFor: "fiber adequacy and bowel regularity",
        effectSize: "moderate",
      },
    ],
    boostIf: [
      { questionId: "gut_issue", includes: ["constipation"] },
      { questionId: "derived_diet_quality_risk", includes: ["risk_high"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["polypharmacy"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "protein_powder",
    slug: "protein-powder",
    name: "Protein Powder",
    category: "core_stack",
    qualityRequirements: {
      preferredCertifications: ["nsf_certified_for_sport", "informed_sport", "informed_choice"],
      contaminantConcerns: ["heavy_metals", "adulteration", "identity_substitution"],
      identityNotes: "Watch for protein-spiking with free amino acids; prefer brands publishing third-party assays.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["whey isolate", "blended plant protein"],
    evidenceTier: "tier_b",
    primaryGoals: ["performance", "general_nutrition", "healthy_aging"],
    minScheduleFitScore: 10,
    baseScore: 31,
    doseGuidance: "Use one serving when food protein intake appears insufficient.",
    timingGuidance: "Use in the morning or post-training; map to the morning window in v1.",
    evaluationWindow: "Reassess after 2 to 6 weeks.",
    rationale: [
      "Acts more like a protein adequacy helper than a classic supplement.",
      "Should not be stacked if diet likely already covers needs.",
    ],
    evidence: [issnProtein],
    boostIf: [
      { questionId: "exercise_pattern", includes: ["strength_power", "mixed_training", "endurance"] },
      { questionId: "diet_pattern", includes: ["vegan", "vegetarian"] },
      { questionId: "age_band", includes: ["70_79", "80_plus"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "age_band", includes: ["70_79", "80_plus"] },
        because: "you're 70+, where dietary protein requirements rise (~1.2 g/kg/day) and sarcopenia risk is high",
        studiedFor: "lean mass and strength preservation in older adults",
        effectSize: "moderate",
      },
    ],
    sameWindowConflicts: ["iron"],
  },
  {
    id: "probiotic",
    slug: "probiotic",
    name: "Probiotic",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
      identityNotes: "Strain-specific labeling (genus/species/strain) and verified CFU at end-of-shelf-life are required.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Generic probiotic recommendations are not evidence-based; promote only strain-specific products tied to a use case.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["strain-specific capsule"],
    evidenceTier: "tier_c",
    primaryGoals: ["gut_support", "immune_support"],
    minScheduleFitScore: 9,
    baseScore: 24,
    doseGuidance: "Use only for narrow strain-specific scenarios.",
    timingGuidance: "Take in the morning.",
    evaluationWindow: "Reassess after 2 to 8 weeks.",
    rationale: [
      "Should never be recommended as a generic catch-all.",
      "Reserve for narrow use cases such as post-antibiotic recovery.",
    ],
    evidence: [odsProbiotics],
    boostIf: [
      { questionId: "gut_issue", includes: ["post_antibiotic_recovery"] },
    ],
    optionalIf: [
      { questionId: "gut_issue", includes: ["bloating"] },
    ],
    clinicianReviewIf: [
      { questionId: "autoimmune_condition", includes: ["yes", "not_sure"] },
    ],
  },
  {
    id: "melatonin",
    slug: "melatonin",
    name: "Melatonin",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Melatonin products commonly mislabel actual content by large margins; USP Verified strongly preferred.",
      formNotes: "Low-dose (0.3–1 mg) immediate release preferred over high-dose gummies.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Melatonin is not appropriate as a chronic sleep aid; affiliate use must respect narrow indications.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["low-dose immediate release"],
    evidenceTier: "tier_b",
    primaryGoals: ["sleep"],
    minScheduleFitScore: 10,
    baseScore: 28,
    doseGuidance: "Use as a limited, lower-dose evening aid for narrow sleep-timing situations.",
    timingGuidance: "Evening only.",
    evaluationWindow: "Reassess after 1 to 2 weeks.",
    rationale: [
      "Should be framed conservatively and not as a blanket chronic insomnia solution.",
      "Fits only in the evening window.",
    ],
    evidence: [nccihMelatonin],
    includeIf: [
      { questionId: "primary_goal", includes: ["sleep"] },
    ],
    boostIf: [
      { questionId: "sleep_issue", includes: ["sleep_onset"] },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["60_69", "70_79", "80_plus"] },
    ],
  },
  {
    id: "reishi",
    slug: "reishi",
    name: "Reishi",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Verify fruiting body vs. mycelium-on-grain; require beta-glucan assay over generic 'polysaccharide' claims.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Traditional-use category with weaker modern evidence; only promote products with strong identity verification.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress", "immune_support", "sleep"],
    minScheduleFitScore: 8,
    baseScore: 12,
    doseGuidance: "Alternative-only suggestion, not part of the default core stack.",
    timingGuidance: "Evening or flexible timing if shown at all.",
    evaluationWindow: "Reassess cautiously after 2 to 4 weeks.",
    rationale: [
      "Traditional-use option with weaker modern human evidence.",
      "Should remain outside the default primary stack.",
    ],
    evidence: [reishiSafetyReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["stress", "immune_support", "sleep"] },
    ],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "autoimmune_condition", includes: ["yes", "not_sure"] },
    ],
  },
  {
    id: "ashwagandha",
    slug: "ashwagandha",
    name: "Ashwagandha",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Prefer standardized extracts (e.g. KSM-66, Sensoril) with verified withanolide content.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Hepatotoxicity and thyroid signals warrant cautious affiliate exposure with explicit warnings.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress", "sleep"],
    minScheduleFitScore: 8,
    baseScore: 16,
    doseGuidance: "Alternative-only suggestion with stronger safety caveats than the core stack.",
    timingGuidance: "Usually better suited to evening placement.",
    evaluationWindow: "Reassess cautiously after 2 to 8 weeks.",
    rationale: [
      "Keep outside the default core stack because evidence and safety certainty are weaker.",
    ],
    evidence: [nccihAshwagandha],
    optionalIf: [
      { questionId: "primary_goal", includes: ["stress", "sleep"] },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
      { questionId: "autoimmune_condition", includes: ["yes", "not_sure"] },
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "stress_load", includes: ["high"] },
        because: "you reported a high stress load",
        studiedFor: "perceived stress and cortisol in adults",
        effectSize: "moderate",
      },
      {
        when: { questionId: "sleep_issue", includes: ["sleep_onset", "non_restorative_sleep"] },
        because: "you flagged sleep-onset or non-restorative sleep",
        studiedFor: "subjective sleep quality in stressed adults",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "limited_safety_data"],
  },
  {
    id: "l_theanine",
    slug: "l-theanine",
    name: "L-Theanine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Suntheanine or comparably verified L-theanine preferred over generic 'theanine' blends.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["suntheanine", "standardized l-theanine"],
    evidenceTier: "tier_c",
    primaryGoals: ["stress", "sleep", "cognitive_performance"],
    minScheduleFitScore: 8,
    baseScore: 22,
    doseGuidance: "Modest daily dose, often used acutely for stress or before sleep wind-down.",
    timingGuidance: "Use in the late afternoon or evening for sleep contexts.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Small but real signal for acute stress reduction without sedation.",
      "Generally well tolerated, but not a treatment for clinical anxiety.",
    ],
    evidence: [lTheanineReview],
    goalRelevance: [
      {
        when: { questionId: "stress_load", includes: ["high", "moderate"] },
        because: "you reported elevated daily stress",
        studiedFor: "acute stress response and perceived calm",
        effectSize: "modest",
      },
      {
        when: { questionId: "sleep_issue", includes: ["sleep_onset"] },
        because: "you flagged trouble falling asleep",
        studiedFor: "subjective relaxation before sleep",
        effectSize: "modest",
      },
      {
        when: { questionId: "energy_issue", includes: ["poor_focus"] },
        because: "you reported poor focus",
        studiedFor: "attention quality when paired with caffeine",
        effectSize: "modest",
      },
      {
        when: { questionId: "cognitive_bottleneck", includes: ["stress_induced_fog", "context_switching"] },
        because: "you flagged stress-induced fog or task-switching trouble",
        studiedFor: "calmer attention and working memory under load",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "glycine",
    slug: "glycine",
    name: "Glycine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Pharmaceutical-grade glycine; avoid blends adding undisclosed amino acids.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["powder"],
    evidenceTier: "tier_c",
    primaryGoals: ["sleep"],
    minScheduleFitScore: 9,
    baseScore: 21,
    doseGuidance: "Single dose of glycine before bed in small clinical trials.",
    timingGuidance: "About an hour before bed.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Small trials show subjective sleep quality and next-day fatigue improvement.",
      "Cheap and well tolerated; signal is real but limited.",
    ],
    evidence: [glycineSleepStudy],
    goalRelevance: [
      {
        when: { questionId: "sleep_issue", includes: ["non_restorative_sleep"] },
        because: "you reported non-restorative sleep",
        studiedFor: "perceived sleep quality and next-day fatigue",
        effectSize: "modest",
      },
      {
        when: { questionId: "sleep_quality", includes: ["poor", "fair"] },
        because: "you reported poor or fair sleep quality",
        studiedFor: "subjective sleep quality in subclinical insomnia",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "apigenin",
    slug: "apigenin",
    name: "Apigenin",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Plant flavonoid; verify purity and source plant on COA.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Limited human trial data; promote only with explicit caveats.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["isolated apigenin"],
    evidenceTier: "tier_d",
    primaryGoals: ["sleep", "stress"],
    minScheduleFitScore: 8,
    baseScore: 14,
    doseGuidance: "Modest evening dose; human trial data is sparse.",
    timingGuidance: "Evening only.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Mechanistic and chamomile-extract evidence is interesting but human RCTs are limited.",
      "Treat as an experimental option, not a core sleep intervention.",
    ],
    evidence: [apigeninReview],
    goalRelevance: [
      {
        when: { questionId: "sleep_issue", includes: ["sleep_onset"] },
        because: "you flagged trouble falling asleep",
        studiedFor: "GABAergic relaxation pathways (mostly preclinical)",
        effectSize: "mixed",
      },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "limited_safety_data", "needs_self_experiment"],
  },
  {
    id: "l_tryptophan",
    slug: "l-tryptophan",
    name: "L-Tryptophan",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Historic EMS contamination case underlines the importance of verified-purity sourcing.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Interaction risk with serotonergic medications must be highlighted.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["pharmaceutical-grade l-tryptophan"],
    evidenceTier: "tier_c",
    primaryGoals: ["sleep"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "Modest evening dose; not a high-dose intervention.",
    timingGuidance: "Evening only, away from protein-heavy meals.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Older RCTs suggest reduced sleep latency in subclinical insomnia.",
      "Avoid stacking with SSRIs, MAOIs, or other serotonergic agents.",
    ],
    evidence: [tryptophanSleepReview],
    goalRelevance: [
      {
        when: { questionId: "sleep_issue", includes: ["sleep_onset"] },
        because: "you flagged sleep-onset trouble",
        studiedFor: "sleep latency in subclinical insomnia",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "medication_profile", includes: ["polypharmacy"] },
      { questionId: "ssri_or_serotonergic_use", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["limited_safety_data", "smaller_effect_size"],
  },
  {
    id: "holy_basil",
    slug: "holy-basil",
    name: "Holy Basil (Tulsi)",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "pesticides", "identity_substitution"],
      identityNotes: "Verify Ocimum sanctum (Tulsi) species and standardized extract.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Traditional-use category; include explicit safety and pregnancy warnings.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized leaf extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress"],
    minScheduleFitScore: 8,
    baseScore: 14,
    doseGuidance: "Standardized extract dose; limited modern RCT data.",
    timingGuidance: "Evening or flexible if shown at all.",
    evaluationWindow: "Reassess cautiously after 4 to 8 weeks.",
    rationale: [
      "Long Ayurvedic use for stress; small clinical trials suggest benefit on perceived stress.",
      "Modern evidence is preliminary; not a substitute for proven stress management.",
    ],
    evidence: [holyBasilReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["stress"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "stress_load", includes: ["high", "moderate"] },
        because: "you reported elevated stress",
        studiedFor: "perceived stress in small clinical trials",
        effectSize: "mixed",
      },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "limited_safety_data"],
  },
  {
    id: "lions_mane",
    slug: "lions-mane",
    name: "Lion's Mane",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Prefer verified fruiting body with beta-glucan assay over mycelium-on-grain.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Identity adulteration is widespread; only promote products with strong third-party identity verification.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["fruiting body extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["cognitive_performance", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "Daily dose of fruiting body extract.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small human trials suggest possible cognitive support in older adults; broader claims outrun the evidence.",
      "Long history of culinary and traditional medicinal use.",
    ],
    evidence: [lionsManeReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["cognitive_performance", "cognitive_longevity"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["memory_recall", "deep_focus_stamina"] },
        because: "you flagged slower recall or focus stamina",
        studiedFor: "subjective cognitive function in adults",
        effectSize: "mixed",
      },
      {
        when: { questionId: "energy_issue", includes: ["poor_focus", "low_motivation"] },
        because: "you flagged focus or motivation issues",
        studiedFor: "subjective cognitive function in older adults",
        effectSize: "mixed",
      },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "needs_self_experiment"],
  },
  {
    id: "rhodiola",
    slug: "rhodiola",
    name: "Rhodiola Rosea",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Verify Rhodiola rosea species and rosavin/salidroside standardization; commercial adulteration is common.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Traditional adaptogen with mixed evidence; require strong identity verification.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized extract (rosavin/salidroside)"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress", "energy", "cognitive_performance"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "Standardized extract once daily in the morning.",
    timingGuidance: "Morning only; evening dosing can disturb sleep.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Small RCTs suggest reduced fatigue and stress symptoms; quality is uneven.",
      "Adaptogen category is broad and inconsistently evidenced.",
      "Serotonergic activity is weaker than 5-HTP, SAM-e, saffron, or St. John's Wort, so this engine routes serotonergic-medication users to clinician review rather than hard-excluding — a clinician with the user's full medication picture is the right venue. If we're wrong on that bar, we'll tighten it; PRs welcome.",
    ],
    evidence: [rhodiolaReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["stress", "energy", "cognitive_performance"] },
    ],
    clinicianReviewIf: [
      { questionId: "ssri_or_serotonergic_use", includes: ["yes", "not_sure"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "energy_issue", includes: ["low_energy", "low_motivation"] },
        because: "you flagged low energy or motivation",
        studiedFor: "stress-related fatigue in small RCTs",
        effectSize: "mixed",
      },
      {
        when: { questionId: "stress_load", includes: ["high"] },
        because: "you reported a high stress load",
        studiedFor: "perceived stress in small RCTs",
        effectSize: "mixed",
      },
      {
        when: { questionId: "cognitive_bottleneck", includes: ["afternoon_dip", "stress_induced_fog", "deep_focus_stamina"] },
        because: "you flagged afternoon fade or stress-related fog",
        studiedFor: "mental fatigue under prolonged cognitive load",
        effectSize: "mixed",
      },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "needs_self_experiment"],
  },
  {
    id: "saffron",
    slug: "saffron",
    name: "Saffron Extract",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Saffron is among the most commonly adulterated botanicals; require lab-verified identity (e.g. affron, Satiereal).",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Promising mood evidence but botanical adulteration is widespread.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized stigma extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["stress", "sleep"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "Standardized stigma extract once daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 6 to 8 weeks.",
    rationale: [
      "Multiple small RCTs and meta-analyses show benefit for mild-to-moderate depressive symptoms.",
      "Not a substitute for clinical depression treatment.",
    ],
    evidence: [saffronDepressionMeta],
    optionalIf: [
      { questionId: "primary_goal", includes: ["stress"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "stress_load", includes: ["high", "moderate"] },
        because: "you reported elevated stress",
        studiedFor: "mild-to-moderate depressive symptoms",
        effectSize: "promising",
      },
      {
        when: { questionId: "sleep_quality", includes: ["poor", "fair"] },
        because: "you reported poor or fair sleep quality",
        studiedFor: "sleep quality alongside mood in small RCTs",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "ssri_or_serotonergic_use", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["narrower_indication", "needs_self_experiment"],
  },
  {
    id: "citicoline",
    slug: "citicoline",
    name: "Citicoline (CDP-choline)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Cognizin or comparably verified citicoline preferred over generic 'CDP-choline' blends.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["cognizin", "standardized citicoline"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 24,
    doseGuidance: "Single morning dose; trials commonly use 250–500 mg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Strongest evidence among the cholinergic supplements for attention and processing speed.",
      "Better tolerated than alpha-GPC for many users; modest but reproducible effects.",
    ],
    evidence: [citicolineCognitionReview],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["deep_focus_stamina", "memory_recall", "afternoon_dip"] },
        because: "you flagged focus stamina, recall, or afternoon fade",
        studiedFor: "attention and processing speed in adults",
        effectSize: "modest",
      },
      {
        when: { questionId: "primary_goal", includes: ["cognitive_longevity"] },
        because: "you prioritized long-term brain health",
        studiedFor: "cognitive function in mild cognitive complaints",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "alpha_gpc",
    slug: "alpha-gpc",
    name: "Alpha-GPC",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      formNotes: "Verify glycerophosphocholine purity; cheap blends often under-dose.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Emerging signal of cardiovascular risk at high chronic doses; recommend with restraint.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["alpha-gpc"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "performance"],
    minScheduleFitScore: 9,
    baseScore: 20,
    doseGuidance: "Acute or daily dose; small trials use 300–600 mg.",
    timingGuidance: "Morning, or pre-cognitive-demand session.",
    evaluationWindow: "Reassess after 2 to 4 weeks for acute use.",
    rationale: [
      "Faster-acting cholinergic with athletic crossover (power output).",
      "Use cautiously long-term; observational data raise stroke-risk questions.",
    ],
    evidence: [alphaGpcReview],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["deep_focus_stamina", "morning_startup"] },
        because: "you flagged focus stamina or slow morning startup",
        studiedFor: "acute attention and reaction time",
        effectSize: "mixed",
      },
    ],
    whyNotPrimary: ["limited_safety_data", "needs_self_experiment"],
  },
  {
    id: "l_tyrosine",
    slug: "l-tyrosine",
    name: "L-Tyrosine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Plain L-tyrosine; N-acetyl-L-tyrosine has weaker bioavailability evidence.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l-tyrosine"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "stress"],
    minScheduleFitScore: 9,
    baseScore: 20,
    doseGuidance: "Acute use under cognitive stress; trials use 100–150 mg/kg.",
    timingGuidance: "Morning or 30–60 minutes before a high-demand task.",
    evaluationWindow: "Use as needed; not daily.",
    rationale: [
      "Real signal for cognition under acute stress, sleep loss, or cold; not a chronic supplement.",
      "Less useful in well-rested, low-stress conditions.",
    ],
    evidence: [tyrosineStressReview],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["stress_induced_fog", "deep_focus_stamina"] },
        because: "you flagged stress-induced fog or focus fatigue",
        studiedFor: "cognition under acute stress and sleep deprivation",
        effectSize: "moderate",
      },
      {
        when: { questionId: "sleep_quality", includes: ["poor"] },
        because: "you reported poor sleep, which raises the value of acute cognitive support",
        studiedFor: "preserving working memory under sleep loss",
        effectSize: "moderate",
      },
    ],
    excludeIf: [
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["narrower_indication", "needs_self_experiment"],
  },
  {
    id: "bacopa",
    slug: "bacopa",
    name: "Bacopa Monnieri",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Standardized to bacosides (e.g. 50% bacosides, or KeenMind/CDRI 08).",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized bacopa extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "Daily standardized extract (typically 300 mg); takes 8–12 weeks.",
    timingGuidance: "Evening with food; some users get GI upset on empty stomach.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Among the better-evidenced botanicals for memory consolidation in adults.",
      "Slow-onset; not useful as an acute focus tool.",
    ],
    evidence: [bacopaMemoryMeta],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["memory_recall", "context_switching"] },
        because: "you flagged slower recall or trouble holding details",
        studiedFor: "memory consolidation and information retention",
        effectSize: "moderate",
      },
      {
        when: { questionId: "primary_goal", includes: ["cognitive_longevity"] },
        because: "you prioritized long-term brain health",
        studiedFor: "memory in healthy adults across age groups",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "phosphatidylserine",
    slug: "phosphatidylserine",
    name: "Phosphatidylserine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Soy-derived or sunflower-derived PS; verify content per serving.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["phosphatidylserine"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_longevity", "cognitive_performance"],
    minScheduleFitScore: 9,
    baseScore: 20,
    doseGuidance: "Daily dose of 100–300 mg; older trials used soy-derived PS.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Older RCTs show benefit for age-related memory complaints.",
      "Less useful in healthy young adults than the marketing suggests.",
    ],
    evidence: [phosphatidylserineReview],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["memory_recall"] },
        because: "you flagged slower memory and recall",
        studiedFor: "age-related memory complaints",
        effectSize: "modest",
      },
      {
        when: { questionId: "age_band", includes: ["45_59", "60_69", "70_79", "80_plus"] },
        because: "the strongest evidence is in adults 45+",
        studiedFor: "subjective cognitive decline",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["narrower_indication", "smaller_effect_size"],
  },
  {
    id: "caffeine_theanine",
    slug: "caffeine-l-theanine",
    name: "Caffeine + L-Theanine (baseline pairing)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Most users get this from coffee + standalone L-theanine. Pre-blended capsules are convenience, not necessity.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Frame as a baseline pairing before adding nootropic supplements; not a supplement per se.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["coffee + suntheanine", "100 mg caffeine + 200 mg l-theanine"],
    evidenceTier: "tier_b",
    primaryGoals: ["cognitive_performance"],
    minScheduleFitScore: 10,
    baseScore: 26,
    doseGuidance: "About 1:2 caffeine to L-theanine (e.g. 100 mg caffeine + 200 mg L-theanine).",
    timingGuidance: "Morning only; cut caffeine 8–10 hours before bed.",
    evaluationWindow: "Reassess after 1 to 2 weeks.",
    rationale: [
      "Among the better-evidenced cognitive pairings: caffeine for activation, L-theanine to soften jitter.",
      "If you don't already have caffeine timing dialed in, fix that before adding nootropics.",
    ],
    evidence: [caffeineTheanineReview, lTheanineReview],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["morning_startup", "deep_focus_stamina", "afternoon_dip"] },
        because: "you flagged morning startup or focus stamina",
        studiedFor: "attention, accuracy, and perceived alertness",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["needs_self_experiment"],
  },
  {
    id: "coq10",
    slug: "coq10",
    name: "CoQ10 (Ubiquinol)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution", "oxidation_rancidity"],
      identityNotes: "Verify form (ubiquinol vs ubiquinone) and dose per softgel; cheap products often under-dose.",
      formNotes: "Ubiquinol preferred for adults 50+ for absorption; ubiquinone is fine and cheaper for most.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["ubiquinol", "ubiquinone with fat-containing meal"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 26,
    doseGuidance: "100–200 mg daily with a fat-containing meal.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Strongest signals are in narrow contexts: statin-related muscle complaints, migraine prevention, and heart failure.",
      "General energy claims in healthy adults are weak; we keep this conditional, not core.",
    ],
    evidence: [coq10StatinMyopathy, coq10MigraineReview, coq10QSymbio],
    goalRelevance: [
      {
        when: { questionId: "statin_use", includes: ["yes"] },
        because: "you reported current statin use",
        studiedFor: "statin-induced muscle pain (mixed but real signal)",
        effectSize: "modest",
      },
      {
        when: { questionId: "migraine_pattern", includes: ["occasional_migraine", "frequent_migraine"] },
        because: "you reported a migraine pattern",
        studiedFor: "migraine frequency and intensity in prevention trials",
        effectSize: "moderate",
      },
      {
        when: { questionId: "age_band", includes: ["60_69", "70_79", "80_plus"] },
        because: "you're in an age range where endogenous CoQ10 declines materially",
        studiedFor: "cardiovascular and cognitive function in older adults",
        effectSize: "modest",
      },
    ],
    clinicianReviewIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication", "smaller_effect_size"],
  },
  {
    id: "msm",
    slug: "msm",
    name: "MSM (Methylsulfonylmethane)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution", "heavy_metals"],
      identityNotes: "OptiMSM is the most common verified-purity grade.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["optimsm", "msm crystals"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility", "performance"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "1.5–3 g daily, often split between morning and evening.",
    timingGuidance: "Morning with food; can be split if GI tolerance is an issue.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small RCT signal for osteoarthritis pain and exercise-related joint discomfort.",
      "Effect sizes are modest; works best stacked with other joint-support items.",
    ],
    evidence: [msmReview],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["morning_stiffness", "post_exercise_stiffness", "persistent_joint_pain"] },
        because: "you flagged joint stiffness or discomfort",
        studiedFor: "joint pain and post-exercise soreness",
        effectSize: "modest",
      },
      {
        when: { questionId: "primary_goal", includes: ["joint_mobility"] },
        because: "you prioritized joint mobility",
        studiedFor: "osteoarthritis symptoms in small trials",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "glucosamine",
    slug: "glucosamine",
    name: "Glucosamine Sulfate",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Crystalline glucosamine sulfate (CGS) preferred over hydrochloride for OA evidence.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["glucosamine sulfate"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "1500 mg daily (commonly as a single morning dose).",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Mixed evidence overall; strongest signal in moderate knee OA with crystalline glucosamine sulfate.",
      "Often paired with chondroitin in trials.",
    ],
    evidence: [glucosamineCochrane],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["morning_stiffness", "persistent_joint_pain"] },
        because: "you flagged morning stiffness or persistent joint pain",
        studiedFor: "knee OA pain and function",
        effectSize: "mixed",
      },
    ],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "chondroitin",
    slug: "chondroitin",
    name: "Chondroitin Sulfate",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Chondroitin is among the more commonly adulterated supplements; require lab-verified purity.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["bovine or marine chondroitin sulfate"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 20,
    doseGuidance: "800–1200 mg daily, often paired with glucosamine.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Modest effect on OA pain in meta-analyses; effect sizes vary widely by product quality.",
      "Best evidence is for combination with glucosamine.",
    ],
    evidence: [chondroitinReview],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["persistent_joint_pain", "morning_stiffness"] },
        because: "you flagged persistent joint pain or stiffness",
        studiedFor: "OA pain in combination with glucosamine",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "overlap_with_primary"],
  },
  {
    id: "collagen_peptides",
    slug: "collagen-peptides",
    name: "Collagen Peptides",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["nsf_certified_for_sport", "informed_sport", "third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution"],
      identityNotes: "Bovine, marine, or chicken-derived; verify hydrolyzed collagen content per serving.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["hydrolyzed collagen peptides"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility", "performance", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "10–15 g daily; sometimes paired with vitamin C for synthesis support.",
    timingGuidance: "Morning, or 30–60 minutes before exercise for tendon-loading benefit.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Real signal for joint discomfort in athletes and modest effect on OA symptoms.",
      "Skin and nail benefits are smaller than the marketing implies.",
    ],
    evidence: [collagenJointsReview, ucii_collagen],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["post_exercise_stiffness", "persistent_joint_pain"] },
        because: "you flagged exercise-related stiffness or joint pain",
        studiedFor: "exercise-associated joint discomfort and tendon health",
        effectSize: "modest",
      },
      {
        when: { questionId: "primary_goal", includes: ["joint_mobility"] },
        because: "you prioritized joint mobility",
        studiedFor: "joint pain and function in athletes",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "vitamin_k2_mk7",
    slug: "vitamin-k2-mk7",
    name: "Vitamin K2 (MK-7)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "MK-7 form preferred over MK-4 for half-life; verify menaquinone content.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Significant interaction with warfarin; affiliate exposure must include clear warning.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["mk-7 (menaquinone-7)"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging", "joint_mobility", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "90–180 mcg daily of MK-7.",
    timingGuidance: "Morning with a fat-containing meal.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Helps direct calcium toward bone and away from arteries; sensible companion when supplementing higher-dose vitamin D.",
      "Strong interaction with warfarin and other vitamin-K-antagonist anticoagulants.",
    ],
    evidence: [k2BoneCardio],
    goalRelevance: [
      {
        when: { questionId: "lab_vitamin_d_status", includes: ["known_low", "borderline_low"] },
        because: "you reported supplementing or being low on vitamin D",
        studiedFor: "calcium routing to bone alongside vitamin D supplementation",
        effectSize: "modest",
      },
      {
        when: { questionId: "age_band", includes: ["45_59", "60_69", "70_79", "80_plus"] },
        because: "the bone and arterial endpoints are most studied in adults 45+",
        studiedFor: "bone density and arterial calcification markers",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes"] },
    ],
    clinicianReviewIf: [
      { questionId: "blood_thinner_use", includes: ["not_sure"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },
  {
    id: "curcumin",
    slug: "curcumin",
    name: "Curcumin (Turmeric Extract)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Plain turmeric powder is poorly absorbed; require standardized extracts (Meriva, Theracurmin, BCM-95, or piperine-paired).",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Hepatotoxicity case reports with high-bioavailability extracts; affiliate use should include caveats.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["meriva", "theracurmin", "bcm-95", "curcumin + piperine"],
    evidenceTier: "tier_b",
    primaryGoals: ["joint_mobility", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 24,
    doseGuidance: "Standardized extract dose; e.g. 500 mg curcuminoid equivalent twice daily.",
    timingGuidance: "Morning with food; second dose can move to evening if GI permits.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Decent meta-analytic signal for OA pain; comparable in some trials to NSAIDs at lower side-effect cost.",
      "Bioavailability dominates the result; plain turmeric is largely useless at typical doses.",
    ],
    evidence: [curcuminOAReview],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["morning_stiffness", "post_exercise_stiffness", "persistent_joint_pain"] },
        because: "you flagged joint stiffness or pain",
        studiedFor: "OA pain and inflammatory joint discomfort",
        effectSize: "moderate",
      },
    ],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["limited_safety_data", "needs_self_experiment"],
  },
  {
    id: "boswellia",
    slug: "boswellia",
    name: "Boswellia Serrata",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Standardized to AKBA (acetyl-11-keto-β-boswellic acid); 5-Loxin and ApresFlex are common verified extracts.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Traditional medicine category with growing modern evidence; promote only standardized extracts.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["5-loxin", "apresflex", "akba-standardized boswellia"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "100–250 mg standardized extract daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Long traditional use plus a growing body of small RCTs in knee OA.",
      "Effect comes through 5-LOX inhibition; cleaner GI profile than NSAIDs in studies.",
    ],
    evidence: [boswelliaReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["joint_mobility"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["persistent_joint_pain", "morning_stiffness"] },
        because: "you flagged persistent joint pain or morning stiffness",
        studiedFor: "knee OA pain and function in small RCTs",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "needs_self_experiment"],
  },
  {
    id: "hyaluronic_acid_oral",
    slug: "hyaluronic-acid",
    name: "Hyaluronic Acid (oral)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Look for verified molecular weight; very low molecular weight forms may behave differently.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["sodium hyaluronate"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "80–200 mg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small trials show modest joint discomfort improvement; the injectable form is much better evidenced.",
      "Skin claims are weaker than marketed.",
    ],
    evidence: [hyaluronicAcidOral],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["persistent_joint_pain", "post_exercise_stiffness"] },
        because: "you flagged joint pain or post-exercise stiffness",
        studiedFor: "knee discomfort in small oral-HA trials",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },

  // ----- Quick-fill foundational -----
  {
    id: "vitamin_c",
    slug: "vitamin-c",
    name: "Vitamin C",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Plain ascorbic acid is fine; buffered or liposomal forms help if you get GI upset at higher doses.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["ascorbic acid", "buffered ascorbate"],
    evidenceTier: "tier_b",
    primaryGoals: ["immune_support", "general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 24,
    doseGuidance: "200–500 mg daily; higher doses don't proportionally help and can cause GI upset.",
    timingGuidance: "Morning with food; pair with iron supplementation for absorption.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Real but modest signal for cold duration when started early; little benefit if started after symptoms peak.",
      "Useful pairing with iron supplementation; otherwise diet usually covers it.",
    ],
    evidence: [odsVitaminC],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["immune_support"] },
        because: "you prioritized immune support",
        studiedFor: "cold duration when started at first symptoms",
        effectSize: "modest",
      },
      {
        when: { questionId: "lab_ferritin_status", includes: ["known_low", "borderline_low"] },
        because: "you flagged low iron / ferritin",
        studiedFor: "non-heme iron absorption",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_vitamin_c_signal", includes: ["signal_strong"] },
        because:
          "vitamin C-relevant signs (e.g. bleeding gums, easy bruising, slow healing) converged in your answers — non-nutritional causes are also worth ruling out",
        studiedFor: "vitamin C status correction in suspected inadequacy",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_vitamin_c_signal", includes: ["signal_moderate"] },
        because: "you reported one or more vitamin C-relevant signs",
        studiedFor: "vitamin C status in mild inadequacy",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "derived_vitamin_c_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_stones", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "zinc",
    slug: "zinc",
    name: "Zinc",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Zinc bisglycinate or picolinate are well-absorbed; avoid long-term zinc oxide and watch for copper depletion above ~25 mg/day.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["zinc bisglycinate", "zinc picolinate"],
    evidenceTier: "tier_b",
    primaryGoals: ["immune_support", "general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 26,
    doseGuidance: "10–15 mg daily for adequacy; up to 30 mg short-term during a cold. Long-term high doses deplete copper.",
    timingGuidance: "Evening with food; takes the edge off mild GI upset.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Cold duration evidence when started early (lozenge form, first 24 hours).",
      "Vegan/vegetarian diets and high-phytate intake raise the case for it.",
    ],
    evidence: [odsZinc],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["immune_support"] },
        because: "you prioritized immune support",
        studiedFor: "cold duration when started in the first 24 hours",
        effectSize: "moderate",
      },
      {
        when: { questionId: "diet_pattern", includes: ["vegan", "vegetarian"] },
        because: "your diet pattern raises the risk of suboptimal zinc",
        studiedFor: "zinc adequacy in plant-leaning diets",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_zinc_signal", includes: ["signal_strong"] },
        because:
          "several zinc-relevant signs converged in your answers (e.g. taste/smell changes, slow healing, white nail spots, frequent infections)",
        studiedFor: "zinc status correction in suspected inadequacy",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_zinc_signal", includes: ["signal_moderate"] },
        because: "you reported a zinc-relevant sign with at least one supporting risk factor",
        studiedFor: "zinc adequacy in suspected mild inadequacy",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "derived_zinc_signal", includes: ["signal_strong", "signal_moderate"] },
    ],
    excludeIf: [
      { questionId: "existing_supplements", includes: ["supp_zinc"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "riboflavin",
    slug: "riboflavin-b2",
    name: "Riboflavin (Vitamin B2)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Plain riboflavin (or R5P) at 400 mg/day is the classic migraine-prevention dose.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["riboflavin", "riboflavin-5-phosphate"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 24,
    doseGuidance: "400 mg daily for migraine prevention; far lower (1–2 mg) for general adequacy.",
    timingGuidance: "Morning with food; expect bright-yellow urine — that's harmless.",
    evaluationWindow: "Reassess after 12 weeks for migraine endpoints.",
    rationale: [
      "One of the better-evidenced single-supplement migraine prevention tools; cheap and very safe.",
      "General-population deficiency is rare in well-fed adults.",
    ],
    evidence: [riboflavinMigraine],
    goalRelevance: [
      {
        when: { questionId: "migraine_pattern", includes: ["occasional_migraine", "frequent_migraine"] },
        because: "you reported a migraine pattern",
        studiedFor: "migraine frequency in prophylaxis trials",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_b_complex_signal", includes: ["signal_strong"] },
        because:
          "B-vitamin-relevant signs converged in your answers (e.g. cracks at the corners of the mouth, low fish or dairy intake) — riboflavin is one component; a B-complex may be a better starting point",
        studiedFor: "B2/B6 status in suspected mild inadequacy",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "derived_b_complex_signal", includes: ["signal_strong"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "multivitamin",
    slug: "multivitamin",
    name: "Multivitamin / Mineral",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "nsf_certified"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      formNotes: "Look for forms that don't exceed the upper limit on any single nutrient (especially iron, vitamin A, B6).",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["complete multivitamin/mineral"],
    evidenceTier: "tier_c",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "One serving daily of a balanced product without mega-doses.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Most adults eating a varied diet don't need one.",
      "Reasonable for restrictive diets, older adults, or as a low-stakes baseline if individual gaps are unclear.",
    ],
    evidence: [odsMVM],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["general_nutrition"] },
        because: "you prioritized general nutritional coverage",
        studiedFor: "filling marginal intake gaps in mixed diets",
        effectSize: "modest",
      },
      {
        when: { questionId: "diet_pattern", includes: ["vegan", "vegetarian", "carnivore", "low_carb_high_fat"] },
        because: "your diet pattern often misses specific micronutrients",
        studiedFor: "micronutrient coverage in restrictive diets",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_b_complex_signal", includes: ["signal_strong"] },
        because:
          "B-vitamin-relevant signs converged in your answers — a balanced multi is one low-stakes way to broaden coverage while a clinician investigates",
        studiedFor: "B-vitamin coverage in suspected mild inadequacy",
        effectSize: "modest",
      },
      {
        when: { questionId: "derived_diet_quality_risk", includes: ["risk_high", "risk_moderate"] },
        because:
          "ultra-processed foods displace micronutrient-dense whole foods — a balanced multi is a low-stakes hedge while diet quality improves",
        studiedFor: "micronutrient adequacy in nutrient-sparse diet patterns",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "derived_b_complex_signal", includes: ["signal_strong"] },
      { questionId: "derived_diet_quality_risk", includes: ["risk_high"] },
    ],
    excludeIf: [
      { questionId: "existing_supplements", includes: ["supp_multivitamin"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "overlap_with_primary"],
  },
  {
    id: "calcium",
    slug: "calcium",
    name: "Calcium",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["heavy_metals", "identity_substitution"],
      formNotes: "Calcium citrate is better absorbed without food; calcium carbonate needs food. Pair with vitamin D and K2.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["calcium citrate", "calcium carbonate"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging", "general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "500–600 mg per dose, max 1000 mg/day total from supplements (food + supplement).",
    timingGuidance: "Evening with food; split into two doses if total exceeds 500 mg.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Most useful for low-dairy diets, post-menopausal women, and older adults at fracture risk.",
      "Excess supplementation has been associated with cardiovascular concerns; food sources first.",
    ],
    evidence: [odsCalcium],
    goalRelevance: [
      {
        when: { questionId: "dairy_intake", includes: ["rarely", "none_or_low"] },
        because: "you reported low dairy intake",
        studiedFor: "calcium adequacy for bone health",
        effectSize: "modest",
      },
      {
        when: { questionId: "age_band", includes: ["60_69", "70_79", "80_plus"] },
        because: "fracture risk rises sharply after 60",
        studiedFor: "fracture prevention in older adults",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "existing_supplements", includes: ["supp_calcium"] },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_stones", includes: ["yes", "not_sure"] },
    ],
    sameWindowConflicts: ["iron"],
    whyNotPrimary: ["narrower_indication"],
  },

  // ----- B-vitamin gap -----
  {
    id: "folate",
    slug: "folate",
    name: "Folate (Methylfolate)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "L-methylfolate is fine; folic acid is also fine for most. Don't mega-dose — high folate can mask B12 deficiency.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l-methylfolate", "folic acid"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition", "cognitive_longevity"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "400–800 mcg daily for general adequacy; conception planning targets 600–800 mcg.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Strongest case is conception planning and pregnancy.",
      "MTHFR variants are common but don't usually require methylfolate specifically — folic acid works for most.",
    ],
    evidence: [folateOdsRef],
    goalRelevance: [
      {
        when: { questionId: "diet_pattern", includes: ["carnivore", "low_carb_high_fat"] },
        because: "your diet may run lower in leafy-green folate sources",
        studiedFor: "folate adequacy in restrictive diets",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "vitamin_b6",
    slug: "vitamin-b6",
    name: "Vitamin B6 (P5P)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "P5P (pyridoxal-5-phosphate) is the active form. Stay below 100 mg/day chronically — high doses cause peripheral neuropathy.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Well-documented neuropathy at chronic high doses; affiliate exposure should highlight the upper limit.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["p5p", "pyridoxine"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "1.3–2 mg daily for adequacy; up to 50 mg short-term for PMS protocols. Avoid chronic doses above 100 mg.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Most users get enough from food.",
      "Real signal in PMS symptom protocols at moderate doses.",
    ],
    evidence: [b6OdsRef],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["stress"] },
        because: "you prioritized stress, where B6 plays a role in neurotransmitter synthesis",
        studiedFor: "PMS and mild mood symptoms",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["limited_safety_data", "narrower_indication"],
  },
  {
    id: "thiamine_b1",
    slug: "thiamine-b1",
    name: "Thiamine (Vitamin B1)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Plain thiamine HCl or benfotiamine (fat-soluble form, better tissue distribution).",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["thiamine hcl", "benfotiamine"],
    evidenceTier: "tier_b",
    primaryGoals: ["energy", "general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "1–2 mg daily for general adequacy; deficiency contexts (alcohol use, refined-carb diets, post-bariatric) often need much higher.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Often overlooked in heavy alcohol use, refined-carb diets, diuretic use, and bariatric surgery.",
      "Deficiency presents as fatigue, neuropathy, and brain fog.",
    ],
    evidence: [thiamineOdsRef],
    goalRelevance: [
      {
        when: { questionId: "derived_alcohol_risk", includes: ["risk_moderate", "risk_high"] },
        because: "alcohol depletes thiamine",
        studiedFor: "thiamine adequacy in heavy alcohol use",
        effectSize: "moderate",
      },
      {
        when: { questionId: "energy_issue", includes: ["low_energy"] },
        because: "you flagged low energy, which can be a thiamine signal in restrictive or alcohol-heavy diets",
        studiedFor: "fatigue in subclinical thiamine inadequacy",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },

  // ----- Performance batch -----
  {
    id: "beta_alanine",
    slug: "beta-alanine",
    name: "Beta-Alanine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["nsf_certified_for_sport", "informed_sport"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "CarnoSyn is the verified-grade form used in most trials. Tingling (paresthesia) is harmless — split doses to reduce it.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["carnosyn beta-alanine"],
    evidenceTier: "tier_b",
    primaryGoals: ["performance"],
    minScheduleFitScore: 10,
    baseScore: 26,
    doseGuidance: "3.2–6.4 g daily, ideally split into 2–4 smaller doses to reduce tingling.",
    timingGuidance: "Morning or pre-training; daily loading matters more than acute timing.",
    evaluationWindow: "Reassess after 4 to 6 weeks.",
    rationale: [
      "Best evidence is for high-intensity work lasting 1–4 minutes (rowing, intervals, mid-distance).",
      "Acts via muscle carnosine; takes weeks to load.",
    ],
    evidence: [issnBetaAlanine],
    goalRelevance: [
      {
        when: { questionId: "exercise_pattern", includes: ["endurance", "mixed_training", "strength_power"] },
        because: "your training pattern matches the studied use cases",
        studiedFor: "muscle endurance in 1–4 minute efforts",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "citrulline",
    slug: "l-citrulline",
    name: "L-Citrulline / Citrulline Malate",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["nsf_certified_for_sport", "informed_sport"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "L-citrulline (pure) at 6 g, or citrulline malate at 8 g. Mild GI upset if taken without water.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l-citrulline", "citrulline malate 2:1"],
    evidenceTier: "tier_b",
    primaryGoals: ["performance"],
    minScheduleFitScore: 10,
    baseScore: 24,
    doseGuidance: "6 g L-citrulline or 8 g citrulline malate, 30–60 minutes pre-training.",
    timingGuidance: "Pre-training; map to morning window for the schedule model.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Improves training volume (reps to failure) and reduces post-exercise soreness in trained populations.",
      "Effect on power output is smaller than the marketing implies.",
    ],
    evidence: [citrullineReview],
    goalRelevance: [
      {
        when: { questionId: "exercise_pattern", includes: ["strength_power", "mixed_training"] },
        because: "your training pattern matches the volume-improvement evidence",
        studiedFor: "training volume and post-exercise soreness",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "beetroot_nitrates",
    slug: "beetroot",
    name: "Beetroot / Dietary Nitrate",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["informed_sport", "third_party_coa"],
      contaminantConcerns: ["identity_substitution", "pesticides"],
      formNotes: "Beetroot juice or concentrated shots (e.g. Beet It); dried powder varies a lot in nitrate content.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["beetroot juice concentrate", "standardized nitrate shot"],
    evidenceTier: "tier_b",
    primaryGoals: ["performance"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "300–600 mg dietary nitrate, 2–3 hours pre-event.",
    timingGuidance: "Pre-event timing; map to morning for the schedule.",
    evaluationWindow: "Reassess acutely; loading isn't necessary.",
    rationale: [
      "Solid signal for endurance time-trial performance and exercise economy at moderate intensity.",
      "Smaller effect for short, very high-intensity work.",
    ],
    evidence: [beetrootMeta],
    goalRelevance: [
      {
        when: { questionId: "exercise_pattern", includes: ["endurance"] },
        because: "endurance-style training is where the strongest evidence sits",
        studiedFor: "endurance time-trial performance",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "taurine",
    slug: "taurine",
    name: "Taurine",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["taurine"],
    evidenceTier: "tier_c",
    primaryGoals: ["performance", "cognitive_performance"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "1–3 g daily; typically split or pre-training.",
    timingGuidance: "Morning or pre-training.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Mixed but real signal for endurance performance and cardiovascular markers.",
      "Recent aging-research interest is preliminary; treat the longevity claims cautiously.",
    ],
    evidence: [taurineEnduranceReview],
    goalRelevance: [
      {
        when: { questionId: "exercise_pattern", includes: ["endurance", "mixed_training"] },
        because: "endurance training matches the studied use",
        studiedFor: "endurance performance and recovery markers",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "sodium_bicarbonate",
    slug: "sodium-bicarbonate",
    name: "Sodium Bicarbonate",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "informed_sport"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Standard sodium bicarbonate; enteric-coated forms reduce GI upset.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "GI side effects are common; not appropriate without sport-specific use.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["sodium bicarbonate", "enteric-coated sodium bicarbonate"],
    evidenceTier: "tier_b",
    primaryGoals: ["performance"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "0.2–0.3 g per kg bodyweight, 60–180 minutes pre-event.",
    timingGuidance: "Pre-event only; not a daily supplement.",
    evaluationWindow: "Reassess acutely.",
    rationale: [
      "Real ergogenic signal for high-intensity efforts of 1–7 minutes.",
      "GI upset is the main barrier; experiment in training before competition.",
    ],
    evidence: [sodiumBicarbReview],
    goalRelevance: [
      {
        when: { questionId: "exercise_pattern", includes: ["mixed_training", "strength_power"] },
        because: "high-intensity training is where the studied benefit sits",
        studiedFor: "1–7 minute high-intensity performance",
        effectSize: "moderate",
      },
    ],
    excludeIf: [
      { questionId: "kidney_history", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication", "limited_safety_data"],
  },
  {
    id: "electrolytes",
    slug: "electrolytes",
    name: "Electrolytes (Na/K/Mg)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["informed_sport", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Look for sodium content high enough to actually replace sweat losses (often 500+ mg per serving).",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["sodium-forward electrolyte mix"],
    evidenceTier: "tier_b",
    primaryGoals: ["performance", "general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "Match sodium to sweat losses; 500–1500 mg sodium per hour during prolonged exercise or sauna.",
    timingGuidance: "During or around exercise; or once daily if low-carb (which depletes sodium).",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Useful for endurance training, hot environments, sauna users, and low-carb dieters who lose sodium fast.",
      "Most products under-dose sodium; the fancy minerals are usually marketing.",
    ],
    evidence: [electrolytesReview],
    goalRelevance: [
      {
        when: { questionId: "exercise_pattern", includes: ["endurance", "mixed_training"] },
        because: "your training pattern likely produces meaningful sweat losses",
        studiedFor: "fluid balance during prolonged exercise",
        effectSize: "moderate",
      },
      {
        when: { questionId: "diet_pattern", includes: ["low_carb_high_fat", "carnivore"] },
        because: "low-carb diets lose sodium fast through urine",
        studiedFor: "sodium adequacy in ketogenic diets",
        effectSize: "moderate",
      },
    ],
    clinicianReviewIf: [
      { questionId: "kidney_history", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "hmb",
    slug: "hmb",
    name: "HMB",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["informed_sport"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Calcium HMB is the most common form; free-acid HMB has marginal absorption advantage.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["calcium hmb", "free-acid hmb"],
    evidenceTier: "tier_c",
    primaryGoals: ["performance", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "3 g daily, split into doses with meals.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Best signal in untrained populations starting to lift, and in older adults with sarcopenia.",
      "In trained athletes the additional benefit over protein is usually small.",
    ],
    evidence: [hmbReview],
    goalRelevance: [
      {
        when: { questionId: "age_band", includes: ["60_69", "70_79", "80_plus"] },
        because: "the strongest signal is in older-adult sarcopenia",
        studiedFor: "muscle mass in older adults",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "overlap_with_primary"],
  },

  // ----- Cardiometabolic -----
  {
    id: "berberine",
    slug: "berberine",
    name: "Berberine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      formNotes: "Verify berberine HCl content per capsule; phytosome forms (Berberine Phytosome) improve absorption.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Significant interactions with statins, metformin, blood thinners, immunosuppressants — affiliate use needs clinician framing.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["berberine hcl", "berberine phytosome"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging", "general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 22,
    doseGuidance: "500 mg, 2–3 times daily with meals.",
    timingGuidance: "With main meals; not at bedtime.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Real signal on glucose and lipid markers in clinical trials.",
      "Multiple drug interactions through CYP3A4; not 'nature's Ozempic' as the marketing claims.",
    ],
    evidence: [berberineMeta],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["healthy_aging"] },
        because: "you prioritized healthy aging",
        studiedFor: "fasting glucose, HbA1c, and LDL in metabolic dysfunction",
        effectSize: "moderate",
      },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "daily_aspirin_or_nsaid", includes: ["yes", "not_sure"] },
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },
  {
    id: "nac",
    slug: "nac",
    name: "N-Acetylcysteine (NAC)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Sustained-release forms reduce sulfur taste and odor.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "FDA's stance has been ambiguous; clinician framing recommended.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["n-acetylcysteine", "sustained-release nac"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging", "stress"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "600–1200 mg daily, split.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Mucolytic and glutathione-precursor activity is well established; clinical endpoints in supplement use are mixed.",
      "Modest signals in OCD-spectrum and inflammatory conditions; not a routine supplement.",
    ],
    evidence: [nacReview],
    goalRelevance: [
      {
        when: { questionId: "stress_load", includes: ["high"] },
        because: "you reported elevated stress, where small trials look at NAC for repetitive/anxious patterns",
        studiedFor: "OCD-spectrum and impulse-control symptoms in small trials",
        effectSize: "mixed",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "ala",
    slug: "alpha-lipoic-acid",
    name: "Alpha-Lipoic Acid",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "R-ALA is the active form; racemic ALA also works at higher doses.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["r-ala", "racemic ala"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 20,
    doseGuidance: "300–600 mg daily on an empty stomach.",
    timingGuidance: "Morning, ideally 30 minutes before food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Strongest signal is for symptomatic improvement of diabetic peripheral neuropathy.",
      "Glucose-lowering claims are real but smaller than the marketing implies.",
    ],
    evidence: [alaNeuropathy],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["healthy_aging"] },
        because: "you prioritized healthy aging, where ALA's glucose effects are most relevant",
        studiedFor: "neuropathy symptoms and glucose markers",
        effectSize: "moderate",
      },
    ],
    clinicianReviewIf: [
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    excludeIf: [
      { questionId: "age_band", includes: ["under_18"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "plant_sterols",
    slug: "plant-sterols",
    name: "Plant Sterols / Stanols",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["beta-sitosterol", "esterified plant stanol"],
    evidenceTier: "tier_a",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 24,
    doseGuidance: "2 g daily, split with meals containing fat.",
    timingGuidance: "With main meals.",
    evaluationWindow: "Reassess with lipid panel after 8 to 12 weeks.",
    rationale: [
      "One of the better-evidenced over-the-counter LDL-lowering interventions; ~10% reduction.",
      "Doesn't replace statins in high-risk patients; complements diet.",
    ],
    evidence: [plantSterolsReview],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["healthy_aging"] },
        because: "cardiovascular risk reduction is part of healthy aging",
        studiedFor: "LDL cholesterol reduction in adults",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "garlic_extract",
    slug: "garlic-extract",
    name: "Aged Garlic Extract",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Aged garlic extract (Kyolic) has the most consistent trial data.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["aged garlic extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "600–1200 mg aged garlic extract daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Modest blood-pressure-lowering signal; small effect on lipids.",
      "Real but small; not a substitute for guideline-directed therapy.",
    ],
    evidence: [garlicBPMeta],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["healthy_aging"] },
        because: "blood-pressure modest reductions are part of healthy-aging targets",
        studiedFor: "systolic and diastolic BP in mildly hypertensive adults",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "niacin",
    slug: "niacin",
    name: "Niacin (Vitamin B3)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Immediate-release niacin has the lipid evidence but causes flushing. Sustained-release forms have hepatotoxicity risk.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Hepatotoxicity risk with sustained-release forms; flushing causes confusion with allergic reactions.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["immediate-release niacin"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "General-adequacy doses are 14–16 mg daily. Lipid-modifying doses (1–2 g) require clinician oversight, monitored liver enzymes, and immediate-release form only — sustained-release niacin at gram-scale doses has caused hepatotoxicity and is not recommended.",
    timingGuidance: "Evening with food to mute flushing.",
    evaluationWindow: "Reassess after 8 weeks with lipid panel and liver enzymes.",
    rationale: [
      "Real lipid signal at gram-scale doses; not appropriate without clinician oversight.",
      "Cardiovascular outcomes data is mixed despite the lipid effects (AIM-HIGH, HPS2-THRIVE).",
      "Sustained-release forms have a documented hepatotoxicity signal at lipid doses; this engine never auto-recommends gram-scale niacin without clinician routing.",
    ],
    evidence: [niacinLipidsReview],
    excludeIf: [
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
      { questionId: "existing_supplements", includes: ["supp_b_complex", "supp_multivitamin"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["limited_safety_data", "narrower_indication"],
  },
  {
    id: "red_yeast_rice",
    slug: "red-yeast-rice",
    name: "Red Yeast Rice",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Monacolin K content is essentially a low-dose statin; citrinin contamination is a documented risk in poorly tested products.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Functions like a low-dose statin; same drug-interaction profile and same liver-monitoring requirements.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized red yeast rice"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "Standardized to monacolin K; treat exactly as a low-dose statin.",
    timingGuidance: "Evening with food.",
    evaluationWindow: "Reassess with lipid panel after 8 to 12 weeks.",
    rationale: [
      "Effective LDL reduction because it contains naturally-occurring lovastatin (monacolin K).",
      "EU has restricted potency; quality and safety vary widely outside regulated markets.",
    ],
    evidence: [redYeastRiceMeta],
    excludeIf: [
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
      { questionId: "statin_use", includes: ["yes"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },

  // ----- Mood / sleep depth -----
  {
    id: "five_htp",
    slug: "5-htp",
    name: "5-HTP",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      formNotes: "Standardized griffonia simplicifolia extract.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Serotonin syndrome risk with SSRIs/MAOIs/tramadol/triptans; affiliate exposure requires explicit warning.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["griffonia-derived 5-htp"],
    evidenceTier: "tier_c",
    primaryGoals: ["sleep", "stress"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "50–100 mg evening; not appropriate alongside serotonergic medication.",
    timingGuidance: "Evening only.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Direct serotonin precursor; real but narrow case for use alongside no other serotonergics.",
      "Long-term safety data is sparse.",
    ],
    evidence: [fiveHtpReview],
    excludeIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
      { questionId: "ssri_or_serotonergic_use", includes: ["yes", "not_sure"] },
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["limited_safety_data", "narrower_indication"],
  },
  {
    id: "sam_e",
    slug: "sam-e",
    name: "SAM-e",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution", "oxidation_rancidity"],
      identityNotes: "SAM-e is unstable; require enteric-coated tablets in nitrogen-flushed packaging.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Activation / mania risk in bipolar; serotonergic drug interactions.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["enteric-coated sam-e"],
    evidenceTier: "tier_c",
    primaryGoals: ["stress"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "200–800 mg daily, started low and titrated.",
    timingGuidance: "Morning on empty stomach.",
    evaluationWindow: "Reassess after 4 to 6 weeks.",
    rationale: [
      "Comparable in some trials to tricyclic antidepressants for mild-to-moderate depressive symptoms.",
      "Bipolar activation risk is real; clinician oversight recommended.",
    ],
    evidence: [sameDepressionMeta],
    excludeIf: [
      { questionId: "ssri_or_serotonergic_use", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },
  {
    id: "valerian",
    slug: "valerian",
    name: "Valerian",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Standardized to valerenic acid content.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized valerian root extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["sleep"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "300–600 mg standardized extract, 30–60 minutes before bed.",
    timingGuidance: "Evening only.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Mixed evidence; some users feel a clear effect, many don't.",
      "Safety profile is reasonable for short-term use.",
    ],
    evidence: [valerianSleepReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["sleep"] },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "lavender_silexan",
    slug: "lavender-silexan",
    name: "Lavender Oil (Silexan)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Silexan is the patented standardized lavender oil with the trial evidence; generic lavender capsules are not equivalent.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["silexan"],
    evidenceTier: "tier_b",
    primaryGoals: ["stress"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "80 mg Silexan once daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 6 to 8 weeks.",
    rationale: [
      "Genuinely well-evidenced for generalized anxiety symptoms in multiple RCTs.",
      "Effect size comparable to low-dose paroxetine in head-to-head trials, with a cleaner side-effect profile.",
    ],
    evidence: [lavenderSilexanReview],
    goalRelevance: [
      {
        when: { questionId: "stress_load", includes: ["high", "moderate"] },
        because: "you reported elevated stress",
        studiedFor: "generalized anxiety symptoms",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "tart_cherry",
    slug: "tart-cherry",
    name: "Tart Cherry",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "pesticides"],
      formNotes: "Montmorency cherry juice or concentrate; verify anthocyanin content.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["montmorency tart cherry juice", "tart cherry concentrate"],
    evidenceTier: "tier_c",
    primaryGoals: ["sleep", "performance"],
    minScheduleFitScore: 10,
    baseScore: 20,
    doseGuidance: "30 mL concentrate or 240 mL juice, twice daily.",
    timingGuidance: "Evening, plus optional morning dose for recovery contexts.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Modest sleep duration and quality benefits; recovery signal in athletes.",
      "Sugar load is non-trivial in juice forms.",
    ],
    evidence: [tartCherrySleepReview],
    goalRelevance: [
      {
        when: { questionId: "sleep_quality", includes: ["poor", "fair"] },
        because: "you reported poor or fair sleep",
        studiedFor: "sleep duration and quality in older adults",
        effectSize: "modest",
      },
      {
        when: { questionId: "exercise_pattern", includes: ["endurance", "mixed_training", "strength_power"] },
        because: "training load matches the post-exercise recovery evidence",
        studiedFor: "post-exercise muscle damage and soreness",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "lemon_balm",
    slug: "lemon-balm",
    name: "Lemon Balm (Melissa officinalis)",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "pesticides"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized lemon balm extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress", "sleep"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "300–600 mg standardized extract.",
    timingGuidance: "Evening, or under acute stress.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Mild calming effect in small trials, often paired with valerian.",
      "Long traditional use, modest modern evidence.",
    ],
    evidence: [lemonBalmAnxietyReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["stress", "sleep"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "passionflower",
    slug: "passionflower",
    name: "Passionflower",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["standardized passiflora incarnata extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["sleep", "stress"],
    minScheduleFitScore: 9,
    baseScore: 13,
    doseGuidance: "300–500 mg standardized extract.",
    timingGuidance: "Evening only.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Small trials suggest mild anxiolytic effect.",
      "Limited modern RCT data; treat as a traditional option.",
    ],
    evidence: [passionflowerReview],
    optionalIf: [
      { questionId: "primary_goal", includes: ["sleep", "stress"] },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "kava",
    slug: "kava",
    name: "Kava",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Noble kava cultivars only; aerial parts are linked to hepatotoxicity and should be avoided.",
    },
    affiliatePolicy: {
      eligibility: "ineligible",
      reason: "Hepatotoxicity controversy and regulatory variability mean we don't promote kava products.",
    },
    defaultDoseWindow: "evening",
    preferredForms: ["noble kava root, water-extracted"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "Use only short-term and only noble-cultivar root; not appropriate as a daily supplement.",
    timingGuidance: "Evening only.",
    evaluationWindow: "Reassess within 2 weeks.",
    rationale: [
      "Real anxiolytic effect with reasonable trial evidence.",
      "Hepatotoxicity case reports — predominantly traced to non-noble cultivars and aerial parts — keep it off the routine list.",
    ],
    evidence: [kavaReview],
    excludeIf: [
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "derived_alcohol_risk", includes: ["risk_moderate", "risk_high"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },

  // ----- Lesser-known deficiency markers -----
  {
    id: "choline",
    slug: "choline",
    name: "Choline",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Choline bitartrate, citicoline (overlap), or alpha-GPC (overlap). Phosphatidylcholine is the food-form route.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["choline bitartrate", "phosphatidylcholine"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "Adequate intake is 425 mg (women) / 550 mg (men) daily; most adults under-consume.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Most adults don't hit the AI; eggs and liver are the easiest food sources.",
      "Pregnancy and lactation raise the case meaningfully.",
    ],
    evidence: [odsCholine],
    goalRelevance: [
      {
        when: { questionId: "diet_pattern", includes: ["vegan", "vegetarian"] },
        because: "plant-leaning diets often run low on choline (eggs and liver are the dense sources)",
        studiedFor: "choline adequacy in plant-leaning diets",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "iodine",
    slug: "iodine",
    name: "Iodine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Potassium iodide is fine. Avoid kelp products with unpredictable potency.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Narrow safe range; thyroid risk both for too little and too much.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["potassium iodide"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 16,
    doseGuidance: "150 mcg daily for adequacy. Stay below 1100 mcg/day to avoid thyroid disturbance.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks; consider TSH check.",
    rationale: [
      "Most useful for non-iodized-salt households, certain restrictive diets, and pregnancy.",
      "Excess iodine can trigger thyroid dysfunction; not a 'more is better' nutrient.",
    ],
    evidence: [odsIodine],
    goalRelevance: [
      {
        when: { questionId: "diet_pattern", includes: ["vegan", "vegetarian", "carnivore"] },
        because: "your diet pattern may miss iodized-salt and seafood/dairy sources",
        studiedFor: "iodine adequacy in restrictive diets",
        effectSize: "moderate",
      },
    ],
    excludeIf: [
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
      { questionId: "existing_supplements", includes: ["supp_iodine", "supp_multivitamin"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },
  {
    id: "selenium",
    slug: "selenium",
    name: "Selenium",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Selenomethionine is well absorbed; sodium selenite is also fine.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Narrow safe range; chronic excess is harmful.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["selenomethionine"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition", "immune_support"],
    minScheduleFitScore: 10,
    baseScore: 16,
    doseGuidance: "55–100 mcg daily; do not exceed 400 mcg/day chronically.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Geographic deficiency belts (parts of UK, NZ, China) make this region-specific.",
      "Two Brazil nuts often hit the daily target without a supplement.",
    ],
    evidence: [odsSelenium],
    goalRelevance: [
      {
        when: { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
        because: "selenium plays a role in thyroid hormone metabolism",
        studiedFor: "thyroid antibody markers in autoimmune thyroiditis",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "existing_supplements", includes: ["supp_selenium", "supp_multivitamin"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    whyNotPrimary: ["narrower_indication", "limited_safety_data"],
  },
  {
    id: "copper",
    slug: "copper",
    name: "Copper",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Copper bisglycinate or cupric sulfate. Most relevant alongside long-term zinc supplementation.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["copper bisglycinate"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 14,
    doseGuidance: "1–2 mg daily; pair with zinc supplementation to prevent depletion.",
    timingGuidance: "Morning, separated from zinc by 2 hours if both are taken.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Easily depleted by long-term high-dose zinc supplementation.",
      "Deficiency presents as anemia not responsive to iron.",
    ],
    evidence: [odsCopper],
    goalRelevance: [
      {
        when: { questionId: "primary_goal", includes: ["general_nutrition"] },
        because: "long-term zinc users commonly miss this counterpart",
        studiedFor: "copper status alongside zinc supplementation",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "boron",
    slug: "boron",
    name: "Boron",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Boron glycinate or boron citrate.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["boron glycinate"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "3–10 mg daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small signals on bone markers, hormonal markers, and arthritis pain.",
      "Evidence is preliminary; cheap and well tolerated.",
    ],
    evidence: [boronReview],
    goalRelevance: [
      {
        when: { questionId: "joint_stiffness", includes: ["morning_stiffness", "persistent_joint_pain"] },
        because: "boron has small-trial signals in joint discomfort",
        studiedFor: "joint pain markers in older adults",
        effectSize: "mixed",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "vitamin_a",
    slug: "vitamin-a",
    name: "Vitamin A / Beta-Carotene",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Beta-carotene is safer for general use; preformed retinol has a real toxicity ceiling.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Preformed vitamin A is teratogenic at high doses; chronic high doses cause hepatotoxicity.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["beta-carotene"],
    evidenceTier: "tier_c",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 10,
    doseGuidance: "Most adults shouldn't supplement preformed vitamin A. RDA can usually be hit by diet.",
    timingGuidance: "Morning with fat-containing meal.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Most users don't need this; teratogenic and hepatotoxic at chronic high doses.",
      "Beta-carotene supplementation in smokers raised lung cancer risk in trials — not a safe blanket recommendation.",
    ],
    evidence: [odsVitaminA],
    goalRelevance: [
      {
        when: { questionId: "derived_vitamin_a_signal", includes: ["signal_strong"] },
        because:
          "vitamin A-relevant signs converged in your answers (e.g. poor night vision alongside vegan diet or rare dairy). Diet-first remains the safer route — preformed retinol has a real toxicity ceiling",
        studiedFor: "vitamin A status correction in suspected inadequacy",
        effectSize: "modest",
      },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
      // CARET / ATBC: high-dose beta-carotene increased lung-cancer mortality
      // in current and recently-quit smokers. Hard exclusion.
      { questionId: "derived_smoking_risk", includes: ["current", "former_recent"] },
      { questionId: "existing_supplements", includes: ["supp_vitamin_a", "supp_multivitamin"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },
  {
    id: "vitamin_e",
    slug: "vitamin-e",
    name: "Vitamin E",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution", "oxidation_rancidity"],
      formNotes: "Mixed tocopherols preferred; high-dose alpha-tocopherol has worsened outcomes in some trials.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Bleeding risk at high doses; mixed/negative cardiovascular trials.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["mixed tocopherols"],
    evidenceTier: "tier_c",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 10,
    doseGuidance: "RDA is 15 mg/day. Avoid chronic doses above 268 mg/day.",
    timingGuidance: "Morning with fat-containing meal.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Most users get enough from diet; bleeding risk and mixed trial outcomes argue against routine supplementation.",
      "Narrow case in NAFLD where higher doses are sometimes used under clinician care.",
    ],
    evidence: [odsVitaminE],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "limited_safety_data"],
  },

  // ----- Women's health -----
  {
    id: "myo_inositol",
    slug: "myo-inositol",
    name: "Myo-Inositol",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Often paired with D-chiro-inositol at a 40:1 ratio for PCOS protocols.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["myo-inositol", "myo + d-chiro 40:1"],
    evidenceTier: "tier_b",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "2 g twice daily for PCOS protocols.",
    timingGuidance: "Morning and evening.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Real signal on PCOS endpoints: insulin sensitivity, ovulation rate, androgen markers.",
      "Generally well tolerated.",
    ],
    evidence: [myoInositolPCOS],
    // Evidence is for PCOS specifically — irregular cycles are the closest
    // proxy in this intake, and metabolic dysfunction (glycemic risk) is the
    // mechanism. Bare sex=female is not enough: most women do not have PCOS.
    boostIf: [
      { questionId: "cycle_pattern", includes: ["irregular_cycle"] },
    ],
    optionalIf: [
      { questionId: "derived_glycemic_risk", includes: ["risk_high", "risk_moderate"] },
    ],
    includeIf: [
      { questionId: "sex", includes: ["female"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "cycle_pattern", includes: ["irregular_cycle"] },
        because: "irregular cycles are a core PCOS feature where myo-inositol has the strongest evidence",
        studiedFor: "ovulation, insulin sensitivity, and androgen markers in PCOS",
        effectSize: "moderate",
      },
      {
        when: { questionId: "derived_glycemic_risk", includes: ["risk_high", "risk_moderate"] },
        because: "elevated glycemic risk overlaps the metabolic phenotype where myo-inositol acts",
        studiedFor: "insulin sensitivity in PCOS",
        effectSize: "modest",
      },
    ],
    clinicianReviewIf: [
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "soy_isoflavones",
    slug: "soy-isoflavones",
    name: "Soy Isoflavones",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "pesticides"],
      formNotes: "Standardized to genistein and daidzein content.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized soy isoflavones"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "40–80 mg total isoflavones daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Modest hot-flash reduction in some menopause trials.",
      "Effects vary widely by genetics (equol-producer status).",
    ],
    evidence: [soyIsoflavonesMeno],
    goalRelevance: [
      {
        when: { questionId: "age_band", includes: ["45_59", "60_69", "70_79", "80_plus"] },
        because: "menopause-relevant evidence sits in this age range",
        studiedFor: "vasomotor symptoms in menopause",
        effectSize: "modest",
      },
      {
        when: { questionId: "perimenopause_symptoms", includes: ["hot_flashes", "perimenopause_mixed"] },
        because: "you reported perimenopause symptoms",
        studiedFor: "vasomotor symptoms in perimenopause",
        effectSize: "modest",
      },
    ],
    boostIf: [
      { questionId: "perimenopause_symptoms", includes: ["hot_flashes", "perimenopause_mixed"] },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "known_allergies", includes: ["allergy_soy"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "black_cohosh",
    slug: "black-cohosh",
    name: "Black Cohosh",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Verify Cimicifuga racemosa species; many products are adulterated with cheaper Asian Cimicifuga species.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Hepatotoxicity case reports require explicit warning.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized cimicifuga racemosa extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "20–40 mg standardized extract daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Mixed trial evidence for menopausal symptoms.",
      "Hepatotoxicity reports keep it off routine recommendation.",
    ],
    evidence: [blackCohoshReview],
    optionalIf: [
      { questionId: "perimenopause_symptoms", includes: ["hot_flashes", "perimenopause_mixed"] },
    ],
    goalRelevance: [
      {
        when: { questionId: "perimenopause_symptoms", includes: ["hot_flashes", "perimenopause_mixed"] },
        because: "you reported perimenopause symptoms",
        studiedFor: "vasomotor symptoms in menopause",
        effectSize: "mixed",
      },
    ],
    excludeIf: [
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    whyNotPrimary: ["limited_safety_data"],
  },
  {
    id: "vitex",
    slug: "vitex",
    name: "Vitex (Chasteberry)",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Hormonal effects mean caveats around hormonal contraceptives and pregnancy.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized vitex agnus-castus extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["stress"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "20–40 mg standardized extract daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 2 to 3 cycles.",
    rationale: [
      "Real signal in PMS symptom trials.",
      "Affects prolactin; not appropriate during pregnancy or alongside hormonal contraceptives without clinician review.",
    ],
    evidence: [vitexPMSReview],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "contraception_type", includes: ["combined_pill", "progestin_only", "hormonal_iud"] },
      { questionId: "ssri_or_serotonergic_use", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["narrower_indication", "limited_safety_data"],
  },
  {
    id: "evening_primrose",
    slug: "evening-primrose",
    name: "Evening Primrose Oil",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["oxidation_rancidity", "identity_substitution"],
      formNotes: "Verify GLA content and oxidation status.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized evening primrose oil (gla content)"],
    evidenceTier: "tier_c",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "1000–3000 mg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Mixed evidence for PMS and atopic dermatitis.",
      "Effect sizes are small; food-source GLA is rare.",
    ],
    evidence: [eveningPrimroseReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },

  // ----- Skin / hair / nails -----
  {
    id: "biotin",
    slug: "biotin",
    name: "Biotin",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "High-dose biotin causes false readings on thyroid and troponin lab tests — flag this with any clinician before blood work.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Lab interference at common supplement doses; prominent caution required.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["biotin"],
    evidenceTier: "tier_d",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 10,
    baseScore: 8,
    doseGuidance: "Adequacy is 30 mcg/day. Hair-growth doses (5000–10000 mcg) interfere with several lab tests.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks. Stop several days before any blood work.",
    rationale: [
      "Hair, skin, and nail benefits are weak in non-deficient adults.",
      "Lab interference is the primary safety concern.",
    ],
    evidence: [odsBiotin],
    whyNotPrimary: ["smaller_effect_size", "limited_safety_data"],
  },
  {
    id: "silica",
    slug: "silica",
    name: "Silicon (Silica)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Choline-stabilized orthosilicic acid (ch-OSA) has the most evidence.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["ch-osa", "orthosilicic acid"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "5–20 mg ch-OSA daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Small trials suggest hair and nail strength benefits.",
      "Evidence is preliminary; effect sizes are small.",
    ],
    evidence: [siliconBoneHair],
    whyNotPrimary: ["weaker_modern_evidence", "needs_self_experiment"],
  },

  // ----- GI / microbiome -----
  {
    id: "lgg_probiotic",
    slug: "lgg-probiotic",
    name: "Lactobacillus rhamnosus GG (LGG)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
      identityNotes: "Verify the LGG strain specifically; generic 'L. rhamnosus' is not equivalent.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["lactobacillus rhamnosus gg (atcc 53103)"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support", "immune_support"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "10 billion CFU daily.",
    timingGuidance: "Morning, separated from antibiotics by 2 hours.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Best-evidenced probiotic strain for antibiotic-associated diarrhea and traveler's diarrhea prevention.",
      "Strain specificity matters — generic 'probiotic' is not the same.",
    ],
    evidence: [lggReview],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["post_antibiotic_recovery", "diarrhea"] },
        because: "you flagged post-antibiotic or loose stools",
        studiedFor: "antibiotic-associated diarrhea prevention",
        effectSize: "moderate",
      },
    ],
    clinicianReviewIf: [
      { questionId: "autoimmune_condition", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "s_boulardii",
    slug: "s-boulardii",
    name: "Saccharomyces boulardii",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["saccharomyces boulardii cncm i-745"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "5–10 billion CFU twice daily.",
    timingGuidance: "Morning and evening.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Yeast-based probiotic with strong evidence in antibiotic-associated diarrhea and C. difficile recurrence prevention.",
      "Survives antibiotics (yeast, not bacterial).",
    ],
    evidence: [sBoulardiiReview],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["diarrhea", "post_antibiotic_recovery"] },
        because: "you flagged loose stools or recent antibiotics",
        studiedFor: "antibiotic-associated and C. difficile-associated diarrhea",
        effectSize: "moderate",
      },
    ],
    clinicianReviewIf: [
      { questionId: "autoimmune_condition", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "b_infantis_35624",
    slug: "b-infantis-35624",
    name: "Bifidobacterium infantis 35624",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
      identityNotes: "Strain-specific (35624). Sold as Align in many markets.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["b. infantis 35624 (align)"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 10,
    baseScore: 20,
    doseGuidance: "1 billion CFU daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Best-evidenced single strain for IBS symptom improvement.",
      "Strain matters; the species name alone isn't enough.",
    ],
    evidence: [bInfantis35624],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["bloating"] },
        because: "you flagged bloating, an IBS-overlap symptom",
        studiedFor: "global IBS symptom score",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "inulin",
    slug: "inulin",
    name: "Inulin / Oligofructose",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["chicory-derived inulin"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "5–10 g daily, started low and titrated; can cause gas at higher doses.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Prebiotic fiber that selectively feeds bifidobacteria.",
      "Common GI side effects (gas, bloating) — start low, increase slowly.",
    ],
    evidence: [inulinPrebioticReview],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["constipation"] },
        because: "you flagged constipation",
        studiedFor: "stool frequency and bifidobacterial growth",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size", "narrower_indication"],
  },
  {
    id: "phgg",
    slug: "phgg",
    name: "Partially Hydrolyzed Guar Gum (PHGG)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Sunfiber is the common verified-grade brand.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["sunfiber phgg"],
    evidenceTier: "tier_c",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "5 g daily.",
    timingGuidance: "Evening; well tolerated even in IBS.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Better tolerated than inulin or psyllium for some IBS patients.",
      "Modest signal for both constipation and loose stools.",
    ],
    evidence: [phggIBSReview],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["bloating", "constipation", "diarrhea"] },
        because: "you flagged a bowel-pattern symptom",
        studiedFor: "IBS symptom severity and bowel regularity",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "peppermint_oil",
    slug: "peppermint-oil",
    name: "Enteric-Coated Peppermint Oil",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Must be enteric-coated for IBS use; non-coated forms cause heartburn.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["enteric-coated peppermint oil"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "180–225 mg twice daily, before meals.",
    timingGuidance: "Morning and evening, before meals.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Genuinely strong meta-analytic evidence for IBS abdominal pain reduction.",
      "Non-enteric-coated forms cause heartburn — coating is non-negotiable.",
    ],
    evidence: [peppermintIBSMeta],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["bloating"] },
        because: "you flagged bloating, an IBS-overlap symptom",
        studiedFor: "IBS abdominal pain and bloating",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "ginger",
    slug: "ginger",
    name: "Ginger Extract",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["pesticides", "identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized ginger extract"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "500 mg–1 g daily.",
    timingGuidance: "Morning, or as needed for nausea.",
    evaluationWindow: "Reassess after 2 to 4 weeks.",
    rationale: [
      "Solid evidence for nausea (pregnancy, post-op, motion).",
      "Modest signal in functional dyspepsia and motility.",
    ],
    evidence: [gingerNauseaMeta],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "dgl",
    slug: "dgl",
    name: "Deglycyrrhizinated Licorice (DGL)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Deglycyrrhizinated form only — regular licorice causes blood pressure issues at chronic doses.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["deglycyrrhizinated licorice"],
    evidenceTier: "tier_c",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "380–760 mg DGL chewed before meals.",
    timingGuidance: "Before meals.",
    evaluationWindow: "Reassess after 4 to 6 weeks.",
    rationale: [
      "Modest signal in functional dyspepsia and reflux symptoms.",
      "Deglycyrrhizinated form avoids the BP and potassium issues of regular licorice.",
    ],
    evidence: [dglGerd],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "l_glutamine",
    slug: "l-glutamine",
    name: "L-Glutamine",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l-glutamine"],
    evidenceTier: "tier_c",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "5 g daily; doses up to 30 g have been studied in clinical contexts.",
    timingGuidance: "Morning, away from food.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "'Leaky gut' marketing far outruns the evidence in healthy adults.",
      "Real signal in IBS-D specifically and in clinical hospital nutrition.",
    ],
    evidence: [lGlutamineGutReview],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },

  // ----- Adaptogens -----
  {
    id: "eleuthero",
    slug: "eleuthero",
    name: "Eleuthero (Siberian Ginseng)",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Verify Eleutherococcus senticosus species and eleutheroside content; commonly adulterated.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized eleutherococcus senticosus extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["energy", "stress"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "300–800 mg standardized extract daily.",
    timingGuidance: "Morning only.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Long traditional use; modern RCTs are small and mixed.",
      "Reasonable safety profile but limited evidence for the marketed claims.",
    ],
    evidence: [eleutheroReview],
    optionalIf: [{ questionId: "primary_goal", includes: ["energy", "stress"] }],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "panax_ginseng",
    slug: "panax-ginseng",
    name: "Panax Ginseng (Korean / Asian)",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration", "pesticides"],
      identityNotes: "Verify ginsenoside content and species. Korean red ginseng is the most-studied form.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized panax ginseng (korean red)"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "energy"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "200–400 mg standardized extract daily.",
    timingGuidance: "Morning only; can disturb sleep if taken late.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Modest evidence for cognition and fatigue in older adults.",
      "Can raise blood pressure; check if hypertensive.",
    ],
    evidence: [panaxGinsengReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "limited_safety_data"],
  },
  {
    id: "schisandra",
    slug: "schisandra",
    name: "Schisandra Chinensis",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized schisandra berry extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["stress", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "500–1500 mg daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Traditional use for stress resilience and liver markers.",
      "Modern human evidence is preliminary.",
    ],
    evidence: [schisandraReview],
    optionalIf: [{ questionId: "primary_goal", includes: ["stress", "healthy_aging"] }],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "cordyceps",
    slug: "cordyceps",
    name: "Cordyceps",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Cordyceps militaris (cultivated) and Cs-4 (Cordyceps sinensis strain) are the studied forms; verify which species and the cordycepin/adenosine content.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["cordyceps militaris fruiting body", "cs-4 standardized"],
    evidenceTier: "tier_d",
    primaryGoals: ["performance", "energy"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "1–3 g daily of standardized extract.",
    timingGuidance: "Morning; pre-training also studied.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "In vitro and small RCT signals on aerobic capacity in untrained adults.",
      "Marketing well outruns the human evidence; effect sizes are small.",
    ],
    evidence: [cordycepsReview],
    optionalIf: [
      { questionId: "exercise_pattern", includes: ["endurance", "mixed_training"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "smaller_effect_size"],
  },
  {
    id: "maca",
    slug: "maca",
    name: "Maca",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution"],
      identityNotes: "Gelatinized maca is more bioavailable; verify Lepidium meyenii species and growing region.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["gelatinized maca powder"],
    evidenceTier: "tier_c",
    primaryGoals: ["energy", "stress"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "1.5–3 g daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small RCTs for sexual function, mood, and perimenopausal symptoms.",
      "Effect sizes are modest; food-grade safety is good.",
    ],
    evidence: [macaReview],
    optionalIf: [{ questionId: "primary_goal", includes: ["energy", "stress"] }],
    excludeIf: [
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "tongkat_ali",
    slug: "tongkat-ali",
    name: "Tongkat Ali (Eurycoma longifolia)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "identity_substitution", "adulteration"],
      identityNotes: "Standardized to eurycomanone; LJ100 / Physta are the verified-grade extracts in trials.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["lj100", "physta-standardized eurycoma"],
    evidenceTier: "tier_c",
    primaryGoals: ["stress", "performance"],
    minScheduleFitScore: 9,
    baseScore: 16,
    doseGuidance: "200–400 mg standardized extract daily.",
    timingGuidance: "Morning; can disturb sleep if taken late.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Small RCTs show modest cortisol-lowering and testosterone-supporting signals in stressed men.",
      "Heavy-metal contamination has been reported in unverified products.",
    ],
    evidence: [eurycomaReview],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "cinnamon_ceylon",
    slug: "cinnamon-ceylon",
    name: "Cinnamon (Ceylon)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Ceylon cinnamon (Cinnamomum verum), not cassia. Cassia contains higher coumarin which is hepatotoxic at chronic high doses.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["ceylon cinnamon"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "1–6 g daily; use Ceylon, not cassia.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small fasting glucose and HbA1c effects in meta-analyses.",
      "Cassia cinnamon at high doses is hepatotoxic via coumarin; use Ceylon.",
    ],
    evidence: [cinnamonGlucose],
    excludeIf: [
      { questionId: "liver_history", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "alcar",
    slug: "acetyl-l-carnitine",
    name: "Acetyl-L-Carnitine (ALCAR)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["acetyl-l-carnitine"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "500 mg twice daily.",
    timingGuidance: "Morning and early afternoon; can disturb sleep if taken late.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small trials in mild cognitive impairment and age-related cognitive decline.",
      "Effect sizes are modest; not appropriate as a sole intervention.",
    ],
    evidence: [alcarCognitionReview],
    goalRelevance: [
      {
        when: { questionId: "cognitive_bottleneck", includes: ["memory_recall"] },
        because: "you flagged memory and recall complaints",
        studiedFor: "mild cognitive impairment markers in older adults",
        effectSize: "modest",
      },
    ],
    clinicianReviewIf: [
      { questionId: "thyroid_disorder", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "narrower_indication"],
  },

  // ----- Algae & marine -----
  {
    id: "spirulina",
    slug: "spirulina",
    name: "Spirulina",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "microbial", "identity_substitution"],
      identityNotes: "Source matters: open-pond spirulina commonly carries microcystin and heavy-metal contamination. Require lab-verified low-contamination sourcing.",
      formNotes: "Spirulina contains B12 *analogues* that are not bioactive — do not rely on it for B12.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["lab-verified spirulina"],
    evidenceTier: "tier_c",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "1–3 g daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small signals on lipids and blood pressure in meta-analyses.",
      "Contamination risk is real; brand quality matters more than dose.",
    ],
    evidence: [spirulinaReview],
    excludeIf: [
      { questionId: "autoimmune_condition", includes: ["yes", "not_sure"] },
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "limited_safety_data"],
  },
  {
    id: "chlorella",
    slug: "chlorella",
    name: "Chlorella",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["heavy_metals", "microbial", "identity_substitution"],
      identityNotes: "Cracked-cell-wall chlorella is the bioavailable form. Heavy-metal contamination is a real risk.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["cracked-cell-wall chlorella, lab-verified"],
    evidenceTier: "tier_d",
    primaryGoals: ["general_nutrition"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "2–5 g daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Marketing as a 'detox' supplement well outruns the evidence.",
      "Small signals on lipids and immune markers; contamination risk dominates.",
    ],
    evidence: [chlorellaReview],
    whyNotPrimary: ["weaker_modern_evidence", "limited_safety_data"],
  },
  {
    id: "krill_oil",
    slug: "krill-oil",
    name: "Krill Oil",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["ifos_5_star" as never, "third_party_coa"].filter((x) => x !== ("ifos_5_star" as never)) as never,
      contaminantConcerns: ["heavy_metals", "oxidation_rancidity"],
      identityNotes: "Phospholipid form; oxidation values matter. Verify EPA/DHA actually delivered per serving — krill is lower-density per gram than fish oil.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["phospholipid krill oil"],
    evidenceTier: "tier_c",
    primaryGoals: ["general_nutrition", "healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "1–2 g daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Phospholipid form is more bioavailable per mg, but products are typically dosed lower.",
      "Generally not better than equivalent-EPA/DHA fish oil for the cost.",
    ],
    evidence: [krillOilReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "daily_aspirin_or_nsaid", includes: ["yes", "not_sure"] },
      { questionId: "known_allergies", includes: ["allergy_fish", "allergy_shellfish"] },
      { questionId: "existing_supplements", includes: ["supp_omega3"] },
    ],
    whyNotPrimary: ["overlap_with_primary"],
  },

  // ----- Mitochondrial / longevity-adjacent -----
  {
    id: "nmn",
    slug: "nmn",
    name: "NMN (Nicotinamide Mononucleotide)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "NMN is among the most commonly adulterated supplements. Require independent assay verifying actual NMN content.",
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Regulatory status varies by region (FDA has questioned NMN's supplement status); promote with caveats.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["lab-assayed nmn"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "250–500 mg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "NAD+ precursor; small early human trials show NAD+ rises.",
      "Hard clinical endpoints (functional, longevity) are not yet established. Expensive for the evidence.",
    ],
    evidence: [nmnHumanTrial],
    whyNotPrimary: ["weaker_modern_evidence", "needs_self_experiment"],
  },
  {
    id: "nicotinamide_riboside",
    slug: "nicotinamide-riboside",
    name: "Nicotinamide Riboside (NR)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Niagen is the patented, well-studied form.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["niagen nicotinamide riboside"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "250–500 mg daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "More human trial data than NMN; raises NAD+ markers.",
      "Functional benefits in healthy adults remain unproven; expensive.",
    ],
    evidence: [nrTrials],
    whyNotPrimary: ["smaller_effect_size", "overlap_with_primary"],
  },
  {
    id: "pqq",
    slug: "pqq",
    name: "PQQ (Pyrroloquinoline Quinone)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["bioPQQ"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "10–20 mg daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Mitochondrial biogenesis story is mechanistically interesting; human evidence is sparse.",
      "Treat as experimental.",
    ],
    evidence: [pqqReview],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "resveratrol",
    slug: "resveratrol",
    name: "Resveratrol",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Trans-resveratrol is the studied form; verify trans- vs cis- content. Bioavailability is poor.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["trans-resveratrol", "resveratrol with piperine"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "150–500 mg daily.",
    timingGuidance: "Morning with fat-containing meal.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Marketing pushes longevity claims that human trials don't support.",
      "Poor oral bioavailability; pterostilbene has marginal advantages.",
    ],
    evidence: [resveratrolReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "pterostilbene",
    slug: "pterostilbene",
    name: "Pterostilbene",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["pterostilbene"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "100–250 mg daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "More bioavailable analogue of resveratrol with similar caveats.",
      "Some lipid signals but human evidence is preliminary.",
    ],
    evidence: [pterostilbeneReview],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "spermidine",
    slug: "spermidine",
    name: "Spermidine",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Wheat-germ extract spermidine is the most-studied source.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["wheat-germ extract spermidine"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "1–2 mg spermidine daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Autophagy story is mechanistically interesting; human RCTs are early.",
      "Food-derived dose from legumes, mushrooms, aged cheeses may be more practical.",
    ],
    evidence: [spermidineReview],
    whyNotPrimary: ["weaker_modern_evidence"],
  },

  // ----- Anti-inflammatory plants -----
  {
    id: "quercetin",
    slug: "quercetin",
    name: "Quercetin",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "Bioavailability is poor; phytosome (Quercetin Phytosome) or with bromelain improves absorption.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["quercetin phytosome", "quercetin + bromelain"],
    evidenceTier: "tier_c",
    primaryGoals: ["immune_support", "performance"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "500–1000 mg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Allergy and exercise-recovery signals in small trials.",
      "Bioavailability is the main barrier.",
    ],
    evidence: [quercetinReview],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "bromelain",
    slug: "bromelain",
    name: "Bromelain",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["bromelain (gdu measured)"],
    evidenceTier: "tier_c",
    primaryGoals: ["joint_mobility"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "500 mg twice daily on empty stomach.",
    timingGuidance: "Between meals.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Modest signal for sinus inflammation, post-surgical swelling, and OA pain.",
      "Often paired with quercetin.",
    ],
    evidence: [bromelainReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
  {
    id: "pycnogenol",
    slug: "pycnogenol",
    name: "Pycnogenol (French Maritime Pine Bark)",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Pycnogenol is the patented, standardized French maritime pine bark extract used in the trials.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["pycnogenol"],
    evidenceTier: "tier_b",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 18,
    doseGuidance: "100–200 mg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Vascular endpoints (endothelial function, BP) have decent trial signal.",
      "Small benefits across several inflammatory and cognitive endpoints.",
    ],
    evidence: [pycnogenolReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "olive_leaf_extract",
    slug: "olive-leaf-extract",
    name: "Olive Leaf Extract",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "pesticides"],
      identityNotes: "Standardized to oleuropein content (typically 16–20%).",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized olive leaf extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "500–1000 mg standardized extract daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Modest BP and lipid effects in small trials.",
      "Effect sizes are smaller than the marketing claims.",
    ],
    evidence: [oliveLeafExtractBP],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },

  // ----- Glucose / metabolic -----
  {
    id: "chromium_picolinate",
    slug: "chromium-picolinate",
    name: "Chromium Picolinate",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["usp_verified"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["chromium picolinate"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 10,
    baseScore: 12,
    doseGuidance: "200–400 mcg daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Small fasting glucose signal in meta-analyses; effect size is modest.",
      "Weight-loss and craving claims are weaker than marketed.",
    ],
    evidence: [chromiumPicolinateMeta],
    clinicianReviewIf: [
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    excludeIf: [
      { questionId: "age_band", includes: ["under_18"] },
    ],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "gymnema",
    slug: "gymnema",
    name: "Gymnema Sylvestre",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized gymnema (gymnemic acid content)"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "200–400 mg twice daily.",
    timingGuidance: "Morning and afternoon, before meals.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Long Ayurvedic use for glucose; small modern trials suggest modest effects.",
      "Interaction risk with diabetes medications.",
    ],
    evidence: [gymnemaReview],
    clinicianReviewIf: [
      { questionId: "medication_profile", includes: ["some_rx", "polypharmacy"] },
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence", "needs_self_experiment"],
  },
  {
    id: "fenugreek",
    slug: "fenugreek",
    name: "Fenugreek",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized fenugreek seed extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["performance"],
    minScheduleFitScore: 9,
    baseScore: 12,
    doseGuidance: "300–600 mg standardized extract daily.",
    timingGuidance: "Morning with food.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Glucose and testosterone signals in small trials; quality of evidence varies.",
      "Drug interaction risk; can affect anticoagulants and diabetes meds.",
    ],
    evidence: [fenugreekReview],
    excludeIf: [
      { questionId: "blood_thinner_use", includes: ["yes", "not_sure"] },
      { questionId: "daily_aspirin_or_nsaid", includes: ["yes", "not_sure"] },
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
      { questionId: "age_band", includes: ["under_18"] },
    ],
    clinicianReviewIf: [
      { questionId: "glucose_lowering_med", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["smaller_effect_size", "limited_safety_data"],
  },

  // ----- Hormonal -----
  {
    id: "dim",
    slug: "dim",
    name: "DIM (Diindolylmethane)",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "morning",
    preferredForms: ["bioavailable dim (with phosphatidylcholine)"],
    evidenceTier: "tier_d",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 10,
    doseGuidance: "100–200 mg daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Estrogen-metabolism story is mechanistically interesting; clinical endpoints are sparse.",
      "Marketing exceeds what human RCTs support.",
    ],
    evidence: [dimEstrogenReview],
    excludeIf: [
      { questionId: "pregnant_or_breastfeeding", includes: ["yes", "not_sure"] },
    ],
    whyNotPrimary: ["weaker_modern_evidence"],
  },
  {
    id: "saw_palmetto",
    slug: "saw-palmetto",
    name: "Saw Palmetto",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
      identityNotes: "Lipidosterolic extract (Permixon-grade) is the studied form; cheaper preparations are routinely adulterated.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "evening",
    preferredForms: ["lipidosterolic saw palmetto extract"],
    evidenceTier: "tier_c",
    primaryGoals: ["healthy_aging"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "320 mg standardized extract daily.",
    timingGuidance: "Evening with food.",
    evaluationWindow: "Reassess after 12 weeks.",
    rationale: [
      "Mixed evidence for benign prostatic hyperplasia symptoms.",
      "Cochrane review concluded effect is similar to placebo for many endpoints; some products show benefit.",
    ],
    evidence: [sawPalmettoBPH],
    whyNotPrimary: ["smaller_effect_size"],
  },
  {
    id: "tribulus",
    slug: "tribulus",
    name: "Tribulus Terrestris",
    category: "alternative_traditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "adulteration"],
    },
    affiliatePolicy: {
      eligibility: "needs_clinician_context",
      reason: "Marketed claims (testosterone) are not supported by human RCTs; affiliate use should be honest about that.",
    },
    defaultDoseWindow: "morning",
    preferredForms: ["standardized tribulus extract"],
    evidenceTier: "tier_d",
    primaryGoals: ["performance"],
    minScheduleFitScore: 9,
    baseScore: 8,
    doseGuidance: "Most testosterone studies show no meaningful effect; libido evidence is mixed.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Multiple meta-analyses show no testosterone effect in healthy men.",
      "Limited libido signal in some trials; effect sizes are small.",
    ],
    evidence: [tribulusReview],
    whyNotPrimary: ["weaker_modern_evidence", "smaller_effect_size"],
  },

  // ----- Specialty fats / aminos -----
  {
    id: "mct_oil",
    slug: "mct-oil",
    name: "MCT Oil",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["oxidation_rancidity", "identity_substitution"],
      formNotes: "C8 (caprylic acid) is the most ketogenic; mixed C8/C10 is more affordable. Avoid lauric-acid-heavy products marketed as MCT.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["c8 mct oil", "c8/c10 mct oil"],
    evidenceTier: "tier_c",
    primaryGoals: ["energy", "cognitive_performance"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "1 tbsp (15 mL) daily, increased gradually to tolerance.",
    timingGuidance: "Morning, often in coffee.",
    evaluationWindow: "Reassess after 4 weeks.",
    rationale: [
      "Useful in ketogenic and low-carb contexts; modest cognitive signal.",
      "GI tolerance is the main barrier — start low.",
    ],
    evidence: [mctOilReview],
    goalRelevance: [
      {
        when: { questionId: "diet_pattern", includes: ["low_carb_high_fat", "carnivore"] },
        because: "your diet pattern fits where MCTs offer the clearest benefit",
        studiedFor: "ketone elevation and energy under low-carb conditions",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "l_carnitine",
    slug: "l-carnitine",
    name: "L-Carnitine",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["usp_verified", "third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      formNotes: "L-carnitine tartrate for performance; ALCAR (separate entry) for cognition.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l-carnitine tartrate"],
    evidenceTier: "tier_c",
    primaryGoals: ["performance", "energy"],
    minScheduleFitScore: 10,
    baseScore: 16,
    doseGuidance: "1–2 g daily.",
    timingGuidance: "Morning or pre-training.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Recovery and exercise-tolerance signals in vegetarians especially.",
      "Heart-failure trials are clinician-level dosing.",
    ],
    evidence: [lCarnitineReview],
    goalRelevance: [
      {
        when: { questionId: "diet_pattern", includes: ["vegan", "vegetarian"] },
        because: "plant-leaning diets are lower in dietary carnitine",
        studiedFor: "carnitine adequacy and exercise tolerance",
        effectSize: "modest",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },

  // ----- Specific probiotic strains -----
  {
    id: "l_plantarum_299v",
    slug: "l-plantarum-299v",
    name: "Lactobacillus plantarum 299v",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
      identityNotes: "Strain-specific (299v); marketed as Ideal Bowel Support / Sensilab in many markets.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l. plantarum 299v"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support"],
    minScheduleFitScore: 10,
    baseScore: 22,
    doseGuidance: "10 billion CFU daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Strong evidence in IBS abdominal pain and bloating.",
      "Survives transit well; strain-specific.",
    ],
    evidence: [lPlantarum299v],
    goalRelevance: [
      {
        when: { questionId: "gut_issue", includes: ["bloating"] },
        because: "you flagged bloating",
        studiedFor: "IBS abdominal pain and bloating",
        effectSize: "moderate",
      },
    ],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "l_reuteri_dsm_17938",
    slug: "l-reuteri-dsm-17938",
    name: "Lactobacillus reuteri DSM 17938",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
      identityNotes: "Strain-specific (DSM 17938).",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["l. reuteri dsm 17938"],
    evidenceTier: "tier_b",
    primaryGoals: ["gut_support", "immune_support"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "100 million–1 billion CFU daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Strongest data in infant colic; adult evidence covers H. pylori adjunct and oral health.",
      "Strain-specific; generic 'L. reuteri' is not equivalent.",
    ],
    evidence: [lReuteriOralHealth],
    whyNotPrimary: ["narrower_indication"],
  },
  {
    id: "b_lactis_bb12",
    slug: "b-lactis-bb12",
    name: "Bifidobacterium lactis BB-12",
    category: "conditional",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution", "microbial"],
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["b. lactis bb-12"],
    evidenceTier: "tier_b",
    primaryGoals: ["immune_support", "gut_support"],
    minScheduleFitScore: 10,
    baseScore: 18,
    doseGuidance: "1–10 billion CFU daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Decent evidence for immune markers and respiratory infection rate in winter.",
      "Often paired with LGG.",
    ],
    evidence: [bLactisBB12],
    whyNotPrimary: ["narrower_indication"],
  },

  // ----- Magnesium L-threonate -----
  {
    id: "mag_threonate",
    slug: "magnesium-l-threonate",
    name: "Magnesium L-Threonate",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["identity_substitution"],
      identityNotes: "Magtein is the patented, studied form. Note: per gram, this delivers far less elemental magnesium than glycinate or citrate.",
    },
    affiliatePolicy: { eligibility: "needs_clinician_context" },
    defaultDoseWindow: "evening",
    preferredForms: ["magtein l-threonate"],
    evidenceTier: "tier_c",
    primaryGoals: ["cognitive_performance", "cognitive_longevity"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "1.5–2 g L-threonate daily, providing ~144 mg elemental magnesium.",
    timingGuidance: "Evening; sometimes split.",
    evaluationWindow: "Reassess after 8 to 12 weeks.",
    rationale: [
      "Marketed for cognitive benefit based on a single small RCT and rodent data.",
      "Per dollar, glycinate covers magnesium adequacy more efficiently for non-cognitive use.",
    ],
    evidence: [magThreonateCog],
    whyNotPrimary: ["smaller_effect_size", "overlap_with_primary"],
  },

  // ----- Bovine colostrum -----
  {
    id: "colostrum",
    slug: "bovine-colostrum",
    name: "Bovine Colostrum",
    category: "exploratory",
    qualityRequirements: {
      preferredCertifications: ["third_party_coa"],
      contaminantConcerns: ["microbial", "identity_substitution"],
      identityNotes: "Verify IgG content and source farm; quality varies widely.",
    },
    affiliatePolicy: { eligibility: "eligible" },
    defaultDoseWindow: "morning",
    preferredForms: ["lab-verified bovine colostrum"],
    evidenceTier: "tier_c",
    primaryGoals: ["gut_support", "performance"],
    minScheduleFitScore: 9,
    baseScore: 14,
    doseGuidance: "10–20 g daily.",
    timingGuidance: "Morning.",
    evaluationWindow: "Reassess after 4 to 8 weeks.",
    rationale: [
      "Modest signals on athletic gut barrier and upper respiratory infection rate.",
      "Quality varies a lot between products.",
    ],
    evidence: [colostrumReview],
    whyNotPrimary: ["smaller_effect_size", "needs_self_experiment"],
  },
];

// ---------------------------------------------------------------------------
// Editorial position: supplements we deliberately do NOT include in the
// catalog, with reasoning. Same intent as EXCLUDED_TESTS in
// lab-recommendations.ts: the list is documentation, not runtime, but it
// exists so contributors can see what's been considered and rejected.
//
// If you think one of these should be added, open a Clinician Review PR
// with the citation and the conflict-of-interest disclosure.
// ---------------------------------------------------------------------------
export const EXCLUDED_SUPPLEMENTS: ReadonlyArray<{
  name: string;
  reason: string;
}> = [
  {
    name: "St. John's Wort (Hypericum perforatum)",
    reason:
      "Strong CYP3A4, CYP2C9, CYP2C19 induction and P-glycoprotein induction. Reduces serum levels of warfarin, oral contraceptives, immunosuppressants (cyclosporine, tacrolimus), antiretrovirals, anticonvulsants, statins, calcium channel blockers, and many others. Combined with serotonergic agents (SSRIs, SNRIs, MAOIs, tramadol, triptans, lithium) it raises serotonin syndrome risk. The interaction surface is so broad — and so clinically meaningful — that this engine cannot model it safely without a full medication list, which we do not collect. The honest move is to exclude it from the auto-recommendation catalog entirely. A clinician with the patient's full medication list is the right venue for any decision to use it.",
  },
  {
    name: "Yohimbine / Yohimbe bark",
    reason:
      "Cardiovascular adverse-event signal (hypertension, tachycardia, arrhythmia) at common supplement doses. Documented interactions with MAOIs, tricyclics, SSRIs, beta-blockers, alpha-blockers, and clonidine. Adulteration and dose-labelling problems are widespread. Insufficient benefit to justify the risk profile.",
  },
  {
    name: "Bitter orange (Citrus aurantium / synephrine)",
    reason:
      "Sympathomimetic effects (BP rise, palpitations) particularly when combined with caffeine — the 'replacement for ephedra' marketing position. FDA adverse-event reports are non-trivial. We do not include weight-loss stimulants in the catalog.",
  },
  {
    name: "Ephedra / ma huang",
    reason:
      "FDA banned dietary supplements containing ephedrine alkaloids in 2004 after documented strokes and cardiac events. Out of scope.",
  },
  {
    name: "Comfrey (Symphytum spp.) — internal use",
    reason:
      "Pyrrolizidine alkaloids cause hepatic veno-occlusive disease. Out of scope for any internal-use formulation.",
  },
  {
    name: "Kratom",
    reason:
      "Opioid-receptor activity, dependence and withdrawal documented, FDA warnings ongoing, no clinical-quality evidence base for any wellness indication. Out of scope.",
  },
  {
    name: "DHEA (general use)",
    reason:
      "Hormonal precursor; clinically relevant in specific endocrine contexts (Addison's, deliberate hormone replacement) but not appropriate as an over-the-counter supplement recommendation. Banned for athletes under WADA. Out of scope without a clinician.",
  },
  {
    name: "Pregnenolone",
    reason: "Same reasoning as DHEA — hormonal precursor, clinician-only.",
  },
  {
    name: "Tribulus terrestris for testosterone (claim)",
    reason:
      "Tribulus is in the catalog at category=alternative_traditional with explicit caveats. The widely-marketed 'testosterone booster' claim is unsupported by trial evidence; we do not present it for that indication.",
  },
  {
    name: "Colloidal silver",
    reason:
      "Documented argyria (irreversible skin discoloration) with no validated indication for internal use. FDA enforcement action history. Out of scope.",
  },
  {
    name: "Black salve / bloodroot extract",
    reason:
      "Caustic agent marketed for skin lesions. Causes tissue necrosis. Out of scope.",
  },
  {
    name: "MMS / chlorine dioxide",
    reason:
      "Industrial bleach precursor sold as a wellness product. FDA warnings. Pseudoscience.",
  },
];
