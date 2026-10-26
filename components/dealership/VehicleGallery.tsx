"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cssUrl } from "@/lib/portal";

export default function VehicleGallery({ images, name, label }: { images: string[]; name: string; label: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const step = (delta: number) => setIndex((value) => (value + delta + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-[1.4] overflow-hidden rounded-[22px] bg-[#e1e4ea] sm:aspect-[1.55]">
        {current
          ? <div role="img" aria-label={`${name}, photo ${index + 1} of ${images.length}`} className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-300" style={{ backgroundImage: cssUrl(current) }} />
          : <span className="absolute inset-0 grid place-items-center text-sm text-[#8c94a5]">Photos coming soon</span>}
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#3c414c] backdrop-blur">{label}</span>
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0f172a] shadow transition hover:bg-white"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0f172a] shadow transition hover:bg-white"><ChevronRight size={18} /></button>
            <span className="absolute bottom-4 right-5 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold text-white">{index + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, thumb) => (
            <button key={`${src}-${thumb}`} type="button" onClick={() => setIndex(thumb)} aria-label={`Show photo ${thumb + 1}`} aria-current={thumb === index}
              className={`h-16 w-24 shrink-0 rounded-xl bg-cover bg-center ring-2 transition ${thumb === index ? "ring-[#1769c2]" : "ring-transparent opacity-70 hover:opacity-100"}`}
              style={{ backgroundImage: cssUrl(src) }} />
          ))}
        </div>
      )}
    </div>
  );
}
