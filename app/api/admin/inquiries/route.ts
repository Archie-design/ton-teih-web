import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { inquiries } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

function verifyAdmin(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await getDb()
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));

    const data = rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "讀取失敗" },
      { status: 500 },
    );
  }
}
