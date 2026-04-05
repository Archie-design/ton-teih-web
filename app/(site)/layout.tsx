import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LineFloatingButton from "@/components/LineFloatingButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <LineFloatingButton />
    </>
  );
}
