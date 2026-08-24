"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function SpatialCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Damped spring physics for ultra-smooth trailing
  const springX = useSpring(mouseX, { damping: 30, stiffness: 180, mass: 0.6 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    // Only enable on fine pointer devices (desktop mouse/trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Ambient Spatial Spotlight glow following cursor (pure atmospheric light, zero cursor rings/dots) */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(245,37,15,0.05)_0%,rgba(27,110,243,0.025)_45%,transparent_70%)] blur-3xl pointer-events-none"
      />
    </div>
  );
}
