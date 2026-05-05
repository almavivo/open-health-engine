import { AnswerMap } from "./types";

export type ProfileKind =
  | "cognitive_bottleneck"
  | "stress_response"
  | "circadian_type"
  | "aspiration";

export interface DerivedProfile {
  kind: ProfileKind;
  label: string;
  emoji: string;
  oneLiner: string;
  whyThisMatters: string;
}

export function deriveProfiles(answers: AnswerMap): DerivedProfile[] {
  const profiles: DerivedProfile[] = [];
  const cognitive = deriveCognitiveBottleneck(answers);
  if (cognitive) profiles.push(cognitive);
  const stress = deriveStressResponse(answers);
  if (stress) profiles.push(stress);
  const circadian = deriveCircadianType(answers);
  if (circadian) profiles.push(circadian);
  const aspiration = deriveAspiration(answers);
  if (aspiration) profiles.push(aspiration);
  return profiles;
}

function deriveCognitiveBottleneck(a: AnswerMap): DerivedProfile | null {
  const cb = a.cognitive_bottleneck;
  if (!cb) return null;

  switch (cb) {
    case "afternoon_dip":
      return {
        kind: "cognitive_bottleneck",
        label: "Afternoon Fader",
        emoji: "🌇",
        oneLiner: "Your mornings are sharp; your afternoons borrow against them.",
        whyThisMatters:
          "Your stack leans toward caffeine timing fixes and supplements that smooth the second half of the day rather than amplifying the first.",
      };
    case "morning_startup":
      return {
        kind: "cognitive_bottleneck",
        label: "Slow-Start Type",
        emoji: "🌫️",
        oneLiner: "Your brain takes longer than the rest of you to actually wake up.",
        whyThisMatters:
          "Recommendations focus on morning activation pairings and consistent wake-time anchors before adding nootropics.",
      };
    case "post_meal_fog":
      return {
        kind: "cognitive_bottleneck",
        label: "Post-Meal Foggy",
        emoji: "🍽️",
        oneLiner: "Meals knock you down harder than they should.",
        whyThisMatters:
          "This often points to glycemic and meal-composition issues more than supplement gaps; the stack is conservative.",
      };
    case "context_switching":
      return {
        kind: "cognitive_bottleneck",
        label: "Detail-Holder",
        emoji: "🧩",
        oneLiner: "Holding multiple threads at once is where you fall behind.",
        whyThisMatters:
          "Working-memory-leaning items (bacopa, citicoline) become more relevant than acute-focus stimulants.",
      };
    case "deep_focus_stamina":
      return {
        kind: "cognitive_bottleneck",
        label: "Sprinter, Not Marathoner",
        emoji: "🏃",
        oneLiner: "You can start deep work; sustaining it is the issue.",
        whyThisMatters:
          "Your stack favours stamina-supporting items rather than peaks. Sleep and caffeine timing are usually larger levers than any nootropic.",
      };
    case "memory_recall":
      return {
        kind: "cognitive_bottleneck",
        label: "Recall-First Type",
        emoji: "🗂️",
        oneLiner: "Names, words, and details feel slower to surface than they used to.",
        whyThisMatters:
          "Memory-consolidation items (bacopa, phosphatidylserine) move up. These work on weeks-long timelines, not minutes.",
      };
    case "stress_induced_fog":
      return {
        kind: "cognitive_bottleneck",
        label: "Stress-Saturated Working Memory",
        emoji: "🧠",
        oneLiner: "Stress is borrowing from your focus, not the other way around.",
        whyThisMatters:
          "L-theanine, magnesium, and stress-load supplements show up because the cognitive issue is downstream of the stress one.",
      };
    case "no_specific_bottleneck":
      return {
        kind: "cognitive_bottleneck",
        label: "General Optimiser",
        emoji: "✨",
        oneLiner: "No specific weak link — you're looking to lift the whole curve.",
        whyThisMatters:
          "We stay restrained: without a bottleneck, supplement upside is smaller and adherence matters more than ingredient count.",
      };
    default:
      return null;
  }
}

function deriveStressResponse(a: AnswerMap): DerivedProfile | null {
  const stress = a.stress_load;
  const sleep = a.sleep_quality;
  const exercise = a.exercise_pattern;

  if (!stress) return null;

  const wiredAndTired =
    (stress === "high") &&
    (sleep === "poor" || sleep === "fair");

  const burnedOut =
    stress === "high" &&
    (exercise === "mostly_sedentary" || exercise === "light_activity") &&
    (sleep === "poor" || sleep === "fair");

  const calmBaseline = stress === "none_or_low" && (sleep === "good" || sleep === "very_good");

  const highFunctioning =
    (stress === "moderate" || stress === "high") &&
    (sleep === "good" || sleep === "very_good");

  if (burnedOut) {
    return {
      kind: "stress_response",
      label: "Depleted Pattern",
      emoji: "🪫",
      oneLiner: "Stress is high, recovery is low, and the gap is widening.",
      whyThisMatters:
        "Supplements alone won't close this gap. Movement, sleep recovery, and lower stimulant load matter more than anything we'd recommend.",
    };
  }

  if (wiredAndTired) {
    return {
      kind: "stress_response",
      label: "Wired-and-Tired",
      emoji: "⚡",
      oneLiner: "Your nervous system is on, but your sleep doesn't repair it.",
      whyThisMatters:
        "Magnesium, L-theanine, and glycine show up to soften activation; stimulants and adaptogens are deprioritised.",
    };
  }

  if (highFunctioning) {
    return {
      kind: "stress_response",
      label: "High-Load, Holding",
      emoji: "🧗",
      oneLiner: "Stress is real but recovery is intact — for now.",
      whyThisMatters:
        "Stack stays conservative: keep the recovery levers working before adding stress-targeted supplements.",
    };
  }

  if (calmBaseline) {
    return {
      kind: "stress_response",
      label: "Calm Baseline",
      emoji: "🌿",
      oneLiner: "Stress isn't the lever for you right now.",
      whyThisMatters:
        "Stress-targeted supplements stay off the list; we look to your other goals instead.",
    };
  }

  return null;
}

function deriveCircadianType(a: AnswerMap): DerivedProfile | null {
  const cb = a.cognitive_bottleneck;
  const sleepIssue = a.sleep_issue;

  const lateRising =
    cb === "morning_startup" ||
    sleepIssue === "sleep_onset";

  const earlyFader =
    cb === "afternoon_dip" ||
    sleepIssue === "sleep_maintenance";

  if (lateRising) {
    return {
      kind: "circadian_type",
      label: "Owl-Leaning",
      emoji: "🦉",
      oneLiner: "Your day starts later than the world wants it to.",
      whyThisMatters:
        "Morning-light exposure and earlier caffeine-cutoff matter more than supplements here. Evening-pack items get earlier timing.",
    };
  }

  if (earlyFader) {
    return {
      kind: "circadian_type",
      label: "Lark-Leaning",
      emoji: "🐦",
      oneLiner: "You're sharpest early; your fade comes from the back end of the day.",
      whyThisMatters:
        "Evening pack stays simple; we prioritise items that protect sleep depth without adding mid-afternoon load.",
    };
  }

  return null;
}

function deriveAspiration(a: AnswerMap): DerivedProfile | null {
  // primary_goal may be a single value or a comma-joined list of up to 3 picks.
  // Use the first pick as the dominant aspiration profile.
  const raw = a.primary_goal;
  if (!raw) return null;
  const goal = raw.includes(",") ? raw.split(",")[0].trim() : raw;
  if (!goal) return null;

  switch (goal) {
    case "performance":
      return {
        kind: "aspiration",
        label: "Builder",
        emoji: "🏋️",
        oneLiner: "You're optimising for what your body can do.",
        whyThisMatters:
          "Creatine, protein, and recovery items lead. The stack is built around training output, not generic wellness.",
      };
    case "cognitive_performance":
      return {
        kind: "aspiration",
        label: "Optimiser",
        emoji: "🎯",
        oneLiner: "You're after sharper thinking under real-world load.",
        whyThisMatters:
          "We resist the nootropic stack maximalism; the most effective items here are usually fewer and better-evidenced than people expect.",
      };
    case "cognitive_longevity":
      return {
        kind: "aspiration",
        label: "Protector",
        emoji: "🛡️",
        oneLiner: "You want to keep the brain you have for as long as possible.",
        whyThisMatters:
          "Sleep, omega-3, B-vitamin status, and consistency matter more than any cognitive-enhancement supplement.",
      };
    case "sleep":
      return {
        kind: "aspiration",
        label: "Repairer",
        emoji: "🌙",
        oneLiner: "Sleep is the lever you're trying to fix first.",
        whyThisMatters:
          "Supplements only do so much here. Most of the lift comes from what you do in the four hours before bed.",
      };
    case "stress":
      return {
        kind: "aspiration",
        label: "Regulator",
        emoji: "🧘",
        oneLiner: "You want a more stable nervous-system baseline.",
        whyThisMatters:
          "We lean on items with calming evidence and stay away from over-stacking adaptogens with overlapping effects.",
      };
    case "energy":
      return {
        kind: "aspiration",
        label: "Re-Energiser",
        emoji: "🔋",
        oneLiner: "You're after better day-to-day capacity.",
        whyThisMatters:
          "Energy supplements rarely outperform fixing sleep, iron status, or B12 status. The stack reflects that.",
      };
    case "gut_support":
      return {
        kind: "aspiration",
        label: "Gut-First",
        emoji: "🫃",
        oneLiner: "You're working on the gut before anything else.",
        whyThisMatters:
          "Fiber and food matter more than probiotics for most people. Probiotic recommendations stay narrow and strain-specific.",
      };
    case "immune_support":
      return {
        kind: "aspiration",
        label: "Resilience-Builder",
        emoji: "🛡️",
        oneLiner: "You want fewer down days, not a magic bullet.",
        whyThisMatters:
          "Sleep, vitamin D status, and zinc when relevant carry most of the weight here. Big immune blends usually don't.",
      };
    case "general_nutrition":
      return {
        kind: "aspiration",
        label: "Coverage-Seeker",
        emoji: "🧱",
        oneLiner: "You're looking to fill the obvious gaps, not chase upside.",
        whyThisMatters:
          "We keep the stack tight: only items that close a real gap, not a long list of 'might helps'.",
      };
    case "healthy_aging":
      return {
        kind: "aspiration",
        label: "Long-Game Player",
        emoji: "🌳",
        oneLiner: "You're investing now for capacity later.",
        whyThisMatters:
          "Slow-acting, well-evidenced items take priority over short-term effect chases.",
      };
    default:
      return null;
  }
}
