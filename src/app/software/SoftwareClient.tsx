"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Bot, CalendarCheck, BarChart3, Workflow } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";
import { config } from "@/lib/config";

const examples = [
  {
    icon: Bot,
    title: "WhatsApp Automation",
    desc: "Auto-reply, lead qualification, appointment confirmations — all on the platform your customers already use.",
  },
  {
    icon: CalendarCheck,
    title: "Reservation & CRM Systems",
    desc: "Custom booking flows that integrate with your calendar, staff assignments, and payment collection.",
  },
  {
    icon: Workflow,
    title: "Review-Request Flows",
    desc: "Automated post-visit review requests via SMS/WhatsApp — timed for maximum conversion.",
  },
  {
    icon: BarChart3,
    title: "Admin Dashboards",
    desc: "Real-time visibility into bookings, reviews, foot traffic, and campaign performance — built for your workflow.",
  },
];

export default function SoftwareClient() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      {/* Hero */}
      <section className="px-6 md:px-12 xl:px-24 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2 w-2 rounded-full bg-mad-azure" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // SERVICE 04 — SOFTWARE & AUTOMATION
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white mb-6 max-w-5xl leading-[0.9]">
            WE BUILD THE MACHINE<br />
            <span className="text-mad-azure">THAT RUNS WHILE YOU SLEEP.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed">
            Custom automations, booking systems, dashboards, and internal tools — built specifically for your business, not rented from a template.
          </p>
        </div>
      </section>

      {/* Examples */}
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// WHAT WE BUILD</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
              SYSTEMS THAT SCALE.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examples.map((example, idx) => {
              const Icon = example.icon;
              return (
                <motion.div
                  key={example.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-8 bg-surface-2 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-mad-azure/10 flex items-center justify-center group-hover:bg-mad-azure/20 transition-colors duration-300">
                      <Icon className="h-5 w-5 text-mad-azure" />
                    </div>
                    <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight">
                      {example.title}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans">
                    {example.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing — consultation-based */}
      <section className="px-6 md:px-12 xl:px-24 py-20 bg-background border-t border-white/5">
        <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center gap-8">
          <div className="flex flex-col gap-3 items-center">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// PRICING</span>
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight text-white">
              FROM ₹24,999
            </h2>
            <p className="text-lg text-text-secondary font-sans">
              Consultation-based. Every build is scoped to your needs.
            </p>
          </div>

          <div className="p-8 bg-surface-1 border border-white/5 rounded-xl max-w-lg w-full">
            <p className="text-sm text-text-secondary font-sans leading-relaxed mb-6">
              We don&apos;t list fixed tiers because scope varies. Tell us what&apos;s eating your time and we&apos;ll build the machine that fixes it.
            </p>
            <Magnetic>
              <Link
                href="/contact?package=Software%20%26%20Automation"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300 rounded"
              >
                <span>Book a Build Consult</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>

          <Magnetic>
            <a
              href={`${config.WHATSAPP_URL}?text=${encodeURIComponent("Hi MAD.Co, I need a custom automation or software system.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-surface-2 hover:bg-surface-3 text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/5"
            >
              <MessageSquare className="h-4 w-4 text-mad-azure" />
              <span>Chat on WhatsApp</span>
            </a>
          </Magnetic>
        </div>
      </section>

    </div>
  );
}
