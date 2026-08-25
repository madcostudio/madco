"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Logo() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [targetOrigin, setTargetOrigin] = useState({ x: 75, y: 40 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLongHoldRef = useRef(false);
  const router = useRouter();

  // Measure navbar logo center position and viewport dimensions
  const updateMeasurements = useCallback(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        setTargetOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    }
  }, []);

  useEffect(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, [updateMeasurements]);

  // Trigger smooth circular shrink animation to navbar logo on initial page load
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIsInitialLoad(false);
      return;
    }
    updateMeasurements();
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1450);
    return () => clearTimeout(timer);
  }, [updateMeasurements]);

  const startHold = (e: React.PointerEvent) => {
    // Only trigger on left click (button 0) or touch pointers
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isLongHoldRef.current = false;
    setIsHolding(true);
    setProgress(0);

    const startTime = Date.now();
    const duration = 1000; // 1 second hold threshold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        isLongHoldRef.current = true;
        setIsHolding(false);
        setProgress(0);
        triggerLoungeReveal();
      }
    }, 16);
  };

  const endHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setProgress(0);
  };

  const triggerLoungeReveal = () => {
    if (!dotRef.current) return;

    const rect = dotRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Dispatch custom window event containing coordinates of the dot
    const event = new CustomEvent("enter-priority-lounge", { detail: { x, y } });
    window.dispatchEvent(event);
  };

  // Seamless circular transition on navbar logo click
  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isLongHoldRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      if (window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }

    updateMeasurements();
    setIsExploding(true);

    // Trigger navigation while the screen is fully masked
    setTimeout(() => {
      if (window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    }, 420);

    // Clean up after circular reveal finishes
    setTimeout(() => {
      setIsExploding(false);
    }, 1550);
  }, [router, updateMeasurements]);

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Circle loader ring SVG calculations
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Offset vector from viewport center to the navbar logo center
  const deltaX = targetOrigin.x - windowSize.width / 2;
  const deltaY = targetOrigin.y - windowSize.height / 2;

  return (
    <div className="flex items-center gap-2 group select-none relative z-50">
      <a
        ref={logoRef}
        href="/"
        onClick={handleLogoClick}
        className="font-sans font-black text-xl tracking-tighter uppercase text-white hover:text-mad-red transition-colors duration-300 cursor-pointer"
        aria-label="MAD.Co home"
      >
        MAD.CO
      </a>

      {/* Pulsing Red Dot Trigger */}
      <span
        ref={dotRef}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        className="relative h-2 w-2 rounded-full bg-mad-red cursor-pointer animate-breathe touch-none select-none"
        style={{ touchAction: "none" }}
        aria-hidden="true"
      >
        {/* Radial SVG loader ring */}
        {isHolding && (
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 -rotate-90 pointer-events-none z-40">
            <circle
              cx="12"
              cy="12"
              r={radius}
              fill="transparent"
              stroke="var(--championship-gold)"
              strokeWidth="1.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-75"
            />
          </svg>
        )}
      </span>

      {/* Clean, GPU-Accelerated Circular Iris Shrink Transition */}
      <AnimatePresence>
        {(isExploding || isInitialLoad) && (
          <motion.div
            key="madco-circular-transition"
            initial={{
              clipPath: isExploding
                ? `circle(0px at ${targetOrigin.x}px ${targetOrigin.y}px)`
                : `circle(160vmax at ${targetOrigin.x}px ${targetOrigin.y}px)`,
            }}
            animate={
              isExploding
                ? {
                    clipPath: [
                      `circle(0px at ${targetOrigin.x}px ${targetOrigin.y}px)`,
                      `circle(160vmax at ${targetOrigin.x}px ${targetOrigin.y}px)`,
                      `circle(160vmax at ${targetOrigin.x}px ${targetOrigin.y}px)`,
                      `circle(0px at ${targetOrigin.x}px ${targetOrigin.y}px)`,
                    ],
                  }
                : {
                    clipPath: `circle(0px at ${targetOrigin.x}px ${targetOrigin.y}px)`,
                  }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: isExploding ? 1.45 : 0.9,
              delay: isExploding ? 0 : 0.45,
              times: isExploding ? [0, 0.32, 0.46, 1] : undefined,
              ease: [0.76, 0, 0.24, 1], // Silky cinematic bezier curve
            }}
            className="fixed inset-0 z-[9999] bg-[#050508] pointer-events-none overflow-hidden flex items-center justify-center"
          >
            {/* Subtle atmospheric ambient glow in the center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,37,15,0.07)_0%,transparent_65%)] pointer-events-none" />

            {/* Centered Logo: Crisp in middle on hold, then glides & shrinks directly into navbar logo */}
            <motion.div
              initial={{
                x: isExploding ? deltaX : 0,
                y: isExploding ? deltaY : 0,
                scale: isExploding ? 0.2 : 1,
                opacity: isExploding ? 0 : 1,
              }}
              animate={
                isExploding
                  ? {
                      x: [deltaX, 0, 0, deltaX],
                      y: [deltaY, 0, 0, deltaY],
                      scale: [0.2, 1, 1, 0.2],
                      opacity: [0, 1, 1, 0],
                    }
                  : {
                      x: [0, 0, deltaX],
                      y: [0, 0, deltaY],
                      scale: [1, 1, 0.2],
                      opacity: [1, 1, 0],
                    }
              }
              transition={{
                duration: isExploding ? 1.45 : 0.9,
                delay: isExploding ? 0 : 0.45,
                times: isExploding ? [0, 0.32, 0.46, 1] : [0, 0.08, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
              className="flex items-baseline gap-3 sm:gap-4 select-none pointer-events-none"
            >
              <span className="font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-white uppercase drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]">
                MAD.CO
              </span>
              <span className="h-3.5 w-3.5 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full bg-mad-red animate-breathe drop-shadow-[0_0_15px_rgba(245,37,15,0.9)]" />
            </motion.div>

            {/* Glowing circular iris rim tracking the collapsing edge */}
            <motion.div
              initial={{
                width: isExploding ? "0px" : "320vmax",
                height: isExploding ? "0px" : "320vmax",
                opacity: 0,
              }}
              animate={
                isExploding
                  ? {
                      width: ["0px", "320vmax", "320vmax", "0px"],
                      height: ["0px", "320vmax", "320vmax", "0px"],
                      opacity: [0, 0.6, 0.6, 0],
                    }
                  : {
                      width: "0px",
                      height: "0px",
                      opacity: [0.8, 0.8, 0],
                    }
              }
              transition={{
                duration: isExploding ? 1.45 : 0.9,
                delay: isExploding ? 0 : 0.45,
                times: isExploding ? [0, 0.32, 0.46, 1] : undefined,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{
                top: targetOrigin.y,
                left: targetOrigin.x,
                x: "-50%",
                y: "-50%",
              }}
              className="absolute rounded-full border border-mad-red/40 shadow-[0_0_50px_rgba(245,37,15,0.5),inset_0_0_30px_rgba(245,37,15,0.25)] pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
