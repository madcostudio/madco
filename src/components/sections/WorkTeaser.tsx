"use client";

import React from "react";
import { motion } from "framer-motion";
import { Panorama } from "@/components/ui/Panorama";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";

const teaserTours = [
  {
    id: "cafe",
    title: "Café Esthétique",
    category: "Specialty Café & Workspace",
    city: "Mangalore",
    src: "/cafe_360.png",
    hotspots: [
      { id: "brew", lat: -12, lon: 135, label: "Espresso Bar", description: "Custom Slayer espresso machines." },
    ],
  },
  {
    id: "gym",
    title: "Titan Strength & Conditioning",
    category: "High-Performance Athletic Arena",
    city: "Mangalore",
    src: "/gym_360.png",
    hotspots: [
      { id: "weights", lat: -15, lon: 90, label: "Olympic Racks", description: "Precision calibrated competition plates." },
    ],
  },
  {
    id: "restaurant",
    title: "The Ember Dining Club",
    category: "Artisanal Kitchen & Lounge",
    city: "Mangalore",
    src: "/restaurant_360.png",
    hotspots: [
      { id: "marble", lat: -20, lon: 40, label: "Wood-fired Hearth", description: "Live open fire culinary counter." },
    ],
  },
];

export function WorkTeaser() {
  return (
    <section className="relative py-28 px-6 md:px-12 xl:px-24 border-t border-white/8 bg-surface-1 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-mad-azure/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse shadow-[0_0_8px_#F5250F]" />
              // RECENT SHOWCASES
            </span>
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white">
              VIRTUAL SPACES.
            </h2>
            <p className="text-text-secondary text-sm md:text-base font-sans max-w-lg">
              Explore live spatial walkthroughs engineered to turn online interest into offline walk-ins.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Magnetic>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-white hover:text-mad-red uppercase transition-colors duration-300 group px-5 py-3 rounded-full border border-white/10 hover:border-white/25 bg-surface-2/60 backdrop-blur-md shadow-md"
              >
                <span>View all work & portfolio</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-mad-red" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Tour Cards Grid with Progressive 3D Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teaserTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3.5 group"
            >
              {/* 360 Mini Viewport */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-white/25 transition-all duration-400 shadow-xl group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <Panorama src={tour.src} hotspots={tour.hotspots} />

                {/* Top Status Header */}
                <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/15 rounded text-[9px] font-mono tracking-widest text-white uppercase font-bold shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-mad-azure animate-pulse" />
                    <span>CONCEPT TOUR</span>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded text-[9px] font-mono text-neutral-300">
                    <MapPin className="w-2.5 h-2.5 text-mad-azure" />
                    <span>{tour.city}</span>
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex items-start justify-between px-1">
                <div>
                  <h3 className="font-sans font-bold text-base md:text-lg text-white uppercase tracking-tight group-hover:text-mad-red transition-colors duration-300">
                    {tour.title}
                  </h3>
                  <span className="font-mono text-xs text-text-secondary">
                    {tour.category}
                  </span>
                </div>
                <span className="font-mono text-xs text-text-secondary group-hover:text-white uppercase transition-colors">
                  0{index + 1} //
                </span>
              </div>
              <span className="font-mono text-[9px] text-text-secondary/50 px-1">Illustrative sample</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
