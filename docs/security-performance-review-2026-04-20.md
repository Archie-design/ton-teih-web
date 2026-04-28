# 資安與效能審查報告

**審查日期：** 2026-04-20
**修正完成日期：** 2026-04-20
**審查範圍：** API Routes、資料庫存取層、認證機制、效能瓶頸
**最終結果：** ✅ APPROVED（全部修正已實作並通過 `npm run build`）

---

## 總覽

| 等級 | 數量 | 修正狀態 |
|------|------|----------|
| P0 嚴重 | 0 | — |
| P1 高風險 | 4 | ✅ 全部已修正 |
| P2 中風險 | 5 | ✅ 全部已修正 |
| P3 低風險 | 2 | ✅ 全部已修正 |

---

## P1 — 高風險（資安）

### 1. 公開的密碼暴力破解端點 ✅ 已修正

**原始問題：** `app/api/admin/verify/route.ts` 被列在 `PUBLIC_PATHS`（不需認證），接受無限次 `POST { password }` 請求，且完全沒有速率限制。整個程式庫中沒有任何地方呼叫此端點，是廢棄的死路由。

**實施修正：**
- 刪除 `app/api/admin/verify/route.ts`
- 從 `middleware.ts` 的 `PUBLIC_PATHS` 移除 `/api/admin/verify`

---

### 2. Session Cookie 儲存明文密碼 ✅ 已修正

**原始問題：** `admin_session` cookie 值就是管理員密碼本身（`adminPassword`），每次請求均在 cookie 中傳送明文密碼。

**實施修正：** 新增 `lib/auth.ts`，採用 **HMAC-SHA256 無狀態簽名機制**：

- 登入時以 `crypto.randomUUID()` 產生 nonce，再以 `HMAC-SHA256(nonce, ADMIN_PASSWORD)` 簽出 token，格式為 `nonce.signature`
- Cookie 儲存 token，與密碼完全不同
- Middleware 及所有 admin routes 改為呼叫 `verifySessionToken(token, secret)` 重新驗簽
- 每次登入產生不同 token；即使 cookie 洩漏也無法反推密碼
- 使用 Web Crypto API（`crypto.subtle`），同時相容 Edge Runtime（middleware）與 Node.js Runtime（API routes）

**受影響檔案：**
- 新增：`lib/auth.ts`
- 修改：`middleware.ts`、`app/api/admin/login/route.ts`

---

### 3. 訂閱通知信件將所有訂閱者 Email 互相揭露 ✅ 已修正

**原始問題：** `notifySubscribers` 以 `to: emails`（全部訂閱者陣列）發送單封郵件，每位訂閱者均可看到所有他人 Email，違反個資保護原則。

**實施修正：** `lib/api/db.ts` 改為：
```ts
to: "notify@tonteih.com",
bcc: emails,
```

---

### 4. 管理員通知信件存在 HTML 注入漏洞 ✅ 已修正

**原始問題：** 使用者填寫的表單欄位（姓名、電話、品牌、留言等）直接嵌入 HTML 郵件內容，未經任何跳脫，攻擊者可注入釣魚連結。

**實施修正：** `app/api/submit/route.ts` 新增 `escapeHtml()` 函式，所有使用者輸入欄位在嵌入 HTML 前均先跳脫：
```ts
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

---

## P2 — 中風險（正確性與效能）

### 5. `getMachineById` 未過濾 `isActive` 狀態 ✅ 已修正

**原始問題：** 停用的機台仍可透過直接輸入 URL `/used-equipment/{id}` 存取完整頁面。

**實施修正：** `lib/api/db.ts` 的 `getMachineById` 查詢加入：
```ts
.where(and(eq(machines.id, id), ne(machines.isActive, false)))
```
停用機台現在回傳 `null`，頁面顯示 404。

---

### 6. `verifyAdmin` 函式在 6 個路由檔案中重複定義 ✅ 已修正

**原始問題：** 相同的 3 行認證函式分散在 6 個 admin route 檔案，邏輯變更時容易遺漏。

**實施修正：** 所有 admin routes 改為從 `lib/auth.ts` import `verifyAdmin`，並以 `await` 呼叫（因改為非同步驗簽）：
```ts
if (!await verifyAdmin(request)) { ... }
```

**受影響檔案（6 個）：**
- `app/api/admin/machines/route.ts`
- `app/api/admin/machines/[id]/route.ts`
- `app/api/admin/inquiries/route.ts`
- `app/api/admin/inquiries/[id]/route.ts`
- `app/api/admin/seller-requests/route.ts`
- `app/api/admin/seller-requests/[id]/route.ts`

---

### 7. 管理後台列表 API 無分頁機制 ✅ 已修正

**原始問題：** 三個後台列表端點全表掃描無 LIMIT，隨資料增長效能線性下降。

**實施修正：** 三個 GET 端點均加入可選分頁參數（向下相容，前端無需修改）：
```
GET /api/admin/machines?page=0&limit=50
```
- 預設 `limit=100`，上限 `200`，`page` 從 0 開始
- 使用 `.limit(limit).offset(page * limit)`

---

### 8. 公開表單端點無輸入長度限制 ✅ 已修正

**原始問題：** 文字欄位可接受任意長度字串，可被用來濫刷資料庫空間。

**實施修正：** `app/api/submit/route.ts` 加入 `checkLengths()` 驗證，各欄位上限：

| 欄位 | 上限 |
|------|------|
| name | 100 字元 |
| phone | 30 字元 |
| email | 254 字元 |
| message | 2000 字元 |
| machineBrand / Model | 100 字元 |
| machineCondition | 500 字元 |

`app/api/subscribe/route.ts` 的 email 欄位亦加入 254 字元上限。

---

### 9. 未設定 HTTP 安全標頭 ✅ 已修正

**原始問題：** 缺少 `X-Frame-Options` 等基本安全標頭，網站可被嵌入任意第三方頁面（Clickjacking 風險）。

**實施修正：** `next.config.ts` 加入 `headers()` 設定，套用至所有路由：

| 標頭 | 值 |
|------|----|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |

---

## P3 — 低風險（程式碼品質）

### 10. `convertDriveUrl` 函式重複出現 ✅ 已修正

**原始問題：** 相同實作分別出現於 `lib/api/db.ts` 與 `app/api/admin/machines/[id]/route.ts`。

**實施修正：** 提取至 `lib/utils/drive.ts`，兩處改為 import 使用。

---

### 11. 機台詳情頁為了取 3 筆相關設備而載入全部資料 ✅ 已修正

**原始問題：** `getUsedEquipments()` 回傳所有機台，但只用來取前 3 筆相關設備，隨機台數量增加浪費資源。

**實施修正：** `lib/api/db.ts` 新增 `getRelatedMachines(excludeId, category, limit = 3)`，在 DB 層直接以 `WHERE category = ? AND id != ? AND is_active != false LIMIT 3` 查詢。`app/(site)/used-equipment/[id]/page.tsx` 改為呼叫此函式。

---

## 附加觀察：本地敏感檔案

**檔案：** `docs/tonteih-web-firebase-adminsdk-fbsvc-d9cffe32da.json`

Firebase Admin SDK 服務帳號金鑰存在於 `docs/` 目錄下。已確認 `.gitignore` 包含 `docs/*.json`，**檔案未被 Git 追蹤**，目前安全。

建議：將此類金鑰統一存放於專案外的安全位置（例如 `~/.config/`），避免意外提交的風險。

---

## 修正完成後的新增/修改檔案清單

| 動作 | 檔案 |
|------|------|
| 新增 | `lib/auth.ts` — HMAC session token 工具 |
| 新增 | `lib/utils/drive.ts` — Google Drive URL 轉換工具 |
| 刪除 | `app/api/admin/verify/route.ts` |
| 修改 | `middleware.ts` |
| 修改 | `app/api/admin/login/route.ts` |
| 修改 | `lib/api/db.ts` |
| 修改 | `app/api/submit/route.ts` |
| 修改 | `app/api/subscribe/route.ts` |
| 修改 | `next.config.ts` |
| 修改 | `app/api/admin/machines/route.ts` |
| 修改 | `app/api/admin/machines/[id]/route.ts` |
| 修改 | `app/api/admin/inquiries/route.ts` |
| 修改 | `app/api/admin/inquiries/[id]/route.ts` |
| 修改 | `app/api/admin/seller-requests/route.ts` |
| 修改 | `app/api/admin/seller-requests/[id]/route.ts` |
| 修改 | `app/(site)/used-equipment/[id]/page.tsx` |

---

## 驗證結果

```
npm run build → ✅ Compiled successfully（零 TypeScript 錯誤）
```

---

# 第二輪：整體架構審查與修正（2026-04-20）

第一輪 11 項修正完成後，再針對程式碼與資料庫架構進行更廣的審查，發現 **1 個 P0 嚴重 BUG（首輪修正遺漏）+ 9 個額外項目**，全數已修正。

## 🔴 P0 — 首輪修正遺漏

### A1. `app/admin/layout.tsx` 仍使用舊的明文密碼比對 ✅ 已修正

**問題：** 首輪 #2 把 cookie 從明文密碼改為 HMAC token，但漏掉了這個 server-side layout。Layout 仍以 `session !== process.env.ADMIN_PASSWORD` 比對，導致 HMAC token 永遠不等於密碼，**所有管理員會被無限導回登入頁**。

**修正：** `app/admin/layout.tsx` 改為 `await verifySessionToken(session, secret)`，與 middleware 一致。

---

## 🟠 P1 — 高優先

### A2. 資料庫缺少索引 ✅ 已修正

**問題：** 除 `subscribers.email` UNIQUE 外完全無 index，`ORDER BY created_at DESC`、`WHERE category AND is_active`、`WHERE status` 等熱點查詢全表掃描。

**修正：** `lib/db/schema.ts` 加入 4 個索引：

| Table | Index | 用途 |
|-------|-------|------|
| machines | `machines_created_at_idx` (created_at DESC) | 列表排序 |
| machines | `machines_category_active_idx` (category, is_active) | 分類過濾 + getRelatedMachines |
| inquiries | `inquiries_status_created_idx` (status, created_at DESC) | dashboard 待處理計數 |
| seller_requests | `seller_requests_status_created_idx` (status, created_at DESC) | dashboard 待處理計數 |

### A3. 沒有正式 migration 檔 ✅ 已修正

**問題：** `drizzle/` 目錄不存在，依賴 `drizzle-kit push` 直接同步 schema，schema 變更未版本化、無法 rollback。

**修正：**
- 執行 `npx drizzle-kit generate` 產生 `drizzle/0000_initial_schema_with_indexes.sql`
- 手動加入 `IF NOT EXISTS` 讓 SQL 可安全套用至已存在 production tables 的環境
- 後續 schema 變更應走 `drizzle-kit generate` 版本化流程

### A4. 死程式碼：`lib/api/sheets.ts` + `SCRIPT_URL` ✅ 已修正

**問題：** Google Apps Script 舊架構檔案在遷移到 Neon 後仍殘留，`grep` 確認已無人引用。

**修正：** 刪除 `lib/api/sheets.ts`，從 `lib/constants.ts` 移除 `SCRIPT_URL`。

---

## 🟡 P2 — 中優先

### A5. `lib/types.ts` 與 schema 不同步 ✅ 已修正

**問題：** `Machine` interface 缺欄位（`costPrice`、`isActive`、`createdAt`），又有不存在於 schema 的 `isRecommended`、`isVerified`，型別漂移。

**修正：** 改為從 Drizzle schema 推導：
```ts
export type AdminMachine = typeof machines.$inferSelect;
export type TradingItem = Omit<AdminMachine, "costPrice" | "isActive" | "createdAt">;
```
未來 schema 變更會自動同步到型別。

### A6. 空白 legacy 目錄 ✅ 已修正

**修正：** 刪除 `lib/firebase/` 與 `lib/components/` 空目錄。

### A7. 廢棄的 migration scripts ✅ 已修正

**修正：** 刪除 `scripts/migrate-firestore-to-neon.mjs` 與 `scripts/migrate-sheets-to-firestore.mjs`（一次性遷移已完成，Git history 仍保留）。

### A8. `useContactForm` 不顯示後端錯誤訊息 ✅ 已修正

**問題：** 首輪 #8 加入的長度驗證錯誤訊息使用者完全看不到，只見通用「發送失敗」。

**修正：** `lib/hooks/useContactForm.ts` 改為解析 `res.json()` 並優先顯示後端 `body.message`。

---

## 🟢 P3 — 已評估暫緩

### A9. Dashboard 3 個 count() 可合併
目前 `Promise.all` 平行查詢已接近單次 round-trip 延遲，合併為 single query 邊際效益小。維持現狀。

### A10. `generateStaticParams` 在大量機台時拖長 build
目前機台數量規模仍小，待突破 200 筆再考慮改為純 SSR。維持現狀。

---

## 第二輪修正後的檔案異動

| 動作 | 檔案 |
|------|------|
| 修改 | `app/admin/layout.tsx` — HMAC 驗證 |
| 修改 | `lib/db/schema.ts` — 加入 4 個索引 |
| 新增 | `drizzle/0000_initial_schema_with_indexes.sql` + `drizzle/meta/` |
| 修改 | `lib/types.ts` — 改用 Drizzle schema 推導 |
| 修改 | `lib/constants.ts` — 移除 SCRIPT_URL |
| 修改 | `lib/hooks/useContactForm.ts` — 顯示後端錯誤訊息 |
| 刪除 | `lib/api/sheets.ts` |
| 刪除 | `lib/firebase/`、`lib/components/`（空目錄） |
| 刪除 | `scripts/migrate-firestore-to-neon.mjs` |
| 刪除 | `scripts/migrate-sheets-to-firestore.mjs` |

---

## 驗證結果（第二輪）

```
npm run build → ✅ Compiled successfully（零 TypeScript 錯誤）
```

**部署前必做：** 在 Neon 執行新 migration 以建立索引：
```bash
npx drizzle-kit migrate    # 或在 Neon Console 直接執行 drizzle/0000_*.sql
```

**部署後驗證：**
1. 開瀏覽器登入 `/admin/login` → 確認可進入 `/admin/dashboard`（不會被踢回登入頁）
2. 重新整理 dashboard 確認 cookie 仍被正確驗證
3. 在 Neon Console 執行 `\d machines` 確認索引已建立

---

*第一輪審查 + 修正：2026-04-20*
*第二輪架構審查 + 修正：2026-04-20*
