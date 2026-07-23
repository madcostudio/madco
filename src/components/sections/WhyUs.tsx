"use client";

import React from "react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { CheckCircle2 } from "lucide-react";

const metrics = [
  {
    value: "↑",
    label: "Customer Interest",
    desc: "Listings with 360° imagery consistently see higher engagement than photo-only listings."
  },
  {
    value: "+",
    label: "Higher Bookings",
    desc: "Complete business listings with 360 views see a meaningful increase in conversion metrics."
  },
  {
    value: "24/7",
    label: "Always On",
    desc: "Your space selling itself, every hour. Engineered to load in milliseconds on any device."
  }
];

export function WhyUs() {
  return (
    <section className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Metrics */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
                // CONVERSION SCIENCE
              </span>
              <h2 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-white">
                WE CONVERT VIEWS INTO VISITORS.
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans mt-2">
                Static smartphone images don&apos;t build expectation. They look cheap. Immersive tours allow prospective customers to test your layout, view your aesthetic, and pre-verify your quality.
              </p>
            </div>

            {/* Metrics List */}
            <div className="flex flex-col gap-6">
              {metrics.map((item) => (
                <div key={item.label} className="flex gap-4 border-l border-white/10 pl-4 py-1 hover:border-mad-red transition-colors duration-300">
                  <div className="font-mono text-3xl font-black text-white tracking-tight">
                    {item.value}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-championship-gold uppercase tracking-wider">
                      {item.label}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-0.5 max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Before/After Comparison */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                Interactive Comparison Slider
              </span>
              <span className="font-mono text-[10px] tracking-widest text-mad-red uppercase animate-pulse">
                Drag to slide
              </span>
            </div>
            <BeforeAfter />
          </div>

        </div>

      </div>
    </section>
  );
}
