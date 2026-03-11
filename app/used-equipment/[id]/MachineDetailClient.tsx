"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TradingItem } from "@/lib/types";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { ShieldCheck, MapPin, CheckCircle } from "lucide-react";

interface Props {
  machine: TradingItem;
}

export default function MachineDetailClient({ machine }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const { isSubmitting, submitStatus, handleSubmit } = useContactForm({
    onSuccess: closeModal,
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 左側：圖片 */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
            <Image
              src={machine.thumbnail}
              alt={machine.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none -rotate-12">
              <span className="text-4xl font-black tracking-tighter text-black uppercase">
                Ton Teih Certified
              </span>
            </div>
            {machine.isOfficial && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-sm shadow-lg flex items-center gap-1">
                  <ShieldCheck size={12} /> 官方認證
                </span>
              </div>
            )}
          </div>

          {/* 右側：詳情 */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-3">
              {machine.category}
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {machine.name}
            </h1>
            <p className="text-sm font-bold text-slate-500 flex items-center gap-1 mb-8">
              <MapPin size={14} className="text-red-600" />
              {machine.location}（代理洽談）
            </p>

            {/* 核心資訊 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">技術評分</p>
                <p className="text-2xl font-black text-red-600">
                  {machine.inspectionScore}
                  <span className="text-xs text-slate-400">/100</span>
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">出廠年份</p>
                <p className="text-2xl font-black text-slate-900">{machine.year}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">使用時數</p>
                <p className="text-2xl font-black text-slate-900">
                  {machine.hoursUsed ? machine.hoursUsed.toLocaleString() : "—"}
                  <span className="text-xs text-slate-400"> hrs</span>
                </p>
              </div>
            </div>

            {/* 規格表 */}
            {(machine.controller || machine.pumpSystem || Object.keys(machine.specs).length > 0) && (
              <div className="mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
                  技術規格
                </h2>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-50">
                    {machine.controller && (
                      <tr>
                        <td className="py-2.5 font-bold text-slate-500 w-1/3">控制器</td>
                        <td className="py-2.5 font-black text-slate-900">{machine.controller}</td>
                      </tr>
                    )}
                    {machine.pumpSystem && (
                      <tr>
                        <td className="py-2.5 font-bold text-slate-500">油壓系統</td>
                        <td className="py-2.5 font-black text-slate-900">{machine.pumpSystem}</td>
                      </tr>
                    )}
                    {machine.brand && (
                      <tr>
                        <td className="py-2.5 font-bold text-slate-500">品牌</td>
                        <td className="py-2.5 font-black text-slate-900">{machine.brand}</td>
                      </tr>
                    )}
                    {machine.model && (
                      <tr>
                        <td className="py-2.5 font-bold text-slate-500">機型</td>
                        <td className="py-2.5 font-black text-slate-900">{machine.model}</td>
                      </tr>
                    )}
                    {Object.entries(machine.specs).map(([key, value]) => (
                      <tr key={key}>
                        <td className="py-2.5 font-bold text-slate-500">{key}</td>
                        <td className="py-2.5 font-black text-slate-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-6">
              <CheckCircle size={14} className="text-green-500 shrink-0" />
              通過油壓、電路、PLC 等核心項目技術檢測
            </div>

            {/* 價格 + CTA */}
            <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">參考售價</p>
                <p className="text-3xl font-black text-white">
                  {machine.price > 0
                    ? `NT$ ${machine.price.toLocaleString()}`
                    : "洽詢業務"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
              >
                詢問此設備
              </button>
            </div>
          </div>
        </div>

        {/* 返回列表 */}
        <div className="mt-12">
          <a
            href="/used-equipment"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors"
          >
            ← 返回認證設備列表
          </a>
        </div>
      </div>

      {/* 詢價 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl text-slate-900">機台詢價</h3>
                <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-widest">
                  Equipment Inquiry
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-red-600 transition-colors p-2 bg-white rounded-full shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <input type="hidden" name="equipmentId" value={machine.id} />
              <input
                type="hidden"
                name="product"
                value={`中古設備詢問 - ${machine.category}`}
              />

              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-center">
                <div className="w-16 h-16 relative bg-slate-200 rounded-lg overflow-hidden shrink-0">
                  <Image src={machine.thumbnail} alt="thumb" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">您正在詢問：</p>
                  <p className="font-black text-slate-900 leading-tight">{machine.name}</p>
                  <p className="text-xs text-red-600 font-black tracking-widest mt-1">
                    ID: {machine.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">
                      您的姓名
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">
                      聯繫電話
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">
                    電子郵件
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">
                    備註或詢問事項
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="例如：我想了解此機台的看機時間..."
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 disabled:bg-slate-400 transition-all shadow-xl shadow-red-200 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? "正在發送..." : "提交詢價"}
                </button>
                {submitStatus.msg && (
                  <p
                    className={`text-center font-bold mt-4 p-4 rounded-xl ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {submitStatus.msg}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
