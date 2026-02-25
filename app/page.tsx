'use client';

import React, { useState } from 'react';
import {
  Settings, Zap, CheckCircle, Factory,
  MapPin, Phone, Mail, Cpu,
  Layers, Ruler, Trash2, ArrowUpCircle, Menu, X, ChevronDown
} from 'lucide-react';

import Image from 'next/image';
import { productData } from '@/lib/constants';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', msg: '' });

  // 跳回頂部處理函式
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', msg: '' });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Submission failed');

      setSubmitStatus({ type: 'success', msg: '感謝您的諮詢！我們將儘快與您聯繫。' });
      form.reset();
      setTimeout(() => setSubmitStatus({ type: '', msg: '' }), 5000);
    } catch (err) {
      console.error('Submission error:', err);
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
            {/* Logo 與公司名區域：點擊可回到頂部 */}
            <a
              href="#"
              onClick={scrollToTop}
              className="flex items-center group cursor-pointer"
              aria-label="回到首頁頂部"
            >
              <div className="h-12 w-12 flex items-center justify-center mr-3 relative">
                <Image
                  src="/images/logo.png"
                  alt="TON TEIH"
                  fill
                  sizes="48px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="min-w-0">
                <span className="text-lg md:text-xl font-black text-red-600 tracking-tight block truncate group-hover:text-red-700 transition-colors">東鐵工程有限公司</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">TON TEIH</span>
              </div>
            </a>

            <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-600">
              <a href="#injection" className="hover:text-red-600 transition">射出成型</a>
              <a href="#press" className="hover:text-red-600 transition">熱壓系列</a>
              <a href="#peripheral" className="hover:text-red-600 transition">週邊設備</a>
              <a href="#contact" className="bg-red-600 text-white px-5 py-2.5 rounded hover:bg-red-700 transition shadow-sm shadow-red-200">
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
          <Image src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=2000" fill sizes="100vw" className="object-cover" alt="Background" priority />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-balance">全方位橡矽膠成型解決方案</h1>
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
                  <div className="order-2 lg:order-1">
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
                  <div className="order-1 lg:order-2 relative group overflow-hidden rounded-2xl border bg-gray-100 min-h-[300px] md:min-h-[400px] flex items-center justify-center shadow-inner">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
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
                      <div className="relative bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden h-64 border">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain p-4 rounded-xl hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-red-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left whitespace-nowrap">規格 / 型號</th>
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
                <p className="text-xs font-bold text-red-600 mb-4 tracking-widest uppercase">{p.model}</p>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-grow">{p.desc}</p>

                {p.image && (
                  <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-50 border h-40 flex items-center justify-center">
                    <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-2 hover:scale-110 transition duration-300" />
                  </div>
                )}

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
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">歡迎聯繫<br />技術諮詢</h2>
              <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium text-balance">
                東鐵工程提供從切割、射出到後處理的完整生產解決方案。如果您有特定機型需求或客製化專案，請填寫表單，我們將在 24 小時內與您聯繫。
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

          <div className="bg-white p-10 rounded-3xl shadow-2xl text-gray-900 border border-gray-100">
            <h4 className="text-2xl font-black mb-8 tracking-tighter">需求諮詢表單</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">您的姓名</label>
                  <input name="name" type="text" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">聯繫電話</label>
                  <input name="phone" type="tel" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">電子郵件</label>
                <input name="email" type="email" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">興趣產品類別</label>
                <div className="relative">
                  <select name="product" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none cursor-pointer appearance-none">
                    <option>射出成型機 (FIFO/臥式/立式)</option>
                    <option>液態矽膠 LSR 機器</option>
                    <option>熱壓 / 真空熱壓成型機</option>
                    <option>週邊設備 (毛邊/篩選/切料)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">您的需求描述</label>
                <textarea name="message" rows={4} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition" placeholder="例如：產品材料、預計產能需求..."></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-xl shadow-red-200 active:scale-95 flex items-center justify-center space-x-2"
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

      <footer className="bg-black py-12 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500 text-[14px] font-black uppercase tracking-[0.4em] mb-4">© 2026 東鐵工程有限公司 TON TEIH. ALL RIGHTS RESERVED. </p>
          <div className="text-gray-400 text-[16px] font-bold space-x-4">
            <span>統一編號: 66450110</span>
          </div>
        </div>
      </footer>
    </div>
  );
}