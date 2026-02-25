"use client";

import {
  Activity,
  Calendar,
  CheckCircle2,
  Info,
  Target,
  TrendingDown,
  TrendingUp,
  Flame,
  Zap,
  Trophy,
  Lightbulb,
} from "lucide-react";
import {
  ProjectionResult,
  AIAnalysisResult,
  InspirationResult,
} from "@/app/types/fitness";

interface AnalysisResultProps {
  projection: ProjectionResult;
  inspiration: InspirationResult | null;
  aiAnalysis: AIAnalysisResult | null;
  aiError?: boolean;
}

export function AnalysisResult({
  projection,
  inspiration,
  aiAnalysis,
  aiError,
}: AnalysisResultProps) {
  return (
    <div className="space-y-6 mt-8">
      {/* Quick Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              BMR
            </span>
          </div>
          <div className="text-2xl font-bold">{projection.bmr}</div>
          <div className="text-[10px] uppercase">kcal/day</div>
        </div>

        <div className="border p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              TDEE
            </span>
          </div>
          <div className="text-2xl font-bold">{projection.tdee}</div>
          <div className="text-[10px] uppercase">kcal/day</div>
        </div>

        <div className="border p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            {projection.monthlyChange < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider">
              Trend
            </span>
          </div>
          <div className="text-2xl font-bold">
            {projection.monthlyChange > 0 ? "+" : ""}
            {projection.monthlyChange}
          </div>
          <div className="text-[10px] uppercase">kg/month</div>
        </div>

        <div className="border p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Timeline
            </span>
          </div>
          <div className="text-2xl font-bold">
            {projection.realisticMonthsRequired ?? "?"}
          </div>
          <div className="text-[10px] uppercase">months target</div>
        </div>
      </div>

      {/* Verdict Card */}
      <div className="relative group overflow-hidden border p-6 rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Target className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-xl ${projection.isUnrealistic ? "bg-red-500/10" : "bg-emerald-500/10"}`}
            >
              {projection.isUnrealistic ? (
                <Info className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <h2 className="text-xl font-bold">Analysis Verdict</h2>
          </div>
          <p
            className={`text-lg font-medium mb-2 ${projection.isUnrealistic ? "text-red-400" : "text-emerald-400"}`}
          >
            {projection.message}
          </p>
          {aiAnalysis && (
            <p className="leading-relaxed italic">{aiAnalysis.verdict}</p>
          )}
        </div>
      </div>

      {/* Detailed AI Analysis Sections */}
      {aiAnalysis ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-md border p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-tight">Assessment</h3>
            </div>
            <p className="text-sm leading-relaxed">{aiAnalysis.assessment}</p>
          </div>

          <div className="backdrop-blur-md border p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-tight">
                Timeline Analysis
              </h3>
            </div>
            <p className="text-sm leading-relaxed">
              {aiAnalysis.timeline_analysis}
            </p>
          </div>

          <div className="backdrop-blur-md border p-6 rounded-2xl md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-tight">
                Proposed Strategy
              </h3>
            </div>
            <p className="text-sm leading-relaxed">{aiAnalysis.strategy}</p>
          </div>

          <div className="border p-6 rounded-2xl md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-tight">Motivation</h3>
            </div>
            <p className="text-sm italic font-medium">
              {aiAnalysis.motivation}
            </p>
          </div>
        </div>
      ) : aiError ? (
        <div className="p-8 text-center rounded-2xl border border-red-500/20 bg-red-500/5">
          <div className="flex flex-col items-center gap-3">
            <Info className="w-8 h-8 text-red-400" />
            <p className="text-sm font-medium text-red-400">
              AI Analysis (Gemini) is currently unavailable due to high demand.
            </p>
            <p className="text-[10px] text-red-500/60 uppercase tracking-widest">
              Please try again in a few minutes
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl border border-dashed">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full h-10 w-10"></div>
            </div>
            <p className="text-sm">Waiting for AI depth analysis...</p>
          </div>
        </div>
      )}

      {/* Inspiration Comparison */}
      {inspiration && (
        <div className="border p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Inspiration: {inspiration.inspirationName}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                inspiration.difficulty === "Extreme"
                  ? "bg-red-500/20 text-red-400"
                  : inspiration.difficulty === "Hard"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {inspiration.difficulty}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="p-3 rounded-lg">
              <span className="block mb-1">Weight Diff</span>
              <span className="font-bold">
                {inspiration.weightDifference > 0 ? "+" : ""}
                {inspiration.weightDifference} kg
              </span>
            </div>
            <div className="p-3 rounded-lg">
              <span className="block mb-1">Est. Years</span>
              <span className="font-bold">
                {inspiration.estimatedYearsRequired} yr
              </span>
            </div>
          </div>
          {inspiration.warning && (
            <div className="text-xs flex gap-2 items-start p-3 rounded-xl">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              {inspiration.warning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
