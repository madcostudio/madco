"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, HelpCircle, ArrowRight, MessageSquare, ShieldCheck, Map, Smartphone } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";
import type { Metadata } from "next";

const packages = [
  {
    name: "Starter Scan",
    anchorPrice: "₹24,999",
    foundingPrice: "₹9,999",
    target: "Boutiques · Salons · Small Cafés",
    keyLine: "Full coverage up to ~1,500 sq ft",
    features: [
      "Up to 10 capture points (+₹750/extra point)",
      "HDR capture & professional grading",
      "Google Maps Street View integration",
      "Website embed code",
      "Hosting included, renewable annually",
    ],
    cta: "Request Starter Scan",
    accentColor: "border-white/5",
    badge: null,
  },
  {
    name: "Immersive Pro",
    anchorPrice: "₹39,999",
    foundingPrice: "₹19,999",
    target: "Restaurants · Gyms · Clinics · Showrooms",
    keyLine: "Up to ~4,000 sq ft coverage",
    features: [
      "Up to 18 capture points",
      "Bespoke colour grading",
      "Street View verified listing",
      "Interactive player UI with your branding",
      "5 clickable hotspots (menu, booking, contact)",
      "Hosting included, renewable annually",
    ],
    cta: "Request Immersive Pro",
    accentColor: "border-mad-red/40",
    badge: "⭐ RECOMMENDED",
    featured: true,
  },
  {
    name: "Signature / Enterprise",
    anchorPrice: "₹69,999",
    foundingPrice: "From ₹39,999",
    target: "Hotels · Luxury · Multi-Location",
    keyLine: "Full multi-zone coverage — quoted to your space",
    features: [
      "Full multi-zone coverage — quoted to your space",
      "3D walkthrough experience",
      "Custom player UI & advanced hotspots",
      "Google Maps optimization",
      "Custom landing page included",
      "Support & hosting included, renewable annually",
    ],
    cta: "Connect for Consultation",
    accentColor: "border-mad-azure/40",
    badge: "FOUNDING SPECIAL",
  },
];

const faqs = [
  {
    q: "How long does a scanning session take?",
    a: "For small-to-medium venues (cafes, salons), the scan takes 1.5 to 3 hours. Larger spaces like multi-level gyms or car showrooms may require 4 to 6 hours. We schedule around your slowest hours to minimize business disruption.",
  },
  {
    q: "Do we need to close our business during the scan?",
    a: "No, but we highly recommend scanning when the space is empty of customers. This ensures we capture the clean, uninterrupted aesthetics of your interiors without blur or privacy issues.",
  },
  {
    q: "How does the Google Maps integration work?",
    a: "As certified Google Street View partners, we upload the stitched panoramas directly onto your business location profile. Customers browsing your profile on Google Maps will see a 'See Inside' thumbnail, letting them explore your space.",
  },
  {
    q: "Are there recurring hosting fees?",
    a: "Your package includes hosting, renewable annually at a low rate. After the included period, basic hosting is only ₹1,500/year to keep the interactive viewer online. Google Maps listings remain active forever with zero hosting fees.",
  },
];

export default function ToursPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Hero Header */}
      <section className="px-6 md:px-12 xl:px-24 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-mad-red animate-rec-pulse" />
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase font-bold">
              REC
            </span>
            <span className="h-[1px] w-6 bg-white/20" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              FLAGSHIP SERVICE // 360° TOURS
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-white mb-6 max-w-4xl leading-tight">
            PHYSICAL EXPERIENCES,<br />
            <span className="text-mad-red">DIGITALLY STAGED.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed mb-8">
            Create an immediate sense of trust. Let prospective customers step inside your cafe, shop, or showroom directly from search. Highly optimized, interactive, and engineered for conversion.
          </p>

          {/* Why it works — trust pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl border-t border-white/5 pt-8 mt-12">
            <div className="flex gap-3">
              <Map className="h-5 w-5 text-mad-red shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Google Maps Sync</h4>
                <p className="text-xs text-text-secondary mt-1">Boost maps click-through by letting users see inside instantly.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Smartphone className="h-5 w-5 text-mad-azure shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Mobile Gyro</h4>
                <p className="text-xs text-text-secondary mt-1">Responsive gyro support for immersive smartphone pan sweeps.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-white shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Verified HDR</h4>
                <p className="text-xs text-text-secondary mt-1">Professional sensors for ultra-sharp lighting exposure.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing / Packages Grid — Bible Section 8.A */}
      <section id="packages" className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col items-start gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// TOUR CONFIGURATIONS</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">CHOOSE YOUR SCALE</h2>
            <div className="mt-4 flex flex-col w-full max-w-2xl bg-white/5 border-l-4 border-mad-red backdrop-blur-sm rounded-r-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-2 w-2 rounded-full bg-mad-red animate-rec-pulse" />
                <span className="font-mono text-xs tracking-widest font-bold text-white">
                  FOUNDING RATE — LIVE NOW
                </span>
              </div>
              <p className="text-sm text-text-secondary font-sans mb-3">
                First 10 Mangalore venues get founding pricing. Locked in forever once you sign up.
              </p>
              <div className="flex items-center justify-between text-xs font-mono border-t border-white/10 pt-3">
                <span className="text-mad-red font-bold">[ {config.FOUNDING_SLOTS_LEFT} of 10 remaining ]</span>
                <span className="text-text-secondary opacity-70">Founding pricing closes once filled.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between p-8 bg-surface-2 rounded-xl border ${pkg.accentColor} hover:border-white/20 transition-all duration-300 ${
                  pkg.featured ? "ring-1 ring-mad-red/30 shadow-lg shadow-mad-red/5" : ""
                }`}
              >
                <div>
                  {/* Badge */}
                  {pkg.badge && (
                    <div className={`absolute top-4 right-4 font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-sm uppercase font-bold ${
                      pkg.featured ? "bg-mad-red text-white" : "bg-mad-azure/20 text-mad-azure"
                    }`}>
                      {pkg.badge}
                    </div>
                  )}

                  <h3 className="font-display text-2xl uppercase tracking-tight text-white mb-1">
                    {pkg.name}
                  </h3>
                  <p className="font-mono text-[10px] tracking-widest text-text-secondary uppercase mb-2">
                    {pkg.target}
                  </p>
                  <p className="text-xs text-text-secondary font-sans mb-6">
                    {pkg.keyLine}
                  </p>

                  <div className="flex flex-col gap-1 mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="font-sans line-through text-sm text-text-secondary">
                        {pkg.anchorPrice}
                      </span>
                      <span className="font-mono text-[8px] tracking-widest text-mad-red bg-mad-red/15 px-1.5 py-0.5 rounded font-bold uppercase">
                        Founding Rate
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-black text-4xl md:text-5xl tracking-tight text-white">
                        {pkg.foundingPrice}
                      </span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-4 mb-8">
                    {pkg.features.map((feature) => (
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
                    href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10 ${
                      pkg.featured
                        ? "bg-mad-red hover:bg-dark-crimson"
                        : "bg-background hover:bg-mad-red hover:border-mad-red"
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Magnetic>
              </motion.div>
            ))}
          </div>

          {/* Growth Care Plan Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 p-8 bg-surface-2 border border-mad-azure/30 hover:border-mad-azure/60 rounded-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="max-w-2xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mad-azure" />
                <span className="font-mono text-[10px] tracking-widest text-mad-azure uppercase font-bold">
                  GROWTH CARE — MONTHLY PLAN
                </span>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white mb-2">
                ₹2,999 / MONTH
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-sans mb-4">
                Keep your space selling itself. The tour is the start — this is what keeps it working.
              </p>
              <ul className="flex flex-col gap-2 mb-4">
                {[
                  "Fresh photos posted to your Google profile every month",
                  "Business info, hours and seasonal updates kept current",
                  "Google Posts published for offers and events",
                  "Search keyword optimization",
                  "Tour hosting, upkeep and link monitoring",
                  "Monthly performance snapshot (views, direction requests, calls)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary font-sans leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-text-secondary italic">Cancel anytime. Hosting continues for as long as you&apos;re on the plan.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0 mt-6 md:mt-0">
              <Magnetic>
                <Link
                  href="/contact?package=growth-care"
                  className="flex items-center gap-2 px-5 py-3 bg-background hover:bg-mad-azure/20 hover:border-mad-azure text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10"
                >
                  <span>Add Growth Care</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Magnetic>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 xl:px-24 py-20 border-t border-white/5 bg-background">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// FREQUENTLY ASKED</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">QUESTIONS ANSWERED</h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={faq.q}
                  className="bg-surface-1 border border-white/5 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="font-sans font-bold text-base md:text-lg text-white">
                      {faq.q}
                    </span>
                    <HelpCircle className={`h-5 w-5 text-mad-red transition-transform duration-300 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/5"
                      >
                        <p className="p-6 text-sm text-text-secondary leading-relaxed font-sans">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Page Ending CTA */}
      <section className="px-6 md:px-12 xl:px-24 py-16 border-t border-white/5 bg-surface-1 text-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-6">
          <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
            YOUR SPACE, SELLING ITSELF — EVERY HOUR.
          </h3>
          <p className="text-sm text-text-secondary font-sans max-w-lg leading-relaxed">
            Get a tailored spatial-marketing audit for your local space. Find out exactly where attention is leaking and how to capture it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Magnetic>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/10"
              >
                <span>Book Strategy Call</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co, I'd like to know more about your 360 tour packages.")}`}
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
