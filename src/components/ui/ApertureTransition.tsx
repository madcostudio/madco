"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function ApertureTransition() {
  const router = useRouter();
  const [transitionState, setTransitionState] = useState<{
    isActive: boolean;
    x: number;
    y: number;
  }>({ isActive: false, x: 0, y: 0 });

  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Check user preference for motion reduction
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const handleEnterLounge = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail;

      setTransitionState({ isActive: true, x, y });

      // After aperture mask covers screen, push router redirect
      const routeTimer = setTimeout(() => {
        router.push("/priority");
      }, 700);

      // Fade out black transition screen after new page mounts
      const fadeTimer = setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, isActive: false }));
      }, 1600);

      return () => {
        clearTimeout(routeTimer);
        clearTimeout(fadeTimer);
      };
    };

    window.addEventListener("enter-priority-lounge", handleEnterLounge);
    return () => window.removeEventListener("enter-priority-lounge", handleEnterLounge);
  }, [router]);

  // Calculate diameter threshold to completely cover viewport from logo corner
  const maxDiameter = typeof window !== "undefined" 
    ? Math.max(window.innerWidth, window.innerHeight) * 2.8 
    : 3000;

  return (
    <AnimatePresence>
      {transitionState.isActive && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          aria-hidden="true"
        >
          {prefersReduced ? (
            // Simple opacity cross-fade for accessibility profiles
            <motion.div
              className="absolute inset-0 bg-[#050505]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            // Custom expanding circle camera mask
            <motion.div
              className="absolute bg-[#050505] rounded-full origin-center"
              initial={{
                width: 0,
                height: 0,
                left: transitionState.x,
                top: transitionState.y,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                width: maxDiameter,
                height: maxDiameter,
              }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1], // Expo-out curve
              }}
            />
          )}

          {/* Central gold radial lens bloom */}
          <motion.div
            className="relative h-[250px] w-[250px] rounded-full blur-[90px] opacity-0 pointer-events-none"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{
              background: "radial-gradient(circle, var(--championship-gold) 0%, transparent 75%)"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
