import { MetadataRoute } from "next";
import { getUsedEquipments } from "@/lib/api/firestore";

const baseUrl = "https://www.tonteih.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 靜態路由
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/used-equipment`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/trade-in`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // 動態機台詳情頁（從 Firestore 讀取）
  let machineRoutes: MetadataRoute.Sitemap = [];
  try {
    const machines = await getUsedEquipments();
    machineRoutes = machines.map((m) => ({
      url: `${baseUrl}/used-equipment/${m.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Firestore 不可用時略過動態路由，不影響靜態 sitemap
  }

  return [...staticRoutes, ...machineRoutes];
}
