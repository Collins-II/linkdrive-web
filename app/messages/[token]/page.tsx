import type { Metadata } from "next";
import ConversationThread from "@/components/dealership/ConversationThread";

export const metadata: Metadata = {
  title: "Your conversation | Linkdrive Auto Hub",
  robots: { index: false, follow: false },
  // The URL contains a private access token, so never leak it to other sites.
  referrer: "no-referrer",
};

export default async function MessagesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="min-h-[75vh] bg-[#f4f6f9] px-5 pb-20 pt-10 text-[#1e2026] sm:px-8 sm:pt-14 lg:px-12">
      <div className="mx-auto max-w-[860px]">
        <ConversationThread token={token} />
      </div>
    </main>
  );
}
