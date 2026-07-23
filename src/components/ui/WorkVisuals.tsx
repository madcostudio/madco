"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Search, Star, MessageSquare, Check, X, MousePointer2 } from "lucide-react";

export function CompletenessMeter() {
  const [inView, setInView] = useState(false);

  return (
    <div 
      className="w-full p-6 bg-surface-2 border border-white/5 rounded-xl"
      onMouseEnter={() => setInView(true)}
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <h4 className="font-sans font-bold text-lg text-white">Profile Completeness</h4>
          <p className="text-xs text-text-secondary">Average unmanaged profile vs Mad.co standard</p>
        </div>
        <div className="font-mono text-xs text-text-secondary bg-black/50 px-2 py-1 rounded">Illustrative</div>
      </div>
      
      <div className="relative h-6 bg-background rounded-full overflow-hidden mb-6 border border-white/10">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-surface-3 border-r border-white/20"
          initial={{ width: "28%" }}
        />
        <motion.div 
          className="absolute top-0 left-0 h-full bg-championship-gold"
          initial={{ width: "28%" }}
          whileInView={{ width: "96%" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        />
        <div className="absolute inset-0 flex justify-between items-center px-4 font-mono text-xs font-bold pointer-events-none">
          <span className="text-white mix-blend-difference">28% (Before)</span>
          <span className="text-white mix-blend-difference">96% (Optimised)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
        <div className="flex flex-col gap-2">
          <span className="text-text-secondary uppercase font-bold tracking-widest text-[10px]">Missing (Before)</span>
          <div className="flex items-center gap-2 text-text-secondary"><X className="h-3 w-3 text-red-500" /> Professional interior shots</div>
          <div className="flex items-center gap-2 text-text-secondary"><X className="h-3 w-3 text-red-500" /> 360° virtual tour</div>
          <div className="flex items-center gap-2 text-text-secondary"><X className="h-3 w-3 text-red-500" /> Menu / Booking links</div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-championship-gold uppercase font-bold tracking-widest text-[10px]">Added (After)</span>
          <div className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-championship-gold" /> HDR photography set</div>
          <div className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-championship-gold" /> Interactive 360° walkthrough</div>
          <div className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-championship-gold" /> Fully populated profile details</div>
        </div>
      </div>
    </div>
  );
}

export function CustomerDecisionMoment() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 relative">
      <div className="absolute top-2 right-2 font-mono text-[10px] text-text-secondary bg-black/50 px-2 py-1 rounded z-10">Concept</div>
      
      {/* Panel 1: Hesitant */}
      <div className="flex-1 bg-surface-2 border border-white/5 rounded-xl p-6 flex flex-col items-center text-center opacity-60">
        <div className="w-32 h-48 bg-background border border-white/10 rounded-xl mb-4 relative overflow-hidden flex flex-col items-center pt-4">
          <div className="w-24 h-16 bg-surface-3 rounded mb-3 flex items-center justify-center">
            <Camera className="h-6 w-6 text-white/20" />
          </div>
          <div className="w-20 h-2 bg-white/10 rounded mb-2"></div>
          <div className="w-16 h-2 bg-white/5 rounded"></div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="text-2xl">🤔</div>
          </div>
        </div>
        <h5 className="font-sans font-bold text-sm text-white mb-1">Standard Listing</h5>
        <p className="text-xs text-text-secondary">Low trust, high friction. Users bounce to competitors.</p>
      </div>

      {/* Panel 2: Confident */}
      <div className="flex-1 bg-surface-2 border border-championship-gold/30 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-championship-gold/5 to-transparent"></div>
        <div className="w-32 h-48 bg-background border border-championship-gold/50 rounded-xl mb-4 relative overflow-hidden flex flex-col items-center pt-4">
          <div className="w-24 h-24 bg-surface-3 rounded mb-3 relative overflow-hidden">
            <img src="/restaurant_360.png" alt="360" className="absolute inset-0 w-full h-full object-cover saturate-150 contrast-125" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="bg-mad-red text-white text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">360°</span>
            </div>
          </div>
          <div className="w-20 h-2 bg-white rounded mb-2"></div>
          <div className="flex gap-1">
            <Star className="w-2 h-2 text-championship-gold fill-championship-gold" />
            <Star className="w-2 h-2 text-championship-gold fill-championship-gold" />
            <Star className="w-2 h-2 text-championship-gold fill-championship-gold" />
            <Star className="w-2 h-2 text-championship-gold fill-championship-gold" />
            <Star className="w-2 h-2 text-championship-gold fill-championship-gold" />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 bg-electric-azure rounded-full border-2 border-background">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <MousePointer2 className="absolute bottom-2 right-4 h-4 w-4 text-white drop-shadow-md z-10" />
        </div>
        <h5 className="font-sans font-bold text-sm text-championship-gold mb-1">Optimised Profile</h5>
        <p className="text-xs text-text-secondary relative z-10">High conviction. User confidently gets directions.</p>
      </div>
    </div>
  );
}

export function HotspotDemo() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-surface-2 border border-white/5 rounded-xl overflow-hidden group">
      <div className="absolute top-4 right-4 font-mono text-[10px] text-white bg-black/50 px-2 py-1 rounded z-20 uppercase tracking-widest border border-white/10">Illustrative Demonstration</div>
      
      {/* Background Image */}
      <img src="/restaurant_360.png" alt="Concept Panorama" className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6] contrast-125 group-hover:scale-105 transition-transform duration-[2s]" />

      {/* Hotspots */}
      <div className="absolute top-1/3 left-1/4 group/spot z-10">
        <div className="w-6 h-6 rounded-full bg-white/20 border border-white/50 flex items-center justify-center backdrop-blur-md cursor-pointer animate-pulse group-hover/spot:animate-none">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/spot:opacity-100 transition-opacity duration-300 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-3 pointer-events-none">
          <h6 className="text-xs font-bold text-white mb-1">Seasonal Menu</h6>
          <p className="text-[10px] text-text-secondary">View our current offerings and specials directly inside the tour.</p>
        </div>
      </div>

      <div className="absolute top-1/2 right-1/3 group/spot z-10">
        <div className="w-6 h-6 rounded-full bg-mad-red/40 border border-mad-red flex items-center justify-center backdrop-blur-md cursor-pointer animate-pulse group-hover/spot:animate-none">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/spot:opacity-100 transition-opacity duration-300 w-40 bg-mad-red text-white border border-red-500/50 rounded-lg p-3 pointer-events-none shadow-xl shadow-mad-red/20">
          <h6 className="text-xs font-bold uppercase tracking-wider mb-1">Book a Table</h6>
          <p className="text-[10px] text-white/80">Direct integration with your reservation system.</p>
        </div>
      </div>
    </div>
  );
}

export function DeliveryKit() {
  const items = [
    { icon: <MapPin className="w-5 h-5" />, title: "360° Virtual Tour", desc: "Published directly to Google Street View." },
    { icon: <Camera className="w-5 h-5" />, title: "Edited Photos", desc: "High-resolution architectural still photography." },
    { icon: <Search className="w-5 h-5" />, title: "Optimised Profile", desc: "Hours, descriptions, and categories fixed." },
    { icon: <Check className="w-5 h-5" />, title: "QR Code Kit", desc: "Print-ready codes for tables and doors." }
  ];

  return (
    <div className="w-full bg-surface-2 border border-white/5 rounded-xl p-8 relative">
      <div className="absolute top-4 right-4 font-mono text-[10px] text-text-secondary bg-black/50 px-2 py-1 rounded uppercase tracking-widest">Concept</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-championship-gold shrink-0">
              {item.icon}
            </div>
            <div>
              <h5 className="font-sans font-bold text-sm text-white mb-1">{item.title}</h5>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
