import { FitnessInput, ProjectionResult, InspirationResult, InspirationProfile } from "@/app/types/fitness";
import { inspirations } from "./inspiration-data";
import { fetchInspirationProfile } from "./gemini";

const activityMultipliers = {
  sedentary: 1.2,
  moderate: 1.55,
  active: 1.75,
};

const muscleGainRates = {
  beginner: 1, // kg per month
  intermediate: 0.5,
  advanced: 0.2,
};

export function projectionEngine(data: FitnessInput): ProjectionResult {
  const {
    age,
    gender,
    height,
    weight,
    activityLevel,
    experience,
    goalType,
    targetWeight,
    timelineMonths,
  } = data;

  // -----------------------
  // 1️⃣ BMR (Mifflin-St Jeor)
  // -----------------------
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // -----------------------
  // 2️⃣ TDEE
  // -----------------------
  const tdee = bmr * activityMultipliers[activityLevel];

  let weeklyChange = 0;
  let monthlyChange = 0;
  let realisticMonthsRequired: number | null = null;
  let isUnrealistic = false;
  let message = "";

  // -----------------------
  // 3️⃣ Goal Logic
  // -----------------------

  if (goalType === "fat_loss" && targetWeight) {
    const totalLossNeeded = weight - targetWeight;

    // Safe fat loss = 0.5% – 1% bodyweight per week
    const safeWeeklyLoss = weight * 0.007; // avg 0.7%
    weeklyChange = -safeWeeklyLoss;
    monthlyChange = weeklyChange * 4;

    realisticMonthsRequired = Math.abs(totalLossNeeded / monthlyChange);

    if (realisticMonthsRequired > timelineMonths) {
      isUnrealistic = true;
      message = "Target fat loss exceeds healthy rate.";
    } else {
      message = "Goal is within realistic fat loss range.";
    }
  }

  if (goalType === "muscle_gain" && targetWeight) {
    const totalGainNeeded = targetWeight - weight;

    const monthlyGain = muscleGainRates[experience];
    weeklyChange = monthlyGain / 4;
    monthlyChange = monthlyGain;

    realisticMonthsRequired = totalGainNeeded / monthlyGain;

    if (realisticMonthsRequired > timelineMonths) {
      isUnrealistic = true;
      message = "Target muscle gain exceeds natural growth rate.";
    } else {
      message = "Goal is achievable within natural muscle gain limits.";
    }
  }

  if (goalType === "recomposition") {
    weeklyChange = 0;
    monthlyChange = 0;
    realisticMonthsRequired = timelineMonths;
    message =
      "Body recomposition is slower and depends on nutrition + training consistency.";
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    weeklyChange: Number(weeklyChange.toFixed(2)),
    monthlyChange: Number(monthlyChange.toFixed(2)),
    realisticMonthsRequired:
      realisticMonthsRequired !== null
        ? Number(realisticMonthsRequired.toFixed(1))
        : null,
    isUnrealistic,
    message,
  };
}



export async function inspirationEngine(
  data: FitnessInput,
): Promise<InspirationResult | null> {
  if (!data.inspiration) return null;

  const key = data.inspiration.toLowerCase().trim();
  console.log(`Inspiration lookup: "${data.inspiration}" -> key: "${key}"`);
  let profile: InspirationProfile | null | undefined = inspirations[key];

  if (!profile) {
    console.log(`Inspiration profile not found locally for key: "${key}". Fetching from Gemini...`);
    profile = await fetchInspirationProfile(data.inspiration as string);
  }

  if (!profile) {
    console.log(`Inspiration profile not found even with Gemini for: "${data.inspiration}"`);
    return null;
  }

  const weightDifference = profile.stageWeight - data.weight;

  // Estimate muscle gain potential per year
  let yearlyGain = 0;
  if (data.experience === "beginner") yearlyGain = 8;
  if (data.experience === "intermediate") yearlyGain = 4;
  if (data.experience === "advanced") yearlyGain = 2;

  const muscleGainYears = weightDifference > 0 ? weightDifference / yearlyGain : 0;

  // Maturity Factor: Even if weight is reached, density and conditioning take time.
  const experienceMultiplier: Record<string, number> = {
    beginner: 1.0,
    intermediate: 0.7,
    advanced: 0.4
  };

  const userExpMult = experienceMultiplier[data.experience] || 1.0;
  
  // Base maturity years (roughly 60% of what the pro took, adjusted by user experience)
  // This ensures that reaching an 'advanced' physique still takes a few years for a beginner
  // even if they already have the weight.
  const maturityYears = profile.trainingYears * 0.6 * userExpMult;

  const estimatedYearsRequired = Math.max(muscleGainYears, maturityYears);

  let difficulty: "Moderate" | "Hard" | "Extreme" = "Moderate";
  let warning = "";

  if (profile.level === "elite") {
    difficulty = "Extreme";
    warning =
      "This physique represents elite-level bodybuilding with years of specialized training and genetics.";
  } else if (profile.level === "advanced") {
    difficulty = "Hard";
    warning =
      "Achieving this look requires long-term consistency and structured nutrition.";
  }

  return {
    inspirationName: profile.name,
    weightDifference: Math.round(weightDifference),
    estimatedYearsRequired: Number(estimatedYearsRequired.toFixed(1)),
    difficulty,
    warning,
  };
}
