export const config = {
  FOUNDING_SLOTS_LEFT: 7,
  WHATSAPP_NUMBER: "918762640420",
  WHATSAPP_URL: "https://wa.me/918762640420",
  EMAIL: "admin@madco.in",
  DOMAIN: "madco.in",

  pricing: {
    // Section 8.A — 360° Tours
    tours: {
      starterScan: {
        anchor: 24999,
        founding: 9999,
        label: "Starter Scan",
        target: "Boutiques, salons, small cafes",
      },
      immersivePro: {
        anchor: 39999,
        founding: 19999,
        label: "Immersive Pro",
        target: "Restaurants, gyms, clinics, showrooms",
      },
      signature: {
        anchor: 69999,
        founding: 39999,
        label: "Signature / Enterprise",
        target: "Hotels, luxury, multi-location",
      },
      growthCare: {
        monthly: 2999,
        label: "Growth Care",
      },
    },

    // Section 8.B — Web Design (the decoy ladder)
    web: {
      launchpad: {
        anchor: 34999,
        founding: 19999,
        label: "Launchpad",
        tag: "Entry + Decoy",
      },
      launch: {
        anchor: 49999,
        founding: 29999,
        label: "Launch",
        tag: "Most Popular",
        featured: true,
      },
      growth: {
        anchor: 99999,
        founding: 59999,
        label: "Growth",
        tag: "Anchor",
      },
      custom: {
        label: "Custom / Web App",
        tag: "Let's talk",
      },
    },

    // Section 8.C — MAD Tap (QR + NFC)
    tap: {
      reviewBooster: {
        from: 4999,
        label: "Review Booster",
      },
      tapMenuOrder: {
        from: 9999,
        label: "Tap Menu / Order",
      },
      enterprise: {
        label: "Theater / Enterprise",
        tag: "Let's talk",
      },
    },

    // Section 8.D — Software & Automation
    software: {
      from: 24999,
      label: "Consultation-based",
    },
  },
};
