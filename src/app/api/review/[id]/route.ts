import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // --- TAMBAHAN BARU: Hitung Global Attempt ---
    // Menghitung jumlah tes milik user ini yang dibuat sebelum atau pada saat yang sama dengan tes ini
    const attemptNumber = await prisma.testSession.count({
      where: {
        userId: session.userId,
        moduleId: session.moduleId, // <--- TAMBAHKAN BARIS INI
        createdAt: {
          lte: session.createdAt, 
        },
      },
    });

    // Sisipkan globalAttempt ke dalam objek session sebelum dikirim ke frontend
    const sessionWithAttempt = {
      ...session,
      globalAttempt: attemptNumber
    };

    return NextResponse.json({ success: true, session: sessionWithAttempt });
  } catch (error: any) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete related QuestionResult records first to avoid foreign key constraint error
    await prisma.questionResult.deleteMany({
      where: { sessionId: id }
    });

    // Delete the TestSession
    await prisma.testSession.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}