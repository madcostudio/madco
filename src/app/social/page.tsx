import type { Metadata } from "next";
import SocialClient from "./SocialClient";

export const metadata: Metadata = {
  title: "Social Media Management — Coming Soon | MAD.Co",
  description: "Full-stack social media management for experience-first brands. Coming soon from MAD.Co Studio, Mangalore. Join the waitlist to be first.",
  openGraph: {
    title: "Social Media Management — Coming Soon | MAD.Co",
    description: "We're building something different. Join the waitlist.",
  },
};

export default function SocialPage() {
  return <SocialClient />;
}
