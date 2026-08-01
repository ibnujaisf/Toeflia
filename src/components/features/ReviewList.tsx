"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MODULE_SECTIONS = [
  { id: "listening", title: "Listening Comprehension" },
  { id: "structure", title: "Structure and Written Expression" },
  { id: "reading", title: "Reading Comprehension" }
];

const formatRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  
  // Strip time for accurate day comparison
  const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = d1.getTime() - d2.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) {
    return `Today, ${timeStr}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${timeStr}`;
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }
};

export default function ReviewList({ initialSessions }: { initialSessions: any[] }) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/review/${sessionToDelete}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        // Update local state without full reload
        setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
        setIsDeleteModalOpen(false);
        setSessionToDelete(null);
        router.refresh(); // Refresh router to clear cache
      } else {
        console.error("Failed to delete session", data.error);
      }
    } catch (error) {
      console.error("Error deleting session", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-6 md:px-10 py-8 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-inter mb-2">
            Review
          </p>
          <h1 className="font-urbanist font-extrabold text-3xl text-zinc-900 dark:text-zinc-50">
            AI Review Analysis
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-inter max-w-xl leading-relaxed">
            Review your past performances, inspect identified error patterns, and interact with the AI to drill down on your specific mistakes.
          </p>
        </div>

        {/* Board / Columns (Kanban Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {MODULE_SECTIONS.map((section) => {
            const sectionSessions = sessions.filter(s => s.moduleId === section.id);

            return (
              <div key={section.id} className="flex flex-col gap-5">
                <h2 className="font-urbanist font-bold text-lg text-zinc-900 dark:text-zinc-50 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  {section.title}
                </h2>

                {sectionSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-6 min-h-[170px]">
                    
                    {/* Wadah Ikon Diperkecil */}
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-zinc-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                    </div>

                    {/* Font Judul Dikecilkan (text-sm) */}
                    <h2 className="font-urbanist font-bold text-sm text-zinc-900 dark:text-zinc-50 mb-1">
                      No Review Yet
                    </h2>
                    
                    {/* Font Deskripsi Dikecilkan (text-xs) */}
                    <p className="text-zinc-500 font-inter text-xs max-w-[180px] leading-relaxed">
                      Take a test to unlock your AI analysis.
                    </p>

                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {sectionSessions.map((session, index) => (
                      <Link
                        key={session.id}
                        href={`/dashboard/review/${session.id}`}
                        // Hapus h-full dan justify-between agar tinggi kartu menyesuaikan isi
                        className="relative flex flex-col text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-5 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-black/20 hover:scale-[1.01] transition-all duration-300 group overflow-hidden"
                      >
                        {/* BAGIAN ATAS: Margin bawah dikecilkan jadi mb-3 */}
                        <div className="flex justify-between items-start relative z-10">
                          
                          <div className="flex flex-col gap-1.5">
                            <span className="font-urbanist font-bold text-lg text-zinc-950 dark:text-zinc-50">
                              Test Attempt {sectionSessions.length - index}
                            </span>
                            <span className="text-xs font-inter text-zinc-500 dark:text-zinc-400">
                              {formatRelativeDate(session.createdAt)}
                            </span>
                          </div>
                          
                          <div className="font-urbanist font-extrabold text-2xl text-zinc-900 dark:text-zinc-50 leading-none mt-0.5">
                            {session.score}
                            <span className="text-zinc-400 dark:text-zinc-600 text-lg ml-1.5">
                              / {session.totalQuestions}
                            </span>
                          </div>

                        </div>

                        {/* BAGIAN BAWAH: Ditambah garis pemisah */}
                        <div className="flex items-center justify-between relative z-10 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                          
                          {/* Teks Interaktif Presisi di Tengah */}
                          <div className="flex items-center gap-1.5 text-[13px] font-urbanist font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors duration-300">
                            View Results
                          </div>

                          {/* Tombol Delete (Mengambang/Absolute di Kanan) */}
                          <button
                            onClick={(e) => handleDeleteClick(e, session.id)}
                            className="absolute right-0 p-1.5 -mr-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
                            title="Delete Session"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>

                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/40 dark:bg-zinc-950/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </div>
              <h2 className="font-urbanist font-extrabold text-xl text-zinc-900 dark:text-zinc-50">
                Delete Test History?
              </h2>
            </div>
            <p className="text-sm font-inter text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              This action is permanent and cannot be undone. All AI insights for this session will also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-urbanist font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-full bg-red-600 text-white font-urbanist font-bold text-sm hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
