"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

/* ── Status label map ───────────────────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  pelajar: "Student",
  pekerja: "Professional",
  freelancer: "Freelancer",
  lainnya: "Other",
};

/* ── Module cards data ─────────────────────────────────────────────────── */
/* ── Page component ──────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, isOnboarded } = useUser();
  const router = useRouter();
  const [greeting, setGreeting] = useState("Hello");
  const [mounted, setMounted] = useState(false);
  
  // Dynamic stats state
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    setMounted(true);
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting("Good morning");
    else if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17 && h < 20) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  // Fetch Dashboard Stats
  useEffect(() => {
    if (mounted) {
      // Jika user punya ID, lakukan fetch
      if (user?.id) {
        const fetchStats = async () => {
          try {
            const res = await fetch(`/api/dashboard?userId=${user.id}`);
            const data = await res.json();
            if (data.success) {
              setStats(data.data);
            }
          } catch (error) {
            console.error("Failed to load dashboard stats:", error);
          } finally {
            setIsLoadingStats(false);
          }
        };
        fetchStats();
      } else {
        // Jika tidak ada user ID (karena shadow user), langsung matikan loading 
        // agar menampilkan empty state, bukan skeleton selamanya.
        setIsLoadingStats(false);
      }
    }
  }, [mounted, user]);

  /* Redirect to home if not onboarded (client-side guard) */
  useEffect(() => {
    if (mounted && !isOnboarded) {
      router.replace("/");
    }
  }, [mounted, isOnboarded, router]);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-zinc-700"
          style={{
            borderTopColor: "#fafafa",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const MODULE_ICONS: Record<string, React.ReactNode> = {
    listening: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    structure: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    reading: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  };

  return (
    <>
      {/* ── Top bar (Mobile only) ────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-20 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/60 px-6 py-4 flex items-center justify-end">
        {/* Mobile logout — sidebar handles desktop */}
        <button
          id="topbar-logout-mobile"
          onClick={() => router.push("/")}
          className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          title="Back to home"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>

      <div className="px-6 md:px-10 py-8 max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter mb-2">
            Dashboard
          </p>
          <h1 className="font-urbanist font-extrabold text-3xl text-zinc-900 dark:text-zinc-50">
            {greeting},{" "}
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              {user.name}
            </span>{" "}
            👋
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-inter">
            Monitor learning progress and pick up where you left off.
          </p>
        </div>

        {/* Welcome banner */}
        <div className="animate-fade-in-up bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter mb-2">
                Learning Goal
              </p>
              <h2 className="font-urbanist font-extrabold text-2xl md:text-3xl text-zinc-900 dark:text-zinc-50 mb-2">
                {user.reason}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-inter leading-relaxed max-w-lg">
                Keep up the momentum! We hope your preparation for <strong className="font-semibold text-zinc-800 dark:text-zinc-200">{user.reason}</strong> goes smoothly. Toeflia's AI is here to analyze your every step.
              </p>
            </div>
            
            {/* Global Stats */}
            <div className="shrink-0 flex flex-col items-center mt-6 md:mt-0 md:pl-6">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter mb-2 text-center">
                Overall Accuracy
              </p>
              {isLoadingStats ? (
                <div className="w-24 h-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="font-urbanist font-extrabold text-6xl text-zinc-900 dark:text-zinc-50 leading-none tracking-tight">
                    {stats?.overall?.accuracy || "0%"}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-inter font-medium text-center">
                    {stats?.overall?.totalCorrect || 0} / {stats?.overall?.totalQuestions || 0} Correct
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Overview grid */}
        <div className="mb-6">
          <h2 className="font-urbanist font-bold text-lg text-zinc-700 dark:text-zinc-200 mb-4">
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
            {isLoadingStats ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-3xl" />
              ))
            ) : (
              stats?.modules.map((stat: any) => (
                <div
                  key={stat.id}
                  className="animate-fade-in-up bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      {MODULE_ICONS[stat.id]}
                    </div>
                    <h3 className="font-urbanist font-bold text-base text-zinc-900 dark:text-zinc-50 leading-snug">
                      {stat.section}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-baseline gap-2">
                      <span className="font-inter font-medium text-zinc-700 dark:text-zinc-300">
                        {stat.score}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-inter">
                        Correct
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-urbanist font-extrabold text-xl text-zinc-900 dark:text-zinc-50 leading-none">
                        {stat.accuracy}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity + AI preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent activity */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <h2 className="font-urbanist font-bold text-base text-zinc-700 dark:text-zinc-200 mb-5">
              Recent Activity
            </h2>
            <div className="flex flex-col gap-3">
              {isLoadingStats ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-zinc-50 dark:bg-zinc-800/50 animate-pulse rounded-xl" />
                ))
              ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30 px-2 -mx-2 rounded-xl transition-colors"
                    onClick={() => router.push(`/dashboard/review/${item.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 font-inter">
                        {item.module}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-600 font-inter">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-urbanist font-bold text-lg text-zinc-900 dark:text-zinc-50">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-zinc-400 font-inter">No recent activity found.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Review teaser */}
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(0,0,0,0.8) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-xs">✦</span>
                </div>
                <h2 className="font-urbanist font-bold text-base text-zinc-700 dark:text-zinc-200">
                  AI Deep Review
                </h2>
              </div>
              <p className="text-sm text-zinc-500 font-inter leading-relaxed mb-6">
                {stats?.recentActivity?.length > 0 
                  ? "Your AI tutor is ready to analyze your latest mistakes. Get a personalized study plan now."
                  : "Complete at least one practice session to unlock a deep AI analysis of your error patterns."}
              </p>
              <div className="space-y-2">
                {[
                  "Identify grammar error patterns",
                  "Reading strategies & recommendations",
                  "Personalized weekly roadmap",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
                      </svg>
                    </div>
                    <span className="text-xs text-zinc-500 font-inter">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/review"
                id="ai-review-cta"
                className="mt-6 w-full block text-center bg-zinc-900 dark:bg-white text-white dark:text-black font-urbanist font-bold text-sm py-3 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-100 active:scale-95 transition-all duration-150"
              >
                Start a Session to Unlock Review →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
