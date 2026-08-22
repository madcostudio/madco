"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Star, Smartphone, QrCode, ShoppingBag } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";

const plays = [
  {
    num: "01",
    title: "Tap-to-Review",
    icon: Star,
    headline: "One tap. Five stars.",
    description: "Branded NFC/QR review stands that send a customer straight to your Google review in one tap. Local SEO gold — the easiest win for any venue.",
    detail: "Place it at the counter, the exit, or right at the table. The customer taps, your review count climbs.",
    accent: "text-mad-red",
    bgAccent: "bg-mad-red/5",
  },
  {
    num: "02",
    title: "Tap-to-Menu",
    icon: QrCode,
    headline: "No app. No fumbling.",
    description: "Instant digital menu that opens in the browser. No downloads, no PDFs, no asking the waiter. The customer taps and browses.",
    detail: "Works for restaurants, cafes, bars, salons — anywhere with a menu or price list.",
    accent: "text-mad-azure",
    bgAccent: "bg-mad-azure/5",
  },
  {
    num: "03",
    title: "Tap-to-Order",
    icon: ShoppingBag,
    headline: "Order from your seat.",
    description: "Cinema seat-back NFC — tap your phone, order snacks mid-movie, no flashlight, no queue, no missed scene. We build the tech layer: tap → menu → order → pay → notify staff.",
    detail: "Also works for restaurants, lounges, stadiums — any venue that wants frictionless ordering.",
    accent: "text-white",
    bgAccent: "bg-white/5",
    featured: true,
  },
];

const pricing = [
  {
    name: "Review Booster",
    from: "₹4,999",
    what: "Branded NFC/QR review stands → one-tap Google reviews",
    note: "Hardware billed at cost",
  },
  {
    name: "Tap Menu / Order",
    from: "₹9,999 setup",
    what: "Digital menu / order-to-seat system + per-point hardware",
    note: "Monthly maintenance available",
  },
  {
    name: "Theater / Enterprise",
    from: "Let's talk",
    what: "Bulk seat-back NFC, custom order system, multi-location",
    note: "Volume pricing",
  },
];

export default function MadTapClient() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Hero */}
      <section className="px-6 md:px-12 xl:px-24 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="h-4 w-4 text-white" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // SERVICE 03 — MAD TAP
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight text-white mb-6 max-w-4xl leading-[0.9]">
            TAP.<br />
            <span className="text-mad-red">AND IT HAPPENS.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed mb-4">
            Turn every table, seat, and counter into a moment of action. Physical NFC + QR points that trigger the thing you want your customer to do — order, review, explore.
          </p>

          <div className="flex items-center gap-2 mt-6 p-3 bg-surface-1 border border-white/5 rounded-lg max-w-md">
            <span className="font-mono text-xs tracking-widest text-white uppercase font-bold">
              NFC ADVANTAGE:
            </span>
            <span className="text-sm text-text-secondary font-sans italic">
              &ldquo;No flashlight. No squinting. Just tap.&rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* The Three Plays */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// THE THREE PLAYS</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
              ONE TAP. THREE OUTCOMES.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plays.map((play, idx) => {
              const Icon = play.icon;
              return (
                <motion.div
                  key={play.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`relative p-8 bg-surface-2 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col ${
                    play.featured ? "ring-1 ring-mad-red/20" : ""
                  }`}
                >
                  {play.featured && (
                    <div className="absolute top-4 right-4 bg-mad-red text-white font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-sm uppercase font-bold">
                      ⭐ HERO PLAY
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div className={`h-10 w-10 rounded-full ${play.bgAccent} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${play.accent}`} />
                    </div>
                    <span className="font-mono text-xs tracking-widest text-text-secondary">{play.num}</span>
                  </div>

                  <h3 className="font-display text-2xl uppercase tracking-tight text-white mb-2">
                    {play.title}
                  </h3>
                  <p className={`text-sm font-sans font-bold ${play.accent} mb-3`}>
                    {play.headline}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans mb-4">
                    {play.description}
                  </p>
                  <p className="text-xs text-text-secondary/70 leading-relaxed font-sans mt-auto pt-4 border-t border-white/5">
                    {play.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Also for */}
          <div className="mt-12 p-6 bg-surface-2 border border-white/5 rounded-xl">
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">// ALSO FOR:</span>
            <p className="text-sm text-white font-sans mt-2">
              Restaurants · Cafés · Salons · Showrooms · Cinemas · Stadiums · Any shop that wants reviews or orders.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing — Section 8.C */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-background border-t border-white/5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// PRICING</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
              SIMPLE SETUP.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {pricing.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-1 border border-white/5 rounded-lg hover:border-white/10 transition-all duration-300 gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-text-secondary font-sans mt-1">{item.what}</p>
                  <span className="text-[10px] font-mono text-text-secondary tracking-wider mt-1 inline-block">{item.note}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-sans font-black text-2xl md:text-3xl text-white tracking-tight">
                    {item.from}
                  </span>
                  <Magnetic>
                    <Link
                      href={`/contact?package=${encodeURIComponent(`Tap: ${item.name}`)}`}
                      className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-mad-red text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10 hover:border-mad-red shrink-0"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Magnetic>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="px-6 md:px-12 xl:px-24 py-16 border-t border-white/5 bg-surface-1 text-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-6">
          <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
            NO FLASHLIGHT. NO QUEUE. JUST TAP.
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Magnetic>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded"
              >
                <span>Book a Consult</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co, I'm interested in MAD Tap for my business.")}`}
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
