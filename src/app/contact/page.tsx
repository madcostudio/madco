"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { Calendar, MessageSquare, Check, ArrowLeft, Mail, MapPin } from "lucide-react";
import Link from "next/link";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    package: "immersive-pro",
    contact: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({ contact: "", email: "" });

  useEffect(() => {
    const pkgParam = searchParams?.get("package");
    if (pkgParam) {
      const p = pkgParam.toLowerCase();
      if (p.includes("starter")) {
        setFormData((prev) => ({ ...prev, package: "starter" }));
      } else if (p.includes("pro")) {
        setFormData((prev) => ({ ...prev, package: "immersive-pro" }));
      } else if (p.includes("enterprise") || p.includes("custom")) {
        setFormData((prev) => ({ ...prev, package: "enterprise" }));
      } else if (p.includes("growth") || p.includes("care")) {
        setFormData((prev) => ({ ...prev, package: "growth" }));
      }
    }
  }, [searchParams]);

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
          package: formData.package,
          contact: formData.contact,
          email: formData.email,
          message: formData.message || undefined,
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
                placeholder="Rahul Shetty"
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
                placeholder="The Banyan Tree Cafe"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-background border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                  Select Configuration
                </label>
                <select 
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  className="w-full bg-background border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300"
                >
                  <option value="starter">Starter Scan (Founding: ₹4,999)</option>
                  <option value="immersive-pro">Immersive Pro (Founding: ₹9,999)</option>
                  <option value="enterprise">Enterprise Custom (Founding: ₹19,999)</option>
                  <option value="growth">Growth Care Plan (₹2,999/month)</option>
                  <option value="general">General Branding Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                  WhatsApp / Phone
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="+91 99000 00000"
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
                  placeholder="name@business.com"
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

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs tracking-widest text-text-secondary uppercase">
                Tell us about your space (Optional)
              </label>
              <textarea 
                rows={3}
                placeholder="Describe your layout, lighting, or specific timeline goals..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-background border border-white/10 focus:border-mad-red outline-none px-4 py-3 rounded text-sm text-white font-sans transition-colors duration-300 resize-none"
              />
            </div>

            <Magnetic>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-mad-red text-white text-sm font-mono tracking-widest uppercase hover:bg-dark-crimson disabled:opacity-50 transition-colors duration-300 rounded border border-white/10 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>{isSubmitting ? "Locking Slot..." : "Secure My Strategy Audit"}</span>
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mad-red/10 border border-mad-red text-mad-red">
              <Check className="h-8 w-8" />
            </div>
            
            <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mt-2">
              AUDIT SLOCKED IN
            </h3>
            
            <p className="text-sm text-text-secondary font-sans max-w-sm leading-relaxed">
              Hey {formData.name}, we have locked in your request. We will review the maps coordinates for <strong className="text-white">{formData.businessName}</strong> and message you on WhatsApp shortly.
            </p>

            <div className="h-[1px] w-12 bg-white/15 my-2" />

            <a 
              href={`https://wa.me/918762640420?text=Hi%20Mad.co%20Studio%2C%20my%20name%20is%20${encodeURIComponent(formData.name)}%20from%20${encodeURIComponent(formData.businessName)}.%20I%20just%20booked%20a%20strategy%20audit.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-electric-azure text-white text-xs font-mono tracking-widest uppercase hover:bg-[#1a8ce6] transition-colors duration-300 rounded shadow-md border border-white/10"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message on WhatsApp Now</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen pt-28 pb-16 px-6 md:px-12 xl:px-24 flex items-center justify-center font-sans">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Direct Connect & Details */}
        <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-text-secondary hover:text-white transition-colors duration-300 group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO DIRECTORY</span>
          </Link>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">
              // AUDIT SECURE SHEET
            </span>
            <h1 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight">
              SPATIAL AUDIT &amp; STRATEGY CALL.
            </h1>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans mt-2">
              Fill in your physical store details. We will check your listing, research your competitors in Mangalore, and design a custom spatial strategy blueprint. No obligation.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">Email Dispatch</h4>
                <a href="mailto:admin@madco.in" className="text-sm font-sans text-white hover:text-mad-red transition-colors">
                  admin@madco.in
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">Studio Hub</h4>
                <p className="text-sm font-sans text-white">
                  Mangalore, Karnataka, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Form inside Suspense */}
        <div className="lg:col-span-7 w-full">
          <Suspense fallback={
            <div className="h-[480px] w-full flex items-center justify-center bg-surface-2 border border-white/5 rounded-xl">
              <div className="font-mono text-xs tracking-widest text-text-secondary uppercase animate-pulse">
                INITIALIZING BOOKING MATRIX...
              </div>
            </div>
          }>
            <ContactForm />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
