"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, MessageCircle, Phone, UserPlus, Globe } from "lucide-react";
import 'pannellum/build/pannellum.css';
import Image from "next/image";
import Link from "next/link";

export default function CardClient() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="bg-[#050508] text-white font-sans selection:bg-[#F5250F] selection:text-white relative">
      <style dangerouslySetInnerHTML={{__html: `
        /* Strictly hide global layouts that might leak in */
        header, footer, .whatsapp-float-container { display: none !important; }
        
        /* The container for the entire page must support proximity snapping */
        html, body {
          background-color: #050508;
          scroll-snap-type: y proximity;
          overscroll-behavior-y: none;
        }

        /* 
          Hide scrollbars for a cleaner look, but ensure scrollability.
          JS is not required for any of this to render and scroll.
        */
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}} />

      {/* Persistent Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#F5250F] origin-left z-50"
        style={{ scaleX }}
      />

      <Section1Hook />
      <SectionInvisibleImpossible />
      <Section2Difference />
      <Section3Tour />
      <Section4Marquee />
      <Section5Contact />
    </main>
  );
}

// ── SECTION 1: THE HOOK ──
function Section1Hook() {
  return (
    <section className="relative w-full h-[100vh] h-[100dvh] snap-start flex flex-col justify-center px-6 overflow-hidden bg-[#050508]">
      
      {/* "Let there be light" flash & center bloom */}
      <motion.div 
        initial={{ scale: 0.1, opacity: 1, filter: "blur(10px)" }}
        animate={{ scale: [0.1, 4, 1], opacity: [1, 0.8, 0.15], filter: ["blur(10px)", "blur(50px)", "blur(100px)"] }}
        transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] max-w-[50vw] max-h-[50vw] bg-[#F5250F] rounded-full pointer-events-none z-0" 
      />

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop')] bg-cover mix-blend-overlay z-0" />

      <div 
        className="relative z-10 w-full max-w-lg mx-auto flex flex-col justify-center h-full pt-4 pb-20"
        style={{ perspective: 1200 }}
      >
        
        <h1 
          className="font-display font-black text-white uppercase tracking-normal leading-[1.05]"
          style={{ fontSize: "clamp(2.25rem, 8vw, 5.5rem)" }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 80, rotateX: -60 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.2 }}
            style={{ transformOrigin: "bottom" }}
          >
            If you&apos;re
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 80, rotateX: -60 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.4 }}
            style={{ transformOrigin: "bottom" }}
          >
            reading this,
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 80, rotateX: -60 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.6 }}
            style={{ transformOrigin: "bottom" }}
            className="flex items-end"
          >
            it worked
            <motion.span 
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: [4, 1], opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 10, delay: 1.1 }}
              className="text-[#F5250F] inline-block origin-bottom shadow-2xl"
            >
              .
            </motion.span>
          </motion.div>
        </h1>

        <motion.p 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.5 }}
          className="font-sans text-neutral-400 mt-4 max-w-[280px]"
          style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.05rem)", fontWeight: 300 }}
        >
          You scanned a stranger&apos;s business card. Most people never do.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.8 }}
          className="mt-8"
        >
          <h2 
            className="font-display font-bold uppercase tracking-normal leading-[1.05]"
            style={{ fontSize: "clamp(1.1rem, 3.2vw, 2.1rem)" }}
          >
            <span className="text-white block">That&apos;s the entire business.</span>
            <span className="text-white block">We make brands</span>
            <motion.span 
              initial={{ color: "#ffffff" }}
              animate={{ color: "#F5250F" }}
              transition={{ duration: 0.6, delay: 2.3 }}
              className="block font-black"
            >
              impossible to ignore.
            </motion.span>
          </h2>
        </motion.div>

      </div>

      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.5, y: [0, 8, 0] }}
        transition={{ 
          opacity: { delay: 3, duration: 1 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 3 }
        }}
      >
        <ChevronDown className="w-6 h-6 text-white" />
      </motion.div>
    </section>
  );
}

// ── NEW SECTION: INVISIBLE → IMPOSSIBLE ──
function SectionInvisibleImpossible() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [forceFinal, setForceFinal] = useState(false);
  const [hasFlashed, setHasFlashed] = useState(false);

  useEffect(() => {
    // Track scroll to trigger the flash exactly when the user reaches the midpoint
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.55 && !hasFlashed) {
        setHasFlashed(true);
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, hasFlashed]);

  // Start dim and blurry, fade out as we scroll
  // Minimum opacity is 0.35 so it's always readable.
  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.5], [0.35, 0.4, 0]);
  const text1Blur = useTransform(scrollYProgress, [0.1, 0.4], ["blur(8px)", "blur(0px)"]);
  
  // Fade in the container of text 2
  const text2Opacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

  // The letters we will stagger-animate
  const line1 = "THIS IS HOW".split("");
  const line2 = "IT SHOULD LOOK".split("");

  return (
    <section ref={containerRef} className="relative w-full h-[150vh] bg-[#050508]">
      {/* Fallback for noscript: just show the final state natively */}
      <noscript>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-50 bg-[#050508]">
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-normal text-white text-center leading-[1.05]">
            This is how<br/>it should look<span className="text-[#F5250F]">.</span>
          </h2>
        </div>
      </noscript>

      <div className="sticky top-0 h-[100vh] h-[100dvh] w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Massive Let There Be Light Flash */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={hasFlashed ? { opacity: [0, 1, 0], scale: [0.5, 2, 4] } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-[#F5250F] blur-[100px] rounded-full mix-blend-screen" />
        </motion.div>

        {/* Unanimated Eyebrow Label */}
        <div className="absolute top-12 left-6 z-20">
          <p className="font-mono text-[10px] tracking-widest text-[#F5250F] uppercase">
            // The problem
          </p>
        </div>

        {/* State 1: The current reality */}
        <motion.div 
          style={{ opacity: forceFinal ? 0 : text1Opacity, filter: forceFinal ? "none" : text1Blur }}
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none z-10"
        >
          {/* Apply a subtle CSS animation to make the 'bad' text feel uneasy */}
          <p className="font-sans font-medium text-center text-white text-sm md:text-base uppercase tracking-[0.2em] max-w-sm animate-pulse">
            Right now, this is how your business looks online.
          </p>
        </motion.div>
        
        {/* State 2: The payoff */}
        <motion.div
          style={{ opacity: forceFinal ? 1 : text2Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none z-20"
        >
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase tracking-normal text-white text-center leading-[1.05] flex flex-col items-center">
            
            {/* LINE 1 */}
            <div className="flex overflow-hidden">
              {line1.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
                  animate={hasFlashed ? { y: 0, opacity: 1, filter: "blur(0px)" } : { y: 100, opacity: 0, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 150, damping: 10, delay: i * 0.03 }}
                  className={char === " " ? "w-4" : "inline-block"}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* LINE 2 */}
            <div className="flex overflow-hidden items-end">
              {line2.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
                  animate={hasFlashed ? { y: 0, opacity: 1, filter: "blur(0px)" } : { y: 100, opacity: 0, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 150, damping: 10, delay: (line1.length * 0.03) + (i * 0.03) }}
                  className={char === " " ? "w-4" : "inline-block"}
                >
                  {char}
                </motion.span>
              ))}
              
              <motion.span 
                initial={{ scale: 0, opacity: 0, rotate: 180 }}
                animate={hasFlashed ? { scale: [3, 1], opacity: 1, rotate: 0 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.8 }}
                className="inline-block text-[#F5250F] ml-1 origin-center shadow-[0_0_30px_rgba(245,37,15,0.8)]"
              >
                .
              </motion.span>
            </div>

          </h2>
        </motion.div>

        {/* Unanimated Closing Line */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center z-20">
          <p className="text-[10px] md:text-xs font-mono text-white/50 tracking-widest uppercase text-center">
            Invisible, then impossible to ignore.<br/>That&apos;s the whole job.
          </p>
        </div>

      </div>
    </section>
  );
}

// ── SECTION 2: THE DIFFERENCE ──
function Section2Difference() {
  const [sliderPos, setSliderPos] = useState(65);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAutoAnimated, setHasAutoAnimated] = useState(false);

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  };

  return (
    <section className="relative w-full min-h-[100vh] min-h-[100dvh] snap-start flex flex-col justify-center px-0 sm:px-6 py-16 bg-[#050508]">
      <motion.div 
        className="w-full max-w-2xl mx-auto flex flex-col justify-center h-full"
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => {
          if (!hasAutoAnimated) {
            setHasAutoAnimated(true);
            const duration = 1800;
            const start = performance.now();
            const animateSlider = (time: number) => {
              const elapsed = time - start;
              const progress = Math.min(elapsed / duration, 1);
              const phase1 = Math.min(progress * 2, 1);
              const phase2 = Math.max(0, (progress - 0.5) * 2);
              const pos = 100 - (phase1 * 70) + (phase2 * 35);
              setSliderPos(pos);
              
              if (progress < 1) {
                requestAnimationFrame(animateSlider);
              }
            };
            requestAnimationFrame(animateSlider);
          }
        }}
      >
        <div className="px-6 sm:px-0 mb-8">
          <p className="font-mono text-[10px] tracking-widest text-[#F5250F] uppercase mb-4 shrink-0">
            // Here&apos;s what we actually do
          </p>
          <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-normal text-white leading-[1.05]">
            We make the invisible<br/><span className="text-[#F5250F]">impossible to ignore.</span>
          </h2>
        </div>

        {/* Slider Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-[55vh] min-h-[450px] sm:rounded-2xl overflow-hidden select-none touch-pan-y shadow-2xl"
          onMouseMove={(e) => {
            if (e.buttons === 1) handleMove(e);
          }}
          onTouchMove={handleMove}
        >
          {/* AFTER (Right side - Bottom layer) */}
          <div className="absolute inset-0 bg-[#0a0a0f]">
            <Image 
              src="/cafe_360.png" 
              alt="Transformed" 
              fill
              className="object-cover saturate-150 contrast-125"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1B6EF3]/10 to-transparent pointer-events-none" />
            
            <div className="absolute top-6 right-6 z-10">
              <span className="font-display text-4xl sm:text-5xl text-white drop-shadow-md font-black">AFTER</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="font-bold text-2xl flex items-center space-x-2">
                  <span>4.9</span>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <span className="text-sm text-white/70">(428)</span>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <span className="bg-[#1B6EF3] text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(27,110,243,0.5)]">360° Tour Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* BEFORE (Left side - Top layer clipped) */}
          <div 
            className="absolute inset-0 bg-neutral-900 border-r border-white/20"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <Image 
              src="/cafe_360.png" 
              alt="Before" 
              fill
              className="object-cover grayscale brightness-[0.4] blur-[2px]"
              loading="lazy"
            />
            <div className="absolute top-6 left-6 z-10">
              <span className="font-display text-4xl sm:text-5xl text-white/40 font-black">BEFORE</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6">
              <div className="text-white/40">
                <div className="font-bold text-xl flex items-center space-x-2">
                  <span>3.2</span>
                  <div className="flex text-yellow-600/30 text-sm">★★★☆☆</div>
                  <span className="text-sm">(12)</span>
                </div>
                <div className="text-sm mt-2 italic">Missing information</div>
              </div>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-20 flex items-center justify-center"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl border border-black/10">
              {/* Persistent pulse on the handle */}
              <div className="absolute inset-0 rounded-full border-2 border-[#F5250F] animate-ping opacity-30" />
              <div className="w-4 h-4 bg-[#F5250F] rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-12 px-6 sm:px-0 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-normal text-white mb-2 font-bold">FOUND</h3>
            <p className="text-sm text-neutral-400">People find you where they&apos;re already looking.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl uppercase tracking-normal text-white mb-2 font-bold">TRUSTED</h3>
            <p className="text-sm text-neutral-400">They see the real place before they commit.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl uppercase tracking-normal text-white mb-2 font-bold">CHOSEN</h3>
            <p className="text-sm text-neutral-400">They walk in instead of scrolling past.</p>
          </div>
        </div>

        <p className="font-display text-4xl md:text-5xl uppercase tracking-normal mt-16 text-center text-white font-black px-6">
          This is the difference.
        </p>
      </motion.div>
    </section>
  );
}

// ── SECTION 3: WALK IN ──
function Section3Tour() {
  const [tourActive, setTourActive] = useState(false);
  const [hasError, setHasError] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleStartTour = async () => {
    if (typeof window !== 'undefined' && typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await (window as any).DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          // Permission granted
        }
      } catch (err) {
        console.warn("DeviceOrientationEvent permission error", err);
      }
    }
    setTourActive(true);
  };

  useEffect(() => {
    if (!tourActive || hasError || !viewerRef.current) return;
    
    let viewer: any = null;
    
    const initViewer = async () => {
      try {
        if (typeof window !== 'undefined') {
          // @ts-ignore
          await import('pannellum/build/pannellum.js');
          const win = window as any;
          if (win.pannellum) {
            viewer = win.pannellum.viewer(viewerRef.current, {
              type: 'equirectangular',
              // TODO: Swap '/dealership_360.jpg' with a real equirectangular tour image if needed.
              panorama: '/dealership_360.jpg',
              autoLoad: true,
              autoRotate: -2,
              compass: false,
              showControls: false,
              mouseZoom: false,
              orientationOnByDefault: true // Gyro Support
            });
          } else {
            setHasError(true);
          }
        }
      } catch (e) {
        console.error("Failed to load pannellum:", e);
        setHasError(true);
      }
    };
    
    initViewer();
    
    return () => {
      if (viewer && typeof viewer.destroy === 'function') {
        try { viewer.destroy(); } catch (e) {}
      }
    };
  }, [tourActive, hasError]);

  return (
    <section className="relative w-full min-h-[90vh] min-h-[90dvh] snap-start bg-[#050508] overflow-hidden flex flex-col justify-center">
      
      <div className="absolute inset-0">
        {(tourActive && !hasError) ? (
          <div ref={viewerRef} className="w-full h-full" />
        ) : (
          <Image 
            src="/restaurant_360.png" 
            alt="360 Tour Poster" 
            fill 
            className="object-cover opacity-50"
            loading="lazy"
          />
        )}
      </div>

      {/* Interaction overlay */}
      {!tourActive && !hasError && (
        <div 
          className="absolute inset-0 bg-[#050508]/40 flex flex-col items-center justify-center cursor-pointer z-10 transition-opacity duration-500"
          onClick={handleStartTour}
        >
          <div className="absolute top-6 left-6 flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#F5250F] rounded-full animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/80">LIVE</span>
          </div>

          <div className="text-center px-6">
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-normal mb-8 leading-[1.05]">
              <span className="text-white/50 block">Most show you a photo.</span>
              <span className="text-white block mt-2">We let you walk in.</span>
            </h2>
            
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
              <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">Tap to explore</span>
            </div>
          </div>
        </div>
      )}

      {/* Fallback View if Pannellum Fails */}
      {hasError && (
        <div className="absolute inset-0 bg-[#050508]/70 flex flex-col items-center justify-center z-10">
          <div className="text-center px-6">
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-normal mb-8 leading-[1.05]">
              <span className="text-white/50 block">Most show you a photo.</span>
              <span className="text-white block mt-2">We let you walk in.</span>
            </h2>
            <Link href="/tours" className="inline-flex items-center space-x-3 bg-[#F5250F] px-8 py-4 rounded-full hover:bg-red-600 transition-colors shadow-2xl">
              <span className="text-sm font-mono uppercase tracking-widest text-white font-bold">View a full tour &rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* Exit Tour Button */}
      {(tourActive && !hasError) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTourActive(false);
            window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
          }}
          className="absolute top-6 right-6 z-50 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full px-4 py-3 flex items-center space-x-2 hover:bg-black/80 transition-colors shadow-2xl"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Close & Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </section>
  );
}

// ── SECTION 4: MARQUEE ──
function Section4Marquee() {
  return (
    <section className="relative w-full min-h-[60vh] min-h-[60dvh] snap-start flex flex-col justify-center bg-[#050508] overflow-hidden py-16">
      <motion.div
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[10px] tracking-widest text-[#F5250F] uppercase mb-10 px-6 max-w-lg mx-auto">
          // We also do
        </p>

        <div className="flex flex-col space-y-6 py-4">
          <MarqueeRow speed={35} direction="left" />
          <MarqueeRow speed={25} direction="right" />
        </div>

        <p className="text-sm text-white/50 px-6 mt-10 italic max-w-lg mx-auto font-medium">
          Whatever makes you impossible to ignore.
        </p>
      </motion.div>
    </section>
  );
}

function MarqueeRow({ speed, direction }: { speed: number, direction: "left" | "right" }) {
  const items = [
    { text: "BRANDING", color: "text-white" },
    { text: "WEBSITES", color: "text-[#F5250F]" },
    { text: "CAMPAIGNS", color: "text-white" },
    { text: "MAD TAP", color: "text-[#F5250F]" },
    { text: "VIDEO & DRONE", color: "text-white" },
    { text: "AUTOMATION", color: "text-[#F5250F]" },
    { text: "360° EXPERIENCES", color: "text-white" },
  ];

  const marqueeContent = [...items, ...items, ...items, ...items].map((item, i) => (
    <span key={i} className={`mx-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-normal ${item.color}`}>
      {item.text} <span className="text-white/20 ml-4">·</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden whitespace-nowrap flex select-none">
      <motion.div
        className="flex shrink-0 items-center"
        animate={{ x: direction === "left" ? ["0%", "-25%"] : ["-25%", "0%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {marqueeContent}
      </motion.div>
    </div>
  );
}

// ── SECTION 5: THE CONTACT ──
function Section5Contact() {
  return (
    <section className="relative w-full min-h-[95vh] min-h-[95dvh] snap-start flex flex-col justify-center px-6 py-12 bg-[#050508]">
      <div className="w-full max-w-lg mx-auto flex flex-col h-full justify-between pb-12">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <h2 className="font-display text-5xl md:text-6xl uppercase tracking-normal leading-[1.05]">
            Let&apos;s make something<br/>
            <span className="text-white/40">impossible to ignore.</span>
          </h2>
          
          <div className="flex flex-col space-y-3">
            <a 
              href="https://wa.me/919997555360?text=Hi%20MAD.Co%20%E2%80%94%20I%20scanned%20your%20card."
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center space-x-3 w-full bg-[#F5250F] active:bg-[#d41e0b] text-white h-16 rounded-xl font-bold transition-colors duration-200 overflow-hidden"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-lg tracking-wide">WhatsApp Us</span>
            </a>
            
            <a 
              href="tel:+919997555360"
              className="flex items-center justify-center space-x-3 w-full bg-white/5 active:bg-white/10 border border-white/10 text-white h-14 rounded-xl font-bold transition-colors duration-200"
            >
              <Phone className="w-5 h-5" />
              <span className="tracking-wide">Call +91 99975 55360</span>
            </a>
            
            <a 
              href="/madco.vcf"
              download="MAD.Co.vcf"
              className="flex items-center justify-center space-x-3 w-full bg-white/5 active:bg-white/10 border border-white/10 text-white h-14 rounded-xl font-bold transition-colors duration-200"
            >
              <UserPlus className="w-5 h-5" />
              <span className="tracking-wide">Save Contact</span>
            </a>
            
            <div className="pt-2">
              <Link 
                href="/"
                className="flex items-center justify-center space-x-3 w-full bg-transparent border border-white/10 active:border-white/20 text-white/50 active:text-white/80 h-14 rounded-xl font-semibold transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm uppercase tracking-widest">See the full site</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center space-y-6 mt-16"
        >
          <a href="https://instagram.com/madco.studio" target="_blank" rel="noopener noreferrer" className="text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-200">
            @madco.studio
          </a>
          
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center justify-center space-x-2">
            <span className="font-black text-white/50">MAD.CO</span>
            <span className="w-1.5 h-1.5 bg-[#F5250F] rounded-full"></span>
            <span>Mangalore &rarr; Everywhere</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
