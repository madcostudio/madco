import type { Metadata } from "next";
import MadTapClient from "./MadTapClient";

export const metadata: Metadata = {
  title: "MAD Tap — NFC & QR Tap Technology | MAD.Co",
  description: "Tap. And it happens. Turn every table, seat, and counter into a moment of action with NFC + QR technology. Tap-to-Review, Tap-to-Menu, Tap-to-Order. Mangalore, India.",
  openGraph: {
    title: "MAD Tap — Tap. And It Happens. | MAD.Co",
    description: "NFC + QR points that trigger the action you want. Reviews, menus, orders — one tap, no app.",
  },
};

export default function MadTapPage() {
  return <MadTapClient />;
}
