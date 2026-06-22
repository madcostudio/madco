import type { Metadata } from "next";
import React from "react";
import { PriorityLoungeClient } from "./PriorityLoungeClient";

// Disable search engine indexing for sales privacy
export const metadata: Metadata = {
  title: "Priority Lounge — Mad.co Studio",
  description: "Exclusive spatial marketing and virtual tour configurations for category-defining venues.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function PriorityPage() {
  return <PriorityLoungeClient />;
}
