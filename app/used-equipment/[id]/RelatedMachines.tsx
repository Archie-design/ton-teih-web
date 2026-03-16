import Image from "next/image";
import { TradingItem } from "@/lib/types";
import { MapPin } from "lucide-react";

interface Props {
  machines: TradingItem[];
}

export default function RelatedMachines({ machines }: Props) {
  if (machines.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h2 className="text-lg font-black text-slate-900 border-l-4 border-red-600 pl-4 tracking-tight mb-8">
        相關設備推薦
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <a
            key={machine.id}
            href={`/used-equipment/${machine.id}`}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl hover:border-red-600/30 transition-all flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100 flex-shrink-0">
              <Image
                src={machine.thumbnail}
                alt={machine.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none -rotate-12">
                <span className="text-2xl font-black tracking-tighter text-black uppercase">
                  Ton Teih Certified
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-slate-900 text-base group-hover:text-red-600 transition-colors line-clamp-1">
                  {machine.name}
                </h3>
                <span className="text-sm font-black text-slate-400 whitespace-nowrap ml-2">
                  {machine.year} 年
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 flex items-center mb-4">
                <MapPin size={12} className="text-red-600 mr-1 shrink-0" />
                {machine.location}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">
                  {machine.price > 0 ? `NT$ ${machine.price.toLocaleString()}` : "洽詢業務"}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  評分 {machine.inspectionScore}/100
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
