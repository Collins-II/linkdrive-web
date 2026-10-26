"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MoveUpRight, Phone, Search, X } from "lucide-react";
import { useState } from "react";
import { CurrencySwitcher, useSite } from "@/components/dealership/SiteProvider";
import { telHref } from "@/lib/portal";
import BrandLogo from "@/components/brand-logo";

const links = [
  { label: "The collection", href: "/inventory" },
  { label: "Sell or swap", href: "/sell" },
  //{ label: "Our approach", href: "/#approach" },
  { label: "Financing", href: "/#financing" },
  { label: "Visit us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSite()

  return (
    <header className="relative z-50 border-b border-[#e0e2e8] bg-white [&_*]:tracking-normal">
      <div className="border-b border-[#e0e2e8] bg-[var(--brand-soft)]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#646d80] sm:px-8 lg:px-12">
          <span className="min-w-0 pr-3">{settings.address}<span className="hidden sm:inline"><span className="mx-2 text-[#bdc1cb]">/</span> Good cars. Real connections.</span></span>
          <div className="flex items-center gap-5">
            {settings.phone && (
              <a className="hidden items-center gap-2 transition hover:text-[#1769c2] sm:flex" href={telHref(settings.phone)}>
                <Phone size={12} /> {settings.phone}
              </a>
            )}
            <CurrencySwitcher className="text-[#646d80]" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Linkdrive Auto Hub home" className="group flex items-center gap-3">
          <BrandLogo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-9 lg:flex">
          {links.map((link) => {
            const active = !link.href.includes("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition ${active ? "text-[#0f172a]" : "text-[#676f82] hover:text-[#1769c2]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/inventory" aria-label="Browse inventory" className="text-[#525969] transition hover:text-[#1769c2]">
            <Search size={18} strokeWidth={1.8} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-[var(--brand-ink)] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[var(--brand)]">
            Start a conversation <MoveUpRight size={14} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#dcdfe5] text-[#0f172a] lg:hidden"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full border-t border-[#e0e2e8] bg-white px-5 pb-6 pt-3 shadow-xl lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-[#e0e2e8] py-4 text-sm font-medium text-[#2d3139]"
            >
              {link.label}<MoveUpRight size={15} />
            </Link>
          ))}
          {settings.phone && (
            <a href={telHref(settings.phone)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2d3139]">
              <Phone size={15} /> {settings.phone}
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
