import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Camera, HandCoins, MessageSquareText } from "lucide-react";
import TradeInForm from "@/components/dealership/TradeInForm";
import { getVehicles } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Sell or swap your car | Linkdrive Auto Hub",
  description: "Sell your car to Linkdrive Auto Hub, or swap it for one of ours and top up the difference. Send photos and details for a no-obligation offer.",
};

const steps = [
  [Camera, "Send photos & details", "Tell us about your car and add a few clear photos."],
  [MessageSquareText, "We review & respond", "Our team assesses your car and replies with an offer or swap quote."],
  [BadgeCheck, "Inspect & complete", "Bring the car in for a quick inspection and we finalise the deal."],
] as const;

export default async function SellPage({ searchParams }: { searchParams: Promise<{ type?: string; vehicle?: string }> }) {
  const { type, vehicle } = await searchParams;
  const list = await getVehicles({ limit: 100 });
  const vehicles = (list?.vehicles ?? []).filter((v) => v.status !== "Sold");
  const defaultType = type?.toLowerCase() === "swap" || vehicle ? "Swap" : "Sell";

  return (
    <main className="min-h-[75vh] bg-[#f4f6f9] px-5 pb-20 pt-12 text-[#1e2026] sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto max-w-[1160px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6a7388] transition hover:text-[#1769c2]"><ArrowLeft size={14} /> Back to Linkdrive</Link>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="lg:sticky lg:top-8">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1769c2]"><HandCoins size={14} /> Sell · Swap · Top-up</p>
            <h1 className="mt-4 max-w-xl text-5xl font-medium leading-[1.04] tracking-[-0.07em] sm:text-6xl">Your car is worth something here.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#656d80]">Sell your car to Linkdrive Auto Hub for a fair offer, or swap it for one of ours and simply top up the difference. No obligation and no pressure.</p>
            <ol className="mt-10 space-y-5">
              {steps.map(([Icon, title, text], index) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1769c2] text-white"><Icon size={17} /></span>
                  <span><span className="block text-sm font-semibold text-[#0b1a3f]">{index + 1}. {title}</span><span className="mt-1 block text-xs leading-5 text-[#6a7388]">{text}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[22px] border border-[#dfe2e8] bg-white p-6 sm:p-9">
            <TradeInForm vehicles={vehicles} defaultType={defaultType} defaultVehicle={vehicle ?? ""} />
          </div>
        </div>
      </div>
    </main>
  );
}
