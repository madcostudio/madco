"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Star, MapPin, Globe, Phone, Clock, Info, Navigation, BookmarkPlus, Share2, Check } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAfter, setShowAfter] = useState(false); // Mobile toggle state
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAutoDemoed = useRef(false);
  
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-demo sweep
  useEffect(() => {
    if (inView && !hasAutoDemoed.current && !prefersReducedMotion && !isMobile) {
      hasAutoDemoed.current = true;
      let startTime: number;
      const duration = 1500; // 1.5s
      
      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / duration;
        
        if (progress < 1) {
          // Sine easing out then in (sweep from 50 to 80, then to 20, then back to 50)
          const easeProgress = Math.sin(progress * Math.PI * 2);
          setSliderPosition(50 + easeProgress * 30);
          requestAnimationFrame(animate);
        } else {
          setSliderPosition(50);
        }
      };
      
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 500); // Small delay before starting
    }
  }, [inView, prefersReducedMotion, isMobile]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || isMobile) return;
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
    if (e.touches.length === 0 || isMobile) return;
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

  const handleKeyboardNav = (e: React.KeyboardEvent) => {
    if (isMobile) return;
    if (e.key === 'ArrowLeft') {
      setSliderPosition(Math.max(0, sliderPosition - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(Math.min(100, sliderPosition + 5));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <div className="flex bg-surface-2 border border-white/5 rounded-lg p-1 w-full max-w-[240px] mx-auto">
          <button 
            onClick={() => setShowAfter(false)}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-md transition-all ${!showAfter ? 'bg-background text-text-secondary border border-white/10' : 'text-text-secondary/50'}`}
          >
            Before
          </button>
          <button 
            onClick={() => setShowAfter(true)}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-md transition-all ${showAfter ? 'bg-mad-red text-white' : 'text-text-secondary/50'}`}
          >
            After
          </button>
        </div>
      )}

      {/* Main Container */}
      <div 
        ref={containerRef}
        className={`relative h-[550px] w-full overflow-hidden rounded-xl border border-white/5 bg-white select-none ${!isMobile ? 'cursor-ew-resize' : ''}`}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => !isMobile && setIsDragging(true)}
        onTouchStart={() => !isMobile && setIsDragging(true)}
        onKeyDown={handleKeyboardNav}
        tabIndex={0}
        aria-label="Interactive before and after comparison of a Google Business Profile"
      >
        
        {/* BEFORE SIDE */}
        <div 
          className="absolute inset-0 h-full w-full bg-[#f8f9fa] text-[#3c4043]"
          style={{ opacity: isMobile && showAfter ? 0 : 1, transition: isMobile ? 'opacity 0.3s ease' : 'none' }}
        >
          {/* Header Images - Bad */}
          <div className="h-32 w-full flex bg-[#e8eaed]">
            <div className="w-2/3 border-r border-white">
              <div className="w-full h-full bg-[#bdc1c6] flex justify-center items-center overflow-hidden">
                <div className="w-full h-full bg-black/40 blur-[2px]"></div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="w-full h-full bg-[#9aa0a6] flex justify-center items-center overflow-hidden">
                <div className="w-full h-full bg-black/60 blur-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 md:p-6 pb-2">
            <h2 className="text-2xl text-[#202124] font-medium leading-tight mb-1">The Banyan Tree Café — Mangalore</h2>
            <div className="flex items-center gap-2 mb-2 text-sm text-[#70757a]">
              <span className="font-bold text-[#3c4043]">3.8</span>
              <div className="flex gap-0.5">
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#e8eaed] text-[#e8eaed]" />
                <Star className="w-3.5 h-3.5 fill-[#e8eaed] text-[#e8eaed]" />
              </div>
              <span>(11)</span>
            </div>
            <div className="text-sm text-[#70757a] mb-4">
              Restaurant
            </div>

            {/* Actions - Missing */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 border border-[#dadce0] rounded-full py-2 flex items-center justify-center gap-2 text-[#1a73e8] bg-white font-medium text-sm opacity-60">
                <Navigation className="w-4 h-4" />
                Directions
              </div>
              <div className="flex-1 border border-[#dadce0] rounded-full py-2 flex items-center justify-center gap-2 text-[#1a73e8] bg-white font-medium text-sm opacity-60">
                <Phone className="w-4 h-4" />
                Call
              </div>
            </div>

            <hr className="border-[#e8eaed] mb-4" />

            {/* Info List */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#70757a] mt-0.5" />
                <span className="text-sm text-[#3c4043]">123 Main Street, Mangalore</span>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#ea4335] mt-0.5" />
                <span className="text-sm text-[#ea4335]">Hours not confirmed</span>
              </div>
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-[#70757a] mt-0.5" />
                <span className="text-sm text-[#3c4043]">Add a description...</span>
              </div>
            </div>
          </div>
          
          {/* Label */}
          <div className="absolute bottom-4 left-4 rounded bg-surface-2 border border-[#ea4335]/30 px-3 py-1 font-mono text-[10px] tracking-widest text-[#ea4335] uppercase shadow-md flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]"></span>
            INCOMPLETE PROFILE
          </div>
        </div>

        {/* AFTER SIDE */}
        <div 
          className="absolute inset-0 h-full w-full bg-white text-[#3c4043] shadow-inner pointer-events-none"
          style={{
            clipPath: isMobile ? 'none' : `inset(0 ${100 - sliderPosition}% 0 0)`,
            opacity: isMobile && !showAfter ? 0 : 1,
            transition: isMobile ? 'opacity 0.3s ease' : 'none',
            zIndex: 5
          }}
        >
          {/* Header Images - Good */}
          <div className="h-40 w-full flex bg-[#e8eaed] relative overflow-hidden group">
            <div className="w-full absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/restaurant_360.png" alt="Hero" className="w-full h-full object-cover filter saturate-[1.2] contrast-[1.1]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 bg-mad-red/90 backdrop-blur text-white px-3 py-1.5 rounded-full border border-red-400/30 shadow-[0_0_15px_rgba(255,51,51,0.5)]">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="font-bold text-xs tracking-wider">SEE INSIDE — 360° TOUR</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 md:p-6 pb-2 relative bg-white h-[calc(100%-10rem)]">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-2xl text-[#202124] font-medium leading-tight">The Banyan Tree Café — Mangalore</h2>
              <div className="flex gap-2 text-[#70757a]">
                <BookmarkPlus className="w-5 h-5 cursor-pointer hover:text-black" />
                <Share2 className="w-5 h-5 cursor-pointer hover:text-black" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2 text-sm text-[#70757a]">
              <span className="font-bold text-[#3c4043]">4.7</span>
              <div className="flex gap-0.5">
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                <Star className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
              </div>
              <span className="text-[#1a73e8]">128 reviews</span>
            </div>
            <div className="text-sm text-[#70757a] mb-4 flex items-center gap-1">
              <span>Speciality Coffee Shop</span>
              <span className="text-xs">•</span>
              <span className="text-[#188038] font-medium">Open</span>
              <span>⋅ Closes 10 PM</span>
            </div>

            {/* Actions - Good */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 border border-[#dadce0] rounded-full py-2 flex items-center justify-center gap-2 text-white bg-[#1a73e8] hover:bg-[#1557b0] cursor-pointer font-medium text-sm transition-colors shadow-sm">
                <Navigation className="w-4 h-4" />
                Directions
              </div>
              <div className="flex-1 border border-[#dadce0] rounded-full py-2 flex items-center justify-center gap-2 text-[#1a73e8] hover:bg-[#f8f9fa] cursor-pointer font-medium text-sm transition-colors">
                <Phone className="w-4 h-4" />
                Call
              </div>
              <div className="flex-1 border border-[#dadce0] rounded-full py-2 flex items-center justify-center gap-2 text-[#1a73e8] hover:bg-[#f8f9fa] cursor-pointer font-medium text-sm transition-colors">
                <Globe className="w-4 h-4" />
                Menu
              </div>
            </div>

            {/* Post Snippet */}
            <div className="bg-[#f8f9fa] border border-[#e8eaed] rounded-lg p-3 mb-4 flex gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded overflow-hidden shrink-0">
                <img src="/restaurant_360.png" alt="Post" className="w-full h-full object-cover filter contrast-125" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#202124]">New seasonal menu — this week</h4>
                <p className="text-xs text-[#70757a] line-clamp-2">Come try our new cold brew selections and fresh pastries baked every morning...</p>
              </div>
            </div>
            
            <p className="text-sm text-[#3c4043] leading-relaxed line-clamp-2">
              An immersive, artisanal coffee experience in the heart of Mangalore. We roast in-house and serve specialty blends in a warm, inviting atmosphere designed for connection.
            </p>
            
            {/* Label */}
            <div className="absolute bottom-4 right-4 rounded bg-championship-gold px-3 py-1 font-mono text-[10px] tracking-widest text-black uppercase shadow-lg font-bold flex items-center gap-2">
              <Check className="w-3 h-3 text-black" />
              OPTIMISED BY MAD.CO
            </div>
          </div>
        </div>

        {/* Divider Line (Only for Desktop Slider) */}
        {!isMobile && (
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-mad-red pointer-events-none z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Speed Streak effect */}
            {isDragging && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 0.5, height: "100%" }}
                className="absolute top-0 right-0 w-8 bg-gradient-to-l from-mad-red/40 to-transparent pointer-events-none"
              />
            )}
            
            {/* Slider Handle Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-mad-red text-white shadow-xl border border-white/20 transition-transform hover:scale-110">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
      
      <p className="text-center font-mono text-[10px] tracking-widest text-text-secondary uppercase mt-2">Illustrative example</p>
    </div>
  );
}
