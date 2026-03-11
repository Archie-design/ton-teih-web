import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

function verifyAdmin(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const update: Record<string, unknown> = {};
    if (body.tradingStatus !== undefined) update.tradingStatus = body.tradingStatus;
    if (body.isActive !== undefined) update.isActive = body.isActive;

    await getDb().collection("machines").doc(id).update(update);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH /api/admin/machines/${id} error:`, error);
    return NextResponse.json(
      { success: false, message: "更新失敗" },
      { status: 500 },
    );
  }
}
