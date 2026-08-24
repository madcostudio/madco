"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";

const steps = [
  {
    phase: "PHASE 01",
    code: "SCAN_01",
    title: "Spatial Audit & Story Mapping",
    desc: "We analyze your physical space, lighting flows, and local customer demographics. We map out a spatial story, choosing exact hotspots to command maximum consumer attention.",
    metric: "LIGHTING & ARCHITECTURE AUDIT",
  },
  {
    phase: "PHASE 02",
    code: "OPTIC_02",
    title: "Cinematic 8K HDR Spatial Capture",
    desc: "Our team captures your venue at peak environment hours using professional 360° cameras. We deliver panoramic imagery that is cleanly stitched, colour-corrected, and balanced.",
    metric: "RAW 8K HDR STITCHING",
  },
  {
    phase: "PHASE 03",
    code: "INTERACT_03",
    title: "Interactive Enrichment & Hotspots",
    desc: "We compile the virtual framework, embedding customized interactive popup hotspots (like digital menus, seating bookings, or equipment sheets) directly into the panorama.",
    metric: "TOUCH / TAP HOTSPOT INJECTION",
  },
  {
    phase: "PHASE 04",
    code: "DEPLOY_04",
    title: "Google Maps Sync & Ecosystem Launch",
    desc: "We publish your tour so it appears directly on Google Maps and Search, and embed it into a custom speed-optimized web presence for instant conversion.",
    metric: "GLOBAL SEARCH & MAPS SYNC",
  },
];

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 65%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <section id="process" className="relative py-28 px-6 md:px-12 xl:px-24 border-t border-white/8 bg-surface-1 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-mad-red/5 blur-[130px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-mad-azure/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse shadow-[0_0_8px_#F5250F]" />
            // OUR SYSTEM DIRECTIVE
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white"
          >
            ENGINEERED TO PERFECTION.
          </motion.h2>
          <p className="text-text-secondary text-sm md:text-base max-w-xl font-sans">
            From initial spatial audit to global Google Maps deployment in under 7 business days.
          </p>
        </div>

        {/* Process Roadmap Blocks with Progressive Laser Timeline */}
        <div ref={containerRef} className="relative pl-8 md:pl-16 flex flex-col gap-14 ml-2">
          
          {/* Static Background Rail */}
          <div className="absolute left-[3px] md:left-[3px] top-3 bottom-6 w-[2px] bg-white/5" />

          {/* Progressive Scroll-driven Laser Line */}
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-[3px] md:left-[3px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-mad-red via-mad-red to-mad-azure shadow-[0_0_14px_rgba(245,37,15,0.9),0_0_28px_rgba(245,37,15,0.5)] z-10"
          >
            {/* Glowing Laser Head Tip */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_12px_#FFF,0_0_24px_#F5250F]" />
          </motion.div>

          {steps.map((step, index) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[37px] md:-left-[63px] top-2 h-6 w-6 rounded-full border-2 border-background bg-surface-3 group-hover:bg-mad-red group-hover:border-mad-red transition-all duration-300 flex items-center justify-center z-20 shadow-md group-hover:shadow-[0_0_18px_rgba(245,37,15,0.8)]">
                <span className="h-2 w-2 rounded-full bg-white opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Step Content Card */}
              <div className="max-w-3xl p-7 md:p-8 rounded-xl bg-surface-2/40 border border-white/8 group-hover:border-white/20 transition-all duration-400 hover:bg-surface-2/70 backdrop-blur-sm shadow-lg hover:shadow-2xl">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tracking-wider text-mad-red font-bold px-2 py-0.5 rounded bg-mad-red/10 border border-mad-red/20">
                      {step.phase}
                    </span>
                    <span className="h-[1px] w-6 bg-white/10" />
                    <span className="font-mono text-[10px] text-text-secondary tracking-widest uppercase">
                      {step.code}
                    </span>
                  </div>

                  <span className="hidden sm:inline font-mono text-[9px] text-[#d4af37] tracking-widest uppercase px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">
                    {step.metric}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-tight text-white mb-3 group-hover:text-neutral-100 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans max-w-2xl">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link to full process page */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Magnetic>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-text-secondary hover:text-white uppercase transition-all duration-300 group px-6 py-3.5 rounded-full border border-white/10 hover:border-white/25 bg-surface-2/60 hover:bg-surface-2 backdrop-blur-md shadow-lg"
            >
              <span>Explore full deployment roadmap</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-mad-red" />
            </Link>
          </Magnetic>
        </motion.div>

      </div>
    </section>
  );
}
