"use client";

import React from "react";

/**
 * Bespoke artwork for the service cards.
 *
 * These replaced five Unsplash stock photographs. Stock imagery is the
 * strongest "template" signal a site can carry, and it reads especially
 * badly on a studio that sells visual craft — the pictures were generic
 * while the claim was that we are not.
 *
 * Each mark is drawn in code, so it is sharp at any density, costs no
 * network request, inherits the brand palette exactly, and is unique to
 * this site. They share one system — dark ground, fine grid, a single
 * accent, one geometric idea — so the row reads as a set rather than
 * five unrelated pictures.
 *
 * Purely decorative, so each is aria-hidden.
 */

export type GlyphVariant = "tours" | "web" | "tap" | "automation" | "social";

const RED = "#F5250F";
const AZURE = "#1B6EF3";
const GOLD = "#E8A537";

const ACCENT: Record<GlyphVariant, string> = {
  tours: RED,
  web: AZURE,
  tap: RED,
  automation: AZURE,
  social: GOLD,
};

function Grid({ accent }: { accent: string }) {
  return (
    <>
      <defs>
        <pattern id={`g-${accent}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
        <radialGradient id={`glow-${accent}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.34" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#0C0C12" />
      <rect width="400" height="300" fill={`url(#g-${accent})`} />
      <rect width="400" height="300" fill={`url(#glow-${accent})`} />
    </>
  );
}

export function ServiceGlyph({
  variant,
  className = "",
}: {
  variant: GlyphVariant;
  className?: string;
}) {
  const accent = ACCENT[variant];

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <Grid accent={accent} />

      {/* ── 360° Tours: a space you can orbit, with inspection points ── */}
      {variant === "tours" && (
        <g>
          <ellipse cx="200" cy="150" rx="118" ry="118" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
          <ellipse cx="200" cy="150" rx="118" ry="42" fill="none" stroke={accent} strokeOpacity="0.85" strokeWidth="2" />
          <ellipse cx="200" cy="150" rx="78" ry="118" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.5" />
          <ellipse cx="200" cy="150" rx="34" ry="118" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.5" />
          <path d="M82 150a118 42 0 0 0 236 0" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 7" />
          {[
            [262, 124],
            [152, 178],
            [214, 96],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="13" fill={accent} fillOpacity="0.16" />
              <circle cx={x} cy={y} r="5" fill={accent} />
            </g>
          ))}
        </g>
      )}

      {/* ── Web Design: viewports stacking, moving fast ── */}
      {variant === "web" && (
        <g>
          {[0, 1, 2].map((i) => {
            const o = i * 16;
            return (
              <g key={i} opacity={1 - i * 0.3}>
                <rect x={96 + o} y={72 + o} width="190" height="124" rx="9" fill="#13131B" stroke={i === 0 ? accent : "rgba(255,255,255,0.22)"} strokeWidth={i === 0 ? 2 : 1.25} />
                <line x1={96 + o} y1={92 + o} x2={286 + o} y2={92 + o} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                {[0, 1, 2].map((d) => (
                  <circle key={d} cx={108 + o + d * 11} cy={82 + o} r="2.6" fill="rgba(255,255,255,0.4)" />
                ))}
              </g>
            );
          })}
          <rect x="110" y="108" width="86" height="8" rx="4" fill={accent} fillOpacity="0.85" />
          <rect x="110" y="126" width="140" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
          <rect x="110" y="140" width="112" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
          {[44, 60, 76].map((y, i) => (
            <line key={i} x1={16} y1={y + 130} x2={70 - i * 14} y2={y + 130} stroke={accent} strokeOpacity={0.6 - i * 0.15} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
      )}

      {/* ── MAD Tap: contact, and the signal it sends ── */}
      {variant === "tap" && (
        <g>
          <rect x="74" y="104" width="150" height="96" rx="12" fill="#14141C" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" transform="rotate(-11 149 152)" />
          <rect x="92" y="128" width="54" height="7" rx="3.5" fill={accent} transform="rotate(-11 149 152)" />
          <rect x="92" y="145" width="90" height="5" rx="2.5" fill="rgba(255,255,255,0.26)" transform="rotate(-11 149 152)" />
          {[30, 52, 74, 96].map((r, i) => (
            <path
              key={i}
              d={`M236 ${150 - r} a ${r} ${r} 0 0 1 0 ${r * 2}`}
              fill="none"
              stroke={accent}
              strokeOpacity={0.9 - i * 0.2}
              strokeWidth={2.5 - i * 0.35}
              strokeLinecap="round"
            />
          ))}
          <circle cx="236" cy="150" r="7" fill={accent} />
        </g>
      )}

      {/* ── Automation: work moving through a system by itself ── */}
      {variant === "automation" && (
        <g>
          <path d="M70 212 C 130 212, 118 150, 176 150 S 248 92, 330 92" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="5 6" />
          <path d="M70 212 C 130 212, 118 150, 176 150" fill="none" stroke={accent} strokeWidth="2.5" />
          {[
            [70, 212, 9],
            [176, 150, 11],
            [330, 92, 9],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={Number(r) + 9} fill={accent} fillOpacity={i === 1 ? 0.14 : 0.07} />
              <circle cx={x} cy={y} r={r} fill="#0C0C12" stroke={accent} strokeWidth="2" />
            </g>
          ))}
          {[
            [250, 196],
            [286, 214],
            [250, 232],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="52" height="9" rx="4.5" fill="rgba(255,255,255,0.16)" />
          ))}
          <rect x="250" y="196" width="34" height="9" rx="4.5" fill={accent} fillOpacity="0.8" />
          <path d="M106 86 l9 9 -9 9" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M126 86 l9 9 -9 9" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── Social: a feed, and attention climbing ── */}
      {variant === "social" && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} opacity={1 - i * 0.28}>
              <rect x={68} y={74 + i * 56} width="150" height="44" rx="9" fill="#14141C" stroke="rgba(255,255,255,0.16)" strokeWidth="1.25" />
              <circle cx={92} cy={96 + i * 56} r="11" fill="rgba(255,255,255,0.14)" />
              <rect x={112} y={88 + i * 56} width="74" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
              <rect x={112} y={100 + i * 56} width="48" height="5" rx="2.5" fill="rgba(255,255,255,0.16)" />
            </g>
          ))}
          {[42, 68, 96, 128].map((h, i) => (
            <rect key={i} x={252 + i * 26} y={214 - h} width="16" height={h} rx="5" fill={accent} fillOpacity={0.3 + i * 0.2} />
          ))}
          <path d="M252 150 l26 -24 l26 -18 l26 -26" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="330" cy="82" r="5.5" fill={accent} />
        </g>
      )}
    </svg>
  );
}
