"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Globe, Smartphone, Cpu, Share2 } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import Link from "next/link";

const serviceList = [
  {
    num: "01",
    title: "360° Virtual Tours",
    icon: Camera,
    promise: "Let customers walk inside before they walk in.",
    href: "/tours",
    accent: "text-mad-red",
  },
  {
    num: "02",
    title: "Web Design",
    icon: Globe,
    promise: "Ultra-fast React sites that convert browsers into buyers.",
    href: "/web-design",
    accent: "text-mad-azure",
  },
  {
    num: "03",
    title: "MAD Tap",
    icon: Smartphone,
    promise: "NFC + QR points that trigger action from every surface.",
    href: "/mad-tap",
    accent: "text-white",
  },
  {
    num: "04",
    title: "Software & Automation",
    icon: Cpu,
    promise: "Custom systems that run while you sleep.",
    href: "/software",
    accent: "text-mad-azure",
  },
  {
    num: "05",
    title: "Social Media",
    icon: Share2,
    promise: "Full-stack social management for experience-first brands.",
    href: "/social",
    accent: "text-text-secondary",
    badge: "COMING SOON",
  },
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
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight text-white">
            WE CAPTURE ATTENTION.<br />
            WE DELIVER WALK-INS.
          </h2>
        </div>

        {/* Services Grid — 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="h-[280px]"
              >
                <TiltCard className="h-full w-full">
                  <Link href={service.href} className="block h-full w-full">
                    <div className="group relative p-8 bg-surface-2 hover:bg-surface-3 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-full w-full overflow-hidden">
                      {/* Background light glow */}
                      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-mad-red/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Badge */}
                      {service.badge && (
                        <div className="absolute top-4 right-4 bg-mad-azure/20 text-mad-azure font-mono text-[8px] tracking-widest px-2 py-0.5 rounded-sm uppercase font-bold">
                          {service.badge}
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs tracking-widest text-text-secondary group-hover:text-mad-red transition-colors duration-300">
                          {service.num} // SERVICE
                        </span>
                        <Icon className={`h-6 w-6 ${service.accent} opacity-80 group-hover:scale-110 transition-transform duration-300`} />
                      </div>

                      <div className="mt-auto">
                        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-white mb-3">
                          {service.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed font-sans max-w-md mb-4">
                          {service.promise}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-mad-red uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Explore →
                        </span>
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
