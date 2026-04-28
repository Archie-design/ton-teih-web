"use server";

import { cookies } from "next/headers";
import { getDb } from "@/lib/db/neon";
import { machines, subscribers } from "@/lib/db/schema";
import { desc, ne, eq, and } from "drizzle-orm";
import { verifySessionToken } from "@/lib/auth";
import { convertDriveUrl } from "@/lib/utils/drive";
import type { TradingItem } from "@/lib/types";

// 公開欄位（排除 costPrice）
const publicMachineColumns = {
  id: machines.id,
  name: machines.name,
  brand: machines.brand,
  model: machines.model,
  year: machines.year,
  price: machines.price,
  currency: machines.currency,
  location: machines.location,
  category: machines.category,
  description: machines.description,
  hoursUsed: machines.hoursUsed,
  controller: machines.controller,
  pumpSystem: machines.pumpSystem,
  isOfficial: machines.isOfficial,
  inspectionScore: machines.inspectionScore,
  thumbnail: machines.thumbnail,
  gallery: machines.gallery,
  tradingStatus: machines.tradingStatus,
  specs: machines.specs,
  isActive: machines.isActive,
  createdAt: machines.createdAt,
} as const;

function mapRow(r: typeof publicMachineColumns extends infer T ? { [K in keyof T]: unknown } : never): TradingItem {
  const row = r as {
    id: string; name: string; brand: string; model: string; year: number;
    price: number; currency: string; location: string; category: string;
    description: string; hoursUsed: number; controller: string; pumpSystem: string;
    isOfficial: boolean; inspectionScore: number; thumbnail: string;
    gallery: string[]; tradingStatus: string; specs: Record<string, string>;
    isActive: boolean; createdAt: Date;
  };
  return {
    id: row.id,
    name: row.name || "",
    brand: row.brand || "",
    model: row.model || "",
    year: row.year || 2020,
    category: row.category || "",
    location: row.location || "",
    price: row.price || 0,
    currency: row.currency || "TWD",
    description: row.description || "",
    hoursUsed: row.hoursUsed || 0,
    controller: row.controller || "",
    pumpSystem: row.pumpSystem || "",
    isOfficial: row.isOfficial || false,
    inspectionScore: row.inspectionScore || 0,
    thumbnail:
      row.thumbnail && (row.thumbnail.startsWith("http") || row.thumbnail.startsWith("/"))
        ? row.thumbnail
        : "/images/products/product-1.png",
    gallery: row.gallery?.length ? row.gallery : (row.thumbnail ? [row.thumbnail] : []),
    tradingStatus: row.tradingStatus || "待售",
    specs: row.specs || {},
  };
}

export async function getUsedEquipments(): Promise<TradingItem[]> {
  try {
    const rows = await getDb()
      .select(publicMachineColumns)
      .from(machines)
      .where(ne(machines.isActive, false))
      .orderBy(desc(machines.createdAt));
    return rows.map(mapRow);
  } catch (error) {
    console.error("Error fetching used equipments:", error);
    return [];
  }
}

export async function getMachineById(id: string): Promise<TradingItem | null> {
  try {
    const rows = await getDb()
      .select(publicMachineColumns)
      .from(machines)
      .where(and(eq(machines.id, id), ne(machines.isActive, false)))
      .limit(1);
    if (!rows.length) return null;
    return mapRow(rows[0]);
  } catch (error) {
    console.error("Error fetching machine:", error);
    return null;
  }
}

export async function getRelatedMachines(
  excludeId: string,
  category: string,
  limit = 3,
): Promise<TradingItem[]> {
  try {
    const rows = await getDb()
      .select(publicMachineColumns)
      .from(machines)
      .where(
        and(
          eq(machines.category, category),
          ne(machines.id, excludeId),
          ne(machines.isActive, false),
        ),
      )
      .orderBy(desc(machines.createdAt))
      .limit(limit);
    return rows.map(mapRow);
  } catch (error) {
    console.error("Error fetching related machines:", error);
    return [];
  }
}

export async function uploadUsedEquipment(payload: Record<string, unknown>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const secret = process.env.ADMIN_PASSWORD;
  if (!token || !secret || !await verifySessionToken(token, secret)) {
    throw new Error("Unauthorized");
  }

  try {
    const thumbnail = convertDriveUrl(String(payload.thumbnail || ""));
    const galleryRaw = Array.isArray(payload.gallery) ? payload.gallery as string[] : [];
    const gallery = galleryRaw.map((u) => convertDriveUrl(u)).filter(Boolean);
    const specsRaw = payload.specs;
    const specs: Record<string, string> =
      typeof specsRaw === "string"
        ? (() => { try { return JSON.parse(specsRaw); } catch { return {}; } })()
        : (specsRaw as Record<string, string>) || {};

    const rows = await getDb()
      .insert(machines)
      .values({
        name: String(payload.name || ""),
        brand: String(payload.brand || ""),
        model: String(payload.model || ""),
        year: Number(payload.year) || new Date().getFullYear(),
        category: String(payload.category || ""),
        location: String(payload.location || ""),
        price: Number(payload.price) || 0,
        costPrice: Number(payload.costPrice) || 0,
        hoursUsed: Number(payload.hoursUsed) || 0,
        controller: String(payload.controller || ""),
        pumpSystem: String(payload.pumpSystem || ""),
        isOfficial: payload.isOfficial === true || payload.isOfficial === "true",
        inspectionScore: Number(payload.inspectionScore) || 0,
        thumbnail,
        gallery,
        tradingStatus: String(payload.tradingStatus || "待售"),
        specs,
        isActive: true,
      })
      .returning({ id: machines.id });

    const id = rows[0].id;

    notifySubscribers(
      String(payload.name || ""),
      id,
      String(payload.category || ""),
    ).catch(() => {});

    return { success: true, id };
  } catch (error) {
    console.error("Error uploading equipment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ─── 訂閱者管理 ──────────────────────────────────────────────────────────────

export async function addSubscriber(email: string): Promise<{ success: boolean; duplicate?: boolean }> {
  try {
    const rows = await getDb()
      .insert(subscribers)
      .values({ email, isActive: true })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ id: subscribers.id });

    if (!rows.length) return { success: true, duplicate: true };
    return { success: true };
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return { success: false };
  }
}

export async function getActiveSubscribers(): Promise<string[]> {
  try {
    const rows = await getDb()
      .select({ email: subscribers.email })
      .from(subscribers)
      .where(eq(subscribers.isActive, true));
    return rows.map((r) => r.email);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}

async function notifySubscribers(machineName: string, machineId: string, category: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const emails = await getActiveSubscribers();
  if (emails.length === 0) return;

  const url = `https://www.tonteih.com/used-equipment/${machineId}`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
      <p style="font-size:11px;font-weight:700;letter-spacing:4px;color:#DC2626;text-transform:uppercase;margin-bottom:16px">TON TEIH — 新機到貨通知</p>
      <h1 style="font-size:22px;font-weight:900;color:#111;margin-bottom:8px">${machineName}</h1>
      <p style="color:#64748b;font-size:14px;margin-bottom:24px">分類：${category}</p>
      <a href="${url}" style="display:inline-block;background:#DC2626;color:#fff;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:8px;text-decoration:none">查看設備詳情</a>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0">
      <p style="font-size:11px;color:#94a3b8">您收到此信是因為您訂閱了東鐵工程新機到貨通知。</p>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "東鐵工程 <notify@tonteih.com>",
      to: "notify@tonteih.com",
      bcc: emails,
      subject: `【新機到貨】${machineName}`,
      html,
    }),
  }).catch((e) => console.warn("Subscriber notification failed:", e));
}
