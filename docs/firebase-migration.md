# 東鐵工程網站 — Firebase 架構升級文檔

> **版本：** v2.0 — 2026-03-08
> **目標：** Google Sheets + GAS → Firebase Firestore，並建立完整管理後台

---

## 一、變更總覽

| 模組 | 舊架構 | 新架構 |
|------|--------|--------|
| 資料庫 | Google Sheets (3 工作頁) | Firebase Firestore (3 Collections) |
| 後端 API | Google Apps Script | Next.js API Routes + Firebase Admin SDK |
| 管理後台 | 僅 `/admin/upload` 上架表單 | 完整後台：詢價管理 + 託售管理 + 機台管理 |
| 圖片儲存 | 外部 URL | Google 雲端硬碟直連 (`lh3.googleusercontent.com`) |
| 認證 | 元件內密碼 | Middleware + httpOnly Cookie session |

---

## 二、Firestore Collections 結構

### `machines`（機台）
| 欄位 | 型態 | 說明 |
|------|------|------|
| name | string | 機台顯示名稱 |
| brand / model | string | 品牌、機型 |
| year | number | 出廠年份 |
| category | string | 分類 |
| location | string | 所在地（去識別化） |
| price | number | 參考售價（公開） |
| costPrice | number | 內部底價（**不回傳前端**） |
| hoursUsed | number | 使用時數 |
| controller / pumpSystem | string | 控制器、油壓系統 |
| isOfficial | boolean | 官方認證 |
| inspectionScore | number | 技術評分 0~100 |
| thumbnail | string | 圖片 URL |
| tradingStatus | string | 待售 / 預約看機 / 已售出 |
| specs | object | 規格（JSON） |
| isActive | boolean | false = 已下架（軟刪除） |
| createdAt | Timestamp | 上架時間 |

### `inquiries`（詢價紀錄）
| 欄位 | 型態 | 說明 |
|------|------|------|
| name / phone / email | string | 聯絡資訊 |
| product | string | 詢問產品名稱 |
| equipmentId | string | 機台 Firestore Doc ID（二手詢價自動帶入） |
| message | string | 留言 |
| status | string | 待回覆 / 已回覆 / 結案 |
| adminNote | string | 業務備註 |
| createdAt | Timestamp | 提交時間 |

### `sellerRequests`（託售申請）
| 欄位 | 型態 | 說明 |
|------|------|------|
| name / phone / email | string | 聯絡資訊 |
| machineBrand / machineModel | string | 機台品牌、型號 |
| machineYear / machineHours | string | 年份、時數 |
| machinePrice | string | 參考售價 |
| machineLocation | string | 所在地 |
| machineCondition | string | 機況說明 |
| status | string | 待聯繫 / 已聯繫 / 成交 |
| adminNote | string | 業務備註 |
| createdAt | Timestamp | 提交時間 |

---

## 三、Firestore 安全規則

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /machines/{id} {
      allow read: if true;
      allow write: if false; // 只允許 Admin SDK 寫入
    }
    match /inquiries/{id} {
      allow read, write: if false;
    }
    match /sellerRequests/{id} {
      allow read, write: if false;
    }
  }
}
```

---

## 四、Google 雲端硬碟圖片上傳流程

1. 在 Google 雲端硬碟建立「機台圖片」資料夾
2. 上傳圖片，設定共用：**「知道連結的所有人」可以查看**
3. 複製分享連結（格式：`https://drive.google.com/file/d/{FILE_ID}/view`）
4. 貼入後台上架表單縮圖欄位 → 系統自動轉換為：
   ```
   https://lh3.googleusercontent.com/d/{FILE_ID}
   ```

---

## 五、管理後台路由

| 路徑 | 說明 |
|------|------|
| `/admin/login` | 登入頁 |
| `/admin/dashboard` | 統計概覽（待處理筆數） |
| `/admin/inquiries` | 詢價列表 + 狀態/備註編輯 |
| `/admin/seller-requests` | 託售申請列表 + 狀態/備註編輯 |
| `/admin/machines` | 機台列表 + 狀態切換 + 下架 |
| `/admin/upload` | 新增機台表單 |

### 認證流程
1. POST `/api/admin/login` → 驗證 `ADMIN_PASSWORD` → 設定 httpOnly cookie `admin_session`
2. `middleware.ts` 攔截 `/admin/**` → 無效 cookie → redirect `/admin/login`

---

## 六、環境變數

| 變數名 | 用途 | 備註 |
|--------|------|------|
| `ADMIN_PASSWORD` | 管理員密碼 | 已存在 |
| `FIREBASE_PROJECT_ID` | Firebase 專案 ID | **新增** |
| `FIREBASE_CLIENT_EMAIL` | 服務帳戶 Email | **新增** |
| `FIREBASE_PRIVATE_KEY` | 服務帳戶私鑰 | **新增**，含完整 PEM 字串 |

> **重要：** Firebase 變數僅限 Server 端使用，**絕不可加 `NEXT_PUBLIC_` 前綴**

---

## 七、遷移步驟（Step-by-Step）

### Step 1：建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/) → 新增專案，名稱建議：`tonteih-web`
2. 停用 Google Analytics
3. 左側「Firestore Database」→「建立資料庫」→ **Production mode**
4. 區域選擇：**`asia-east1`**（台灣最低延遲）

### Step 2：取得服務帳戶金鑰

1. Firebase Console → 專案設定（齒輪圖示）→「服務帳戶」→「產生新的私密金鑰」
2. 下載 JSON 檔，從中取出三個欄位：
   - `FIREBASE_PROJECT_ID` = `project_id` 欄位值
   - `FIREBASE_CLIENT_EMAIL` = `client_email` 欄位值
   - `FIREBASE_PRIVATE_KEY` = `private_key` 欄位值（含 `-----BEGIN PRIVATE KEY-----`）
3. 填入 **Vercel** → Settings → Environment Variables

> **Vercel 注意：** `FIREBASE_PRIVATE_KEY` 直接貼上原始值即可，Vercel 會自動處理換行符號。

### Step 3：設定 Firestore 安全規則

Firebase Console → Firestore → 「規則」頁籤 → 貼入第三節的安全規則 → 發布。

### Step 4：遷移現有機台資料

執行遷移腳本（需提前 `npm install firebase-admin`）：

```bash
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...完整 JSON...}' \
GAS_URL='https://script.google.com/macros/s/你的 GAS URL/exec' \
node scripts/migrate-sheets-to-firestore.mjs
```

腳本會：
- 從現有 GAS `doGet` API 讀取所有機台
- 批次寫入 Firestore `machines` collection
- 自動轉換 Google Drive 分享連結

> **注意：** `costPrice`（內部底價）GAS 不對外回傳，腳本會設為 0，需手動在 Firebase Console 補齊各機台底價。

### Step 5：部署程式碼

```bash
git add .
git commit -m "feat: migrate data layer to Firebase Firestore, add admin dashboard"
git push
```

Vercel 自動部署完成後驗證：
- [ ] `/used-equipment` 正常顯示機台（從 Firestore 讀取）
- [ ] 提交詢價表單 → Firebase Console → `inquiries` collection 出現資料
- [ ] 登入 `/admin/login` → 正常進入後台
- [ ] `/admin/inquiries` 顯示詢價列表，可切換狀態
- [ ] `/admin/upload` 新增機台，縮圖欄貼 Drive 連結可自動轉換

### Step 6：停用 GAS 資料層（驗證穩定 2-3 天後）

1. GAS → 部署管理 → 改存取對象為「僅自己」（保留備份）
2. 刪除 `lib/api/sheets.ts`
3. 如保留 email 通知功能，GAS 只需保留 `MailApp.sendEmail()` 相關邏輯

---

## 八、關鍵程式碼位置

| 用途 | 檔案 |
|------|------|
| Firebase Admin 初始化 | `lib/firebase/admin.ts` |
| Firestore 資料讀寫（公開） | `lib/api/firestore.ts` |
| 表單提交 API | `app/api/submit/route.ts` |
| 後台 Middleware 保護 | `middleware.ts` |
| 管理員登入 API | `app/api/admin/login/route.ts` |
| 詢價 GET / PATCH API | `app/api/admin/inquiries/` |
| 託售 GET / PATCH API | `app/api/admin/seller-requests/` |
| 機台 GET / PATCH API | `app/api/admin/machines/` |
| 遷移腳本 | `scripts/migrate-sheets-to-firestore.mjs` |
