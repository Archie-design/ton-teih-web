/**
 * 一次性資料遷移腳本：Google Sheets (GAS) → Firebase Firestore
 *
 * 使用方式：
 *   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' \
 *   GAS_URL='https://script.google.com/macros/s/AK...' \
 *   node scripts/migrate-sheets-to-firestore.mjs
 *
 * 環境變數：
 *   FIREBASE_SERVICE_ACCOUNT_JSON — 服務帳戶 JSON（整個 JSON 字串）
 *   GAS_URL                       — 現有 GAS Web App 部署 URL
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const GAS_URL = process.env.GAS_URL;

if (!serviceAccountJson) {
  console.error("❌ 缺少 FIREBASE_SERVICE_ACCOUNT_JSON 環境變數");
  process.exit(1);
}
if (!GAS_URL) {
  console.error("❌ 缺少 GAS_URL 環境變數");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountJson);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

function convertDriveUrl(url) {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://lh3.googleusercontent.com/d/${match[1]}`;
  return url;
}

console.log("📡 從 GAS 讀取機台資料...");
const res = await fetch(GAS_URL);
const json = await res.json();

if (!json.success || !json.data) {
  console.error("❌ GAS 回傳失敗：", json.message);
  process.exit(1);
}

const machines = json.data.filter((r) => r["內部編號"]);
console.log(`✅ 取得 ${machines.length} 台機台，開始批次寫入...`);

// Firestore 每批最多 500 筆
const BATCH_SIZE = 400;
let count = 0;

for (let i = 0; i < machines.length; i += BATCH_SIZE) {
  const batch = db.batch();
  const slice = machines.slice(i, i + BATCH_SIZE);

  for (const item of slice) {
    const ref = db.collection("machines").doc(); // 自動產生 ID
    const thumbnail = String(item["縮圖連結"] || "");
    let specs = {};
    try {
      specs = item["規格JSON"] ? JSON.parse(String(item["規格JSON"])) : {};
    } catch {
      specs = {};
    }

    batch.set(ref, {
      name: item["機台名稱"] || "",
      brand: item["品牌"] || "",
      model: item["機型(Model)"] || "",
      year: Number(item["年份"]) || 2020,
      category: item["分類"] || "",
      location: item["所在地"] || "",
      price: Number(item["參考售價"]) || 0,
      costPrice: 0, // 底價不透過前端 GAS 讀取，請手動補齊
      hoursUsed: Number(item["使用時數"]) || 0,
      controller: item["控制器"] || "",
      pumpSystem: item["油壓系統"] || "",
      isOfficial: item["官方認證"] === "TRUE" || item["官方認證"] === true,
      inspectionScore: Number(item["技術評分"]) || 0,
      thumbnail: convertDriveUrl(thumbnail),
      tradingStatus: item["狀態"] || "待售",
      specs,
      isActive: true,
      createdAt: new Date(),
    });
    count++;
  }

  await batch.commit();
  console.log(`  → 已寫入 ${Math.min(i + BATCH_SIZE, machines.length)}/${machines.length}`);
}

console.log(`\n🎉 遷移完成！共寫入 ${count} 台機台至 Firestore machines collection。`);
console.log("⚠️  注意：costPrice（內部底價）需手動在 Firebase Console 補齊。");
console.log("⚠️  GAS 的詢價紀錄 & 託售申請不在本腳本範圍內（歷史資料可選擇性遷移）。");
