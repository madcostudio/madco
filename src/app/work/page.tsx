"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { CompletenessMeter, CustomerDecisionMoment, HotspotDemo, DeliveryKit } from "@/components/ui/WorkVisuals";

// Concept Tours Data
const conceptTours = [
  {
    id: "cafe-esthetique",
    name: "Café Esthétique",
    type: "Café — high-retention social layout",
    details: "9 points, menu hotspots",
    image: "/restaurant_360.png",
    color: "border-championship-gold/20"
  },
  {
    id: "iron-forge-gym",
    name: "The Iron Forge Gym",
    type: "Fitness Facility — spatial trust",
    details: "12 points, equipment tags",
    image: "/restaurant_360.png",
    color: "border-electric-azure/20"
  },
  {
    id: "aura-dining",
    name: "Aura Dining Room",
    type: "Premium Restaurant — atmosphere",
    details: "15 points, reservation links",
    image: "/restaurant_360.png",
    color: "border-mad-red/20"
  }
];

export default function WorkPage() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* 1. Hero Section */}
      <section className="px-6 md:px-12 xl:px-24 py-16 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
            // DEMONSTRATION GALLERY
          </span>
          <h1 className="font-sans font-black text-5xl md:text-7xl uppercase tracking-tighter text-white mb-6">
            SEE THE DIFFERENCE.
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed mb-10 border-l-2 border-championship-gold pl-6 text-left bg-white/5 p-6 rounded-r-lg">
            We&apos;re a new studio building our first client portfolio. Everything below is concept work — built to show exactly what we deliver. Your venue could be the first real one.
          </p>
          <Magnetic>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-4 bg-mad-red hover:bg-red-600 text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded shadow-lg shadow-mad-red/20"
            >
              <span>Book Your Spatial Audit</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* 2. Concept Tours Array */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 mb-12">
            <h2 className="font-sans font-black text-3xl uppercase tracking-tight text-white">Spatial Demonstrations</h2>
            <p className="text-text-secondary text-sm">Interactive panoramas. Look around.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {conceptTours.map((tour, idx) => (
              <motion.div 
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-surface-2 border ${tour.color} hover:border-white/20 rounded-xl overflow-hidden transition-colors flex flex-col`}
              >
                <div className="relative h-64 w-full">
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white font-mono text-[10px] tracking-widest px-2 py-1 rounded uppercase border border-white/10 z-10">
                    CONCEPT
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tour.image} alt={tour.name} className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] saturate-[1.2]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="font-mono text-xs uppercase text-white/50 border border-white/20 bg-black/40 px-3 py-1 rounded backdrop-blur-sm">Drag to Look</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="font-sans font-bold text-xl text-white uppercase tracking-tight mb-1">{tour.name}</h3>
                  <p className="text-text-secondary text-xs mb-3">{tour.type}</p>
                  <p className="text-mad-red text-[10px] font-mono tracking-widest uppercase mt-auto">{tour.details}</p>
                </div>
              </motion.div>
            ))}
            
            {/* 5. "Your venue here" slot */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-background border-2 border-dashed border-championship-gold/40 hover:border-championship-gold rounded-xl overflow-hidden transition-colors flex flex-col justify-center items-center text-center p-8 min-h-[350px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-championship-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-championship-gold" />
              </div>
              <h3 className="font-sans font-bold text-xl text-championship-gold uppercase tracking-tight mb-2">Reserved</h3>
              <p className="text-text-secondary text-sm max-w-[200px]">This space is reserved for our first founding venue.</p>
              <Link href="/contact" className="mt-6 font-mono text-xs text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded uppercase tracking-widest border border-white/10 transition-colors">
                Claim Slot
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Google Business Profile Transformation */}
      <section className="px-6 md:px-12 xl:px-24 py-24 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="flex flex-col gap-6 order-2 lg:order-1">
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
                // THE REAL TRANSFORMATION
              </span>
              <h2 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight">
                MOST PROFILES ARE LEAKING CUSTOMERS.
              </h2>
              <p className="text-base text-text-secondary leading-relaxed font-sans">
                Three dark photos, no hours, an empty description. That&apos;s what most customers see before they decide where to go — and it&apos;s why good venues lose to worse ones with better listings.
              </p>
              <p className="text-base text-text-secondary leading-relaxed font-sans">
                We rebuild the entire first impression: a walkable 360° tour, edited photography, a complete profile, and monthly upkeep that keeps it working.
              </p>
              <div className="mt-4">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10"
                  >
                    <span>See What Yours Looks Like</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Magnetic>
              </div>
            </div>

            <div className="flex flex-col gap-8 order-1 lg:order-2">
              <BeforeAfter />
            </div>

          </div>
        </div>
      </section>

      {/* Visual Component Section (Customer Decision & Hotspots) */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col gap-4">
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight text-white">The Decision Point</h3>
                <CustomerDecisionMoment />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-sans font-bold text-2xl uppercase tracking-tight text-white">Interactive Depth</h3>
                <HotspotDemo />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/5 pt-12">
              <div className="flex flex-col gap-4 order-2 lg:order-1">
                <CompletenessMeter />
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="font-sans font-black text-3xl uppercase tracking-tight text-white mb-4">Complete Rebuilds</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-md">We don&apos;t just hand you files. We deploy them into the ecosystem where your customers are actually searching. An optimised profile acts as an always-on funnel.</p>
              </div>
            </div>
         </div>
      </section>

      {/* 4. What a delivery looks like */}
      <section className="px-6 md:px-12 xl:px-24 py-24 bg-background border-t border-white/5">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // THE ARSENAL
            </span>
            <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-white">
              WHAT YOU ACTUALLY GET.
            </h2>
            <p className="text-text-secondary text-sm">Everything included in a standard Immersive Pro delivery.</p>
          </div>
          <DeliveryKit />
        </div>
      </section>

      {/* 6. CTA Band */}
      <section className="px-6 md:px-12 xl:px-24 py-20 bg-mad-red relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter text-white mb-2">
              Ready to Upgrade Your Space?
            </h2>
            <p className="text-white/80 text-sm">Claim one of the founding slots before they close.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/contact"
              className="flex justify-center items-center px-6 py-4 bg-background text-white hover:text-mad-red text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded font-bold shadow-xl"
            >
              Book a Call
            </Link>
            <a
              href="https://wa.me/910000000000" // Placeholder, update if needed
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded font-bold"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
