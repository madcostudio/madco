import type { Metadata } from "next";
import WebDesignClient from "./WebDesignClient";

export const metadata: Metadata = {
  title: "Web Design — Ultra-Fast React Sites | MAD.Co",
  description: "Speed is trust. We engineer high-performance React & Next.js websites for premium local spaces. SEO-optimized, 360°-embed-ready, and designed to convert. Website design Mangalore.",
  openGraph: {
    title: "Web Design — Speed Is Trust | MAD.Co",
    description: "Ultra-fast React/Next.js websites engineered for premium local spaces. Full SEO, booking flows, and 360°-embed-ready.",
  },
};

export default function WebDesignPage() {
  return <WebDesignClient />;
}
