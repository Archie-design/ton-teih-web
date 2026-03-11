"use client";

import { useState, useEffect, useCallback } from "react";
import AdminNav from "@/components/AdminNav";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

type SellerRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  machineBrand: string;
  machineModel: string;
  machineYear: string;
  machineHours: string;
  machinePrice: string;
  machineLocation: string;
  machineCondition: string;
  status: string;
  adminNote: string;
  createdAt: string | null;
};

const STATUS_OPTIONS = ["待聯繫", "已聯繫", "成交"];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSellerRequestsPage() {
  const [rows, setRows] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("全部");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seller-requests");
    const json = await res.json();
    if (json.success) setRows(json.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateField = async (id: string, patch: Record<string, string>) => {
    setSavingId(id);
    await fetch(`/api/admin/seller-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setSavingId(null);
  };

  const saveNote = (id: string) =>
    updateField(id, { adminNote: noteInputs[id] ?? "" });

  const filtered =
    filterStatus === "全部" ? rows : rows.filter((r) => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-white">
            託售申請
            <span className="ml-2 text-sm text-slate-400 font-normal">
              ({filtered.length} 筆)
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700 text-white text-sm px-3 py-1.5 rounded-lg border-0 cursor-pointer"
            >
              <option>全部</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button onClick={fetchData} className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-16">載入中...</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-16">目前無紀錄</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((row) => (
              <div key={row.id} className="bg-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === row.id ? null : row.id)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-slate-750 transition-colors"
                >
                  <span className="text-xs text-slate-500 w-28 shrink-0">
                    {formatDate(row.createdAt)}
                  </span>
                  <span className="font-semibold text-white text-sm w-20 shrink-0 truncate">
                    {row.name}
                  </span>
                  <span className="text-slate-400 text-sm w-28 shrink-0 truncate">
                    {row.phone}
                  </span>
                  <span className="text-slate-400 text-sm flex-1 truncate">
                    {row.machineBrand} {row.machineModel}
                  </span>
                  <span className="text-slate-400 text-sm w-24 shrink-0 truncate">
                    {row.machinePrice ? `NT$${row.machinePrice}` : "—"}
                  </span>
                  <select
                    value={row.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateField(row.id, { status: e.target.value })
                    }
                    className={`text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer ${
                      row.status === "待聯繫"
                        ? "bg-red-900/60 text-red-300"
                        : row.status === "已聯繫"
                          ? "bg-blue-900/60 text-blue-300"
                          : "bg-green-900/60 text-green-300"
                    }`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {savingId === row.id && (
                    <span className="text-xs text-slate-500">儲存中...</span>
                  )}
                  {expandedId === row.id ? (
                    <ChevronUp size={14} className="text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-500 shrink-0" />
                  )}
                </button>

                {expandedId === row.id && (
                  <div className="px-4 pb-4 border-t border-slate-700 pt-3 space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-slate-500 block mb-0.5">電子郵件</span>
                        <span className="text-white">{row.email || "—"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-0.5">年份</span>
                        <span className="text-white">{row.machineYear || "—"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-0.5">使用時數</span>
                        <span className="text-white">{row.machineHours ? `${row.machineHours} hr` : "—"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-0.5">所在地</span>
                        <span className="text-white">{row.machineLocation || "—"}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">機況說明</span>
                      <p className="text-slate-300 text-sm bg-slate-700/50 rounded-lg p-3">
                        {row.machineCondition || "（未填寫）"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block mb-1">業務備註</span>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          className="flex-1 bg-slate-700 text-white text-sm rounded-lg px-3 py-2 resize-none border-0 focus:ring-1 focus:ring-red-500 outline-none"
                          defaultValue={row.adminNote || ""}
                          onChange={(e) =>
                            setNoteInputs((prev) => ({
                              ...prev,
                              [row.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          onClick={() => saveNote(row.id)}
                          className="px-3 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition cursor-pointer"
                        >
                          儲存
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
