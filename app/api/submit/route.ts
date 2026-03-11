import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

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
      to: [notifyEmail],
      subject,
      html,
    }),
  }).catch((e) => console.warn("Email notification failed:", e));
}

// ─── 基本欄位驗證 ─────────────────────────────────────────────────────────────
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    const db = getDb();

    if (data.type === "seller_request") {
      await db.collection("sellerRequests").add({
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
        createdAt: new Date(),
      });

      await sendNotification(
        `【新託售申請】${data.name} — ${data.machineBrand} ${data.machineModel}`,
        `<p>姓名：${data.name}<br>電話：${data.phone}<br>品牌：${data.machineBrand} ${data.machineModel}<br>年份：${data.machineYear}<br>參考售價：${data.machinePrice}</p><p><a href="https://www.tonteih.com/admin/seller-requests">前往後台查看</a></p>`,
      );
      return NextResponse.json({ success: true, message: "託售申請已收到" });
    }

    // 一般詢價 / 聯絡表單
    await db.collection("inquiries").add({
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      product: data.product || "",
      equipmentId: data.equipmentId || "",
      message: data.message || "",
      status: "待回覆",
      adminNote: "",
      createdAt: new Date(),
    });

    await sendNotification(
      `【新詢價】${data.name} — ${data.product || data.equipmentId || "一般詢問"}`,
      `<p>姓名：${data.name}<br>電話：${data.phone}<br>詢問：${data.product || "—"}<br>機台ID：${data.equipmentId || "—"}<br>留言：${data.message || "—"}</p><p><a href="https://www.tonteih.com/admin/inquiries">前往後台查看</a></p>`,
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
