"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ImpossibleHeadlineProps {
  className?: string;
}

const LETTERS = ["I", "M", "P", "O", "S", "S", "I", "B", "L", "E"];
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero headline: "WE MAKE BRANDS [IMPOSSIBLE] TO IGNORE."
 *
 * The word IMPOSSIBLE animates in, widening the line.
 *
 * Responsive notes:
 *  - Type is fluid (.t-display-1 clamps between a phone-safe floor and a
 *    desktop ceiling) rather than a raw vw size, which previously made the
 *    headline overflow narrow screens.
 *  - Line 2 is allowed to wrap. Previously IMPOSSIBLE and TO were locked
 *    together with `whitespace-nowrap`, so on a phone TO was pushed off
 *    the right edge.
 *  - Spacing between IMPOSSIBLE and TO comes from a single `gap`. The old
 *    version stacked marginRight + pr-3 + pr-2 + pr-1, which is what opened
 *    the oversized gap between the two words.
 */
export function ImpossibleHeadline({ className = "" }: ImpossibleHeadlineProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"initial" | "reveal" | "settled">(
    reduceMotion ? "settled" : "initial"
  );

  useEffect(() => {
    // Users who ask for reduced motion get the final composition immediately.
    if (reduceMotion) {
      setStage("settled");
      return;
    }
    const t1 = setTimeout(() => setStage("reveal"), 900);
    const t2 = setTimeout(() => setStage("settled"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduceMotion]);

  const isExpanded = stage === "reveal" || stage === "settled";
  const isSettled = stage === "settled";

  return (
    <div className={`relative select-none ${className}`}>
      <h1 className="t-display-1 font-sans font-black text-white uppercase">
        {/* Line 1 */}
        <span className="block">We make brands</span>

        {/* Line 2 — wraps safely on narrow screens instead of overflowing */}
        <span className="flex flex-wrap items-baseline gap-x-[0.22em]">
          <motion.span
            initial={false}
            animate={{ width: isExpanded ? "auto" : 0 }}
            transition={{ duration: reduceMotion ? 0 : 1, ease: EASE }}
            className="inline-block overflow-hidden align-baseline"
          >
            <span className="text-impossible-fill inline-flex items-baseline whitespace-nowrap">
              {LETTERS.map((letter, idx) => (
                <motion.span
                  key={`${letter}-${idx}`}
                  initial={{ y: "115%", opacity: 0 }}
                  animate={
                    isExpanded ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.7,
                    delay: reduceMotion ? 0 : 0.12 + idx * 0.04,
                    ease: EASE,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </motion.span>

          <span className="inline-block text-white">to</span>
        </span>

        {/* Line 3 */}
        <span className="block">
          <span className="inline-block relative">
            Ignore.
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: isSettled ? 1 : 0,
                opacity: isSettled ? 1 : 0,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.8,
                delay: isSettled && !reduceMotion ? 0.15 : 0,
                ease: EASE,
              }}
              style={{ transformOrigin: "left center" }}
              className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-mad-red via-mad-red/60 to-transparent pointer-events-none"
            />
          </span>
        </span>
      </h1>
    </div>
  );
}
