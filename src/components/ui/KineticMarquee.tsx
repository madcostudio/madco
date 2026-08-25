"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface KineticMarqueeProps {
  phrases?: string[];
  speed?: number;       // px per second, default 60
  className?: string;
  textClassName?: string;
}

const DEFAULT_PHRASES = [
  "WE DON'T MARKET",
  "WE MAKE A DIFFERENCE",
  "DIFFERENT WINS",
  "WHERE IDEAS GO MAD",
  "IMPOSSIBLE TO IGNORE",
];

export function KineticMarquee({
  phrases = DEFAULT_PHRASES,
  speed = 60,
  className = "",
  textClassName = "",
}: KineticMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  // Build the repeated content string
  const contentString = phrases.map((p, i) => (
    <span key={i} className="inline-flex items-center gap-6 mx-6 shrink-0">
      <span className={`font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight whitespace-nowrap ${
        i % 2 === 0 ? "text-white" : "text-mad-red"
      } ${textClassName}`}>
        {p}
      </span>
      <span className="h-2.5 w-2.5 rounded-full bg-mad-red shrink-0" />
    </span>
  ));

  useEffect(() => {
    if (containerRef.current) {
      const firstSet = containerRef.current.querySelector("[data-marquee-set]");
      if (firstSet) {
        setContentWidth(firstSet.scrollWidth);
      }
    }
  }, [phrases]);

  const duration = contentWidth > 0 ? contentWidth / speed : 20;

  if (reducedMotion) {
    // Static single line
    return (
      <div className={`overflow-hidden py-6 md:py-8 ${className}`}>
        <div className="flex items-center gap-6 px-6 overflow-x-auto scrollbar-hide">
          {contentString}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden py-6 md:py-8 select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{
          x: contentWidth > 0 ? [0, -contentWidth] : [0, -2000],
        }}
        transition={{
          x: {
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {/* Two copies for seamless loop */}
        <div data-marquee-set className="flex items-center shrink-0">
          {contentString}
        </div>
        <div className="flex items-center shrink-0" aria-hidden>
          {contentString}
        </div>
      </motion.div>
    </div>
  );
}
