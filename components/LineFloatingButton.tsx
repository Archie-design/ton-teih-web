"use client";

import { MessageCircle } from "lucide-react";
import { LINE_ID } from "@/lib/constants";

export default function LineFloatingButton() {
  return (
    <a
      href={`https://line.me/ti/p/~${LINE_ID}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LINE 聯絡我們"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2"
    >
      {/* Tooltip */}
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
        LINE 聯絡我們
      </span>

      {/* Button */}
      <div className="w-14 h-14 bg-[#06C755] hover:bg-[#05b34c] rounded-full shadow-xl shadow-green-500/30 flex items-center justify-center transition-all duration-200 active:scale-95">
        <MessageCircle size={26} className="text-white" fill="white" strokeWidth={0} />
      </div>
    </a>
  );
}
