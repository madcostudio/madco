"use client";

import React from "react";

export function SpeedStreak() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Primary Left-to-Right Streak */}
      <div 
        className="animate-speed-streak absolute top-[35%] left-0 h-[2px] w-[300px] opacity-0"
        style={{
          background: "linear-gradient(to right, transparent, var(--mad-red), transparent)",
        }}
      />
      {/* Secondary Right-to-Left Streak */}
      <div 
        className="animate-speed-streak absolute top-[65%] right-0 h-[1px] w-[450px] opacity-0"
        style={{
          background: "linear-gradient(to left, transparent, var(--dark-crimson), transparent)",
          animationDelay: "2s",
        }}
      />
    </div>
  );
}
