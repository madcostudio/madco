"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Panorama } from "@/components/ui/Panorama";
import { Magnetic } from "@/components/ui/Magnetic";
import { SpeedStreak } from "@/components/ui/SpeedStreak";
import { ImpossibleHeadline } from "@/components/ui/ImpossibleHeadline";
import { ArrowRight, MessageSquare, ChevronDown, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { config } from "@/lib/config";

const VENUES = [
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
      {
        id: "lighting",
        lat: 16,
        lon: 295,
        label: "Warm Environment Lighting",
        description: "Amber hand-blown glass fixtures engineered to maintain a cozy, high-retention atmosphere.",
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
  const { scrollY } = useScroll();
  const [activeVenue, setActiveVenue] = useState(VENUES[0]);

  // Create layered depth scroll-parallax offsets
  const yHeader = useTransform(scrollY, [0, 600], [0, -30]);
  const yHeadline = useTransform(scrollY, [0, 600], [0, -50]);
  const yText = useTransform(scrollY, [0, 600], [0, -70]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.2]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO LANDING FOLD (100vh Clean Focus on Typography & CTAs)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-start px-6 pt-24 pb-16 overflow-hidden md:px-12 xl:px-24">
        {/* Background Subtle Kinetic Atmosphere */}
        <SpeedStreak />

        {/* Hero Content Container */}
        <motion.div
          style={{ opacity: opacityHero }}
          className="relative z-10 mx-auto max-w-7xl w-full text-left flex flex-col gap-6 md:gap-7 my-auto"
        >
          {/* Studio Location Status Badge */}
          <motion.div
            style={{ y: yHeader }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-[#d4af37] uppercase">
              MAD.CO STUDIO // MANGALORE, INDIA
            </span>
          </motion.div>

          {/* Dynamic Headline */}
          <motion.div
            style={{ y: yHeadline }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImpossibleHeadline />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            style={{ y: yText }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed font-sans"
          >
            We don&apos;t sell 360° photography. We sell attention. We sell walk-ins.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            style={{ y: yText }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2 md:mt-4"
          >
            <Magnetic>
              <Link 
                href="/contact" 
                className="relative overflow-hidden group flex items-center gap-2 px-6 py-4 bg-mad-red text-white text-sm font-mono tracking-widest uppercase rounded border border-mad-red hover:bg-dark-crimson transition-colors duration-300 shadow-[0_0_20px_rgba(245,37,15,0.3)]"
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
                className="flex items-center gap-2 px-6 py-4 bg-transparent hover:bg-surface-2 text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/10 hover:border-white/20"
              >
                <MessageSquare className="h-4 w-4 text-mad-azure" />
                <span>WhatsApp Quick Connect</span>
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Clean Scroll Cue Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20 text-neutral-500"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll To Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-mad-red/80" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE 360° PANORAMA SHOWCASE (Revealed on Scroll)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full px-6 py-16 md:py-24 overflow-hidden md:px-12 xl:px-24 bg-background border-t border-white/5">
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
              {VENUES.map((venue, idx) => {
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
                    0{idx + 1} // {venue.name}
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
            <span className="hidden sm:inline text-mad-red">
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
