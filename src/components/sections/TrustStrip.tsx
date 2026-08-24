"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, Smartphone, ShieldCheck, Zap } from "lucide-react";

const stats = [
  {
    icon: Map,
    label: "Google Street View Sync",
    badge: "VERIFIED",
    color: "text-mad-red",
  },
  {
    icon: Smartphone,
    label: "Mobile Gyro + Touch 360°",
    badge: "60 FPS",
    color: "text-mad-azure",
  },
  {
    icon: ShieldCheck,
    label: "8K HDR Spatial Precision",
    badge: "ULTRA RES",
    color: "text-[#d4af37]",
  },
];

export function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full border-y border-white/8 bg-surface-1/80 backdrop-blur-md py-4 px-6 md:px-12 xl:px-24 relative overflow-hidden shadow-inner"
    >
      {/* Scroll-triggered laser sweep light beam */}
      <motion.div 
        initial={{ x: "-100%" }}
        whileInView={{ x: "200%" }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-mad-red/20 to-transparent -skew-x-25 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse shadow-[0_0_8px_#F5250F]" />
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-neutral-300 uppercase">
            Making spaces impossible to ignore · Mangalore, India
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
              >
                <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                  {stat.label}
                </span>
                <span className="font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-surface-2 border border-white/10 text-neutral-400 uppercase hidden md:inline">
                  {stat.badge}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
