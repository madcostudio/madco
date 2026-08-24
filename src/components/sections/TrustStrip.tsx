"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, Smartphone, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Map,
    label: "Google Maps Sync",
    color: "text-mad-red",
  },
  {
    icon: Smartphone,
    label: "Mobile Gyro",
    color: "text-mad-azure",
  },
  {
    icon: ShieldCheck,
    label: "Verified HDR",
    color: "text-white",
  },
];

export function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full border-y border-white/5 bg-surface-1/50 py-4 px-6 md:px-12 xl:px-24 relative overflow-hidden"
    >
      {/* Scroll-triggered laser sweep light beam */}
      <motion.div 
        initial={{ x: "-100%" }}
        whileInView={{ x: "200%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-mad-red/20 to-transparent -skew-x-25 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-breathe" />
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-text-secondary uppercase">
            Making spaces impossible to ignore since 2026 · Mangalore, India
          </span>
        </div>

        <div className="flex items-center gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                className="flex items-center gap-2"
              >
                <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase hidden sm:inline">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
