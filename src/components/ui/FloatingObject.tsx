"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ObjectType = "red-orb" | "dark-sphere" | "glass-lens" | "chrome-cube";

interface FloatingObjectProps {
  type?: ObjectType;
  size?: number;         // px, default 120
  top?: string;          // CSS top position
  left?: string;         // CSS left position  
  right?: string;        // CSS right position
  bottom?: string;       // CSS bottom position
  driftRange?: number;   // px drift range, default 20
  driftDuration?: number;// seconds for one loop, default 8
  parallaxStrength?: number; // 0-1, default 0.3
  opacity?: number;      // default 0.7
  className?: string;
}

export function FloatingObject({
  type = "red-orb",
  size = 120,
  top,
  left,
  right,
  bottom,
  driftRange = 20,
  driftDuration = 8,
  parallaxStrength = 0.3,
  opacity = 0.7,
  className = "",
}: FloatingObjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Only run parallax on desktop (no touch)
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = ((e.clientX - cx) / cx) * parallaxStrength * 30;
      const dy = ((e.clientY - cy) / cy) * parallaxStrength * 30;
      setMouseOffset({ x: dx, y: dy });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [parallaxStrength, reducedMotion]);

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
    width: size,
    height: size,
    pointerEvents: "none",
    zIndex: 1,
    opacity,
  };

  // Pure CSS implementations of the kinetic objects
  const renderObject = () => {
    switch (type) {
      case "red-orb":
        return (
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_#ff4d4d,_#b30000_60%,_#330000_100%)] shadow-[0_0_60px_rgba(245,37,15,0.4),inset_0_-20px_40px_rgba(0,0,0,0.8),inset_0_20px_40px_rgba(255,255,255,0.4)] animate-breathe" />
        );
      case "dark-sphere":
        return (
          <div className="relative w-full h-full">
            {/* The core sphere */}
            <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_35%_25%,_#444,_#050508_70%)] shadow-[inset_0_-15px_30px_rgba(0,0,0,1),inset_0_10px_20px_rgba(255,255,255,0.2)]" />
            {/* Orbital ring 1 */}
            <div className="absolute inset-0 rounded-full border border-[#1B6EF3] opacity-60 shadow-[0_0_15px_#1B6EF3,inset_0_0_15px_#1B6EF3]" style={{ transform: 'rotateX(65deg) rotateY(20deg)' }} />
            {/* Orbital ring 2 */}
            <div className="absolute inset-0 rounded-full border border-[#1B6EF3] opacity-40 shadow-[0_0_10px_#1B6EF3,inset_0_0_10px_#1B6EF3]" style={{ transform: 'rotateX(20deg) rotateY(65deg)' }} />
          </div>
        );
      case "glass-lens":
        return (
          <div className="w-full h-full rounded-full border-[12px] border-[#111] bg-[radial-gradient(circle_at_50%_50%,_transparent_40%,_rgba(245,37,15,0.6)_45%,_transparent_55%)] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(0,0,0,1),inset_0_0_10px_rgba(255,255,255,0.2)] flex items-center justify-center">
            {/* Inner red glow mimicking a recording lens */}
            <div className="w-[30%] h-[30%] rounded-full bg-[#111] shadow-[0_0_25px_rgba(245,37,15,0.8),inset_0_0_10px_rgba(0,0,0,1)]" />
          </div>
        );
      case "chrome-cube":
        return (
          <div className="w-[80%] h-[80%] mx-auto mt-[10%] bg-[linear-gradient(135deg,_#fff_0%,_#aaa_30%,_#333_60%,_#f5250f_90%)] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]" style={{ transform: 'rotate(45deg)', borderRadius: '15%' }} />
        );
      default:
        return null;
    }
  };

  if (reducedMotion) {
    return (
      <div ref={containerRef} style={positionStyle} className={className}>
        {renderObject()}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      style={positionStyle}
      className={className}
      animate={{
        y: [0, -driftRange, 0, driftRange * 0.6, 0],
        x: [0, driftRange * 0.4, 0, -driftRange * 0.3, 0],
        rotate: type === 'chrome-cube' ? [0, 45, 90, 135, 180] : [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: driftDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        style={{
          x: mouseOffset.x,
          y: mouseOffset.y,
          width: '100%',
          height: '100%',
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {renderObject()}
      </motion.div>
    </motion.div>
  );
}
