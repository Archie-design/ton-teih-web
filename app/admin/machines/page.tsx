"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { RefreshCw, EyeOff } from "lucide-react";

type AdminMachine = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  price: number;
  costPrice: number;
  thumbnail: string;
  tradingStatus: string;
  inspectionScore: number;
  isActive: boolean;
  createdAt: string | null;
};

const TRADING_STATUS_OPTIONS = ["待售", "預約看機", "已售出"];

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState<AdminMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/machines");
    const json = await res.json();
    if (json.success) setMachines(json.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const displayed = machines.filter((m) => showInactive || m.isActive !== false);

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-white">
            機台管理
            <span className="ml-2 text-sm text-slate-400 font-normal">
              ({displayed.length} 台)
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded"
              />
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
                    <Image
                      src={m.thumbnail}
                      alt={m.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                      無圖
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{m.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {m.brand} · {m.model} · {m.year}
                  </div>
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
                  onChange={(e) =>
                    updateMachine(m.id, { tradingStatus: e.target.value })
                  }
                  className={`text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer shrink-0 ${
                    m.tradingStatus === "待售"
                      ? "bg-green-900/60 text-green-300"
                      : m.tradingStatus === "預約看機"
                        ? "bg-amber-900/60 text-amber-300"
                        : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {TRADING_STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                {/* Deactivate */}
                {m.isActive !== false ? (
                  <button
                    onClick={() => {
                      if (confirm(`確定下架「${m.name}」？`)) {
                        updateMachine(m.id, { isActive: false });
                      }
                    }}
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

                {savingId === m.id && (
                  <span className="text-xs text-slate-500">儲存...</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
