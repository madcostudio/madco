"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";

export default function AboutClient() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Hero */}
      <section className="px-6 md:px-12 xl:px-24 py-20 relative">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-2 w-2 rounded-full bg-mad-red animate-breathe" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // THE STUDIO
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-white mb-8 leading-[0.9]">
            WHERE IDEAS GO MAD<br />
            <span className="text-mad-red">& BRANDS GO BIG.</span>
          </h1>

          <div className="max-w-2xl flex flex-col gap-6">
            <p className="text-lg text-text-secondary leading-relaxed font-sans">
              We work exclusively with experience-first businesses. If your space doesn&apos;t matter to you, we&apos;re not the right fit. If it does — we make it impossible to ignore.
            </p>
          </div>
        </div>
      </section>

      {/* The ethos */}
      <section className="px-6 md:px-12 xl:px-24 py-20 bg-surface-1 border-t border-white/5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left — origin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
                // ORIGIN
              </span>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-white">
                MAD = MAKE A DIFFERENCE.
              </h2>
              <p className="text-base text-text-secondary leading-relaxed font-sans">
                MAD.Co started with one conviction: local businesses with great spaces deserve better than blurry photos and broken Google listings.
              </p>
              <p className="text-base text-text-secondary leading-relaxed font-sans">
                We built the tools to fix that — immersive 360° tours that let customers walk in before they walk in, websites that load faster than doubt, and tap technology that turns every surface into a conversion point.
              </p>
              <p className="text-base text-text-secondary leading-relaxed font-sans">
                Mangalore first. Then everywhere.
              </p>
            </motion.div>

            {/* Right — what we believe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
                // WHAT WE BELIEVE
              </span>
              <div className="flex flex-col gap-6">
                {[
                  { title: "Attention is the real product.", desc: "We don't sell services. We sell walk-ins, trust, and first impressions." },
                  { title: "Speed is trust.", desc: "A slow site is a broken promise. We engineer for sub-second delivery." },
                  { title: "\"Good enough\" is not enough.", desc: "If 'good enough' is enough for you, we're not for you." },
                  { title: "Show, don't describe.", desc: "Most show you a photo. We let you walk in." },
                ].map((belief) => (
                  <div key={belief.title} className="border-l-2 border-mad-red/30 pl-4 py-1 hover:border-mad-red transition-colors duration-300">
                    <h3 className="font-sans font-bold text-sm text-white uppercase tracking-tight mb-1">
                      {belief.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {belief.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats / Info bar */}
      <section className="px-6 md:px-12 xl:px-24 py-12 bg-background border-t border-white/5">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Founded", value: "2026" },
            { label: "Base", value: "Mangalore" },
            { label: "Domain", value: "madco.in" },
            { label: "Reach", value: "India-wide" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">{stat.label}</span>
              <span className="font-display text-2xl text-white uppercase tracking-tight">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 xl:px-24 py-16 border-t border-white/5 bg-surface-1 text-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-6">
          <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
            WE DON&apos;T MARKET.<br />WE MAKE A DIFFERENCE.
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Magnetic>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded"
              >
                <span>Work With Us</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co, I'd like to learn more about your studio.")}`}
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
