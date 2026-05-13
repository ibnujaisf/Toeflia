import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // 1. Ambil SEMUA sesi dari yang paling LAMA ke BARU (asc) 
    // agar kita bisa menghitung Attempt 1, 2, 3 dengan mudah
    const allSessions = await prisma.testSession.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const moduleCounts: Record<string, number> = {};

    // 2. Beri nomor Attempt per modul ke semua sesi
    const sessionsWithAttempt = allSessions.map((session) => {
      moduleCounts[session.moduleId] = (moduleCounts[session.moduleId] || 0) + 1;
      return {
        ...session,
        attemptNumber: moduleCounts[session.moduleId],
      };
    });

    // 3. Filter HANYA sesi yang punya AI Summary, lalu balik urutannya (reverse)
    // agar yang terbaru muncul di paling atas
    const insightsSessions = sessionsWithAttempt
      .filter((session) => session.aiSummary && session.aiSummary.trim() !== "")
      .reverse();

    return NextResponse.json({ success: true, sessions: insightsSessions });
  } catch (error: any) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}