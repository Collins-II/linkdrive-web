"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, LockKeyhole, Send } from "lucide-react";
import { PortalError, cssUrl, portalFetch, vehicleName, type Thread, type ThreadMessage } from "@/lib/portal";

const POLL_MS = 20_000;

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-ZM", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ConversationThread({ token }: { token: string }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const path = `/api/public/conversations/${encodeURIComponent(token)}`;

  const load = useCallback(async () => {
    try {
      setThread(await portalFetch<Thread>(path));
      setError("");
    } catch (caught) {
      if (caught instanceof PortalError && caught.status === 404) setNotFound(true);
      else setError(caught instanceof Error ? caught.message : "We couldn't load this conversation.");
    }
  }, [path]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  const messageCount = thread?.messages.length ?? 0;
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messageCount]);

  async function send(event?: React.FormEvent) {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setSendError("");
    try {
      const message = await portalFetch<ThreadMessage>(path, { method: "POST", body: { body } });
      setThread((current) => current && { ...current, conversation: { ...current.conversation, status: "open" }, messages: [...current.messages, message] });
      setDraft("");
    } catch (caught) {
      setSendError(caught instanceof Error ? caught.message : "Your message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  if (notFound) {
    return (
      <div className="rounded-[22px] border border-[#dfe2e8] bg-white p-10 text-center">
        <LockKeyhole size={28} className="mx-auto text-[#828ca5]" />
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">This link isn’t valid</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#676f82]">The conversation may have been removed, or the link was copied incompletely. Please check the email we sent you, or start a new conversation.</p>
        <Link href="/contact" className="mt-6 inline-flex rounded-full bg-[#1769c2] px-5 py-3 text-sm font-semibold text-white">Contact us</Link>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-[#676f82]" role="status">
        {error ? <div className="text-center"><p>{error}</p><button onClick={() => void load()} className="mt-4 rounded-full border border-[#dbdfe7] px-5 py-2.5 text-xs font-semibold">Try again</button></div> : <Loader2 className="animate-spin" />}
      </div>
    );
  }

  const { conversation, messages } = thread;
  return (
    <div>
      <Link href="/inventory" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6a7388] transition hover:text-[#1769c2]"><ArrowLeft size={14} /> Back to the collection</Link>
      <header className="mt-7 flex flex-col gap-5 rounded-t-[22px] border border-[#dfe2e8] bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#747d91]">Your conversation with {conversation.dealership}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{conversation.subject}</h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-[#7b8397]"><LockKeyhole size={12} /> Private link. Keep it to yourself.</p>
        </div>
        {conversation.vehicle && (
          <Link href={`/inventory/${conversation.vehicle.slug}`} className="flex items-center gap-3 rounded-2xl border border-[#e4e7ee] p-2 pr-4 transition hover:bg-[#f6f8fb]">
            <span className="h-14 w-20 shrink-0 rounded-xl bg-[#eaecf0] bg-cover bg-center" style={conversation.vehicle.image ? { backgroundImage: cssUrl(conversation.vehicle.image) } : undefined} />
            <span className="text-xs font-semibold text-[#2d3139]">{vehicleName(conversation.vehicle)}</span>
          </Link>
        )}
      </header>

      <div className="max-h-[60vh] min-h-[280px] space-y-4 overflow-y-auto border-x border-[#dfe2e8] bg-[#f6f8fb] p-5 sm:p-8" aria-live="polite">
        {messages.map((message) => {
          const mine = message.sender === "customer";
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${mine ? "bg-[#1769c2] text-white" : "border border-[#dfe2e8] bg-white text-[#2d3139]"}`}>
                <p className={`mb-1 text-[10px] font-semibold ${mine ? "text-white/60" : "text-[#747d91]"}`}>{mine ? "You" : message.authorName || conversation.dealership} · {formatTime(message.createdAt)}</p>
                <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="rounded-b-[22px] border border-[#dfe2e8] bg-white p-4 sm:p-6">
        <label htmlFor="reply" className="sr-only">Your reply</label>
        <textarea
          id="reply"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) void send(); }}
          rows={3}
          maxLength={4000}
          placeholder={conversation.status === "closed" ? "This conversation is closed. Send a message to reopen it." : "Write a reply…"}
          className="w-full resize-y rounded-xl border border-[#dbdfe7] bg-[#f6f8fb] px-4 py-3 text-sm outline-none transition focus:border-[#8897bb] focus:bg-white"
        />
        {sendError && <p role="alert" className="mt-2 text-xs text-[#a3573a]">{sendError}</p>}
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-[10px] text-[#838b9d]">We’ll email you when the team replies. Ctrl + Enter to send.</span>
          <button type="submit" disabled={sending || !draft.trim()} className="inline-flex items-center gap-2 rounded-full bg-[#1769c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1258a6] disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Send
          </button>
        </div>
      </form>
    </div>
  );
}
