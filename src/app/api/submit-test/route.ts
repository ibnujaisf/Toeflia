import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aiService } from "@/services/ai.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moduleId, moduleTitle, score, totalQuestions, questions } = body;

    // Basic Validation
    if (!userId || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // 1. Evaluate with AI
    let aiEvaluation: { aiSummary: string; explanations: any[]; tips?: string[] } = { aiSummary: "Test completed.", explanations: [] as any[] };
    try {
      aiEvaluation = await aiService.evaluateTest(moduleId, score, totalQuestions, questions);
    } catch (error) {
      console.error("AI Evaluation failed, using fallback.", error);
    }

    // 2. Map AI explanations for quick access
    const explanationMap = new Map<number, string>();
    if (aiEvaluation.explanations && Array.isArray(aiEvaluation.explanations)) {
      aiEvaluation.explanations.forEach((item: any) => {
        explanationMap.set(item.questionNumber, item.explanation);
      });
    }

    // 3. Ensure User exists in database
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: "Guest Student",
        reason: "Trying the simulation"
      }
    });

    // 4. Save to Database via Prisma
    const session = await prisma.testSession.create({
      data: {
        userId: dbUser.id,
        moduleId,
        moduleTitle,
        score,
        totalQuestions,
        aiSummary: aiEvaluation.aiSummary,
        tips: aiEvaluation.tips || [],
        isReviewed: true,
        questions: {
          create: questions.map((q: any) => ({
            questionNumber: q.id,
            type: q.type || null,
            passage: q.passage || null,
            transcript: q.transcript || null,
            questionText: q.text,
            options: JSON.stringify(q.options),
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            aiExplanation: explanationMap.get(q.id) || null,
          }))
        }
      }
    });

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error: any) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
