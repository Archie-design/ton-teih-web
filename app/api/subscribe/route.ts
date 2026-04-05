import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/api/db";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "請輸入有效的電子郵件" }, { status: 400 });
    }

    const result = await addSubscriber(email.trim().toLowerCase());

    if (!result.success) {
      return NextResponse.json({ error: "訂閱失敗，請稍後再試" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: result.duplicate ? "您已訂閱，無需重複操作" : "訂閱成功！新機到貨時將通知您",
    });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
