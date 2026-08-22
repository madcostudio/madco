import type { Metadata } from "next";
import ProcessClient from "./ProcessClient";

export const metadata: Metadata = {
  title: "Our Process — The 4-Phase System | MAD.Co",
  description: "Spatial Audit & Design → Cinematic HDR Scan → Interactive Enrichment → Maps Sync & Web Presence. Our engineered 4-phase system for immersive virtual tours.",
  openGraph: {
    title: "The 4-Phase System | MAD.Co",
    description: "How we build immersive virtual tours: from spatial audit to Google Maps deployment.",
  },
};

export default function ProcessPage() {
  return <ProcessClient />;
}
