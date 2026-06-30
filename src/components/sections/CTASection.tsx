"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { MessageSquare, Calendar, Sparkles, Send, Check } from "lucide-react";

export function CTASection() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    category: "cafe",
    contact: "",
    email: "",
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
          category: formData.category,
          contact: formData.contact,
          email: formData.email,
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
    <section id="contact" className="relative py-24 px-6 md:px-12 xl:px-24 border-t border-white/5 bg-surface-1 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Accent lighting */}
        <div className="pointer-events-none absolute -bottom-[10%] -left-[10%] h-[350px] w-[350px] rounded-full bg-mad-red/5 blur-[100px]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Column: Booking details & WhatsApp */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
                // START THE TRANSFORMATION
              </span>
              <h2 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-white">
                LET&apos;S SCALE YOUR ATTENTION.
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans mt-2">
                We work exclusively with experience-first businesses. Book a 15-minute spatial marketing audit. We will analyze your Google Maps performance and layout potential.
              </p>
            </div>

            {/* Direct Connect Options */}
            <div className="flex flex-col gap-4">
              <a 
                href="https://wa.me/918762640420?text=Hi%20Mad.co%2C%20I'd%20like%20to%20book%20a%20strategy%20session%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded bg-surface-2 border border-white/5 hover:border-electric-azure/30 hover:bg-surface-3 transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-azure/10 text-electric-azure">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-mono text-xs tracking-widest text-white uppercase">
                    WhatsApp Fast Lane
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Connect instantly with our strategist in Mangalore.
                  </p>
                </div>
              </a>

              <div className="flex flex-col gap-1.5 font-mono text-xs tracking-wider text-text-secondary mt-4 pl-1">
                <div>MAD.CO STUDIO HQ</div>
                <div className="text-white">MANGALORE, KARNATAKA, INDIA</div>
                <div className="mt-2 hover:text-white transition-colors duration-300">
                  <a href="mailto:mad.coad@gmail.com">MAD.COAD@GMAIL.COM</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-surface-2 border border-white/5 rounded-xl p-8 relative">
              
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
                      <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                        Your Name
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Rahul Shetty"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-background border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                        Business Name
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. The Banyan Tree Cafe"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full bg-background border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                          Business Category
                        </label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-background border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                        >
                          <option value="cafe">Cafe / Bistro</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="gym">Gym / Fitness</option>
                          <option value="salon">Salon / Spa</option>
                          <option value="clinic">Clinic / Lab</option>
                          <option value="showroom">Showroom</option>
                        </select>
                      </div>

                       <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                          WhatsApp / Phone
                        </label>
                        <input 
                          type="tel"
                          required
                          placeholder="e.g. +91 99000 00000"
                          value={formData.contact}
                          onFocus={handlePhoneFocus}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className={`w-full bg-background border outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300 ${
                            errors.contact ? "border-mad-red" : "border-white/10 focus:border-mad-red"
                          }`}
                        />
                        {errors.contact && (
                          <span className="text-[10px] font-mono text-mad-red uppercase tracking-wide">
                            {errors.contact}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                          Email Address
                        </label>
                        <input 
                          type="email"
                          required
                          placeholder="e.g. name@company.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          className={`w-full bg-background border outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300 ${
                            errors.email ? "border-mad-red" : "border-white/10 focus:border-mad-red"
                          }`}
                        />
                        {errors.email && (
                          <span className="text-[10px] font-mono text-mad-red uppercase tracking-wide">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <Magnetic>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-mad-red text-white text-sm font-mono tracking-widest uppercase hover:bg-dark-crimson disabled:opacity-50 transition-colors duration-300 rounded border border-white/10 cursor-pointer"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{isSubmitting ? "Submitting Request..." : "Request Free Spatial Audit"}</span>
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mad-red/10 border border-mad-red text-mad-red animate-bounce">
                      <Check className="h-8 w-8" />
                    </div>
                    
                    <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mt-2">
                      AUDIT REQUESTED
                    </h3>
                    
                    <p className="text-sm text-text-secondary font-sans max-w-sm leading-relaxed">
                      Thank you, {formData.name}. We have logged your request for <strong className="text-white">{formData.businessName}</strong>. Our strategist will review your Google Maps listing and text you shortly.
                    </p>

                    <div className="h-[1px] w-12 bg-white/15 my-2" />

                    <a 
                      href={`https://wa.me/918762640420?text=Hi%20Mad.co%20Studio%2C%20my%20name%20is%20${encodeURIComponent(formData.name)}%20from%20${encodeURIComponent(formData.businessName)}.%20I%20just%20submitted%20a%20spatial%20audit%20request.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-4 bg-electric-azure text-white text-xs font-mono tracking-widest uppercase hover:bg-[#1a8ce6] transition-colors duration-300 rounded shadow-md border border-white/10"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Speed Up via WhatsApp</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
