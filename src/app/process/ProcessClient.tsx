"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";

const phases = [
  {
    phase: "PHASE 01",
    title: "Spatial Audit & Design",
    desc: "We analyze your physical space, lighting flows, and local customer demographics. We map out a spatial story, choosing exact hotspots to command maximum consumer attention. Every tour starts with strategy — not a camera.",
    deliverables: ["Space walkthrough analysis", "Hotspot mapping", "Customer flow strategy", "Competitive local audit"],
  },
  {
    phase: "PHASE 02",
    title: "Cinematic HDR Scan",
    desc: "Our team captures your venue at peak environment hours using professional 360° cameras. We deliver panoramic imagery that is cleanly stitched, colour-corrected, and graded for maximum impact.",
    deliverables: ["Professional HDR capture", "Clean panorama stitching", "Cinematic colour grading", "Optimal lighting timing"],
  },
  {
    phase: "PHASE 03",
    title: "Interactive Enrichment",
    desc: "We compile the virtual framework, embedding customized interactive popup hotspots — digital menus, seating bookings, equipment sheets, special offers — directly into the panorama. Your tour becomes a conversion tool, not just a gallery.",
    deliverables: ["Clickable hotspot overlays", "Menu / booking integrations", "Custom player UI", "Brand-consistent styling"],
  },
  {
    phase: "PHASE 04",
    title: "Maps Sync & Web Presence",
    desc: "We publish your tour so it appears directly on Google Maps and Search, and embed it into a custom speed-optimized web presence. Your space starts selling itself — 24/7, on every device.",
    deliverables: ["Google Street View upload", "Google Business optimization", "Website embed deployment", "QR code generation"],
  },
];

export default function ProcessClient() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Hero */}
      <section className="px-6 md:px-12 xl:px-24 py-16 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-mad-red animate-rec-pulse" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // OUR SYSTEM DIRECTIVE
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-white mb-6 max-w-4xl leading-tight">
            ENGINEERED<br />
            <span className="text-mad-red">TO PERFECTION.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed">
            Four phases. One engineered system. Every tour we build follows this directive — from spatial audit to live deployment. No shortcuts.
          </p>
        </div>
      </section>

      {/* Phases — cinematic timeline */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="relative border-l-2 border-white/10 pl-8 md:pl-16 flex flex-col gap-20 ml-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline node */}
                <div className="absolute -left-[41px] md:-left-[69px] top-2 h-6 w-6 rounded-full border-2 border-surface-1 bg-surface-2 group-hover:bg-mad-red group-hover:border-mad-red transition-all duration-500 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-mad-red group-hover:bg-white transition-colors duration-300" />
                </div>

                {/* Phase label */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-sm tracking-wider text-mad-red font-bold">
                    {phase.phase}
                  </span>
                  <span className="h-[1px] w-12 bg-white/10" />
                </div>

                {/* Content */}
                <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-white mb-4">
                  {phase.title}
                </h2>
                <p className="text-base text-text-secondary leading-relaxed font-sans max-w-2xl mb-6">
                  {phase.desc}
                </p>

                {/* Deliverables */}
                <div className="grid grid-cols-2 gap-3">
                  {phase.deliverables.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-mad-red shrink-0" />
                      <span className="text-xs font-mono tracking-wider text-text-secondary uppercase">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 xl:px-24 py-16 border-t border-white/5 bg-background text-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-6">
          <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
            YOUR SPACE, SELLING ITSELF.
          </h3>
          <p className="text-sm text-text-secondary font-sans max-w-lg leading-relaxed">
            Book a 15-minute spatial audit. We&apos;ll analyze your Google Maps listing and show you exactly what&apos;s possible.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Magnetic>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded"
              >
                <span>Book Spatial Audit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co, I'd like to learn about your process.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-4 bg-surface-2 hover:bg-surface-3 text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/5"
              >
                <MessageSquare className="h-4 w-4 text-mad-azure" />
                <span>Chat on WhatsApp</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

    </div>
  );
}
