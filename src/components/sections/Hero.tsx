"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Panorama } from "@/components/ui/Panorama";
import { Magnetic } from "@/components/ui/Magnetic";
import { SpeedStreak } from "@/components/ui/SpeedStreak";
import { ImpossibleHeadline } from "@/components/ui/ImpossibleHeadline";
import { TinyPlanetHero } from "@/components/ui/TinyPlanetHero";
import { ArrowRight, MessageSquare, ChevronDown, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { config } from "@/lib/config";

const SHOWCASE_VENUES = [
  {
    id: "cafe",
    name: "Café Esthétique",
    tag: "Specialty Coffee & Workspace",
    image: "/cafe_360.png",
    hotspots: [
      {
        id: "brew",
        lat: -12,
        lon: 135,
        label: "Slayer Espresso Bar",
        description: "Equipped with custom Slayer Steam LP machines and Mahlkönig grinders for specialty espresso craft.",
      },
      {
        id: "lounge",
        lat: -18,
        lon: 215,
        label: "Premium Creator Seating",
        description: "Ergonomic leather banquettes and charging hubs optimized for creators, business meetings, and remote work.",
      },
    ],
  },
  {
    id: "restaurant",
    name: "The Ember Dining Club",
    tag: "Artisanal Kitchen & Lounge",
    image: "/restaurant_360.png",
    hotspots: [
      {
        id: "open-kitchen",
        lat: -8,
        lon: 90,
        label: "Open Fire Hearth",
        description: "Wood-fired live culinary stage creating an immersive dining and social experience.",
      },
      {
        id: "cocktail-bar",
        lat: -14,
        lon: 230,
        label: "Craft Mixology Counter",
        description: "Custom brass backbar with curated single-estate spirits and bespoke cocktail curation.",
      },
    ],
  },
  {
    id: "gym",
    name: "Titan Strength & Conditioning",
    tag: "High-Performance Athletic Arena",
    image: "/gym_360.png",
    hotspots: [
      {
        id: "turf",
        lat: -15,
        lon: 180,
        label: "Sprint & Agility Turf",
        description: "Olympic-grade shock absorbing turf for high-intensity athletic conditioning.",
      },
      {
        id: "racks",
        lat: -6,
        lon: 310,
        label: "Hammer Strength Racks",
        description: "Custom power racks and precision calibrated competition bumper plates.",
      },
    ],
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeVenue, setActiveVenue] = useState(SHOWCASE_VENUES[0]);

  // Track scroll progression across pinned hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform 0 -> 1 for Tiny Planet unrolling into full 360 showroom
  const planetProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  // Fade writing out 100% (to 0 opacity) as user scrolls down
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => v > 0.22 ? "none" : "auto");
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          PINNED SCROLL-PROGRESSIVE HERO (TINY PLANET -> 360 SHOWROOM)
          ═══════════════════════════════════════════════════════════════ */}
      <div ref={containerRef} className="relative h-[220vh] w-full">
        <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-start px-6 pt-24 pb-16 overflow-hidden md:px-12 xl:px-24">
          
          {/* Background 360 Tiny Planet WebGL Canvas (VIP Motors Dubai luxury supercar showroom) */}
          <TinyPlanetHero
            src="/dealership_360.jpg"
            scrollProgress={planetProgress}
          />

          {/* Background Subtle Kinetic Streak */}
          <SpeedStreak />

          {/* Hero Content Container - Fades out 100% on scroll */}
          <motion.div
            style={{ opacity: heroContentOpacity, y: heroContentY, pointerEvents: heroPointerEvents as any }}
            className="relative z-10 mx-auto max-w-7xl w-full text-left flex flex-col gap-6 md:gap-7 my-auto"
          >
            {/* Studio Location Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse shadow-[0_0_8px_#F5250F]" />
              <span className="font-mono text-xs tracking-widest text-[#d4af37] uppercase bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                MAD.CO STUDIO // MANGALORE, INDIA
              </span>
            </motion.div>

            {/* Dynamic Headline */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ImpossibleHeadline />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl text-lg md:text-xl text-neutral-200 leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              We don&apos;t sell 360° photography. We sell attention. We sell walk-ins.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-2 md:mt-4"
            >
              <Magnetic>
                <Link 
                  href="/contact" 
                  className="relative overflow-hidden group flex items-center gap-2 px-6 py-4 bg-mad-red text-white text-sm font-mono tracking-widest uppercase rounded border border-mad-red hover:bg-dark-crimson transition-colors duration-300 shadow-[0_0_25px_rgba(245,37,15,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Book Strategy Call</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Magnetic>

              <Magnetic>
                <a 
                  href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co Studio, I'd like to discuss improving my business digital presence.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-4 bg-black/60 hover:bg-surface-2 text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/15 hover:border-white/30 backdrop-blur-md"
                >
                  <MessageSquare className="h-4 w-4 text-mad-azure" />
                  <span>WhatsApp Quick Connect</span>
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* Interactive Scroll-to-Expand Indicator Cue - Fades out on scroll */}
          <motion.div
            style={{ opacity: scrollCueOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20 text-neutral-400"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white shadow-xl">
              <Compass className="w-3 h-3 text-mad-red animate-spin [animation-duration:6s]" />
              <span>Scroll down to dive into 360° space</span>
            </div>
            <ChevronDown className="w-4 h-4 animate-bounce text-mad-red" />
          </motion.div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE 360° PANORAMA SHOWCASE (Revealed on Scroll)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full px-6 py-16 md:py-24 overflow-hidden md:px-12 xl:px-24 bg-background border-t border-white/8">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 mx-auto max-w-7xl w-full flex flex-col gap-5 shadow-2xl"
        >
          {/* Header Metadata Ribbon & Interactive Space Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-white/10 text-[11px] font-mono tracking-widest uppercase rounded-sm shadow-md">
                <span className="h-2 w-2 rounded-full bg-mad-red animate-rec-pulse" />
                <span className="text-mad-red font-bold">LIVE SHOWCASE</span>
                <span className="text-text-secondary">// {activeVenue.name.toUpperCase()}</span>
              </div>
              <span className="hidden sm:inline font-mono text-xs text-text-secondary">
                {activeVenue.tag}
              </span>
            </div>

            {/* Interactive Venue Quick-Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-2 border border-white/10 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
              {SHOWCASE_VENUES.map((venue, idx) => {
                const isActive = activeVenue.id === venue.id;
                return (
                  <button
                    key={venue.id}
                    onClick={() => setActiveVenue(venue)}
                    className={`px-3 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-mad-red text-white font-bold shadow-md shadow-mad-red/20"
                        : "text-text-secondary hover:text-white hover:bg-white/5"
                    }`}
                  >
                    0{idx + 1} // {venue.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Drag & Hotspot Hint Bar */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Click glowing red pins to inspect spatial features</span>
            </span>
            <span className="hidden sm:inline text-mad-red font-bold">
              ● RESOLUTION: 8K SPATIAL HDR
            </span>
          </div>

          {/* 360 Panorama Viewport with key for dynamic re-render */}
          <div className="relative">
            <Panorama
              key={activeVenue.id}
              src={activeVenue.image}
              hotspots={activeVenue.hotspots}
            />
          </div>
        </motion.div>
      </section>
    </>
  );
}
