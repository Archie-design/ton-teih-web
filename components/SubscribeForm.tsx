"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", msg: data.message });
        setEmail("");
      } else {
        setStatus({ type: "error", msg: data.error || "訂閱失敗" });
      }
    } catch {
      setStatus({ type: "error", msg: "網路錯誤，請稍後再試" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-12">
      <div className="flex items-center gap-3 mb-2">
        <Bell size={18} className="text-red-600 shrink-0" />
        <h3 className="font-black text-slate-900 text-base">訂閱新機到貨通知</h3>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-6 pl-7">
        輸入 Email，有新機台上架時我們將立即通知您。
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-slate-900 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:bg-slate-400 cursor-pointer whitespace-nowrap"
        >
          {isSubmitting ? "處理中..." : "訂閱通知"}
        </button>
      </form>
      {status && (
        <p
          className={`mt-4 text-sm font-bold px-4 py-3 rounded-xl ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {status.msg}
        </p>
      )}
    </div>
  );
}
