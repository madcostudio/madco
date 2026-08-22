import type { Metadata } from "next";
import SoftwareClient from "./SoftwareClient";

export const metadata: Metadata = {
  title: "Software & Automation — Custom Systems | MAD.Co",
  description: "We build the machine that runs while you sleep. Custom automations, booking systems, dashboards, and internal tools. Consultation-based, from ₹24,999. Mangalore, India.",
  openGraph: {
    title: "Software & Automation | MAD.Co",
    description: "Custom automations, WhatsApp flows, reservation systems, admin dashboards. Consultation-based builds starting from ₹24,999.",
  },
};

export default function SoftwarePage() {
  return <SoftwareClient />;
}
