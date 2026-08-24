"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Globe, Smartphone, Cpu, Share2, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import Link from "next/link";
import Image from "next/image";

const serviceList = [
  {
    num: "01",
    title: "360° Virtual Tours",
    icon: Camera,
    promise: "Let customers walk inside before they walk in.",
    href: "/tours",
    accent: "text-mad-red",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85",
    alt: "Immersive 360 architectural interior walkthrough",
  },
  {
    num: "02",
    title: "Web Design",
    icon: Globe,
    promise: "Ultra-fast React sites that convert browsers into buyers.",
    href: "/web-design",
    accent: "text-mad-azure",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=85",
    alt: "Modern responsive web design and UI engineering",
  },
  {
    num: "03",
    title: "MAD Tap",
    icon: Smartphone,
    promise: "NFC + QR points that trigger action from every surface.",
    href: "/mad-tap",
    accent: "text-white",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=85",
    alt: "Contactless smartphone NFC tap interaction",
  },
  {
    num: "04",
    title: "Software & Automation",
    icon: Cpu,
    promise: "Custom systems that run while you sleep.",
    href: "/software",
    accent: "text-mad-azure",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
    alt: "Illuminated hardware circuitry and automated systems",
  },
  {
    num: "05",
    title: "Social Media",
    icon: Share2,
    promise: "Full-stack social management for experience-first brands.",
    href: "/social",
    accent: "text-text-secondary",
    badge: "COMING SOON",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=85",
    alt: "Social media content creation and digital brand management",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-surface-1 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-mad-red/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Title Group */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 mb-16"
        >
          <span className="font-mono text-xs tracking-widest text-mad-red uppercase flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
            // CORE COMPETENCIES
          </span>
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white">
            WE CAPTURE ATTENTION.<br />
            WE DELIVER WALK-INS.
          </h2>
        </motion.div>

        {/* Services Grid — 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="h-[340px] md:h-[360px]"
              >
                <TiltCard className="h-full w-full">
                  <Link href={service.href} className="block h-full w-full">
                    <div className="group relative p-7 rounded-xl border border-white/10 hover:border-white/25 transition-all duration-500 flex flex-col justify-between h-full w-full overflow-hidden shadow-lg hover:shadow-2xl bg-surface-2">
                      
                      {/* Background Open-Source Photography with Clean Light Shade */}
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-106 transition-all duration-700 ease-out saturate-[1.1]"
                        />
                        {/* Light gradient shade at bottom for clean text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/85 group-hover:via-black/35 group-hover:to-black/10 transition-colors duration-500" />
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
                        <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-white mb-2.5 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                          {service.title}
                        </h3>
                        <p className="text-sm text-neutral-200 leading-relaxed font-sans max-w-md mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
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
