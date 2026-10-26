"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, HandCoins, ImagePlus, Loader2, MessageSquareText, Repeat2, Send, Star, Trash2, X } from "lucide-react";
import { useSite } from "@/components/dealership/SiteProvider";
import { prepareImage } from "@/lib/image-upload";
import { MAX_TRADE_IN_PHOTOS, TRADE_IN_CONDITIONS, submitTradeIn, uploadTradeInPhoto, vehicleName, type TradeInType, type Vehicle } from "@/lib/portal";

const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const BODIES = ["SUV", "Sedan", "Hatchback", "Wagon", "Truck", "Coupe", "Convertible"];
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const inputClass = "w-full rounded-xl border border-[#dbdfe7] bg-[#f6f8fb] px-4 py-3 text-sm text-[#1e222b] outline-none transition placeholder:text-[#959cac] focus:border-[#1769c2] focus:bg-white";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#747d91]";

type Photo = { id: string; preview: string; url?: string; error?: string };

export default function TradeInForm({ vehicles, defaultType = "Sell", defaultVehicle = "" }: { vehicles: Vehicle[]; defaultType?: TradeInType; defaultVehicle?: string }) {
  const { price, settings } = useSite();
  const [type, setType] = useState<TradeInType>(defaultType);
  const [target, setTarget] = useState(vehicles.some((v) => v.slug === defaultVehicle) ? defaultVehicle : "");
  const [value, setValue] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const targetVehicle = vehicles.find((v) => v.slug === target);
  const amount = Number(value) || 0;
  const topUp = targetVehicle && amount ? Math.max(0, targetVehicle.price - amount) : 0;
  const uploading = photos.some((p) => !p.url && !p.error);
  const ready = photos.filter((p) => p.url);
  const thisYear = new Date().getFullYear();

  async function addFiles(list: FileList | File[] | null) {
    const all = Array.from(list ?? []);
    const files = all.filter((file) => ACCEPTED.includes(file.type)).slice(0, MAX_TRADE_IN_PHOTOS - photos.length);
    if (!all.length) return;
    if (files.length < all.length) setError(`Some files were skipped. You can add up to ${MAX_TRADE_IN_PHOTOS} JPEG, PNG, WebP or AVIF photos.`);
    else setError("");
    const added = files.map((file) => ({ file, photo: { id: crypto.randomUUID(), preview: URL.createObjectURL(file) } as Photo }));
    setPhotos((current) => [...current, ...added.map((a) => a.photo)]);
    if (fileInput.current) fileInput.current.value = "";

    const queue = [...added];
    const worker = async () => {
      for (let next = queue.shift(); next; next = queue.shift()) {
        const { file, photo } = next;
        try {
          const url = await uploadTradeInPhoto(await prepareImage(file));
          setPhotos((current) => current.map((p) => (p.id === photo.id ? { ...p, url } : p)));
        } catch (caught) {
          const message = caught instanceof Error ? caught.message : "Upload failed";
          setPhotos((current) => current.map((p) => (p.id === photo.id ? { ...p, error: message } : p)));
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(3, added.length) }, worker));
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const photo = current.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return current.filter((p) => p.id !== id);
    });
  }

  function makeCover(id: string) {
    setPhotos((current) => [...current.filter((p) => p.id === id), ...current.filter((p) => p.id !== id)]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return setError("Please wait for your photos to finish uploading.");
    if (!ready.length) return setError("Please add at least one photo of your car.");
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    setPending(true);
    setError("");
    try {
      const response = await submitTradeIn({
        type,
        name: data.name, email: data.email, phone: data.phone,
        make: data.make, model: data.model, year: Number(data.year), mileage: Number(data.mileage),
        fuel: data.fuel, transmission: data.transmission, body: data.body, color: data.color ?? "",
        condition: data.condition as (typeof TRADE_IN_CONDITIONS)[number],
        askingPrice: amount, targetVehicleSlug: type === "Swap" ? target : "", notes: data.notes ?? "",
        images: ready.map((p) => p.url!), website: data.website ?? "",
      });
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      setToken(response.token ?? "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (token !== null) {
    return (
      <div className="rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] p-8 text-center" role="status">
        <CheckCircle2 size={34} className="mx-auto text-[#1769c2]" />
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#0b1a3f]">Thank you. We&apos;ve received your car.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#4b5875]">
          Our team will review your photos and details and come back to you with {type === "Sell" ? "an offer" : "a trade-in value and top-up amount"}. We&apos;ve emailed you a private link to follow the conversation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {token && <Link href={`/messages/${token}`} className="inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1258a6]"><MessageSquareText size={15} /> Open the conversation</Link>}
          <Link href="/inventory" className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-white px-5 py-3 text-sm font-semibold text-[#1769c2] transition hover:bg-[#dbeafe]">Browse our cars <ArrowRight size={15} /></Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div role="tablist" aria-label="What would you like to do?" className="grid gap-3 sm:grid-cols-2">
        {([["Sell", "Sell my car to Linkdrive", "Get a fair cash offer for your car.", HandCoins], ["Swap", "Swap & top-up", "Trade in your car and pay the difference.", Repeat2]] as const).map(([value, title, text, Icon]) => (
          <button key={value} type="button" role="tab" aria-selected={type === value} onClick={() => setType(value)}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${type === value ? "border-[#1769c2] bg-[#eff6ff] ring-1 ring-[#1769c2]" : "border-[#dfe2e8] bg-white hover:border-[#93c5fd]"}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${type === value ? "bg-[#1769c2] text-white" : "bg-[#eef2f8] text-[#4d5a77]"}`}><Icon size={18} /></span>
            <span><span className="block text-sm font-semibold text-[#0b1a3f]">{title}</span><span className="mt-1 block text-xs leading-5 text-[#677087]">{text}</span></span>
          </button>
        ))}
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <fieldset className="space-y-4">
        <legend className="mb-4 text-lg font-medium tracking-[-0.03em] text-[#1d2129]">1. Your car</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-2"><span className={labelClass}>Make</span><input name="make" required maxLength={60} className={inputClass} placeholder="e.g. Toyota" /></label>
          <label className="block space-y-2"><span className={labelClass}>Model</span><input name="model" required maxLength={80} className={inputClass} placeholder="e.g. Hilux" /></label>
          <label className="block space-y-2"><span className={labelClass}>Year</span><input name="year" type="number" required min={1950} max={thisYear + 1} className={inputClass} placeholder={String(thisYear - 5)} /></label>
          <label className="block space-y-2"><span className={labelClass}>Mileage (km)</span><input name="mileage" type="number" required min={0} max={2000000} className={inputClass} placeholder="85000" /></label>
          <label className="block space-y-2"><span className={labelClass}>Fuel</span><select name="fuel" required className={inputClass}>{FUELS.map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="block space-y-2"><span className={labelClass}>Transmission</span><select name="transmission" required className={inputClass}>{TRANSMISSIONS.map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="block space-y-2"><span className={labelClass}>Body type</span><select name="body" required className={inputClass}>{BODIES.map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="block space-y-2"><span className={labelClass}>Colour <span className="normal-case tracking-normal text-[#959cac]">(optional)</span></span><input name="color" maxLength={40} className={inputClass} placeholder="e.g. White" /></label>
          <label className="block space-y-2"><span className={labelClass}>Condition</span><select name="condition" required defaultValue="Good" className={inputClass}>{TRADE_IN_CONDITIONS.map((v) => <option key={v}>{v}</option>)}</select></label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-lg font-medium tracking-[-0.03em] text-[#1d2129]">2. Photos</legend>
        <p className="mb-4 text-xs leading-5 text-[#677087]">Add up to {MAX_TRADE_IN_PHOTOS} photos: front, back, both sides, interior, dashboard (showing mileage) and any damage. The first photo is the cover.</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setDragging(false); void addFiles(e.dataTransfer.files); }}
          className={`rounded-2xl border-2 border-dashed p-4 transition ${dragging ? "border-[#1769c2] bg-[#eff6ff]" : "border-[#d5dbe6] bg-[#f8fafc]"}`}
        >
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {photos.map((photo, index) => (
              <div key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e5e9f0]">
                {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                <img src={photo.preview} alt={`Photo ${index + 1}`} className={`h-full w-full object-cover ${photo.url ? "" : "opacity-60"}`} />
                {index === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-[#1769c2] px-1.5 py-0.5 text-[9px] font-semibold text-white">Cover</span>}
                {!photo.url && !photo.error && <span className="absolute inset-0 grid place-items-center"><Loader2 size={20} className="animate-spin text-[#1769c2]" /></span>}
                {photo.error && <span className="absolute inset-x-0 bottom-0 bg-[#b42318]/90 px-1.5 py-1 text-[9px] leading-3 text-white" title={photo.error}>Upload failed</span>}
                <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  {index > 0 && photo.url && <button type="button" onClick={() => makeCover(photo.id)} aria-label="Make cover photo" title="Make cover" className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-[#1769c2]"><Star size={12} /></button>}
                  <button type="button" onClick={() => removePhoto(photo.id)} aria-label="Remove photo" title="Remove" className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-[#b42318]">{photo.error ? <X size={12} /> : <Trash2 size={12} />}</button>
                </div>
              </div>
            ))}
            {photos.length < MAX_TRADE_IN_PHOTOS && (
              <button type="button" onClick={() => fileInput.current?.click()} className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border border-[#cbd5e1] bg-white text-[10px] font-semibold text-[#1769c2] transition hover:border-[#1769c2] hover:bg-[#eff6ff]">
                {photos.length ? <ImagePlus size={20} /> : <Camera size={20} />}{photos.length ? "Add more" : "Add photos"}
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-[#7b8397]">
            {uploading ? "Uploading photos…" : `${ready.length}/${MAX_TRADE_IN_PHOTOS} photos added. Select several at once or drag and drop them here.`}
          </p>
        </div>
        <input ref={fileInput} type="file" accept={ACCEPTED.join(",")} multiple hidden onChange={(e) => void addFiles(e.target.files)} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 text-lg font-medium tracking-[-0.03em] text-[#1d2129]">3. {type === "Sell" ? "Your price" : "Your swap"}</legend>
        {type === "Swap" && (
          <label className="block space-y-2">
            <span className={labelClass}>Car you&apos;d like from our stock <span className="normal-case tracking-normal text-[#959cac]">(optional)</span></span>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className={inputClass}>
              <option value="">I&apos;m not sure yet. Please suggest options</option>
              {vehicles.map((v) => <option key={v.slug} value={v.slug}>{vehicleName(v)} · {price(v.price)}</option>)}
            </select>
          </label>
        )}
        <label className="block space-y-2">
          <span className={labelClass}>{type === "Sell" ? "Asking price" : "What you think your car is worth"} ({settings.currency}) <span className="normal-case tracking-normal text-[#959cac]">(optional)</span></span>
          <input type="number" min={0} step={1} value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} placeholder="0" />
        </label>
        {type === "Swap" && targetVehicle && (
          <div className="rounded-2xl bg-[#0b1a3f] p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-[#bfdbfe]">{vehicleName(targetVehicle)}</span><span className="font-semibold" suppressHydrationWarning>{price(targetVehicle.price)}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-[#bfdbfe]">Your car (your estimate)</span><span className="font-semibold" suppressHydrationWarning>{amount ? `− ${price(amount)}` : "—"}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-white/15 pt-4">
              <span className="text-xs uppercase tracking-[0.14em] text-[#93c5fd]">Estimated top-up</span>
              <span className="text-2xl font-semibold tracking-[-0.04em]" suppressHydrationWarning>{amount ? price(topUp) : "Add your estimate"}</span>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-[#bfdbfe]">This is an estimate only. Your final top-up depends on our inspection and valuation of your car.</p>
          </div>
        )}
        <label className="block space-y-2">
          <span className={labelClass}>Anything else? <span className="normal-case tracking-normal text-[#959cac]">(optional)</span></span>
          <textarea name="notes" rows={3} maxLength={2000} className={`${inputClass} resize-y`} placeholder="Service history, outstanding finance, number of owners, known issues…" />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 text-lg font-medium tracking-[-0.03em] text-[#1d2129]">4. Your details</legend>
        <label className="block space-y-2"><span className={labelClass}>Your name</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" className={inputClass} placeholder="Full name" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2"><span className={labelClass}>Phone</span><input name="phone" type="tel" required minLength={6} maxLength={30} pattern="[+\d\s\(\)\-]*" autoComplete="tel" className={inputClass} placeholder="+260 …" /></label>
          <label className="block space-y-2"><span className={labelClass}>Email</span><input name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="you@example.com" /></label>
        </div>
      </fieldset>

      {error && <p role="alert" className="rounded-xl bg-[#fbefe8] px-4 py-3 text-xs text-[#a3573a]">{error}</p>}

      <button type="submit" disabled={pending || uploading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1769c2] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1258a6] disabled:cursor-not-allowed disabled:opacity-60">
        {pending || uploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
        {pending ? "Sending…" : uploading ? "Uploading photos…" : type === "Sell" ? "Get my offer" : "Request my swap quote"}
      </button>
      <p className="text-center text-[10px] leading-5 text-[#838b9d]">No obligation. We only use your details and photos to assess your car and respond to this request.</p>
    </form>
  );
}
