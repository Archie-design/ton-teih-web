import { Metadata } from "next";

export const metadata: Metadata = {
  title: "常見問題 FAQ | 東鐵工程有限公司",
  description:
    "二手橡膠射出機、矽膠射出機、熱壓成型機的常見問題解答，包含保固、驗機、運輸、看機安排、詢價流程等資訊。",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "常見問題 FAQ | 東鐵工程",
    description:
      "解答購買中古橡膠矽膠射出機的常見疑問，包含驗機流程、保固條件、運輸安排等。",
    url: "https://www.tonteih.com/faq",
  },
};

const faqs = [
  {
    q: "二手橡膠射出機有保固嗎？",
    a: "二手機台均以現況（AS-IS）出售，不提供保固服務。但每台機器在上架前均由東鐵工程技術團隊完成全面驗機，確保設備處於正常運作狀態，並以「技術評分」如實呈現機台狀況，讓買方能在充分知情下做出決策。",
  },
  {
    q: "如何確認機台狀況（驗機流程）？",
    a: "每台列於平台的機器均由東鐵技術團隊完成現場驗機，包含油壓壓力測試、電路穩定度、PLC 程序讀取及試車評分，最終以「技術評分（/100）」呈現於頁面上，買方亦可預約現場看機。",
  },
  {
    q: "可以現場看機嗎？",
    a: "可以。請透過頁面上的「詢問此設備」填寫您的聯絡資訊，業務人員將在一個工作天內與您聯繫，安排看機時間與地點。",
  },
  {
    q: "詢價後多久會有回覆？",
    a: "系統收到詢價後將即時寄送確認通知，業務人員通常於一個工作天內以電話或 EMAIL 回覆。若有急迫需求，歡迎直接透過 LINE 聯繫我們。",
  },
  {
    q: "交機與運輸如何安排？",
    a: "交機地點以機台目前所在地為主（詳情頁有標示）。東鐵可協助介紹台灣本島的工業運輸廠商，若有海外出口需求，亦可協助處理出口報關及拆機包裝，運費由買方負擔。",
  },
  {
    q: "可以協助安裝調機嗎？",
    a: "可以。東鐵工程技術團隊提供到廠安裝與試車服務，費用依距離與機台複雜度另計，請於詢價時一同說明需求。",
  },
  {
    q: "舊機可以換購新機嗎？",
    a: "可以。東鐵工程提供「舊機換新機」方案，協助您評估舊機台的市場價值並以此折抵新機購買金額，歡迎前往「委託代理」頁面填寫申請，或直接聯繫業務洽談。",
  },
  {
    q: "LSR／矽膠射出機與橡膠機有何不同？",
    a: "LSR（液態矽膠）射出機採冷流道進料系統，適合高精度醫療或食品級產品；傳統橡膠射出機採熱流道，適合大批量工業用橡膠件。兩者在溫控、流道設計與模具規格上差異顯著，選購前建議告知用途，由業務工程師協助評估。",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-[#111] py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-sm text-[10px] font-black tracking-widest uppercase mb-4 shadow-md">
            FAQ
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            常見問題
          </h1>
          <p className="text-slate-400 mt-3 text-sm font-bold max-w-xl">
            關於二手設備購買、驗機、運輸與售後的常見疑問，歡迎參考以下解答，或直接聯繫業務。
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-7 h-7 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center mt-0.5">
                    Q
                  </span>
                  <h2 className="font-black text-slate-900 text-base leading-snug">{q}</h2>
                </div>
                <div className="flex items-start gap-4 mt-4">
                  <span className="shrink-0 w-7 h-7 bg-slate-100 text-slate-500 text-xs font-black rounded-full flex items-center justify-center mt-0.5">
                    A
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center">
          <p className="text-white font-black text-lg mb-2">找不到您的問題？</p>
          <p className="text-slate-400 text-sm font-medium mb-6">
            歡迎直接聯繫我們，業務工程師將為您詳細說明。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/#contact"
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              聯繫業務
            </a>
            <a
              href="/used-equipment"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              瀏覽中古設備
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
