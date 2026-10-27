"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageSquare, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICE_NAV, COMPANY_NAV, PRIMARY_CTA } from "@/lib/nav";
import { config } from "@/lib/config";

/**
 * Mobile menu.
 *
 * Rewritten for orientation rather than decoration:
 *  - Links are grouped under "Services" and "Studio" headings, so the menu
 *    communicates the shape of the site instead of presenting eight
 *    undifferentiated words.
 *  - Each link carries a one-line blurb, so a first-time visitor knows what
 *    "MAD Tap" is without having to open it.
 *  - Items are left-aligned in a scrollable column. They were previously
 *    centred and vertically centred, which broke once the list outgrew the
 *    screen on smaller phones.
 *  - The current page is marked, so you always know where you are.
 *  - Both the primary CTA and WhatsApp are pinned at the bottom, in thumb
 *    reach, because those are the two actions the site exists to produce.
 *  - The menu closes on route change and on Escape.
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  // Close whenever navigation happens.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll while open; close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const renderGroup = (title: string, items: typeof SERVICE_NAV) => (
    <div className="flex flex-col gap-1">
      <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-mad-red/90 px-1 pb-2">
        {title}
      </h2>
      {items.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors ${
              active ? "bg-white/10" : "hover:bg-white/5 active:bg-white/10"
            }`}
          >
            <span className="flex flex-col gap-0.5 min-w-0">
              <span className="flex items-center gap-2">
                <span
                  className={`font-sans font-bold text-lg tracking-tight ${
                    active ? "text-mad-red" : "text-white"
                  }`}
                >
                  {link.label}
                </span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-mad-azure/20 text-mad-azure rounded-sm font-bold tracking-wider uppercase">
                    {link.badge}
                  </span>
                )}
              </span>
              {link.blurb && (
                <span className="text-xs text-text-secondary leading-snug">
                  {link.blurb}
                </span>
              )}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 text-text-secondary group-hover:text-white transition-colors" />
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-white hover:text-mad-red transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mad-red rounded"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-[#07070c]/98 backdrop-blur-xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            {/* Header row keeps the close button in a fixed, predictable place */}
            <div className="flex items-center justify-between px-5 h-20 shrink-0 border-b border-white/10">
              <span className="font-sans font-black text-xl tracking-tighter uppercase text-white flex items-center gap-1.5">
                MAD.CO
                <span className="h-1.5 w-1.5 rounded-full bg-mad-red" />
              </span>
              <button
                onClick={close}
                className="p-2 -mr-2 text-white hover:text-mad-red transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-mad-red"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Scrollable link list — never traps content off-screen */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 flex flex-col gap-7">
              {renderGroup("What we do", SERVICE_NAV)}
              {renderGroup("Studio", COMPANY_NAV)}
            </nav>

            {/* Actions pinned in thumb reach, clear of the home indicator */}
            <div className="shrink-0 border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-3 bg-black/40">
              <Link
                href={PRIMARY_CTA.href}
                onClick={close}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-mad-red hover:bg-dark-crimson text-white text-sm font-mono tracking-widest uppercase rounded transition-colors"
              >
                {PRIMARY_CTA.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={config.WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 border border-white/15 hover:border-white/30 text-white text-sm font-mono tracking-widest uppercase rounded transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-mad-azure" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
