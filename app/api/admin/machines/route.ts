import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";

function verifyAdmin(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const snapshot = await db
      .collection("machines")
      .orderBy("createdAt", "desc")
      .get();

    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d, // 包含 costPrice（內部底價），僅供後台
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/machines error:", error);
    return NextResponse.json(
      { success: false, message: "讀取失敗" },
      { status: 500 },
    );
  }
}
