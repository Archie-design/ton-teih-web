import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { machines } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyAdmin } from "@/lib/auth";
import { convertDriveUrl } from "@/lib/utils/drive";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const patch: Partial<typeof machines.$inferInsert> = {};

    // 狀態欄位
    if (body.tradingStatus !== undefined) patch.tradingStatus = body.tradingStatus;
    if (body.isActive !== undefined) patch.isActive = body.isActive;

    // 內容欄位（編輯用）
    if (body.name !== undefined) patch.name = body.name;
    if (body.brand !== undefined) patch.brand = body.brand;
    if (body.model !== undefined) patch.model = body.model;
    if (body.year !== undefined) patch.year = Number(body.year);
    if (body.category !== undefined) patch.category = body.category;
    if (body.location !== undefined) patch.location = body.location;
    if (body.price !== undefined) patch.price = Number(body.price);
    if (body.costPrice !== undefined) patch.costPrice = Number(body.costPrice);
    if (body.hoursUsed !== undefined) patch.hoursUsed = Number(body.hoursUsed);
    if (body.controller !== undefined) patch.controller = body.controller;
    if (body.pumpSystem !== undefined) patch.pumpSystem = body.pumpSystem;
    if (body.isOfficial !== undefined) patch.isOfficial = Boolean(body.isOfficial);
    if (body.inspectionScore !== undefined) patch.inspectionScore = Number(body.inspectionScore);
    if (body.thumbnail !== undefined) patch.thumbnail = convertDriveUrl(String(body.thumbnail));
    if (body.gallery !== undefined) {
      patch.gallery = (body.gallery as string[]).map((u) => convertDriveUrl(u)).filter(Boolean);
    }
    if (body.specs !== undefined) patch.specs = body.specs;

    await getDb().update(machines).set(patch).where(eq(machines.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH /api/admin/machines/${id} error:`, error);
    return NextResponse.json(
      { success: false, message: "更新失敗" },
      { status: 500 },
    );
  }
}
