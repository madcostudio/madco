"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICE_NAV, COMPANY_NAV } from "@/lib/nav";

/**
 * Desktop header navigation.
 *
 * Previously the header linked to "360 Tours / Work / Services / Process /
 * Studio", where "Services" jumped to a homepage anchor. Four of the five
 * service pages were therefore unreachable from the header, and the set
 * did not match the mobile menu.
 *
 * Now all five services live in a "What we do" menu with one-line
 * descriptions, and the list comes from lib/nav alongside the mobile menu.
 */
export function DesktopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Small close delay so the pointer can travel from trigger to panel.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isServiceRoute = SERVICE_NAV.some((s) => pathname === s.href);

  return (
    <nav className="hidden md:flex items-center gap-7 font-mono text-xs tracking-widest uppercase text-text-secondary">
      {/* ── What we do ── */}
      <div
        className="relative"
        onMouseEnter={() => {
          cancelClose();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className={`flex items-center gap-1.5 py-2 transition-colors duration-300 cursor-pointer ${
            isServiceRoute || open ? "text-white" : "hover:text-white"
          }`}
        >
          What we do
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute left-0 top-full pt-3 w-[22rem]"
            >
              <div className="glass-morphism rounded-xl p-2 shadow-2xl">
                {SERVICE_NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors ${
                        active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`font-sans font-bold text-sm tracking-tight normal-case ${
                            active ? "text-mad-red" : "text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-mad-azure/20 text-mad-azure rounded-sm font-bold tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {item.blurb && (
                        <span className="font-sans text-xs tracking-normal normal-case text-text-secondary leading-snug">
                          {item.blurb}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Studio links ── */}
      {COMPANY_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`py-2 transition-colors duration-300 ${
              active ? "text-white" : "hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
