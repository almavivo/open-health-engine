import { answerIncludes, firstAnswer } from "./rules-engine";
import type { AnswerMap } from "./types";

// ---------------------------------------------------------------------------
// Shift-worker circadian planner
// ---------------------------------------------------------------------------
// Generates a structured timing protocol for users on:
//   - fixed_nights      → full plan
//   - rotating_forward  → full plan with rotation-day notes
//   - rotating_backward → caveat-only plan ("v1 doesn't model this well")
//   - irregular_oncall  → caveat-only plan
//   - fixed_days        → no plan (default circadian profile applies)
//   - shift_none        → null
//
// Anchored to AASM/SLEEP guidance + occupational-medicine reviews. Numbers
// (sleep window, light avoidance, caffeine cutoff) are conservative defaults
// and explicitly framed as "anchors", not prescriptions.
// ---------------------------------------------------------------------------

export type ShiftPattern =
  | "fixed_nights"
  | "rotating_forward"
  | "rotating_backward"
  | "irregular_oncall";

export interface ShiftAnchor {
  /** Free-form clock label like "09:00–16:00" or "30 min before shift". */
  when: string;
  what: string;
  why: string;
}

export interface RotationDayNote {
  day: string;
  guidance: string;
}

export interface ShiftPlan {
  pattern: ShiftPattern;
  patternLabel: string;
  /** Two-sentence overview the user reads first. */
  summary: string;
  /** 4–8 anchors covering the core rhythm. */
  anchors: ShiftAnchor[];
  /** Day-by-day for forward rotation; empty array for fixed nights. */
  rotationDays: RotationDayNote[];
  /** Caveats — clinician referrals, drug interactions, lifestyle. */
  caveats: string[];
  /** True when the planner returns explicit "see clinician" guidance only. */
  requiresClinicianReview: boolean;
}

const PATTERN_LABEL: Record<ShiftPattern, string> = {
  fixed_nights: "Fixed nights",
  rotating_forward: "Rotating forward (days → evenings → nights)",
  rotating_backward: "Rotating backward (nights → evenings → days)",
  irregular_oncall: "Irregular / on-call",
};

// ---------------------------------------------------------------------------
// Shift-start window helpers
// ---------------------------------------------------------------------------

interface StartWindowCopy {
  preShiftLightAt: string;
  preShiftCaffeineAt: string;
  preShiftMealAt: string;
  postShiftSleepWindow: string;
  postShiftLightAvoid: string;
}

function copyForStartWindow(start: string | undefined, lengthH: number): StartWindowCopy {
  // Defaults assume 9pm–9am 12h shift
  let shiftStart = "21:00";
  let shiftEnd = "09:00";
  switch (start) {
    case "shift_start_before_18":
      shiftStart = "17:00";
      break;
    case "shift_start_18_to_21":
      shiftStart = "20:00";
      break;
    case "shift_start_21_to_00":
      shiftStart = "22:00";
      break;
    case "shift_start_00_to_03":
      shiftStart = "01:00";
      break;
  }
  // Compute end naively
  const [h, m] = shiftStart.split(":").map(Number);
  const endH = (h + lengthH) % 24;
  shiftEnd = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  // Anchor sleep starts ~1.5h post-shift (commute + wind-down)
  const sleepStartH = (endH + 1) % 24;
  const sleepEndH = (sleepStartH + 7) % 24;
  const sleepStart = `${String(sleepStartH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const sleepEnd = `${String(sleepEndH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  // Pre-shift bright light ~2h before
  const lightH = (h - 2 + 24) % 24;
  const preShiftLightAt = `${String(lightH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  // Caffeine: at shift start, plus optional mid-shift; cutoff ~5h before sleep
  const preShiftCaffeineAt = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  // Main meal pre-shift, light snacks during, no heavy meal in last 3h of shift
  const preShiftMealAt = `${String((h - 1 + 24) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  return {
    preShiftLightAt,
    preShiftCaffeineAt,
    preShiftMealAt,
    postShiftSleepWindow: `${sleepStart}–${sleepEnd}`,
    postShiftLightAvoid: shiftEnd,
  };
}

function shiftLengthHours(answers: AnswerMap): number {
  const v = firstAnswer(answers, "shift_length_hours");
  switch (v) {
    case "shift_8h":
      return 8;
    case "shift_10h":
      return 10;
    case "shift_12h":
    case undefined:
      return 12;
    default:
      return 12;
  }
}

// ---------------------------------------------------------------------------
// Plan builders
// ---------------------------------------------------------------------------

/**
 * Mirrors the melatonin clinician-review surface in supplements.ts so the
 * shift card and the supplement engine never disagree. Returns true whenever
 * supplements.ts would route melatonin to clinician_review — at which point
 * the shift card omits the melatonin timing anchor and renders a
 * clinician-first note in `caveats` instead.
 *
 * Keep this in sync with the `clinicianReviewIf` and `excludeIf` blocks on
 * the melatonin rule in supplements.ts:
 *   excludeIf:  pregnant_or_breastfeeding ∈ {yes, not_sure}
 *   clinicianReviewIf:
 *     blood_thinner_use ∈ {yes, not_sure}
 *     age_band ∈ {60_69, 70_79, 80_plus}    (also legacy 60_plus)
 *     ssri_or_serotonergic_use ∈ {yes, not_sure}
 * Plus a defensive add for immunosuppressant use, which carries broader
 * interaction surface even though melatonin's rule lists it elsewhere.
 */
function melatoninNeedsClinicianReview(answers: AnswerMap): boolean {
  if (answerIncludes(answers, "pregnant_or_breastfeeding", ["yes", "not_sure"])) return true;
  if (answerIncludes(answers, "blood_thinner_use", ["yes", "not_sure"])) return true;
  if (answerIncludes(answers, "daily_aspirin_or_nsaid", ["yes", "not_sure"])) return true;
  if (answerIncludes(answers, "ssri_or_serotonergic_use", ["yes", "not_sure"])) return true;
  if (
    answerIncludes(answers, "age_band", ["60_69", "70_79", "80_plus", "60_plus"]) ||
    answerIncludes(answers, "age_band", ["under_18"])
  ) {
    return true;
  }
  if (
    answerIncludes(answers, "specific_medications", [
      "med_ssri_serotonergic",
      "med_immunosuppressant",
    ])
  ) {
    return true;
  }
  if (answerIncludes(answers, "condition_history", ["cond_autoimmune_condition"])) {
    return true;
  }
  return false;
}

function buildFixedNightsPlan(answers: AnswerMap): ShiftPlan {
  const start = firstAnswer(answers, "shift_start_time");
  const length = shiftLengthHours(answers);
  const w = copyForStartWindow(start, length);
  const melatoninGated = melatoninNeedsClinicianReview(answers);

  const anchors: ShiftAnchor[] = [
    {
      when: `~${w.preShiftLightAt} (≈2h before shift)`,
      what: "Bright light exposure for 30+ minutes — daylight, light box (10,000 lux), or bright indoor lighting.",
      why: "Anchors your circadian phase to your work schedule and combats the pre-shift dip.",
    },
    {
      when: `~${w.preShiftMealAt} (≈1h before shift)`,
      what: "Main protein-forward meal of the day. Keep it moderate — not a feast.",
      why: "Digestion is most efficient before the shift, not during the metabolic low at 03:00–05:00.",
    },
    {
      when: `Shift start (${w.preShiftCaffeineAt})`,
      what: "First caffeine. Optional second dose in the first half of the shift only — none in the final 5–6 hours.",
      why: "Caffeine half-life is 5h; late doses fragment your daytime sleep.",
    },
    {
      when: "During the shift",
      what: "Small, low-glycaemic snacks if needed (nuts, fruit, yogurt). Avoid heavy carb-and-fat meals.",
      why: "Heavy meals on the night shift drive reflux and post-meal fog.",
    },
    {
      when: `Shift end (${w.postShiftLightAvoid})`,
      what: "Sunglasses on the commute home, even on cloudy days. Blackout the bedroom completely.",
      why: "Morning daylight is the strongest signal that resets your clock to a daytime rhythm — exactly what you don't want.",
    },
    {
      when: w.postShiftSleepWindow,
      what: "Anchor sleep window — the same 7-hour block every workday. Cool, dark, quiet bedroom; phone on do-not-disturb.",
      why: "A consistent anchor sleep is the single most evidence-based shift-worker intervention.",
    },
    {
      when: "Days off",
      what: "Stay close to your work-day rhythm — sleep starts no more than 2–3 hours later than your anchor window.",
      why: "Fully flipping back on weekends causes 'permanent jet lag' and the worst circadian symptoms.",
    },
  ];

  if (!melatoninGated) {
    anchors.push({
      when: "30 min before anchor sleep",
      what:
        "Optional low-dose melatonin (0.3–1 mg) to support sleep onset. Educational only — not medical advice.",
      why: "Modest but real effect on sleep onset for fixed-night workers — much smaller than the lifestyle anchors above.",
    });
  }

  const caveats: string[] = [
    "Loud snoring, witnessed apneas, or persistent daytime sleepiness despite a solid anchor sleep deserves a sleep-study referral — supplements aren't the answer here.",
    "Shift work is a recognised carcinogen (IARC 2A) — annual GP visits and standard cancer screenings matter more, not less.",
  ];

  if (melatoninGated) {
    caveats.unshift(
      "Melatonin can have a modest effect on sleep onset for night-shift workers, but in your case (e.g. anticoagulants, antidepressants, immunosuppressants, autoimmune condition, age 60+, under 18, or pregnancy) we don't surface it as a self-directed timing anchor — discuss with your clinician or pharmacist first.",
    );
  }

  return {
    pattern: "fixed_nights",
    patternLabel: PATTERN_LABEL.fixed_nights,
    summary:
      "Fixed-night work has one cardinal rule: pick a 7-hour daytime sleep window and protect it like a job. Light, caffeine, and meals all serve that anchor.",
    anchors,
    rotationDays: [],
    caveats,
    requiresClinicianReview: false,
  };
}

function buildRotatingForwardPlan(answers: AnswerMap): ShiftPlan {
  const start = firstAnswer(answers, "shift_start_time");
  const length = shiftLengthHours(answers);
  const w = copyForStartWindow(start, length);
  const cadence = firstAnswer(answers, "rotation_cadence") ?? "rotation_weekly";

  const cadenceLabel: Record<string, string> = {
    rotation_weekly: "weekly",
    rotation_2_weeks: "every two weeks",
    rotation_monthly: "monthly",
    rotation_irregular: "on irregular notice",
  };

  const anchors: ShiftAnchor[] = [
    {
      when: "2–3 days before a shift forward",
      what:
        "Shift bedtime later by ~1 hour per night and delay morning light exposure.",
      why:
        "Forward (delaying) rotations are physiologically easier than backward — your body clock would naturally drift later if left alone.",
    },
    {
      when: "First evening of nights",
      what: "Bright light for 30+ minutes ~2h pre-shift; coffee at shift start.",
      why: "Same logic as fixed nights, just compressed into a few days.",
    },
    {
      when: "During the night-shift block",
      what: `Anchor sleep window ${w.postShiftSleepWindow}, sunglasses for the morning commute, blackout bedroom.`,
      why: "Even on a short rotation, treating night sleep as the same daily block reduces the deficit.",
    },
    {
      when: "Last night of the block → first day off",
      what: "Sleep your anchor window once, then take a brief afternoon nap (60–90 min). Get evening daylight.",
      why: "A staged transition back to days beats a hard flip — and prevents you from being wrecked by Monday.",
    },
    {
      when: "Throughout the rotation",
      what: "Same caffeine cutoff rule: nothing in the last 5–6 hours of the shift, regardless of which one.",
      why: "Caffeine half-life doesn't care which shift you're on.",
    },
  ];

  const rotationDays: RotationDayNote[] = [
    {
      day: "Day 1 of nights",
      guidance:
        "The hardest night. Sleep in the morning beforehand if possible (4–6h nap). Bright light pre-shift.",
    },
    {
      day: "Days 2–4 of nights",
      guidance:
        "Anchor sleep window each day. Don't compensate by sleeping all afternoon — protect a single 7-hour block.",
    },
    {
      day: "Day after last night",
      guidance:
        "Sleep your anchor window once (e.g. " + w.postShiftSleepWindow + "), then a short afternoon nap. Outdoors at sunset.",
    },
    {
      day: "Recovery day(s)",
      guidance:
        "Resume normal night sleep. Some lingering sleep debt is normal for 1–2 days after the rotation.",
    },
  ];

  const caveats: string[] = [
    `Rotation cadence: ${cadenceLabel[cadence] ?? cadence}. Faster rotations (weekly) are physiologically harder than slower ones.`,
    "If you're on the rotation but symptoms are getting worse over time (sleep, mood, cognition), discuss with occupational health — pattern fit is real and individual.",
  ];

  return {
    pattern: "rotating_forward",
    patternLabel: PATTERN_LABEL.rotating_forward,
    summary:
      "Forward (delaying) rotation is the more tolerable shape. The strategy is: pre-shift the body clock 2–3 days before nights, hold a strict anchor sleep during the block, then a staged transition back.",
    anchors,
    rotationDays,
    caveats,
    requiresClinicianReview: false,
  };
}

function buildClinicianReferralPlan(pattern: ShiftPattern): ShiftPlan {
  const isIrregular = pattern === "irregular_oncall";
  return {
    pattern,
    patternLabel: PATTERN_LABEL[pattern],
    summary: isIrregular
      ? "Irregular and on-call work resists fixed protocols — your sleep need won't fit a template. The most useful starting point is structured advice from someone who's seen the pattern."
      : "Backward (advancing) rotation is the harder shape — it asks the body clock to do what it physically resists. We don't issue a one-size protocol for this; an occupational-medicine clinician can model it against your actual schedule.",
    anchors: [],
    rotationDays: [],
    caveats: [
      "Talk with your occupational-health service or a sleep-medicine clinician — they can model the protocol against your actual rota, which a generic tool can't do well.",
      "In the meantime: anchor sleep when you can, avoid light at the wrong end of the shift, and keep caffeine clear of the last 5–6 hours of any work block.",
      "Loud snoring, witnessed apneas, or persistent daytime sleepiness on rest days deserves a sleep-study referral.",
    ],
    requiresClinicianReview: true,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function deriveShiftPlan(answers: AnswerMap): ShiftPlan | null {
  const type = firstAnswer(answers, "shift_schedule_type");
  if (!type || type === "shift_none" || type === "fixed_days") return null;

  switch (type) {
    case "fixed_nights":
      return buildFixedNightsPlan(answers);
    case "rotating_forward":
      return buildRotatingForwardPlan(answers);
    case "rotating_backward":
      return buildClinicianReferralPlan("rotating_backward");
    case "irregular_oncall":
      return buildClinicianReferralPlan("irregular_oncall");
    default:
      return null;
  }
}

export function isShiftWorker(answers: AnswerMap): boolean {
  const type = firstAnswer(answers, "shift_schedule_type");
  return !!type && type !== "shift_none" && type !== "fixed_days";
}
