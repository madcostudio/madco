"use client";

import React, { useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt angles
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Motion values for local cursor light tracking
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Disable effects if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates (-1 to 1) from card center
    const relX = (e.clientX - rect.left - width / 2) / (width / 2);
    const relY = (e.clientY - rect.top - height / 2) / (height / 2);

    // Set tilt angles (max 6.5 degrees)
    rotateX.set(relY * -6.5);
    rotateY.set(relX * 6.5);

    // Set cursor glow coordinates relative to card borders
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  };

  // Create a reactive radial background gradient string
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle 140px at ${x}px ${y}px, rgba(255, 46, 46, 0.08) 0%, rgba(255, 46, 46, 0) 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative select-none ${className}`}
    >
      {/* Edge border hover glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-lg transition-opacity duration-300"
        style={{
          background: glowBg,
          opacity: glowOpacity,
        }}
      />

      {/* Card Content Container */}
      <div 
        className="relative z-10 h-full w-full"
        style={{ transform: "translateZ(8px)", transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
