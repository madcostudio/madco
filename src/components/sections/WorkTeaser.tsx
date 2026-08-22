"use client";

import React from "react";
import { motion } from "framer-motion";
import { Panorama } from "@/components/ui/Panorama";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const teaserTours = [
  {
    id: "cafe",
    title: "Café Esthétique",
    category: "Social Café",
    src: "/cafe_360.png",
    hotspots: [
      { id: "brew", lat: -12, lon: 135, label: "Espresso Bar", description: "Custom Slayer espresso machines." },
    ],
  },
  {
    id: "gym",
    title: "Iron Forge Gym",
    category: "Fitness Center",
    src: "/gym_360.png",
    hotspots: [
      { id: "weights", lat: -15, lon: 90, label: "Free Weights", description: "Heavy-duty plate-loaded equipment." },
    ],
  },
  {
    id: "restaurant",
    title: "Aura Dining",
    category: "Fine Dining",
    src: "/restaurant_360.png",
    hotspots: [
      { id: "marble", lat: -20, lon: 40, label: "Marble Tables", description: "Premium Calacatta marble." },
    ],
  },
];

export function WorkTeaser() {
  return (
    <section className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-surface-1">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
              // RECENT SHOWCASES
            </span>
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white">
              VIRTUAL SPACES.
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-text-secondary hover:text-white uppercase transition-colors duration-300"
          >
            View all work
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teaserTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/5">
                <Panorama src={tour.src} hotspots={tour.hotspots} />
                {/* LIVE badge */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-rec-pulse" />
                  <span className="font-mono text-[8px] tracking-widest text-white uppercase font-bold">LIVE</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-sm text-white uppercase tracking-tight">
                    {tour.title}
                  </h3>
                  <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                    {tour.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
