import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InventoryBrowser from "@/components/dealership/InventoryBrowser";
import { getVehicles } from "@/lib/portal";

export const metadata: Metadata = {
  title: "The Collection | Linkdrive Auto Hub",
  description: "Explore the carefully selected car collection at Linkdrive Auto Hub in Lusaka.",
};

type InventoryPageProps = {
  searchParams: Promise<{ q?: string; make?: string; body?: string }>;
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const { q = "", make = "", body = "" } = await searchParams;
  const inventory = await getVehicles({ limit: 100 });

  return (
    <main className="min-h-screen bg-[#f4f6f9] px-5 pb-20 pt-12 text-[#1e2026] sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6a7388] transition hover:text-[#1769c2]"><ArrowLeft size={14} /> Back to Linkdrive</Link>
        <div className="mb-9 mt-8 flex flex-col justify-between gap-5 sm:mb-12 sm:mt-10 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#70798e]">Thoughtfully chosen, ready for you</p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-0.07em] text-[#1e2026] sm:text-5xl">The collection.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#676f82]">A considered edit of exceptional cars, each selected for its character, condition and the journey ahead.</p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a505e] transition hover:text-[#1769c2]">Looking for something specific? <span className="underline underline-offset-4">Talk to us</span></Link>
        </div>
        {inventory ? (
          <InventoryBrowser vehicles={inventory.vehicles} initialQuery={q} initialMake={make} initialBody={body} />
        ) : (
          <div role="alert" className="rounded-2xl border border-dashed border-[#cfd3db] bg-white px-6 py-20 text-center">
            <h2 className="text-xl font-semibold text-[#22252b]">The collection is briefly unavailable</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#676f82]">We’re refreshing our listings. Please try again in a moment, or talk to our team directly.</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1258a6]">Contact the team</Link>
          </div>
        )}
      </div>
    </main>
  );
}
