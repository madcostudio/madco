"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, HelpCircle, ArrowRight, MessageSquare, ShieldCheck, Map, Smartphone } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";

const packages = [
  {
    name: "Starter Scan",
    standardPrice: "₹9,999",
    foundingPrice: "₹4,999",
    target: "Boutiques · Salons · Small Cafés",
    features: [
      "360° capture of 5 points inside your space",
      "3 professionally edited still photos",
      "Published to your Google Business Profile",
      "Shareable tour link",
      "Website embed link",
      "7-day delivery",
      "1 year hosting included"
    ],
    cta: "Request Starter Scan",
    accentColor: "border-white/5",
    badge: null
  },
  {
    name: "Immersive Pro",
    standardPrice: "₹19,999",
    foundingPrice: "₹9,999",
    target: "Restaurants · Gyms · Clinics · Showrooms",
    features: [
      "360° capture of 8–10 points inside your space",
      "8 professionally edited still photos",
      "Published & verified on Google Maps and Search",
      "Google Business Profile optimisation (category, hours, contact info, cover images)",
      "Printable QR code for your entrance & menus",
      "Up to 5 clickable hotspots inside the tour (menu, booking link, contact)",
      "Shareable link + performance-optimised website embed",
      "5-day delivery",
      "1 year hosting included"
    ],
    cta: "Request Immersive Pro",
    accentColor: "border-mad-red/40",
    badge: "RECOMMENDED"
  },
  {
    name: "Signature",
    standardPrice: "₹39,999",
    foundingPrice: "₹19,999",
    target: "Premium Restaurants · Hotels · Showrooms · Multi-Room Venues",
    features: [
      "360° capture of 15–20 points inside your space",
      "15 professionally edited still photos",
      "1 short vertical reel for social media",
      "Published & verified on Google Maps and Search",
      "Full Google Business Profile optimisation",
      "Printable QR code",
      "Custom hotspots inside the tour",
      "Tour player styled with your logo and colours",
      "Website embed support (we coordinate with your developer)",
      "Priority 3–5 day delivery",
      "1 year hosting included"
    ],
    cta: "Connect for Consultation",
    accentColor: "border-championship-gold/40",
    badge: "FOUNDING SPECIAL"
  }
];

const faqs = [
  {
    q: "How long does a scanning session take?",
    a: "For small-to-medium venues (cafes, salons), the scan takes 1.5 to 3 hours. Larger spaces like multi-level gyms or car showrooms may require 4 to 6 hours. We schedule around your slowest hours to minimize business disruption."
  },
  {
    q: "Do we need to close our business during the scan?",
    a: "No, but we highly recommend scanning when the space is empty of customers. This ensures we capture the clean, uninterrupted aesthetics of your interiors without blur or privacy issues."
  },
  {
    q: "How does the Google Maps integration work?",
    a: "As certified Google Street View partners, we upload the stitched panoramas directly onto your business location profile. Customers browsing your profile on Google Maps will see a 'See Inside' thumbnail, letting them explore your space."
  },
  {
    q: "Are there recurring hosting fees?",
    a: "Your package includes standard cloud hosting (1 to 3 years, or lifetime for Enterprise). After this period, basic hosting is only ₹1,500/year to keep the interactive viewer online. Google Maps listings remain active forever with zero hosting fees."
  }
];

export default function ToursPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Intro Header */}
      <section className="px-6 md:px-12 xl:px-24 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          
          <div className="flex items-center gap-3 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-championship-gold uppercase">
              VIRTUAL TOUR PLATFORM // CORE PRICING
            </span>
          </div>

          <h1 className="font-sans font-black text-5xl md:text-7xl uppercase tracking-tighter text-white mb-6 max-w-4xl leading-tight">
            PHYSICAL EXPERIENCES,<br />
            <span className="text-stroke-red text-mad-red">DIGITALLY STAGED.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed mb-8">
            Create an immediate sense of trust. Let prospective customers step inside your cafe, shop, or showroom directly from search. Highly optimized, interactive, and engineered for conversion.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl border-t border-white/5 pt-8 mt-12">
            <div className="flex gap-3">
              <Map className="h-5 w-5 text-mad-red shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Google Maps Sync</h4>
                <p className="text-xs text-text-secondary mt-1">Boost maps click-through by letting users see inside instantly.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Smartphone className="h-5 w-5 text-electric-azure shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Mobile Optimized</h4>
                <p className="text-xs text-text-secondary mt-1">Responsive gyro support for immersive smartphone pan sweeps.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-championship-gold shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm text-white uppercase">Verified HDR</h4>
                <p className="text-xs text-text-secondary mt-1">Professional sensors for ultra-sharp lighting exposure.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing / Packages Grid */}
      <section id="packages" className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col items-start gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// TOUR CONFIGURATIONS</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-white">CHOOSE YOUR SCALE</h2>
            <div className="mt-4 flex flex-col w-full max-w-2xl bg-white/5 border-l-4 border-championship-gold backdrop-blur-sm rounded-r-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse" />
                <span className="font-mono text-xs tracking-widest font-bold text-white">
                  FOUNDING RATE — LIVE NOW
                </span>
              </div>
              <p className="text-sm text-text-secondary font-sans mb-3">
                Up to 50% off standard pricing for our first 10 Mangalore venues.
              </p>
              <div className="flex items-center justify-between text-xs font-mono border-t border-white/10 pt-3">
                <span className="text-championship-gold">[ {config.FOUNDING_SLOTS_LEFT} of 10 remaining ]</span>
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
                className={`relative flex flex-col justify-between p-8 bg-surface-2 rounded-xl border ${pkg.accentColor} hover:border-white/20 transition-all duration-300`}
              >
                <div>
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 bg-mad-red text-white font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-sm uppercase font-bold">
                      {pkg.badge}
                    </div>
                  )}

                  <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-1">
                    {pkg.name}
                  </h3>
                  <p className="font-mono text-[10px] tracking-widest text-text-secondary uppercase mb-6">
                    {pkg.target}
                  </p>

                  <div className="flex flex-col gap-1 mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="font-sans line-through text-sm text-text-secondary">
                        {pkg.standardPrice}
                      </span>
                      <span className="font-mono text-[8px] tracking-widest text-mad-red bg-mad-red/15 px-1.5 py-0.5 rounded font-bold uppercase">
                        Founding Rate
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-black text-4xl md:text-5xl tracking-tight text-white">
                        {pkg.foundingPrice}
                      </span>
                      {pkg.foundingPrice !== "Custom" && <span className="font-mono text-xs text-text-secondary uppercase">/ Setup</span>}
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-text-secondary uppercase mb-4">
                    Pairs with Growth Care — ₹2,999/month.
                  </p>

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
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-background hover:bg-mad-red hover:border-mad-red text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10"
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
            className="mt-12 p-8 bg-surface-2 border border-championship-gold/40 hover:border-championship-gold/80 rounded-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
            style={{
              background: "rgba(15, 15, 16, 0.7)",
              backdropFilter: "blur(20px) saturate(120%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.4)"
            }}
          >
            <div className="max-w-2xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-championship-gold" />
                <span className="font-mono text-[10px] tracking-widest text-championship-gold uppercase font-bold">
                  GROWTH CARE — MONTHLY PLAN
                </span>
              </div>
              <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-2">
                ₹2,999 / MONTH
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed font-sans mb-4">
                The tour is the start. This is what keeps it working.
              </p>
              <ul className="flex flex-col gap-2 mb-4">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary font-sans leading-tight">Fresh photos posted to your Google profile every month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary font-sans leading-tight">Business info, hours and seasonal updates kept current</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary font-sans leading-tight">Google Posts published for offers and events</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary font-sans leading-tight">Search keyword optimisation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary font-sans leading-tight">Tour hosting, upkeep and link monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-mad-red shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary font-sans leading-tight">Monthly performance snapshot (views, direction requests, calls)</span>
                </li>
              </ul>
              <p className="text-xs text-text-secondary italic">Cancel anytime. Hosting continues for as long as you&apos;re on the plan.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0 mt-6 md:mt-0">
              <Magnetic>
                <Link
                  href="/contact?package=growth-care"
                  className="flex items-center gap-2 px-5 py-3 bg-background hover:bg-championship-gold/20 hover:border-championship-gold text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10"
                >
                  <span>Add Growth Care</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Magnetic>
            </div>
          </motion.div>

          {/* Add-ons */}
          <div className="mt-8 p-8 bg-surface-2 border border-white/5 rounded-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                // ADD-ONS
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-text-secondary font-sans">Extra 360° point</span>
                <span className="font-mono text-xs text-white">₹750 each</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-text-secondary font-sans">5 extra edited photos</span>
                <span className="font-mono text-xs text-white">₹1,500</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-text-secondary font-sans">Short vertical reel</span>
                <span className="font-mono text-xs text-white">₹3,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-text-secondary font-sans">Standalone website embed</span>
                <span className="font-mono text-xs text-white">₹2,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5 md:col-span-2">
                <span className="text-sm text-text-secondary font-sans">Additional branch / location</span>
                <span className="font-mono text-xs text-white">Quoted separately</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 xl:px-24 py-20 border-t border-white/5 bg-background">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="flex flex-col items-center text-center gap-3 mb-16">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// SERVICE FREQUENCIES</span>
            <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-white">QUESTIONS ANSWERED</h2>
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
                    <HelpCircle className={`h-5 w-5 text-mad-red transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
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
          <h3 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-white">
            WANT A DETAILED BRAND BLUEPRINT?
          </h3>
          <p className="text-sm text-text-secondary font-sans max-w-lg leading-relaxed">
            Get a tailored marketing strategy audit for your local space. Find out exactly where attention is leaking and how to capture it.
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
                href="https://wa.me/918762640420?text=Hi%20Mad.co%2C%20I'd%20like%20to%20know%20more%20about%20your%20360%20tour%20packages."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-4 bg-surface-2 hover:bg-surface-3 text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/5"
              >
                <MessageSquare className="h-4 w-4 text-electric-azure" />
                <span>Chat on WhatsApp</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

    </div>
  );
}
