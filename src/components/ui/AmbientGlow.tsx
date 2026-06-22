"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function AmbientGlow() {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const springConfig = { damping: 50, stiffness: 250, mass: 0.8 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 200);
      mouseY.set(e.clientY - 200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Background static glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Red glow top-left */}
        <div 
          className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] rounded-full blur-[140px] opacity-60"
          style={{ background: "radial-gradient(circle, rgba(255,46,46,0.12) 0%, rgba(255,46,46,0) 70%)" }}
        />
        {/* Azure glow bottom-right */}
        <div 
          className="absolute -bottom-[10%] -right-[10%] h-[50vw] w-[50vw] rounded-full blur-[160px] opacity-50"
          style={{ background: "radial-gradient(circle, rgba(41,163,255,0.08) 0%, rgba(41,163,255,0) 70%)" }}
        />
      </div>

      {/* Mouse follow spotlight (desktop only) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-10 hidden h-[400px] w-[400px] rounded-full blur-[100px] md:block"
        style={{
          x: glowX,
          y: glowY,
          background: "radial-gradient(circle, rgba(255,46,46,0.06) 0%, rgba(255,46,46,0) 75%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
