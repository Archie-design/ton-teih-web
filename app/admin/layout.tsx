import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認證由 middleware.ts 統一處理（matcher: /admin/:path*）
  return <>{children}</>;
}
