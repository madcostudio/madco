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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full border-y border-white/5 bg-surface-1/50 py-4 px-6 md:px-12 xl:px-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-breathe" />
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-text-secondary uppercase">
            Making spaces impossible to ignore since 2026 · Mangalore, India
          </span>
        </div>

        <div className="flex items-center gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase hidden sm:inline">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
