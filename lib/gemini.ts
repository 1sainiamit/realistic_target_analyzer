import { GoogleGenerativeAI } from "@google/generative-ai";
import { FitnessInput, ProjectionResult, AIAnalysisResult, InspirationResult, InspirationProfile } from "@/app/types/fitness";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateGeminiAnalysis(
    input: FitnessInput,
    projection: ProjectionResult,
    inspiration: InspirationResult | null
): Promise<AIAnalysisResult> {
    const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-pro-latest"
    ];
    let text: string | null = null;
    let lastError: any = null;

    const prompt = `
You are an AI Fitness Projection Analyst integrated inside a web application called 
"AI Gym Body Realistic Target Analyzer".

ROLE:
Analyze structured fitness data using sports science principles.
Evaluate whether the user's goal is realistic.
Explain projections clearly.
Compare user stats with inspiration physiques when provided.
Maintain a professional, motivating, honest tone.

BEHAVIOR RULES:
- Base reasoning ONLY on the structured data provided.
- Do NOT invent numbers.
- Do NOT exaggerate transformation speed.
- Do NOT promote unsafe dieting, steroids, or extreme methods.
- If goal is unrealistic, clearly explain why.
- If inspiration is elite-level, highlight years of training and genetics.
- Be concise but insightful.
- Speak like a certified strength coach.
- No medical disclaimers.
- Do not mention that you are an AI.

STRUCTURED DATA:
User Input: ${JSON.stringify(input, null, 2)}
Projection Data: ${JSON.stringify(projection, null, 2)}
Inspiration Comparison: ${inspiration ? JSON.stringify(inspiration, null, 2) : "None provided"}

OUTPUT FORMAT (STRICT):
Return STRICTLY in JSON format:
{
  "assessment": "Detailed assessment of their current status and metabolic data",
  "timeline_analysis": "Analysis of the requested timeline vs realistic projections",
  "verdict": "Final word on whether the goal is achievable",
  "inspiration_comparison": "Direct comparison with the target physique",
  "strategy": "High-level nutritional and training strategy approach",
  "motivation": "A powerful summary to keep them focused"
}
`;

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting Gemini Analysis with model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
            if (text) {
                console.log(`Gemini Analysis successful with model: ${modelName}`);
                break;
            }
        } catch (error: any) {
            lastError = error;
            console.error(`Gemini model ${modelName} failed:`, error.message);
            if (error.status) console.error(`Status code: ${error.status}`);
        }
    }

    if (!text) {
        throw new Error(`AI Analysis failed after trying multiple models. Last error: ${lastError?.message}`);
    }

    try {
        return JSON.parse(text) as AIAnalysisResult;
    } catch (parseError) {
        console.error("Failed to parse Gemini JSON:", text);
        throw new Error("AI returned invalid JSON format");
    }
}

export async function fetchInspirationProfile(name: string): Promise<InspirationProfile | null> {
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-pro-latest"
    ];

    const prompt = `
You are a fitness data expert. Provide realistic physique statistics for the following person: "${name}".
If this is a famous person, provide their known or highly estimated peak physique stats.
If this is not a specific person, provide realistic stats for a "typical" physique of that type.

Return ONLY a JSON object with the following structure:
{
  "name": "Full Name",
  "height": number (in cm),
  "stageWeight": number (in kg at low body fat),
  "bodyFat": number (percentage),
  "trainingYears": number (years of training to reach this look),
  "level": "elite" | "advanced" | "athletic"
}

Rules for 'level':
- "elite": IFBB Pros, World Class Athletes, Top Tier Bodybuilders (e.g. Cbum, Arnold).
- "advanced": Very high level fitness influencers, actors in peak movie roles (e.g. David Laid, Hemsworth).
- "athletic": Standard fit physique, sports-ready.

Example:
{
  "name": "Chris Bumstead",
  "height": 185,
  "stageWeight": 110,
  "bodyFat": 6,
  "trainingYears": 10,
  "level": "elite"
}
`;

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting to fetch inspiration profile with model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            if (text) {
                return JSON.parse(text) as InspirationProfile;
            }
        } catch (error: any) {
            console.error(`Gemini model ${modelName} failed for profile look up:`, error.message);
        }
    }

    return null;
}
