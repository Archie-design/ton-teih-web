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

    return { success: true, id: ref.id };
  } catch (error) {
    console.error("Error uploading equipment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function convertDriveUrl(url: string): string {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}
