"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/features/Navbar";
import OnboardingModal from "@/components/features/OnboardingModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { UserProvider } from "@/context/UserContext";
import Logo from "@/components/ui/Logo";

import ShinyText from "../components/reactbits/ShinyText";
import StarBorder from "../components/reactbits/StarBorder";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import CountUp from "../components/reactbits/CountUp";
import BlurText from "../components/reactbits/BlurText";

/* ─────────────────────────── HERO ──────────────────────────────────────── */
function Hero({ onStart, isLoggedIn }: { onStart: () => void; isLoggedIn: boolean }) {
  // Ganti resolvedTheme menjadi theme (sesuaikan jika nama variabel di context-mu berbeda)
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-28 pb-20 text-center overflow-hidden"
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
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
        <div className="animate-fade-in-up relative inline-flex items-center justify-center mt-6 mb-2">
          {/* Ornamen Bintang Kiri Atas */}
          <svg className="absolute -top-2.5 -left-3.5 w-4 h-4 text-zinc-950 dark:text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
          </svg>

          {/* Ornamen Bintang Kanan Bawah */}
          <svg className="absolute -bottom-1.5 -right-2.5 w-3 h-3 text-zinc-400 dark:text-zinc-500 animate-pulse" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" />
          </svg>

          {/* Kapsul Utama (Tanpa Dot) */}
          <div className="inline-flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-full relative z-10">
            <span className="text-xs font-inter text-zinc-600 dark:text-zinc-300 tracking-wide font-medium">
              Next-Gen TOEFL Simulator
            </span>
          </div>
        </div>

        {/* H1 — with ShinyText for subtitle */}
        <h1 className="animate-fade-in-up delay-100 font-urbanist font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.87] tracking-tight text-zinc-950 dark:text-zinc-50">
          Train Smarter.
          <br />
          {mounted ? (
            <ShinyText
              key={theme} // Gunakan theme dari context-mu
              text="Score Higher."
              speed={3}
              color="#71717a"
              // Cek menggunakan theme dari context-mu
              shineColor={theme === "light" ? "#09090b" : "#fafafa"}
              className="font-urbanist font-extrabold inline-block pt-3 pb-4"
            />
          ) : (
            <span className="font-urbanist font-extrabold inline-block pt-3 pb-4 text-[#71717a]">
              Score Higher.
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 max-w-lg text-zinc-500 dark:text-zinc-400 text-base md:text-lg font-inter leading-relaxed">
          The AI-powered TOEFL simulator that doesn't just grade your answers — it understands why you got them wrong, then helps you never miss again.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">

          {/* Primary Button: Native Tailwind dengan efek Scale */}
          <button
            onClick={onStart}
            className="group flex items-center gap-2.5 bg-zinc-950 dark:bg-white text-white dark:text-black font-urbanist font-bold text-sm px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {/* Teks Dinamis Berdasarkan Status User */}
            {isLoggedIn ? "Continue Practice" : "Start Practice"}
          </button>

          {/* Secondary Button: Ghost Style dengan Smooth Scroll */}
          <button
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            // Background default sudah di-set, ditambah efek membesar ala tombol primary
            className="group flex items-center gap-2 text-sm font-inter font-medium text-zinc-950 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
          >
            Learn more
          </button>

        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400 flex flex-wrap justify-center gap-10 mt-10 pt-10 border-t border-zinc-200 dark:border-zinc-800/60 w-full">
          {[
            { v: "3", u: "Sections", l: "Listening · Structure · Reading" },
            // Ubah bagian 100% menjadi format ini:
            { v: 100, suffix: "%", isCountUp: true, u: "AI-Driven", l: "Questions, review & remediation" },
            { v: "Free", u: "Forever", l: "No credit card required" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center gap-0.5">
              <span className="font-urbanist font-extrabold text-3xl text-zinc-950 dark:text-zinc-50 flex items-baseline">

                {/* Pengecekan: Jika isCountUp true, gunakan animasi */}
                {s.isCountUp ? (
                  <>
                    <CountUp
                      from={0}
                      to={s.v as number}
                      direction="up"
                      duration={1.5} // Kecepatan animasi (1.5 detik)
                      className="font-urbanist font-extrabold text-3xl"
                    />
                    {s.suffix}
                  </>
                ) : (
                  s.v
                )}

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
            <BlurText text="The Solution." delay={50} animateBy="letters" direction="top" className="text-zinc-400 dark:text-zinc-500 inline-block" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Problem card */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col gap-5">
            {/* Header Card: Icon dan Judul Sejajar */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-lg shrink-0">
                ⚠
              </div>
              <h3 className="font-urbanist font-bold text-xl text-zinc-950 dark:text-zinc-50">
                Traditional prep is broken.
              </h3>
            </div>

            {/* Isi Konten */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-inter text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Final-year students scrambling to meet{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">graduation requirements</strong> and
                job-seekers chasing{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">professional certifications</strong> face
                the same wall: TOEFL prep courses are expensive, rigid in
                schedule, and completely disconnected from how they actually
                learn.
              </p>
              <p className="text-sm font-inter text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2">
                You study for hours, yet still can&apos;t pinpoint{" "}
                <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">
                  what&apos;s holding your score back
                </strong>
                . Generic practice tests treat every mistake the same —{" "}
                <strong className="text-zinc-950 dark:text-zinc-50 font-bold">
                  they don&apos;t adapt. You do.
                </strong>
              </p>
            </div>
          </div>

          {/* Solution card */}
          <div className="bg-zinc-950 dark:bg-zinc-50 border border-zinc-800 dark:border-zinc-200 rounded-3xl p-8 flex flex-col gap-5">
            {/* Header Card: Icon dan Judul Sejajar */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center text-lg shrink-0 text-zinc-50 dark:text-zinc-950">
                ✦
              </div>
              <h3 className="font-urbanist font-bold text-xl text-zinc-50 dark:text-zinc-950">
                This is Toeflia.
              </h3>
            </div>

            {/* Isi Konten */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-inter text-zinc-400 dark:text-zinc-600 leading-relaxed">
                Toeflia is a{" "}
                <strong className="text-zinc-50 dark:text-zinc-950 font-semibold">
                  free, AI-powered TOEFL simulator
                </strong>{" "}
                built on micro-learning principles. Every practice session is short,
                focused, and timed proportionally to the real TOEFL ITP —{" "}
                <strong className="text-zinc-50 dark:text-zinc-950 font-bold">
                  so the pressure is real.
                </strong>
              </p>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  "AI generates and curates every question — no recycled banks",
                  "Instant, in-depth explanation for every answer — right or wrong",
                  "Personalized Mistake Insights surfaced after every session",
                  "AI Remedial: 10 laser-targeted questions on your exact weak spots",
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    label: "Listening Comprehension",
    q: 10,
    time: "7 min",
    desc: "Short conversations, academic lectures, and note-taking comprehension.",
    tag: "Section 01",
  },
  {
    id: "feat-structure",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    label: "Structure & Written Expression",
    q: 10,
    time: "6 min 15 sec",
    desc: "Sentence completion and error identification across grammar patterns.",
    tag: "Section 02",
  },
  {
    id: "feat-reading",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
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
            <BlurText text="Precise Practice." delay={50} animateBy="letters" direction="top" className="text-zinc-400 dark:text-zinc-500 inline-block" />
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm text-zinc-500 font-inter leading-relaxed">
            Each session uses time limits proportionally scaled from the actual
            TOEFL ITP exam — so every minute matters. Prefer no pressure?{" "}
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              The timer is optional.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {MODULES.map((m) => (
            <div
              key={m.id}
              // SpotlightCard dihapus, diganti div biasa dengan flex-col
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 group relative"
            >
              
              {/* Top Row: Icon dan Label Sejajar */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 group-hover:scale-110 transition-all duration-300">
                  {m.icon}
                </div>
                <h3 className="font-urbanist font-bold text-base text-zinc-950 dark:text-zinc-50 leading-tight">
                  {m.label}
                </h3>
              </div>

              {/* Middle Row: Deskripsi */}
              <p className="text-xs text-zinc-400 font-inter leading-relaxed mb-5">
                {m.desc}
              </p>

              {/* Bottom Row: Tag (Section) sejajar dengan Q dan Time */}
              {/* mt-auto memastikan baris ini selalu terdorong ke paling bawah card */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                <span className="text-[10px] font-inter text-zinc-400 dark:text-zinc-600 uppercase tracking-widest font-semibold">
                  {m.tag}
                </span>
                
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-inter text-zinc-400 dark:text-zinc-600 font-medium">
                    {m.q} questions
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="text-xs font-inter text-zinc-400 dark:text-zinc-600 font-medium">
                    {m.time}
                  </span>
                </div>
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
              <h3 className="font-urbanist font-extrabold text-2xl md:text-3xl text-zinc-50 dark:text-zinc-950 mb-3 leading-tight">
                AI Remedial:
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
                { step: "02", text: "Review your AI Mistake Insights" },
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
    title: 'Click "Get Started"',
    desc: "Find the button in the top-right corner of the navbar, or right in the middle of the hero.",
  },
  {
    n: "02",
    title: "Quick Onboarding",
    desc: "Enter your name and current status. That's all we need — no email, no password.",
  },
  {
    n: "03",
    title: "Enter the Practice",
    desc: "Pick a section — Listening, Structure, or Reading — and begin a timed micro-session.",
  },
  {
    n: "04",
    title: "AI Insights & Retake",
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
            <BlurText text="Zero Friction." delay={50} animateBy="letters" direction="top" className="text-zinc-400 dark:text-zinc-500 inline-block" />
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
            >
              {/* Pembungkus Flex untuk Angka dan Judul */}
              <div className="flex items-center gap-4 mb-3">
                <span className="font-urbanist font-extrabold text-4xl text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors leading-none shrink-0">
                  {s.n}
                </span>
                <h3 className="font-urbanist font-bold text-xl text-zinc-950 dark:text-zinc-50 leading-tight">
                  {s.title}
                </h3>
              </div>
              
              <p className="text-sm text-zinc-500 font-inter leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ────────────────────────────────────── */
function Footer({ onStart, isLoggedIn }: { onStart: () => void; isLoggedIn: boolean }) {
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
            onClick={onStart}
            className="group inline-flex items-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm px-7 py-3.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-105 transition-all duration-300"
          >
            {/* Logika kondisional untuk teks tombol */}
            {isLoggedIn ? "Continue Practice" : "Let's Start"} 
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 shrink-0" />
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("toeflia_user_profile");
      if (stored) {
        setIsLoggedIn(true);
      }
    } catch {
      // Abaikan jika error membaca localStorage
    }
  }, []);

  const handleStart = useCallback(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
      return;
    }
    setModalOpen(true);
  }, [router, isLoggedIn]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar onStartLearning={handleStart} />
      <Hero onStart={handleStart} isLoggedIn={isLoggedIn} />
      <About />
      <Features />
      <HowItWorks />
      <Footer onStart={handleStart} isLoggedIn={isLoggedIn} />
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
