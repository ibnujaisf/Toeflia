import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // 1. Ambil SEMUA sesi user (Urutkan dari yang terbaru)
    // Ini penting agar kita bisa menghitung urutan attempt yang benar
    const allSessions = await prisma.testSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Siapkan penampung stats
    let totalScore = 0;
    let totalQuestions = 0;
    const moduleStats: Record<string, { score: number, total: number }> = {
      listening: { score: 0, total: 0 },
      structure: { score: 0, total: 0 },
      reading: { score: 0, total: 0 }
    };

    // Tracker untuk menghitung total attempt per modul secara keseluruhan
    const moduleTotalCounts: Record<string, number> = {
      listening: 0,
      structure: 0,
      reading: 0
    };

    // 3. Proses SEMUA sesi untuk menghitung statistik global dan total per modul
    allSessions.forEach((session: any) => {
      totalScore += session.score;
      totalQuestions += session.totalQuestions;

      if (moduleStats[session.moduleId]) {
        moduleStats[session.moduleId].score += session.score;
        moduleStats[session.moduleId].total += session.totalQuestions;
        moduleTotalCounts[session.moduleId]++; // Hitung berapa kali modul ini dikerjakan
      }
    });

    // 4. Hitung Attempt Number secara akurat per modul
    // Kita buat copy tracker untuk menghitung mundur
    const attemptTracker = { ...moduleTotalCounts };

    const processedSessions = allSessions.map((s: any) => {
      const currentAttempt = attemptTracker[s.moduleId];
      // Kurangi tracker agar sesi yang lebih lama (di urutan bawah) mendapat nomor lebih kecil
      if (attemptTracker[s.moduleId] !== undefined) {
        attemptTracker[s.moduleId]--;
      }
      
      return {
        id: s.id,
        module: s.moduleTitle,
        score: `${s.score}/${s.totalQuestions}`,
        date: s.createdAt,
        attemptNumber: currentAttempt || 1 ,
        aiSummary: s.aiSummary,
        tips: s.tips
      };
    });

    // 5. Ambil hanya 5 terbaru untuk Recent Activity
    const recentActivity = processedSessions.slice(0, 5);

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