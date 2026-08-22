"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/tours", label: "360 Tours" },
  { href: "/web-design", label: "Web Design" },
  { href: "/mad-tap", label: "MAD Tap" },
  { href: "/software", label: "Automation" },
  { href: "/social", label: "Social", badge: "Soon" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "Studio" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on click
  const close = () => setIsOpen(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-mad-red transition-colors focus:outline-none"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            <button 
              onClick={close}
              className="absolute top-6 right-6 md:right-12 p-2 text-white hover:text-mad-red transition-colors focus:outline-none"
              aria-label="Close Menu"
            >
              <X className="w-8 h-8" />
            </button>

            <nav className="flex flex-col items-center gap-6 font-mono text-lg tracking-widest uppercase text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="hover:text-mad-red transition-colors duration-300 flex items-center gap-2"
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-mad-azure/20 text-mad-azure rounded-sm font-bold tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              
              <div className="mt-8">
                <Link 
                  href="/contact"
                  onClick={close}
                  className="px-6 py-3 border border-white/20 hover:border-mad-red bg-surface-2 hover:bg-mad-red text-white text-sm font-mono tracking-widest uppercase transition-all duration-300 rounded"
                >
                  Book Call
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
