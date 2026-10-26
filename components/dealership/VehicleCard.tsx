"use client";

import Link from "next/link";
import { ArrowRight, Gauge } from "lucide-react";
import { Price } from "./SiteProvider";
import { cssUrl, vehicleName, type Vehicle } from "@/lib/portal";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const label = vehicle.status === "Reserved" ? "RESERVED" : vehicle.badge?.toUpperCase();
  return (
    <article className="group overflow-hidden rounded-t-[20px] border border-[#e1e3e9] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.1)]">
      <Link href={`/inventory/${vehicle.slug}`} className="block">
        <div
          role="img"
          aria-label={vehicleName(vehicle)}
          className="relative aspect-[1.48] overflow-hidden bg-[#eaecf0] bg-cover bg-center transition duration-500 group-hover:bg-[length:105%]"
          style={vehicle.image ? { backgroundImage: cssUrl(vehicle.image) } : undefined}
        >
          {!vehicle.image && <span className="absolute inset-0 grid place-items-center text-xs text-[#959cac]">Photos coming soon</span>}
          {label && <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-bold tracking-[0.14em] ${vehicle.status === "Reserved" ? "bg-[#1769c2] text-white" : "bg-[#eaeffa] text-[#303f61]"}`}>{label}</span>}
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#778094]">{vehicle.year} <span className="mx-1 text-[#bbc0ca]">/</span> {vehicle.body}</p>
            <span className="text-[10px] text-[#7b8397]">{vehicle.color}</span>
          </div>
          <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.04em] text-[#1d2129]">{vehicle.make} <span className="font-normal">{vehicle.model}</span></h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#697286]">
            <Gauge size={14} /> {vehicle.mileage.toLocaleString()} km <span className="text-[#c8cbd3]">·</span> {vehicle.transmission}
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-[#e7e9ef] pt-4">
            <div>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-[#878ea0]">Asking price</span>
              <span className="mt-1 block text-[17px] font-semibold tracking-[-0.03em] text-[#1d2129]"><Price amount={vehicle.price} /></span>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ebeef6] text-[#3b3f4a] transition group-hover:bg-[#1769c2] group-hover:text-white"><ArrowRight size={16} /></span>
          </div>
        </div>
      </Link>
    </article>
  );
}
