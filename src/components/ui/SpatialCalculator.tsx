"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { config } from "@/lib/config";

const BUSINESS_CATEGORIES = [
  { id: "cafe", name: "Café / Bistro", avgTicket: 450, baseConversion: 0.18, icon: "☕" },
  { id: "restaurant", name: "Restaurant & Bar", avgTicket: 1200, baseConversion: 0.22, icon: "🍽️" },
  { id: "gym", name: "Gym & Fitness", avgTicket: 3000, baseConversion: 0.28, icon: "🏋️" },
  { id: "salon", name: "Salon & Spa", avgTicket: 1500, baseConversion: 0.25, icon: "✂️" },
  { id: "boutique", name: "Retail & Showroom", avgTicket: 2500, baseConversion: 0.20, icon: "🛍️" },
];

export function SpatialCalculator() {
  const [selectedCat, setSelectedCat] = useState(BUSINESS_CATEGORIES[0]);
  const [monthlyViews, setMonthlyViews] = useState(4500);

  // Calculations
  const extraWalkIns = Math.round(monthlyViews * selectedCat.baseConversion * 0.12);
  const monthlyRevenueUplift = Math.round(extraWalkIns * selectedCat.avgTicket * 0.4);
  const paybackDays = Math.max(7, Math.round(35000 / (monthlyRevenueUplift / 30)));

  const whatsappMessage = encodeURIComponent(
    `Hi MAD.Co Studio, I calculated a potential +${extraWalkIns} walk-ins/month for my ${selectedCat.name} (with ~${monthlyViews.toLocaleString()} monthly views). I'd like to claim a spatial audit.`
  );

  return (
    <div className="w-full bg-surface-2 rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-mad-red/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-mad-azure/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs tracking-widest text-mad-red uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Spatial Simulator</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-white">
            Calculate Your Footfall Uplift
          </h3>
        </div>

        <span className="self-start md:self-auto font-mono text-[11px] text-text-secondary bg-surface-3 px-3 py-1.5 rounded-full border border-white/5">
          LIVE CONVERSION ALGORITHM
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Input Controls */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Business Category Selector */}
          <div>
            <label className="block font-mono text-xs tracking-wider text-text-secondary uppercase mb-3">
              1. Select Your Space Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_CATEGORIES.map((cat) => {
                const isSelected = selectedCat.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-sans font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-mad-red/15 border-mad-red text-white shadow-md shadow-mad-red/10"
                        : "bg-surface-3 border-white/5 text-text-secondary hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly Footfall / Search Views Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-mono text-xs tracking-wider text-text-secondary uppercase">
                2. Monthly Profile Impressions / Footfall
              </label>
              <span className="font-mono text-sm font-bold text-white bg-surface-3 px-2.5 py-1 rounded border border-white/10">
                {monthlyViews.toLocaleString()} <span className="text-text-secondary text-xs">views/mo</span>
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="35000"
              step="500"
              value={monthlyViews}
              onChange={(e) => setMonthlyViews(Number(e.target.value))}
              className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-mad-red"
            />
            <div className="flex justify-between font-mono text-[10px] text-text-secondary mt-1.5">
              <span>1,000 / mo</span>
              <span>15,000 / mo</span>
              <span>35,000+ / mo</span>
            </div>
          </div>
        </div>

        {/* Right: Live Dynamic Projection Card */}
        <div className="lg:col-span-6 bg-surface-1 rounded-xl border border-white/10 p-6 flex flex-col gap-5 shadow-inner">
          <div className="font-mono text-[11px] tracking-widest text-[#d4af37] uppercase flex items-center justify-between">
            <span>Projected Monthly Lift</span>
            <span className="text-mad-red font-bold animate-pulse">● LIVE PROJECTION</span>
          </div>

          {/* Key Metric Numbers */}
          <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
            <div>
              <div className="flex items-center gap-1.5 text-text-secondary text-xs font-sans mb-1">
                <Users className="w-3.5 h-3.5 text-mad-red" />
                <span>Est. Extra Walk-Ins</span>
              </div>
              <motion.div
                key={extraWalkIns}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl md:text-4xl text-white font-black"
              >
                +{extraWalkIns}
                <span className="text-xs text-mad-red font-mono ml-1.5 font-normal">/ mo</span>
              </motion.div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-text-secondary text-xs font-sans mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-championship-gold" />
                <span>Est. Revenue Uplift</span>
              </div>
              <motion.div
                key={monthlyRevenueUplift}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl md:text-4xl text-championship-gold font-black"
              >
                ₹{(monthlyRevenueUplift).toLocaleString()}
                <span className="text-xs text-text-secondary font-mono ml-1.5 font-normal">/ mo</span>
              </motion.div>
            </div>
          </div>

          {/* Payback Speed */}
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <Clock className="w-4 h-4 text-mad-azure shrink-0" />
            <span>
              Estimated spatial setup payback time: <strong className="text-white font-mono">~{paybackDays} days</strong>
            </span>
          </div>

          {/* Action CTA */}
          <Magnetic>
            <a
              href={`${config.WHATSAPP_URL}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-mad-red hover:bg-dark-crimson text-white text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded font-bold shadow-lg shadow-mad-red/20 group"
            >
              <span>Claim Audit For My {selectedCat.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
