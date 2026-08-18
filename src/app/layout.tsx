import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Infinity Web & Apps — Websites. Mobile Apps. Digital Growth.",
    template: "%s · Infinity Web & Apps",
  },
  description:
    "Infinity Web & Apps builds modern websites, powerful mobile applications, and digital growth solutions designed to help businesses grow.",
  keywords: [
    "web development",
    "mobile app development",
    "digital marketing",
    "SEO",
    "CRM",
    "Infinity Web & Apps",
  ],
  authors: [{ name: "Infinity Web & Apps" }],
  openGraph: {
    type: "website",
    title: "Infinity Web & Apps",
    description: "Websites. Mobile Apps. Digital Growth.",
    url: SITE_URL,
    siteName: "Infinity Web & Apps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Web & Apps",
    description: "Websites. Mobile Apps. Digital Growth.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-white font-sans">{children}</body>
    </html>
  );
}
