import Link from "next/link";
import { ArrowRight,
   //BadgeCheck, 
   Check, HandCoins, MoveUpRight, Repeat2, Search, 
  // ShieldCheck, Sparkles
   } from "lucide-react";
import { Price } from "@/components/dealership/SiteProvider";
import { cssUrl, getVehicles, vehicleName } from "@/lib/portal";

const BODY_STYLES = ["SUV", "Sedan", "Coupe", "Wagon", "Hatchback", "Truck", "Convertible"];
const HERO_FALLBACK = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85";

{/*const reasons = [
  { icon: BadgeCheck, title: "Every detail, considered", copy: "Each car is carefully selected and thoroughly reviewed before it joins our collection." },
  { icon: ShieldCheck, title: "Confidence comes standard", copy: "Clear histories, honest conversations and support that continues after the handover." },
  { icon: Sparkles, title: "A more personal way", copy: "No pressure, no noise. Just thoughtful guidance shaped around what matters to you." },
];*/}

export default async function Home() {
  const inventory = await getVehicles({ sort: "featured", limit: 6 });
  const featured = inventory?.vehicles.slice(0, 3) ?? [];
  const heroCar = featured.find((vehicle) => vehicle.image);
  const makes = inventory?.makes ?? [];

  return (
    <div className="linkdrive-home bg-[#f4f6f9] text-[#1e2026]">
      <section className="drive-hero" aria-labelledby="hero-title">
        <div className="drive-hero-image" role="img" aria-label={heroCar ? `Featured ${vehicleName(heroCar)}` : "Porsche on an open road"} style={{ backgroundImage: cssUrl(heroCar?.image || HERO_FALLBACK) }} />
        <div className="drive-hero-shade" />
        <div className="drive-hero-content">
          <p className="drive-eyebrow"><span /> Lusaka, Zambia. Open roads ahead.</p>
          <h1 id="hero-title">Linkdrive<br /><span>Auto Hub.</span></h1>
          <p className="drive-hero-copy">Find your car. Make your move.<br />A new connection to the road starts here.</p>
          <div className="drive-hero-actions">
            <Link href="/inventory" className="drive-button">Find your next drive <ArrowRight size={18} /></Link>
            <Link href="/sell" className="drive-text-link">Sell or swap <MoveUpRight size={16} /></Link>
          </div>
        </div>
        <div className="drive-hero-bottom">
          <span className="drive-hero-note"><MoveUpRight size={28} className="drive-route-mark" aria-hidden="true" /> GOOD CARS. REAL CONNECTIONS.</span>
          <Link href={heroCar ? `/inventory/${heroCar.slug}` : "/inventory"} className="drive-spotlight">
            <span><small>{heroCar ? "In the spotlight" : "Your next chapter"}</small><strong>{heroCar ? vehicleName(heroCar) : "Explore the collection"}</strong></span>
            {heroCar && <span className="drive-spotlight-price"><Price amount={heroCar.price} /></span>}
            <span className="drive-arrow"><MoveUpRight size={20} /></span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="finder-title" className="drive-finder">
        <div className="drive-finder-inner">
          <div className="drive-finder-heading"><span className="drive-index">01 / DISCOVER</span><h2 id="finder-title">What&apos;s your next move?</h2></div>
          <form action="/inventory" className="drive-search">
            <label><span>Make or model</span><input name="q" placeholder="Your next drive..." /></label>
            <label><span>Make</span><select name="make" defaultValue=""><option value="">All makes</option>{makes.map((make) => <option key={make}>{make}</option>)}</select></label>
            <label><span>Body style</span><select name="body" defaultValue=""><option value="">All body styles</option>{BODY_STYLES.map((body) => <option key={body}>{body}</option>)}</select></label>
            <button type="submit"><Search size={18} /> Find my drive</button>
          </form>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-8 px-5 sm:px-8 md:grid-cols-4 lg:px-12">
          {[
            ["Thoughtfully sourced", "Every car has a story worth knowing"],
            ["One-to-one guidance", "Real people, here when you need us"],
            ["Transparent from day one", "No surprises. Just honest answers"],
            ["Here for the long run", "Support beyond the handover"],
          ].map(([title, caption], index) => (
            <div key={title} className={`px-2 sm:px-5 ${index > 0 ? "md:border-l md:border-[#e1e3e9]" : ""}`}>
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#e5eaf6] text-[#4b597b]"><Check size={14} /></div>
              <h3 className="text-[13px] font-semibold text-[#2d3139]">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#778095]">{caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mb-9 flex items-end justify-between gap-5 sm:mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#70798e]">The collection</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.06em] text-[#1e2026] sm:text-4xl">A few worth a closer look.</h2>
          </div>
          <Link href="/inventory" className="hidden items-center gap-2 text-sm font-semibold text-[#4a505e] transition hover:text-[#1769c2] sm:flex">View all vehicles <ArrowRight size={15} /></Link>
        </div>

        {featured.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#cfd3db] bg-white px-6 py-14 text-center text-sm text-[#676f82]">
            New arrivals are being prepared. <Link href="/contact" className="font-semibold text-[#0f172a] underline underline-offset-4">Tell us what you’re looking for</Link>.
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((vehicle) => (
            <Link key={vehicle.slug} href={`/inventory/${vehicle.slug}`} className="group overflow-hidden rounded-b-[20px] border border-[#e1e3e9] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.1)]">
              <div className="relative aspect-[1.48] overflow-hidden bg-[#eaecf0]">
                <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]" role="img" aria-label={vehicleName(vehicle)} style={vehicle.image ? { backgroundImage: cssUrl(vehicle.image) } : undefined} />
                {vehicle.badge && <span className="absolute left-4 top-4 rounded-full bg-[#eaeffa] px-3 py-1.5 text-[9px] font-bold tracking-[0.14em] text-[#303f61]">{vehicle.badge}</span>}
                <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-[#2a2e36] transition group-hover:bg-[#1769c2] group-hover:text-white"><MoveUpRight size={16} /></span>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#778094]">{vehicle.year} <span className="mx-1 text-[#bbc0ca]">/</span> {vehicle.body} <span className="mx-1 text-[#bbc0ca]">/</span> {vehicle.mileage.toLocaleString()} km</p>
                <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.04em] text-[#1d2129]">{vehicle.make} <span className="font-normal">{vehicle.model}</span></h3>
                <div className="mt-5 flex items-end justify-between border-t border-[#e7e9ef] pt-4">
                  <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#1d2129]"><Price amount={vehicle.price} /></span>
                  <span className="text-[11px] font-semibold text-[#656d80] transition group-hover:text-[#2a2e36]">Discover <ArrowRight size={13} className="ml-1 inline" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/inventory" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#4a505e] sm:hidden">View all vehicles <ArrowRight size={15} /></Link>
      </section>

      {/*<section id="approach" className="drive-approach py-16 text-[#f0f3f9] sm:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <div>
            <p className="drive-index">02 / THE LINKDRIVE DIFFERENCE</p>
            <h2 className="mt-4 max-w-md text-3xl font-medium leading-tight sm:text-5xl">Less friction.<br /><span className="text-[var(--brand-highlight)]">More forward.</span></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">We believe the best way to find your next car is with time, trust and a little more attention to the details. That’s how we do things here.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 transition hover:underline">Get to know us <ArrowRight size={15} /></Link>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            {reasons.map(({ icon: Icon, title, copy }, index) => (
              <div key={title} className="border-t border-white/20 pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--brand)] text-white"><Icon size={18} strokeWidth={1.6} /></span>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">0{index + 1}</p>
                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-white/75">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      <section id="financing" className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="relative overflow-hidden rounded-[24px] bg-[#dbe2f1] px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border border-[#c4cce0] sm:right-8 sm:top-[-120px] sm:h-[460px] sm:w-[460px]" />
          <div className="pointer-events-none absolute -right-1 -top-14 h-52 w-52 rounded-full border border-[#c4cce0] sm:right-16 sm:top-[-88px] sm:h-[360px] sm:w-[360px]" />
          <div className="relative max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6680]">The numbers, made clearer</p>
            <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.06em] text-[#1e2026] sm:text-4xl">Let’s make the next step feel simple.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#61697b]">From understanding your options to arranging a viewing, our team is here to make the process feel straightforward—and personal.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#1258a6]">Talk through your options <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section id="sell" className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: HandCoins, eyebrow: "Sell to Linkdrive", title: "Get a fair offer for your car.", copy: "Share a few details and photos. We’ll review your car and come back with a straightforward offer—no listings, no strangers.", href: "/sell?type=Sell", cta: "Get an offer" },
            { icon: Repeat2, eyebrow: "Swap & top-up", title: "Trade in and drive away in something new.", copy: "Use your current car as part-payment on any vehicle in our collection and simply top up the difference.", href: "/sell?type=Swap", cta: "Start a swap" },
          ].map(({ icon: Icon, eyebrow, title, copy, href, cta }) => (
            <Link key={href} href={href} className="group flex flex-col justify-between gap-8 rounded-[24px] border border-[#dbe2f1] bg-white p-7 transition hover:-translate-y-1 hover:border-[#1769c2]/40 hover:shadow-[0_20px_48px_rgba(29,78,216,0.12)] sm:p-9">
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#dbeafe] text-[#1769c2]"><Icon size={19} /></span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1769c2]">{eyebrow}</p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.05em] text-[#1e2026] sm:text-3xl">{title}</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#61697b]">{copy}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1769c2]">{cta} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#e1e3e9] bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-end lg:px-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#70798e]">Ready when you are</p>
            <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-[-0.06em] text-[#1e2026] sm:text-4xl">Some things are better talked through.</h2>
            <p className="mt-3 text-sm leading-6 text-[#697286]">Tell us what you’re looking for. We’ll take it from there.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/inventory" className="inline-flex items-center gap-2 rounded-full border border-[#d5d9e1] px-6 py-4 text-[13px] font-semibold text-[#353943] transition hover:bg-[#ebeef6]">Browse the collection <ArrowRight size={15} /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-6 py-4 text-[13px] font-bold text-white transition hover:bg-[#1258a6]">Get in touch <MoveUpRight size={15} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
