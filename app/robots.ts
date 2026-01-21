import { MetadataRoute } from 'next'

/**
 * 這份檔案會告訴搜尋引擎爬蟲哪些頁面可以抓取
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.tonteih.com' // 域名更換後請同步修改

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}