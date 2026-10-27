"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Globe, Smartphone, Cpu, Share2, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import Link from "next/link";
import { ServiceGlyph, type GlyphVariant } from "@/components/ui/ServiceGlyph";

const serviceList = [
  {
    num: "01",
    title: "360° Virtual Tours",
    icon: Camera,
    promise: "Let customers walk inside before they walk in.",
    href: "/tours",
    accent: "text-mad-red",
    glyph: "tours" as GlyphVariant,
  },
  {
    num: "02",
    title: "Web Design",
    icon: Globe,
    promise: "Ultra-fast React sites that convert browsers into buyers.",
    href: "/web-design",
    accent: "text-mad-azure",
    glyph: "web" as GlyphVariant,
  },
  {
    num: "03",
    title: "MAD Tap",
    icon: Smartphone,
    promise: "NFC + QR points that trigger action from every surface.",
    href: "/mad-tap",
    accent: "text-white",
    glyph: "tap" as GlyphVariant,
  },
  {
    num: "04",
    title: "Software & Automation",
    icon: Cpu,
    promise: "Custom systems that run while you sleep.",
    href: "/software",
    accent: "text-mad-azure",
    glyph: "automation" as GlyphVariant,
  },
  {
    num: "05",
    title: "Social Media",
    icon: Share2,
    promise: "Full-stack social management for experience-first brands.",
    href: "/social",
    accent: "text-text-secondary",
    badge: "COMING SOON",
    glyph: "social" as GlyphVariant,
  },
];

export function Services() {
  return (
    <section id="services" className="relative section-pad px-[clamp(1.25rem,5vw,6rem)] border-t border-white/5 bg-surface-1 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-mad-red/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Title Group */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 mb-10 md:mb-10 md:mb-16"
        >
          <span className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
            // CORE COMPETENCIES
          </span>
          <h2 className="font-display t-display-2 uppercase text-white">
            WE CAPTURE ATTENTION.<br />
            WE DELIVER WALK-INS.
          </h2>
        </motion.div>

        {/* Services Grid — 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="h-[220px] sm:h-[280px] md:h-[340px]"
              >
                <TiltCard className="h-full w-full">
                  <Link href={service.href} className="block h-full w-full">
                    <div className="group relative p-5 sm:p-7 rounded-xl border border-white/10 hover:border-white/25 transition-all duration-500 flex flex-col justify-between h-full w-full overflow-hidden shadow-lg hover:shadow-2xl bg-surface-2">
                      
                      {/* Background Open-Source Photography with Clean Light Shade */}
                      <div className="absolute inset-0 z-0 overflow-hidden">
<ServiceGlyph
                          variant={service.glyph}
                          className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-700 ease-out"
                        />
                        {/* Light gradient shade at bottom for clean text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-[#07070c]/55 to-transparent transition-colors duration-500" />
                      </div>

                      {/* Top Accent Rim Light */}
                      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-mad-red/70 transition-colors duration-500" />
                      
                      {/* Card Content (Relative Z-10) */}
                      <div className="relative z-10 flex items-start justify-between">
                        <span className="font-mono text-xs tracking-widest text-white/80 group-hover:text-mad-red transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          {service.num} // SERVICE
                        </span>

                        <div className="flex items-center gap-2">
                          {service.badge && (
                            <span className="bg-mad-azure/30 text-mad-azure font-mono text-[8px] tracking-widest px-2 py-0.5 rounded-sm uppercase font-bold border border-mad-azure/40 shadow-sm backdrop-blur-sm">
                              {service.badge}
                            </span>
                          )}
                          <div className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 group-hover:border-white/30 transition-colors shadow-md">
                            <Icon className={`h-5 w-5 ${service.accent} group-hover:scale-110 transition-transform duration-300`} />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Typography & CTAs */}
                      <div className="relative z-10 mt-auto">
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-white mb-1.5 sm:mb-2.5 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                          {service.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans max-w-md mb-2.5 sm:mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          {service.promise}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-mad-red uppercase group-hover:text-white transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          <span>Explore Service</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300 text-mad-red group-hover:text-white" />
                        </div>
                      </div>

                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
