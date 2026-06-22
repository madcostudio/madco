"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    phase: "PHASE 01",
    title: "Spatial Audit & Design",
    desc: "We analyze your physical space, lighting flows, and local customer demographics. We map out a spatial story, choosing exact hotspots to command maximum consumer attention."
  },
  {
    phase: "PHASE 02",
    title: "Cinematic HDR Scan",
    desc: "Our team captures your venue at peak environment hours using industry-leading spatial sensors. We compile, stitch, and colour-grade the panoramic imagery with zero distortion."
  },
  {
    phase: "PHASE 03",
    title: "Interactive Enrichment",
    desc: "We compile the virtual framework, embedding customized interactive popup hotspots (like digital menus, seating bookings, or equipment sheets) directly into the panorama."
  },
  {
    phase: "PHASE 04",
    title: "Maps Sync & Ad Blast",
    desc: "We publish the tour to Google Street View to double your map traffic, embed it into a custom speed-optimized web presence, and launch hyper-targeted local walk-in campaigns."
  }
];

export function Process() {
  return (
    <section id="process" className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-surface-1">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
            // OUR SYSTEM DIRECTIVE
          </span>
          <h2 className="font-sans font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
            ENGINEERED TO PERFECTION.
          </h2>
        </div>

        {/* Process Roadmap Blocks */}
        <div className="relative border-l border-white/5 pl-6 md:pl-12 flex flex-col gap-16 ml-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] md:-left-[55px] top-1.5 h-4.5 w-4.5 rounded-full border-2 border-background bg-surface-3 group-hover:bg-mad-red group-hover:border-mad-red transition-all duration-300 flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Step Content */}
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs tracking-wider text-mad-red">
                    {step.phase}
                  </span>
                  <span className="h-[1px] w-8 bg-white/10" />
                </div>
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans max-w-2xl">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
