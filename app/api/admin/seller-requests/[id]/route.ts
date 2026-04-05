import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { sellerRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    const patch: Partial<typeof sellerRequests.$inferInsert> = {};
    if (body.status !== undefined) patch.status = body.status;
    if (body.adminNote !== undefined) patch.adminNote = body.adminNote;

    await getDb().update(sellerRequests).set(patch).where(eq(sellerRequests.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH /api/admin/seller-requests/${id} error:`, error);
    return NextResponse.json(
      { success: false, message: "更新失敗" },
      { status: 500 },
    );
  }
}
