// ----------------------------------------------------------------------------
// Family Health History — guideline citations.
//
// Single source of truth for every signal's source. `reviewedAt` is the date
// the URL/title/version were last verified by an engine maintainer — it is
// NOT a clinician-review marker. The `reviewer` field on GuidelineCitation
// stays optional and unset until a named clinician signs off on a specific
// citation; downstream UIs should render that distinction honestly.
// ----------------------------------------------------------------------------

import type { FamilyPatternSignalId, GuidelineCitation } from "./types";

export const REVIEW_DATE = "2026-05-17";

export const CITATIONS: Record<FamilyPatternSignalId, GuidelineCitation> = {
  premature_cad_prompt: {
    source: "ACC_AHA",
    title: "2018 ACC/AHA Cholesterol Guideline + 2026 dyslipidemia update",
    version: "2018 / 2026",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000625",
    reviewedAt: REVIEW_DATE,
  },
  unexplained_or_early_sudden_death_prompt: {
    source: "AHA",
    title: "AHA scientific statement on sudden cardiac death prevention",
    version: "2024",
    url: "https://www.heart.org/en/health-topics/cardiac-arrest",
    reviewedAt: REVIEW_DATE,
  },
  t2d_cluster_prompt: {
    source: "ADA",
    title: "ADA Standards of Care in Diabetes",
    version: "2026",
    url: "https://diabetesjournals.org/care/issue/49/Supplement_1",
    reviewedAt: REVIEW_DATE,
  },
  hboc_discussion_prompt: {
    // The breast/ovarian half is anchored by USPSTF BRCA. Pancreatic and
    // prostate criteria are NCCN-style and intentionally not quoted by
    // threshold here — the signal label is softened to "discussion prompt"
    // accordingly, and the secondary CDC citation covers the broader
    // family-history → genetic-counseling pathway.
    source: "USPSTF",
    title:
      "USPSTF: BRCA-related cancer risk assessment, genetic counseling, and genetic testing (breast/ovarian); also CDC family-health-history guidance on when to discuss genetic counseling for other cancer clusters",
    version: "USPSTF 2019, CDC 2024",
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/brca-related-cancer-risk-assessment-genetic-counseling-and-genetic-testing",
    reviewedAt: REVIEW_DATE,
  },
  lynch_spectrum_discussion_prompt: {
    source: "ACG",
    title: "ACG clinical guideline: hereditary gastrointestinal cancer syndromes",
    version: "2024",
    url: "https://journals.lww.com/ajg/pages/default.aspx",
    reviewedAt: REVIEW_DATE,
  },
  familial_hypercholesterolemia_hint: {
    source: "NLA",
    title: "NLA recommendations on familial hypercholesterolemia",
    version: "2023",
    url: "https://www.lipid.org/",
    reviewedAt: REVIEW_DATE,
  },
  early_dementia_prompt: {
    source: "ALZ_ASSOC",
    title: "Alzheimer's Association — family history & genetics",
    version: "2025",
    url: "https://www.alz.org/alzheimers-dementia/what-is-alzheimers/causes-and-risk-factors/genetics",
    reviewedAt: REVIEW_DATE,
  },
  thoracic_aortic_prompt: {
    source: "ACC_AHA",
    title: "2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease",
    version: "2022",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106",
    reviewedAt: REVIEW_DATE,
  },
  melanoma_family_skin_exam_prompt: {
    source: "AAD",
    title: "AAD family-history guidance on melanoma surveillance",
    version: "2024",
    url: "https://www.aad.org/public/diseases/skin-cancer/types/common/melanoma",
    reviewedAt: REVIEW_DATE,
  },
  colon_screening_age_modifier: {
    source: "ACG",
    title: "ACG colorectal cancer screening guideline",
    version: "2021",
    url: "https://gi.org/guideline/colorectal-cancer-screening/",
    reviewedAt: REVIEW_DATE,
  },
};
