import { getUsedEquipments } from "@/lib/api/firestore";
import { EyeOff, ShieldCheck } from "lucide-react";
import UsedEquipmentClientView from "./ClientView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "認證中古設備 | 東鐵工程有限公司",
  description:
    "東鐵工程認證中古橡矽膠成型設備，含 LSR 射出成型機、真空熱壓成型機、平板熱壓機。全機技術檢測，透明代理，歡迎詢價。",
  keywords: [
    "中古橡膠射出成型機",
    "二手矽膠射出機",
    "中古熱壓成型機",
    "東鐵二手設備",
    "橡膠設備買賣",
    "認證中古機台",
  ],
  openGraph: {
    title: "認證中古設備 | 東鐵工程有限公司",
    description:
      "東鐵工程認證中古橡矽膠成型設備，透明代理、技術檢測保障，歡迎詢價。",
    url: "https://www.tonteih.com/used-equipment",
    siteName: "東鐵工程有限公司",
    locale: "zh_TW",
    type: "website",
  },
};

export const revalidate = 60;

export default async function UsedEquipmentPage() {
  const machines = await getUsedEquipments();

  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-[#111] py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 transform translate-x-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-sm text-[10px] font-black tracking-widest uppercase mb-6 shadow-md">
              Asset Disposal & Trading Service
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tighter leading-tight">
              二手機台 <span className="text-red-600">官方認證</span> 代理專區
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
              作為橡矽膠成型設備的專家，東鐵工程建立了透明且受控的二手資產媒合機制。我們不只是平台，更是您的技術保障，透過「去識別化」代理模式保護您的廠房隱私。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-600/20 rounded-xl">
                  <EyeOff className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">去識別化媒合</h4>
                  <p className="text-xs text-slate-500">
                    照片經過專業遮蔽，保護原廠房與設備隱私。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-600/20 rounded-xl">
                  <ShieldCheck className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">技術檢測報告</h4>
                  <p className="text-xs text-slate-500">
                    官方工程師進行包含油壓、PLC 等 32 項檢測。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UsedEquipmentClientView initialMachines={machines} />
    </div>
  );
}
