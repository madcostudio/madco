import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAD.CO // Operations Panel",
  description: "Internal operations, workflow, and client walkthrough delivery tracking.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-mad-red selection:text-white">
      {children}
    </div>
  );
}
