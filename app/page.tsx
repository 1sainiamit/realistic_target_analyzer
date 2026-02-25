"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "lucide-react";
import {
  FitnessInput,
  FitnessSchema,
  ProjectionResult,
  AIAnalysisResult,
  InspirationResult,
} from "./types/fitness";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisResult } from "@/components/AnalysisResult";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<{
    projection: ProjectionResult;
    inspiration: InspirationResult | null;
    aiAnalysis: AIAnalysisResult | null;
    aiError?: boolean;
  } | null>(null);
  const [showForm, setShowForm] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FitnessInput>({
    resolver: zodResolver(FitnessSchema),
    defaultValues: {
      age: 25,
      gender: "male",
      height: 175,
      weight: 70,
      activityLevel: "moderate",
      experience: "beginner",
      goalType: "recomposition",
      timelineMonths: 3,
      inspiration: "",
    },
  });

  async function onSubmit(data: FitnessInput) {
    setLoading(true);
    setAnalysisData(null);
    const toastId = toast.loading("Analyzing your physique data...");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("API call failed");

      const result = await res.json();
      setAnalysisData(result);
      setShowForm(false);

      if (result.aiError) {
        toast.warning("Metabolic data calculated, but AI depth analysis failed.", { id: toastId });
      } else {
        toast.success("Analysis complete!", { id: toastId });
      }

      // Scroll to results after a short delay for animation
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to analyze data. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-5 px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium">
            <Activity className="w-3 h-3" />
            AI-POWERED PROJECTION ENGINE
          </div>
          <h1 className="text-2xl md:text-3xl text-green-400 font-extrabold tracking-tight bg-clip-text bg-linear-to-b">
            Realistic Target <span>Analyzer</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {showForm ? (
            <div className="backdrop-blur-xl border p-5 rounded-xl shadow-2xl relative overflow-hidden">
              {/* Subtle backlight effect */}
              <div className="absolute -top-24 -left-24 w-48 h-48 blur-[100px] rounded-full bg-green-500/10" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10"
              >
                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Age
                  </Label>
                  <Input
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    className="h-10 border rounded-xl transition-all"
                  />
                  {errors.age && (
                    <span className="text-xs">{errors.age.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Gender
                  </Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-10 border rounded-xl transition-all">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="border">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Height (cm)
                  </Label>
                  <Input
                    type="number"
                    {...register("height", { valueAsNumber: true })}
                    className="h-10 border rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Current Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    {...register("weight", { valueAsNumber: true })}
                    className="h-10 border rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Activity Level
                  </Label>
                  <Controller
                    control={control}
                    name="activityLevel"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-10 border rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border">
                          <SelectItem value="sedentary">
                            Sedentary (Office job)
                          </SelectItem>
                          <SelectItem value="moderate">
                            Moderate (3-5x/wk)
                          </SelectItem>
                          <SelectItem value="active">
                            Active (Daily/Athletic)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Experience
                  </Label>
                  <Controller
                    control={control}
                    name="experience"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-10 border rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border">
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Primary Goal
                  </Label>
                  <Controller
                    control={control}
                    name="goalType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-10 border rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border">
                          <SelectItem value="fat_loss">Fat Loss</SelectItem>
                          <SelectItem value="muscle_gain">
                            Muscle Gain
                          </SelectItem>
                          <SelectItem value="recomposition">
                            Body Recomp
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Target Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    {...register("targetWeight", { valueAsNumber: true })}
                    className="h-10 border rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Timeline (Months)
                  </Label>
                  <Input
                    type="number"
                    {...register("timelineMonths", { valueAsNumber: true })}
                    className="h-10 border rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label className="text-xs uppercase tracking-tight ml-1">
                    Inspiration (Name/Physique)
                  </Label>
                  <Input
                    {...register("inspiration")}
                    placeholder="e.g. David Laid, Alex Eubank..."
                    className="h-10 border rounded-xl"
                  />
                </div>

                <div className="md:col-span-2 mt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl font-bold text-base transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 rounded-full animate-spin" />
                        ANALYZING DATA...
                      </div>
                    ) : (
                      "CALCULATE PROJECTION"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 rounded-xl border-green-500/20 hover:bg-green-500/10"
              >
                <RefreshCcw className="w-4 h-4" />
                Modify Assessment Data
              </Button>
            </div>
          )}

          <div id="results">
            {analysisData && (
              <AnalysisResult
                projection={analysisData.projection}
                inspiration={analysisData.inspiration}
                aiAnalysis={analysisData.aiAnalysis}
                aiError={analysisData.aiError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
