"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import ReactMarkdown from "react-markdown";

export default function InsightsPage() {
  const { user, isOnboarded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isOnboarded) {
      router.replace("/");
    }
  }, [mounted, isOnboarded, router]);

  useEffect(() => {
    if (mounted && user?.id) {
      const fetchInsights = async () => {
        try {
          const res = await fetch(`/api/insights?userId=${user.id}`);
          const data = await res.json();
          if (data.success) {
            setSessions(data.sessions);
          }
        } catch (error) {
          console.error("Failed to fetch insights:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInsights();
    } else if (mounted && !user?.id) {
      setIsLoading(false);
    }
  }, [mounted, user]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    const timeStr = date.toLocaleTimeString("en-US", timeOptions);

    if (diffDays === 0) return `Today, ${timeStr}`;
    if (diffDays === 1) return `Yesterday, ${timeStr}`;
   
    
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  if (!mounted || !user) return null;

  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter mb-2">
          Insights
        </p>
        <h1 className="font-urbanist font-extrabold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 mb-3">
          AI Insights & Patterns
        </h1>
        <p className="text-sm text-zinc-500 font-inter max-w-2xl leading-relaxed">
          Explore the collection of all your personalized AI evaluations. 
          Identify recurring grammar patterns and strategic weaknesses across your practice sessions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-[32px]" />
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="flex flex-col gap-8">
          {sessions.map((session, index) => (
            <div 
              key={session.id} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 md:p-8 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-urbanist font-bold text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">
                      {session.moduleTitle}
                    </h2>
                    {/* Badge Test Attempt (Monochrome) */}
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded font-urbanist font-bold uppercase tracking-wider text-[10px]">
                      Attempt {session.attemptNumber || "?"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Score Badge */}
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Score: {session.score}/{session.totalQuestions}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-inter">
                      {formatDate(session.createdAt)}
                    </p>
                  </div>
                </div>

                <Link 
                  href={`/dashboard/review/${session.id}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-xs font-urbanist font-bold text-zinc-600 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  Review Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* AI Summary Section */}
              {session.aiSummary && (
                <div className="mb-6">
                  <h3 className="text-[10px] font-urbanist font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"></span>
                    Evaluation Summary
                  </h3>
                  {/* Styling border kiri diubah ke zinc */}
                  <div className="text-sm font-inter text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/30 p-4 md:p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 pl-4 border-l-2 border-l-zinc-300 dark:border-l-zinc-600">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
                        em: ({ node, ...props }) => <em className="italic text-zinc-800 dark:text-zinc-200" {...props} />,
                      }}
                    >
                      {session.aiSummary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Actionable Tips Section */}
              {session.tips && session.tips.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-urbanist font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"></span>
                    Actionable Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {session.tips.map((tip: string, index: number) => (
                      <div 
                        key={index}
                        className="bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800/50 p-3.5 rounded-2xl flex items-start gap-3 group hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                      >
                        {/* Icon centang disamakan dengan dashboard (monokrom) */}
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 transition-colors group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="text-zinc-600 dark:text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <div className="text-[13px] text-zinc-600 dark:text-zinc-400 font-inter leading-relaxed flex-1">
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => <span {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
                              em: ({ node, ...props }) => <em className="italic text-zinc-800 dark:text-zinc-200" {...props} />,
                            }}
                          >
                            {tip}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-24 flex flex-col items-center text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] animate-fade-in-up">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-zinc-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5M12 10V9m-8 9h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
            </svg>
          </div>
          <h2 className="font-urbanist font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-2">
            No Insights Yet
          </h2>
          <p className="text-zinc-500 font-inter text-sm max-w-sm mb-8">
            Complete your first practice test to let our AI analyze your performance and provide personalized tips.
          </p>
          <Link 
            href="/dashboard/practice" 
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-urbanist font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            Take a Practice Test
          </Link>
        </div>
      )}
    </div>
  );
}