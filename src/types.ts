export type DoseWindow = "morning" | "evening";

export type EvidenceTier =
  | "tier_a"
  | "tier_b"
  | "tier_c"
  | "tier_d";

export type RecommendationStatus =
  | "recommended"
  | "worth_considering"
  | "traditional_use"
  | "optional"
  | "do_not_recommend"
  | "needs_clinician_review";

export type EffectSize = "modest" | "moderate" | "promising" | "mixed";

export type WhyNotPrimary =
  | "narrower_indication"
  | "smaller_effect_size"
  | "weaker_modern_evidence"
  | "overlap_with_primary"
  | "needs_self_experiment"
  | "limited_safety_data";

export type Goal =
  | "sleep"
  | "energy"
  | "stress"
  | "performance"
  | "cognitive_performance"
  | "cognitive_longevity"
  | "joint_mobility"
  | "general_nutrition"
  | "immune_support"
  | "gut_support"
  | "healthy_aging";

export type QuestionId =
  | "primary_goal"
  | "age_band"
  | "sex"
  | "pregnant_or_breastfeeding"
  | "medication_profile"
  | "blood_thinner_use"
  | "daily_aspirin_or_nsaid"
  | "ssri_or_serotonergic_use"
  | "glucose_lowering_med"
  | "statin_use"
  | "specific_medications"
  | "existing_supplements"
  | "known_allergies"
  | "migraine_pattern"
  | "joint_stiffness"
  | "lipid_status"
  | "glucose_status"
  | "blood_pressure_status"
  | "kidney_history"
  | "liver_history"
  | "thyroid_disorder"
  | "autoimmune_condition"
  | "kidney_stones"
  // Red-flag screen
  | "red_flag_symptoms"
  | "diet_pattern"
  | "fruit_veg_servings"
  | "fibre_intake"
  | "ssb_intake"
  | "ultra_processed_intake"
  | "fish_intake"
  | "red_meat_intake"
  | "dairy_intake"
  | "sun_exposure"
  | "alcohol_units_weekly"
  | "alcohol_binge_frequency"
  // Legacy frequency-based alcohol id retained for back-compat with older saved
  // intake answers and a handful of derivation references; the questionnaire
  // now asks units/week + binge frequency, and the engine reads the derived
  // `derived_alcohol_risk` signal in preference to this field.
  | "alcohol_frequency"
  | "tobacco_use"
  | "vaping_use"
  | "sleep_quality"
  | "stress_load"
  | "exercise_pattern"
  | "sleep_issue"
  | "energy_issue"
  | "recovery_issue"
  | "gut_issue"
  | "bowel_pattern"
  | "gi_symptoms"
  | "cognitive_bottleneck"
  | "lab_vitamin_d_status"
  | "lab_ferritin_status"
  | "lab_b12_status"
  | "lab_triglycerides_status"
  | "water_intake"
  | "sleep_hours"
  | "sitting_hours"
  | "screen_hours"
  | "social_connection"
  | "time_in_nature"
  | "weight_band"
  | "weight_change_recent"
  | "cardio_minutes_weekly"
  | "strength_sessions_weekly"
  | "daily_steps"
  | "bedtime_consistency"
  | "awakenings"
  | "snoring_pattern"
  | "caffeine_cutoff"
  | "cycle_pattern"
  | "pms_pattern"
  | "perimenopause_symptoms"
  | "contraception_type"
  | "nail_signs"
  | "skin_signs"
  | "hair_signs"
  | "mouth_signs"
  | "other_signs"
  // Derived nutrient signals — never asked directly. Computed by deriveNutrientSignals()
  // from a corroboration of body signs, diet, lab status, and risk factors.
  // Live in AnswerMap so the rules engine can read them via the same Condition mechanism
  // as user-supplied answers. Strength reflects medical convergence, not single-symptom triggering.
  | "derived_iron_signal"
  | "derived_zinc_signal"
  | "derived_b12_signal"
  | "derived_b_complex_signal"
  | "derived_vitamin_c_signal"
  | "derived_vitamin_d_signal"
  | "derived_omega3_signal"
  | "derived_magnesium_signal"
  | "derived_vitamin_a_signal"
  | "derived_vitamin_k_signal"
  // Derived clinical-risk signals
  | "derived_alcohol_risk"           // none | low | moderate | high (from units + binge)
  | "derived_smoking_risk"           // none | former_remote | former_recent | current
  | "derived_produce_risk"           // none | low | high (from fruit_veg + fibre + ssb)
  | "derived_glycemic_risk"          // none | low | high (from ssb + glucose_status + meds)
  | "derived_diet_quality_risk"      // none | low | moderate | high (from UPF + SSB + produce)
  | "derived_red_flag";              // none | present (any urgent red flag selected)

export type QuestionSection =
  | "goals"
  | "safety"
  | "lifestyle"
  | "holistic"
  | "symptoms"
  | "body_signs"
  | "labs";

export type QuestionOptionValue =
  | Goal
  | "none"
  | "prefer_not_to_say"
  | "under_18"
  | "18_29"
  | "30_44"
  | "45_59"
  | "60_69"
  | "70_79"
  | "80_plus"
  // Legacy band kept for back-compat with older saved intakes; the
  // questionnaire now offers three bands above 60. Engine code reads the
  // three new bands as a set wherever the old `60_plus` was meaningful.
  | "60_plus"
  | "female"
  | "male"
  | "intersex"
  | "yes"
  | "no"
  | "not_sure"
  | "some_rx"
  | "polypharmacy"
  | "vegan"
  | "vegetarian"
  | "omnivore"
  | "pescatarian"
  | "low_carb_high_fat"
  | "carnivore"
  | "rarely"
  | "weekly"
  | "most_days"
  | "daily"
  | "none_or_low"
  | "moderate"
  | "high"
  | "poor"
  | "fair"
  | "good"
  | "very_good"
  | "strength_power"
  | "endurance"
  | "mixed_training"
  | "light_activity"
  | "mostly_sedentary"
  | "sleep_onset"
  | "sleep_maintenance"
  | "non_restorative_sleep"
  | "low_energy"
  | "poor_focus"
  | "low_motivation"
  | "muscle_soreness"
  | "poor_recovery"
  | "cramps"
  | "bloating"
  | "constipation"
  | "diarrhea"
  | "post_antibiotic_recovery"
  | "no_specific_issue"
  | "afternoon_dip"
  | "morning_startup"
  | "post_meal_fog"
  | "context_switching"
  | "deep_focus_stamina"
  | "memory_recall"
  | "stress_induced_fog"
  | "no_specific_bottleneck"
  | "occasional_migraine"
  | "frequent_migraine"
  | "morning_stiffness"
  | "post_exercise_stiffness"
  | "persistent_joint_pain"
  | "no_joint_issue"
  | "lt_1l"
  | "1_to_2l"
  | "2_to_3l"
  | "gt_3l"
  | "lt_6h"
  | "6_to_7h"
  | "7_to_8h"
  | "gt_8h"
  | "lt_4h"
  | "4_to_8h"
  | "8_to_12h"
  | "gt_12h"
  | "isolated"
  | "limited"
  | "regular"
  | "abundant"
  | "almost_never"
  | "weekly_outdoors"
  | "daily_outdoors"
  | "underweight_band"
  | "healthy_band"
  | "overweight_band"
  | "obese_band"
  | "lost_weight"
  | "stable_weight"
  | "gained_weight"
  | "lt_60_min"
  | "60_to_150_min"
  | "150_to_300_min"
  | "gt_300_min"
  | "zero_strength"
  | "one_strength"
  | "two_three_strength"
  | "four_plus_strength"
  | "lt_5k"
  | "5k_to_8k"
  | "8k_to_12k"
  | "gt_12k"
  | "very_consistent"
  | "mostly_consistent"
  | "irregular"
  | "no_awakenings"
  | "occasional_awakenings"
  | "frequent_awakenings"
  | "no_snoring"
  | "occasional_snoring"
  | "loud_snoring_or_apnea"
  | "before_noon"
  | "noon_to_3pm"
  | "after_3pm"
  | "no_caffeine"
  | "regular_cycle"
  | "irregular_cycle"
  | "no_cycle"
  | "post_menopause"
  | "no_pms"
  | "mild_pms"
  | "significant_pms"
  | "no_perimenopause"
  | "hot_flashes"
  | "perimenopause_mixed"
  | "hormonal_iud"
  | "combined_pill"
  | "progestin_only"
  | "non_hormonal"
  | "none_birth_control"
  | "known_low"
  | "borderline_low"
  | "normal"
  | "high"
  // nail signs
  | "nail_white_spots"
  | "nail_ridges_horizontal"
  | "nail_spoon_shaped"
  | "nail_brittle_peeling"
  | "nail_pale_beds"
  | "no_nail_signs"
  // skin signs
  | "skin_dry_scaly"
  | "skin_eczema_inflamed"
  | "skin_adult_acne"
  | "skin_easy_bruising"
  | "skin_slow_healing"
  | "skin_pale_sallow"
  | "no_skin_signs"
  // hair signs (genetic guards on the last two)
  | "hair_diffuse_shedding"
  | "hair_dry_brittle"
  | "hair_premature_greying"
  | "hair_pattern_loss_genetic"
  | "hair_familial_early_greying"
  | "no_hair_signs"
  // mouth signs
  | "mouth_cracks_corners"
  | "mouth_sore_smooth_tongue"
  | "mouth_bleeding_gums"
  | "no_mouth_signs"
  // other physical signs
  | "cold_extremities"
  | "muscle_twitches_restless_legs"
  | "taste_smell_changes"
  | "frequent_infections"
  | "poor_night_vision"
  | "no_other_signs"
  // Red-flag symptom screen (multi-select)
  | "rf_chest_pain"
  | "rf_blood_in_stool"
  | "rf_blood_in_urine"
  | "rf_unintentional_weight_loss"
  | "rf_suicidal_thoughts"
  | "rf_severe_persistent_headache"
  | "rf_neurological_symptoms"
  | "rf_breast_lump"
  | "rf_persistent_fever"
  | "no_red_flags"
  // Specific medications (multi-select). Captures the named drug classes the
  // engine actually models. The engine ALSO sets an `unlisted_medications`
  // risk flag whenever the user reports being on a prescription, because we
  // do not collect a free-text medication list — clinicians and pharmacists
  // remain the authoritative venue for full interaction screening.
  | "med_levothyroxine"
  | "med_ppi"
  | "med_metformin"
  | "med_ssri_serotonergic"
  | "med_statin"
  | "med_glucose_lowering"
  | "med_immunosuppressant"
  | "med_none_of_these"
  // Existing supplements (multi-select, prevents UL stacking)
  | "supp_multivitamin"
  | "supp_vitamin_d"
  | "supp_iron"
  | "supp_zinc"
  | "supp_calcium"
  | "supp_b_complex"
  | "supp_vitamin_a"
  | "supp_selenium"
  | "supp_iodine"
  | "supp_omega3"
  | "supp_other"
  | "no_existing_supplements"
  // Allergies (multi-select)
  | "allergy_fish"
  | "allergy_shellfish"
  | "allergy_soy"
  | "allergy_peanut"
  | "allergy_treenut"
  | "allergy_bee_products"
  | "allergy_dairy"
  | "allergy_egg"
  | "no_known_allergies"
  // Smoking (replaces alcohol_frequency in spirit; tobacco gets richer detail)
  | "smoking_never"
  | "smoking_former_remote"        // quit >10 years
  | "smoking_former_recent"        // quit ≤10 years
  | "smoking_current_light"        // <10/day
  | "smoking_current_heavy"        // ≥10/day
  // Vaping
  | "vaping_no"
  | "vaping_occasional"
  | "vaping_daily"
  // Alcohol — units per week (UK units; help text in question)
  | "alc_zero"
  | "alc_1_to_7"
  | "alc_8_to_14"
  | "alc_15_to_21"
  | "alc_22_to_35"
  | "alc_35_plus"
  // Alcohol binge frequency
  | "binge_never"
  | "binge_monthly"
  | "binge_weekly"
  | "binge_multiple_weekly"
  // Fruit and veg servings/day (one serving ≈ 80g / a fist)
  | "fv_zero_to_1"
  | "fv_2_to_3"
  | "fv_4"
  // Legacy bucket: split into fv_2_to_3 + fv_4 (2026-05-04). Retained so older
  // saved intakes parse cleanly; the deriver maps it to risk_moderate.
  | "fv_2_to_4"
  | "fv_5_to_7"
  | "fv_8_plus"
  // Fibre / wholegrains and legumes frequency
  | "fibre_rarely"
  | "fibre_some_days"
  | "fibre_most_days"
  | "fibre_daily"
  // Sugar-sweetened beverages per day (sodas, sweetened coffees, fruit juice, energy drinks, sweet tea)
  | "ssb_zero"
  | "ssb_one"
  | "ssb_two_to_three"
  | "ssb_four_plus"
  // Ultra-processed foods (NOVA-4) as a share of daily intake
  | "upf_minimal"
  | "upf_some"
  | "upf_about_half"
  | "upf_most"
  // Bowel pattern (Bristol-frequency simplification)
  | "bowel_less_than_3_per_week"
  | "bowel_3_to_6_per_week"
  | "bowel_1_to_2_per_day"
  | "bowel_3_plus_per_day"
  // GI symptoms (multi-select)
  | "gi_bloating"
  | "gi_reflux"
  | "gi_abdominal_pain"
  | "gi_alternating_constipation_diarrhea"
  | "gi_excessive_gas"
  | "no_gi_symptoms"
  // Blood pressure status
  | "bp_unknown"
  | "bp_normal"
  | "bp_borderline"
  | "bp_high_treated"
  | "bp_high_untreated"
  // Derived risk-signal levels
  | "risk_none"
  | "risk_low"
  | "risk_moderate"
  | "risk_high"
  | "former_remote"
  | "former_recent"
  | "current"
  | "present"
  // Derived nutrient signal strengths
  | "signal_strong"
  | "signal_moderate"
  | "signal_weak"
  | "signal_none";

export type AnswerMap = Partial<Record<QuestionId, QuestionOptionValue>>;

export type RiskFlag =
  | "under_18"
  | "pregnancy_or_breastfeeding"
  | "polypharmacy"
  | "blood_thinner_use"
  | "daily_aspirin_or_nsaid"
  | "ssri_or_serotonergic_use"
  | "glucose_lowering_med"
  | "levothyroxine_use"
  | "ppi_use"
  | "metformin_use"
  | "immunosuppressant_use"
  | "unlisted_medications"
  | "kidney_disease"
  | "liver_disease"
  | "thyroid_disorder"
  | "autoimmune_condition"
  | "kidney_stones"
  | "high_alcohol"
  | "current_smoker"
  | "former_recent_smoker"
  | "low_produce_intake"
  | "high_ssb_intake"
  | "high_ultra_processed_intake"
  | "high_blood_pressure"
  | "elevated_glycemic_risk"
  | "weight_loss_recent"
  | "unaddressed_perimenopause"
  | "ocp_combined"
  | "allergy_fish_or_shellfish"
  | "allergy_soy"
  | "allergy_bee_products"
  | "urgent_clinical_review"
  | "needs_clinician_review";

export interface QuestionOption {
  value: QuestionOptionValue;
  label: string;
  /** Optional one-line clarification rendered under the label. Use when the
   *  option name is ambiguous (e.g. dietary patterns, ultra-processed share). */
  description?: string;
  tags?: string[];
}

export interface Condition {
  questionId: QuestionId;
  includes?: QuestionOptionValue[];
  excludes?: QuestionOptionValue[];
}

export interface QuestionDefinition {
  id: QuestionId;
  section: QuestionSection;
  title: string;
  description?: string;
  maxSelections: number;
  required: boolean;
  options: QuestionOption[];
  showWhen?: Condition[];
}

export interface EvidenceReference {
  label: string;
  url: string;
  /**
   * ISO date the citation was last *manually* re-checked against current
   * literature. Many references were imported with a single uniform stamp
   * during initial catalog assembly — see the "Citation freshness" note in
   * the README. We treat this field as a TODO surface, not a guarantee:
   * a date older than 18 months is a hint that the source deserves another
   * look, not that it's wrong.
   */
  lastReviewed: string;
}

export type SupplementCategory =
  | "core_stack"
  | "conditional"
  | "exploratory"
  | "alternative_traditional";

export type QualityCertification =
  | "usp_verified"
  | "nsf_certified"
  | "nsf_certified_for_sport"
  | "informed_sport"
  | "informed_choice"
  | "third_party_coa";

export type ContaminantConcern =
  | "heavy_metals"
  | "oxidation_rancidity"
  | "microbial"
  | "pesticides"
  | "solvent_residue"
  | "adulteration"
  | "identity_substitution";

export interface QualityRequirements {
  preferredCertifications: QualityCertification[];
  contaminantConcerns: ContaminantConcern[];
  identityNotes?: string;
  formNotes?: string;
}

export type AffiliateEligibility =
  | "eligible"
  | "needs_clinician_context"
  | "ineligible";

export interface AffiliatePolicy {
  eligibility: AffiliateEligibility;
  reason?: string;
}

export interface GoalRelevance {
  when: Condition;
  because: string;
  effectSize: EffectSize;
  studiedFor: string;
}

export interface SupplementRule {
  id: string;
  slug: string;
  name: string;
  category: SupplementCategory;
  defaultDoseWindow: DoseWindow;
  preferredForms: string[];
  evidenceTier: EvidenceTier;
  primaryGoals: Goal[];
  minScheduleFitScore: number;
  baseScore: number;
  doseGuidance: string;
  timingGuidance: string;
  evaluationWindow: string;
  rationale: string[];
  evidence: EvidenceReference[];
  qualityRequirements: QualityRequirements;
  affiliatePolicy: AffiliatePolicy;
  goalRelevance?: GoalRelevance[];
  whyNotPrimary?: WhyNotPrimary[];
  includeIf?: Condition[];
  boostIf?: Condition[];
  optionalIf?: Condition[];
  excludeIf?: Condition[];
  clinicianReviewIf?: Condition[];
  sameWindowConflicts?: string[];
  stackConflicts?: string[];
}

export interface PersonalRelevance {
  because: string;
  studiedFor: string;
  effectSize: EffectSize;
}

export interface SupplementScore {
  supplementId: string;
  supplementSlug: string;
  name: string;
  category: SupplementCategory;
  status: RecommendationStatus;
  score: number;
  evidenceTier: EvidenceTier;
  doseWindow: DoseWindow;
  doseGuidance: string;
  timingGuidance: string;
  evaluationWindow: string;
  reasons: string[];
  blockers: string[];
  citations: EvidenceReference[];
  personalRelevance: PersonalRelevance[];
  whyNotPrimary: WhyNotPrimary[];
  qualityRequirements: QualityRequirements;
}

export interface BaselineNudge {
  id: string;
  title: string;
  body: string;
  why: string;
}

export type LifestyleDomain =
  | "hydration"
  | "sleep"
  | "movement"
  | "stress"
  | "nutrition"
  | "light"
  | "social"
  | "screen"
  | "medical_review";

export type LifestylePriority = "high" | "medium" | "low";

export interface LifestyleIntervention {
  id: string;
  domain: LifestyleDomain;
  priority: LifestylePriority;
  title: string;
  action: string;
  reason: string;
}

export type DailyPlanWindow =
  | "wake"
  | "morning"
  | "midday"
  | "late_afternoon"
  | "evening";

export interface DailyPlanItem {
  id: string;
  window: DailyPlanWindow;
  title: string;
  action: string;
  source: "lifestyle" | "supplement";
}

export interface DerivedProfileSummary {
  kind: string;
  label: string;
  emoji: string;
  oneLiner: string;
  whyThisMatters: string;
}

// ---------------------------------------------------------------------------
// Lab recommendations
// ---------------------------------------------------------------------------
// Personalised, printable list of lab tests the user can take to a clinician
// or a lab. Almavivo does NOT interpret results — every recommendation is
// framed as "discuss with your clinician". Rules are sourced from mainstream
// guideline bodies (USPSTF, AAFP, ATA, Endocrine Society, ADA, ACC/AHA, ACG,
// AAAAI, ASRM, ACOG, KDIGO, AASLD, NICE, ESC). Anything outside mainstream
// medicine is intentionally excluded — see lab-recommendations.ts for the
// "do not include" list and reasoning.
//
// Tier maps directly to UI prominence:
//   strongly_recommended — high pre-test probability, standard of care
//   recommended          — defensible in context, mainstream
//   optional             — defensible but specialist-leaning / advanced
// ---------------------------------------------------------------------------

export type LabTier = "strongly_recommended" | "recommended" | "optional";

export type LabDomain =
  | "anemia_iron"
  | "thyroid"
  | "vitamin_mineral"
  | "metabolic_glucose"
  | "lipids_cardiovascular"
  | "liver_kidney"
  | "inflammation_autoimmune"
  | "hormones_female"
  | "hormones_male"
  | "adrenal"
  | "gut_digestive"
  | "bone_health"
  | "cognitive_mood"
  | "preconception_fertility"
  | "mast_cell"
  | "fatigue_panel";

export type FastingRequirement = "none" | "preferred" | "required";

export interface LabRecommendation {
  id: string;
  name: string;
  synonyms?: string[];
  domain: LabDomain;
  tier: LabTier;
  // What the test measures, in one sentence the user can read.
  measures: string;
  // Why it's relevant *to this user* — written conversationally, references
  // the answers that triggered it. Multiple sentences acceptable.
  rationale: string;
  // Caveats the clinician should know — false positives, timing, drug effects.
  // Rendered on the printable sheet so the clinician sees them. Optional.
  caveats?: string;
  fasting: FastingRequirement;
  // Cycle-day or time-of-day constraint, e.g. "AM (7–11)" or "Day 3 if cycling".
  timing?: string;
  // Mainstream guideline anchor (short label).
  guidelineAnchor?: string;
  // Trigger codes — short labels of which signals contributed. Surfaced in UI
  // so the user can see "you got this because of: heavy menses, fatigue".
  triggers: string[];
}

export interface RecommendationPlan {
  answers: AnswerMap;
  riskFlags: RiskFlag[];
  questionsAsked: QuestionId[];
  stack: SupplementScore[];
  worthConsidering: SupplementScore[];
  traditionalAndEmerging: SupplementScore[];
  optionalAlternatives: SupplementScore[];
  excluded: SupplementScore[];
  schedule: Record<DoseWindow, SupplementScore[]>;
  baselineNudges: BaselineNudge[];
  lifestyleInterventions: LifestyleIntervention[];
  dailyPlan: DailyPlanItem[];
  profiles: DerivedProfileSummary[];
  labRecommendations: LabRecommendation[];
}
