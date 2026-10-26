"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Loader2, MessageSquareText, Send } from "lucide-react";
import { portalFetch } from "@/lib/portal";

type Mode = "enquiry" | "appointment";
type Result = { mode: Mode; token?: string; status?: string };

const inputClass = "w-full rounded-xl border border-[#dbdfe7] bg-[#f6f8fb] px-4 py-3 text-sm text-[#1e222b] outline-none transition placeholder:text-[#959cac] focus:border-[#8897bb] focus:bg-white";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#747d91]";

function localDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type EnquiryFormProps = {
  vehicleSlug?: string;
  vehicleName?: string;
  /** The appointment type booked from this form. */
  appointmentType?: "Test drive" | "Viewing" | "Consultation";
  defaultMode?: Mode;
};

export default function EnquiryForm({ vehicleSlug = "", vehicleName, appointmentType = vehicleSlug ? "Test drive" : "Consultation", defaultMode = "enquiry" }: EnquiryFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    setPending(true);
    setError("");
    try {
      if (mode === "enquiry") {
        const response = await portalFetch<{ token?: string }>("/api/public/enquiries", {
          method: "POST",
          body: { name: data.name, email: data.email, phone: data.phone, message: data.message, vehicleSlug, website: data.website },
        });
        setResult({ mode, token: response.token });
      } else {
        const response = await portalFetch<{ token?: string; status?: string }>("/api/public/appointments", {
          method: "POST",
          body: { name: data.name, email: data.email, phone: data.phone, date: data.date, time: data.time, notes: data.message, type: appointmentType, vehicleSlug, website: data.website },
        });
        setResult({ mode, token: response.token, status: response.status });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-[#c7d2ec] bg-[#eaeffa] p-6 text-center" role="status">
        <CheckCircle2 size={30} className="mx-auto text-[#2e4e99]" />
        <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#252933]">{result.mode === "enquiry" ? "Message received" : "Request received"}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#5d6476]">
          {result.mode === "enquiry"
            ? "Thank you. A member of our team will reply shortly. We’ve emailed you a private link to follow the conversation."
            : `Thank you. We’ll confirm your ${appointmentType.toLowerCase()} shortly. We’ve emailed you a private link to follow up.`}
        </p>
        {result.token && <Link href={`/messages/${result.token}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1258a6]"><MessageSquareText size={15} /> Open the conversation</Link>}
        <button type="button" onClick={() => setResult(null)} className="mt-4 block w-full text-xs font-semibold text-[#5d6476] underline underline-offset-4">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div role="tablist" aria-label="How can we help?" className="grid grid-cols-2 rounded-full bg-[#eaedf4] p-1 text-xs font-semibold">
        {([["enquiry", "Ask a question", MessageSquareText], ["appointment", vehicleSlug ? "Book a test drive" : "Book a visit", CalendarDays]] as const).map(([value, label, Icon]) => (
          <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => setMode(value)} className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 transition ${mode === value ? "bg-white text-[#0f172a] shadow-sm" : "text-[#6a7388] hover:text-[#1769c2]"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <label className="block space-y-2"><span className={labelClass}>Your name</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" className={inputClass} placeholder="Full name" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2"><span className={labelClass}>Email</span><input name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="you@example.com" /></label>
        <label className="block space-y-2"><span className={labelClass}>Phone <span className="normal-case tracking-normal text-[#959cac]">(optional)</span></span><input name="phone" type="tel" maxLength={30} pattern="[+\d\s\(\)\-]*" autoComplete="tel" className={inputClass} placeholder="+260 …" /></label>
      </div>

      {mode === "appointment" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2"><span className={labelClass}>Preferred date</span><input name="date" type="date" required min={localDate(0)} max={localDate(120)} defaultValue={localDate(1)} className={inputClass} /></label>
          <label className="block space-y-2"><span className={labelClass}>Preferred time</span><input name="time" type="time" required min="08:00" max="17:30" step={1800} defaultValue="10:00" className={inputClass} /></label>
        </div>
      )}

      <label className="block space-y-2">
        <span className={labelClass}>{mode === "enquiry" ? "Your message" : "Anything we should know?"}</span>
        <textarea
          name="message"
          required={mode === "enquiry"}
          minLength={mode === "enquiry" ? 2 : undefined}
          maxLength={mode === "enquiry" ? 3000 : 1000}
          rows={4}
          className={`${inputClass} resize-y`}
          defaultValue={mode === "enquiry" && vehicleName ? `Hello, I'm interested in the ${vehicleName}. Is it still available?` : ""}
          key={mode}
          placeholder={mode === "enquiry" ? "How can we help?" : "Optional"}
        />
      </label>

      {error && <p role="alert" className="rounded-xl bg-[#fbefe8] px-4 py-3 text-xs text-[#a3573a]">{error}</p>}

      <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1769c2] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1258a6] disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? <Loader2 size={16} className="animate-spin" /> : mode === "enquiry" ? <Send size={15} /> : <CalendarDays size={15} />}
        {pending ? "Sending…" : mode === "enquiry" ? "Send message" : "Request appointment"}
      </button>
      <p className="text-center text-[10px] leading-5 text-[#838b9d]">We only use your details to respond to this request.</p>
    </form>
  );
}
