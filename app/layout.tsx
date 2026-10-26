import type { Metadata, Viewport } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/footer";
import { SiteProvider } from "@/components/dealership/SiteProvider";
import { getSiteSettings } from "@/lib/portal";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkdrive Auto Hub | Lusaka",
  description: "A considered collection of exceptional cars, thoughtfully chosen in Lusaka, Zambia.",

  applicationName: "Linkdrive Auto Hub",
  manifest: "/manifest.json",
  icons: { icon: "/linkdrive_logo.jpg", apple: "/linkdrive_logo.jpg" },

  openGraph: {
    title: "Linkdrive Auto Hub | Lusaka",
    description: "A considered collection of exceptional cars, thoughtfully chosen in Lusaka, Zambia.",
    siteName: "Linkdrive Auto Hub",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Linkdrive Auto Hub | Lusaka",
    description: "A considered collection of exceptional cars, thoughtfully chosen in Lusaka, Zambia.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1769c2",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${manrope.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <NextTopLoader color="#1769c2" showSpinner={false} />
        <SiteProvider settings={settings}>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SiteProvider>
      </body>
    </html>
  );
}
