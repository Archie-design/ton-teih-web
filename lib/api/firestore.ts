"use server";

import { getDb } from "@/lib/firebase/admin";
import type { TradingItem } from "@/lib/types";

function mapDoc(id: string, d: FirebaseFirestore.DocumentData): TradingItem {
  return {
    id,
    name: d.name || "",
    brand: d.brand || "",
    model: d.model || "",
    year: d.year || 2020,
    category: d.category || "",
    location: d.location || "",
    price: d.price || 0,
    currency: "TWD",
    description: d.description || "",
    hoursUsed: d.hoursUsed || 0,
    controller: d.controller || "",
    pumpSystem: d.pumpSystem || "",
    isOfficial: d.isOfficial || false,
    inspectionScore: d.inspectionScore || 0,
    thumbnail:
      d.thumbnail && (d.thumbnail.startsWith("http") || d.thumbnail.startsWith("/"))
        ? d.thumbnail
        : "/images/products/product-1.png",
    gallery: d.thumbnail ? [d.thumbnail] : [],
    tradingStatus: d.tradingStatus || "待售",
    specs: d.specs || {},
  };
}

export async function getUsedEquipments(): Promise<TradingItem[]> {
  try {
    const db = getDb();
    const snapshot = await db
      .collection("machines")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs
      .filter((doc) => doc.data().isActive !== false)
      .map((doc) => mapDoc(doc.id, doc.data()));
  } catch (error) {
    console.error("Error fetching used equipments:", error);
    return [];
  }
}

export async function getMachineById(id: string): Promise<TradingItem | null> {
  try {
    const db = getDb();
    const doc = await db.collection("machines").doc(id).get();
    if (!doc.exists) return null;
    return mapDoc(doc.id, doc.data()!);
  } catch (error) {
    console.error("Error fetching machine:", error);
    return null;
  }
}

export async function uploadUsedEquipment(payload: Record<string, unknown>) {
  try {
    const db = getDb();
    const thumbnail = String(payload.thumbnail || "");
    // 自動轉換 Google Drive 分享連結
    const convertedThumb = convertDriveUrl(thumbnail);

    const ref = await db.collection("machines").add({
      name: payload.name || "",
      brand: payload.brand || "",
      model: payload.model || "",
      year: Number(payload.year) || new Date().getFullYear(),
      category: payload.category || "",
      location: payload.location || "",
      price: Number(payload.price) || 0,
      costPrice: Number(payload.costPrice) || 0,
      hoursUsed: Number(payload.hoursUsed) || 0,
      controller: payload.controller || "",
      pumpSystem: payload.pumpSystem || "",
      isOfficial:
        payload.isOfficial === true || payload.isOfficial === "true",
      inspectionScore: Number(payload.inspectionScore) || 0,
      thumbnail: convertedThumb,
      tradingStatus: payload.tradingStatus || "待售",
      specs:
        typeof payload.specs === "string"
          ? (() => {
              try {
                return JSON.parse(payload.specs as string);
              } catch {
                return {};
              }
            })()
          : payload.specs || {},
      isActive: true,
      createdAt: new Date(),
    });

    // 非同步通知訂閱者，不阻塞回應
    notifySubscribers(
      String(payload.name || ""),
      ref.id,
      String(payload.category || ""),
    ).catch(() => {});

    return { success: true, id: ref.id };
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
    const db = getDb();
    const existing = await db.collection("subscribers").where("email", "==", email).limit(1).get();
    if (!existing.empty) return { success: true, duplicate: true };
    await db.collection("subscribers").add({ email, createdAt: new Date(), isActive: true });
    return { success: true };
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return { success: false };
  }
}

export async function getActiveSubscribers(): Promise<string[]> {
  try {
    const db = getDb();
    const snapshot = await db.collection("subscribers").where("isActive", "==", true).get();
    return snapshot.docs.map((doc) => doc.data().email as string);
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
      to: emails,
      subject: `【新機到貨】${machineName}`,
      html,
    }),
  }).catch((e) => console.warn("Subscriber notification failed:", e));
}

function convertDriveUrl(url: string): string {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}
