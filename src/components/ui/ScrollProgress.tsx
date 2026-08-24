"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, Compass } from "lucide-react";

const SECTORS = [
  { id: "hero", name: "HERO // 01", threshold: 0 },
  { id: "services", name: "SERVICES // 02", threshold: 0.18 },
  { id: "science", name: "SCIENCE // 03", threshold: 0.40 },
  { id: "showcase", name: "SHOWCASE // 04", threshold: 0.58 },
  { id: "process", name: "PROCESS // 05", threshold: 0.75 },
  { id: "contact", name: "CONTACT // 06", threshold: 0.90 },
];

export function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);
  const [activeSector, setActiveSector] = useState(SECTORS[0].name);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const unsubProgress = scrollYProgress.on("change", (latest) => {
      const p = Math.round(latest * 100);
      setPercent(p);

      // Find current active sector based on scroll position
      let current = SECTORS[0].name;
      for (let i = SECTORS.length - 1; i >= 0; i--) {
        if (latest >= SECTORS[i].threshold) {
          current = SECTORS[i].name;
          break;
        }
      }
      setActiveSector(current);
    });

    const unsubScroll = scrollY.on("change", (latest) => {
      setShowScrollTop(latest > 350);
    });

    return () => {
      unsubProgress();
      unsubScroll();
    };
  }, [scrollYProgress, scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate circular stroke offset for 360 degree HUD indicator
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <>
      {/* ── Top Dual-Layer Laser Plasma Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-white/5">
        {/* Ambient Glow Rail */}
        <motion.div
          style={{ scaleX, transformOrigin: "0%" }}
          className="absolute inset-0 bg-gradient-to-r from-mad-red via-mad-azure to-mad-red blur-xs opacity-80"
        />

        {/* Sharp Laser Core */}
        <motion.div
          style={{ scaleX, transformOrigin: "0%" }}
          className="relative h-full w-full bg-gradient-to-r from-mad-red via-[#ff4d36] to-mad-red shadow-[0_0_12px_#F5250F,0_0_24px_#F5250F]"
        >
          {/* Moving Laser Plasma Spark at the Tip */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_12px_#FFFFFF,0_0_24px_#F5250F]" />
        </motion.div>
      </div>

      {/* ── Dramatic Spatial HUD Tracker (Floating bottom-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showScrollTop ? 1 : 0.6, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 bg-surface-1/90 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(245,37,15,0.15)] font-mono select-none transition-all duration-300 hover:border-mad-red/50 hover:shadow-[0_0_25px_rgba(245,37,15,0.3)] group"
      >
        {/* Orbital SVG Progress Gauge */}
        <div className="relative h-8 w-8 flex items-center justify-center">
          <svg className="h-8 w-8 -rotate-90">
            <circle
              cx="16"
              cy="16"
              r={radius}
              className="stroke-white/10"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="16"
              cy="16"
              r={radius}
              className="stroke-mad-red transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute font-bold text-[9px] text-white">
            {percent}
          </span>
        </div>

        {/* Sector Name & Status */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mad-red animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-text-secondary">SPATIAL HUD</span>
          </div>
          <span className="text-[11px] font-bold text-white tracking-wider">
            {activeSector}
          </span>
        </div>

        {/* Dynamic Back-to-Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={scrollToTop}
            className="ml-1 p-2 rounded-full bg-surface-2 hover:bg-mad-red text-white hover:text-white transition-all duration-300 cursor-pointer border border-white/10 hover:shadow-[0_0_12px_#F5250F] group/btn"
            title="Return to top"
            aria-label="Return to top"
          >
            <ArrowUp className="h-3.5 w-3.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </motion.div>
    </>
  );
}
