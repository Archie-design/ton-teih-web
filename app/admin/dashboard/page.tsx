import { getDb } from "@/lib/firebase/admin";
import AdminNav from "@/components/AdminNav";
import { MessageSquare, Truck, Factory, AlertCircle } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    const db = getDb();
    const [inquiries, sellerReqs, machines] = await Promise.all([
      db.collection("inquiries").where("status", "==", "待回覆").get(),
      db.collection("sellerRequests").where("status", "==", "待聯繫").get(),
      db.collection("machines").get(),
    ]);
    return {
      pendingInquiries: inquiries.size,
      pendingSellerRequests: sellerReqs.size,
      activeMachines: machines.docs.filter((d) => d.data().isActive !== false).length,
    };
  } catch {
    return { pendingInquiries: 0, pendingSellerRequests: 0, activeMachines: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      href: "/admin/inquiries",
      icon: MessageSquare,
      label: "待回覆詢價",
      count: stats.pendingInquiries,
      urgent: stats.pendingInquiries > 0,
      color: "red",
    },
    {
      href: "/admin/seller-requests",
      icon: Truck,
      label: "待聯繫託售申請",
      count: stats.pendingSellerRequests,
      urgent: stats.pendingSellerRequests > 0,
      color: "amber",
    },
    {
      href: "/admin/machines",
      icon: Factory,
      label: "上架中機台",
      count: stats.activeMachines,
      urgent: false,
      color: "slate",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-white mb-8">概覽</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map(({ href, icon: Icon, label, count, urgent }) => (
            <Link
              key={href}
              href={href}
              className="bg-slate-800 rounded-2xl p-6 hover:bg-slate-700 transition-colors cursor-pointer block"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="text-slate-400" size={22} />
                {urgent && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                    <AlertCircle size={12} />
                    待處理
                  </span>
                )}
              </div>
              <div className="text-4xl font-black text-white mb-1">{count}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            快速連結
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/upload"
              className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition cursor-pointer"
            >
              + 新增機台
            </Link>
            <Link
              href="/used-equipment"
              target="_blank"
              className="px-4 py-2 bg-slate-700 text-white text-sm font-bold rounded-xl hover:bg-slate-600 transition cursor-pointer"
            >
              查看前台
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
