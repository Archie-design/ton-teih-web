"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Truck, Factory, Plus, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "概覽", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "詢價紀錄", icon: MessageSquare },
  { href: "/admin/seller-requests", label: "託售申請", icon: Truck },
  { href: "/admin/machines", label: "機台管理", icon: Factory },
  { href: "/admin/upload", label: "新增機台", icon: Plus },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest mr-4 whitespace-nowrap">
            管理後台
          </span>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                pathname === href
                  ? "bg-red-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          登出
        </button>
      </div>
    </nav>
  );
}
