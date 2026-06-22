import React from "react";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <Services />
      <Portfolio />
      <WhyUs />
      <Process />
      <CTASection />
    </div>
  );
}
