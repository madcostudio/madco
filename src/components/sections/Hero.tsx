"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Panorama } from "@/components/ui/Panorama";
import { Magnetic } from "@/components/ui/Magnetic";
import { SpeedStreak } from "@/components/ui/SpeedStreak";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

const cafeHotspots = [
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
  }
];

export function Hero() {
  const { scrollY } = useScroll();

  // Create layered depth scroll-parallax offsets
  const yHeader = useTransform(scrollY, [0, 600], [0, -35]);
  const yHeadline = useTransform(scrollY, [0, 600], [0, -70]);
  const yText = useTransform(scrollY, [0, 600], [0, -100]);
  const yViewport = useTransform(scrollY, [0, 600], [0, 35]);

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center px-6 pt-36 pb-16 overflow-hidden md:px-12 xl:px-24">
      {/* Background Motion Lines */}
      <SpeedStreak />
      
      {/* Editorial Header */}
      <div className="relative z-10 mx-auto max-w-7xl w-full text-left flex flex-col gap-6">
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          {/* Logo red dot breathe style */}
          <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-championship-gold uppercase">
            MAD.CO STUDIO // MANGALORE, INDIA
          </span>
        </motion.div>

        <motion.h1
          style={{ y: yHeadline }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-black text-[12vw] sm:text-[9vw] md:text-[6vw] leading-[0.9] tracking-tighter text-white uppercase select-none"
        >
          WE MAKE BRANDS <br />
          <span className="text-stroke-red text-mad-red hover:text-white transition-colors duration-500">
            IMPOSSIBLE
          </span>{" "}
          TO IGNORE.
        </motion.h1>

        <motion.p
          style={{ y: yText }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed font-sans"
        >
          We don’t sell 360 photography. We sell attention. We sell walk-ins. We sell memorable first impressions.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          style={{ y: yText }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 mt-4"
        >
          <Magnetic>
            <Link 
              href="/contact" 
              className="relative overflow-hidden group flex items-center gap-2 px-6 py-4 bg-surface-2 text-white text-sm font-mono tracking-widest uppercase rounded border border-white/10 transition-colors duration-300"
            >
              {/* Liquid red fill-sweep overlay */}
              <span className="absolute inset-0 bg-mad-red -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left z-0" />
              <span className="relative z-10 flex items-center gap-2">
                <span>Book Strategy Call</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </Magnetic>

          <Magnetic>
            <a 
              href="https://wa.me/919900000000?text=Hi%20Mad.co%20Studio%2C%20I'd%20like%20to%2520discuss%20improving%20my%20business%20digital%20presence."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-surface-2 hover:bg-surface-3 text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/5"
            >
              <MessageSquare className="h-4 w-4 text-electric-azure" />
              <span>WhatsApp Quick Connect</span>
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Floating 360 Virtual Tour Viewport with parallax */}
      <motion.div
        style={{ y: yViewport }}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 mx-auto max-w-7xl w-full mt-12 shadow-2xl"
      >
        <div className="absolute -top-3 -left-3 px-3 py-1 bg-surface-3 border border-white/10 text-[10px] font-mono tracking-widest text-championship-gold uppercase rounded-sm z-30 shadow-md">
          CONCEPT TOUR // CAFE ESTHÉTIQUE
        </div>
        <Panorama src="/cafe_360.png" hotspots={cafeHotspots} />
      </motion.div>
    </section>
  );
}
