"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { FloatingObject } from "@/components/ui/FloatingObject";
import { KineticMarquee } from "@/components/ui/KineticMarquee";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { config } from "@/lib/config";

// ─── Hero Word-by-Word Reveal ────────────────────────────────────────

function HeroHeadline() {
  const reducedMotion = useReducedMotion();
  const words1 = ["WHERE", "IDEAS", "GO"];
  const words2 = ["MAD"];
  const words3 = ["&", "BRANDS", "GO"];
  const words4 = ["BIG"];

  if (reducedMotion) {
    return (
      <h1 className="font-display text-[13vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] leading-[0.88] tracking-tight text-white uppercase">
        WHERE IDEAS GO <span className="text-white">MAD</span>
        <br />
        <span className="text-mad-red">& BRANDS GO BIG</span>
        <span className="text-mad-red">.</span>
      </h1>
    );
  }

  return (
    <h1 className="font-display text-[13vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] leading-[0.88] tracking-tight text-white uppercase">
      {/* Line 1: WHERE IDEAS GO MAD */}
      <span className="block">
        {words1.map((word, i) => (
          <motion.span
            key={word}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.2 + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.22em]"
          >
            {word}
          </motion.span>
        ))}
        {words2.map((word) => (
          <motion.span
            key={word}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.44,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block text-white"
          >
            {word}
          </motion.span>
        ))}
      </span>

      {/* Line 2: & BRANDS GO BIG. */}
      <span className="block text-mad-red">
        {words3.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.55 + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.22em]"
          >
            {word}
          </motion.span>
        ))}
        {words4.map((word) => (
          <motion.span
            key={word}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.79,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.1em]"
          >
            {word}
          </motion.span>
        ))}

        {/* The RED DOT — lands last with bounce + pulse */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 1.1,
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
          className="inline-block text-mad-red"
        >
          .
        </motion.span>
      </span>
    </h1>
  );
}

// ─── Origin Sticky Scroll Section (noth.in inspired) ─────────────────

function OriginStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const reducedMotion = useReducedMotion();

  // On scroll, the massive text scales up until it engulfs the screen
  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 20, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 0.9], [1, 1, 0]);
  // Move text slightly up as it scales
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  if (reducedMotion) {
    return (
      <section className="relative min-h-screen w-full flex items-center px-6 md:px-12 xl:px-24 py-24 overflow-hidden bg-mad-black border-y border-white/5">
        <FloatingObject type="chrome-cube" size={260} top="10%" right="5%" opacity={0.3} />
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <span className="font-mono text-xs tracking-widest text-mad-red uppercase block mb-6">
            // ORIGIN
          </span>
          <h2 className="font-display text-[10vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.5vw] leading-[0.9] tracking-tight text-white uppercase mb-12">
            MAD = MAKE A<br />
            <span className="text-mad-red">DIFFERENCE.</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="flex flex-col gap-6">
              <p className="text-base md:text-lg text-text-secondary leading-relaxed font-sans">
                MAD.Co started with one conviction: local businesses with great spaces deserve better than blurry photos and broken Google listings.
              </p>
              <p className="text-base md:text-lg text-text-secondary leading-relaxed font-sans">
                We built the tools to fix that — immersive 360° tours that let customers walk in before they walk in, websites that load faster than doubt, and tap technology that turns every surface into a conversion point.
              </p>
              <p className="text-base md:text-lg text-mad-red leading-relaxed font-sans font-medium uppercase tracking-widest">
                Mangalore first. Then everywhere.
              </p>
            </div>
            <div className="flex flex-col gap-4 border-l-2 border-white/10 pl-6">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-mad-red uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-mad-red" />
                <span>Our conviction</span>
              </div>
              <p className="text-2xl md:text-3xl font-display text-white uppercase tracking-tight leading-tight">
                If your space matters to you, we make it impossible to ignore.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-mad-black border-y border-white/5">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Kinetic floating elements spinning in background */}
        <FloatingObject type="chrome-cube" size={200} top="15%" right="10%" parallaxStrength={0.5} opacity={0.6} driftDuration={15} />
        <FloatingObject type="dark-sphere" size={140} bottom="15%" left="12%" parallaxStrength={0.3} opacity={0.4} driftDuration={10} />

        {/* The scaling massive text mask */}
        <motion.div 
          style={{ scale, opacity, y }} 
          className="relative z-20 flex flex-col items-center origin-center pointer-events-none"
        >
          <span className="font-mono text-xs md:text-sm tracking-widest text-mad-red uppercase block mb-6 text-center">
            // ORIGIN
          </span>
          <h2 className="font-display text-[15vw] leading-[0.8] tracking-tighter text-white uppercase text-center whitespace-nowrap">
            MAD = MAKE A<br />
            <span className="text-mad-red text-[16vw]">DIFFERENCE.</span>
          </h2>
        </motion.div>
      </div>

      {/* The actual text content is revealed at the bottom of the scroll */}
      <div className="absolute bottom-0 w-full min-h-screen flex items-center justify-center px-6 md:px-12 xl:px-24 pb-32 pt-24 z-30 pointer-events-none">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pointer-events-auto">
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col gap-6 bg-mad-black/60 p-8 rounded-2xl backdrop-blur-md border border-white/5">
              <p className="text-xl md:text-2xl text-white leading-relaxed font-sans font-light">
                MAD.Co started with one conviction: local businesses with great spaces deserve better than blurry photos and broken Google listings.
              </p>
              <p className="text-base md:text-lg text-text-secondary leading-relaxed font-sans">
                We built the tools to fix that — immersive 360° tours that let customers walk in before they walk in, websites that load faster than doubt, and tap technology that turns every surface into a conversion point.
              </p>
              <p className="text-base md:text-lg text-mad-red leading-relaxed font-sans font-medium uppercase tracking-widest">
                Mangalore first. Then everywhere.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4} direction="right">
            <div className="flex flex-col gap-4 border-l-2 border-mad-red/50 pl-8 py-4 bg-mad-black/40 rounded-r-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-mad-red uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-breathe" />
                <span>Our Conviction</span>
              </div>
              <p className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight leading-[0.9]">
                If your space matters to you, we make it impossible to ignore.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Belief Panel ────────────────────────────────────────────────────

interface BeliefPanelProps {
  statement: string;
  supporting: string;
  index: number;
  objectType: "red-orb" | "dark-sphere" | "glass-lens" | "chrome-cube";
  objectPosition: { top?: string; right?: string; left?: string; bottom?: string };
}

function BeliefPanel({ statement, supporting, index, objectType, objectPosition }: BeliefPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-30%" });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center px-6 md:px-12 xl:px-24 overflow-hidden snap-start bg-mad-black border-b border-white/5"
    >
      {/* Intense Background Marquee */}
      {!reducedMotion && (
        <div className="absolute inset-0 z-0 flex flex-col justify-center opacity-[0.03] pointer-events-none overflow-hidden mix-blend-screen">
          <motion.div
            animate={{ x: index % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap font-display text-[25vw] leading-none uppercase text-white tracking-tighter"
          >
            {statement} • {statement} • {statement} • {statement}
          </motion.div>
        </div>
      )}

      {/* Pure CSS Floating Object */}
      <FloatingObject
        type={objectType}
        size={180}
        opacity={0.7}
        driftDuration={8 + index * 2}
        parallaxStrength={0.4}
        {...objectPosition}
      />

      {/* Panel Number */}
      <motion.span
        initial={reducedMotion ? undefined : { opacity: 0, x: -50 }}
        animate={isInView || reducedMotion ? { opacity: 0.1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-12 left-12 font-display text-[15vw] md:text-[10vw] text-white leading-none select-none pointer-events-none"
      >
        0{index + 1}
      </motion.span>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2
          initial={reducedMotion ? undefined : { y: 60, opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={
            isInView || reducedMotion
              ? { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }
              : { y: 60, opacity: 0, scale: 0.9, filter: "blur(10px)" }
          }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[8vw] sm:text-[6vw] md:text-[5vw] lg:text-[4vw] leading-[0.95] tracking-tight text-white uppercase drop-shadow-2xl"
        >
          {statement}
        </motion.h2>

        <motion.p
          initial={reducedMotion ? undefined : { y: 30, opacity: 0 }}
          animate={
            isInView || reducedMotion
              ? { y: 0, opacity: 1 }
              : { y: 30, opacity: 0 }
          }
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-text-secondary font-sans max-w-2xl mx-auto"
        >
          {supporting}
        </motion.p>
      </div>

      {/* Subtle red accent line */}
      <motion.div
        initial={reducedMotion ? undefined : { width: 0 }}
        animate={isInView || reducedMotion ? { width: "100px" } : { width: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[3px] bg-mad-red rounded-full"
      />
    </div>
  );
}

// ─── Count-Up Number ─────────────────────────────────────────────────

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Main Studio Page ────────────────────────────────────────────────

const BELIEFS: Omit<BeliefPanelProps, "index">[] = [
  {
    statement: "ATTENTION IS THE REAL PRODUCT.",
    supporting: "We don't sell services. We sell walk-ins, trust, and first impressions.",
    objectType: "red-orb",
    objectPosition: { top: "15%", right: "12%" },
  },
  {
    statement: "SPEED IS TRUST.",
    supporting: "A slow site is a broken promise. We engineer for sub-second delivery.",
    objectType: "dark-sphere",
    objectPosition: { top: "25%", left: "8%" },
  },
  {
    statement: '"GOOD ENOUGH" IS NOT ENOUGH.',
    supporting: "If 'good enough' is enough for you, we're not for you.",
    objectType: "glass-lens",
    objectPosition: { bottom: "15%", right: "15%" },
  },
  {
    statement: "SHOW, DON'T DESCRIBE.",
    supporting: "Most show you a photo. We let you walk in.",
    objectType: "chrome-cube",
    objectPosition: { top: "20%", left: "10%" },
  },
];

export default function AboutClient() {
  return (
    <div className="w-full min-h-screen flex flex-col font-sans overflow-x-hidden bg-mad-black">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO MOMENT
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full flex items-center justify-center px-6 md:px-12 xl:px-24 overflow-hidden">
        {/* Film grain overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Pure CSS Kinetic Orbs */}
        <FloatingObject
          type="red-orb"
          size={180}
          top="20%"
          right="10%"
          driftRange={35}
          driftDuration={12}
          parallaxStrength={0.6}
          className="hidden md:block"
        />
        <FloatingObject
          type="dark-sphere"
          size={90}
          bottom="25%"
          left="8%"
          driftRange={20}
          driftDuration={15}
          parallaxStrength={0.3}
          className="hidden lg:block"
        />

        <div className="relative z-20 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-mad-red animate-breathe" />
            <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
              // THE STUDIO
            </span>
          </motion.div>

          <HeroHeadline />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-10 max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed font-sans font-light"
          >
            We work exclusively with experience-first businesses. If your space
            doesn&apos;t matter to you, we&apos;re not the right fit. If it does
            — we make it impossible to ignore.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
          <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ height: ["0px", "24px", "0px"], y: [0, 12, 24] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] bg-mad-red"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. KINETIC MARQUEE BAND
          ═══════════════════════════════════════════════════════════ */}
      <KineticMarquee className="border-y border-white/5 bg-mad-black" />

      {/* ═══════════════════════════════════════════════════════════
          3. ORIGIN STORY — Sticky Scaling Typographic Mask
          ═══════════════════════════════════════════════════════════ */}
      <OriginStorySection />

      {/* ═══════════════════════════════════════════════════════════
          4. BELIEFS — Massive Background Marquees
          ═══════════════════════════════════════════════════════════ */}
      <div className="snap-y snap-mandatory border-t border-white/5">
        {BELIEFS.map((belief, index) => (
          <BeliefPanel
            key={belief.statement}
            statement={belief.statement}
            supporting={belief.supporting}
            index={index}
            objectType={belief.objectType}
            objectPosition={belief.objectPosition}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          5. DATA STRIP
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 xl:px-24 py-20 bg-[#0a0a0f] border-b border-white/5 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {[
            { label: "Founded", value: <CountUp target={2026} /> },
            { label: "Base", value: "Mangalore" },
            { label: "Domain", value: "madco.in" },
            { label: "Reach", value: "India-wide" },
          ].map((stat, idx) => (
            <ScrollReveal key={stat.label} delay={idx * 0.1}>
              <div className="flex flex-col gap-2 border-l border-white/10 pl-6">
                <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                  {stat.label}
                </span>
                <span className="font-display text-2xl md:text-4xl text-white uppercase tracking-tight">
                  {stat.value}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. CLOSING CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 xl:px-24 py-32 text-center overflow-hidden">
        <FloatingObject
          type="glass-lens"
          size={140}
          top="15%"
          left="10%"
          driftDuration={18}
          className="hidden md:block"
        />

        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center gap-10">
          <ScrollReveal>
            <h3 className="font-display text-[8vw] sm:text-[5vw] md:text-[4vw] lg:text-[3.5vw] leading-[0.95] tracking-tight text-white uppercase">
              WE DON&apos;T MARKET.
              <br />
              <span className="text-mad-red">WE MAKE A DIFFERENCE.</span>
            </h3>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              <Magnetic>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-10 py-5 bg-mad-red hover:bg-dark-crimson text-white text-xs md:text-sm font-mono tracking-widest uppercase transition-colors duration-300 rounded shadow-[0_0_30px_rgba(245,37,15,0.3)] group"
                >
                  <span>Work With Us</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={`${config.WHATSAPP_URL}?text=${encodeURIComponent(
                    "Hi MAD.Co, I'd like to learn more about your studio."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-5 bg-surface-2 hover:bg-surface-3 text-white text-xs md:text-sm font-mono tracking-widest uppercase transition-colors duration-300 rounded border border-white/10 hover:border-white/20 group"
                >
                  <MessageSquare className="h-4 w-4 text-mad-azure group-hover:scale-110 transition-transform" />
                  <span>Chat on WhatsApp</span>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
