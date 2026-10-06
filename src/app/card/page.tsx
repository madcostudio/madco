import { Metadata } from "next";
import CardClient from "./CardClient";

export const metadata: Metadata = {
  title: "MAD.Co",
  description: "We make brands impossible to ignore.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CardPage() {
  return <CardClient />;
}
