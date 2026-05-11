"use client";

import { useState } from "react";

type PreTestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: (isTimerEnabled: boolean) => void;
  title: string;
  duration: string;
  isRetake?: boolean;
  questions?: number;
  icon?: React.ReactNode;
};

export default function PreTestModal({
  isOpen,
  onClose,
  onStart,
  title,
  duration,
  isRetake = false,
  questions = 10,
  icon,
}: PreTestModalProps) {
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-zinc-950/40 dark:bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-scale-in">
        
        {/* Modal Header */}
        <div className="mb-6 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {icon && (
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
              {icon}
            </div>
          )}
          <div>
            <h2 id="modal-title" className="font-urbanist font-extrabold text-2xl text-zinc-900 dark:text-zinc-50 leading-snug mb-2">
              {title}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm text-zinc-500 font-inter">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {isRetake ? "10 Retake Questions" : `${questions} Questions`}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span>Standard Time: <span className="font-medium text-zinc-700 dark:text-zinc-300">{duration}</span></span>
            </div>
          </div>
        </div>

        {/* Toggle Timer Setting (iOS Style Minimalist) */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-8 flex items-start gap-4 text-left">
          <div className="flex-1">
            <p className="font-urbanist font-bold text-zinc-900 dark:text-zinc-50 text-base mb-1">
              Enable Timer
            </p>
            <p className="text-xs text-zinc-500 font-inter leading-relaxed">
              Turn off for a relaxed, untimed practice session.
            </p>
          </div>
          
          {/* Toggle Switch Button */}
          <button 
            type="button"
            onClick={() => setIsTimerEnabled(!isTimerEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 ${
              isTimerEnabled 
                ? "bg-zinc-900 dark:bg-white" 
                : "bg-zinc-200 dark:bg-zinc-700"
            }`}
            role="switch"
            aria-checked={isTimerEnabled}
          >
            <span className="sr-only">Toggle Timer Setting</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out ${
                isTimerEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-4 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-urbanist font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={() => onStart(isTimerEnabled)}
            className="flex-1 py-3.5 px-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-urbanist font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-lg active:scale-[0.98]"
          >
            {isRetake ? "Start Retake" : "Begin Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
