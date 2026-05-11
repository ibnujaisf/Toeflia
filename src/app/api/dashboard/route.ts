import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // 1. Fetch all sessions for this user
    const sessions = await prisma.testSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Calculations
    let totalScore = 0;
    let totalQuestions = 0;

    const moduleStats: Record<string, { score: number, total: number }> = {
      listening: { score: 0, total: 0 },
      structure: { score: 0, total: 0 },
      reading: { score: 0, total: 0 }
    };

    sessions.forEach((session: any) => {
      totalScore += session.score;
      totalQuestions += session.totalQuestions;

      if (moduleStats[session.moduleId]) {
        moduleStats[session.moduleId].score += session.score;
        moduleStats[session.moduleId].total += session.totalQuestions;
      }
    });

    const overallAccuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    const modules = [
      {
        id: "listening",
        section: "Listening Comprehension",
        score: `${moduleStats.listening.score} / ${moduleStats.listening.total}`,
        accuracy: `${moduleStats.listening.total > 0 ? Math.round((moduleStats.listening.score / moduleStats.listening.total) * 100) : 0}%`
      },
      {
        id: "structure",
        section: "Structure & Written",
        score: `${moduleStats.structure.score} / ${moduleStats.structure.total}`,
        accuracy: `${moduleStats.structure.total > 0 ? Math.round((moduleStats.structure.score / moduleStats.structure.total) * 100) : 0}%`
      },
      {
        id: "reading",
        section: "Reading Comprehension",
        score: `${moduleStats.reading.score} / ${moduleStats.reading.total}`,
        accuracy: `${moduleStats.reading.total > 0 ? Math.round((moduleStats.reading.score / moduleStats.reading.total) * 100) : 0}%`
      }
    ];

    const recentActivity = sessions.slice(0, 5).map((s: any) => ({
      id: s.id,
      module: s.moduleTitle,
      score: `${s.score}/${s.totalQuestions}`,
      date: s.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          accuracy: `${overallAccuracy}%`,
          totalCorrect: totalScore,
          totalQuestions: totalQuestions
        },
        modules,
        recentActivity
      }
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
