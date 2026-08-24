import React from "react";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { WorkTeaser } from "@/components/sections/WorkTeaser";
import { Process } from "@/components/sections/Process";
import { CTASection } from "@/components/sections/CTASection";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SpatialCursor } from "@/components/ui/SpatialCursor";

export default function Home() {
  return (
    <div className="w-full flex flex-col relative">
      {/* Interactive Spatial Cursor Spotlight */}
      <SpatialCursor />

      {/* Scroll Progressive Indicator */}
      <ScrollProgress />

      {/* Landing Page Sections */}
      <Hero />
      <TrustStrip />
      <Services />
      <WhyUs />
      <WorkTeaser />
      <Process />
      <CTASection />
    </div>
  );
}
