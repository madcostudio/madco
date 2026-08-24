"use client";

import React from "react";
import { motion } from "framer-motion";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { SpatialCalculator } from "@/components/ui/SpatialCalculator";

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
    <section className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-background overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-mad-azure/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-20">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
                // CONVERSION SCIENCE
              </span>
              <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white">
                WE CONVERT VIEWS INTO VISITORS.
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans mt-2">
                Static smartphone images don&apos;t build expectation. They look cheap. Immersive tours allow prospective customers to test your layout, view your aesthetic, and pre-verify your quality.
              </p>
            </div>

            {/* Metrics List with staggered scroll reveals */}
            <div className="flex flex-col gap-6">
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

        {/* Interactive Spatial Footfall & ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <SpatialCalculator />
        </motion.div>

      </div>
    </section>
  );
}
