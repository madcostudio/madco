export interface PackageInfo {
  key: string;
  name: string;
  priceOriginal: number;
  priceFounding: number;
  points: string;
  stills: string;
  timeline: string;
  optimize: boolean;
  qr: boolean;
  embed: boolean;
  hosted: boolean;
  reel: boolean;
}

export const PKG_MAP: Record<string, PackageInfo> = {
  starter: {
    key: "starter",
    name: "Starter Scan",
    priceOriginal: 9999,
    priceFounding: 4999,
    points: "up to 8",
    stills: "up to 5",
    timeline: "5–7 working days",
    optimize: false,
    qr: false,
    embed: true,
    hosted: false,
    reel: false,
  },
  pro: {
    key: "pro",
    name: "Immersive Pro",
    priceOriginal: 19999,
    priceFounding: 9999,
    points: "up to 20",
    stills: "up to 10",
    timeline: "about 5 working days",
    optimize: true,
    qr: true,
    embed: true,
    hosted: false,
    reel: false,
  },
  signature: {
    key: "signature",
    name: "Signature / Enterprise",
    priceOriginal: 39999,
    priceFounding: 19999,
    points: "unlimited",
    stills: "up to 15",
    timeline: "3–5 working days (priority)",
    optimize: true,
    qr: true,
    embed: true,
    hosted: true,
    reel: true,
  },
  growth_care: {
    key: "growth_care",
    name: "Growth Care Plan",
    priceOriginal: 2999, // recurring per month
    priceFounding: 2999,
    points: "—",
    stills: "—",
    timeline: "ongoing monthly",
    optimize: true,
    qr: false,
    embed: false,
    hosted: false,
    reel: false,
  },
};

export interface ChecklistItem {
  id: string;
  text: string;
  how: string;
}

export interface ChecklistPhase {
  name: string;
  items: ChecklistItem[];
}

const PUBLISH_HOW = `Open https://pano.cool/tools/street-view-publisher and sign in with the company Google account, then click Authorize.

1. Click the upload box and select all the finished 360 JPEGs.
2. If the business is already on Google Maps, assign the photos to that place (search the business name).
3. Each photo appears as a red dot on the map. Drag each red dot to the exact real spot inside the venue.
4. Rotate the blue anchor dot so the photo faces the right direction (check the preview on the left).
5. Multi-floor? Assign floor levels (Ground = 0, First = 1). Single floor = skip.
6. Create connections between photos so visitors can "walk" room to room.
7. Click "Start Upload & Publish" and wait for it to finish.

The connecting arrows take about 4+ days to fully appear on Google Maps — tell the client so they don't worry.`;

const GBP_HOW = `Go to business.google.com and select the client's business (you must be Owner or Manager).
1. Left menu → Photos → 360 photos → Upload 360 photos.
2. Select the equirectangular JPEGs — Google auto-detects the 360 data.
3. Set the best 360 as the "Interior" cover photo. This is what shows on Search and Maps.

No access? The PanoCool publish still attaches imagery to the business on the map. Always get Manager access when you can — it gives the "See Inside" button.`;

export function makeChecklist(packageKey: string): ChecklistPhase[] {
  const p = PKG_MAP[packageKey];
  if (!p) return [];

  // Growth Care Checklist is recurring monthly upkeep, completely custom
  if (packageKey === "growth_care") {
    return [
      {
        name: "Monthly Upkeep Actions",
        items: [
          {
            id: "gc1",
            text: "Log into the client's Google Business Profile",
            how: "Go to business.google.com and authenticate using the client's or MAD.CO's delegate credentials.",
          },
          {
            id: "gc2",
            text: "Post 1–2 fresh photos",
            how: "Add high-quality photos of products, cafe spaces, or updates. Fresh imagery alerts the Google local search algorithm.",
          },
          {
            id: "gc3",
            text: "Update hours / offers / any changes",
            how: "Confirm with the owner if there are public holiday adjustments or temporary menu additions.",
          },
          {
            id: "gc4",
            text: "Confirm the 360 tour is still live and loading",
            how: "Check Google Maps and verify that the virtual tour connects properly without any broken linkages.",
          },
          {
            id: "gc5",
            text: "Refresh keywords / business description",
            how: "Slightly tweak descriptions or update highlights/services tags to reflect season changes.",
          },
          {
            id: "gc6",
            text: "Respond to any new reviews (or flag to client)",
            how: "Reply professionally to positive feedback and forward negative feedback directly to the owner for internal action.",
          },
          {
            id: "gc7",
            text: "Screenshot profile insights (views, calls, directions)",
            how: "Go to Business Profile Performance tab. Export or screenshot the metrics (views, calls, website visits).",
          },
          {
            id: "gc8",
            text: "Send the client a short monthly report",
            how: "Compile insights and updates into a clean WhatsApp template or quick email update to prove ongoing value.",
          },
        ],
      },
    ];
  }

  const phases: ChecklistPhase[] = [];

  // 1. Pre-shoot Phase
  phases.push({
    name: "Pre-shoot",
    items: [
      {
        id: "pre1",
        text: "Confirm client name, business name, phone and address",
        how: "Save it as the job folder name: ClientName_Date. Double-check the phone before leaving — you may need to call on arrival.",
      },
      {
        id: "pre2",
        text: "Confirm one location only is included",
        how: "Extra branches or a second location are an add-on. Quote them separately, don't shoot for free.",
      },
      {
        id: "pre3",
        text: "Confirm the best time to shoot (least crowded)",
        how: "Empty rooms photograph cleaner and faster. Early morning before opening is usually best.",
      },
      {
        id: "pre4",
        text: "Check if a Google Business Profile already exists",
        how: "Search the business name on Google Maps. If a listing exists, you'll attach the tour to it. If not, flag to the owner.",
      },
      {
        id: "pre5",
        text: "Get Business Profile access or a coordination contact",
        how: `To publish the 360 virtual tour directly to the client's listing, ask them to add MAD.CO's Google account as a Manager:

1. CLIENT STEPS:
   - Search the business name on Google Search or Maps (while logged in with their listing owner account).
   - Click the three-dot menu icon (top right of the business edit panel) and select "Business Profile settings".
   - Click "People and access" → select "Add" (+).
   - Enter MAD.CO's email: admin@madco.in and select the "Manager" role, then click "Invite".
   
2. NO ACCESS / DELAY FALLBACK:
   - If they cannot grant access immediately, secure a direct coordination contact (name/phone/email of the manager on-site).
   - You can still publish the tour using PanoCool's Street View Publisher to link to the place ID, but Manager access is highly recommended to set the "Interior" cover photo and display the "See Inside" badge.`,
      },
      ...(p.optimize
        ? [
            {
              id: "pre6",
              text: "Collect category, opening hours, contact and business description",
              how: "You'll need these to fill the profile during optimization. Write them in the job notes.",
            },
          ]
        : []),
      {
        id: "pre7",
        text: "Confirm 50% advance received and booking locked",
        how: "Do not start travel or shooting until the advance is confirmed by the owner.",
      },
      {
        id: "pre8",
        text: `Tell the client delivery = ${p.timeline}`,
        how: "Set the expectation now so there are no angry calls later.",
      },
    ],
  });

  // 2. Shoot Phase
  phases.push({
    name: "Shoot",
    items: [
      {
        id: "sh1",
        text: "Shoot the exterior / front entrance",
        how: "Stand a few steps back so the whole entrance and signboard are visible. This becomes the entry point of the tour.",
      },
      {
        id: "sh2",
        text: `Shoot ${p.points} panorama points`,
        how: "Tripod up, monopod/camera level, and step out of frame (or hide directly under the camera). Shoot in the order a visitor would walk through.",
      },
      {
        id: "sh3",
        text: `Shoot ${p.stills} still photos of key spots`,
        how: 'Capture the spots that make a customer think "I want to go there" — best corners, products, and overall ambience.',
      },
      {
        id: "sh4",
        text: "Make sure the venue is clean and tidy first",
        how: "Remove clutter, bags, and stray people from view. A messy shot means a re-shoot, which costs us money.",
      },
      {
        id: "sh5",
        text: "Re-check every file before leaving the venue",
        how: "Zoom in on each shot for blur or a dirty-lens smudge. A return trip is far more expensive than checking now.",
      },
    ],
  });

  // 3. Post-shoot & Publish Phase
  const postItems: ChecklistItem[] = [
    {
      id: "po1",
      text: "Back up all raw files",
      how: "Copy everything into the ClientName_Date folder on our drive before you touch anything. Never edit the only copy.",
    },
    {
      id: "po2",
      text: `Edit and export ${p.stills} still photos`,
      how: "Light edits only — straighten, brightness, color. Export as high-resolution JPEG.",
    },
    {
      id: "po3",
      text: "Prepare 360s to spec (4K+, 2:1, equirectangular JPEG, metadata kept)",
      how: "Most cameras already export the right 2:1 shape. When you edit, export as JPEG and DON'T strip the metadata, or Google rejects it. If rejected, run it through PanoCool's free fixer.",
    },
    {
      id: "po4",
      text: "Publish the connected walkthrough tour",
      how: PUBLISH_HOW,
    },
    {
      id: "po5",
      text: "Attach the tour to the client's Business Profile",
      how: GBP_HOW,
    },
  ];

  if (p.optimize) {
    postItems.push({
      id: "po6",
      text: "Optimize Business Profile (category, hours, contact, description, photos)",
      how: "In business.google.com, fill every empty field. A complete profile ranks higher and signals trust to Google.",
    });
  }

  postItems.push({
    id: "po7",
    text: "Get the share link and test it on a phone",
    how: "On Google Maps → open the 360 / See Inside image → Share → copy link. OR copy from PanoCool 'Your published photos'. Test on phone AND laptop before sending.",
  });

  if (p.qr) {
    postItems.push({
      id: "po8",
      text: "Generate and test the QR code",
      how: "Paste the final tour link into any free QR generator → download a high-res PNG. Scan it yourself to confirm it opens the tour.",
    });
  }

  if (p.embed) {
    postItems.push({
      id: "po9",
      text: "Prepare the website embed code",
      how: "On Google Maps tour → Share → Embed a map → copy the <iframe> code. If we sold embed setup, place it on the agreed page yourself and confirm it loads.",
    });
  }

  if (p.hosted) {
    postItems.push({
      id: "po10",
      text: "Build the hosted branded tour (Panoee)",
      how: "Upload the 360s to Panoee, connect scenes, add clickable hotspots, add the client/MAD.CO logo, publish. Copy the hosted link + embed + make a QR from it. This is the crisp, branded version Google Maps can't give.",
    });
  }

  if (p.reel) {
    postItems.push({
      id: "po11",
      text: "Create and export 1 short vertical reel",
      how: "15–30 sec walkthrough from the 360s, vertical 9:16, for the client's social. Keep it punchy.",
    });
  }

  postItems.push({
    id: "po12",
    text: "Test every link on mobile and desktop",
    how: "Open each link and QR yourself on two devices. A dead link sent to a client is unacceptable.",
  });

  phases.push({
    name: "Post-shoot & Publish",
    items: postItems,
  });

  // 4. Deliver Phase
  const delItems: ChecklistItem[] = [
    {
      id: "dl1",
      text: "Confirm the 360 tour is published and visible",
      how: "Open the live tour one final time. Remember: connecting arrows can take a few days to show.",
    },
    {
      id: "dl2",
      text: "Business Profile integration completed",
      how: "The 'See Inside' button / Interior cover is set on the listing.",
    },
  ];

  if (p.optimize) {
    delItems.push({
      id: "dl3",
      text: "Profile optimization completed",
      how: "All key fields filled and visuals uploaded.",
    });
  }

  delItems.push(
    {
      id: "dl4",
      text: `${p.stills} edited stills delivered`,
      how: "Send via the agreed drive link or WhatsApp, named clearly.",
    },
    {
      id: "dl5",
      text: "Share link delivered",
      how: "Paste into the delivery message.",
    }
  );

  if (p.qr) {
    delItems.push({
      id: "dl6",
      text: "QR code delivered",
      how: "Attach the high-res PNG.",
    });
  }

  if (p.embed) {
    delItems.push({
      id: "dl7",
      text: "Website embed delivered or instructions provided",
      how: "Either done on their page, or the iframe code + one-line instruction sent.",
    });
  }

  if (p.reel) {
    delItems.push({
      id: "dl8",
      text: "Short reel delivered",
      how: "Send the vertical video file.",
    });
  }

  delItems.push({
    id: "dl9",
    text: "Final handoff message sent with usage instructions",
    how: "Use the delivery template in the Guidebook. Then ask the client to confirm they received everything and to test the link + QR.",
  });

  phases.push({
    name: "Deliver",
    items: delItems,
  });

  return phases;
}

export function allItemIds(packageKey: string): string[] {
  return makeChecklist(packageKey).flatMap((ph) => ph.items.map((i) => i.id));
}

export function progressOf(client: any): { done: number; total: number; pct: number } {
  const ids = allItemIds(client.package);
  const done = ids.filter((id) => client.progress && client.progress[id]).length;
  return {
    done,
    total: ids.length,
    pct: ids.length ? Math.round((done / ids.length) * 100) : 0,
  };
}

export function currentStep(client: any): string {
  const checklist = makeChecklist(client.package);
  for (const ph of checklist) {
    for (const it of ph.items) {
      if (!(client.progress && client.progress[it.id])) {
        return `${ph.name}: ${it.text}`;
      }
    }
  }
  return "All steps complete";
}

// Internal Add-ons
export const ADD_ONS = [
  { name: "Extra panorama point (each)", price: 400 },
  { name: "Extra edited still photo (each)", price: 150 },
  { name: "Short vertical reel (15-30 sec)", price: 1500 },
  { name: "Website embed setup", price: 1000 },
  { name: "Hosted branded tour (Panoee)", price: 3500 },
  { name: "Extra branch / second location", price: "70% of base package" },
  { name: "Rush delivery (within 48 hours)", price: "+30% of package" },
  { name: "Full Google Business Profile optimization", price: 1500 },
  { name: "Re-shoot due to client change", price: "50% of package" },
  { name: "QR code printed/designed poster asset", price: 300 },
];
