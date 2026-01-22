import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

/**
 * 在這裡設定全站 SEO、關鍵字與 Google 驗證
 */
export const metadata: Metadata = {
  // 標題建議包含公司名與核心產品，有利於搜尋排名
  title: '東鐵工程有限公司 - TON TEIH | 專業橡矽膠成型設備專家',
  description: '東鐵工程提供全方位橡矽膠成型解決方案，包含 FIFO 先進先出射出機、臥式/立式射出機、真空熱壓成型機及自動化週邊設備。提供高效、穩定的工業生產支援。',
  
  // 增加關鍵字，幫助搜尋引擎精準分類
  keywords: ['橡膠射出機', '矽膠成型', 'FIFO 射出機', '熱壓成型機', '毛邊處理機', '東鐵工程', 'TON TEIH'],
  
  // Google Search Console 驗證碼
  verification: {
    google: 'kp6O4EhbWhtR37eTZteEE71_3NtsXufLXOCeP3RM-Ls', 
  },

  // 社群分享優化（當網址傳到 LINE、FB 時顯示的資訊）
  openGraph: {
    title: '東鐵工程有限公司 - TON TEIH',
    description: '全方位橡矽膠成型解決方案，提供高效、穩定的生產設備。',
    url: 'https://www.tonteih.com',
    siteName: '東鐵工程',
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>{children}</body>
    </html>
  );
}