"use client";

import { useState, useEffect, use, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface TestPageProps {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function FocusModeTestPage({ params, searchParams }: TestPageProps) {
  const router = useRouter();
  const { user } = useUser();

  // Unwrap the Promises
  const { moduleId } = use(params);
  const search = use(searchParams);

  // Read timer toggle from URL (default to true if not explicitly false)
  const isTimerEnabled = search?.timer !== "false";
  const isRetake = search?.retake === "true";
  const aiSummary = (search?.summary as string) || ""; // Tangkap summary dari URL

  // Determine initial time based on section
  const initialTime = moduleId === "listening" ? 7 * 60 : moduleId === "structure" ? 6 * 60 + 15 : moduleId === "reading" ? 11 * 60 : 7 * 60;

  // Data State
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Answer State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- TTS STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  // KODE BARU: Saklar pemutus loop audio
  const audioSessionRef = useRef(0);

  // --- 1. LOGIKA PENGELOMPOKAN SOAL (GROUPING) ---
  const displayGroups = useMemo(() => {
    if (questions.length === 0) return [];

    if (moduleId === "listening") {
      // TOEFL ITP Specific: Group questions 7-8 and 9-10
      return [[0], [1], [2], [3], [4], [5], [6, 7], [8, 9]];
    }

    // Default: 1 question per page
    return questions.map((_, i) => [i]);
  }, [questions, moduleId]);

  // --- 1. GEMBOK DOUBLE FETCH ---
  const hasFetched = useRef(false);

  // Fetch AI Generated Questions
  useEffect(() => {
    // Cegah eksekusi ganda di Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module: moduleId,
            isRetake: isRetake,     // <-- Kirim status retake
            aiSummary: aiSummary    // <-- Kirim summary
          })
        });
        const data = await response.json();
        if (data.success) {
          setQuestions(data.questions);
        } else {
          console.error("Failed to fetch generated questions:", data.error);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId) {
      fetchQuestions();
    }
  }, [moduleId]);

  // TTS Cleanup
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);


  // Stop audio, reset status, dan MATIKAN SESI saat pindah halaman
  useEffect(() => {
    audioSessionRef.current += 1; // Ubah ID sesi untuk mematikan proses lama
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setHasPlayed(false);
  }, [currentIndex]);

  const handlePlayAudio = async () => {
    if (currentGroup.length === 0 || hasPlayed) return;

    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setHasPlayed(true); // Lock play button

    // Kunci sesi audio saat ini
    audioSessionRef.current += 1;
    const mySessionId = audioSessionRef.current;

    // Fungsi pengecek keamanan: Apakah user sudah pindah soal?
    const isSessionActive = () => mySessionId === audioSessionRef.current;

    const speak = (text: string, rate = 0.9) => {
      return new Promise<void>((resolve) => {
        if (!isSessionActive()) return resolve(); // Batal bunyi kalau sesi beda

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;

        // Cari suara jernih bawaan browser jika ada
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v =>
          (v.name.includes('Natural') && v.lang.includes('en')) ||
          v.name.includes('Google US English') ||
          v.name.includes('Zira') ||
          v.lang.includes('en-US') || v.lang.includes('en-GB')
        );

        if (englishVoice) utterance.voice = englishVoice;

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // 1. Read Main Transcript (Dipotong per baris supaya ada jeda nafas natural)
      const firstQ = questions[currentGroup[0]];
      if (firstQ?.transcript) {
        const lines = firstQ.transcript.split('\n');
        for (const line of lines) {
          if (!isSessionActive()) return; // Cek saklar
          if (!line.trim()) continue;

          await speak(line.trim());

          if (!isSessionActive()) return; // Cek saklar
          await sleep(400); // Jeda nafas antar dialog
        }

        if (!isSessionActive()) return; // Cek saklar
        await sleep(2000); // 2s pause after story
      }

      // 2. Read Questions sequentially with thinking pause
      for (let i = 0; i < currentGroup.length; i++) {
        if (!isSessionActive()) return; // Cek saklar

        const qIdx = currentGroup[i];
        const q = questions[qIdx];

        await speak(`Question ${qIdx + 1}`);

        if (!isSessionActive()) return; // Cek saklar
        await sleep(500);

        if (q.text) {
          await speak(q.text);
        }

        // 6s pause for user to think/answer (except for last question in group)
        if (i < currentGroup.length - 1) {
          if (!isSessionActive()) return; // Cek saklar
          await sleep(6000);
        }
      }
    } finally {
      // Hanya kembalikan tombol play jika user belum pindah halaman
      if (isSessionActive()) {
        setIsPlaying(false);
      }
    }
  };

  // Timer countdown logic
  useEffect(() => {
    // Tahan timer jika masih loading, soal kosong, atau timer tidak diaktifkan
    if (isLoading || questions.length === 0 || !isTimerEnabled || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, questions, isTimerEnabled, isSubmitted]);

  // Submit Confirmation State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const performFinalSubmit = async () => {
    setIsSubmitting(true);

    // Calculate local score & build payload
    let score = 0;
    const questionsPayload = questions.map((q, i) => {
      const uAnswer = answers[i] ?? -1;
      const isCorrect = uAnswer === q.correctAnswer;
      if (isCorrect) score++;

      return {
        id: q.id || i + 1,
        type: q.type || null,
        passage: q.passage || null,
        transcript: q.transcript || null,
        text: q.text,
        options: q.options,
        userAnswer: uAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const payload = {
      userId: user?.id || "user-123",
      moduleId: moduleId,
      moduleTitle: getModuleTitle(),
      score: score,
      totalQuestions: questions.length,
      questions: questionsPayload
    };

    try {
      const res = await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.sessionId) {
        setIsSubmitted(true);
        setIsSubmitModalOpen(false);
        router.push("/dashboard/review/" + data.sessionId);
      } else {
        console.error("Submission failed:", data.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setIsSubmitting(false);
    }
  };

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (isTimerEnabled && timeLeft === 0 && !isSubmitted && !isSubmitting) {
      setIsTimeUp(true);
      performFinalSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isTimerEnabled, isSubmitted, isSubmitting]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < displayGroups.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Triggered when "Submit Test" button is clicked
  const checkTestCompleteness = () => {
    const unanswered: number[] = [];
    questions.forEach((q, i) => {
      if (answers[i] === undefined) {
        unanswered.push(i + 1);
      }
    });
    setUnansweredQuestions(unanswered);
    setIsSubmitModalOpen(true);
  };

  const currentGroup = displayGroups[currentIndex] || [];
  const currentQ = questions[currentGroup[0]] || {};

  // Map module ID to full name for header
  const getModuleTitle = () => {
    if (moduleId === "listening") return "Listening Comprehension";
    if (moduleId === "structure") return "Structure and Written Expression";
    if (moduleId === "reading") return "Reading Comprehension";
    return "Practice Module";
  };

  const getModuleIcon = () => {
    if (moduleId === "listening") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      );
    }
    if (moduleId === "structure") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    }
    if (moduleId === "reading") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
      </svg>
    );
  };

  // Conditionally render the question area based on the moduleId
  const renderQuestionArea = () => {

    // 1. Listening Module (Minimalist & Immersive)
    if (moduleId === "listening") {
      return (
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-10 animate-fade-in">
          {/* Compact Audio Control Bar */}
          <div className="w-full bg-zinc-900 dark:bg-zinc-100 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-lg text-white dark:text-zinc-950 mb-2 animate-fade-in border border-white/10 dark:border-zinc-200">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h3 className="font-urbanist font-bold text-base md:text-lg leading-tight">Audio Track</h3>
                <p className="font-inter text-xs md:text-sm opacity-70">
                  {hasPlayed ? "Audio finished." : "Listen carefully. Audio plays only once."}
                </p>
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              disabled={isPlaying || hasPlayed}
              className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-md ${hasPlayed
                ? "bg-zinc-700 text-zinc-500 dark:bg-zinc-300 dark:text-zinc-500 cursor-not-allowed"
                : isPlaying
                  ? "bg-white/20 dark:bg-black/10 animate-pulse cursor-not-allowed"
                  : "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white hover:scale-105 active:scale-95"
                }`}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              ) : hasPlayed ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              )}
            </button>
          </div>

          {/* Grouped Questions */}
          <div className="flex flex-col gap-12">
            {currentGroup.map((qIndex: number) => {
              const q = questions[qIndex];
              return (
                <div key={qIndex} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-urbanist font-black text-sm shadow-lg">
                      {qIndex + 1}
                    </span>
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800"></div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {q.options?.map((opt: string, i: number) => {
                      const isSelected = answers[qIndex] === i;
                      const label = `${String.fromCharCode(65 + i)}. `;

                      return (
                        <button
                          key={i}
                          onClick={() => handleOptionSelect(qIndex, i)}
                          className={`text-left p-5 rounded-2xl border transition-all duration-200 font-inter text-sm md:text-base ${isSelected
                            ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900"
                            : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 shadow-sm"
                            }`}
                        >
                          <span className="font-black mr-2">{label}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. Reading Module (Split Screen)
    if (moduleId === "reading") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full max-w-7xl mx-auto h-full">
          {/* Passage Column */}
          <div className="flex flex-col overflow-y-auto pr-2 lg:pr-6 h-[40vh] lg:h-[calc(100vh-200px)] custom-scrollbar">
            <h3 className="font-urbanist font-extrabold text-2xl text-zinc-900 dark:text-zinc-50 mb-6 sticky top-0 bg-white dark:bg-zinc-950 pt-2 pb-4 z-10">
              Reading Passage
            </h3>
            {/* Kode Baru: Pemecah Paragraf Otomatis */}
            {/* Kode Baru: Pemecah Paragraf Otomatis (TypeScript Ready) */}
            <div className="space-y-5 text-zinc-700 dark:text-zinc-300 font-inter text-base leading-relaxed">
              {currentQ.passage ? (
                currentQ.passage.split('\n').map((paragraph: string, index: number) => {
                  // Hanya render jika paragraf tidak kosong
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-justify">
                        {paragraph.trim()}
                      </p>
                    );
                  }
                  return null;
                })
              ) : (
                "No reading passage provided for this question."
              )}
            </div>
          </div>

          {/* Question Column */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-6 animate-fade-in">
              <h2 className="font-urbanist font-bold text-2xl text-zinc-900 dark:text-zinc-50 leading-snug">
                {currentGroup[0] + 1}. {currentQ.text}
              </h2>
              <div className="flex flex-col gap-3">
                {currentQ.options?.map((opt: string, i: number) => {
                  const isSelected = answers[currentGroup[0]] === i;
                  const label = `${String.fromCharCode(65 + i)}. `;

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(currentGroup[0], i)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-200 font-inter text-sm md:text-base ${isSelected
                        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900"
                        : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
                        }`}
                    >
                      <span className="font-bold mr-2">{label}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Structure Module (Default Single Column)
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex flex-col gap-6 animate-fade-in">
          <h2 className="font-urbanist font-bold text-2xl text-zinc-900 dark:text-zinc-50 leading-snug">
            {currentGroup[0] + 1}. {currentQ.text}
          </h2>
          <div className="flex flex-col gap-3">
            {currentQ.options?.map((opt: string, i: number) => {
              const isSelected = answers[currentGroup[0]] === i;
              const label = `${String.fromCharCode(65 + i)}. `;

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(currentGroup[0], i)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 font-inter text-sm md:text-base ${isSelected
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
                    }`}
                >
                  <span className="font-bold mr-2">{label}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[150] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
        <span className="w-10 h-10 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-50 animate-spin mb-4"></span>
        <p className="font-urbanist font-bold text-xl text-zinc-900 dark:text-zinc-50">AI is crafting your unique 10-question test...</p>
        <p className="text-sm font-inter text-zinc-500 mt-2">This takes about 5-10 seconds. Focus up!</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[150] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
        <p className="font-urbanist font-bold text-xl text-zinc-900 dark:text-zinc-50">Failed to generate test</p>
        <button onClick={() => router.push("/dashboard/practice")} className="mt-4 px-6 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-urbanist font-bold text-sm">Return to Practice</button>
      </div>
    );
  }

  return (
    // FULL SCREEN FOCUS MODE (Covers Sidebar due to fixed inset-0 z-50)
    <div className="fixed inset-0 z-[150] bg-white dark:bg-zinc-950 flex flex-col h-[100dvh]">

      {/* 1. TEST HEADER */}
      <header className="relative shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-20">

        {/* Left: Module Icon & Name (Clickable to Quit) */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => router.push("/dashboard/practice")}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80 outline-none group"
            title="Quit Test"
          >
            <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 text-zinc-900 dark:text-zinc-50 shadow-sm group-hover:scale-105 transition-transform">
              {getModuleIcon()}
            </div>
          </button>
          <div className="hidden md:block w-px h-6 bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
          <div className="hidden md:block font-urbanist font-bold text-base text-zinc-900 dark:text-zinc-50 truncate">
            {getModuleTitle()}
          </div>
        </div>

        {/* Center: Timer & Progress Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {isTimerEnabled ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1.5 text-zinc-900 dark:text-zinc-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-base font-urbanist font-extrabold tracking-widest tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="w-32 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / initialTime) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-xs font-urbanist font-bold tracking-widest uppercase">
                Untimed
              </span>
            </div>
          )}
        </div>

        {/* Right: Question Indicator */}
        <div className="flex-1 flex justify-end">
          <div className="text-sm font-inter text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
            {moduleId === "listening" ? (
              <span className="font-bold text-zinc-900 dark:text-zinc-50">Page {currentIndex + 1}</span>
            ) : (
              <span className="font-bold text-zinc-900 dark:text-zinc-50">Question {currentIndex + 1}</span>
            )} of {displayGroups.length}
          </div>
        </div>

      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        {renderQuestionArea()}
      </main>

      {/* 3. FOOTER NAVIGATION */}
      <footer className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-5 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-urbanist font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
        >
          Previous
        </button>

        {currentIndex === displayGroups.length - 1 ? (
          <button
            onClick={checkTestCompleteness}
            className="px-8 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-xl dark:shadow-black/20"
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all"
          >
            Next
          </button>
        )}
      </footer>

      {/* 4. SUBMIT CONFIRMATION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-zinc-950/40 dark:bg-zinc-950/80 backdrop-blur-md" onClick={() => setIsSubmitModalOpen(false)} />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h2 className="font-urbanist font-extrabold text-2xl text-zinc-900 dark:text-zinc-50 mb-3">
              Ready to Submit?
            </h2>

            {unansweredQuestions.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400 font-inter mb-8">
                All questions have been answered. Are you sure you want to finish the test?
              </p>
            ) : (
              <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-8">
                <p className="font-inter text-zinc-900 dark:text-zinc-50 mb-2">
                  Wait! You haven&apos;t answered some questions.
                </p>
                <p className="font-inter font-semibold text-sm text-zinc-500 dark:text-zinc-400">
                  Unanswered: Question {unansweredQuestions.join(", ")}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 px-5 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-urbanist font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Back to Test
              </button>
              <button
                onClick={performFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 px-5 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 dark:border-zinc-950/30 border-t-white dark:border-t-zinc-950 animate-spin"></span>
                    AI is analyzing...
                  </>
                ) : (
                  unansweredQuestions.length === 0 ? "Finish Test" : "Submit Anyway"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 5. BLOCKING OVERLAY (TIME'S UP / SUBMITTING) */}
      {(isSubmitting || isTimeUp) && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Darker Backdrop */}
          <div className="absolute inset-0 bg-zinc-950/60 dark:bg-zinc-950/90 backdrop-blur-xl" />

          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-10 shadow-2xl flex flex-col items-center text-center animate-scale-in">
            {/* Animated Icon */}
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 animate-spin" />
              {isTimeUp ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-zinc-900 dark:text-zinc-50">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-zinc-900 dark:text-zinc-50">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
            </div>

            <h2 className="font-urbanist font-extrabold text-2xl text-zinc-900 dark:text-zinc-50 mb-3">
              {isTimeUp ? "Time's Up!" : "Finalizing Test"}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-inter text-sm leading-relaxed max-w-[240px]">
              {isTimeUp
                ? "Your time has expired. AI is currently analyzing your answers..."
                : "Please wait while our AI tutor evaluates your performance..."}
            </p>

            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-950 rounded-full border border-zinc-100 dark:border-zinc-800">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              <span className="text-[10px] font-urbanist font-bold uppercase tracking-widest text-zinc-500 ml-1">Analyzing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
