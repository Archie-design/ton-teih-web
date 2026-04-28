import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { inquiries, sellerRequests } from "@/lib/db/schema";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Email 通知（Resend REST API，選填）────────────────────────────────────────
async function sendNotification(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!apiKey || !notifyEmail) return; // 未設定時略過

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "東鐵工程系統通知 <notify@tonteih.com>",
      to: notifyEmail.split(",").map((e) => e.trim()),
      subject,
      html,
    }),
  }).catch((e) => console.warn("Email notification failed:", e));
}

// ─── 基本欄位驗證 ─────────────────────────────────────────────────────────────
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MAX_LENGTHS: Record<string, number> = {
  name: 100,
  phone: 30,
  email: 254,
  message: 2000,
  machineBrand: 100,
  machineModel: 100,
  machineYear: 10,
  machineHours: 20,
  machinePrice: 50,
  machineLocation: 200,
  machineCondition: 500,
  product: 200,
};

function checkLengths(data: Record<string, unknown>): string | null {
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const val = data[field];
    if (typeof val === "string" && val.length > max) {
      return `欄位「${field}」超過最大長度 ${max} 字元。`;
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Honeypot：機器人通常會填寫所有欄位，website 欄位應永遠為空
    if (data.website) {
      return NextResponse.json({ success: true, message: "已收到" });
    }

    // 必填欄位驗證
    if (!data.name?.trim() || !data.phone?.trim()) {
      return NextResponse.json(
        { success: false, message: "請填寫姓名與電話。" },
        { status: 400 },
      );
    }
    if (data.email && !isValidEmail(data.email)) {
      return NextResponse.json(
        { success: false, message: "電子郵件格式不正確。" },
        { status: 400 },
      );
    }

    // 長度驗證
    const lengthError = checkLengths(data);
    if (lengthError) {
      return NextResponse.json({ success: false, message: lengthError }, { status: 400 });
    }

    if (data.type === "seller_request") {
      await getDb().insert(sellerRequests).values({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        machineBrand: data.machineBrand || "",
        machineModel: data.machineModel || "",
        machineYear: data.machineYear || "",
        machineHours: data.machineHours || "",
        machinePrice: data.machinePrice || "",
        machineLocation: data.machineLocation || "",
        machineCondition: data.machineCondition || "",
        status: "待聯繫",
        adminNote: "",
      });

      await sendNotification(
        `【新託售申請】${escapeHtml(data.name)} — ${escapeHtml(data.machineBrand)} ${escapeHtml(data.machineModel)}`,
        `<p>姓名：${escapeHtml(data.name)}<br>電話：${escapeHtml(data.phone)}<br>品牌：${escapeHtml(data.machineBrand)} ${escapeHtml(data.machineModel)}<br>年份：${escapeHtml(data.machineYear)}<br>參考售價：${escapeHtml(data.machinePrice)}</p><p><a href="https://www.tonteih.com/admin/seller-requests">前往後台查看</a></p>`,
      );
      return NextResponse.json({ success: true, message: "託售申請已收到" });
    }

    // 一般詢價 / 聯絡表單
    await getDb().insert(inquiries).values({
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      product: data.product || "",
      equipmentId: data.equipmentId || "",
      message: data.message || "",
      status: "待回覆",
      adminNote: "",
    });

    await sendNotification(
      `【新詢價】${escapeHtml(data.name)} — ${escapeHtml(data.product || data.equipmentId || "一般詢問")}`,
      `<p>姓名：${escapeHtml(data.name)}<br>電話：${escapeHtml(data.phone)}<br>詢問：${escapeHtml(data.product || "—")}<br>機台ID：${escapeHtml(data.equipmentId || "—")}<br>留言：${escapeHtml(data.message || "—")}</p><p><a href="https://www.tonteih.com/admin/inquiries">前往後台查看</a></p>`,
    );
    return NextResponse.json({ success: true, message: "詢價已收到" });
  } catch (error) {
    console.error("API /api/submit error:", error);
    return NextResponse.json(
      { success: false, message: "發送失敗，請稍後再試。" },
      { status: 500 },
    );
  }
}
