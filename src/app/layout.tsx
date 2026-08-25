import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noise } from "@/components/ui/Noise";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Magnetic } from "@/components/ui/Magnetic";
import { ScrollSetup } from "@/components/ui/ScrollSetup";
import { Logo } from "@/components/ui/Logo";
import { ApertureTransition } from "@/components/ui/ApertureTransition";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import Link from "next/link";
import NavigationWrapper from "@/components/ui/NavigationWrapper";
import { MobileNav } from "@/components/ui/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAD.Co — We Make Brands Impossible to Ignore",
  description: "Elite creative & spatial-marketing studio. Immersive 360° virtual tours, high-speed web design, NFC tap technology, and automation. Based in Mangalore, India.",
  keywords: [
    "MAD.Co", "virtual tours Mangalore", "360 photography India",
    "Google Business optimization Mangalore", "restaurant marketing",
    "cafe virtual tour", "NFC ordering", "QR menu",
    "website design Mangalore", "spatial marketing"
  ],
  authors: [{ name: "MAD.Co Studio" }],
  openGraph: {
    title: "MAD.Co — We Make Brands Impossible to Ignore",
    description: "Elite creative & spatial-marketing studio in Mangalore. Immersive 360° tours, ultra-fast web design, NFC tap tech, and automation.",
    type: "website",
    locale: "en_IN",
    siteName: "MAD.Co",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAD.Co — Immersive 360° Tours & Spatial Marketing",
    description: "We sell attention, trust, and walk-ins. Immersive virtual experiences that scale local storefront visibility.",
  },
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
      suppressHydrationWarning
    >
      <head>
        {/* Anton — display typeface (heavyweight condensed sans) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "MAD.Co Studio",
              "description": "Elite creative & spatial-marketing studio specializing in immersive 360° virtual tours, web design, NFC tap technology, and automation.",
              "url": "https://madco.in",
              "email": "admin@madco.in",
              "telephone": "+918762640420",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mangalore",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
              },
              "areaServed": "Mangalore",
              "sameAs": []
            }),
          }}
        />
      </head>
      <body 
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-mad-red selection:text-white"
      >
        
        {/* Core Layout Decors */}
        <ScrollSetup />
        <ApertureTransition />
        <Noise />
        <AmbientGlow />
        <WhatsAppFloat />

        <NavigationWrapper
          header={
            <header className="fixed top-0 inset-x-0 z-40 h-20 glass-morphism border-b border-white/5 flex items-center justify-between px-6 md:px-12 xl:px-24">
              <Logo />

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest uppercase text-text-secondary">
                <Link href="/tours" className="hover:text-white transition-colors duration-300">
                  360 Tours
                </Link>
                <Link href="/work" className="hover:text-white transition-colors duration-300">
                  Work
                </Link>
                <Link href="/#services" className="hover:text-white transition-colors duration-300">
                  Services
                </Link>
                <Link href="/process" className="hover:text-white transition-colors duration-300">
                  Process
                </Link>
                <Link href="/about" className="hover:text-white transition-colors duration-300">
                  Studio
                </Link>
              </nav>

              {/* Navigation Action */}
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <Magnetic>
                    <Link 
                      href="/contact" 
                      className="px-4 py-2 border border-white/10 hover:border-mad-red bg-surface-2 hover:bg-mad-red text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded cursor-pointer"
                    >
                      Book Call
                    </Link>
                  </Magnetic>
                </div>
                <MobileNav />
              </div>
            </header>
          }
          footer={
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
                    We make brands impossible to ignore. Elite creative & spatial-marketing studio. Making spaces impossible to ignore since 2026.
                  </p>
                  <p className="text-xs text-text-secondary font-mono tracking-wider">
                    madco.in
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 font-mono text-xs tracking-wider">
                  <div className="flex flex-col gap-3">
                    <h5 className="text-white uppercase font-bold text-[10px] tracking-widest opacity-60">// NAVIGATE</h5>
                    <Link href="/tours" className="text-text-secondary hover:text-white transition-colors duration-300">
                      360 Tours
                    </Link>
                    <Link href="/web-design" className="text-text-secondary hover:text-white transition-colors duration-300">
                      Web Design
                    </Link>
                    <Link href="/mad-tap" className="text-text-secondary hover:text-white transition-colors duration-300">
                      MAD Tap
                    </Link>
                    <Link href="/software" className="text-text-secondary hover:text-white transition-colors duration-300">
                      Automation
                    </Link>
                    <Link href="/work" className="text-text-secondary hover:text-white transition-colors duration-300">
                      Work
                    </Link>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h5 className="text-white uppercase font-bold text-[10px] tracking-widest opacity-60">// EXPLORE</h5>
                    <Link href="/process" className="text-text-secondary hover:text-white transition-colors duration-300">
                      Process
                    </Link>
                    <Link href="/about" className="text-text-secondary hover:text-white transition-colors duration-300">
                      Studio
                    </Link>
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
                <div><Link href="/" className="hover:text-text-secondary cursor-default select-none">&copy;</Link> {new Date().getFullYear()} MAD.CO STUDIO. ALL RIGHTS RESERVED.</div>
                <div className="flex gap-4">
                  <a href="https://instagram.com/madco.studio" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
                </div>
              </div>
            </footer>
          }
        >
          {children}
        </NavigationWrapper>

      </body>
    </html>
  );
}
