"use client";

import React, { useState } from "react";
import { uploadUsedEquipment } from "@/lib/api/firestore";
import { Factory, Settings } from "lucide-react";
import AdminNav from "@/components/AdminNav";

export default function AdminUploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", msg: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      year: parseInt(formData.get("year") as string) || new Date().getFullYear(),
      category: formData.get("category"),
      location: formData.get("location"),
      price: parseInt(formData.get("price") as string) || 0,
      costPrice: parseInt(formData.get("costPrice") as string) || 0,
      hoursUsed: parseInt(formData.get("hoursUsed") as string) || 0,
      controller: formData.get("controller"),
      pumpSystem: formData.get("pumpSystem"),
      isOfficial: formData.get("isOfficial") === "on",
      inspectionScore: parseInt(formData.get("inspectionScore") as string) || 85,
      thumbnail: formData.get("thumbnail"),
      tradingStatus: "待售",
      specs: {},
    };

    const res = await uploadUsedEquipment(payload as Record<string, unknown>);

    if (res.success) {
      setStatus({ type: "success", msg: "機台資料已成功新增至 Firebase！" });
      form.reset();
    } else {
      setStatus({ type: "error", msg: `上架失敗: ${res.error}` });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Factory className="text-red-600" size={28} />
          <h1 className="text-2xl font-black text-white tracking-tight">
            新增認證中古設備
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-3xl border border-slate-700 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                機台顯示名稱
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="如：東鐵認證：FIFO 橡膠射出成型機 (250T)"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                機台分類
              </label>
              <select
                name="category"
                required
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
              >
                <option value="LSR 射出成型機">LSR 射出成型機</option>
                <option value="真空熱壓成型機">真空熱壓成型機</option>
                <option value="一般平板熱壓機">一般平板熱壓機</option>
                <option value="自動化週邊">自動化週邊</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                所在地點 (去識別化)
              </label>
              <input
                name="location"
                type="text"
                required
                placeholder="如：台中工業區、桃園廠區"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                品牌
              </label>
              <input
                name="brand"
                type="text"
                required
                placeholder="如：Ton Teih"
                defaultValue="Ton Teih"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                機型 (Model)
              </label>
              <input
                name="model"
                type="text"
                required
                placeholder="如：TT-FIFO-250"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                出廠年份
              </label>
              <input
                name="year"
                type="number"
                required
                defaultValue={new Date().getFullYear()}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                使用時數 (小時)
              </label>
              <input
                name="hoursUsed"
                type="number"
                placeholder="選填"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                參考售價 (TWD) — 對外公開
              </label>
              <input
                name="price"
                type="number"
                required
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-red-400 tracking-widest mb-2">
                內部底價 (TWD) — 僅業務可見
              </label>
              <input
                name="costPrice"
                type="number"
                required
                className="w-full bg-red-950/40 border border-red-800/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                控制器品牌/型號
              </label>
              <input
                name="controller"
                type="text"
                placeholder="如：東鐵 V5.2"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                油壓系統品牌
              </label>
              <input
                name="pumpSystem"
                type="text"
                placeholder="如：Yuken"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-red-400 tracking-widest mb-2">
                技術評分 (0-100)
              </label>
              <input
                name="inspectionScore"
                type="number"
                min="0"
                max="100"
                defaultValue="85"
                required
                className="w-full bg-red-950/40 border border-red-800/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                廠房實機縮圖 (URL)
              </label>
              <input
                name="thumbnail"
                type="text"
                required
                placeholder="https://drive.google.com/file/d/FILE_ID/view 或其他圖片網址"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
              />
              <p className="text-[10px] text-slate-500 mt-2">
                支援 Google 雲端硬碟分享連結（系統自動轉換）或任意 HTTPS 圖片網址。
                雲端硬碟需設定「知道連結的所有人可查看」。
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-700/50 rounded-2xl mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="text-slate-400" size={20} />
              <div>
                <h4 className="font-bold text-white text-sm">
                  設定為東鐵官方認證 (Ton Teih Certified)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  此機台是否已經過官方全面安檢與核心零件換新？
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isOfficial"
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 disabled:bg-red-900 disabled:text-red-700 transition-all active:scale-95 cursor-pointer"
          >
            {isLoading ? "上架中..." : "確認上架機台"}
          </button>

          {status.msg && (
            <div
              className={`mt-6 p-4 rounded-xl font-bold text-center text-sm ${
                status.type === "success"
                  ? "bg-green-900/30 text-green-400 border border-green-800/50"
                  : "bg-red-900/30 text-red-400 border border-red-800/50"
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
