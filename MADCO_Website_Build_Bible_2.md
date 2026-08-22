# MAD.Co — MASTER WEBSITE BUILD BIBLE
### The single source of truth for building madco.in
*Feed this whole document to Antigravity. Everything it needs is here.*

---

## 0. HOW TO USE THIS BRIEF (read first)

You are the design + build lead for **MAD.Co**, an elite creative & spatial-marketing studio from Mangalore, India. This brief is the complete specification. Build a **Next.js / React** site (evolve the existing madco.in codebase, don't start from zero). Follow the brand system, art direction, and page specs exactly. Where a number or name is marked **[CONFIRM]**, treat it as the default but flag it for the owner.

The one rule above all others: **this site must not look like a generic AI-generated dark template.** Read Section 3 (Art Direction) carefully — the anti-generic guardrails are non-negotiable.

---

## 1. THE MISSION

**What MAD.Co is:** a creative studio that makes brands *impossible to ignore* — starting with immersive 360° spatial experiences and expanding into web, physical-digital "tap" technology, and automation.

**The one-liner (hero):** WE MAKE BRANDS IMPOSSIBLE TO IGNORE.

**The promise:** We don't sell services. We sell attention, trust, and walk-ins.

**The feeling a visitor must have by the end:** *"These people operate on a different level. I need them on my side."* Every section should push the visitor one notch closer to that conviction.

**Positioning discipline:** 360°/spatial is the **spearhead** — the thing almost no one local has. Lead with it. Everything else (web, tap, automation) is how we *grow* a client after we've won them with the wedge.

---

## 2. BRAND SYSTEM

**Colours (exact hex — use these as CSS variables, no substitutes):**
- `--mad-black: #050508` — primary canvas (near-black, not pure black)
- `--mad-white: #FFFFFF` — primary type on dark
- `--mad-red: #F5250F` — MAD Red. The ONLY warm accent. Used with discipline — it is the record button, the dot, the moment of action.
- `--mad-azure: #1B6EF3` — Electric Azure. Secondary accent, used for "spatial/tech" contexts (360°, data, tour UI).
- Support greys derived from black for surfaces/dividers (e.g. `#0E0E12`, `#1A1A20`, `#8A8A92`).

**The dot motif (the signature):** MAD.Co's identity is the **red record-button dot** — it is the "." in MAD.Co and the REC button of a camera. Use it as a recurring interactive element: section markers, the "live" indicator on 360° embeds, hover states, the cursor, list bullets. It should feel *alive* — a subtle pulse (respecting `prefers-reduced-motion`).

**Typography:**
- **Display face:** a heavyweight *condensed* sans in the spirit of Druk Wide / Compacta Black — massive, tightly kerned, all-caps, used for headlines only. This carries the whole personality. (If licensing is a constraint, closest free/near equivalents: *Anton*, *Archivo Black*, or *Bebas Neue* heavily tracked — [CONFIRM] final face.)
- **Body face:** a clean, neutral grotesk — *Inter*, *Geist*, or *Neue Haas* style. Quiet, legible, gets out of the way.
- **Utility/label face:** a mono or tracked-out uppercase grotesk for eyebrows, captions, and data (e.g. `// SERVICE 01`, coordinates, timestamps).
- **Type scale:** dramatic. Hero headlines should be enormous (clamp up to ~12vw on desktop). Body stays calm at 16–18px. The *contrast* between giant display and quiet body is the whole look.

**Logo usage:**
- Full wordmark **MAD.Co** (with red dot) in the header and footer.
- The **"MAD." sheared icon** as the favicon / tiny mark.
- Always show the real domain **madco.in** in the footer and anywhere a stranger needs the address.

**Voice:** confident, direct, a little arrogant, never corporate. Short sentences. Active verbs. We make claims and back them. We don't beg. (See Section 11 for the headline bank.)

---

## 3. ART DIRECTION & ANTI-GENERIC GUARDRAILS

**The vibe:** cinematic, kinetic, premium, "alive." Think A24 title cards meets a Nike product launch meets a spatial-tech demo. Near-black canvas, colossal condensed type, one decisive red accent, and *real interactivity* (live 360° you can drag).

**⚠️ The trap to avoid:** "near-black background + one bright accent" is also the most common *generic AI website look*. We are deliberately using it because red-on-black IS the brand — so we must earn it with distinctive **signature elements** that a template would never have:

1. **A live, draggable 360° moment in the hero** — not a static image. The most characteristic thing in our world, on screen, immediately, interactive.
2. **The record-dot as a live, recurring interactive motif** (pulsing REC indicator, custom cursor, section markers).
3. **Sheared / kinetic typography reveals** — headlines that slice or shift on scroll, echoing the logo's diagonal cut. One orchestrated move, not scattered effects.
4. **Texture on the black** — the faintest film grain / screen-print noise so it never reads as flat digital black.

**Motion rules:**
- One orchestrated **page-load reveal** on the hero (type assembles, dot lands, 360° activates).
- **Scroll-triggered reveals** for each section — deliberate, not confetti.
- **Hover micro-interactions** on every interactive element (the dot reacts).
- Respect `prefers-reduced-motion` everywhere. Never animate for the sake of it — restraint reads as premium; over-animation reads as AI-generated.

**Quality floor (build to this silently):** fully responsive to mobile, visible keyboard focus states, semantic HTML, fast (target sub-second LCP, lazy-load 360° assets), accessible contrast.

---

## 4. TECH & CONSTRAINTS

- **Stack:** Next.js (App Router) + React, TypeScript, Tailwind. Evolve existing madco.in.
- **360° embeds:** use the existing tour player; lazy-load, poster-image first, activate on interaction.
- **Performance is a brand value** ("speed is trust"). Optimize images (next/image), code-split, defer non-critical JS.
- **Forms:** connect to existing contact/lead flow; every form also offers a WhatsApp fast-lane (`wa.me/918762640420`).
- **CMS-ready** for the Work/Showcase and (later) blog, so the owner can add tours without a deploy.

---

## 5. GLOBAL INTERACTION LANGUAGE

- **Header:** minimal, sticky, transparent-to-solid on scroll. Left: MAD.Co wordmark. Center/right: 360 Tours · Work · Services · Process · Studio. Persistent **Book Call** button (red).
- **Custom cursor:** small ring that becomes the red dot on interactive elements. (Desktop only; disable on touch.)
- **Persistent WhatsApp fast-lane** button, bottom-right, on all pages.
- **Section eyebrows:** tracked-out mono labels (`// 360° TOURS`, `// MAD TAP`) — but only where they encode real structure, never as decoration.

---

## 6. SITEMAP

1. **Home** — the full story in one scroll.
2. **360° Tours** — the flagship service + tour pricing.
3. **Web Design** — new service + web pricing ladder (the decoy lives here).
4. **MAD Tap** — new QR + NFC product line.
5. **Software & Automation** — new service, consultation-based.
6. **Social Media Management** — Coming Soon + waitlist.
7. **Work / Showcase** — the proof (live 360° tours, case results).
8. **Process** — the 4-phase system.
9. **Studio / About** — who we are, the MAD.Co ethos.
10. **Contact / Book** — the conversion page.

---

## 7. PAGE-BY-PAGE SPECS

### 7.1 HOME
The hero is a thesis. Open with the most characteristic thing we do.

- **Hero:** full-viewport near-black. A **live, draggable 360° tour** fills the frame (poster first, "click & drag to explore" cue, pulsing red REC dot top-corner = "live"). Over it, the colossal headline assembles on load: **WE MAKE BRANDS IMPOSSIBLE TO IGNORE.** Sub: *We don't sell 360° photography. We sell attention. We sell walk-ins.* Two CTAs: **Book Strategy Call** (red) · **WhatsApp Quick Connect** (ghost).
- **Trust strip:** thin bar — "Making spaces impossible to ignore since 2026 · Mangalore, India" + 3 micro-stats (Google Maps sync · Mobile gyro · Verified HDR).
- **Core Competencies:** 5 service cards, each a doorway to its page — 360° Tours, Web Design, MAD Tap, Software & Automation, Social (Coming Soon, marked). Numbered `01–05` (real sequence = allowed). Each card: eyebrow, bold title, one-line promise, hover reveal, "Explore →".
- **Conversion Science block:** the before/after Google-Business slider already on the site (keep it — it's strong). Headline: **WE CONVERT VIEWS INTO VISITORS.**
- **Work teaser:** 3 live tours (Cafe Esthétique, Iron Forge Gym, Aura Dining) → link to Work.
- **Process teaser:** the 4 phases, condensed → link to Process.
- **Final CTA band:** **LET'S SCALE YOUR ATTENTION.** — spatial-audit offer + WhatsApp + form.

### 7.2 360° TOURS (flagship)
- Hero: **PHYSICAL EXPERIENCES, DIGITALLY STAGED.** with a live tour.
- Why-it-works block (trust, expectation, pre-verification of quality).
- **Pricing: the 3 tour tiers** (Section 8.A) with the founding-rate anchors + "X of 10 founding slots left" scarcity.
- The Growth Care recurring plan, positioned as "keep your space selling itself."
- FAQ accordion (scan time, no need to close business, Maps integration, hosting).

### 7.3 WEB DESIGN (new)
- Hero: **SPEED IS TRUST. WEBSITES THAT CONVERT.** Sub: ultra-fast React/Next.js sites engineered for premium local spaces.
- Proof: performance-first pitch, 360°-embed-ready, SEO + booking flows.
- **Pricing: the 4-rung web ladder** (Section 8.B) — Launchpad ₹19,999 (decoy) / **Launch ₹29,999 ⭐** / Growth ₹59,999 / Custom (Let's talk). All three visible prices side by side so the decoy works.

### 7.4 MAD TAP (new — QR + NFC product line)
- Hero: **TAP. AND IT HAPPENS.** Sub: *Turn every table, seat, and counter into a moment of action.* Physical NFC + QR points that trigger the thing you want your customer to do — order, review, explore.
- **The three plays** (cards):
  - **Tap-to-Review** — branded NFC/QR stands that send a customer straight to your Google review in one tap. (Local SEO gold. The easiest win — lead pitches here.)
  - **Tap-to-Menu** — instant digital menu, no app, no fumbling.
  - **Tap-to-Order** ⭐ — order from your seat. *Hero story:* cinema seat-back NFC — tap your phone, order snacks mid-movie, no flashlight, no queue, no missed scene. (We build the tech layer: tap → menu → order → pay → notify staff. The venue fulfils.)
- **Also for:** restaurants, salons, showrooms, any shop that wants reviews or orders.
- The NFC advantage callout: *"No flashlight. No squinting. Just tap."*
- **Pricing** (Section 8.C): Review Booster from ₹4,999 · Tap Menu/Order from ₹9,999 setup · Theater/Enterprise (bulk) → Let's talk. Note hardware billed at cost.

### 7.5 SOFTWARE & AUTOMATION (new)
- Hero: **WE BUILD THE MACHINE THAT RUNS WHILE YOU SLEEP.** Sub: custom automations, booking systems, dashboards, internal tools.
- Examples: WhatsApp automation, reservation/CRM systems, review-request flows, admin dashboards.
- **Pricing:** *from ₹24,999 — consultation-based.* Single CTA: **Book a build consult.** (Do NOT list fixed tiers — scope varies; sell the conversation.)

### 7.6 SOCIAL MEDIA MANAGEMENT (Coming Soon)
- A deliberately sparse, intriguing page. **COMING SOON.** One line on what's coming. **Join the waitlist** email capture (this collects leads — make it work, not decorative). A subtle "you'll be first when we open the doors."

### 7.7 WORK / SHOWCASE
- Grid of live 360° tours (draggable thumbnails), each with venue name, category, and a one-line result. CMS-driven so the owner adds new tours easily. This page is the proof — make the tours the hero, chrome minimal.

### 7.8 PROCESS
- The 4-phase system (already written, keep the substance): **01 Spatial Audit & Design · 02 Cinematic HDR Scan · 03 Interactive Enrichment · 04 Maps Sync & Web Presence.** Numbered markers are correct here (real sequence). Make it feel like a directive/mission, cinematic.

### 7.9 STUDIO / ABOUT
- The ethos. Short, bold, no corporate fluff. "We work exclusively with experience-first businesses." The MAD = *Make A Difference* origin. Mangalore → Everywhere. Founders (optional). Keep it confident and human.

### 7.10 CONTACT / BOOK
- The spatial-audit offer as the hook: **BOOK A 15-MINUTE SPATIAL AUDIT.** Form (name, business, category, WhatsApp, email) + WhatsApp fast-lane + email. Reassure: free, no obligation, we analyze your Google Maps performance live.

---

## 8. PRICING ARCHITECTURE
*All prices show a struck-through **regular/anchor** price with the **founding rate** below it, plus scarcity ("first 10 Mangalore venues" / "X slots left"). Anchor + founding + decoy = the full psychological stack. All rupee figures are recommended defaults — **[CONFIRM] with owner**.*

### 8.A — 360° Tours
| Tier | Anchor | Founding | For | Key lines |
|---|---|---|---|---|
| **Starter Scan** | ~~₹24,999~~ | **₹9,999** | Boutiques, salons, small cafes | Full coverage up to ~1,500 sq ft (up to 10 points; +₹750/extra point), HDR capture, grading, Google Maps Street View, website embed, 2-yr hosting |
| **Immersive Pro ⭐** | ~~₹39,999~~ | **₹19,999** | Restaurants, gyms, clinics, showrooms | Up to ~4,000 sq ft (up to 18 points), bespoke grading, Street View verified, interactive player UI, 5 hotspots, 3-yr hosting |
| **Signature / Enterprise** | ~~₹69,999~~ | **₹39,999** | Hotels, luxury, multi-location | Unlimited points, 3D walkthrough, custom UI, advanced hotspots, Maps optimization, custom landing page, 5-yr support |
| **Growth Care** | — | **₹2,999/mo** | All | Monthly Google Business + tour upkeep, fresh photos, keyword optimization |

*Replace the confusing dual "₹9,999 / ₹4,999 Setup" display with this single anchor→founding format.*

### 8.B — Web Design (the decoy ladder)
| Tier | Anchor | Founding | What |
|---|---|---|---|
| **Launchpad** *(entry + decoy)* | ~~₹34,999~~ | **₹19,999** | One high-converting landing page, template-driven, mobile, basic SEO, WhatsApp |
| **Launch ⭐ MOST POPULAR** | ~~₹49,999~~ | **₹29,999** | Up to 5 custom pages, animations, full SEO, booking/WhatsApp, 360°-embed-ready |
| **Growth** *(anchor)* | ~~₹99,999~~ | **₹59,999** | 10+ pages, CMS, custom interactions, integrations, priority support |
| **Custom / Web App** | — | **Let's talk** | Gated — quote per client |

*Show the first three side by side. Launch must be visually elevated (⭐ badge, subtle red glow, "most popular"). The ₹10k gap from Launchpad→Launch must buy visibly more.*

### 8.C — MAD Tap (QR + NFC)
| Play | From | What |
|---|---|---|
| **Review Booster** | **₹4,999** | Branded NFC/QR review stands → one-tap Google reviews (hardware at cost) |
| **Tap Menu / Order** | **₹9,999 setup** | Digital menu / order-to-seat system + per-point hardware |
| **Theater / Enterprise** | **Let's talk** | Bulk seat-back NFC, custom order system |

### 8.D — Software & Automation
- **From ₹24,999 — consultation-based.** No fixed tiers. CTA: Book a build consult.

### 8.E — Social Media Management
- **Coming Soon** — waitlist only. (Future retainers ~₹19,999–49,999/mo when live.)

---

## 9. CONVERSION MECHANICS

- Every page ends with a CTA band. Never leave a dead end.
- Persistent **Book Call** (header) + **WhatsApp fast-lane** (floating).
- **Scarcity** on founding rates ("3 of 10 slots left") — real, updated by owner.
- **Anchor pricing** everywhere (struck-through regular price).
- **Waitlist capture** on Social (Coming Soon) so it earns leads.
- **Free spatial audit** as the low-friction top-of-funnel offer.
- Lead category selector (Cafe/Restaurant/Gym/Salon/Clinic/Showroom) so pitches self-segment.

---

## 10. SEO & META

- Local-first keywords: virtual tours Mangalore, 360 photography India, Google Business optimization Mangalore, restaurant/cafe marketing, NFC ordering, QR menu, website design Mangalore.
- Unique `<title>` + meta description per page (not the same string everywhere — the current site repeats one meta block; fix that).
- Open Graph + Twitter cards per page with a strong share image.
- Schema.org LocalBusiness + Service markup.
- Sitemap + robots. Fast Core Web Vitals (perf = ranking + brand).

---

## 11. COPY VOICE & HEADLINE BANK
*Use these; write more in the same register. Short. Confident. Active.*

- WE MAKE BRANDS IMPOSSIBLE TO IGNORE.
- WE DON'T MARKET. WE MAKE A DIFFERENCE.
- WE SELL ATTENTION, TRUST, AND WALK-INS.
- MOST SHOW YOU A PHOTO. WE LET YOU WALK IN.
- SPEED IS TRUST.
- TAP. AND IT HAPPENS.
- NO FLASHLIGHT. NO QUEUE. JUST TAP.
- YOUR SPACE, SELLING ITSELF — EVERY HOUR.
- WE CONVERT VIEWS INTO VISITORS.
- IF "GOOD ENOUGH" IS ENOUGH FOR YOU, WE'RE NOT FOR YOU.
- WHERE IDEAS GO MAD & BRANDS GO BIG.

*Empty states and errors speak in the brand voice — direct, no apologies, always a next step.*

---

## 12. BUILD ORDER (recommended)

1. Design system + global shell (tokens, type, header/footer, cursor, motion primitives, WhatsApp lane).
2. Home (hero 360° + all teasers) — the make-or-break page.
3. 360° Tours page + pricing.
4. Web Design page + the decoy ladder.
5. MAD Tap page.
6. Software & Automation + Social (Coming Soon).
7. Work/Showcase (CMS) + Process + Studio.
8. Contact/Book + forms + SEO pass + performance pass + accessibility pass.

---

## 13. DECISIONS FOR ROMEO TO CONFIRM
- [ ] Final display typeface (licensed Druk/Compacta vs free Anton/Archivo Black).
- [ ] All rupee figures in Section 8 (anchors + founding).
- [ ] Product name "MAD Tap" — keep or rename.
- [ ] Which 3 live tours headline the Work page.
- [ ] Whether to buy `mad.co` and redirect to `madco.in` (separate task).

---
*MAD.Co — Make A Difference. Different Wins.*
