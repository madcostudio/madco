/**
 * Single source of truth for site navigation.
 *
 * Previously the desktop header and the mobile menu each kept their own
 * hard-coded list, and they had drifted apart: desktop showed
 * "360 Tours / Work / Services / Process / Studio" while mobile showed a
 * different set of eight links. A visitor got a different map of the site
 * depending on the device they were holding.
 *
 * Both now render from this file, so they cannot disagree again.
 */

export interface NavItem {
  href: string;
  label: string;
  /** One line explaining what this is, shown in menus to aid orientation. */
  blurb?: string;
  badge?: string;
}

/** What we sell. The primary reason someone visits. */
export const SERVICE_NAV: NavItem[] = [
  {
    href: "/tours",
    label: "360° Tours",
    blurb: "Let customers walk in before they walk in",
  },
  {
    href: "/web-design",
    label: "Web Design",
    blurb: "Fast sites that turn browsers into buyers",
  },
  {
    href: "/mad-tap",
    label: "MAD Tap",
    blurb: "NFC and QR that trigger action on the spot",
  },
  {
    href: "/software",
    label: "Automation",
    blurb: "Bookings, billing and follow-ups on autopilot",
  },
  {
    href: "/social",
    label: "Social",
    blurb: "Content and campaigns that stop the scroll",
    badge: "Soon",
  },
];

/** Who we are. Secondary, for people still deciding. */
export const COMPANY_NAV: NavItem[] = [
  { href: "/work", label: "Work", blurb: "Spaces we've made impossible to ignore" },
  { href: "/process", label: "Process", blurb: "How a project actually runs" },
  { href: "/about", label: "Studio", blurb: "The team behind MAD.Co" },
];

/** The single action we want every visitor to take. */
export const PRIMARY_CTA = {
  href: "/contact",
  label: "Book a Free Audit",
} as const;
