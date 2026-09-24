"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Link as LinkIcon } from "lucide-react";

function NotActiveContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const isNotFound = reason === "not_found";

  const message = isNotFound
    ? "This card isn't active."
    : "This card hasn't been activated yet.";

  const subMessage = isNotFound
    ? "If you believe this is an error, please contact the business."
    : "The business owner needs to complete the setup process to activate this card.";

  return (
    <div className="w-full max-w-md glass-morphism p-8 rounded-2xl relative z-10 shadow-2xl shadow-black/80 text-center mx-4">
      <div className="absolute top-0 right-0 h-[100px] w-[100px] bg-mad-red/5 blur-3xl rounded-full" />
      
      <div className="flex justify-center mb-6">
        <div className="bg-mad-red/10 p-4 rounded-full border border-mad-red/20">
          <AlertCircle className="text-mad-red w-12 h-12" />
        </div>
      </div>

      <h1 className="font-sans font-black text-2xl tracking-tighter uppercase mb-2 text-white">
        {message}
      </h1>
      
      <p className="text-sm text-text-secondary mb-8 leading-relaxed">
        {subMessage}
      </p>

      <a
        href="https://madco.in"
        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold uppercase text-xs tracking-wider py-3.5 px-6 rounded transition-all duration-300"
      >
        <LinkIcon size={14} />
        VISIT MAD.CO
      </a>
    </div>
  );
}

export default function NotActivePage() {
  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dynamic backdrop SVG rings */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-20">
        <svg width="600" height="600" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="280" fill="none" stroke="#FF2E2E" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="300" cy="300" r="200" fill="none" stroke="#FF2E2E" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="120" fill="none" stroke="#FF2E2E" strokeWidth="1" strokeDasharray="20 10" />
        </svg>
      </div>
      
      <div className="absolute top-8 left-8 flex items-center gap-1.5 select-none z-10">
        <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse" />
        <span className="font-sans font-black text-xl tracking-tighter uppercase text-white">
          MAD.CO
        </span>
      </div>

      <Suspense fallback={<div className="text-white font-mono text-xs">LOADING...</div>}>
        <NotActiveContent />
      </Suspense>
    </div>
  );
}
