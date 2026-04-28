import type { machines } from "@/lib/db/schema";

// 完整 DB row（含 costPrice、isActive、createdAt — 僅後台使用）
export type AdminMachine = typeof machines.$inferSelect;

// 前台公開視角：排除敏感／管理欄位，且 thumbnail 經 mapRow 處理過保證有值
export type TradingItem = Omit<AdminMachine, "costPrice" | "isActive" | "createdAt">;
