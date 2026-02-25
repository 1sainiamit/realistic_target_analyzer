import { NextResponse } from "next/server";
import { inspirationEngine, projectionEngine } from "@/lib/inspiration-engine";
import { FitnessSchema } from "@/app/types/fitness";
import { generateGeminiAnalysis } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = FitnessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: parsed.error },
        { status: 400 }
      );
    }

    const projection = projectionEngine(parsed.data);
    const inspiration = inspirationEngine(parsed.data);

    let aiAnalysis = null;
    try {
      aiAnalysis = await generateGeminiAnalysis(parsed.data, projection, inspiration);
    } catch (aiError: any) {
      console.error("AI Analysis failed:", aiError.message);
    }

    return NextResponse.json({
      projection,
      inspiration,
      aiAnalysis
    });

  } catch (error: any) {
    console.error("Fatal API Error in /api/analyze:", error.stack || error.message);
    return NextResponse.json(
      { error: "Something went wrong during analysis", details: error.message },
      { status: 500 }
    );
  }
}