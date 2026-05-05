import { deriveProfiles } from "./derive-profile";
import { withDerivedSignals } from "./derive-nutrient-signals";
import { deriveLabRecommendations } from "./lab-recommendations";
import { questionnaire } from "./questionnaire";
import { supplementCatalog } from "./supplements";
import {
  AnswerMap,
  BaselineNudge,
  Condition,
  DailyPlanItem,
  DailyPlanWindow,
  DoseWindow,
  LifestyleDomain,
  LifestyleIntervention,
  PersonalRelevance,
  QuestionDefinition,
  QuestionId,
  RecommendationPlan,
  RecommendationStatus,
  RiskFlag,
  SupplementRule,
  SupplementScore,
  WhyNotPrimary,
} from "./types";

// Some questions (currently only primary_goal) accept multi-select up to 3.
// They are stored as a comma-joined string. Split them out so the rest of
// the engine can keep treating answers as single-valued when there's only
// one pick, and as a set otherwise.
export function answerValues(raw: string | undefined): string[] {
  if (!raw) return [];
  if (!raw.includes(",")) return [raw];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

/** True if any of the user's picks for `questionId` is in `goals`. */
export function answerIncludes(
  answers: AnswerMap,
  questionId: keyof AnswerMap,
  goals: string[],
): boolean {
  const values = answerValues(answers[questionId]);
  return values.some((v) => goals.includes(v));
}

/** First (dominant) value the user picked, or undefined. */
export function firstAnswer(
  answers: AnswerMap,
  questionId: keyof AnswerMap,
): string | undefined {
  return answerValues(answers[questionId])[0];
}

/** True if any of the user's primary_goal picks equals `goal`. */
function isGoal(answers: AnswerMap, goal: string): boolean {
  return answerValues(answers.primary_goal).includes(goal);
}

function matchesCondition(condition: Condition, answers: AnswerMap): boolean {
  const raw = answers[condition.questionId];
  const values = answerValues(raw);

  if (values.length === 0) {
    return false;
  }

  if (condition.includes) {
    const allowed = condition.includes;
    // multi-value answer matches if ANY of the user's picks is allowed
    if (!values.some((v) => allowed.includes(v as typeof allowed[number]))) {
      return false;
    }
  }

  if (condition.excludes) {
    const blocked = condition.excludes;
    // multi-value answer fails the condition if ANY pick is blocked
    if (values.some((v) => blocked.includes(v as typeof blocked[number]))) {
      return false;
    }
  }

  return true;
}

function matchesAll(conditions: Condition[] | undefined, answers: AnswerMap): boolean {
  if (!conditions || conditions.length === 0) {
    return false;
  }

  return conditions.every((condition) => matchesCondition(condition, answers));
}

function matchesAny(conditions: Condition[] | undefined, answers: AnswerMap): boolean {
  if (!conditions || conditions.length === 0) {
    return false;
  }

  return conditions.some((condition) => matchesCondition(condition, answers));
}

export function getVisibleQuestions(answers: AnswerMap): QuestionDefinition[] {
  return questionnaire.filter((question) => {
    if (!question.showWhen || question.showWhen.length === 0) {
      return true;
    }

    return matchesAll(question.showWhen, answers);
  });
}

export function getQuestionIdsForFlow(answers: AnswerMap): QuestionId[] {
  return getVisibleQuestions(answers).map((question) => question.id);
}

export function collectRiskFlags(answers: AnswerMap): RiskFlag[] {
  const flags = new Set<RiskFlag>();

  if (answers.age_band === "under_18") {
    flags.add("under_18");
    flags.add("needs_clinician_review");
  }

  if (
    answers.pregnant_or_breastfeeding === "yes" ||
    answers.pregnant_or_breastfeeding === "not_sure"
  ) {
    flags.add("pregnancy_or_breastfeeding");
    flags.add("needs_clinician_review");
  }

  if (answers.medication_profile === "polypharmacy") {
    flags.add("polypharmacy");
    flags.add("needs_clinician_review");
  }

  // Unlisted-medications banner: any user who reports being on a prescription
  // (some_rx OR polypharmacy) gets this flag, because the engine only models
  // a small set of named drug classes (anticoagulants, SSRIs, glucose-lowering
  // agents, statins, levothyroxine, PPIs, metformin, immunosuppressants). The
  // honest position is to surface a "we did not ask you to list specific
  // drugs; check with your pharmacist" notice rather than imply broader
  // safety than we deliver.
  if (
    answers.medication_profile === "some_rx" ||
    answers.medication_profile === "polypharmacy"
  ) {
    flags.add("unlisted_medications");
  }

  if (
    answers.blood_thinner_use === "yes" ||
    answers.blood_thinner_use === "not_sure"
  ) {
    flags.add("blood_thinner_use");
  }

  // The specific_medications question is multi-select. We map each picked
  // option onto a typed RiskFlag so downstream rule conditions stay readable.
  if (answerIncludes(answers, "specific_medications", ["med_levothyroxine"])) {
    flags.add("levothyroxine_use");
  }
  if (answerIncludes(answers, "specific_medications", ["med_ppi"])) {
    flags.add("ppi_use");
  }
  if (answerIncludes(answers, "specific_medications", ["med_metformin"])) {
    flags.add("metformin_use");
  }
  if (
    answerIncludes(answers, "specific_medications", ["med_immunosuppressant"])
  ) {
    flags.add("immunosuppressant_use");
    flags.add("needs_clinician_review");
  }
  // Note: med_ssri_serotonergic, med_statin, and med_glucose_lowering are
  // captured here but are also collected by the existing dedicated
  // ssri_or_serotonergic_use, statin_use, and glucose_lowering_med
  // questions — keeping both wires the multi-select up without breaking the
  // older boolean-style rules until those are migrated.

  if (answers.kidney_history === "yes" || answers.kidney_history === "not_sure") {
    flags.add("kidney_disease");
    flags.add("needs_clinician_review");
  }

  if (answers.liver_history === "yes" || answers.liver_history === "not_sure") {
    flags.add("liver_disease");
    flags.add("needs_clinician_review");
  }

  if (answers.thyroid_disorder === "yes" || answers.thyroid_disorder === "not_sure") {
    flags.add("thyroid_disorder");
  }

  if (
    answers.autoimmune_condition === "yes" ||
    answers.autoimmune_condition === "not_sure"
  ) {
    flags.add("autoimmune_condition");
  }

  if (answers.kidney_stones === "yes" || answers.kidney_stones === "not_sure") {
    flags.add("kidney_stones");
  }

  if (answers.daily_aspirin_or_nsaid === "yes" || answers.daily_aspirin_or_nsaid === "not_sure") {
    flags.add("daily_aspirin_or_nsaid");
  }

  if (
    answers.ssri_or_serotonergic_use === "yes" ||
    answers.ssri_or_serotonergic_use === "not_sure"
  ) {
    flags.add("ssri_or_serotonergic_use");
  }

  if (
    answers.glucose_lowering_med === "yes" ||
    answers.glucose_lowering_med === "not_sure"
  ) {
    flags.add("glucose_lowering_med");
    flags.add("needs_clinician_review");
  }

  if (
    answers.derived_alcohol_risk === "risk_high"
  ) {
    flags.add("high_alcohol");
  }

  if (answers.derived_smoking_risk === "current") {
    flags.add("current_smoker");
  }
  if (answers.derived_smoking_risk === "former_recent") {
    flags.add("former_recent_smoker");
  }

  // Only the lowest-decile intake (0–1 servings/day) earns the top-of-page
  // "Important" badge. The 2–3 bucket below WHO target is handled by a
  // lifestyle intervention card with neutral framing — see the per-tier blocks
  // in collectLifestyleInterventions. Aune 2017: the 0→2 servings segment is
  // the steepest part of the dose-response curve, so reserving the prominent
  // flag for that band keeps it credible.
  if (answers.derived_produce_risk === "risk_high") {
    flags.add("low_produce_intake");
  }

  if (answers.ssb_intake === "ssb_two_to_three" || answers.ssb_intake === "ssb_four_plus") {
    flags.add("high_ssb_intake");
  }

  if (
    answers.derived_diet_quality_risk === "risk_high" ||
    answers.ultra_processed_intake === "upf_most"
  ) {
    flags.add("high_ultra_processed_intake");
  }

  if (
    answers.blood_pressure_status === "bp_high_treated" ||
    answers.blood_pressure_status === "bp_high_untreated"
  ) {
    flags.add("high_blood_pressure");
  }

  if (
    answers.derived_glycemic_risk === "risk_high" ||
    answers.derived_glycemic_risk === "risk_moderate"
  ) {
    flags.add("elevated_glycemic_risk");
  }

  if (answers.weight_change_recent === "lost_weight") {
    flags.add("weight_loss_recent");
    flags.add("needs_clinician_review");
  }

  // Perimenopause symptoms reported but not currently being managed
  if (
    answers.perimenopause_symptoms === "hot_flashes" ||
    answers.perimenopause_symptoms === "perimenopause_mixed"
  ) {
    flags.add("unaddressed_perimenopause");
  }

  // Combined oral contraceptive — depletes B6, folate, magnesium; St John's
  // Wort + vitex interactions are handled at the supplement level.
  if (answers.contraception_type === "combined_pill") {
    flags.add("ocp_combined");
  }

  // Allergy aggregations (multi-select stored as comma list)
  const allergies = answerValues(answers.known_allergies);
  if (allergies.includes("allergy_fish") || allergies.includes("allergy_shellfish")) {
    flags.add("allergy_fish_or_shellfish");
  }
  if (allergies.includes("allergy_soy")) {
    flags.add("allergy_soy");
  }
  if (allergies.includes("allergy_bee_products")) {
    flags.add("allergy_bee_products");
  }

  // Urgent red-flag interception — anything in this set means "go see a doctor first".
  if (answers.derived_red_flag === "present") {
    flags.add("urgent_clinical_review");
    flags.add("needs_clinician_review");
  }

  return Array.from(flags);
}

function scoreScheduleFit(rule: SupplementRule): number {
  return rule.defaultDoseWindow === "morning" || rule.defaultDoseWindow === "evening"
    ? 10
    : 0;
}

const conditionLabels: Partial<Record<QuestionId, string>> = {
  pregnant_or_breastfeeding: "pregnancy or breastfeeding",
  blood_thinner_use: "blood-thinner use",
  statin_use: "current statin use",
  migraine_pattern: "your migraine pattern",
  joint_stiffness: "joint stiffness or pain",
  kidney_history: "a history of kidney issues",
  liver_history: "a history of liver issues",
  thyroid_disorder: "a thyroid condition",
  autoimmune_condition: "an autoimmune condition",
  kidney_stones: "kidney stones",
  medication_profile: "medication load (interaction risk)",
  lab_vitamin_d_status: "your reported vitamin D status",
  lab_ferritin_status: "your reported ferritin status",
  lab_b12_status: "your reported B12 status",
  lab_triglycerides_status: "your reported triglyceride status",
  fish_intake: "your reported fish intake",
  diet_pattern: "your diet pattern",
  age_band: "your age band",
};

function conditionLabel(qid: QuestionId): string {
  return conditionLabels[qid] ?? qid.replaceAll("_", " ");
}

function describeExclusion(rule: SupplementRule, answers: AnswerMap): string {
  const hit = (rule.excludeIf ?? []).find((c) => matchesCondition(c, answers));
  if (!hit) return `${rule.name} is not appropriate based on your safety answers.`;
  return `Excluded because of ${conditionLabel(hit.questionId)}.`;
}

function describeClinicianReview(rule: SupplementRule, answers: AnswerMap): string {
  const hit = (rule.clinicianReviewIf ?? []).find((c) => matchesCondition(c, answers));
  if (!hit) return `Talk to a clinician before starting ${rule.name}.`;
  return `Talk to a clinician first because of ${conditionLabel(hit.questionId)}.`;
}

function describeIncludeMiss(rule: SupplementRule, _answers: AnswerMap): string {
  const goals = rule.primaryGoals.slice(0, 3).join(", ");
  return `Mainly relevant for goals like ${goals} — those didn't come up in your answers.`;
}

function collectPersonalRelevance(rule: SupplementRule, answers: AnswerMap): PersonalRelevance[] {
  if (!rule.goalRelevance) {
    return [];
  }

  return rule.goalRelevance
    .filter((entry) => matchesCondition(entry.when, answers))
    .map((entry) => ({
      because: entry.because,
      studiedFor: entry.studiedFor,
      effectSize: entry.effectSize,
    }));
}

function scoreSupplement(rule: SupplementRule, answers: AnswerMap): SupplementScore {
  const reasons: string[] = [];
  const blockers: string[] = [];
  const personalRelevance = collectPersonalRelevance(rule, answers);
  let status: RecommendationStatus = "do_not_recommend";
  let score = rule.baseScore;

  const baseScore: SupplementScore = {
    supplementId: rule.id,
    supplementSlug: rule.slug,
    name: rule.name,
    category: rule.category,
    status,
    score: 0,
    evidenceTier: rule.evidenceTier,
    doseWindow: rule.defaultDoseWindow,
    doseGuidance: rule.doseGuidance,
    timingGuidance: rule.timingGuidance,
    evaluationWindow: rule.evaluationWindow,
    reasons,
    blockers,
    citations: rule.evidence,
    personalRelevance,
    whyNotPrimary: rule.whyNotPrimary ?? [],
    qualityRequirements: rule.qualityRequirements,
  };

  if (matchesAny(rule.excludeIf, answers)) {
    blockers.push(describeExclusion(rule, answers));
    return baseScore;
  }

  // Pediatric guard. Under 18s should not be auto-recommended supplements
  // outside the most basic essentials (vitamin D, omega-3, multivitamin, iron
  // when indicated). Anything else gets routed to clinician review with a
  // dedicated explanation, regardless of how strong the signal looks.
  const PEDIATRIC_ALLOWED = new Set([
    "vitamin_d3",
    "omega3",
    "multivitamin",
    "iron",
    "vitamin_b12",
    "calcium",
    "psyllium",
    "protein_powder",
    "probiotic",
  ]);
  if (answers.age_band === "under_18" && !PEDIATRIC_ALLOWED.has(rule.id)) {
    blockers.push(
      "You're under 18 — this item isn't included in the auto-generated stack for that reason. A clinician (paediatrician, dietitian) is the right route.",
    );
    return { ...baseScore, status: "needs_clinician_review" };
  }

  // 80+ soft guard. Polypharmacy norms, frailty, swallowing burden, and
  // narrower interaction tolerance push the bar higher in this group. We
  // don't hard-exclude; we route most non-essentials to clinician review
  // while keeping protein, creatine, vitamin D, B12, calcium, omega-3,
  // multivitamin, iron, and probiotics available where the engine has
  // already cleared them.
  const ELDERLY_ALLOWED = new Set([
    "vitamin_d3",
    "omega3",
    "multivitamin",
    "iron",
    "vitamin_b12",
    "calcium",
    "psyllium",
    "protein_powder",
    "probiotic",
    "creatine_monohydrate",
    "magnesium",
  ]);
  if (answers.age_band === "80_plus" && !ELDERLY_ALLOWED.has(rule.id)) {
    blockers.push(
      "You're 80+ — past this age the engine routes most non-essential supplements to clinician review. Pill burden, frailty, and interaction tolerance shift the bar; a clinician (ideally one who can review your full medication list) is the right next step.",
    );
    return { ...baseScore, status: "needs_clinician_review" };
  }

  if (matchesAny(rule.clinicianReviewIf, answers)) {
    blockers.push(describeClinicianReview(rule, answers));
    status = "needs_clinician_review";
    score -= 10;
  }

  if (rule.includeIf && !matchesAll(rule.includeIf, answers)) {
    blockers.push(describeIncludeMiss(rule, answers));
    return { ...baseScore, status };
  }

  if (matchesAny(rule.boostIf, answers)) {
    score += 15;
    reasons.push("Matched one or more stronger-fit evidence or need signals.");
  }

  if (matchesAny(rule.optionalIf, answers)) {
    score += 5;
    reasons.push("Matched a narrower or conditional fit signal.");
  }

  if (personalRelevance.length > 0) {
    score += personalRelevance.length * 4;
  }

  const scheduleFitScore = scoreScheduleFit(rule);
  score += scheduleFitScore;

  if (scheduleFitScore < rule.minScheduleFitScore) {
    blockers.push("Poor fit for the two-dose adherence model.");
    score -= 20;
  }

  const matchedAnySignal =
    personalRelevance.length > 0 ||
    matchesAny(rule.boostIf, answers) ||
    matchesAny(rule.optionalIf, answers);

  // Baseline allow-list: rules permitted to reach "recommended" without any
  // matched personal signal. Vitamin D is the only entry — insufficiency is
  // common in indoor-living adults regardless of intake/symptoms, and the safety
  // margin at maintenance doses is wide. Every other supplement must earn its
  // recommendation from a user signal (boost / optional / goalRelevance match).
  const BASELINE_ALLOWED = new Set(["vitamin_d3"]);
  const canRecommendWithoutSignal = BASELINE_ALLOWED.has(rule.id);

  if (status !== "needs_clinician_review") {
    if (rule.category === "alternative_traditional") {
      if (matchedAnySignal) {
        status = "traditional_use";
      } else {
        status = "do_not_recommend";
        blockers.push(
          `Traditional-use option with weaker modern evidence. Nothing in your answers points to it specifically.`,
        );
      }
    } else if (
      rule.evidenceTier === "tier_a" &&
      score >= 45 &&
      rule.category === "core_stack" &&
      (matchedAnySignal || canRecommendWithoutSignal)
    ) {
      status = "recommended";
    } else if (
      (rule.evidenceTier === "tier_a" || rule.evidenceTier === "tier_b") &&
      score >= 38 &&
      rule.category === "core_stack" &&
      (matchedAnySignal || canRecommendWithoutSignal)
    ) {
      status = "recommended";
    } else if (matchedAnySignal) {
      status = "worth_considering";
    } else {
      status = "do_not_recommend";
      const goalsList = rule.primaryGoals.slice(0, 3).join(", ");
      blockers.push(
        `No matching signal in your answers. ${rule.name} is mainly used for ${goalsList} — none of those came through strongly enough.`,
      );
    }
  }

  reasons.push(...rule.rationale);

  return {
    ...baseScore,
    status,
    score,
    reasons,
    blockers,
  };
}

function removeConflictingScores(scores: SupplementScore[], rules: SupplementRule[]): SupplementScore[] {
  const byId = new Map(scores.map((score) => [score.supplementId, score]));

  for (const rule of rules) {
    const current = byId.get(rule.id);

    if (!current || current.status === "do_not_recommend") {
      continue;
    }

    for (const conflictId of rule.stackConflicts ?? []) {
      const conflicting = byId.get(conflictId);
      if (!conflicting) {
        continue;
      }

      if (conflicting.score >= current.score) {
        if (current.status === "recommended") {
          current.status = "worth_considering";
          if (!current.whyNotPrimary.includes("overlap_with_primary")) {
            current.whyNotPrimary = [...current.whyNotPrimary, "overlap_with_primary"];
          }
        }
        current.blockers.push("De-prioritized due to stack overlap.");
      }
    }
  }

  return Array.from(byId.values());
}

function collectBaselineNudges(answers: AnswerMap): BaselineNudge[] {
  const nudges: BaselineNudge[] = [];

  const cognitiveBottleneck = answers.cognitive_bottleneck;
  const sleepQuality = answers.sleep_quality;
  const stressLoad = answers.stress_load;
  const exercisePattern = answers.exercise_pattern;
  const alcoholRisk = answers.derived_alcohol_risk;
  const isHighAlcohol = alcoholRisk === "risk_moderate" || alcoholRisk === "risk_high";
  const sunExposure = answers.sun_exposure;
  const isCognitiveGoal = answerIncludes(answers, "primary_goal", [
    "cognitive_performance",
    "cognitive_longevity",
  ]);

  if (isCognitiveGoal && (sleepQuality === "poor" || sleepQuality === "fair")) {
    nudges.push({
      id: "fix_sleep_before_nootropics",
      title: "Sleep first, supplements later",
      body: "Poor sleep wrecks attention, working memory, and recall more than any nootropic can repair. A consistent sleep window and a hard caffeine cutoff (8–10 hours before bed) usually beats adding another capsule.",
      why: "You picked a cognitive goal but reported poor or fair sleep. Sleep is the single largest cognitive intervention available — much larger than any of the supplements we'd recommend.",
    });
  }

  if (
    isCognitiveGoal &&
    (cognitiveBottleneck === "afternoon_dip" || cognitiveBottleneck === "morning_startup")
  ) {
    nudges.push({
      id: "audit_caffeine_timing",
      title: "Audit your caffeine timing first",
      body: "If you're feeling the afternoon dip or struggling to start, the issue is often caffeine timing, not capacity. Try a hard last-coffee cutoff at lunch and a small (50–100 mg) caffeine + 200 mg L-theanine pairing in the morning.",
      why: "Most afternoon-dip and morning-startup complaints respond to caffeine scheduling more than to a new supplement.",
    });
  }

  if (
    (isGoal(answers, "stress") || stressLoad === "high") &&
    exercisePattern === "mostly_sedentary"
  ) {
    nudges.push({
      id: "movement_for_stress",
      title: "Movement matters more than adaptogens here",
      body: "For stress, even 20–30 minutes of moderate movement most days has a larger and more reliable effect than any adaptogen. Walking counts.",
      why: "You flagged stress but reported mostly sedentary activity. Aerobic movement is one of the best-evidenced stress interventions.",
    });
  }

  if (
    (isGoal(answers, "sleep") || sleepQuality === "poor" || sleepQuality === "fair") &&
    isHighAlcohol
  ) {
    nudges.push({
      id: "alcohol_and_sleep",
      title: "Alcohol is probably the bigger lever",
      body: "Alcohol fragments sleep architecture even at modest doses. Cutting back, especially within 3 hours of bed, usually outperforms any sleep supplement.",
      why: "You flagged sleep concerns alongside frequent alcohol use. The supplement effect ceiling is low until that's addressed.",
    });
  }

  if (
    isGoal(answers, "performance") &&
    exercisePattern === "mostly_sedentary"
  ) {
    nudges.push({
      id: "training_first",
      title: "No supplement substitutes for the training itself",
      body: "Performance supplements only have something to amplify if there's training underneath them. A consistent base of 3–4 sessions per week comes first.",
      why: "You picked exercise performance as a goal but flagged a mostly sedentary pattern.",
    });
  }

  if (sunExposure === "none_or_low" && !isGoal(answers, "general_nutrition")) {
    nudges.push({
      id: "sunlight_exposure",
      title: "Get some morning daylight",
      body: "Even 10–15 minutes of outdoor light early in the day affects circadian rhythm, mood, and downstream sleep — independent of vitamin D status.",
      why: "You reported low sun exposure. Daylight has effects beyond vitamin D that supplementation doesn't replicate.",
    });
  }

  if (answers.sleep_hours === "lt_6h") {
    nudges.push({
      id: "short_sleep",
      title: "Sleep duration is the lever, not a supplement",
      body: "Less than 6 hours a night affects mood, cognition, immune function, and metabolic markers more than any supplement on this site can correct. Adding 60–90 minutes is the highest-leverage change available.",
      why: "You reported sleeping under 6 hours. Supplements cannot meaningfully compensate for chronic short sleep.",
    });
  }

  if (answers.sitting_hours === "gt_12h" || answers.sitting_hours === "8_to_12h") {
    nudges.push({
      id: "sitting_load",
      title: "Move every hour, even briefly",
      body: "Long sitting bouts have independent effects on metabolic and cardiovascular markers. Five minutes of movement every hour is the simplest counter.",
      why: "You reported high daily sitting time, which carries metabolic risks supplements don't address.",
    });
  }

  if (answers.water_intake === "lt_1l") {
    nudges.push({
      id: "hydration",
      title: "Hydration first",
      body: "Under a litre a day for most adults is on the low side, especially if you're caffeinated or training. Aim for pale-yellow urine as the simplest gauge.",
      why: "Low fluid intake affects energy, cognition, and gut function before any supplement gap shows up.",
    });
  }

  if (answers.social_connection === "isolated") {
    nudges.push({
      id: "social_connection",
      title: "Connection matters as much as nutrition",
      body: "Loneliness has effect sizes on long-term health that rival smoking and inactivity. No supplement competes with regular contact.",
      why: "You reported feeling socially isolated. We don't have a supplement for this and we're honest about that.",
    });
  }

  if (
    answers.screen_hours === "gt_12h" &&
    (isGoal(answers, "cognitive_performance") || isGoal(answers, "sleep"))
  ) {
    nudges.push({
      id: "screen_load",
      title: "Trim evening screen time",
      body: "Heavy late-evening screen exposure pushes back sleep onset and reduces sleep depth. Earlier dimming has a larger effect than blue-blocker glasses.",
      why: "You reported very high daily screen hours alongside a sleep- or focus-related goal.",
    });
  }

  if (answers.time_in_nature === "almost_never") {
    nudges.push({
      id: "outdoor_time",
      title: "Get outside, briefly, regularly",
      body: "Even short outdoor exposures move stress, sleep, and mood markers. The bar is low — a 10-minute walk counts.",
      why: "Outdoor time has effects on stress and sleep we can't replicate with a supplement.",
    });
  }

  if (answers.snoring_pattern === "loud_snoring_or_apnea") {
    nudges.push({
      id: "sleep_apnea_screen",
      title: "Get screened for sleep apnea before any sleep supplement",
      body: "Loud snoring or witnessed breathing pauses are a sleep apnea signal. Untreated apnea drives daytime sleepiness, cardiovascular risk, and cognitive complaints — none of which a supplement can fix. A home sleep study is the right next step.",
      why: "You flagged loud snoring or witnessed pauses. This is the single most important non-supplement intervention available to you.",
    });
  }

  if (answers.caffeine_cutoff === "after_3pm" && (answers.sleep_quality === "poor" || answers.sleep_quality === "fair")) {
    nudges.push({
      id: "caffeine_cutoff_too_late",
      title: "Pull your caffeine cutoff earlier",
      body: "Caffeine has a 5–7 hour half-life. After-3pm caffeine routinely fragments deep sleep without you noticing. Try shifting it to before noon for two weeks before adding a sleep supplement.",
      why: "You reported poor sleep alongside late caffeine. Timing fixes usually outperform supplements here.",
    });
  }

  if (answers.bedtime_consistency === "irregular" && (isGoal(answers, "sleep") || answers.sleep_quality === "poor" || answers.sleep_quality === "fair")) {
    nudges.push({
      id: "bedtime_anchor",
      title: "Anchor a consistent bedtime",
      body: "Variable bedtimes desynchronise circadian rhythm and reduce sleep depth. A 30-minute window most nights is more powerful than any sleep aid.",
      why: "You reported irregular bedtimes alongside sleep concerns.",
    });
  }

  if (
    (isGoal(answers, "performance") || isGoal(answers, "cognitive_performance")) &&
    answers.cardio_minutes_weekly === "lt_60_min" &&
    answers.strength_sessions_weekly === "zero_strength"
  ) {
    nudges.push({
      id: "establish_training_base",
      title: "Build a training base first",
      body: "For performance and cognition, regular cardio and resistance training have larger effects than any supplement. The bar to start is low: two short sessions per week, alternating types.",
      why: "You picked a performance or cognitive goal but reported very little weekly training.",
    });
  }

  if (answers.daily_steps === "lt_5k") {
    nudges.push({
      id: "daily_steps_low",
      title: "Daily steps move the dial",
      body: "Total daily movement matters more than any single workout. Building toward 7,000–8,000 steps a day correlates with mortality and metabolic markers across multiple studies.",
      why: "Low daily activity has effects supplements don't address.",
    });
  }

  // ---------------------------------------------------------------------------
  // Red-flag interception — placed early so it dominates anything else shown.
  // ---------------------------------------------------------------------------
  if (answers.derived_red_flag === "present") {
    const picks = answerValues(answers.red_flag_symptoms).filter((p) => p && p !== "no_red_flags");
    const urgent = picks.includes("rf_chest_pain") ||
      picks.includes("rf_neurological_symptoms") ||
      picks.includes("rf_suicidal_thoughts") ||
      picks.includes("rf_severe_persistent_headache");
    nudges.unshift({
      id: "urgent_clinical_review",
      title: urgent
        ? "Stop here — see a doctor before any supplement change"
        : "See a doctor first — these symptoms come before any supplement plan",
      body:
        "You flagged one or more symptoms that need a clinical work-up: blood in stool or urine, unintended weight loss, persistent headache, neurological symptoms, suicidal thoughts, chest pain, a new breast lump, or a persistent unexplained fever. None of these belong in a supplement plan. Book a clinical appointment first. If you're in immediate danger or having thoughts of suicide, contact your local emergency number now (US/UK: 999/911) — Samaritans (UK 116 123), 988 in the US, or your local crisis line.",
      why: "Red-flag symptoms can indicate conditions that supplements may mask or worsen. Diagnosis and treatment from a qualified clinician comes before any other change.",
    });
  }

  // Smoking — beta-carotene risk is handled at supplement level; nudge here.
  if (answers.derived_smoking_risk === "current") {
    nudges.push({
      id: "smoking_first",
      title: "Quitting smoking is the single highest-leverage change available",
      body:
        "Nothing on this site approaches the health return of quitting. Vitamin C and antioxidant requirements are higher in smokers, and high-dose beta-carotene is contraindicated (CARET/ATBC trials showed increased lung cancer mortality). Consider reaching out to a smoking cessation service — combining behavioural support with NRT or varenicline roughly triples quit rates.",
      why: "Continuing to smoke caps the benefit of any supplement plan and excludes some safety-relevant options outright.",
    });
  }

  // Sugar-sweetened beverages
  if (answers.ssb_intake === "ssb_two_to_three" || answers.ssb_intake === "ssb_four_plus") {
    nudges.push({
      id: "ssb_swap",
      title: "Sugary drinks are usually the biggest single dietary lever",
      body:
        "Each daily 12-oz / 350 ml sugar-sweetened drink raises type-2 diabetes risk ~18% and CHD risk ~17% in long-term cohorts. Swap one for sparkling water, plain tea or coffee. Diet drinks are a step up; plain water is the goal.",
      why: "Liquid sugar bypasses normal satiety regulation, and the dose-response is steep.",
    });
  }

  // Ultra-processed food share
  if (
    answers.derived_diet_quality_risk === "risk_high" ||
    answers.derived_diet_quality_risk === "risk_moderate"
  ) {
    nudges.push({
      id: "ultra_processed_share",
      title: "Cutting ultra-processed share beats any supplement on this list",
      body:
        "An umbrella review of 45 meta-analyses (Lane et al. 2024, BMJ) linked high ultra-processed food intake with higher all-cause mortality, cardiovascular disease, type-2 diabetes, anxiety, and depression — independent of total calories and BMI. Start by swapping one daily UPF item (sweetened cereal, packaged snack, soft drink, ready meal) for a less-processed alternative, then build.",
      why: "UPF is the dominant dietary correlate of cardiometabolic and mental-health outcomes in modern observational evidence. No supplement closes the gap it creates.",
    });
  }

  // Low fruit & veg intake (lowest-decile only — moderate-risk users are
  // handled by the lifestyle-intervention card with softer framing)
  if (answers.derived_produce_risk === "risk_high") {
    nudges.push({
      id: "produce_low",
      title: "Get to 5-a-day before any 'antioxidant' supplement",
      body:
        "Whole fruit and veg deliver fibre, polyphenols, vitamins, and minerals in combinations a capsule can't replicate. The Aune 2017 IJE meta-analysis (95 cohorts, ~2M participants) shows the steepest mortality drop is in the 0→2 servings/day range — the segment you are in now. Easiest start: a piece of fruit at breakfast and a fistful of veg at lunch and dinner. Mortality benefit continues up to ~7–8 servings/day.",
      why: "Low produce intake is one of the strongest single predictors of all-cause mortality. No supplement substitutes for it.",
    });
  }

  // Blood pressure
  if (answers.blood_pressure_status === "bp_high_untreated") {
    nudges.push({
      id: "bp_untreated",
      title: "See a doctor about your blood pressure",
      body:
        "Untreated hypertension is one of the largest single contributors to stroke and heart-disease risk. Lifestyle changes (DASH diet, sodium reduction, weight loss, exercise, alcohol reduction) help, but starting with a clinician's reading and plan is the right next step.",
      why: "You reported high blood pressure that isn't currently treated.",
    });
  } else if (answers.blood_pressure_status === "bp_unknown") {
    nudges.push({
      id: "bp_unknown",
      title: "Get your blood pressure checked",
      body:
        "Hypertension is mostly silent — most people who have it don't know. A pharmacy or home cuff is fine. Aim for an average under 135/85.",
      why: "Blood pressure is the most actionable cardiovascular number for the cost.",
    });
  }

  // Bowel pattern — constipation
  if (answers.bowel_pattern === "bowel_less_than_3_per_week") {
    nudges.push({
      id: "constipation_pattern",
      title: "Address constipation with food and water before fibre supplements",
      body:
        "Less than 3 bowel movements a week often responds to two changes: enough fluid (most adults aim for 1.5–2 L plus what's lost to caffeine and exercise) and regular fibre intake from food (oats, beans, fruit and veg with skin, nuts, seeds). If a bowel-habit change is recent, see a clinician.",
      why: "Constipation is a frequent reason people reach for supplements. The food-and-water lever is bigger and cheaper.",
    });
  }

  // Existing supplement stacking — UL guardrails
  const existingSupps = answerValues(answers.existing_supplements ?? "");
  const stackedNutrients = existingSupps.filter((v) => v.startsWith("supp_") && v !== "supp_other");
  if (stackedNutrients.length >= 2) {
    nudges.push({
      id: "ul_stacking",
      title: "Audit what you're already taking before adding more",
      body:
        "Several nutrients have upper-tolerable-intake levels (vitamin A, D, niacin, iron, zinc, selenium, iodine, B6) where chronic over-supplementation does measurable harm. Read the label of your existing multivitamin and check the totals against any single-nutrient supplement you're considering.",
      why: "You reported already taking multiple supplements. The risk of accidental over-dosing rises with each additional product.",
    });
  }

  // Combined OCP — nutrient depletion picture
  if (answers.contraception_type === "combined_pill") {
    nudges.push({
      id: "ocp_nutrient_depletion",
      title: "Combined pill mildly depletes a few B-vitamins and magnesium",
      body:
        "The combined oral contraceptive can lower B6, folate, B12, and magnesium status modestly over time. A balanced multivitamin or B-complex covers it; St John's Wort interacts with the pill and is held back; vitex shouldn't be combined with hormonal contraception.",
      why: "Long-term combined-pill use shifts a few nutrient priorities and excludes some botanicals from this plan.",
    });
  }

  // Perimenopause — non-supplement context
  if (
    answers.perimenopause_symptoms === "hot_flashes" ||
    answers.perimenopause_symptoms === "perimenopause_mixed"
  ) {
    nudges.push({
      id: "perimenopause_clinical_first",
      title: "Talk to a clinician about perimenopause options first",
      body:
        "Modern menopause guidance has shifted; menopausal hormone therapy (MHT) is again first-line for moderate-to-severe symptoms in most women without contraindications. Botanicals such as black cohosh, soy isoflavones, and evening primrose have weaker effect sizes — useful adjuncts, not substitutes for a clinical conversation.",
      why: "Effective treatments exist that supplements don't replace.",
    });
  }

  // Frequent night-time awakenings — sleep architecture nudge
  if (answers.awakenings === "frequent_awakenings") {
    nudges.push({
      id: "sleep_maintenance",
      title: "Frequent waking points to specific causes — investigate before sedating",
      body:
        "Multiple wake-ups per night often reflect alcohol within 3 hours of bed, a hot bedroom, late caffeine, anxiety, or (in some cases) sleep apnea. Magnesium glycinate and glycine have evidence for sleep maintenance — but the bigger lever is usually the upstream cause.",
      why: "You reported waking multiple times most nights. Sedating supplements paper over rather than fix maintenance issues.",
    });
  }

  // Underweight band — clinician handoff rather than nutrition recipe
  if (answers.weight_band === "underweight_band") {
    nudges.push({
      id: "underweight_clinical",
      title: "Being underweight has its own risks — a clinician can help define a baseline",
      body:
        "Low BMI in adults is associated with higher mortality and infection risk. A clinician can rule out absorption issues, thyroid problems, or eating-disorder-related concerns before any supplement plan.",
      why: "You reported a weight category in the underweight range.",
    });
  }

  // Heavy/binge alcohol — re-emphasise above the existing alcohol-and-sleep nudge
  if (answers.derived_alcohol_risk === "risk_high") {
    nudges.push({
      id: "alcohol_high_intake",
      title: "Your reported alcohol intake is in a higher-risk band",
      body:
        "More than 21 units per week, or repeated binge episodes, raises cardiovascular event risk, depletes B-vitamins, and limits the value of any sleep supplement. The single most useful change you could make is reducing weekly intake toward 14 units or below, with at least 2 alcohol-free days per week.",
      why: "You reported alcohol intake in the upper risk bands.",
    });
  }

  // Body-sign-driven testing prompts. These fire when several signs converge on
  // a specific deficiency hypothesis but the user has no recent labs. We
  // recommend a test before supplementation rather than blindly supplementing.
  if (
    (answers.derived_iron_signal === "signal_strong" ||
      answers.derived_iron_signal === "signal_moderate") &&
    answers.lab_ferritin_status === "none"
  ) {
    nudges.push({
      id: "test_ferritin",
      title: "Get a ferritin test before supplementing iron",
      body: "Your answers contain several signs that can point to low iron stores (e.g. spoon-shaped nails, pale skin, diffuse hair shedding, cold extremities, restless legs). A simple ferritin blood test costs little and removes the guesswork — iron supplementation without confirmed deficiency carries real downsides.",
      why: "Multiple iron-relevant body signs converged in your answers but you have no recent ferritin labs.",
    });
  }

  if (
    (answers.derived_b12_signal === "signal_strong" ||
      answers.derived_b12_signal === "signal_moderate") &&
    answers.lab_b12_status === "none"
  ) {
    nudges.push({
      id: "test_b12",
      title: "A B12 test is worth doing",
      body: "Your answers contain signs that can point to low B12 (sore or smooth tongue, pale skin, plant-leaning diet). A serum B12 — ideally with methylmalonic acid if borderline — is the right next step before deciding on a dose.",
      why: "B12-relevant signs converged in your answers without a recent lab.",
    });
  }

  if (
    (answers.derived_vitamin_d_signal === "signal_strong" ||
      answers.derived_vitamin_d_signal === "signal_moderate") &&
    answers.lab_vitamin_d_status === "none"
  ) {
    nudges.push({
      id: "test_vitamin_d",
      title: "Worth checking your vitamin D level",
      body: "Several inputs point to possible low vitamin D status (low sun exposure, frequent infections, eczema, diffuse hair shedding). A 25-hydroxy vitamin D blood test is widely available and tells you exactly where you stand before dosing.",
      why: "Vitamin D-relevant signs and lifestyle factors converged in your answers without a recent lab.",
    });
  }

  if (
    answers.derived_b_complex_signal === "signal_strong" ||
    answers.derived_b_complex_signal === "signal_moderate"
  ) {
    nudges.push({
      id: "b_complex_signs",
      title: "Some answers point toward B-vitamin status",
      body: "Cracks at the corners of your mouth, low fish or dairy intake, and frequent migraines are inputs that respond to B2, B6, and broader B-vitamin status. A B-complex with food is a low-risk first step; a clinician can run a serum B-vitamin panel if it persists.",
      why: "Several B-vitamin-relevant inputs converged in your answers.",
    });
  }

  if (
    answers.derived_vitamin_c_signal === "signal_strong" ||
    answers.derived_vitamin_c_signal === "signal_moderate"
  ) {
    nudges.push({
      id: "vitamin_c_signs",
      title: "Bleeding gums and easy bruising deserve attention",
      body: "These signs can reflect low vitamin C, but they can also point to dental, clotting, or other issues — none of which a supplement should mask. A quick check with your dentist or GP is worth doing before assuming it's nutritional.",
      why: "Vitamin C-relevant signs appeared in your answers and overlap with non-nutritional causes worth ruling out.",
    });
  }

  if (
    answers.derived_vitamin_k_signal === "signal_strong" ||
    answers.derived_vitamin_k_signal === "signal_moderate"
  ) {
    nudges.push({
      id: "vitamin_k_signs",
      title: "Easy bruising and bleeding gums — see your dentist or GP first",
      body: "These signs can reflect vitamin K1 status (mostly from leafy greens) but also clotting issues, dental causes, or medication effects. A quick clinical check is the right next step before any supplement, especially because vitamin K interacts with blood-thinning medication.",
      why: "Vitamin K-relevant signs appeared in your answers and overlap with non-nutritional causes that supplements should not mask.",
    });
  }

  if (
    answers.derived_zinc_signal === "signal_strong" &&
    !isGoal(answers, "immune_support")
  ) {
    nudges.push({
      id: "zinc_signs",
      title: "Several signs point toward zinc status",
      body: "Slow wound healing, taste or smell changes, frequent infections, and white nail spots can all reflect lower zinc status, especially on plant-leaning diets. A short course (8–12 weeks) of moderate-dose zinc with copper protection is a reasonable trial; long-term high doses are not.",
      why: "Multiple zinc-relevant body signs converged in your answers.",
    });
  }

  return nudges;
}

function buildSchedule(stack: SupplementScore[]): Record<DoseWindow, SupplementScore[]> {
  return {
    morning: stack.filter((item) => item.doseWindow === "morning"),
    evening: stack.filter((item) => item.doseWindow === "evening"),
  };
}

function addLifestyleIntervention(
  interventions: LifestyleIntervention[],
  intervention: LifestyleIntervention,
) {
  if (!interventions.some((item) => item.id === intervention.id)) {
    interventions.push(intervention);
  }
}

function collectLifestyleInterventions(answers: AnswerMap): LifestyleIntervention[] {
  const interventions: LifestyleIntervention[] = [];
  const poorSleep = answers.sleep_quality === "poor" || answers.sleep_quality === "fair";
  const cognitiveGoal = answerIncludes(answers, "primary_goal", [
    "cognitive_performance",
    "cognitive_longevity",
  ]);

  if (answers.water_intake === "lt_1l") {
    addLifestyleIntervention(interventions, {
      id: "hydrate-before-caffeine",
      domain: "hydration",
      priority: "high",
      title: "Hydrate before you optimise",
      action: "Drink 500 ml of water in the first hour after waking, then use urine colour and thirst to guide the rest of the day.",
      reason: "Low fluid intake can show up as fatigue, headaches, constipation, and poor concentration before a supplement gap is the main issue.",
    });
  }

  if (answers.sleep_hours === "lt_6h") {
    addLifestyleIntervention(interventions, {
      id: "increase-sleep-opportunity",
      domain: "sleep",
      priority: "high",
      title: "Add sleep opportunity first",
      action: "Move bedtime 20 minutes earlier every 3 nights until you have a realistic 7-hour sleep window.",
      reason: "Chronic short sleep has wide effects on cognition, mood, appetite, immune function, and metabolic health that supplements cannot offset.",
    });
  }

  if (answers.snoring_pattern === "loud_snoring_or_apnea") {
    addLifestyleIntervention(interventions, {
      id: "screen-for-sleep-apnea",
      domain: "medical_review",
      priority: "high",
      title: "Rule out sleep apnea",
      action: "Book a clinician review or home sleep study before leaning on sleep aids or stimulant-style supplements.",
      reason: "Loud snoring or breathing pauses can indicate sleep apnea, where the highest-value intervention is diagnosis and treatment.",
    });
  }

  if (answers.caffeine_cutoff === "after_3pm" && poorSleep) {
    addLifestyleIntervention(interventions, {
      id: "move-caffeine-cutoff",
      domain: "sleep",
      priority: "high",
      title: "Move caffeine earlier",
      action: "Set a two-week caffeine cutoff before noon, or at least 8 hours before bed if noon is unrealistic.",
      reason: "Late caffeine can fragment sleep even when you still fall asleep easily.",
    });
  }

  if (answers.bedtime_consistency === "irregular" && (isGoal(answers, "sleep") || poorSleep)) {
    addLifestyleIntervention(interventions, {
      id: "anchor-bedtime",
      domain: "sleep",
      priority: "medium",
      title: "Anchor the sleep window",
      action: "Choose a 30-minute bedtime landing zone for weeknights and protect it before adding more evening supplements.",
      reason: "Regular timing helps circadian rhythm and sleep depth; it is one of the most underused sleep interventions.",
    });
  }

  if (answers.daily_steps === "lt_5k") {
    addLifestyleIntervention(interventions, {
      id: "step-floor",
      domain: "movement",
      priority: "medium",
      title: "Raise the movement floor",
      action: "Add one 10-minute walk after a meal and build toward 7,000-8,000 steps per day.",
      reason: "Total daily movement is a core metabolic and cardiovascular lever that supplements do not replace.",
    });
  }

  if (answers.sitting_hours === "gt_12h" || answers.sitting_hours === "8_to_12h") {
    addLifestyleIntervention(interventions, {
      id: "movement-snacks",
      domain: "movement",
      priority: "medium",
      title: "Break long sitting blocks",
      action: "Stand up for 3-5 minutes each hour; use stairs, squats, or a short walk if you can.",
      reason: "Long uninterrupted sitting has independent metabolic effects even in people who exercise.",
    });
  }

  if (
    answers.strength_sessions_weekly === "zero_strength" &&
    (isGoal(answers, "performance") || isGoal(answers, "healthy_aging") || cognitiveGoal)
  ) {
    addLifestyleIntervention(interventions, {
      id: "minimum-strength-dose",
      domain: "movement",
      priority: "medium",
      title: "Add the minimum effective strength dose",
      action: "Start with two 20-minute full-body sessions per week: squat or hinge, push, pull, carry.",
      reason: "Resistance training is a high-confidence intervention for function, glucose handling, aging, and performance.",
    });
  }

  if (answers.sun_exposure === "none_or_low" || answers.time_in_nature === "almost_never") {
    addLifestyleIntervention(interventions, {
      id: "daylight-and-outdoor-time",
      domain: "light",
      priority: "medium",
      title: "Get outdoor light early",
      action: "Spend 10 minutes outside before late morning; combine it with a walk when possible.",
      reason: "Morning daylight supports circadian timing and mood in ways vitamin D capsules do not fully replicate.",
    });
  }

  if (
    answers.screen_hours === "gt_12h" &&
    (isGoal(answers, "sleep") || cognitiveGoal || poorSleep)
  ) {
    addLifestyleIntervention(interventions, {
      id: "screen-curfew",
      domain: "screen",
      priority: "medium",
      title: "Design a screen landing strip",
      action: "Dim screens 90 minutes before bed, move the phone charger away from the bed, and pick one non-screen wind-down cue.",
      reason: "High evening screen load can delay sleep and keep attention systems switched on.",
    });
  }

  if (answers.social_connection === "isolated") {
    addLifestyleIntervention(interventions, {
      id: "connection-rep",
      domain: "social",
      priority: "medium",
      title: "Schedule one connection rep",
      action: "Put one recurring call, walk, class, or shared meal on the calendar this week.",
      reason: "Social isolation is a major health signal. It belongs in the plan, not hidden behind supplement choices.",
    });
  }

  if (
    (isGoal(answers, "stress") || answers.stress_load === "high") &&
    answers.exercise_pattern === "mostly_sedentary"
  ) {
    addLifestyleIntervention(interventions, {
      id: "stress-walk",
      domain: "stress",
      priority: "medium",
      title: "Use movement as the first adaptogen",
      action: "Take a 20-minute easy walk on 5 days this week, preferably outdoors.",
      reason: "For stress regulation, regular light-to-moderate movement is more reliable than most stress supplement effects.",
    });
  }

  if (answers.derived_alcohol_risk === "risk_moderate" || answers.derived_alcohol_risk === "risk_high") {
    addLifestyleIntervention(interventions, {
      id: "alcohol-sleep-buffer",
      domain: "sleep",
      priority: poorSleep || isGoal(answers, "sleep") || answers.derived_alcohol_risk === "risk_high" ? "high" : "medium",
      title: "Create an alcohol-to-sleep buffer and trim weekly intake",
      action: "Keep alcohol at least 3 hours away from bedtime, trial 3 alcohol-free nights this week, and aim toward 14 units or fewer per week over the next month.",
      reason: "Alcohol fragments sleep architecture, depletes B-vitamins, and the cardiovascular dose-response is steep above 14 units per week.",
    });
  }

  if (answers.derived_smoking_risk === "current") {
    addLifestyleIntervention(interventions, {
      id: "smoking-cessation",
      domain: "medical_review",
      priority: "high",
      title: "Quitting tobacco eclipses every other change here",
      action: "Use a recognised cessation programme (NHS Stop Smoking, US 1-800-QUIT-NOW). Combining counselling with NRT, bupropion, or varenicline roughly triples quit rates.",
      reason: "Cessation has the largest single effect size of anything in this plan.",
    });
  }

  if (answers.ssb_intake === "ssb_two_to_three" || answers.ssb_intake === "ssb_four_plus") {
    addLifestyleIntervention(interventions, {
      id: "ssb-swap",
      domain: "nutrition",
      priority: answers.ssb_intake === "ssb_four_plus" ? "high" : "medium",
      title: "Swap one sugar-sweetened drink for water",
      action: "Replace one daily soda, sweetened coffee, juice, or energy drink with sparkling water or plain tea. Build from there.",
      reason: "Each daily SSB raises type-2 diabetes risk roughly 18% in long-term cohorts. The dose-response is steep at low servings.",
    });
  }

  if (
    answers.derived_diet_quality_risk === "risk_high" ||
    answers.derived_diet_quality_risk === "risk_moderate"
  ) {
    const isHigh = answers.derived_diet_quality_risk === "risk_high";
    addLifestyleIntervention(interventions, {
      id: "ultra-processed-reduction",
      domain: "nutrition",
      priority: isHigh ? "high" : "medium",
      title: isHigh
        ? "Reducing ultra-processed food will outperform any supplement on this list"
        : "Trim ultra-processed foods where it's easiest",
      action: isHigh
        ? "Pick one daily UPF item to swap for a whole-food version this week — start with breakfast (oats instead of cereal) or snacks (fruit + nuts instead of packaged bars). Cook one extra meal at home per week."
        : "Identify the one ultra-processed item you eat most often and swap it for a less-processed alternative for a fortnight. Build from there.",
      reason:
        "Umbrella reviews (Lane et al. 2024, BMJ) link high ultra-processed food intake to higher all-cause mortality, cardiovascular disease, type-2 diabetes, and depression — independent of total calories. No supplement on this site closes that gap; diet quality is the larger lever.",
    });
  }

  if (answers.derived_produce_risk === "risk_high") {
    addLifestyleIntervention(interventions, {
      id: "produce-five-a-day",
      domain: "nutrition",
      priority: "high",
      title: "Get to 5-a-day before reaching for antioxidant supplements",
      action: "Add a piece of fruit at breakfast and a fistful of vegetables at lunch and dinner. Frozen veg counts; juices don't.",
      reason:
        "The Aune 2017 meta-analysis (95 cohorts, ~2 million participants) shows the steepest mortality reduction sits in the 0→2 servings/day range — the segment you are in now is the highest-yield change available. Whole produce delivers fibre, polyphenols, and minerals in combinations supplements can't replicate.",
    });
  } else if (answers.derived_produce_risk === "risk_moderate") {
    addLifestyleIntervention(interventions, {
      id: "produce-nudge",
      domain: "nutrition",
      priority: "medium",
      title: "Two more servings/day puts you at the WHO 5-a-day target",
      action: "Pick the two meals you tend to skip veg at and add a fistful to each.",
      reason: "You're below the WHO 5-a-day baseline but not in the lowest-intake decile. Each additional daily serving toward ~7–8/day continues to reduce all-cause mortality risk in long-term cohorts (Aune 2017).",
    });
  } else if (answers.fruit_veg_servings === "fv_4") {
    addLifestyleIntervention(interventions, {
      id: "produce-one-short",
      domain: "nutrition",
      priority: "low",
      title: "One serving short of 5-a-day",
      action: "Add one more piece of fruit or fistful of veg to whichever meal currently has none.",
      reason: "You're close to the WHO target. Per-serving mortality reduction continues up to ~7–8/day in long-term cohorts (Aune 2017) — the marginal serving from 4→5 is still meaningful.",
    });
  }

  if (answers.bowel_pattern === "bowel_less_than_3_per_week") {
    addLifestyleIntervention(interventions, {
      id: "constipation-fix",
      domain: "nutrition",
      priority: "medium",
      title: "Treat constipation with food, fluid, and movement first",
      action: "Aim for 25–30 g fibre/day from food (oats, beans, fruit and veg with skin), 1.5–2 L of fluid, and a daily walk. Add psyllium only if food-first doesn't move the dial in 2–3 weeks.",
      reason: "Most adult constipation responds to fluid + fibre + movement before any supplement is needed.",
    });
  }

  if (answers.blood_pressure_status === "bp_high_untreated") {
    addLifestyleIntervention(interventions, {
      id: "bp-clinician",
      domain: "medical_review",
      priority: "high",
      title: "Book a blood-pressure review",
      action: "Have your blood pressure measured properly (clinic or validated home cuff), and discuss treatment with a clinician.",
      reason: "Untreated hypertension is a leading modifiable cause of stroke and heart disease.",
    });
  } else if (answers.blood_pressure_status === "bp_borderline" || answers.blood_pressure_status === "bp_unknown") {
    addLifestyleIntervention(interventions, {
      id: "bp-monitoring",
      domain: "medical_review",
      priority: "medium",
      title: "Track your blood pressure",
      action: "Pick up a validated home cuff or use a pharmacy machine. Aim for an average under 135/85.",
      reason: "BP is the most actionable cardiovascular metric and most people don't know theirs.",
    });
  }

  if (answers.derived_red_flag === "present") {
    addLifestyleIntervention(interventions, {
      id: "red-flag-clinical",
      domain: "medical_review",
      priority: "high",
      title: "Clinical review before any supplement plan",
      action: "Book a clinical appointment and explain the symptom you flagged. If you're in immediate danger or having suicidal thoughts, contact 999/911 or your local crisis line now (UK Samaritans 116 123, US 988).",
      reason: "Some symptoms (chest pain, blood in stool/urine, sudden weight loss, severe headache, neurological changes) can indicate conditions that supplements would mask or worsen.",
    });
  }

  if (interventions.length === 0) {
    return [
      {
        id: "default-daylight",
        domain: "light",
        priority: "low",
        title: "Keep daylight in the system",
        action: "Get 10 minutes outside early in the day.",
        reason: "This supports circadian rhythm and helps anchor the rest of the plan.",
      },
      {
        id: "default-walk",
        domain: "movement",
        priority: "low",
        title: "Protect a daily walk",
        action: "Add a 10-minute walk after one meal.",
        reason: "A small movement habit improves the return on nutrition and supplement changes.",
      },
      {
        id: "default-wind-down",
        domain: "sleep",
        priority: "low",
        title: "Close the day deliberately",
        action: "Use a 20-minute wind-down cue before bed: shower, reading, stretching, or dim light.",
        reason: "A predictable closing ritual makes the evening supplement window easier to stick to.",
      },
    ];
  }

  const priorityOrder: Record<LifestyleIntervention["priority"], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return interventions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function dailyWindowLabel(window: DailyPlanWindow): string {
  return window.replaceAll("_", " ");
}

function findIntervention(
  interventions: LifestyleIntervention[],
  domain: LifestyleDomain,
): LifestyleIntervention | undefined {
  return interventions.find((item) => item.domain === domain);
}

function buildDailyPlan(
  schedule: Record<DoseWindow, SupplementScore[]>,
  lifestyleInterventions: LifestyleIntervention[],
): DailyPlanItem[] {
  const plan: DailyPlanItem[] = [];
  const wakeAnchor =
    findIntervention(lifestyleInterventions, "hydration") ??
    findIntervention(lifestyleInterventions, "light");
  const middayAnchor =
    findIntervention(lifestyleInterventions, "movement") ??
    findIntervention(lifestyleInterventions, "stress");
  const lateAnchor =
    lifestyleInterventions.find((item) => item.id === "move-caffeine-cutoff") ??
    findIntervention(lifestyleInterventions, "screen");
  const eveningAnchor =
    findIntervention(lifestyleInterventions, "sleep") ??
    lifestyleInterventions.find((item) => item.id === "default-wind-down");

  if (wakeAnchor) {
    plan.push({
      id: `wake-${wakeAnchor.id}`,
      window: "wake",
      title: wakeAnchor.title,
      action: wakeAnchor.action,
      source: "lifestyle",
    });
  }

  if (schedule.morning.length > 0) {
    plan.push({
      id: "morning-supplements",
      window: "morning",
      title: "Morning supplement pack",
      action: `Take ${schedule.morning.map((item) => item.name).join(", ")} as directed, ideally with the timing notes shown in your stack.`,
      source: "supplement",
    });
  }

  if (middayAnchor) {
    plan.push({
      id: `midday-${middayAnchor.id}`,
      window: "midday",
      title: middayAnchor.title,
      action: middayAnchor.action,
      source: "lifestyle",
    });
  }

  if (lateAnchor) {
    plan.push({
      id: `late-${lateAnchor.id}`,
      window: "late_afternoon",
      title: lateAnchor.title,
      action: lateAnchor.action,
      source: "lifestyle",
    });
  }

  if (schedule.evening.length > 0) {
    plan.push({
      id: "evening-supplements",
      window: "evening",
      title: "Evening supplement pack",
      action: `Take ${schedule.evening.map((item) => item.name).join(", ")} as directed, keeping sedating or recovery-oriented options in this window.`,
      source: "supplement",
    });
  }

  if (eveningAnchor) {
    plan.push({
      id: `evening-${eveningAnchor.id}`,
      window: "evening",
      title: eveningAnchor.title,
      action: eveningAnchor.action,
      source: "lifestyle",
    });
  }

  return plan.slice(0, 7).map((item) => ({
    ...item,
    title: item.title || dailyWindowLabel(item.window),
  }));
}

export function buildRecommendationPlan(rawAnswers: AnswerMap): RecommendationPlan {
  // Compute derived nutrient signals once, then run the engine against the
  // augmented answer map so rules can reference them via the same Condition
  // mechanism as user-supplied answers.
  const baseAnswers = withDerivedSignals(rawAnswers);

  // Daily aspirin or chronic NSAID use carries the same supplement-interaction
  // surface as prescription anticoagulants (additive bleeding risk with omega-3,
  // ginkgo, garlic, ginger, curcumin, boswellia, vitamin K2, vitamin E, etc.).
  // Promote it into the existing blood_thinner_use gate so every rule that
  // already screens for anticoagulants also screens for OTC blood thinners,
  // without duplicating excludeIf clauses across the catalogue.
  const answers: AnswerMap =
    baseAnswers.daily_aspirin_or_nsaid === "yes" || baseAnswers.daily_aspirin_or_nsaid === "not_sure"
      ? {
          ...baseAnswers,
          blood_thinner_use:
            baseAnswers.blood_thinner_use && baseAnswers.blood_thinner_use !== "no"
              ? baseAnswers.blood_thinner_use
              : "yes",
        }
      : baseAnswers;

  const riskFlags = collectRiskFlags(answers);
  const questionsAsked = getQuestionIdsForFlow(answers);
  const scored = supplementCatalog.map((rule) => scoreSupplement(rule, answers));
  const deconflicted = removeConflictingScores(scored, supplementCatalog);

  // Red-flag interception: if the user reported any urgent symptom, suppress
  // the entire recommended stack and route the items into "needs_clinician_review".
  // We do this here, after scoring, so the analysis screen can still show *what*
  // would have been recommended and *why* — it just isn't presented as a plan to act on.
  const urgentRedFlag = riskFlags.includes("urgent_clinical_review");
  if (urgentRedFlag) {
    for (const item of deconflicted) {
      if (item.status === "recommended" || item.status === "worth_considering") {
        item.status = "needs_clinician_review";
        if (!item.blockers.some((b) => b.startsWith("Held back pending clinical review"))) {
          item.blockers.unshift(
            "Held back pending clinical review of the symptom(s) you flagged. A clinician should rule out causes before any supplement plan begins.",
          );
        }
      }
    }
  }

  // Pregnancy demotion: per-supplement excludeIf catches the obvious cases, but
  // adding new supplements without a pregnancy guard is an easy mistake. This
  // is defence-in-depth — anything not on PREGNANCY_SAFE is routed to clinician
  // review when the user is pregnant or breastfeeding (or unsure).
  const PREGNANCY_SAFE = new Set([
    "multivitamin",
    "vitamin_d3",
    "omega3",
    "choline",
  ]);
  if (riskFlags.includes("pregnancy_or_breastfeeding")) {
    for (const item of deconflicted) {
      if (
        (item.status === "recommended" || item.status === "worth_considering") &&
        !PREGNANCY_SAFE.has(item.supplementId)
      ) {
        item.status = "needs_clinician_review";
        if (!item.blockers.some((b) => b.startsWith("Held back during pregnancy"))) {
          item.blockers.unshift(
            "Held back during pregnancy or breastfeeding. Discuss with an obstetric provider before starting — most supplements lack adequate safety data in this context.",
          );
        }
      }
    }
  }

  // Polypharmacy demotion: same defence-in-depth pattern. With 5+ prescriptions
  // the interaction matrix grows fast and individual excludeIf clauses can lag
  // behind catalog additions. Allow only items with a long, well-characterised
  // safety profile and minimal CYP/transporter activity.
  const POLYPHARMACY_SAFE = new Set([
    "vitamin_d3",
    "omega3",
    "vitamin_b12",
    "calcium",
    "protein_powder",
    "psyllium",
    "creatine_monohydrate",
  ]);
  if (riskFlags.includes("polypharmacy")) {
    for (const item of deconflicted) {
      if (
        (item.status === "recommended" || item.status === "worth_considering") &&
        !POLYPHARMACY_SAFE.has(item.supplementId)
      ) {
        item.status = "needs_clinician_review";
        if (!item.blockers.some((b) => b.startsWith("Held back due to polypharmacy"))) {
          item.blockers.unshift(
            "Held back due to polypharmacy (5+ prescriptions). A pharmacist or prescribing clinician should screen this against your full medication list before starting.",
          );
        }
      }
    }
  }

  const stack = deconflicted
    .filter((item) => item.status === "recommended")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const worthConsidering = deconflicted
    .filter((item) => item.status === "worth_considering")
    .sort((a, b) => b.score - a.score);

  const traditionalAndEmerging = deconflicted
    .filter((item) => item.status === "traditional_use")
    .sort((a, b) => b.score - a.score);

  const optionalAlternatives = deconflicted
    .filter((item) => item.status === "optional")
    .sort((a, b) => b.score - a.score);

  const excluded = deconflicted
    .filter((item) => item.status === "do_not_recommend" || item.status === "needs_clinician_review")
    .sort((a, b) => b.score - a.score);
  const schedule = buildSchedule(stack);
  const lifestyleInterventions = collectLifestyleInterventions(answers);

  return {
    answers,
    riskFlags,
    questionsAsked,
    stack,
    worthConsidering,
    traditionalAndEmerging,
    optionalAlternatives,
    excluded,
    schedule,
    baselineNudges: collectBaselineNudges(answers),
    lifestyleInterventions,
    dailyPlan: buildDailyPlan(schedule, lifestyleInterventions),
    profiles: deriveProfiles(answers),
    labRecommendations: deriveLabRecommendations(answers, riskFlags),
  };
}

export const whyNotPrimaryLabels: Record<WhyNotPrimary, string> = {
  narrower_indication: "Narrower indication than the primary stack.",
  smaller_effect_size: "Effect size in trials is real but modest.",
  weaker_modern_evidence: "Long history of use, weaker modern RCT evidence.",
  overlap_with_primary: "Overlaps with something already in your primary stack.",
  needs_self_experiment: "Often needs a short personal trial to know if it helps you.",
  limited_safety_data: "Long-term safety data is still limited.",
};
