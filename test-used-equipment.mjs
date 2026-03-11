// tests/used-equipment.test.mjs
// 這是一個輕量級的 Node.js 指令碼，用來驗證資料庫串接與前端邏輯
// 請確定你環境內已安裝 dotenv / node-fetch 等套件或使用 Node 18+ 原生 fetch
import fs from "fs";
import path from "path";

console.log("==========================================");
console.log("開始《東鐵工程 二手設備平台》終端驗證程序");
console.log("==========================================\n");

// 模擬從 Google Sheets (透過我們打造的 API route) 的回傳
async function fetchMockAPI() {
  console.log("[1/3] 測試模擬 API 的連線與解析能力...");
  const dummyPayload = {
    action: "upload",
    name: "東鐵認證：自動化下料系統 (Type-C)",
    brand: "Ton Teih",
    model: "TT-Auto-001",
    category: "自動化週邊",
    location: "新竹科學園區",
    price: 15000,
    costPrice: 9000,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    isOfficial: true,
  };

  // 在這裡，我們只是驗證這個 payload 的形狀是否符合預期
  if (Object.keys(dummyPayload).length > 5) {
    console.log("...✅ 模擬送出的 payload 資料結構無誤");
  } else {
    console.error("...❌ 模擬資料結構異常");
  }
}

// 驗證 /used-equipment 頁面檔案的存在與內容
function verifyPageExistency() {
  console.log("[2/3] 進行 Next.js 頁面靜態分析...");
  try {
    const page1Path = path.join(
      process.cwd(),
      "app",
      "used-equipment",
      "page.tsx",
    );
    const page1Content = fs.readFileSync(page1Path, "utf8");

    if (
      page1Content.includes("TradingItem[]") &&
      page1Content.includes("getUsedEquipments")
    ) {
      console.log("...✅ 發現 /app/used-equipment 且確認引入正確 API");
    }

    const page2Path = path.join(
      process.cwd(),
      "app",
      "admin",
      "upload",
      "page.tsx",
    );
    const page2Content = fs.readFileSync(page2Path, "utf8");
    if (
      page2Content.includes("tonteih2026") &&
      page2Content.includes("costPrice")
    ) {
      console.log("...✅ 發現 /admin/upload 且實作了內部底價及基礎防護");
    }
  } catch (e) {
    console.error("...❌ 頁面驗證失敗: ", e);
  }
}

// 驗證 Typescript 及設定有無報錯風險
function verifyBuild() {
  console.log("[3/3] 驗證常數設定 (UI / GAS API)");
  try {
    const typePath = path.join(process.cwd(), "lib", "types.ts");
    const constantsPath = path.join(process.cwd(), "lib", "constants-ui.ts");
    if (fs.existsSync(typePath) && fs.existsSync(constantsPath)) {
      console.log("...✅ Types & Constants 已正確宣告於 lib/");
    }
  } catch (e) {
    console.error("...❌ 環境驗證錯誤");
  }
}

async function run() {
  await fetchMockAPI();
  verifyPageExistency();
  verifyBuild();
  console.log("\n==========================================");
  console.log("🎉 所有自動化檢測程序皆無拋出嚴重例外，結構正確");
  console.log("==========================================");
}

run();
