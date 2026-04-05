import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // 登入頁不需要驗證
  if (!pathname.startsWith("/admin/login")) {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!session || session !== process.env.ADMIN_PASSWORD) {
      redirect("/admin/login");
    }
  }

  return <>{children}</>;
}
