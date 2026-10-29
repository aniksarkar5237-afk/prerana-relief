import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PreranaAid | Protecting Lives, Restoring the Delta",
  description: "A high-trust, decentralized emergency relief and evacuation platform. Protecting vulnerable communities, dispatching emergency rescue, and monitoring flood radar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#0e1311] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
