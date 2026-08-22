"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Share2 } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";

export default function SocialClient() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Connect to existing booking API with a special category for waitlist
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Waitlist Signup",
          businessName: "—",
          contact: "—",
          email: email,
          category: "social-waitlist",
        }),
      });
      setIsSubmitted(true);
    } catch {
      // Fallback — still show success so UX doesn't freeze
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex flex-col font-sans">
      
      <section className="px-6 md:px-12 xl:px-24 flex-1 flex items-center justify-center py-24">
        <div className="max-w-2xl mx-auto w-full text-center flex flex-col items-center gap-8">
          
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="h-16 w-16 rounded-full bg-mad-azure/10 border border-mad-azure/20 flex items-center justify-center"
          >
            <Share2 className="h-8 w-8 text-mad-azure" />
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
              // SERVICE 05 — SOCIAL MEDIA
            </span>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight text-white leading-[0.9]">
              COMING SOON.
            </h1>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-lg">
              Full-stack social media management for experience-first brands. We&apos;re building it differently — content that sells spaces, not fills feeds.
            </p>
          </motion.div>

          {/* Waitlist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-surface-1 border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                  />
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-3 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      <span>{isSubmitting ? "..." : "Join"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Magnetic>
                </div>
                <p className="text-[10px] font-mono text-text-secondary tracking-wider text-center">
                  JOIN THE WAITLIST — YOU&apos;LL BE FIRST WHEN WE OPEN THE DOORS.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 p-6 bg-surface-1 border border-white/5 rounded-xl"
              >
                <div className="h-10 w-10 rounded-full bg-mad-red/10 border border-mad-red flex items-center justify-center">
                  <Check className="h-5 w-5 text-mad-red" />
                </div>
                <p className="text-sm text-white font-sans font-bold uppercase tracking-tight">
                  You&apos;re on the list.
                </p>
                <p className="text-xs text-text-secondary font-sans">
                  We&apos;ll reach out as soon as we launch.
                </p>
              </motion.div>
            )}
          </motion.div>

        </div>
      </section>

    </div>
  );
}
