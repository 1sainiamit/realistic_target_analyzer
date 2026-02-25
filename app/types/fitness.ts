import { z } from "zod";

export const FitnessSchema = z.object({
  age: z.number().min(15).max(80),
  gender: z.enum(["male", "female"]),
  height: z.number().min(120).max(230),
  weight: z.number().min(35).max(200),
  activityLevel: z.enum(["sedentary", "moderate", "active"]),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  goalType: z.enum(["fat_loss", "muscle_gain", "recomposition"]),
  targetWeight: z.number().optional(),
  timelineMonths: z.number().min(1).max(24),
  inspiration: z.string().optional(),
});

export type FitnessInput = z.infer<typeof FitnessSchema>;


export interface ProjectionResult {
  bmr: number;
  tdee: number;
  weeklyChange: number;
  monthlyChange: number;
  realisticMonthsRequired: number | null;
  isUnrealistic: boolean;
  message: string;
}

export interface AIAnalysisResult {
  assessment: string;
  timeline_analysis: string;
  verdict: string;
  inspiration_comparison: string;
  strategy: string;
  motivation: string;
}

export interface InspirationResult {
  inspirationName: string;
  weightDifference: number;
  estimatedYearsRequired: number;
  difficulty: "Moderate" | "Hard" | "Extreme";
  warning: string;
}

export interface InspirationProfile {
  name: string;
  height: number; // cm
  stageWeight: number; // kg
  bodyFat: number; // %
  trainingYears: number;
  level: "elite" | "advanced" | "athletic";
}