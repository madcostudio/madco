import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About MAD.Co — Make A Difference | MAD.Co Studio",
  description: "We work exclusively with experience-first businesses. MAD = Make A Difference. Elite creative & spatial-marketing studio based in Mangalore, India.",
  openGraph: {
    title: "About MAD.Co Studio",
    description: "We work exclusively with experience-first businesses. The studio behind immersive 360° tours and spatial marketing.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
