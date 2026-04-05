"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { RefreshCw, EyeOff, Pencil, X, Plus } from "lucide-react";

type AdminMachine = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  location: string;
  price: number;
  costPrice: number;
  thumbnail: string;
  gallery: string[];
  tradingStatus: string;
  inspectionScore: number;
  isActive: boolean;
  isOfficial: boolean;
  hoursUsed: number;
  controller: string;
  pumpSystem: string;
  specs: Record<string, string>;
  createdAt: string | null;
};

const TRADING_STATUS_OPTIONS = ["待售", "預約看機", "已售出"];
const CATEGORIES = ["LSR 射出成型機", "真空熱壓成型機", "一般平板熱壓機", "自動化週邊"];

const inputCls = "w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500";
const redInputCls = "w-full bg-red-950/40 border border-red-800/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-600 outline-none";

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState<AdminMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  // Edit modal state
  const [editMachine, setEditMachine] = useState<AdminMachine | null>(null);
  const [editGallery, setEditGallery] = useState<string[]>([]);
  const [editSaving, setEditSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/machines");
    const json = await res.json();
    if (json.success) setMachines(json.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateMachine = async (id: string, patch: Record<string, unknown>) => {
    setSavingId(id);
    await fetch(`/api/admin/machines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setMachines((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setSavingId(null);
  };

  const openEdit = (m: AdminMachine) => {
    setEditMachine({ ...m });
    setEditGallery(Array.isArray(m.gallery) ? [...m.gallery] : []);
  };

  const closeEdit = () => { setEditMachine(null); setEditGallery([]); };

  const handleEditSave = async () => {
    if (!editMachine) return;
    setEditSaving(true);
    const patch = {
      name: editMachine.name,
      brand: editMachine.brand,
      model: editMachine.model,
      year: editMachine.year,
      category: editMachine.category,
      location: editMachine.location,
      price: editMachine.price,
      costPrice: editMachine.costPrice,
      hoursUsed: editMachine.hoursUsed,
      controller: editMachine.controller,
      pumpSystem: editMachine.pumpSystem,
      isOfficial: editMachine.isOfficial,
      inspectionScore: editMachine.inspectionScore,
      thumbnail: editMachine.thumbnail,
      gallery: editGallery.filter((u) => u.trim()),
      tradingStatus: editMachine.tradingStatus,
    };
    await fetch(`/api/admin/machines/${editMachine.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setMachines((prev) =>
      prev.map((m) =>
        m.id === editMachine.id ? { ...m, ...patch, gallery: editGallery.filter((u) => u.trim()) } : m,
      ),
    );
    setEditSaving(false);
    closeEdit();
  };

  const displayed = machines.filter((m) => showInactive || m.isActive !== false);

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-white">
            機台管理
            <span className="ml-2 text-sm text-slate-400 font-normal">({displayed.length} 台)</span>
          </h1>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded" />
              顯示已下架
            </label>
            <button onClick={fetchData} className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-16">載入中...</p>
        ) : displayed.length === 0 ? (
          <p className="text-slate-500 text-center py-16">目前無機台</p>
        ) : (
          <div className="space-y-2">
            {displayed.map((m) => (
              <div
                key={m.id}
                className={`bg-slate-800 rounded-xl flex items-center gap-4 px-4 py-3 ${m.isActive === false ? "opacity-50" : ""}`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-700 shrink-0 relative">
                  {m.thumbnail ? (
                    <Image src={m.thumbnail} alt={m.name} fill className="object-contain" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">無圖</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{m.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.brand} · {m.model} · {m.year}</div>
                </div>

                {/* Score */}
                <div className="text-center shrink-0">
                  <div className="text-xs text-slate-500">評分</div>
                  <div className="text-white font-bold text-sm">{m.inspectionScore}</div>
                </div>

                {/* Prices */}
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-xs text-slate-500">售價 / 底價</div>
                  <div className="text-white text-sm font-bold">
                    {(m.price / 10000).toFixed(0)}萬
                    <span className="text-red-400 ml-1">/ {(m.costPrice / 10000).toFixed(0)}萬</span>
                  </div>
                </div>

                {/* Status dropdown */}
                <select
                  value={m.tradingStatus}
                  onChange={(e) => updateMachine(m.id, { tradingStatus: e.target.value })}
                  className={`text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer shrink-0 ${
                    m.tradingStatus === "待售" ? "bg-green-900/60 text-green-300"
                    : m.tradingStatus === "預約看機" ? "bg-amber-900/60 text-amber-300"
                    : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {TRADING_STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>

                {/* Edit button */}
                <button
                  onClick={() => openEdit(m)}
                  title="編輯"
                  className="p-1.5 text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                >
                  <Pencil size={15} />
                </button>

                {/* Deactivate */}
                {m.isActive !== false ? (
                  <button
                    onClick={() => { if (confirm(`確定下架「${m.name}」？`)) updateMachine(m.id, { isActive: false }); }}
                    title="下架"
                    className="p-1.5 text-slate-500 hover:text-red-400 transition cursor-pointer shrink-0"
                  >
                    <EyeOff size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => updateMachine(m.id, { isActive: true })}
                    title="重新上架"
                    className="text-xs text-slate-500 hover:text-green-400 transition cursor-pointer shrink-0 px-1"
                  >
                    上架
                  </button>
                )}

                {savingId === m.id && <span className="text-xs text-slate-500">儲存...</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 編輯 Modal ── */}
      {editMachine && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 w-full max-w-3xl p-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white">編輯機台</h2>
              <button onClick={closeEdit} className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer rounded-lg hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 名稱 */}
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">機台顯示名稱</label>
                <input type="text" value={editMachine.name} onChange={(e) => setEditMachine({ ...editMachine, name: e.target.value })} className={inputCls} />
              </div>

              {/* 分類 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">機台分類</label>
                <select value={editMachine.category} onChange={(e) => setEditMachine({ ...editMachine, category: e.target.value })} className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-600 outline-none cursor-pointer">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* 地點 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">所在地點</label>
                <input type="text" value={editMachine.location} onChange={(e) => setEditMachine({ ...editMachine, location: e.target.value })} className={inputCls} />
              </div>

              {/* 品牌 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">品牌</label>
                <input type="text" value={editMachine.brand} onChange={(e) => setEditMachine({ ...editMachine, brand: e.target.value })} className={inputCls} />
              </div>

              {/* 機型 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">機型 (Model)</label>
                <input type="text" value={editMachine.model} onChange={(e) => setEditMachine({ ...editMachine, model: e.target.value })} className={inputCls} />
              </div>

              {/* 年份 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">出廠年份</label>
                <input type="number" value={editMachine.year} onChange={(e) => setEditMachine({ ...editMachine, year: Number(e.target.value) })} className={inputCls} />
              </div>

              {/* 使用時數 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">使用時數 (小時)</label>
                <input type="number" value={editMachine.hoursUsed || ""} onChange={(e) => setEditMachine({ ...editMachine, hoursUsed: Number(e.target.value) })} placeholder="選填" className={inputCls} />
              </div>

              {/* 售價 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">參考售價 (TWD)</label>
                <input type="number" value={editMachine.price} onChange={(e) => setEditMachine({ ...editMachine, price: Number(e.target.value) })} className={inputCls} />
              </div>

              {/* 底價 */}
              <div>
                <label className="block text-xs font-black uppercase text-red-400 tracking-widest mb-1.5">內部底價 (TWD)</label>
                <input type="number" value={editMachine.costPrice} onChange={(e) => setEditMachine({ ...editMachine, costPrice: Number(e.target.value) })} className={redInputCls} />
              </div>

              {/* 控制器 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">控制器品牌/型號</label>
                <input type="text" value={editMachine.controller} onChange={(e) => setEditMachine({ ...editMachine, controller: e.target.value })} className={inputCls} />
              </div>

              {/* 油壓 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">油壓系統品牌</label>
                <input type="text" value={editMachine.pumpSystem} onChange={(e) => setEditMachine({ ...editMachine, pumpSystem: e.target.value })} className={inputCls} />
              </div>

              {/* 評分 */}
              <div>
                <label className="block text-xs font-black uppercase text-red-400 tracking-widest mb-1.5">技術評分 (0-100)</label>
                <input type="number" min="0" max="100" value={editMachine.inspectionScore} onChange={(e) => setEditMachine({ ...editMachine, inspectionScore: Number(e.target.value) })} className={redInputCls} />
              </div>

              {/* 官方認證 toggle */}
              <div className="flex items-center justify-between md:col-span-2 p-4 bg-slate-700/50 rounded-xl">
                <span className="text-sm font-bold text-white">東鐵官方認證 (Ton Teih Certified)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={editMachine.isOfficial} onChange={(e) => setEditMachine({ ...editMachine, isOfficial: e.target.checked })} />
                  <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* 主縮圖 */}
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">主縮圖 (URL)</label>
                <input type="text" value={editMachine.thumbnail} onChange={(e) => setEditMachine({ ...editMachine, thumbnail: e.target.value })} placeholder="Google Drive 連結或 HTTPS 圖片網址" className={inputCls} />
              </div>

              {/* Gallery */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">附加照片</label>
                  <button
                    type="button"
                    onClick={() => setEditGallery((prev) => [...prev, ""])}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition cursor-pointer font-bold"
                  >
                    <Plus size={13} /> 新增照片
                  </button>
                </div>
                {editGallery.length === 0 && (
                  <p className="text-xs text-slate-600 italic">點擊「新增照片」可加入更多圖片網址</p>
                )}
                <div className="space-y-2">
                  {editGallery.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setEditGallery((prev) => prev.map((u, idx) => idx === i ? e.target.value : u))}
                        placeholder={`照片 ${i + 1} 網址`}
                        className="flex-1 bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none placeholder-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setEditGallery((prev) => prev.filter((_, idx) => idx !== i))}
                        className="p-2.5 text-slate-500 hover:text-red-400 transition cursor-pointer rounded-xl hover:bg-slate-700"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 mt-8">
              <button onClick={closeEdit} className="flex-1 py-3 rounded-2xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition cursor-pointer">
                取消
              </button>
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 disabled:bg-red-900 disabled:text-red-700 transition cursor-pointer"
              >
                {editSaving ? "儲存中..." : "儲存變更"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
