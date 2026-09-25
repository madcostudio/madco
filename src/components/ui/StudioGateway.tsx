"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function StudioGateway() {
  const router = useRouter();
  const [isPressing, setIsPressing] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const timerRef = useRef<any>(null);
  
  // Total time to hold (ms)
  const HOLD_DURATION = 1500;

  const handlePointerDown = () => {
    if (isActivated) return;
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      setIsActivated(true);
      // Let the animation play before actually navigating
      setTimeout(() => {
         router.push("/studio");
      }, 1500); 
    }, HOLD_DURATION);
  };

  const handlePointerUpOrLeave = () => {
    if (isActivated) return;
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Preload route for smooth transition
  useEffect(() => {
    router.prefetch("/studio");
  }, [router]);

  return (
    <>
      {/* The trigger text in the footer */}
      <div 
        className="relative cursor-crosshair select-none inline-flex overflow-hidden py-1 px-2 -ml-2 rounded"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        
        // Touch events explicitly to prevent mobile scrolling while holding
        onTouchStart={(e) => {
          // e.preventDefault(); // Might be too aggressive, but good for reliable long-press
        }}
      >
        <span className="relative z-10 transition-colors duration-300" style={{ color: isPressing ? "#fff" : "inherit" }}>
          &copy; {new Date().getFullYear()} MAD.CO STUDIO. ALL RIGHTS RESERVED.
        </span>
        
        {/* Loading bar behind the text */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-mad-red/40 z-0"
          initial={{ width: 0 }}
          animate={{ width: isPressing ? "100%" : 0 }}
          transition={{ 
            duration: isPressing ? HOLD_DURATION / 1000 : 0.3,
            ease: "linear"
          }}
        />
      </div>

      {/* Jarvis-like Fullscreen Overlay */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Background radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,37,15,0.15)_0,black_100%)]" />
            
            {/* Grid overlay for tech feel */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative z-10 flex flex-col items-center gap-8"
            >
              {/* Spinning Tech Ring */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t-2 border-r-2 border-mad-red opacity-80"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-b-2 border-l-2 border-white opacity-30"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 bg-mad-red rounded-full shadow-[0_0_15px_rgba(245,37,15,0.8)]"
                />
              </div>
              
              <div className="text-center font-mono space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-mad-red font-bold text-2xl md:text-3xl tracking-[0.3em]"
                >
                  ACCESS GRANTED
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-white text-xs tracking-[0.2em] opacity-70 flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  INITIALIZING STUDIO PANEL...
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
