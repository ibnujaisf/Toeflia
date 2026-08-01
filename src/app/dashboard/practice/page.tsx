"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PreTestModal from "@/components/features/PreTestModal";

// --- Mock Data ---
const MODULES = [
  {
    id: "listening",
    title: "Listening Comprehension",
    questions: 10,
    timeLabel: "7 Minutes",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    id: "structure",
    title: "Structure and Written Expression",
    questions: 10,
    timeLabel: "6m 15s",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: "reading",
    title: "Reading Comprehension",
    questions: 10,
    timeLabel: "11 Minutes",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export default function PracticePage() {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedModule) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedModule]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedModule(null);
    };
    if (selectedModule) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModule]);

  return (
    <div className="px-6 md:px-10 py-8 min-h-screen">
      <div className="max-w-5xl">
        
        {/* 1. Page Header */}
        <div className="mb-10 animate-fade-in-up">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter mb-2">
            Practice
          </p>
          <h1 className="font-urbanist font-extrabold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 mb-2">
            Select Practice Module
          </h1>
          <p className="text-sm text-zinc-500 font-inter">
            Choose a section to begin your 10-question micro-test.
          </p>
        </div>

        {/* 2. Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModule(mod);
              }}
              className="animate-fade-in-up group relative text-left bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 flex flex-col hover:scale-[1.02] hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-xl dark:hover:shadow-black/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors">
                  {mod.icon}
                </div>
                <h2 className="font-urbanist font-bold text-xl text-zinc-900 dark:text-zinc-50 pt-1 leading-snug">
                  {mod.title}
                </h2>
              </div>
              
              <div className="flex-1">
                <div className="space-y-1.5 mb-8">
                  <p className="text-sm text-zinc-500 font-inter">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.questions}</span> Questions
                  </p>
                  <p className="text-sm text-zinc-500 font-inter">
                    Standard Time: <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.timeLabel}</span>
                  </p>
                </div>
              </div>

             <div className="w-full mt-auto flex items-center justify-center py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 text-sm font-urbanist font-bold text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition-all duration-300">
                Select Module
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Pre-Flight Modal Overlay */}
      <PreTestModal
        isOpen={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
        onStart={(timerEnabled) => {
          if (!selectedModule) return;
          router.push(`/dashboard/practice/${selectedModule.id}?timer=${timerEnabled}`);
        }}
        title={selectedModule?.title || ""}
        duration={selectedModule?.timeLabel || ""}
        questions={selectedModule?.questions || 0}
        icon={selectedModule?.icon}
      />
    </div>
  );
}
