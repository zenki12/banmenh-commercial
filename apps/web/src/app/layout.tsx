import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { BackHomeBar, Footer, GalaxyBackgroundLazy, Header } from "../components/layout";
import { AuthProvider } from "../lib/auth";
import "../styles/tokens.css";
import "../styles/numerology-narrative.css";
import "../styles/numerology-grid-analysis.css";
import "../styles/numerology-result.css";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const lora = Lora({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bản Mệnh — Nền tảng tra cứu huyền học",
    template: "%s | Bản Mệnh",
  },
  description: "Nền tảng tra cứu huyền học module hóa.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${lora.variable}`}>
      <body
        className="relative isolate flex min-h-screen flex-col"
        suppressHydrationWarning
      >
        <GalaxyBackgroundLazy />
        {/* AuthProvider là client component — Next.js cho phép wrap server layout */}
        <AuthProvider>
          <Header />
          <BackHomeBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
