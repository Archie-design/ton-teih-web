'use client';

import React, { useState } from 'react';
import { 
  Settings, Zap, CheckCircle, Activity, Box, Factory, 
  MapPin, Phone, Mail, ChevronDown, Cpu, RefreshCw, 
  Layers, Ruler, Trash2, ArrowUpCircle, Menu, X, ShieldCheck, Target, Cog, TrendingUp
} from 'lucide-react';

/**
 * 重要：請在此處填入您在 Google Apps Script 部署後取得的 Web App URL
 */
const SCRIPT_URL = "您的_GAS_WEB_APP_URL";

// --- 十大產品數據定義 ---
const productData = {
  injection: [
    {
      id: "fifo",
      title: "先進先出 (FIFO) 射出成型機",
      model: "TGD 系列",
      // 已填入您提供的 Google Drive 圖片轉換後的直接連結
      image: "https://lh3.googleusercontent.com/d/1J6qsryVGZOg2jmIash79X8A4_PDbpPah", 
      desc: "同軸直線流動結構確保膠料「最先進入、最先射出」，避免停留時間過長導致焦燒，是高精密橡膠生產的首選。",
      features: ["真實 FIFO 流程，無回流死角", "流動路徑短，大幅減少殘膠", "停留時間一致，品質極其均勻", "換色與清膠效率提升 50%"],
      specs: [
        { label: "鎖模力 (TON)", values: ["100", "155", "210", "260", "330", "395", "440", "550"] },
        { label: "注射容積 (CC)", values: ["350", "800", "1600", "2200", "3000", "3300", "5000", "8000"] },
        { label: "總功率 (KW)", values: ["18", "22", "26", "27", "36", "37", "39", "45"] }
      ]
    },
    {
      id: "horizontal",
      title: "臥式橡(矽)膠射出成型機",
      model: "TRH 系列",
      image: "", 
      desc: "具備強大扭力的液壓馬達，確保高硬度膠料穩定進料，適用於製作結構複雜的多樣化製品。",
      features: ["強大進料扭力馬達", "精密螺桿設計，適應多種膠料", "生產循環快速，高產能效率", "靈活安裝各類複雜模具"],
      specs: [
        { label: "鎖模力 (TON)", values: ["100", "210", "330", "440", "660", "1100"] },
        { label: "注射容積 (CC)", values: ["1000", "2000", "3000", "5000", "15000", "25000"] },
        { label: "熱板尺寸 (MM)", values: ["450*450", "550*550", "650*650", "750*750", "950*950", "1300*1300"] },
        { label: "重量 (T)", values: ["6", "7.5", "10", "12", "18", "25"] }
      ]
    },
    {
      id: "vertical",
      title: "立式橡(矽)膠射出成型機",
      model: "TRV 系列",
      image: "",
      desc: "PLC 精密控制系統，支援三段注射與保壓，為精密嵌件成型提供最高穩定性。",
      features: ["PLC 可編程控制系統", "三段注射壓力與流量調節", "靈活處理各類矽橡膠產品", "適合氟橡膠 O 型圈生產"],
      specs: [
        { label: "鎖模力 (TON)", values: ["100", "155", "210", "330", "440", "550"] },
        { label: "注射容積 (CC)", values: ["300", "600", "1500", "2500", "5000", "8000"] },
        { label: "機台重量 (T)", values: ["4", "5", "7.5", "10", "12", "15"] }
      ]
    },
    {
      id: "lsr",
      title: "液態矽膠 LSR 射出機",
      model: "TGV 系列",
      image: "",
      desc: "數位化色漿混配精確度達 0.1%，採用 Yuken 液態配件，確保注射過程均勻與計量精確。",
      features: ["數位化色漿混配系統", "LSR 專用料管與加料設計", "注射計量誤差極小化", "高效能液壓功能控制"],
      specs: [
        { label: "鎖模力 (TON)", values: ["65", "100", "125", "155"] },
        { label: "注射容積 (CC)", values: ["176", "223", "254", "314"] },
        { label: "總功率 (KW)", values: ["7.5", "11", "11", "15"] }
      ]
    }
  ],
  press: [
    {
      id: "tfs",
      title: "熱壓成型機",
      model: "TFS 系列",
      image: "",
      desc: "雙動力獨立系統設計，兩軸完全獨立工作，具備慢速校模功能，安全且精確。",
      features: ["雙油泵雙馬達獨立作業", "慢速校模精確定位", "適用電子零件硫化成型", "結構強化，耐用度高"],
      specs: [
        { label: "鎖模力 (TON)", values: ["100", "160", "260", "330", "440"] },
        { label: "主缸行程 (MM)", values: ["250", "250", "250", "250", "400"] },
        { label: "總功率 (KW)", values: ["29", "38", "50", "61", "68"] }
      ]
    },
    {
      id: "tvs",
      title: "真空熱壓成型機",
      model: "TVS 系列",
      image: "",
      desc: "高負壓真空罩設計，4 秒內達成 -650mmHg 真空度，專治排氣困難之精密成品。",
      features: ["極速抽真空，減少氣泡產生", "接近完全真空的成型環境", "適合醫療藥蓋與導電用品", "精密邊緣應用表現卓越"],
      specs: [
        { label: "鎖模力 (TON)", values: ["100", "160", "260", "330", "440"] },
        { label: "真空罩尺寸 (MM)", values: ["450*450", "500*500", "600*600", "650*650", "800*800"] },
        { label: "機台重量 (T)", values: ["6", "7", "9", "11.6", "17"] }
      ]
    }
  ],
  peripheral: [
    {
      id: "rsd",
      title: "橡矽膠毛邊機",
      model: "RSD 系列",
      image: "",
      desc: "空氣動力與離心力原理分離毛邊，一台機可抵 20-40 人手工拆邊效率。",
      features: ["處理製品直徑 3-150mm", "降低人工成本，提升產能", "適用多種密封圈與精密件", "穩定運行，低維護成本"],
      specs: [
        { label: "容器直徑 (MM)", values: ["320", "377", "500", "600"] },
        { label: "機器重量 (KG)", values: ["135", "290", "365", "390"] },
        { label: "效率 (KG/次)", values: ["0.3-0.7", "3-4", "5-7", "6-8"] }
      ]
    },
    {
      id: "sorting",
      title: "空氣篩選 + 上升機",
      model: "APM / LM 系列",
      image: "",
      desc: "自動化分離產品毛屑並實現物料輸送，提升生產線潔淨度與自動化程度。",
      features: ["空氣動力有效分離毛屑", "風量可依產品比重調整", "自動輸送減少搬運", "全不銹鋼結構，耐腐蝕"],
      specs: [
        { label: "APM 風機功率 (KW)", values: ["2.2"] },
        { label: "APM 重量 (KG)", values: ["300"] },
        { label: "LM 輸送電機 (W)", values: ["120"] }
      ]
    },
    {
      id: "ras",
      title: "自動稱重切料機",
      model: "RAS 系列",
      desc: "PLC 稱重模塊與重量感應計算系統，伺服馬達驅動進給，切料極其精準。",
      features: ["自動稱重、補償與選別", "伺服進給，高穩定精確度", "7 吋觸控螢幕，操作便捷", "自動區分合格與不合格品"],
      specs: [
        { label: "控制系統", values: ["PLC + 伺服"] },
        { label: "操作介面", values: ["7 吋觸控螢幕"] }
      ]
    },
    {
      id: "rcm",
      title: "長度與重量切料機",
      model: "RCM 系列",
      desc: "可靈活切換長度或重量模式，適合橡膠片、EVA 及各種板材切割。",
      features: ["兩種切割模式快速切換", "自動報警與參數設定", "伺服馬達精控進料", "適用範圍廣，運行穩定"],
      specs: [
        { label: "切割寬度 (MM)", values: ["≤ 570", "≤ 770", "≤ 970"] },
        { label: "板厚 (MM)", values: ["≤ 12"] },
        { label: "切割速度 (min)", values: ["≤ 70"] }
      ]
    }
  ]
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', msg: '' });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      setSubmitStatus({ type: 'success', msg: '感謝您的諮詢！我們將儘快與您聯繫。' });
      form.reset();
      setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 5000);
    } catch (err) {
      setSubmitStatus({ type: 'error', msg: '發送失敗，請稍後再試。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-red-100">
      
      {/* 導航欄 (Navbar) */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <img 
                src="https://lh3.googleusercontent.com/d/1hHUT4K1j5SL7rBR5K9aYYvj12IG8aLXb" 
                alt="TON TEIH Logo" 
                className="h-14 rotate-90 mr-4"
              />
              <div>
                <span className="text-xl font-black text-red-600 tracking-tight block">東鐵工程有限公司</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">TON TEIH</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600">
              <a href="#injection" className="hover:text-red-600 transition">射出成型</a>
              <a href="#press" className="hover:text-red-600 transition">熱壓系列</a>
              <a href="#peripheral" className="hover:text-red-600 transition">週邊設備</a>
              <a href="#contact" className="bg-red-600 text-white px-5 py-2.5 rounded hover:bg-red-700 transition">
                聯繫我們
              </a>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl">
            <a href="#injection" onClick={() => setIsMenuOpen(false)} className="block font-bold">射出成型</a>
            <a href="#press" onClick={() => setIsMenuOpen(false)} className="block font-bold">熱壓系列</a>
            <a href="#peripheral" onClick={() => setIsMenuOpen(false)} className="block font-bold">週邊設備</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block font-bold text-red-600">聯繫我們</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">全方位橡矽膠成型解決方案</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">追求卓越品質，提供高效、穩定的生產設備與技術支援</p>
          <a href="#contact" className="inline-block bg-red-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/50">立即聯繫諮詢</a>
        </div>
      </header>

      {/* 產品主體 */}
      <main className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        
        {/* 1. 射出系列 */}
        <section id="injection">
          <div className="flex items-center mb-16">
            <Zap className="text-red-600 mr-4" size={32} />
            <h2 className="text-3xl font-black tracking-tight">精密射出成型系列</h2>
          </div>
          <div className="space-y-24">
            {productData.injection.map((p) => (
              <div key={p.id} className="scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-red-600 font-bold uppercase tracking-widest text-sm">{p.model}</span>
                    <h3 className="text-2xl font-bold mt-2 mb-4">{p.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{p.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle className="text-green-500 mr-2 mt-1 shrink-0" size={18} />
                          <span className="text-sm text-gray-700 font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 圖片顯示邏輯 */}
                  <div className="relative group overflow-hidden rounded-2xl border bg-gray-100 min-h-[400px] flex items-center justify-center shadow-inner">
                    {p.image ? (
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=圖片載入失敗';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Settings className="text-gray-400 mb-4 animate-spin" size={48} />
                        <p className="text-gray-400 font-bold">{p.title} 示意圖</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto mt-8 bg-white rounded-xl border shadow-sm">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-gray-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">規格項目 (單位)</th>
                        {p.specs[0].values.map((_, i) => <th key={i} className="px-6 py-4">數據 {i+1}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {p.specs.map((spec, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-bold bg-gray-50 border-r text-left text-nowrap">{spec.label}</td>
                          {spec.values.map((v, j) => <td key={j} className="px-6 py-4">{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 熱壓系列 */}
        <section id="press" className="scroll-mt-24 py-16 bg-gray-50 -mx-4 px-4 rounded-3xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-16">
              <Layers className="text-red-600 mr-4" size={32} />
              <h2 className="text-3xl font-black tracking-tight">熱壓與真空熱壓系列</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {productData.press.map((p) => (
                <div key={p.id} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col group hover:border-red-500 transition">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-56 object-contain rounded-xl mb-6 shadow-sm group-hover:scale-105 transition" />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border border-dashed text-gray-300">
                      [此處放置 {p.model} 圖片]
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-red-600 mb-4">{p.title} ({p.model})</h3>
                  <p className="text-gray-600 mb-8 flex-grow">{p.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center text-sm font-medium">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-3" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">技術規格摘要</h4>
                    {p.specs.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b last:border-0 border-gray-200">
                        <span className="text-gray-500">{s.label}</span>
                        <span className="font-bold text-gray-900">{s.values[0]} ~ {s.values[s.values.length-1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 週邊設備 */}
        <section id="peripheral" className="scroll-mt-24">
          <div className="flex items-center mb-16">
            <Cpu className="text-red-600 mr-4" size={32} />
            <h2 className="text-3xl font-black tracking-tight">自動化週邊設備</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productData.peripheral.map((p) => (
              <div key={p.id} className="p-6 bg-white border rounded-2xl hover:border-red-600 transition-all hover:shadow-2xl group flex flex-col">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  {p.id === 'rsd' && <Trash2 size={24} />}
                  {p.id === 'sorting' && <ArrowUpCircle size={24} />}
                  {(p.id === 'ras' || p.id === 'rcm') && <Ruler size={24} />}
                </div>
                {p.image && (
                  <img src={p.image} alt={p.title} className="w-full h-32 object-contain rounded-lg mb-4" />
                )}
                <h4 className="text-lg font-bold mb-1">{p.title}</h4>
                <p className="text-xs font-bold text-red-600 mb-4">{p.model}</p>
                <p className="text-sm text-gray-500 mb-6 h-12 line-clamp-2">{p.desc}</p>
                <div className="pt-4 border-t mt-auto space-y-2 border-gray-100">
                  {p.specs.map((s, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-gray-400 tracking-tighter">{s.label}</span>
                      <span className="text-gray-900">{s.values[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 聯繫區塊 */}
      <section id="contact" className="bg-gray-900 text-white py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-4xl font-black mb-8 leading-tight">歡迎聯繫<br />技術諮詢</h2>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              東鐵工程提供從切割、射出到後處理的完整生產解決方案。如果您有特定機型需求或客製化專案，請填寫表單，我們的專家將在 24 小時內與您聯繫。
            </p>
            <div className="space-y-8">
              <div className="flex items-start">
                <MapPin className="text-red-500 mr-4 mt-1" />
                <div>
                  <h6 className="font-bold text-sm mb-1 uppercase tracking-widest text-gray-500">總部地址</h6>
                  <p className="text-gray-200">新北市林口區公園路165號12樓</p>
                </div>
              </div>
              <div className="flex items-start">
                <Factory className="text-red-500 mr-4 mt-1" />
                <div>
                  <h6 className="font-bold text-sm mb-1 uppercase tracking-widest text-gray-500">生產基地</h6>
                  <p className="text-gray-200">桃園市蘆竹區海山中街106-1號</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="text-red-500 mr-4 mt-1" />
                <div>
                  <h6 className="font-bold text-sm mb-1 uppercase tracking-widest text-gray-500">直通專線</h6>
                  <p className="text-gray-200 text-xl font-bold">0973-357-788</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="text-red-500 mr-4 mt-1" />
                <div>
                  <h6 className="font-bold text-sm mb-1 uppercase tracking-widest text-gray-500">電子郵件</h6>
                  <p className="text-gray-200">h0973357788@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl text-gray-900">
            <h4 className="text-2xl font-black mb-8">需求諮詢表單</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">您的姓名</label>
                  <input name="name" type="text" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">聯繫電話</label>
                  <input name="phone" type="tel" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition shadow-inner" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">電子郵件</label>
                <input name="email" type="email" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">感興趣的產品類別</label>
                <select name="product" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none appearance-none cursor-pointer shadow-inner">
                  <option>射出成型機 (FIFO/臥式/立式)</option>
                  <option>液態矽膠 LSR 機器</option>
                  <option>熱壓 / 真空熱壓成型機</option>
                  <option>週邊設備 (毛邊/篩選/切料)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2">您的需求描述</label>
                <textarea name="message" rows={4} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition shadow-inner" placeholder="例如：產品材料、預計產能、尺寸需求等..."></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-xl shadow-red-200 active:scale-95"
              >
                {isSubmitting ? '正在發送...' : '提交需求諮詢'}
              </button>
              {submitStatus.msg && (
                <p className={`text-center font-bold mt-4 p-4 rounded-xl shadow-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {submitStatus.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-black py-10 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
        © 2026 東鐵工程有限公司 TON TEIH. ALL RIGHTS RESERVED. | 統一編號: 66450110
      </footer>
    </div>
  );
}