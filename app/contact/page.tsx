import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, MapPin, MoveUpRight, Phone } from "lucide-react";
import EnquiryForm from "@/components/dealership/EnquiryForm";
import { getSiteSettings, telHref, whatsappHref } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Talk to Linkdrive | Linkdrive Auto Hub",
  description: "Speak with the Linkdrive Auto Hub team about a vehicle, arranging a viewing or finding the right car.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsapp = settings.whatsapp || settings.phone;
  return (
    <main className="min-h-[75vh] bg-[#f4f6f9] px-5 pb-20 pt-12 text-[#1e2026] sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto max-w-[1160px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6a7388] transition hover:text-[#1769c2]"><ArrowLeft size={14} /> Back to Linkdrive</Link>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#70798e]">We’re listening</p>
            <h1 className="mt-4 max-w-xl text-5xl font-medium leading-[1.04] tracking-[-0.07em] sm:text-6xl">A good place to start is a conversation.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#656d80]">Have a car in mind, want to arrange a viewing, or just need a little guidance? Tell us what you’re looking for. There’s a real person here to help.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {whatsapp && <a href={whatsappHref(whatsapp)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#1258a6]">Message us on WhatsApp <MoveUpRight size={15} /></a>}
              {settings.phone && <a href={telHref(settings.phone)} className="inline-flex items-center gap-2 rounded-full border border-[#d6d9df] px-6 py-4 text-[13px] font-semibold text-[#383d48] transition hover:bg-white"><Phone size={15} /> Call the team</a>}
            </div>
            <div className="mt-10 rounded-[22px] border border-[#dfe2e8] bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-medium tracking-[-0.04em]">Send us a message</h2>
              <EnquiryForm />
            </div>
          </div>
          <div className="rounded-[22px] border border-[#dfe2e8] bg-white p-6 sm:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#747d91]">{settings.dealership}</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.05em]">Here when you need us.</h2>
            <div className="my-7 border-t border-[#e7e9ef]" />
            <div className="space-y-6">
              <a href={telHref(settings.phone)} className="group flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ebeef5] text-[#4d5a77]"><Phone size={17} /></span>
                <span><span className="block text-xs text-[#7b8397]">Call us</span><span className="mt-1 block text-sm font-semibold text-[#2d3139] group-hover:underline">{settings.phone}</span></span>
              </a>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="group flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ebeef5] text-[#4d5a77]"><Mail size={17} /></span>
                  <span><span className="block text-xs text-[#7b8397]">Email us</span><span className="mt-1 block break-all text-sm font-semibold text-[#2d3139] group-hover:underline">{settings.email}</span></span>
                </a>
              )}
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ebeef5] text-[#4d5a77]"><MapPin size={17} /></span>
                <span><span className="block text-xs text-[#7b8397]">Find us</span><span className="mt-1 block text-sm font-semibold text-[#2d3139]">{settings.address}</span><span className="mt-1 block text-xs leading-5 text-[#7b8397]">Contact our team to arrange a personal viewing.</span></span>
              </div>
            </div>
            <div className="mt-8 border-t border-[#e7e9ef] pt-6">
              <Link href="/inventory" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a505e] transition hover:text-[#1769c2]">Browse the collection <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
        <div className="mt-14 overflow-hidden rounded-[22px] bg-[#dbe2f1] px-6 py-8 sm:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5b6680]">The Linkdrive promise</p>
          <p className="mt-3 max-w-2xl text-xl font-medium leading-8 tracking-[-0.03em] text-[#2d3139]">No question is too small. We’ll give you thoughtful answers and the space to make the decision that feels right.</p>
        </div>
      </div>
    </main>
  );
}
