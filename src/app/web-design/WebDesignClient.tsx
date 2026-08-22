"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, MessageSquare, Zap, Search, Code2, Star } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";

const tiers = [
  {
    name: "Launchpad",
    tag: "Entry",
    anchorPrice: "₹34,999",
    foundingPrice: "₹19,999",
    what: "One high-converting landing page",
    features: [
      "Template-driven design",
      "Fully mobile responsive",
      "Basic SEO setup",
      "WhatsApp integration",
      "Contact form",
    ],
    accentColor: "border-white/5",
    featured: false,
  },
  {
    name: "Launch",
    tag: "Most Popular",
    anchorPrice: "₹49,999",
    foundingPrice: "₹29,999",
    what: "Up to 5 custom pages",
    features: [
      "Custom design & animations",
      "Full SEO optimization",
      "Booking / WhatsApp flows",
      "360° tour embed-ready",
      "Performance tuned (<1s LCP)",
      "3 months support",
    ],
    accentColor: "border-mad-red/40",
    featured: true,
  },
  {
    name: "Growth",
    tag: "Advanced",
    anchorPrice: "₹99,999",
    foundingPrice: "₹59,999",
    what: "10+ pages with CMS",
    features: [
      "Content management system",
      "Custom interactions & micro-animations",
      "Third-party integrations",
      "Advanced SEO & analytics",
      "Priority support",
      "6 months support",
    ],
    accentColor: "border-mad-azure/40",
    featured: false,
  },
];

export default function WebDesignClient() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Hero */}
      <section className="px-6 md:px-12 xl:px-24 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-mad-azure" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // SERVICE 02 — WEB DESIGN
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-white mb-6 max-w-4xl leading-tight">
            SPEED IS TRUST.<br />
            <span className="text-mad-azure">WEBSITES THAT CONVERT.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed mb-8">
            Ultra-fast React & Next.js sites engineered for premium local spaces. Performance-first, 360°-embed-ready, full SEO, and booking flows that turn visitors into customers.
          </p>

          {/* Proof points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl border-t border-white/5 pt-8 mt-8">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-mad-red shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Sub-Second Load</h4>
                <p className="text-xs text-text-secondary mt-1">Engineered for &lt;1s LCP on mobile.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Search className="h-5 w-5 text-mad-azure shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">SEO Built-In</h4>
                <p className="text-xs text-text-secondary mt-1">Schema markup, local keywords, meta tags.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Code2 className="h-5 w-5 text-white shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">360°-Ready</h4>
                <p className="text-xs text-text-secondary mt-1">Your virtual tour embeds natively.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — the decoy ladder (Section 8.B) */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col items-start gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// WEB CONFIGURATIONS</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
              CHOOSE YOUR BUILD
            </h2>
          </div>

          {/* Three tiers side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between p-8 bg-surface-2 rounded-xl border ${tier.accentColor} hover:border-white/20 transition-all duration-300 ${
                  tier.featured ? "ring-1 ring-mad-red/30 shadow-lg shadow-mad-red/5" : ""
                }`}
              >
                <div>
                  {/* Badge */}
                  {tier.featured && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-mad-red text-white font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-sm uppercase font-bold">
                      <Star className="h-2.5 w-2.5" />
                      {tier.tag}
                    </div>
                  )}
                  {!tier.featured && tier.tag && (
                    <div className="absolute top-4 right-4 bg-white/5 text-text-secondary font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-sm uppercase">
                      {tier.tag}
                    </div>
                  )}

                  <h3 className="font-display text-2xl uppercase tracking-tight text-white mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-text-secondary font-sans mb-6">
                    {tier.what}
                  </p>

                  <div className="flex flex-col gap-1 mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="font-sans line-through text-sm text-text-secondary">
                        {tier.anchorPrice}
                      </span>
                      <span className="font-mono text-[8px] tracking-widest text-mad-red bg-mad-red/15 px-1.5 py-0.5 rounded font-bold uppercase">
                        Founding Rate
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-black text-4xl md:text-5xl tracking-tight text-white">
                        {tier.foundingPrice}
                      </span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-4 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                        <span className="text-sm text-text-secondary font-sans leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Magnetic>
                  <Link
                    href={`/contact?package=${encodeURIComponent(`Web: ${tier.name}`)}`}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10 ${
                      tier.featured
                        ? "bg-mad-red hover:bg-dark-crimson"
                        : "bg-background hover:bg-mad-red hover:border-mad-red"
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Magnetic>
              </motion.div>
            ))}
          </div>

          {/* Custom / Web App tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-8 bg-surface-2 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-xl uppercase tracking-tight text-white mb-1">
                Custom / Web App
              </h3>
              <p className="text-sm text-text-secondary font-sans">
                Complex builds, dashboards, booking platforms, custom integrations — quoted per project.
              </p>
            </div>
            <Magnetic>
              <Link
                href="/contact?package=Web%3A%20Custom"
                className="flex items-center gap-2 px-5 py-3 bg-background hover:bg-surface-3 text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10 shrink-0"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="px-6 md:px-12 xl:px-24 py-16 border-t border-white/5 bg-background text-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-6">
          <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
            SPEED IS TRUST.
          </h3>
          <p className="text-sm text-text-secondary font-sans max-w-lg leading-relaxed">
            Your website is either building trust or losing it. We engineer the kind that converts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Magnetic>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded"
              >
                <span>Book Strategy Call</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co, I'm interested in your web design services.")}`}
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
