# MAD.CO Studio — Crew & Owner Operations Panel

This guide explains how to access, secure, configure, and operate the internal staff dashboard at **madco.in**.

---

## 1. Accessing the Panel

The operations panel is unlinked from search engines, sitemaps, and public marketing menus.

* **Direct Route:** Navigate directly to `https://madco.in/studio` (or `http://localhost:3000/studio` in development).
* **Secret Trigger:** On the public site, scroll down to the footer. Tap/click on the **copyright glyph (`©`)** next to the year. This acts as a hidden link redirecting to the panel login.

---

## 2. Configuration & Environment Variables

Create or update your `.env.local` file (local development) and your **hosting provider dashboard** (Vercel settings in production) with the following environment variables:

```env
# Cryptographic secret used to sign session cookies (Min 32 characters recommended)
SESSION_SECRET="your_secure_random_session_signing_secret_here"

# (Optional) Seed credentials for the initial Owner administrator account
OWNER_USERNAME="owner"
OWNER_PASSWORD="madco@2026"
```

---

## 3. Database Seeding & First Login

1. On first deployment or run, visiting the `/studio` route automatically checks if any administrator accounts exist in the Firestore database.
2. If none are found, it seeds exactly one owner account using the `OWNER_USERNAME` and `OWNER_PASSWORD` defined in your environment variables (defaults to `owner` / `madco@2026`).
3. On first login, the owner is immediately forced to reset this default password before getting panel access.

---

## 4. Operational Workflows

### Owner (Admin Role)
* **Crew Management:** Go to **Crew Logins** tab. Click **Add New Crew**. Enter their name. The system generates a clean, unique username and a readable temporary password (e.g. `sky-view-284`). Copy and hand these credentials over. They will be forced to change their password on first sign in.
* **Suspension:** Click **Active** next to any crew card to toggle them to **Suspended**. This blocks their session instantly.
* **Clients:** Go to **Client Jobs** tab. Click **Add Client Job**. Enter details, select the package, and choose a crew member to assign the job to.
* **Progress:** Open any client card to see their complete checklist state and progress ring.

### Crew (Field Role)
* **My Assigned Jobs:** Crew members only see jobs specifically assigned to them.
* **Technical Details (SOP):** Tap the **ⓘ** symbol next to any checklist step to expand step-by-step instructions (PanoCool uploads, image spec details, GBP settings, etc.) directly in the interface.
* **Pricing & Field SOP:** Read-only reference screens mirroring standard packages, internal add-ons pricing, and field worker rules.
