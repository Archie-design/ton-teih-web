"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TradingItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants-ui";
import { useContactForm } from "@/lib/hooks/useContactForm";
import {
    MapPin,
    CheckCircle,
    Factory,
    ShieldCheck,
} from "lucide-react";

interface Props {
    initialMachines: TradingItem[];
}

export default function UsedEquipmentClientView({ initialMachines }: Props) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [visibleCount, setVisibleCount] = useState(12);

    // Modal 狀態
    const [selectedMachine, setSelectedMachine] = useState<TradingItem | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeInquiryModal = () => {
        setIsModalOpen(false);
        setSelectedMachine(null);
    };

    const { isSubmitting, submitStatus, handleSubmit } = useContactForm({
        onSuccess: closeInquiryModal,
    });

    const openInquiryModal = (machine: TradingItem) => {
        setSelectedMachine(machine);
        setIsModalOpen(true);
    };

    // 資料過濾與排序
    const filteredMachines = initialMachines
        .filter(
            (m) =>
                activeCategory === "all" ||
                m.category === CATEGORIES.find((c) => c.id === activeCategory)?.name,
        )
        .sort((a, b) => {
            if (sortBy === "price_asc") return a.price - b.price;
            if (sortBy === "price_desc") return b.price - a.price;
            if (sortBy === "year_desc") return b.year - a.year;
            return 0;
        });

    return (
        <>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-red-600 pl-4 tracking-tight">
                            認證機台列表
                        </h2>
                        <p className="text-sm font-bold text-slate-500 mt-2 pl-5">
                            共找到{" "}
                            <span className="text-red-600">{filteredMachines.length}</span>{" "}
                            台設備
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <select
                            value={activeCategory}
                            onChange={(e) => { setActiveCategory(e.target.value); setVisibleCount(12); }}
                            className="bg-white border text-slate-700 border-slate-200 rounded-lg text-sm font-bold px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none flex-grow md:flex-grow-0 cursor-pointer shadow-sm"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setVisibleCount(12); }}
                            className="bg-white border text-slate-700 border-slate-200 rounded-lg text-sm font-bold px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none flex-grow md:flex-grow-0 cursor-pointer shadow-sm"
                        >
                            <option value="newest">最新刊登</option>
                            <option value="year_desc">年份由新到舊</option>
                            <option value="price_asc">價格由低到高</option>
                            <option value="price_desc">價格由高到低</option>
                        </select>
                    </div>
                </div>

                {/* Machine Grid */}
                {filteredMachines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {filteredMachines.slice(0, visibleCount).map((machine) => (
                            <div
                                key={machine.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-2xl hover:border-red-600/30 transition-all flex flex-col relative w-full h-full"
                            >
                                <div className="relative h-60 overflow-hidden bg-slate-100 flex-shrink-0">
                                    <Image
                                        src={machine.thumbnail}
                                        alt={machine.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                                        priority={false}
                                    />
                                    {/* 水印 */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none -rotate-12">
                                        <span className="text-3xl font-black tracking-tighter text-black uppercase">
                                            Ton Teih Certified
                                        </span>
                                    </div>

                                    {/* 標籤 */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {machine.isOfficial && (
                                            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-sm shadow-lg flex items-center">
                                                <ShieldCheck size={12} className="mr-1" /> 官方認證
                                            </span>
                                        )}
                                        {(machine.tradingStatus === "reserved" ||
                                            machine.tradingStatus === "預約看機") && (
                                                <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-sm shadow-lg">
                                                    預約看機中
                                                </span>
                                            )}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1 relative z-10 bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-slate-900 text-lg group-hover:text-red-600 transition-colors line-clamp-1">
                                            {machine.name}
                                        </h3>
                                        <span className="text-sm font-black text-slate-400 whitespace-nowrap ml-2">
                                            {machine.year} 年
                                        </span>
                                    </div>

                                    <p className="text-xs font-bold text-slate-500 mb-6 flex items-center">
                                        <MapPin className="text-red-600 mr-1" size={14} />{" "}
                                        {machine.location} (代理洽談)
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                技術評分
                                            </p>
                                            <p className="text-xl font-black text-red-600">
                                                {machine.inspectionScore}
                                                <span className="text-xs text-slate-400">/100</span>
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                參考售價
                                            </p>
                                            <p className="text-lg font-black text-slate-900">
                                                ${machine.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <CheckCircle
                                                size={14}
                                                className="text-green-500 shrink-0"
                                            />{" "}
                                            通過油壓與電路穩定測試
                                        </div>
                                        <button
                                            onClick={() => openInquiryModal(machine)}
                                            className="w-full flex justify-center py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-red-600 transition-all shadow-xl hover:shadow-red-600/30 active:scale-95"
                                        >
                                            詢問此設備
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* 載入更多 */}
                {filteredMachines.length > visibleCount && (
                    <div className="flex justify-center mb-12">
                        <button
                            onClick={() => setVisibleCount((c) => c + 12)}
                            className="px-10 py-3.5 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm cursor-pointer"
                        >
                            載入更多設備
                        </button>
                    </div>
                )}

                {filteredMachines.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
                        <Factory className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            目前無符合條件的機台
                        </h3>
                        <p className="text-slate-500">
                            請嘗試調整分類或排序條件，或直接聯繫我們尋找特定設備。
                        </p>
                    </div>
                )}

                {/* Trade-in Promo */}
                <div className="bg-gradient-to-br from-slate-900 to-black rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight relative z-10">
                        計畫購入最新自動化設備？
                    </h3>
                    <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg font-medium relative z-10">
                        東鐵工程提供優渥的「舊機換新機」方案。協助您處理舊有機台以騰出廠房空間與資金，現在就升級最先進的射出成型與熱壓技術。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <a
                            href="/trade-in"
                            className="inline-flex justify-center bg-red-600 hover:bg-red-700 text-white font-black py-4 px-10 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all active:scale-95"
                        >
                            申請舊機換新機
                        </a>
                        <a
                            href="/#contact"
                            className="inline-flex justify-center bg-white/10 hover:bg-white/20 text-white font-black py-4 px-10 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95"
                        >
                            預約技術經理洽談
                        </a>
                    </div>
                </div>
            </div>

            {/* Inquiry Modal */}
            {isModalOpen && selectedMachine && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rotate-45 pointer-events-none"></div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900 relative z-10">
                                    機台詢價
                                </h3>
                                <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-widest relative z-10">
                                    Equipment Inquiry
                                </p>
                            </div>
                            <button
                                onClick={closeInquiryModal}
                                className="text-slate-400 hover:text-red-600 transition-colors p-2 bg-white rounded-full shadow-sm relative z-10"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            {/* Honeypot：機器人陷阱，真實使用者不會填寫此欄位 */}
                            <input type="text" name="website" tabIndex={-1} aria-hidden="true" className="hidden" />
                            {/* 隱藏欄位：帶入機台 ID */}
                            <input
                                type="hidden"
                                name="equipmentId"
                                value={selectedMachine.id}
                            />
                            <input
                                type="hidden"
                                name="product"
                                value={`中古設備詢問 - ${selectedMachine.category}`}
                            />

                            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-center">
                                <div className="w-16 h-16 relative bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={selectedMachine.thumbnail}
                                        alt="thumb"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold mb-1">
                                        您正在詢問：
                                    </p>
                                    <p className="font-black text-slate-900 leading-tight">
                                        {selectedMachine.name}
                                    </p>
                                    <p className="text-xs text-red-600 font-black tracking-widest mt-1">
                                        ID: {selectedMachine.id}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="modal-name" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                                            您的姓名
                                        </label>
                                        <input
                                            id="modal-name"
                                            name="name"
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="modal-phone" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                                            聯繫電話
                                        </label>
                                        <input
                                            id="modal-phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="modal-email" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                                        電子郵件
                                    </label>
                                    <input
                                        id="modal-email"
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modal-message" className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest cursor-pointer">
                                        備註需求或詢問事項
                                    </label>
                                    <textarea
                                        id="modal-message"
                                        name="message"
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all duration-300"
                                        placeholder="例如：我想了解此機台的看機時間..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 disabled:bg-slate-400 transition-all shadow-xl shadow-red-200 active:scale-95 flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? "正在發送..." : "提交詢價"}
                                </button>
                                {submitStatus.msg && (
                                    <p
                                        className={`text-center font-bold mt-4 p-4 rounded-xl shadow-sm ${submitStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
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
