'use client';

import React, { useState } from 'react';
import { 
  Settings, Zap, CheckCircle, Factory, 
  MapPin, Phone, Mail, Cpu, 
  Layers, Ruler, Trash2, ArrowUpCircle, Menu, X
} from 'lucide-react';

/**
 * 重要：請在此處填入您在 Google Apps Script 部署後取得的 Web App URL
 */
const SCRIPT_URL = "您的_GAS_WEB_APP_URL";

// --- 十大產品數據定義 (圖片已改為本地資料夾路徑方式) ---
// 圖片存放教學：
// 1. 請在專案的 public 目錄下建立 images/products/ 資料夾
// 2. 將對應的圖檔放入，並確保檔名與下方的路徑一致
const productData = {
  injection: [
    {
      id: "fifo",
      title: "先進先出 (FIFO) 射出成型機",
      model: "TGD 系列",
      image: "/images/products/tgd.jpg", 
      desc: "確保膠料「最先進入、最先射出」，避免長時間滯留在加熱區而產生焦燒 (scorching) 或性能劣化。同軸直線流動結構能縮短停留時間，提升換模與清膠效率。",
      features: [
        "真實 FIFO 流程：膠料不回流、不滯留，品質穩定",
        "流動時間一致：保證同模橡膠物理、化學變化同步",
        "便於清膠：無死角、無殘料，大幅增加換模換色速度",
        "射出穩定：壓力與流速均勻，適合高精密或薄肉件"
      ],
      specs: [
        { label: "規格 / 型號", values: ["TGD-100", "TGD-155", "TGD-210", "TGD-260", "TGD-330", "TGD-395", "TGD-440", "TGD-550"] },
        { label: "鎖模力 (TON)", values: ["100", "155", "210", "260", "330", "395", "440", "550"] },
        { label: "注射容積 (CC)", values: ["350", "800", "1600", "2200", "3000", "3300", "5000", "8000"] },
        { label: "熱板尺寸 (MM)", values: ["450*450", "500*500", "550*550", "600*600", "650*650", "700*700", "750*750", "850*850"] },
        { label: "總功率 (KW)", values: ["18", "22", "26", "27", "36", "37", "39", "45"] }
      ]
    },
    {
      id: "horizontal",
      title: "臥式橡(矽)膠射出成型機",
      model: "TRH 系列",
      image: "", 
      desc: "配備強大扭力之液壓馬達，確保高硬度膠料迅速均勻進料。具備靈活的模具適應性，適合形狀複雜的工業產品生產。",
      features: [
        "強力進料：確保硬度高之膠料均勻進料",
        "合理螺桿設計：適用於處理多種不同類型膠料",
        "生產效率：具備快速生產循環時間",
        "卓越穩定：保證注射過程中的均勻性與質量穩定"
      ],
      specs: [
        { label: "規格 / 型號", values: ["TRH-100", "TRH-155", "TRH-210", "TRH-260", "TRH-330", "TRH-395", "TRH-440", "TRH-550", "TRH-660", "TRH-880", "TRH-1100"] },
        { label: "鎖模力 (TON)", values: ["100", "155", "210", "260", "330", "395", "440", "550", "660", "880", "1100"] },
        { label: "注射容積 (CC)", values: ["1000", "1250", "2000", "2500", "3000", "4000", "5000", "8000", "15000", "18000", "25000"] },
        { label: "熱板尺寸 (MM)", values: ["450*450", "500*500", "550*550", "600*600", "650*650", "700*700", "750*750", "850*850", "950*950", "1100*1100", "1300*1300"] },
        { label: "最小模厚 (MM)", values: ["50", "50", "100", "100", "100", "100", "150", "200", "200", "200", "200"] },
        { label: "總功率 (KW)", values: ["18", "22", "26", "27", "36", "37", "39", "45", "50", "62", "80"] }
      ]
    },
    {
      id: "vertical",
      title: "立式橡(矽)膠射出成型機",
      model: "TRV 系列",
      image: "/images/products/trv.jpg",
      desc: "採用先入料膠料注射系統，實現先進先出的模腔注射，操作簡單穩定。配備 PLC 可編程控制系統，精密調節壓力與流量。",
      features: [
        "PLC 控制：三段注射壓力與流量調節，三段保壓功能",
        "靈活性高：能夠處理各種矽橡膠產品，適應不同需求",
        "品質穩定：確保產品在製造過程中的一致性",
        "典型應用：汽車、電力、醫療、電子等高要求成型製品"
      ],
      specs: [
        { label: "型號 / 規格", values: ["TRV-100", "TRV-155", "TRV-210", "TRV-260", "TRV-330", "TRV-395", "TRV-440", "TRV-550"] },
        { label: "鎖模力 (TON)", values: ["100", "155", "210", "260", "330", "395", "440", "550"] },
        { label: "注射容積 (CC)", values: ["300", "600", "1500", "2000", "2500", "3000", "5000", "8000"] },
        { label: "熱板尺寸 (MM)", values: ["450*450", "500*500", "550*550", "600*600", "650*650", "700*700", "750*750", "850*850"] },
        { label: "重量 (T)", values: ["4", "5", "7.5", "8", "10", "11", "12", "15"] }
      ]
    },
    {
      id: "lsr",
      title: "液態矽膠 LSR 射出成型機",
      model: "TGV 系列",
      image: "/images/products/tgv.jpg",
      desc: "採用油研 (Yuken) 頂級配件與 LSR 專用料管組。色漿混配數位化，精確度達 0.1%，加料計量精密，專為液態矽膠高質量生產設計。",
      features: [
        "數位化混配：色漿混合精確度高達 0.1%",
        "高品質配件：採用油研油泵、比例閥及電磁閥",
        "精密計量：特殊加料設計確保精密配方成分",
        "應用領域：醫療矽膠、電子精密密封件等"
      ],
      specs: [
        { label: "型號 / 規格", values: ["TGV-65", "TGV-100", "TGV-125", "TGV-155"] },
        { label: "鎖模力 (TON)", values: ["65", "100", "125", "155"] },
        { label: "注射容積 (CC)", values: ["176", "223", "254", "314"] },
        { label: "熱板尺寸 (MM)", values: ["500*500", "600*600", "600*600", "700*700"] },
        { label: "總功率 (KW)", values: ["7.5", "11", "11", "15"] }
      ]
    }
  ],
  press: [
    {
      id: "tfs",
      title: "熱壓成型機系列",
      model: "TFS 系列",
      image: "/images/products/tfs.jpg",
      desc: "採用雙動力、雙油泵獨立設計。兩軸完全獨立工作，具備慢速校模功能，適用於各類電子零件、硫化成型產品。",
      features: [
        "獨立雙軸：可實現複雜模具運動和控制",
        "安全校模：具備慢速校模功能，操作更精確",
        "應用廣泛：O型環、油封、鍵盤、滾筒、防震墊片"
      ],
      specs: [
        { label: "規格 / 型號", values: ["TFS-100", "TFS-160", "TFS-210", "TFS-260", "TFS-330", "TFS-395", "TFS-440"] },
        { label: "鎖模力 (TON)", values: ["100", "160", "210", "260", "330", "395", "440"] },
        { label: "主缸行程 (MM)", values: ["250", "250", "250", "250", "250", "300", "400"] },
        { label: "熱板尺寸 (MM)", values: ["450*450", "500*500", "550*550", "600*600", "650*650", "700*700", "750*800"] },
        { label: "總功率 (KW)", values: ["29", "38", "49", "50", "61", "63", "68"] }
      ]
    },
    {
      id: "tvs",
      title: "真空熱壓成型機系列",
      model: "TVS 系列",
      image: "/images/products/tvs.jpg",
      desc: "高負壓真空罩設計，4 秒內即可完成 -650mmHg 以上之真空度。為模具提供接近完全真空環境，解決模具排氣難題。",
      features: [
        "極速真空：提高排氣性能，避免成品氣泡",
        "精密邊緣：尤其適合外觀美觀、精密之邊緣應用",
        "推薦產品：醫療藥蓋、導電用品、高單價橡膠精品"
      ],
      specs: [
        { label: "規格 / 型號", values: ["TVS-100", "TVS-160", "TVS-210", "TVS-260", "TVS-330", "TVS-395", "TVS-440"] },
        { label: "鎖模力 (TON)", values: ["100", "160", "210", "260", "330", "395", "440"] },
        { label: "主缸行程 (MM)", values: ["250", "250", "250", "250", "250", "250", "400"] },
        { label: "上熱板尺寸 (MM)", values: ["450*450", "500*500", "500*500", "600*600", "650*650", "700*700", "800*800"] },
        { label: "重量 (T)", values: ["6", "7", "7.6", "10", "11.6", "13", "17"] }
      ]
    }
  ],
  peripheral: [
    {
      id: "rsd",
      title: "橡矽膠毛邊機",
      model: "RSD 系列",
      image: "/images/products/rsd.jpg",
      desc: "利用空氣動力及離心力原理。單機可抵 20-40 人手工拆邊效率，適用於密封圈等橡膠精密成型後處理。",
      features: [
        "高效產能：單機效率提升 20-40 倍",
        "拆除直徑：可處理直徑 3-150mm 之製品",
        "材料適用：砂膠、橡膠、丁腈膠、氟橡膠"
      ],
      specs: [
        { label: "型號 / 單位", values: ["RSD-320", "RSD-377", "RSD-500", "RSD-600"] },
        { label: "容器直徑 (MM)", values: ["320", "377", "500", "600"] },
        { label: "電機功率 (KW)", values: ["1.5", "5.5", "7.5", "7.5"] },
        { label: "機器效率 (KG)", values: ["0.3-0.7", "3-4", "5-7", "6-8"] }
      ]
    },
    {
      id: "sorting",
      title: "空氣篩選與上升系統",
      model: "APM / LM 系列",
      image: "/images/products/sorting.jpg",
      desc: "利用空氣動力分離產品與毛屑，確保潔淨度要求。上升機實現自動輸送，大幅減少人工搬運。",
      features: [
        "風量調整：依產品比重調整風量以達到最佳分離",
        "不銹鋼結構：APM540 採用潔淨不銹鋼機身",
        "自動串接：LM-500 可自動輸送，與篩選機一體化"
      ],
      specs: [
        { label: "型號", values: ["APM540 (風選機)", "LM-500 (上升機)"] },
        { label: "動力參數", values: ["2.2 KW (風機)", "120 W (電機)"] },
        { label: "其他數據", values: ["300 KG 重量", "≤ 50 轉/分"] }
      ]
    },
    {
      id: "ras",
      title: "自動稱重切料機",
      model: "RAS 系列",
      image: "/images/products/ras.jpg",
      desc: "設備具有自動稱重、補償與選別功能。採用 PLC 稱重模塊與伺服馬達驅動進給，切料穩定且精確度高。",
      features: [
        "智能選別：自動區分合格與不合格重量之料塊",
        "操作簡便：7 吋觸控螢幕，設定簡單便捷",
        "伺服系統：稱量穩定性優異，使用壽命長"
      ],
      specs: [
        { label: "核心配置", values: ["PLC 稱重模塊", "伺服馬達進給", "7 吋觸控螢幕"] },
        { label: "關鍵功能", values: ["自動補償", "自動選別", "稱量計算"] }
      ]
    },
    {
      id: "rcm",
      title: "長度重量切料機",
      model: "RCM 系列",
      image: "/images/products/rcm.jpg",
      desc: "具備長度與重量雙切換模式。採用伺服馬達精控進料，適合橡膠片、EVA、鋁片等多種板材切割。",
      features: [
        "多模式：切割長度與重量模式可自由切換",
        "精準控制：伺服馬達確保運行穩定與高精確度",
        "自動報警：參數與數量皆可設定並具自動警示功能"
      ],
      specs: [
        { label: "型號 / 單位", values: ["RCM-600", "RCM-800", "RCM-1000"] },
        { label: "切割寬度 (MM)", values: ["≤ 570", "≤ 770", "≤ 970"] },
        { label: "板厚 (MM)", values: ["≤ 12", "≤ 12", "≤ 12"] },
        { label: "切割速度 (MIN)", values: ["≤ 70 / MIN", "≤ 70 / MIN", "≤ 70 / MIN"] }
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
    <div className="min-h-screen bg-white text-gray-900 selection:bg-red-100 overflow-x-hidden">
      
      {/* 導航欄 (Navbar) */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              {/* 優化過的 Logo 容器 - 改為讀取本地圖片 */}
              <div className="h-14 w-14 flex items-center justify-center mr-4">
                <img 
                  src="/images/logo.png" 
                  alt="TON TEIH Logo" 
                  className="max-h-full max-w-full rotate-90 object-contain"
                  loading="eager"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.innerHTML = '<span class="text-red-600 font-bold">TT</span>';
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="text-lg md:text-xl font-black text-red-600 tracking-tight block truncate">東鐵工程有限公司</span>
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

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 shadow-xl">
            <div className="flex flex-col space-y-4 p-4">
              <a href="#injection" onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-700">射出成型</a>
              <a href="#press" onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-700">熱壓系列</a>
              <a href="#peripheral" onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-700">週邊設備</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="font-bold text-red-600">聯繫我們</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">全方位橡矽膠成型解決方案</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">追求卓越品質，提供高效、穩定的生產設備與技術支援</p>
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
          <div className="space-y-32">
            {productData.injection.map((p) => (
              <div key={p.id} className="scroll-mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
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
                        <Settings className="text-gray-400 mb-4 animate-spin-slow" size={48} />
                        <p className="text-gray-400 font-bold">{p.title} 示意圖</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 規格表格 */}
                <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-gray-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left whitespace-nowrap">規格項目 (單位)</th>
                        {p.specs[0].values.map((modelName, i) => (
                          <th key={i} className="px-6 py-4 whitespace-nowrap min-w-[120px]">{modelName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {p.specs.slice(1).map((spec, i) => (
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
        <section id="press" className="scroll-mt-24 py-16 bg-gray-50 -mx-4 px-4 rounded-3xl border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-16">
              <Layers className="text-red-600 mr-4" size={32} />
              <h2 className="text-3xl font-black tracking-tight">熱壓與真空熱壓系列</h2>
            </div>
            <div className="space-y-32">
              {productData.press.map((p) => (
                <div key={p.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-bold text-red-600 mb-4">{p.title}</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed">{p.desc}</p>
                      <ul className="space-y-3 mb-8">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-center text-sm font-medium">
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-3" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {p.image && (
                      <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="max-h-64 object-contain rounded-xl hover:scale-105 transition duration-500" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=圖片載入失敗';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {/* 熱壓規格表格 */}
                  <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-red-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left">規格 / 型號</th>
                          {p.specs[0].values.map((modelName, i) => (
                            <th key={i} className="px-6 py-4 whitespace-nowrap min-w-[120px]">{modelName}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {p.specs.slice(1).map((spec, i) => (
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
          </div>
        </section>

        {/* 3. 週邊設備 */}
        <section id="peripheral" className="scroll-mt-24">
          <div className="flex items-center mb-16">
            <Cpu className="text-red-600 mr-4" size={32} />
            <h2 className="text-3xl font-black tracking-tight">自動化週邊設備</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productData.peripheral.map((p) => (
              <div key={p.id} className="p-8 bg-white border rounded-2xl hover:border-red-600 transition-all hover:shadow-2xl group flex flex-col">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  {p.id === 'rsd' ? <Trash2 size={24} /> : p.id === 'sorting' ? <ArrowUpCircle size={24} /> : <Ruler size={24} />}
                </div>
                <h4 className="text-xl font-bold mb-1">{p.title}</h4>
                <p className="text-xs font-bold text-red-600 mb-4 tracking-widest">{p.model}</p>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-grow">{p.desc}</p>
                
                {/* 產品圖顯示 (若有) */}
                {p.image && (
                  <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 border h-40 flex items-center justify-center">
                    <img src={p.image} alt={p.title} className="max-h-full object-contain p-2" />
                  </div>
                )}
                
                {/* 週邊規格微型表格 */}
                <div className="pt-6 border-t border-gray-100">
                   <div className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">技術規格一覽</div>
                   <div className="space-y-3">
                     {p.specs.map((s, i) => (
                       <div key={i} className="flex flex-col">
                         <span className="text-[11px] font-bold text-gray-400 mb-1">{s.label}</span>
                         <span className="text-xs font-bold text-gray-800">{s.values.join(' / ')}</span>
                       </div>
                     ))}
                   </div>
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
                <div className="flex items-center text-red-500 mr-4 mt-1"><Factory size={20} /></div>
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
                <p className={`text-center font-bold mt-4 p-4 rounded-xl shadow-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
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