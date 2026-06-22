"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative h-[380px] md:h-[480px] w-full overflow-hidden rounded-xl border border-white/5 bg-surface-2 select-none cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Before Image (Plain/Standard Map photo) */}
      <div className="absolute inset-0 h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/restaurant_360.png" 
          alt="Before virtual tour styling" 
          className="h-full w-full object-cover filter grayscale contrast-75 brightness-50"
        />
        <div className="absolute top-4 left-4 rounded bg-black/75 px-3 py-1 font-mono text-[10px] tracking-widest text-text-secondary uppercase">
          Standard Static Listing
        </div>
      </div>

      {/* After Image (Interactive Virtual Tour view) */}
      <div 
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/restaurant_360.png" 
          alt="After Mad.co 360 styling" 
          className="h-full w-full object-cover filter saturate-[1.1] contrast-[1.05]"
        />
        <div className="absolute top-4 right-4 rounded bg-mad-red px-3 py-1 font-mono text-[10px] tracking-widest text-white uppercase shadow-lg">
          Mad.co Immersive Experience
        </div>
      </div>

      {/* Divider Line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-mad-red pointer-events-none z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-mad-red text-white shadow-xl border border-white/20">
          <ArrowLeftRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
