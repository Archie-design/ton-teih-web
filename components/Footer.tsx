import React from "react";

export default function Footer() {
    return (
        <footer className="bg-black py-12 text-center border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-slate-500 text-[14px] font-black uppercase tracking-[0.4em] mb-4">
                    © 2026 東鐵工程有限公司 TON TEIH. ALL RIGHTS RESERVED.{" "}
                </p>
                <div className="text-slate-400 text-[16px] font-bold space-x-4">
                    <span>統一編號: 66450110</span>
                </div>
            </div>
        </footer>
    );
}
