import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return NextResponse.json(
        { success: false, message: "系統設定錯誤，請聯繫管理員。" },
        { status: 500 },
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "密碼錯誤！" },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "請求格式錯誤。" },
      { status: 400 },
    );
  }
}
