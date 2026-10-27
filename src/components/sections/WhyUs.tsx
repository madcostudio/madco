"use client";

import React from "react";
import { motion } from "framer-motion";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

const metrics = [
  {
    value: "↑",
    label: "Customer Interest",
    desc: "Listings with 360° imagery consistently see higher engagement than photo-only listings."
  },
  {
    value: "+",
    label: "Higher Bookings",
    desc: "Complete business listings with 360 views see a meaningful increase in conversion metrics."
  },
  {
    value: "24/7",
    label: "Always On",
    desc: "Your space selling itself, every hour. Engineered to load in milliseconds on any device."
  }
];

export function WhyUs() {
  return (
    <section className="relative section-pad px-[clamp(1.25rem,5vw,6rem)] border-t border-white/5 bg-background overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-mad-azure/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 md:gap-12 md:gap-20">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Copy & Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-6 md:gap-8"
          >
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
                // CONVERSION SCIENCE
              </span>
              <h2 className="font-display t-display-2 uppercase text-white">
                WE CONVERT VIEWS INTO VISITORS.
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans mt-2">
                Static smartphone images don&apos;t build expectation. They look cheap. Immersive tours allow prospective customers to test your layout, view your aesthetic, and pre-verify your quality.
              </p>
            </div>

            {/* Metrics List with staggered scroll reveals */}
            <div className="flex flex-col gap-4 md:gap-6">
              {metrics.map((item, idx) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                  className="flex gap-4 border-l-2 border-white/10 pl-4 py-1 hover:border-mad-red transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="font-mono text-3xl font-black text-white group-hover:text-mad-red tracking-tight transition-colors duration-300">
                    {item.value}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-[#d4af37] uppercase tracking-wider">
                      {item.label}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-0.5 max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interactive Before/After Comparison */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                Interactive Comparison Slider
              </span>
              <span className="font-mono text-[10px] tracking-widest text-mad-red uppercase animate-pulse">
                Drag to slide
              </span>
            </div>
            <BeforeAfter />
          </motion.div>

        </div>

        {/* ROI calculator moved to /tours, where pricing gives it context.
            Keeping the full tool here made the homepage three screens longer
            on a phone. This band preserves the conversion path in one tap. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Link
            href="/tours#roi"
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 w-full rounded-2xl border border-white/10 hover:border-mad-red/50 bg-surface-2 p-6 md:p-8 transition-colors duration-300"
          >
            <div className="flex items-start gap-4 min-w-0">
              <span className="shrink-0 p-3 rounded-xl bg-mad-red/10 border border-mad-red/25">
                <TrendingUp className="w-5 h-5 text-mad-red" />
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                <span className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white">
                  What would a tour be worth to you?
                </span>
                <span className="text-sm text-text-secondary leading-relaxed">
                  Pick your business type, set your monthly views, and see the
                  walk-ins and revenue a tour could add.
                </span>
              </span>
            </div>
            <span className="flex items-center gap-2 shrink-0 font-mono text-xs tracking-widest uppercase text-mad-red group-hover:text-white transition-colors">
              Open the calculator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
