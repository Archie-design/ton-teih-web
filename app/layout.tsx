import './globals.css';
import { Metadata } from 'next';

/**
 * 全站 Metadata 設定
 * 加入 canonical 標籤能幫助 Google 確定標準網址，解決「重複頁面未編入索引」的問題
 */
export const metadata: Metadata = {
  title: '東鐵工程有限公司 - TON TEIH | 專業橡矽膠成型設備專家',
  description: '東鐵工程提供全方位橡矽膠成型解決方案，包含 FIFO 先進先出射出機、臥式/立式射出機、真空熱壓成型機及自動化週邊設備。',

  // 設定標準網域基底
  metadataBase: new URL('https://www.tonteih.com'),

  // 宣告標準網址 (Canonical URL)
  alternates: {
    canonical: '/',
  },

  // Google Search Console 驗證碼
  verification: {
    google: 'kp6O4EhbWhtR37eTZteEE71_3NtsXufLXOCeP3RM-Ls',
  },

  // 增加關鍵字優化搜尋排名
  keywords: ['橡膠射出機', 'FIFO 射出機', '矽膠成型機', '東鐵工程', 'TON TEIH'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}