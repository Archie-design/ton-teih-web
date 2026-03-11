"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 滑動回頂端處理函式
    const handleLogoClick = () => {
        if (typeof window !== "undefined" && window.location.pathname === "/") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo 與公司名區域 */}
                    <Link
                        href="/"
                        onClick={handleLogoClick}
                        className="flex items-center group cursor-pointer"
                        aria-label="回到首頁"
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
                            <span className="text-lg md:text-xl font-black text-red-600 tracking-tight block truncate group-hover:text-red-700 transition-colors">
                                東鐵工程有限公司
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                TON TEIH
                            </span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-bold text-slate-600">
                        <Link href="/#injection" className="hover:text-red-600 transition">
                            射出系列
                        </Link>
                        <Link href="/#press" className="hover:text-red-600 transition">
                            熱壓系列
                        </Link>
                        <Link href="/#peripheral" className="hover:text-red-600 transition">
                            週邊設備
                        </Link>
                        <Link
                            href="/used-equipment"
                            className="hover:text-red-600 transition"
                        >
                            認證二手機交易
                        </Link>
                        <Link href="/#contact" className="hover:text-red-600 transition">
                            聯繫我們
                        </Link>
                        <Link
                            href="/used-equipment"
                            className="bg-red-600 text-white px-5 py-2.5 rounded hover:bg-red-700 transition shadow-sm shadow-red-200"
                        >
                            委託代理
                        </Link>
                    </div>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t p-4 shadow-xl">
                    <div className="flex flex-col space-y-4 p-4">
                        <Link
                            href="/#injection"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold text-slate-700"
                        >
                            射出系列
                        </Link>
                        <Link
                            href="/#press"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold text-slate-700"
                        >
                            熱壓系列
                        </Link>
                        <Link
                            href="/#peripheral"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold text-slate-700"
                        >
                            週邊設備
                        </Link>
                        <Link
                            href="/used-equipment"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold text-red-600"
                        >
                            認證二手機交易
                        </Link>
                        <Link
                            href="/#contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold text-slate-700"
                        >
                            聯繫我們
                        </Link>
                        <Link
                            href="/used-equipment"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-bold text-red-600"
                        >
                            委託代理
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
