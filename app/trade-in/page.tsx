import { Metadata } from "next";
import TradeInClient from "./TradeInClient";

export const metadata: Metadata = {
  title: "舊機換新機 / 機台託售 | 東鐵工程有限公司",
  description:
    "東鐵工程提供舊機換新機及機台代為託售服務。填寫申請表，我們的業務將儘速與您聯繫，提供最優渥的換購方案。",
  openGraph: {
    title: "舊機換新機 / 機台託售 | 東鐵工程",
    description:
      "東鐵工程舊機換新機及機台代為託售服務，由專業業務評估您的設備，提供最佳換購方案。",
    url: "https://www.tonteih.com/trade-in",
    type: "website",
  },
};

export default function TradeInPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-[#111] py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 transform translate-x-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-sm text-[10px] font-black tracking-widest uppercase mb-6 shadow-md">
              Trade-In & Consignment Service
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
              舊機換新機
              <br />
              <span className="text-red-600">機台代售服務</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              東鐵工程協助您評估舊有設備價值，並媒合合適買家。透過我們的去識別化代理機制，保護您的廠房隱私，讓您安心換購最新自動化設備。
            </p>
          </div>
        </div>
      </section>

      {/* 服務說明 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              step: "01",
              title: "填寫申請表",
              desc: "提供機台基本資訊，包含品牌、型號、年份及機況說明。",
            },
            {
              step: "02",
              title: "專業評估",
              desc: "東鐵業務工程師聯繫您，現場或遠端評估設備現況與市場價值。",
            },
            {
              step: "03",
              title: "代理媒合",
              desc: "透過去識別化方式在平台上架，保護廠房隱私，由東鐵統一窗口洽談。",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <p className="text-5xl font-black text-red-600/20 mb-4">{step}</p>
              <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <TradeInClient />
      </section>
    </div>
  );
}
