"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    phase: "PHASE 01",
    title: "Spatial Audit & Design",
    desc: "We analyze your physical space, lighting flows, and local customer demographics. We map out a spatial story, choosing exact hotspots to command maximum consumer attention."
  },
  {
    phase: "PHASE 02",
    title: "Cinematic HDR Scan",
    desc: "Our team captures your venue at peak environment hours using professional 360° cameras. We deliver panoramic imagery that is cleanly stitched and colour-corrected."
  },
  {
    phase: "PHASE 03",
    title: "Interactive Enrichment",
    desc: "We compile the virtual framework, embedding customized interactive popup hotspots (like digital menus, seating bookings, or equipment sheets) directly into the panorama."
  },
  {
    phase: "PHASE 04",
    title: "Maps Sync & Web Presence",
    desc: "We publish your tour so it appears directly on Google Maps and Search, and embed it into a custom speed-optimized web presence."
  }
];

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 65%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section id="process" className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-surface-1 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-mad-red/5 blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
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
        </div>

        {/* Process Roadmap Blocks with Progressive Laser Timeline */}
        <div ref={containerRef} className="relative pl-8 md:pl-14 flex flex-col gap-16 ml-2">
          
          {/* Static Background Rail */}
          <div className="absolute left-[3px] md:left-[3px] top-3 bottom-6 w-[2px] bg-white/5" />

          {/* Progressive Scroll-driven Laser Line */}
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-[3px] md:left-[3px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-mad-red via-mad-red to-mad-azure shadow-[0_0_12px_rgba(245,37,15,0.9),0_0_24px_rgba(245,37,15,0.5)] z-10"
          >
            {/* Glowing Laser Head Tip */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_#FFF,0_0_20px_#F5250F]" />
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
              <div className="absolute -left-[37px] md:-left-[61px] top-1.5 h-5 w-5 rounded-full border-2 border-background bg-surface-3 group-hover:bg-mad-red group-hover:border-mad-red transition-all duration-300 flex items-center justify-center z-20 shadow-md group-hover:shadow-[0_0_15px_rgba(245,37,15,0.7)]">
                <span className="h-1.5 w-1.5 rounded-full bg-white opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Step Content */}
              <div className="max-w-3xl p-6 rounded-lg bg-surface-2/30 border border-white/5 group-hover:border-white/15 transition-all duration-300 hover:bg-surface-2/60">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs tracking-wider text-mad-red font-bold">
                    {step.phase}
                  </span>
                  <span className="h-[1px] w-8 bg-white/10" />
                </div>
                <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-tight text-white mb-3">
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
          <Link
            href="/process"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-text-secondary hover:text-white uppercase transition-colors duration-300 group px-5 py-3 rounded-full border border-white/10 hover:border-white/20 bg-surface-2/50"
          >
            <span>Explore full process</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
