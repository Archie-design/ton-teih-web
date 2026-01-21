import { MetadataRoute } from 'next'

/**
 * 這份檔案會自動生成 sitemap.xml
 * 幫助 Google 索引您的網站內容
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 提醒：當您正式購買並綁定域名後，請將此處改為 https://www.tonteih.com
  const baseUrl = 'https://www.tonteih.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}