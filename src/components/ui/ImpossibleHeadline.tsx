"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ImpossibleHeadlineProps {
  className?: string;
}

const LETTERS = ["I", "M", "P", "O", "S", "S", "I", "B", "L", "E"];

export function ImpossibleHeadline({ className = "" }: ImpossibleHeadlineProps) {
  // Stages:
  // 1. "initial": "WE MAKE BRANDS TO IGNORE."
  // 2. "reveal": Silky smooth expansion and upward letter reveal of "IMPOSSIBLE"
  // 3. "settled": Settles with light sweep and underline
  const [stage, setStage] = useState<"initial" | "reveal" | "settled">("initial");

  useEffect(() => {
    // 1. Initial provocative read
    const t1 = setTimeout(() => setStage("reveal"), 1200);
    // 2. Complete reveal and settle
    const t2 = setTimeout(() => setStage("settled"), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isExpanded = stage === "reveal" || stage === "settled";
  const isSettled = stage === "settled";

  return (
    <div className={`relative select-none ${className}`}>
      <h1 className="font-sans font-black text-[12vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[5.8vw] leading-[0.9] tracking-tighter text-white uppercase select-none">
        {/* Line 1: WE MAKE BRANDS */}
        <span className="block">WE MAKE BRANDS</span>

        {/* Line 2: [IMPOSSIBLE] TO */}
        <span className="inline-flex items-baseline overflow-visible relative">
          {/* Animated expansion slot for IMPOSSIBLE */}
          <motion.span
            initial={false}
            animate={{
              width: isExpanded ? "auto" : 0,
              marginRight: isExpanded ? "0.24em" : "0em",
            }}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1], // Ultra-luxurious, smooth easing
            }}
            className="inline-block overflow-hidden align-baseline relative py-1 pr-3"
          >
            {/* Letter reveal container with individual staggered upward cascade */}
            <span className="inline-flex items-baseline whitespace-nowrap relative text-stroke-red text-mad-red hover:text-white transition-colors duration-500 pr-2">
              {LETTERS.map((letter, idx) => (
                <motion.span
                  key={`${letter}-${idx}`}
                  initial={{ y: "115%", opacity: 0 }}
                  animate={
                    isExpanded
                      ? { y: "0%", opacity: 1 }
                      : { y: "115%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + idx * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block relative ${idx === LETTERS.length - 1 ? "pr-1" : ""}`}
                >
                  {letter}
                </motion.span>
              ))}

              {/* Clean specular light sweep sheen across IMPOSSIBLE upon reveal */}
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                animate={
                  stage === "reveal"
                    ? { x: "200%", opacity: [0, 0.7, 0] }
                    : { x: "200%", opacity: 0 }
                }
                transition={{
                  duration: 1.2,
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
              />
            </span>
          </motion.span>

          {/* "TO" smoothly glides right as space opens */}
          <motion.span
            layout
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block text-white"
          >
            TO
          </motion.span>
        </span>

        {/* Line 3: IGNORE. with clean glowing underline */}
        <span className="block">
          <span className="inline-block relative">
            IGNORE.
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: isSettled ? "110%" : "0%",
                opacity: isSettled ? 1 : 0,
              }}
              transition={{
                duration: 0.9,
                delay: isSettled ? 0.2 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-mad-red via-mad-red/60 to-transparent pointer-events-none"
            />
          </span>
        </span>
      </h1>
    </div>
  );
}
