import Link from "next/link";
import { ArrowRight, Mail, MapPin, MoveUpRight, Phone } from "lucide-react";
import { getSiteSettings, telHref } from "@/lib/portal";
import BrandLogo from "@/components/brand-logo";

export default async function Footer() {
  const settings = await getSiteSettings();
  return (
    <footer className="bg-[var(--brand-ink)] text-[#edf0f7] [&_*]:tracking-normal">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[1.4fr_0.7fr_0.9fr] lg:px-12">
        <div>
          <Link href="/" aria-label="Linkdrive Auto Hub home" className="inline-flex items-center gap-3">
            <BrandLogo inverse />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">A considered collection of exceptional cars. Thoughtfully chosen in Lusaka, for wherever the road takes you.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#93c5fd] transition hover:text-white">Come say hello <ArrowRight size={15} /></Link>
        </div>

        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Explore Linkdrive</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li><Link href="/inventory" className="transition hover:text-[#93c5fd]">The collection</Link></li>
            <li><Link href="/sell" className="transition hover:text-[#93c5fd]">Sell or swap your car</Link></li>
            <li><Link href="/#approach" className="transition hover:text-[#93c5fd]">Our approach</Link></li>
            <li><Link href="/#financing" className="transition hover:text-[#93c5fd]">Financing</Link></li>
            <li><Link href="/contact" className="transition hover:text-[#93c5fd]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Let’s talk</h2>
          {settings.phone && <a href={telHref(settings.phone)} className="mt-5 flex items-center gap-3 text-sm text-white/75 transition hover:text-[#93c5fd]"><Phone size={15} /> {settings.phone}</a>}
          {settings.email && <a href={`mailto:${settings.email}`} className="mt-3 flex items-center gap-3 text-sm text-white/75 transition hover:text-[#93c5fd]"><Mail size={15} /> {settings.email}</a>}
          <p className="mt-3 flex items-center gap-3 text-sm text-white/75"><MapPin size={15} /> {settings.address}</p>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#93c5fd] transition hover:text-white">Arrange a viewing <MoveUpRight size={13} /></Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-5 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} {settings.dealership}. {settings.address}.</span>
          <span>Considered cars. Thoughtful service.</span>
        </div>
      </div>
    </footer>
  );
}
