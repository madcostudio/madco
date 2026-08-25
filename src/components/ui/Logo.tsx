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
  const [explosionOrigin, setExplosionOrigin] = useState({ x: '50%', y: '50%' });
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLongHoldRef = useRef(false);
  const router = useRouter();

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

  // Seamless epic page wipe transition on click
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

    if (dotRef.current) {
      const rect = dotRef.current.getBoundingClientRect();
      setExplosionOrigin({ 
        x: `${rect.left + rect.width / 2}px`, 
        y: `${rect.top + rect.height / 2}px` 
      });
    }

    setIsExploding(true);

    // Trigger navigation while the screen is completely covered by the red mask
    setTimeout(() => {
      if (window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    }, 450);

    // Unmount the transition overlay after the slide-up finishes
    setTimeout(() => {
      setIsExploding(false);
    }, 1300);
  }, [router]);

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Circle loader ring SVG calculations
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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

      {/* Sleek Page Wipe Transition (Fixed to viewport) */}
      <AnimatePresence>
        {isExploding && (
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* The container that slides up to reveal the new page */}
            <motion.div
              initial={{ y: "0%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.7, 0, 0.3, 1] }}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              {/* The expanding red dot that fills the screen */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 200 }}
                transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
                className="absolute w-8 h-8 bg-mad-red rounded-full"
                style={{ top: explosionOrigin.y, left: explosionOrigin.x, x: "-50%", y: "-50%" }}
              />
              
              {/* Brand mark that fades in over the red mask */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center mix-blend-overlay"
              >
                <span className="font-display font-black text-[12vw] tracking-tighter text-white uppercase">
                  MAD.CO
                </span>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
