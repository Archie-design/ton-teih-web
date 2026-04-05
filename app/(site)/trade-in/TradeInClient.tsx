"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

interface FormStatus {
  type: "" | "success" | "error";
  msg: string;
}

export default function TradeInClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "", msg: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      type: "seller_request",
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus({
        type: "success",
        msg: "✅ 申請已成功送出！我們的業務將在 1-2 個工作天內與您聯繫。",
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        msg: "❌ 送出失敗，請稍後再試或直接致電 0973-357-788。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          填寫機台託售申請
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          請填寫以下資訊，我們將為您提供專業評估與最佳方案。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot：機器人陷阱，真實使用者不會填寫此欄位 */}
          <input type="text" name="website" tabIndex={-1} aria-hidden="true" className="hidden" />
          {/* 聯絡人資訊 */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
              聯絡人資訊
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  姓名 *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  聯繫電話 *
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  電子郵件
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 機台資訊 */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
              機台資訊
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  機台品牌
                </label>
                <input
                  name="machineBrand"
                  type="text"
                  placeholder="如：Ton Teih、大湖"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  機台型號
                </label>
                <input
                  name="machineModel"
                  type="text"
                  placeholder="如：TGD-250"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  出廠年份
                </label>
                <input
                  name="machineYear"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear()}
                  placeholder={String(new Date().getFullYear() - 5)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  使用時數（約）
                </label>
                <input
                  name="machineHours"
                  type="number"
                  placeholder="如：5000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  參考售價（TWD）
                </label>
                <input
                  name="machinePrice"
                  type="number"
                  placeholder="可留空由業務評估"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  設備所在地
                </label>
                <input
                  name="machineLocation"
                  type="text"
                  placeholder="如：台中、桃園"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  機況說明
                </label>
                <textarea
                  name="machineCondition"
                  rows={4}
                  placeholder="請描述設備現況，如：機況良好，偶爾需保養；控制器已更新；有修繕紀錄等..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black disabled:bg-slate-300 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={16} />
            {isSubmitting ? "送出中..." : "送出申請"}
          </button>

          {status.msg && (
            <div
              className={`p-4 rounded-xl font-bold text-center text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
