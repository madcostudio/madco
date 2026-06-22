"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panorama } from "@/components/ui/Panorama";
import { Dumbbell, Coffee, UtensilsCrossed } from "lucide-react";

const scenes = [
  {
    id: "cafe",
    title: "Cafe Esthétique",
    tagline: "Concept Tour // High-retention social café design",
    icon: Coffee,
    src: "/cafe_360.png",
    hotspots: [
      {
        id: "brew",
        lat: -12,
        lon: 135,
        label: "Slayer Espresso Bar",
        description: "Equipped with custom Slayer Steam LP machines and Mahlkönig grinders for specialty espresso craft.",
      },
      {
        id: "lounge",
        lat: -18,
        lon: 215,
        label: "Premium Creator Seating",
        description: "Ergonomic leather banquettes and charging hubs optimized for creators, business meetings, and remote work.",
      },
      {
        id: "lighting",
        lat: 16,
        lon: 295,
        label: "Warm Environment Lighting",
        description: "Amber hand-blown glass fixtures engineered to maintain a cozy, high-retention atmosphere.",
      }
    ]
  },
  {
    id: "gym",
    title: "The Iron Forge Gym",
    tagline: "Concept Tour // Adrenaline-fueled training center",
    icon: Dumbbell,
    src: "/gym_360.png",
    hotspots: [
      {
        id: "legpress",
        lat: -15,
        lon: 90,
        label: "Plate-Loaded Leg Press",
        description: "Heavy-duty biomechanically aligned leg press machines for high-intensity training.",
      },
      {
        id: "led",
        lat: 5,
        lon: 180,
        label: "Linear LED Accent Strips",
        description: "Custom red neon illumination designed to fuel focus, adrenaline, and aesthetic photos.",
      },
      {
        id: "cardio",
        lat: -10,
        lon: 270,
        label: "Sleek Cardio Station",
        description: "Bespoke commercial treadmills with high-resolution digital displays and real-time biometric integration.",
      }
    ]
  },
  {
    id: "restaurant",
    title: "Aura Dining Room",
    tagline: "Concept Tour // Cinematic fine-dining atmosphere",
    icon: UtensilsCrossed,
    src: "/restaurant_360.png",
    hotspots: [
      {
        id: "marble",
        lat: -20,
        lon: 40,
        label: "Marble Tables",
        description: "Premium Calacatta marble tables curated to offer luxury tactile dining contact.",
      },
      {
        id: "candles",
        lat: -10,
        lon: 160,
        label: "Intimate Glow",
        description: "Specially calibrated real beeswax candle styling to create natural, warm environmental tones.",
      },
      {
        id: "crystal",
        lat: -18,
        lon: 290,
        label: "Glassware Styling",
        description: "Handmade fine lead-free crystal glasses reflecting candle flares for a cinematic table setup.",
      }
    ]
  }
];

export function Portfolio() {
  const [activeScene, setActiveScene] = useState(scenes[0]);

  return (
    <section id="work" className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
              // RECENT SHOWCASES
            </span>
            <h2 className="font-sans font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
              VIRTUAL SPACES.
            </h2>
          </div>

          {/* Scene Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-surface-1 p-1 rounded-lg border border-white/5">
            {scenes.map((scene) => {
              const Icon = scene.icon;
              const isActive = activeScene.id === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => setActiveScene(scene)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded cursor-pointer ${
                    isActive 
                      ? "bg-mad-red text-white shadow-md" 
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{scene.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Panorama Window */}
        <div className="relative">
          {/* Metadata Overlay top right */}
          <div className="absolute top-4 right-4 z-30 pointer-events-none text-right hidden sm:block">
            <div className="font-mono text-[10px] tracking-widest text-championship-gold uppercase">
              ACTIVE VIRTUAL SHOWCASE
            </div>
            <div className="font-sans font-bold text-lg text-white uppercase mt-0.5">
              {activeScene.title}
            </div>
            <div className="font-sans text-xs text-text-secondary">
              {activeScene.tagline}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.4 }}
            >
              <Panorama src={activeScene.src} hotspots={activeScene.hotspots} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
