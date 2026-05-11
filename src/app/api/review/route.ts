import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

/* ── Types ────────────────────────────────────────────────────────────────── */
export interface ReviewPayload {
  /** User profile from onboarding */
  user: {
    name: string;
    status: "pelajar" | "pekerja" | "freelancer" | "lainnya";
    reason: string;
  };
  /** Summary of answered questions in the session */
  sessionSummary: {
    section: "Listening" | "Structure" | "Reading";
    totalQuestions: number;
    correctAnswers: number;
    /** Detailed wrong answers for AI to analyze */
    mistakes: Array<{
      questionId: string;
      questionText: string;
      userAnswer: string;
      correctAnswer: string;
      /** Optional: category tag e.g. "subject-verb agreement", "inference" */
      category?: string;
    }>;
  };
}

export interface ReviewResponse {
  ok: boolean;
  review?: string;
  error?: string;
}

/* ── Build the AI prompt ───────────────────────────────────────────────── */
function buildPrompt(payload: ReviewPayload): string {
  const { user, sessionSummary } = payload;
  const accuracy = Math.round(
    (sessionSummary.correctAnswers / sessionSummary.totalQuestions) * 100
  );

  const mistakesList = sessionSummary.mistakes
    .map(
      (m, i) =>
        `${i + 1}. [${m.category ?? "General"}] Q: "${m.questionText}" → User answered: "${m.userAnswer}" | Correct: "${m.correctAnswer}"`
    )
    .join("\n");

  return `
Kamu adalah tutor TOEFL expert yang berbicara dalam Bahasa Indonesia dengan gaya yang tegas, jelas, dan mendorong semangat belajar.

## Profil Pelajar
- Nama: ${user.name}
- Status: ${user.status}
- Tujuan belajar TOEFL: ${user.reason}

## Hasil Sesi Latihan
- Seksi: ${sessionSummary.section}
- Total soal: ${sessionSummary.totalQuestions}
- Jawaban benar: ${sessionSummary.correctAnswers} (${accuracy}%)
- Jawaban salah: ${sessionSummary.mistakes.length}

## Detail Kesalahan
${mistakesList || "Tidak ada kesalahan — sempurna!"}

## Instruksi Review
Berikan "AI Deep Review" yang personal dan akurat untuk ${user.name}. Struktur review-mu WAJIB:

1. **Sapaan & Ringkasan Singkat** (1-2 kalimat)
   - Akui hasil ${accuracy}% dengan nada yang realistis dan memotivasi.

2. **Pola Kelemahan Utama** (2-3 poin)
   - Identifikasi pola kesalahan berulang dari daftar kesalahan di atas.
   - Beri nama kategori spesifik (misal: "Subject-Verb Agreement", "Inference Questions").

3. **Rekomendasi Aksi Konkret** (2-3 poin)
   - Tips langsung, bisa dipraktikkan, dan relevan dengan kesalahan yang ditemukan.
   - Sesuaikan dengan konteks ${user.reason} (tujuan belajar mereka).

4. **Penutup yang Membakar Semangat** (1-2 kalimat)
   - Spesifik ke nama "${user.name}", bukan generik.

Gunakan emoji secukupnya. Hindari template atau jawaban yang terlalu umum. Total panjang: 200-350 kata.
`.trim();
}

/* ── API Route Handler ─────────────────────────────────────────────────── */
export async function POST(request: NextRequest): Promise<NextResponse<ReviewResponse>> {
  try {
    /* Validate API key */
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    /* Parse & validate body */
    let payload: ReviewPayload;
    try {
      payload = (await request.json()) as ReviewPayload;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    if (!payload.user || !payload.sessionSummary) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: user and sessionSummary." },
        { status: 400 }
      );
    }

    /* Initialize Gemini */
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    /* Generate review */
    const prompt = buildPrompt(payload);
    const result = await model.generateContent(prompt);
    const review = result.response.text();

    return NextResponse.json({ ok: true, review }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/review] Error:", message);
    return NextResponse.json(
      { ok: false, error: `AI generation failed: ${message}` },
      { status: 500 }
    );
  }
}
