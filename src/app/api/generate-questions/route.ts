import { NextResponse } from "next/server";
import { aiService } from "@/services/ai.service";

export async function POST(request: Request) {
  try {
    const { module, isRetake, aiSummary } = await request.json();
    
    if (!module) {
      return NextResponse.json({ error: "Module is required" }, { status: 400 });
    }

    const aiEvaluation = await aiService.generateQuestions(module, isRetake, aiSummary);
    console.log("Successfully generated questions for module:", module);
    
    return NextResponse.json({ success: true, questions: aiEvaluation });
  } catch (error: any) {
    console.error("Generator Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
