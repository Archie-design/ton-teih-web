"use client";

import React, { useState } from "react";
import {
  Settings,
  Zap,
  CheckCircle,
  Factory,
  MapPin,
  Phone,
  Mail,
  Cpu,
  Layers,
  Ruler,
  Trash2,
  ArrowUpCircle,
  ChevronDown,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { productData } from "@/lib/constants";
import { useContactForm } from "@/lib/hooks/useContactForm";

export default function App() {
  const { isSubmitting, submitStatus, handleSubmit } = useContactForm();

  return (
    <div className="text-slate-900">

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/hero-bg.jpg"
            fill
            sizes="100vw"
            className="object-cover"
            alt="Background"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-balance">
            全方位橡矽膠成型解決方案
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            追求卓越品質，提供高效、穩定的生產設備與技術支援
          </p>
          <a
            href="#contact"
            className="inline-block bg-red-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/50"
          >
            立即聯繫諮詢
          </a>
        </div>
      </header>

      {/* 產品主體 */}
      <main className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        {/* 1. 射出系列 */}
        <section id="injection">
          <div className="flex items-center mb-16">
            <Zap className="text-red-600 mr-4" size={32} />
            <h2 className="text-3xl font-black tracking-tight">
              精密射出成型系列
            </h2>
          </div>
          <div className="space-y-32">
            {productData.injection.map((p) => (
              <div key={p.id} className="scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
                  <div className="order-2 lg:order-1">
                    <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
                      {p.model}
                    </span>
                    <h3 className="text-2xl font-bold mt-2 mb-4">{p.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {p.desc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle
                            className="text-green-500 mr-2 mt-1 shrink-0"
                            size={18}
                          />
                          <span className="text-sm text-slate-700 font-medium">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 relative group overflow-hidden rounded-2xl border bg-slate-100 min-h-[300px] md:min-h-[400px] flex items-center justify-center shadow-inner">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Settings
                          className="text-slate-400 mb-4 animate-spin-slow"
                          size={48}
                        />
                        <p className="text-slate-400 font-bold">
                          {p.title} 示意圖
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 規格表格 */}
                <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left whitespace-nowrap">
                          規格項目 (單位)
                        </th>
                        {p.specs[0].values.map((modelName, i) => (
                          <th
                            key={i}
                            className="px-6 py-4 whitespace-nowrap min-w-[120px]"
                          >
                            {modelName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {p.specs.slice(1).map((spec, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold bg-slate-50 border-r text-left text-nowrap">
                            {spec.label}
                          </td>
                          {spec.values.map((v, j) => (
                            <td key={j} className="px-6 py-4">
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 熱壓系列 */}
        <section
          id="press"
          className="scroll-mt-24 py-16 bg-slate-50 -mx-4 px-4 rounded-3xl border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-16">
              <Layers className="text-red-600 mr-4" size={32} />
              <h2 className="text-3xl font-black tracking-tight">
                熱壓與真空熱壓系列
              </h2>
            </div>
            <div className="space-y-32">
              {productData.press.map((p) => (
                <div key={p.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-bold text-red-600 mb-4">
                        {p.title}
                      </h3>
                      <p className="text-slate-600 mb-8 leading-relaxed">
                        {p.desc}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {p.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center text-sm font-medium"
                          >
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-3" />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {p.image && (
                      <div className="relative bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden h-64 border">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain p-4 rounded-xl hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-red-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left whitespace-nowrap">
                            規格 / 型號
                          </th>
                          {p.specs[0].values.map((modelName, i) => (
                            <th
                              key={i}
                              className="px-6 py-4 whitespace-nowrap min-w-[120px]"
                            >
                              {modelName}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {p.specs.slice(1).map((spec, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-bold bg-slate-50 border-r text-left text-nowrap">
                              {spec.label}
                            </td>
                            {spec.values.map((v, j) => (
                              <td key={j} className="px-6 py-4">
                                {v}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 週邊設備 */}
        <section id="peripheral" className="scroll-mt-24">
          <div className="flex items-center mb-16">
            <Cpu className="text-red-600 mr-4" size={32} />
            <h2 className="text-3xl font-black tracking-tight">
              自動化週邊設備
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productData.peripheral.map((p) => (
              <div
                key={p.id}
                className="p-8 bg-white border rounded-2xl hover:border-red-600 transition-all hover:shadow-2xl group flex flex-col"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  {p.id === "rsd" ? (
                    <Trash2 size={24} />
                  ) : p.id === "sorting" ? (
                    <ArrowUpCircle size={24} />
                  ) : (
                    <Ruler size={24} />
                  )}
                </div>
                <h4 className="text-xl font-bold mb-1">{p.title}</h4>
                <p className="text-xs font-bold text-red-600 mb-4 tracking-widest uppercase">
                  {p.model}
                </p>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow">
                  {p.desc}
                </p>

                {p.image && (
                  <div className="relative mb-6 rounded-xl overflow-hidden bg-slate-50 border h-40 flex items-center justify-center">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-2 hover:scale-110 transition duration-300"
                    />
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                    技術規格一覽
                  </div>
                  <div className="space-y-3">
                    {p.specs.map((s, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-400 mb-1">
                          {s.label}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {s.values.join(" / ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 舊換新 / 中古機台引流 Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight relative z-10">
            尋找高性價比方案？或想舊機換新機？
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg font-medium relative z-10 text-balance">
            東鐵工程為您嚴選官方認證的二手機台，並提供完善的檢測報告。我們也接受您的退役設備代理，助您無縫升級最新自動化產線。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              href="/used-equipment"
              className="inline-flex justify-center bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all active:scale-95"
            >
              前往認證二手機交易專區
            </Link>
          </div>
        </div>
      </section>

      {/* 聯繫區塊 */}
      <section
        id="contact"
        className="bg-slate-900 text-white py-24 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">
                歡迎聯繫
                <br />
                技術諮詢
              </h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium text-balance">
                東鐵工程提供從切割、射出到後處理的完整生產解決方案。如果您有特定機型需求或客製化專案，請填寫表單，我們將在
                24 小時內與您聯繫。
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start">
                <MapPin className="text-red-500 mr-4 mt-1" />
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-widest text-slate-500">
                    總部地址
                  </p>
                  <p className="text-slate-200">新北市林口區公園路165號12樓</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center text-red-500 mr-4 mt-1">
                  <Factory size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-widest text-slate-500">
                    生產基地
                  </p>
                  <p className="text-slate-200">桃園市蘆竹區海山中街106-1號</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="text-red-500 mr-4 mt-1" />
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-widest text-slate-500">
                    直通專線
                  </p>
                  <p className="text-slate-200 text-xl font-bold">
                    0973-357-788
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="text-red-500 mr-4 mt-1" />
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-widest text-slate-500">
                    電子郵件
                  </p>
                  <p className="text-slate-200">h0973357788@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl text-slate-900 border border-slate-100">
            <h4 className="text-2xl font-black mb-8 tracking-tighter">
              需求諮詢表單
            </h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                    您的姓名
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                    聯繫電話
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                  電子郵件
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="product" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                  興趣產品類別
                </label>
                <div className="relative">
                  <select
                    id="product"
                    name="product"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none cursor-pointer appearance-none transition-all duration-300"
                  >
                    <option value="injection">射出成型機 (FIFO/臥式/立式)</option>
                    <option value="lsr">液態矽膠 LSR 機器</option>
                    <option value="press">熱壓 / 真空熱壓成型機</option>
                    <option value="peripheral">週邊設備 (毛邊/篩選/切料)</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                  您的需求描述
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                  placeholder="例如：產品材料、預計產能需求..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 disabled:bg-slate-400 transition-all shadow-xl shadow-red-200 active:scale-95 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? "正在發送..." : "提交需求諮詢"}
              </button>
              {submitStatus.msg && (
                <p
                  className={`text-center font-bold mt-4 p-4 rounded-xl shadow-sm ${submitStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
                >
                  {submitStatus.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
