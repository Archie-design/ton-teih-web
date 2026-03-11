"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "密碼錯誤！");
      }
    } catch {
      setError("登入失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <div className="flex justify-center mb-6 text-red-600">
          <Lock size={48} />
        </div>
        <h1 className="text-2xl font-black text-center mb-2">管理後台</h1>
        <p className="text-center text-slate-400 text-sm mb-6">東鐵工程 · 內部系統</p>
        {error && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">
            {error}
          </p>
        )}
        <input
          type="password"
          placeholder="請輸入管理員密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-red-600 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 disabled:bg-red-300 transition cursor-pointer"
        >
          {loading ? "驗證中..." : "進入系統"}
        </button>
      </form>
    </div>
  );
}
