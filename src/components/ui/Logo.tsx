"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

export function Logo() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = (e: React.PointerEvent) => {
    // Only trigger on left click (button 0) or touch pointers
    if (e.button !== 0 && e.pointerType === "mouse") return;
    
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
    <div className="flex items-center gap-2 group select-none relative">
      <Link 
        href="/" 
        className="font-sans font-black text-xl tracking-tighter uppercase text-white hover:text-mad-red transition-colors duration-300 cursor-pointer"
      >
        MAD.CO
      </Link>
      
      {/* Pulsing Red Dot Trigger */}
      <span 
        ref={dotRef}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        className="relative h-2 w-2 rounded-full bg-mad-red cursor-pointer animate-breathe touch-none select-none z-30"
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
    </div>
  );
}
