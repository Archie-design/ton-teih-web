/**
 * 東鐵工程 — Google Apps Script 後端
 *
 * 工作頁結構（Google Sheets）：
 *   - Products_Used   ← 二手設備庫存（doGet 讀取 / admin 寫入）
 *   - Seller_Requests ← 客戶託售申請（/trade-in 寫入）
 *   - 詢價紀錄        ← 所有詢價 & 聯絡表單（首頁 / 機台詳情頁寫入）
 *
 * 部署設定：
 *   執行身分 → 以「我」的身分執行
 *   存取對象 → 所有人（包含匿名使用者）
 */

// ─── 設定區 ──────────────────────────────────────────────────────────────────

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

const SHEET = {
  PRODUCTS_USED: "Products_Used",
  SELLER_REQUESTS: "Seller_Requests",
  INQUIRIES: "詢價紀錄",
};

// Products_Used 欄位順序（對應試算表 A→Q 欄）
const PRODUCTS_USED_HEADERS = [
  "內部編號",     // A — 自動產生
  "機台名稱",     // B
  "品牌",         // C
  "機型(Model)",  // D
  "年份",         // E
  "分類",         // F
  "所在地",       // G
  "參考售價",     // H — 對外公開
  "內部底價",     // I — 不回傳前端
  "使用時數",     // J
  "控制器",       // K
  "油壓系統",     // L
  "官方認證",     // M — TRUE / FALSE
  "技術評分",     // N — 0~100
  "縮圖連結",     // O
  "狀態",         // P — 待售 / 預約看機 / 已售出
  "規格JSON",     // Q — JSON 字串（選填）
];

// ─── CORS 處理 ────────────────────────────────────────────────────────────────

function doOptions(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  )
    .setMimeType(ContentService.MimeType.JSON);
}

function corsResponse(output) {
  return output; // GAS Web App 本身不需額外設定 CORS header，由平台處理
}

// ─── GET：讀取二手設備公開清單 ────────────────────────────────────────────────

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET.PRODUCTS_USED);

    if (!sheet) {
      return jsonResponse({ success: false, message: "找不到工作頁 Products_Used" });
    }

    const [headers, ...rows] = sheet.getDataRange().getValues();

    // 過濾掉不對外公開的欄位
    const PRIVATE_COLUMNS = ["內部底價"];

    const data = rows
      .filter(row => row[0] !== "") // 跳過空白列
      .map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          if (!PRIVATE_COLUMNS.includes(header)) {
            obj[header] = row[i];
          }
        });
        return obj;
      });

    return jsonResponse({ success: true, data });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

// ─── POST：處理三種表單提交 ───────────────────────────────────────────────────

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // 1. 管理者上架機台
    if (payload.action === "upload") {
      return handleUpload(payload);
    }

    // 2. 客戶託售申請（/trade-in 頁面）
    if (payload.type === "seller_request") {
      return handleSellerRequest(payload);
    }

    // 3. 一般詢價 / 聯絡表單（首頁 & 機台詳情頁）
    return handleInquiry(payload);

  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

// ─── 處理：管理者上架機台 ─────────────────────────────────────────────────────

function handleUpload(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET.PRODUCTS_USED);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET.PRODUCTS_USED);
    sheet.appendRow(PRODUCTS_USED_HEADERS);
  }

  // 確認第一列是標題列
  const firstRow = sheet.getRange(1, 1, 1, PRODUCTS_USED_HEADERS.length).getValues()[0];
  if (firstRow[0] !== "內部編號") {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, PRODUCTS_USED_HEADERS.length).setValues([PRODUCTS_USED_HEADERS]);
  }

  // 自動產生內部編號：U-{6位亂數}
  const newId = "U-" + Math.floor(100000 + Math.random() * 900000);

  const newRow = [
    newId,
    data.name         || "",
    data.brand        || "",
    data.model        || "",
    data.year         || "",
    data.category     || "",
    data.location     || "",
    data.price        || 0,
    data.costPrice    || 0,
    data.hoursUsed    || 0,
    data.controller   || "",
    data.pumpSystem   || "",
    data.isOfficial   === true || data.isOfficial === "true" ? "TRUE" : "FALSE",
    data.inspectionScore || 0,
    data.thumbnail    || "",
    data.tradingStatus || "待售",
    data.specs        || "{}",
  ];

  sheet.appendRow(newRow);

  return jsonResponse({ success: true, id: newId, message: "機台已上架" });
}

// ─── 處理：客戶託售申請 ───────────────────────────────────────────────────────

const SELLER_REQUESTS_HEADERS = [
  "時間戳記",
  "姓名",
  "電話",
  "電子郵件",
  "機台品牌",
  "機型",
  "年份",
  "使用時數",
  "參考售價",
  "所在地",
  "機況說明",
  "處理狀態",   // 業務手動填寫：待聯繫 / 已聯繫 / 成交
];

function handleSellerRequest(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET.SELLER_REQUESTS);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET.SELLER_REQUESTS);
    sheet.appendRow(SELLER_REQUESTS_HEADERS);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    data.name             || "",
    data.phone            || "",
    data.email            || "",
    data.machineBrand     || "",
    data.machineModel     || "",
    data.machineYear      || "",
    data.machineHours     || "",
    data.machinePrice     || "",
    data.machineLocation  || "",
    data.machineCondition || "",
    "待聯繫",
  ]);

  return jsonResponse({ success: true, message: "託售申請已收到" });
}

// ─── 處理：詢價 / 聯絡表單 ───────────────────────────────────────────────────

const INQUIRIES_HEADERS = [
  "時間戳記",
  "姓名",
  "電話",
  "電子郵件",
  "詢問產品",
  "機台編號(ID)",  // 來自二手設備詢價，自動帶入
  "留言內容",
  "處理狀態",      // 業務手動填寫
];

function handleInquiry(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET.INQUIRIES);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET.INQUIRIES);
    sheet.appendRow(INQUIRIES_HEADERS);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    data.name        || "",
    data.phone       || "",
    data.email       || "",
    data.product     || "",
    data.equipmentId || "",
    data.message     || "",
    "待回覆",
  ]);

  return jsonResponse({ success: true, message: "詢價已收到" });
}

// ─── 工具函式 ─────────────────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
