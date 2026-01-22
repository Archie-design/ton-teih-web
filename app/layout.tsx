import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

/**
 * 在這裡設定全站 SEO、關鍵字、Google 驗證以及網站圖示 (Icons)
 */
export const metadata: Metadata = {
  title: '東鐵工程有限公司 - TON TEIH | 專業橡矽膠成型設備專家',
  description: '東鐵工程提供全方位橡矽膠成型解決方案，包含 FIFO 先進先出射出機、臥式/立式射出機、真空熱壓成型機及自動化週邊設備。提供高效、穩定的工業生產支援。',
  
  keywords: ['橡膠射出機', '矽膠成型', 'FIFO 射出機', '熱壓成型機', '毛邊處理機', '東鐵工程', 'TON TEIH'],
  
  verification: {
    google: 'kp6O4EhbWhtR37eTZteEE71_3NtsXufLXOCeP3RM-Ls', 
  },

  // --- 網站圖示設定 ---
  // 當您將檔案放入 app/ 資料夾後，Next.js 其實會自動偵測
  // 但在此明確定義可以確保跨裝置（如 iPhone）的相容性更好
  icons: {
    icon: '/icon.png',           // 請確保 app/icon.png 存在
    shortcut: '/favicon.ico',    // 請確保 app/favicon.ico 存在
    apple: '/apple-icon.png',    // 請確保 app/apple-icon.png 存在
  },

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
      <head>
        {/* Next.js 會自動在這裡插入必要的 link 標籤 */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}