import { MetadataRoute } from 'next'

/**
 * 這份檔案會由 Next.js 自動編譯為 /sitemap.xml
 * 幫助 Google 爬蟲了解網頁的更新頻率與權重
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 提醒：若您尚未完成域名綁定，測試時可暫時改回 .vercel.app 網址
  // 但正式上線與提交 Search Console 時，必須使用您的正式網域
  const baseUrl = 'https://www.tonteih.com'

  return [
    {
      url: baseUrl,               // 網站首頁網址
      lastModified: new Date(),   // 最後修改時間（顯示為當前時間）
      changeFrequency: 'monthly', // 告知 Google 內容大約每月更新一次
      priority: 1.0,              // 權重最高 (1.0 代表首頁)
    },
    // 如果未來增加了 /about 或 /products 獨立分頁，請在此處繼續新增物件
  ]
}