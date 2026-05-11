"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/features/Navbar";
import OnboardingModal from "@/components/features/OnboardingModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { UserProvider } from "@/context/UserContext";

/* ─────────────────────────── HERO ──────────────────────────────────────── */
function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-28 pb-20 text-center overflow-hidden"
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.8) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,0,0,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-4 py-2 bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-full">
          <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white animate-pulse" />
          <span className="text-xs font-inter text-zinc-500 dark:text-zinc-400 tracking-wide">
            TOEFL Intelligent Academy
          </span>
        </div>

        {/* H1 */}
        <h1 className="animate-fade-in-up delay-100 font-urbanist font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.93] tracking-tight text-zinc-950 dark:text-zinc-50">
          Master the TOEFL.
          <br />
          <span className="text-zinc-400 dark:text-zinc-500">
            Powered Entirely by AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 max-w-lg text-zinc-500 dark:text-zinc-400 text-base md:text-lg font-inter leading-relaxed">
          A next-generation micro-learning simulator that adapts to your exact
          weaknesses — not just your score.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center gap-3 mt-2">
          <button
            id="hero-cta"
            onClick={onStart}
            className="group flex items-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-black font-urbanist font-bold text-sm px-8 py-4 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all duration-200"
          >
            Let&apos;s Start
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="#about"
            className="text-sm font-inter text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-4 py-4 transition-colors"
          >
            Learn more ↓
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400 flex flex-wrap justify-center gap-10 mt-10 pt-10 border-t border-zinc-200 dark:border-zinc-800/60 w-full">
          {[
            { v: "3", u: "Sections", l: "Listening · Structure · Reading" },
            { v: "100%", u: "AI-Driven", l: "Questions, review & remediation" },
            { v: "Free", u: "Forever", l: "No credit card required" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center gap-0.5">
              <span className="font-urbanist font-extrabold text-3xl text-zinc-950 dark:text-zinc-50">
                {s.v}
                <span className="text-zinc-400 dark:text-zinc-500 text-lg ml-1">{s.u}</span>
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-600 font-inter">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── ABOUT ─────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-inter text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            Why Toeflia Exists
          </p>
          <h2 className="font-urbanist font-extrabold text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50">
            The Problem.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">The Solution.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Problem card */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col gap-5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-lg">
              ⚠
            </div>
            <div>
              <h3 className="font-urbanist font-bold text-xl text-zinc-950 dark:text-zinc-50 mb-3">
                Traditional prep is broken.
              </h3>
              <p className="text-sm font-inter text-zinc-500 dark:text-zinc-500 leading-relaxed mb-3">
                Final-year students scrambling to meet{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">graduation requirements</strong> and
                job-seekers chasing{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">professional certifications</strong> face
                the same wall: TOEFL prep courses are expensive, rigid in
                schedule, and completely disconnected from how they actually
                learn.
              </p>
              <p className="text-sm font-inter text-zinc-500 dark:text-zinc-500 leading-relaxed">
                You study for hours. You still can&apos;t pinpoint what&apos;s holding
                your score back. Generic practice tests treat every mistake the
                same — they don&apos;t adapt. You do.
              </p>
            </div>
          </div>

          {/* Solution card */}
          <div className="bg-zinc-950 dark:bg-zinc-50 border border-zinc-800 dark:border-zinc-200 rounded-3xl p-8 flex flex-col gap-5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center text-lg">
              ✦
            </div>
            <div>
              <h3 className="font-urbanist font-bold text-xl text-zinc-50 dark:text-zinc-950 mb-3">
                Toeflia: 100% AI-driven.
              </h3>
              <p className="text-sm font-inter text-zinc-400 dark:text-zinc-600 leading-relaxed mb-3">
                Toeflia is a free, AI-powered TOEFL simulator built on
                micro-learning principles. Every practice session is short,
                focused, and timed proportionally to the real TOEFL ITP — so the
                pressure is real.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "AI generates and curates every question",
                  "Instant deep-dive explanations per answer",
                  "Personalized Mistake Analysis after every session",
                  "AI Remedial: 10 targeted questions on your weak spots",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-zinc-800 dark:bg-zinc-300 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="text-white dark:text-zinc-950">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
                      </svg>
                    </span>
                    <span className="text-xs font-inter text-zinc-300 dark:text-zinc-600 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FEATURES ──────────────────────────────────── */
const MODULES = [
  {
    id: "feat-listening",
    icon: "🎧",
    label: "Listening Comprehension",
    q: 10,
    time: "7 min",
    desc: "Short conversations, academic lectures, and note-taking comprehension.",
    tag: "Section 01",
  },
  {
    id: "feat-structure",
    icon: "⚡",
    label: "Structure & Written Expression",
    q: 10,
    time: "6 min 15 sec",
    desc: "Sentence completion and error identification across grammar patterns.",
    tag: "Section 02",
  },
  {
    id: "feat-reading",
    icon: "📖",
    label: "Reading Comprehension",
    q: 10,
    time: "11 min",
    desc: "Long academic passages with inference, vocabulary, and main idea questions.",
    tag: "Section 03",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-inter text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            Micro-Learning Modules
          </p>
          <h2 className="font-urbanist font-extrabold text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50">
            Real Pressure.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">Precise Practice.</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm text-zinc-500 font-inter leading-relaxed">
            Each session uses time limits proportionally scaled from the actual
            TOEFL ITP exam — so every minute matters. Prefer no pressure?{" "}
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              The timer is optional.
            </span>
          </p>
        </div>

        {/* Module cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {MODULES.map((m) => (
            <div
              key={m.id}
              id={m.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl group-hover:scale-105 transition-transform duration-300">
                  {m.icon}
                </div>
                <span className="text-[10px] font-inter text-zinc-400 dark:text-zinc-600 uppercase tracking-widest pt-1">
                  {m.tag}
                </span>
              </div>
              <div>
                <h3 className="font-urbanist font-bold text-base text-zinc-950 dark:text-zinc-50 mb-1 leading-tight">
                  {m.label}
                </h3>
                <p className="text-xs text-zinc-500 font-inter leading-relaxed">{m.desc}</p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-inter text-zinc-400 dark:text-zinc-600 font-medium">
                  {m.q} questions
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="text-xs font-inter text-zinc-400 dark:text-zinc-600 font-medium">
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Remedial — Killer Feature Card */}
        <div
          id="feat-ai-remedial"
          className="relative overflow-hidden bg-zinc-950 dark:bg-zinc-50 border border-zinc-800 dark:border-zinc-200 rounded-3xl p-8 md:p-10"
        >
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-[0.07]"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 dark:bg-zinc-200 border border-zinc-700 dark:border-zinc-300 rounded-full mb-4">
                <span className="text-white dark:text-zinc-950 text-xs">✦</span>
                <span className="text-xs text-zinc-300 dark:text-zinc-600 font-inter">
                  The Killer Feature
                </span>
              </div>
              <h3 className="font-urbanist font-extrabold text-2xl md:text-3xl text-zinc-50 dark:text-zinc-950 mb-3 leading-tight">
                AI Remedial:
                <br />
                Target Your Exact Weakness.
              </h3>
              <p className="text-sm font-inter text-zinc-400 dark:text-zinc-600 leading-relaxed max-w-lg">
                After every session, Toeflia&apos;s AI generates a{" "}
                <strong className="text-zinc-200 dark:text-zinc-800">
                  Personalized Mistake Summary
                </strong>{" "}
                — breaking down your errors by grammar category or reading
                skill. Then, with one click, the AI generates{" "}
                <strong className="text-zinc-200 dark:text-zinc-800">
                  10 brand-new questions targeting only those weak points.
                </strong>{" "}
                No filler. No repetition. Just precision.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-3">
              {[
                { step: "01", text: "Complete a practice session" },
                { step: "02", text: "Review your AI Mistake Analysis" },
                { step: "03", text: "Generate 10 targeted remedial questions" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="font-urbanist font-extrabold text-2xl text-zinc-700 dark:text-zinc-400 w-8 shrink-0">
                    {item.step}
                  </span>
                  <span className="text-sm font-inter text-zinc-300 dark:text-zinc-600">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── HOW IT WORKS ───────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: 'Click "Let\'s Start"',
    desc: "Find the button in the top-right corner of the navbar, or right in the middle of the hero.",
  },
  {
    n: "02",
    title: "Quick Onboarding",
    desc: "Enter your name and current status. That's all we need — no email, no password.",
  },
  {
    n: "03",
    title: "Enter the Dashboard",
    desc: "Pick a section — Listening, Structure, or Reading — and begin a timed micro-session.",
  },
  {
    n: "04",
    title: "AI Analysis & Retake",
    desc: "Get a full Personalized Mistake Report, then generate targeted remedial questions instantly.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-inter text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            User Journey
          </p>
          <h2 className="font-urbanist font-extrabold text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50">
            Four Steps.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">Zero Friction.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
            >
              <span className="block font-urbanist font-extrabold text-5xl text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-300 dark:group-hover:text-zinc-700 transition-colors mb-4 leading-none">
                {s.n}
              </span>
              <h3 className="font-urbanist font-bold text-lg text-zinc-950 dark:text-zinc-50 mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-zinc-500 font-inter leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ────────────────────────────────────── */
function Footer({ onStart }: { onStart: () => void }) {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/60 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* CTA strip */}
        <div className="text-center mb-12">
          <h2 className="font-urbanist font-extrabold text-3xl md:text-4xl text-zinc-950 dark:text-zinc-50 mb-3">
            Ready to raise your score?
          </h2>
          <p className="text-sm text-zinc-500 font-inter mb-6">
            Free forever. No sign-up required. AI-ready from day one.
          </p>
          <button
            id="footer-cta"
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-black font-urbanist font-bold text-sm px-7 py-3.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all duration-150"
          >
            Let&apos;s Start →
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-950 dark:bg-white rounded-md flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4h12M2 8h8M2 12h5"
                  stroke="currentColor"
                  className="text-white dark:text-zinc-950"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-urbanist font-bold text-sm text-zinc-950 dark:text-zinc-50">
              Toeflia
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-inter ml-2">
              © {new Date().getFullYear()} TOEFL Intelligent Academy
            </span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── PAGE ──────────────────────────────────────── */
function LandingContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleStart = useCallback(() => {
    /*
     * ONBOARDING GATE LOGIC:
     *  - If a user profile already exists in localStorage (from a previous session),
     *    skip the modal and navigate directly to the dashboard.
     *  - If no profile is found, open the Onboarding Modal to collect Name + Status.
     */
    try {
      const stored = localStorage.getItem("toeflia_user_profile");
      if (stored) {
        router.push("/dashboard");
        return;
      }
    } catch {
      /* localStorage unavailable — fall through to modal */
    }
    setModalOpen(true);
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar onStartLearning={handleStart} />
      <Hero onStart={handleStart} />
      <About />
      <Features />
      <HowItWorks />
      <Footer onStart={handleStart} />
      <OnboardingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <UserProvider>
      <LandingContent />
    </UserProvider>
  );
}
