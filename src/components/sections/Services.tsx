"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Globe, Target, Compass } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

const serviceList = [
  {
    num: "01",
    title: "Immersive 360° Virtual Tours",
    icon: Camera,
    desc: "We build elite virtual tours that embed directly on Google Maps and your website. Capture walk-ins by letting customers explore your interior in stunning definition before visiting.",
    accent: "text-mad-red",
  },
  {
    num: "02",
    title: "High-Performance Web Design",
    icon: Globe,
    desc: "Speed is trust. We engineer ultra-fast React & Next.js websites tailored for local premium spaces. Integrated SEO, custom reservation flows, and interactive layouts.",
    accent: "text-electric-azure",
  },
  {
    num: "03",
    title: "Hyper-Local Attention Campaigns",
    icon: Target,
    desc: "Stop running generic ads. We build campaigns targeting Mangalore's experience-driven consumers, directly funnelling high-intent prospects to your booking system or WhatsApp.",
    accent: "text-championship-gold",
  },
  {
    num: "04",
    title: "Adrenaline Brand Positioning",
    icon: Compass,
    desc: "Visual styling inspired by elite design firms. We craft logos, typography guidelines, and menus that scream craftsmanship, positioning your space as a premium destination.",
    accent: "text-white",
  }
];

export function Services() {
  return (
    <section id="services" className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-surface-1">
      <div className="max-w-7xl mx-auto w-full">
        {/* Title Group */}
        <div className="flex flex-col gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
            // CORE COMPETENCIES
          </span>
          <h2 className="font-sans font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
            WE CAPTURE ATTENTION.<br />
            WE DELIVER WALK-INS.
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-[320px]"
              >
                <TiltCard className="h-full w-full">
                  <div className="group relative p-8 bg-surface-2 hover:bg-surface-3 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-full w-full overflow-hidden">
                    {/* Background light glow */}
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-mad-red/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs tracking-widest text-text-secondary group-hover:text-mad-red transition-colors duration-300">
                        {service.num} // SERVICE
                      </span>
                      <Icon className={`h-6 w-6 ${service.accent} opacity-80 group-hover:scale-110 transition-transform duration-300`} />
                    </div>

                    <div className="mt-8">
                      <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-tight text-white mb-3">
                        {service.title}
                      </h3>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans max-w-md">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
