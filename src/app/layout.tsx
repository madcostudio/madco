import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noise } from "@/components/ui/Noise";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Magnetic } from "@/components/ui/Magnetic";
import { ScrollSetup } from "@/components/ui/ScrollSetup";
import { Logo } from "@/components/ui/Logo";
import { ApertureTransition } from "@/components/ui/ApertureTransition";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mad.co Studio — Experience-Led Spatial Marketing & 360 Tours",
  description: "We make brands impossible to ignore. Elite marketing agency specializing in immersive 360° virtual tours, high-speed digital presence, and local business growth campaigns. Based in Mangalore, India.",
  keywords: ["Mad.co Studio", "Virtual Tours Mangalore", "360 Photography India", "Local Business Growth", "Restaurant Marketing", "Cafe Virtual Scan"],
  authors: [{ name: "Mad.co Team" }],
  openGraph: {
    title: "Mad.co Studio — Experience-Led Spatial Marketing & 360 Tours",
    description: "We make brands impossible to ignore. Elite marketing agency in Mangalore creating high-end 360° interactive virtual tours and digital campaigns.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mad.co Studio — Immersive 360 Tours",
    description: "We sell attention, trust, and physical walk-ins. Immersive virtual experiences that scale local storefront visibility.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-mad-red selection:text-white">
        
        {/* Core Layout Decors */}
        <ScrollSetup />
        <ApertureTransition />
        <Noise />
        <AmbientGlow />

        {/* Global Navigation Header */}
        <header className="fixed top-0 inset-x-0 z-40 h-20 glass-morphism border-b border-white/5 flex items-center justify-between px-6 md:px-12 xl:px-24">
          <Logo />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest uppercase text-text-secondary">
            <Link href="/tours" className="hover:text-white transition-colors duration-300">
              360 Tours
            </Link>
            <Link href="/#work" className="hover:text-white transition-colors duration-300">
              Core Work
            </Link>
            <Link href="/#services" className="hover:text-white transition-colors duration-300">
              Competencies
            </Link>
            <Link href="/#process" className="hover:text-white transition-colors duration-300">
              System Process
            </Link>
          </nav>

          {/* Navigation Action */}
          <div>
            <Magnetic>
              <Link 
                href="/contact" 
                className="px-4 py-2 border border-white/10 hover:border-mad-red bg-surface-2 hover:bg-mad-red text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded cursor-pointer"
              >
                Book Call
              </Link>
            </Magnetic>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow z-10">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-white/5 bg-surface-1 py-16 px-6 md:px-12 xl:px-24 relative z-20 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-start justify-between gap-12">
            
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-1.5 group select-none">
                <span className="font-sans font-black text-2xl tracking-tighter uppercase text-white">
                  MAD.CO
                </span>
                <span className="h-2 w-2 rounded-full bg-mad-red animate-breathe" />
              </Link>
              <p className="max-w-xs text-xs text-text-secondary leading-relaxed font-sans">
                We design attention-led virtual scans and custom software. Making spaces impossible to ignore since 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 font-mono text-xs tracking-wider">
              <div className="flex flex-col gap-3">
                <h5 className="text-white uppercase font-bold text-[10px] tracking-widest opacity-60">// NAVIGATE</h5>
                <Link href="/tours" className="text-text-secondary hover:text-white transition-colors duration-300">
                  360 Tours
                </Link>
                <Link href="/#work" className="text-text-secondary hover:text-white transition-colors duration-300">
                  Core Work
                </Link>
                <Link href="/#services" className="text-text-secondary hover:text-white transition-colors duration-300">
                  Competencies
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                <h5 className="text-white uppercase font-bold text-[10px] tracking-widest opacity-60">// SPATIALS</h5>
                <Link href="/tours#packages" className="text-text-secondary hover:text-white transition-colors duration-300">
                  Pricing Plans
                </Link>
                <Link href="/contact" className="text-text-secondary hover:text-white transition-colors duration-300">
                  Book Spatial Audit
                </Link>
              </div>

              <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
                <h5 className="text-white uppercase font-bold text-[10px] tracking-widest opacity-60">// COMMUNICATE</h5>
                <a href="mailto:admin@madco.in" className="text-text-secondary hover:text-white transition-colors duration-300">
                  admin@madco.in
                </a>
                <a 
                  href="https://wa.me/918762640420" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-text-secondary hover:text-white transition-colors duration-300"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto w-full border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px] text-text-secondary">
            <div>&copy; {new Date().getFullYear()} MAD.CO STUDIO. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">TWITTER</a>
              <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
              <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
