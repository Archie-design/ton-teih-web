import './globals.css';
import { Metadata } from 'next';

/**
 * 全站 Metadata 設定
 * 加入 canonical 標籤能幫助 Google 確定標準網址，解決「重複頁面未編入索引」的問題
 */
export const metadata: Metadata = {
  title: '東鐵工程有限公司 - TON TEIH | 專業橡矽膠成型設備專家',
  description: '東鐵工程提供全方位橡矽膠成型解決方案，包含 FIFO 先進先出射出機、臥式/立式射出機、真空熱壓成型機及自動化週邊設備。',
  metadataBase: new URL('https://www.tonteih.com'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'kp6O4EhbWhtR37eTZteEE71_3NtsXufLXOCeP3RM-Ls',
  },
  keywords: ['橡膠射出機', 'FIFO 射出機', '矽膠成型機', '東鐵工程', 'TON TEIH'],
  // SEO & AEO/GEO 強化配置
  openGraph: {
    title: '東鐵工程有限公司 - TON TEIH',
    description: '全方位橡矽膠成型解決方案，包含 FIFO 先進先出射出機、真空熱壓成型機及自動化週邊設備。',
    url: 'https://www.tonteih.com',
    siteName: '東鐵工程有限公司',
    locale: 'zh_TW',
    type: 'website',
  },
  publisher: '東鐵工程有限公司',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD 結構化資料 (AEO/GEO 的核心，讓 AI 搜尋引擎理解實體)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "東鐵工程有限公司 (TON TEIH)",
  "url": "https://www.tonteih.com",
  "logo": "https://www.tonteih.com/images/logo.png",
  "description": "專業橡矽膠成型機制設備製造與供應商，提供FIFO射出機、臥式/立式射出機及熱壓真空機。",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+886-973-357-788",
    "contactType": "customer service",
    "email": "h0973357788@gmail.com",
    "availableLanguage": "Traditional Chinese"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "林口區",
    "addressRegion": "新北市",
    "postalCode": "244",
    "streetAddress": "公園路165號12樓",
    "addressCountry": "TW"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased font-sans">
        {/* 注入 JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}