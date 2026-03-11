import { getMachineById, getUsedEquipments } from "@/lib/api/firestore";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MachineDetailClient from "./MachineDetailClient";

export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const machines = await getUsedEquipments();
  return machines.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const machine = await getMachineById(id);

  if (!machine) {
    return { title: "設備不存在 | 東鐵工程" };
  }

  return {
    title: `${machine.name} | 認證中古設備 | 東鐵工程`,
    description: `${machine.year} 年出廠，${machine.brand} ${machine.model}，技術評分 ${machine.inspectionScore}/100，所在地：${machine.location}。歡迎向東鐵工程詢價。`,
    openGraph: {
      title: `${machine.name} | 東鐵工程`,
      description: `${machine.year} 年 ${machine.brand} ${machine.model}，技術評分 ${machine.inspectionScore}/100。`,
      url: `https://www.tonteih.com/used-equipment/${id}`,
      images: machine.thumbnail ? [{ url: machine.thumbnail }] : [],
      type: "website",
    },
  };
}

export default async function MachineDetailPage({ params }: Props) {
  const { id } = await params;
  const machine = await getMachineById(id);

  if (!machine) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-[#111] py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
            <a href="/used-equipment" className="hover:text-white transition-colors">
              認證中古設備
            </a>
            <span>/</span>
            <span className="text-white">{machine.category}</span>
          </div>
          <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-sm text-[10px] font-black tracking-widest uppercase mb-4 shadow-md">
            {machine.isOfficial ? "Ton Teih Certified" : "Used Equipment"}
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {machine.name}
          </h1>
        </div>
      </section>

      <MachineDetailClient machine={machine} />

      {/* JSON-LD Product 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: machine.name,
            brand: { "@type": "Brand", name: machine.brand },
            model: machine.model,
            description: `${machine.year} 年出廠，${machine.brand} ${machine.model}，技術評分 ${machine.inspectionScore}/100，所在地：${machine.location}。`,
            image: machine.thumbnail || undefined,
            offers: {
              "@type": "Offer",
              priceCurrency: "TWD",
              price: machine.price,
              availability:
                machine.tradingStatus === "已售出"
                  ? "https://schema.org/SoldOut"
                  : "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "東鐵工程有限公司",
                url: "https://www.tonteih.com",
              },
            },
          }),
        }}
      />
    </div>
  );
}
