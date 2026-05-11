import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { aiService } from "@/services/ai.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Fetch Session Data for Context
    const session = await prisma.testSession.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' }
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Prepare Context for Gemini
    const contextData = JSON.stringify({
      module: session.moduleTitle,
      score: `${session.score}/${session.totalQuestions}`,
      aiSummary: session.aiSummary,
      questions: session.questions.map((q: any) => ({
        number: q.questionNumber,
        text: q.questionText,
        options: q.options, // Options are already stringified JSON in DB
        userAnswerIndex: q.userAnswer,
        correctAnswerIndex: q.correctAnswer,
        isCorrect: q.isCorrect,
        aiExplanation: q.aiExplanation
      }))
    });

    // 3. Get AI Reply
    const aiResponse = await aiService.chatWithTutor(message, contextData);

    return NextResponse.json({ success: true, reply: aiResponse });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
