"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import PreTestModal from "@/components/features/PreTestModal";

const formatRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  
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
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default function ReviewDetailPage({ params }: { params: Promise<{ reviewId: string }> }) {
  const router = useRouter();
  const { reviewId } = use(params);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // TTS State for Review
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Retake Modal State
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  // Session State
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Session Data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/review/${reviewId}`);
        const data = await response.json();
        if (data.success) {
          setSessionData(data.session);
          setChatMessages([{ role: 'ai', text: `Hello! You scored ${data.session.score} out of ${data.session.totalQuestions}. Let's review your mistakes together. What would you like to discuss first?` }]);
        }
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [reviewId]);

  // TTS Cleanup
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleReplayAudio = (questionId: string, transcript: string, questionText: string) => {
    window.speechSynthesis.cancel(); 

    if (playingId === questionId) {
      setPlayingId(null);
      return; // Toggle stop
    }

    setPlayingId(questionId);
    const textToRead = `${transcript || ''}... Question... ${questionText || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch(`/api/review/${reviewId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      
      if (data.success) {
        setChatMessages(prev => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "ai", text: "Oops, I ran into an error. Let's try again." }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: "ai", text: "Sorry, network error." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[150] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center animate-fade-in">
        <span className="w-8 h-8 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-50 animate-spin mb-4"></span>
        <p className="font-urbanist font-bold text-zinc-900 dark:text-zinc-50">Loading your AI review...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="fixed inset-0 z-[150] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center animate-fade-in">
        <p className="font-urbanist font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-2">Session Not Found</p>
        <button onClick={() => router.push("/dashboard/review")} className="text-sm font-inter text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 underline">Back to Review List</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row h-[100dvh] overflow-hidden">
      
      {/* 1. LEFT PANEL: Compact Question List (65%) */}
      <div className="w-full md:w-[65%] flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        
        {/* Header */}
        <header className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 h-16 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/review")}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900 transition-colors shrink-0"
              title="Back to Review List"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
           <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-urbanist font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-tight">
                  {sessionData.moduleTitle}
                </span>
                
                {/* Badge Attempt Baru */}
                {sessionData.globalAttempt && (
                  <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    Attempt {sessionData.globalAttempt}
                  </span>
                )}
              </div>
              
              <span className="text-[10px] uppercase tracking-widest font-inter text-zinc-500 mt-0.5">
                {formatRelativeDate(sessionData.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-inter text-zinc-500 uppercase tracking-widest">Score</span>
            <span className="font-urbanist font-extrabold text-lg text-zinc-900 dark:text-zinc-50 leading-none">
              {sessionData.score} / {sessionData.totalQuestions}
            </span>
          </div>
        </header>

        {/* Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-950/30">
          <div className="max-w-2xl mx-auto flex flex-col gap-4 pb-12">
            {sessionData.questions.map((q: any, idx: number) => {
              const isUnanswered = q.userAnswer === -1;
              const isCorrect = q.userAnswer === q.correctAnswer;
              const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
              
              return (
                <div key={q.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-5 shadow-sm">
                  
                  {/* Compact Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-urbanist font-bold text-sm text-zinc-900 dark:text-zinc-50">
                      Q{idx + 1}
                    </span>
                    
                    {/* Replay Button (Hanya untuk tipe Listening) */}
                    {q.type?.includes('listening') && (
                      <button
                        onClick={() => handleReplayAudio(q.id, q.transcript || '', q.questionText || '')}
                        className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-urbanist font-bold uppercase tracking-widest ${
                          playingId === q.id 
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {playingId === q.id ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg> Stop</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg> Replay</>
                        )}
                      </button>
                    )}

                    {isCorrect ? (
                      <div className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 text-[10px] font-urbanist font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Correct
                      </div>
                    ) : isUnanswered ? (
                      <div className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-[10px] font-urbanist font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unanswered
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-[10px] font-urbanist font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Incorrect
                      </div>
                    )}
                  </div>

                  {/* Dynamic Context: Passage / Transcript */}
                  {q.type === 'reading' && q.passage && (
                    <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <h4 className="text-[10px] font-urbanist font-bold uppercase tracking-widest text-zinc-500 mb-2">Reading Passage</h4>
                      <p className="text-sm font-inter text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{q.passage}</p>
                    </div>
                  )}
                  {q.type?.includes('listening') && q.transcript && (
                    <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <h4 className="text-[10px] font-urbanist font-bold uppercase tracking-widest text-zinc-500 mb-2">Audio Transcript</h4>
                      <p className="text-sm font-inter text-zinc-700 dark:text-zinc-300 leading-relaxed italic whitespace-pre-wrap">{q.transcript}</p>
                    </div>
                  )}

                  {/* Question Text */}
                  <h3 className="font-urbanist font-bold text-base text-zinc-900 dark:text-zinc-50 mb-3 leading-snug">
                    {q.questionText}
                  </h3>

                  {/* Compact Options */}
                  <div className="flex flex-col gap-2">
                    {parsedOptions.map((opt: string, i: number) => {
                      const isUserChoice = q.userAnswer === i;
                      const isCorrectChoice = q.correctAnswer === i;
                      
                      let optionStyle = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 opacity-70";
                      let icon = null;

                      if (isCorrectChoice) {
                        optionStyle = "bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/40 text-green-800 dark:text-green-300 font-medium";
                        icon = (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="text-green-600 dark:text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        );
                      } else if (isUserChoice && !isCorrect) {
                        optionStyle = "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/40 text-red-800 dark:text-red-300 line-through opacity-90";
                        icon = (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="text-red-600 dark:text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        );
                      }

                      const label = `${String.fromCharCode(65 + i)}. `;

                      return (
                        <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all font-inter text-sm ${optionStyle}`}>
                          <span>{label}{opt}</span>
                          {icon && <span className="shrink-0 ml-3">{icon}</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation for Incorrect Answers */}
                 {/* AI Explanation for Incorrect Answers */}
                  {!isCorrect && q.aiExplanation && (
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3 md:p-4 mt-3 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-zinc-900 dark:text-zinc-50">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1 0 10 10H12V2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L2.1 14.8A10 10 0 0 1 12 2v10z" />
                        </svg>
                        <h4 className="font-urbanist font-bold text-zinc-900 dark:text-zinc-50 text-[11px] tracking-widest uppercase">AI Insight</h4>
                      </div>
                      
                      {/* SOLUSI: Render Markdown di AI Insight */}
                      <div className="text-xs font-inter text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-zinc-900 dark:text-zinc-100" {...props} />
                          }}
                        >
                          {q.aiExplanation}
                        </ReactMarkdown>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* 2. RIGHT PANEL: AI Tutor & Summary (35%) */}
      <div className="w-full md:w-[35%] bg-white dark:bg-zinc-950 flex flex-col h-[50vh] md:h-full z-10 shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        
        {/* Panel Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
          <h3 className="font-urbanist font-extrabold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            AI Session Summary
          </h3>
        </div>

        {/* Scrollable Chat & Summary Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          {/* Summary Section */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50">
            {/* 1. Gunakan ReactMarkdown untuk aiSummary (className dipindah ke div pembungkus) */}
            <div className="text-sm font-inter text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 flex flex-col gap-2">
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-zinc-800 dark:text-zinc-200" {...props} />,
                }}
              >
                {sessionData.aiSummary || "No summary generated for this session."}
              </ReactMarkdown>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[11px] font-urbanist font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Tips to Improve</h4>
              <ul className="space-y-3">
                {sessionData.tips && sessionData.tips.length > 0 ? (
                  sessionData.tips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-inter text-zinc-700 dark:text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0 mt-[7px]"></span>
                      
                      {/* 2. Gunakan ReactMarkdown juga untuk tiap Tip */}
                      <ReactMarkdown 
                        components={{
                          // Pakai span untuk p agar list-nya tidak turun ke baris baru
                          p: ({node, ...props}) => <span {...props} />, 
                          strong: ({node, ...props}) => <strong className="font-bold text-zinc-900 dark:text-zinc-100" {...props} />,
                        }}
                      >
                        {tip}
                      </ReactMarkdown>

                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2.5 text-sm font-inter text-zinc-700 dark:text-zinc-300">
                    <span className="text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5">•</span>
                    <span>Review your incorrect answers for more insights.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-5 flex-1 flex flex-col justify-end space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm font-inter leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-br-sm' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm border border-zinc-200 dark:border-zinc-700/50'
                }`}>
                  
                  {msg.role === 'user' ? (
                    msg.text
                  ) : (
                    // SOLUSI: Bungkus ReactMarkdown dengan <div> untuk menaruh className
                    <div className="flex flex-col gap-2">
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                          h3: ({node, ...props}) => <h3 className="font-bold text-base mt-2 mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-extrabold" {...props} />,
                          code: ({node, ...props}) => <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs" {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="rounded-2xl p-4 shadow-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm border border-zinc-200 dark:border-zinc-700/50">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Chat Input Field */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading}
              placeholder={isChatLoading ? "AI is thinking..." : "Ask anything..."} 
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-inter text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="w-10 shrink-0 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>

        {/* Bottom Sticky Action: Targeted Retake */}
        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <button 
            onClick={() => setIsRetakeModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="group-hover:-rotate-90 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
            </svg>
            Targeted Retake
          </button>
        </div>
      </div>

      {/* 3. Retake Modal (Reusable PreTestModal) */}
      <PreTestModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onStart={(timerEnabled) => {
          const summaryParam = encodeURIComponent(sessionData.aiSummary || "");
          router.push(`/dashboard/practice/${sessionData.moduleId}?timer=${timerEnabled}&retake=true&summary=${summaryParam}`);
        }}
        title={`Retake: ${sessionData.moduleTitle}`}
        duration={
          sessionData.moduleId === "listening" ? "7 Minutes" :
          sessionData.moduleId === "structure" ? "6m 15s" :
          sessionData.moduleId === "reading" ? "11 Minutes" :
          "10 Minutes" // Fallback jika ID tidak dikenali
        }
        isRetake={true}
        questions={10}
      />

    </div>
  );
}
