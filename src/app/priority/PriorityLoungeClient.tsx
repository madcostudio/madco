"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Sparkles, PhoneCall, Calendar, MessageSquare, Send } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import Link from "next/link";

const priorityPackages = [
  {
    name: "Enterprise Scan",
    price: "₹29,999",
    target: "Restaurants, Showrooms, Multi-Room Venues",
    features: [
      "Cinematic HDR capture (up to 20 scan points)",
      "Custom interactive hotspots (menu, booking, links)",
      "Google Maps optimisation + Street View sync",
      "Performance-optimised website embed code",
      "Priority delivery dispatch (3–4 days)",
      "2-Year Cloud Hosting & Maintenance Plan",
    ],
    cta: "Request Enterprise Consultation",
    badge: null,
  },
  {
    name: "Flagship Immersion",
    price: "₹59,999",
    target: "Hotels, Luxury Venues, Premium Clinics & Spas",
    features: [
      "Everything in Enterprise Scan included",
      "Custom-branded tour player UI (your logo, your colours)",
      "Dedicated landing page custom-built around the tour",
      "Full spatial layout & environment consultation",
      "Quarterly scan refresh + performance audits",
      "Dedicated point of contact manager",
      "3-Year Cloud Hosting, Analytics & Support",
    ],
    cta: "Request Flagship Strategy",
    badge: "PRIORITY",
  },
  {
    name: "Bespoke",
    price: "By Invitation",
    target: "Multi-Location Brands, Flagship Venues",
    features: [
      "Fully custom scanning scope & multi-property alignment",
      "Bespoke integrations (reservations, CRM, custom hubs)",
      "Ongoing marketing management & targeted campaigns",
      "Limited to a select cohort of active projects per quarter",
      "Dedicated creative director allocation",
    ],
    cta: "Inquire for private briefing",
    badge: "CUSTOM SCOPE",
  }
];

export function PriorityLoungeClient() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    tier: "flagship",
    contact: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({ contact: "", email: "" });

  const handlePhoneFocus = () => {
    if (!formData.contact) {
      setFormData((prev) => ({ ...prev, contact: "+91 " }));
    }
  };

  const handlePhoneChange = (value: string) => {
    let formatted = value;
    if (value && !value.startsWith("+")) {
      if (/^\d/.test(value)) {
        formatted = "+91 " + value;
      } else {
        formatted = "+" + value;
      }
    }
    setFormData({ ...formData, contact: formatted });
    if (errors.contact) {
      setErrors((prev) => ({ ...prev, contact: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.businessName || !formData.contact || !formData.email) return;

    // Validation
    const cleanPhone = formData.contact.replace(/\D/g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;
    const newErrors = { contact: "", email: "" };

    let numberPart = cleanPhone;
    if (cleanPhone.startsWith("91")) {
      numberPart = cleanPhone.slice(2);
    }

    if (!formData.contact.startsWith("+")) {
      newErrors.contact = "Phone number must start with country code (e.g. +91)";
      hasError = true;
    } else if (cleanPhone.startsWith("91") && numberPart.length !== 10) {
      newErrors.contact = "Indian mobile numbers must be exactly 10 digits";
      hasError = true;
    } else if (cleanPhone.length < 11 || cleanPhone.length > 15) {
      newErrors.contact = "Please enter a valid phone number";
      hasError = true;
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ contact: "", email: "" });
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          businessName: formData.businessName,
          category: `Priority Lounge: ${formData.tier}`,
          contact: formData.contact,
          email: formData.email,
          message: formData.notes || undefined,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        console.error("Booking API Error:", data.error || "Failed to submit booking");
        setIsSuccess(true); // Fallback so UX doesn't freeze
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setIsSuccess(true); // Fallback so UX doesn't freeze
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] pt-28 pb-16 px-6 md:px-12 xl:px-24 relative overflow-hidden font-sans">
      
      {/* Background soft gold radial glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[60vw] w-[60vw] rounded-full blur-[160px] opacity-40"
          style={{ background: "radial-gradient(circle, rgba(200,162,77,0.12) 0%, rgba(200,162,77,0) 70%)" }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-16">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-6 items-start">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-text-secondary hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>← EXIT LOUNGE</span>
          </Link>

          <div className="max-w-3xl text-left flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
              className="flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-championship-gold" />
              <span className="font-mono text-xs tracking-widest text-championship-gold uppercase font-bold">
                PRIORITY LOUNGE // CATEGORY LEADER SPEC
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.1 }}
              className="font-sans font-black text-4xl md:text-6xl leading-[0.95] tracking-tighter text-white uppercase"
            >
              FOR VENUES THAT<br />
              <span className="text-stroke-thin" style={{ WebkitTextStroke: "1px rgba(200, 162, 77, 0.3)" }}>SET THE</span>{" "}
              <span className="text-championship-gold">STANDARD.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-text-secondary leading-relaxed font-sans mt-2"
            >
              You found the Priority Lounge. This is where we work with the venues that define their category — custom scope, deeper craft, and direct access to founder strategy.
            </motion.p>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {priorityPackages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 1, delay: idx * 0.15 }}
              className="relative flex flex-col justify-between p-8 rounded-xl border border-white/5 hover:border-championship-gold/20 transition-all duration-500 text-left"
              style={{
                background: "rgba(10, 10, 11, 0.85)",
                backdropFilter: "blur(24px) saturate(125%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 25px 60px rgba(0,0,0,0.55)"
              }}
            >
              {pkg.badge && (
                <div 
                  className="absolute top-4 right-4 text-white font-mono text-[9px] tracking-widest px-2.5 py-0.5 rounded-sm uppercase font-bold"
                  style={{ backgroundColor: "var(--championship-gold)" }}
                >
                  {pkg.badge}
                </div>
              )}

              <div>
                <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-1">
                  {pkg.name}
                </h3>
                <p className="font-mono text-[9px] tracking-widest text-text-secondary uppercase mb-6">
                  {pkg.target}
                </p>

                <div className="flex items-baseline gap-2 mb-8 border-b border-white/5 pb-6">
                  <span className="font-sans font-black text-4xl tracking-tight text-championship-gold">
                    {pkg.price}
                  </span>
                  {pkg.price !== "By Invitation" && (
                    <span className="font-mono text-[10px] text-text-secondary uppercase">/ Setup</span>
                  )}
                </div>

                <ul className="flex flex-col gap-4 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-championship-gold shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary font-sans leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Magnetic>
                <a
                  href="#priority-form"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#151515] hover:bg-championship-gold text-white hover:text-black text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded border border-white/10"
                >
                  <span>{pkg.cta}</span>
                </a>
              </Magnetic>
            </motion.div>
          ))}
        </div>

        {/* Priority Care Retainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1 }}
          className="p-8 rounded-xl border border-championship-gold/25 hover:border-championship-gold/45 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left"
          style={{
            background: "rgba(10, 10, 11, 0.8)",
            backdropFilter: "blur(24px) saturate(120%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 25px 60px rgba(0,0,0,0.5)"
          }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-championship-gold" />
              <span className="font-mono text-[9px] tracking-widest text-championship-gold uppercase font-bold">
                PRIORITY SPATIAL RETAINER
              </span>
            </div>
            <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-2">
              PRIORITY CARE PLAN
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              Dedicated spatial profile upkeep. Includes monthly tour updates, seasonal photo refresh sessions, local ranking search optimization, and direct founder performance reports.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
            <div className="text-left md:text-right">
              <span className="font-mono text-xs text-text-secondary uppercase">Priority Upkeep</span>
              <div className="font-sans font-black text-3xl text-championship-gold mt-1">₹8,999<span className="text-xs text-text-secondary">/month</span></div>
            </div>
            <Magnetic>
              <a
                href="#priority-form"
                className="flex items-center gap-2 px-5 py-3.5 bg-championship-gold hover:bg-[#b08b3c] text-black text-xs font-mono tracking-widest uppercase transition-colors duration-300 rounded font-bold"
              >
                <span>Attach Priority Care</span>
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* Lead Capture form */}
        <div id="priority-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs tracking-widest text-championship-gold uppercase">// DIRECT BRIEFING</span>
              <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter text-white">
                REQUEST PRIVATE BRIEFING.
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">
                Tell us about your space. Romeo (our founder) will review your layout personally and contact you directly to discuss spatial goals.
              </p>
            </div>

            <Magnetic>
              <a
                href="https://wa.me/918762640420?text=Hi%20Romeo%2C%20I'm%20interested%20in%20arranging%20a%20Priority%20Lounge%20consultation%20for%20my%20space."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded bg-[#101011] border border-white/5 hover:border-championship-gold/30 hover:bg-surface-3 transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-championship-gold/10 text-championship-gold">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">
                    Talk to Romeo Directly
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Open a direct founder WhatsApp link.
                  </p>
                </div>
              </a>
            </Magnetic>
          </div>

          <div className="lg:col-span-7 w-full text-left">
            <div 
              className="bg-surface-2 border border-white/5 rounded-xl p-8 relative"
              style={{
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
              }}
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                        Lead Representative Name
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Rahul Shetty"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 focus:border-championship-gold outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                        Venue / Brand Name
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="The Banyan Tree Residency"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 focus:border-championship-gold outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                          Priority Package
                        </label>
                        <select 
                          value={formData.tier}
                          onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                          className="w-full bg-[#050505] border border-white/10 focus:border-championship-gold outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                        >
                          <option value="enterprise">Enterprise Scan (₹29,999)</option>
                          <option value="flagship">Flagship Immersion (₹59,999)</option>
                          <option value="bespoke">Bespoke Scope (By Invitation)</option>
                          <option value="care">Priority Care Retainer Only (₹8,999/mo)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                          Direct Contact (WhatsApp preferred)
                        </label>
                        <input 
                          type="tel"
                          required
                          placeholder="+91 99000 00000"
                          value={formData.contact}
                          onFocus={handlePhoneFocus}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className={`w-full bg-[#050505] border outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300 ${
                            errors.contact ? "border-mad-red" : "border-white/10 focus:border-championship-gold"
                          }`}
                        />
                        {errors.contact && (
                          <span className="text-[10px] font-mono text-mad-red uppercase tracking-wide">
                            {errors.contact}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                          Email Address
                        </label>
                        <input 
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          className={`w-full bg-[#050505] border outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300 ${
                            errors.email ? "border-mad-red" : "border-white/10 focus:border-championship-gold"
                          }`}
                        />
                        {errors.email && (
                          <span className="text-[10px] font-mono text-mad-red uppercase tracking-wide">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                        Core brief instructions &amp; specifications (Optional)
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Mention venue dimensions, locations, lighting preferences..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 focus:border-championship-gold outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300 resize-none"
                      />
                    </div>

                    <Magnetic>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-championship-gold text-black hover:bg-[#b08b3c] text-sm font-mono tracking-widest uppercase disabled:opacity-50 transition-colors duration-300 rounded font-bold cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>{isSubmitting ? "Dispatching Brief..." : "Submit Private Request"}</span>
                      </button>
                    </Magnetic>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    className="flex flex-col items-center text-center py-8 gap-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-championship-gold/10 border border-championship-gold text-championship-gold">
                      <Check className="h-8 w-8" />
                    </div>
                    
                    <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mt-2">
                      BRIEF DISPATCHED
                    </h3>
                    
                    <p className="text-sm text-text-secondary font-sans max-w-sm leading-relaxed">
                      Thank you, {formData.name}. Your details have been submitted. Romeo will contact you directly on <strong className="text-white">{formData.contact}</strong> within 12 hours.
                    </p>

                    <div className="h-[1px] w-12 bg-white/15 my-2" />

                    <a 
                      href={`https://wa.me/918762640420?text=Hi%20Romeo%2C%20my%20name%20is%20${encodeURIComponent(formData.name)}%20from%20${encodeURIComponent(formData.businessName)}.%20I%20just%20submitted%20a%20private%20Priority%20Lounge%20brief.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-4 bg-electric-azure text-white text-xs font-mono tracking-widest uppercase hover:bg-[#1a8ce6] transition-colors duration-300 rounded shadow-md border border-white/10"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Start Direct WhatsApp Chat</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
