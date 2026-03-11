"use server";

// src/lib/api/sheets.ts
import { SCRIPT_URL } from "../constants";
import { TradingItem } from "@/lib/types";

/**
 * 取得二手設備清單
 */
export async function getUsedEquipments(): Promise<TradingItem[]> {
    try {
        const res = await fetch(SCRIPT_URL, {
            method: "GET",
            next: { revalidate: 0 }, // ISR: 將 60 秒改為 0 (不快取)，確保上架後能馬上看到更新
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch used equipments: ${res.status}`);
        }

        const json = await res.json();
        if (json.success && json.data) {
            // mapping GS 回傳的中文資料到 TypeScript 介面
            return json.data.map((row: Record<string, string | number | boolean>) => {
                let specsObj = {};
                try {
                    specsObj = row["規格JSON"] ? JSON.parse(String(row["規格JSON"])) : {};
                } catch (e) {
                    console.warn("Failed to parse specs JSON", e);
                }

                return {
                    id: row["內部編號"],
                    name: row["機台名稱"],
                    brand: row["品牌"],
                    model: row["機型(Model)"],
                    year: parseInt(String(row["年份"])) || 2020,
                    category: row["分類"],
                    location: row["所在地"],
                    price: parseInt(String(row["參考售價"])) || 0,
                    currency: "TWD",
                    hoursUsed: parseInt(String(row["使用時數"])) || 0,
                    controller: row["控制器"],
                    pumpSystem: row["油壓系統"],
                    inspectionScore: parseInt(String(row["技術評分"])) || 0,
                    thumbnail:
                        String(row["縮圖連結"]).startsWith("http") || String(row["縮圖連結"]).startsWith("/")
                            ? String(row["縮圖連結"])
                            : "/images/products/product-1.png",
                    gallery: [String(row["縮圖連結"])],
                    isOfficial: row["官方認證"] === "TRUE" || row["官方認證"] === true,
                    tradingStatus: String(row["狀態"]) as TradingItem["tradingStatus"],
                    specs: specsObj as TradingItem["specs"],
                } as TradingItem;
            });
        }

        return [];
    } catch (error) {
        console.error("Error fetching used equipments:", error);
        return [];
    }
}

/**
 * 以 ID 取得單一機台資料
 */
export async function getMachineById(id: string): Promise<TradingItem | null> {
    const machines = await getUsedEquipments();
    return machines.find((m) => m.id === id) ?? null;
}

/**
 * 向內部上架專屬端點送出新機台資料 (Server Action 可使用此函式)
 */
export async function uploadUsedEquipment(payload: Record<string, unknown>) {
    try {
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, action: "upload" }),
            redirect: "follow", // 重要: GAS POST 會觸發重導向
        });

        if (!res.ok) throw new Error("Upload failed");
        return { success: true };
    } catch (error) {
        console.error("Error uploading equipment:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
