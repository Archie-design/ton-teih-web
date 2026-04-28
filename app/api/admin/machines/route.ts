import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { machines } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") ?? 100)));

  try {
    const rows = await getDb()
      .select()
      .from(machines)
      .orderBy(desc(machines.createdAt))
      .limit(limit)
      .offset(page * limit);

    const data = rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/machines error:", error);
    return NextResponse.json(
      { success: false, message: "讀取失敗" },
      { status: 500 },
    );
  }
}
