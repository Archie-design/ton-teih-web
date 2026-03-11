# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build (runs type-check + generates static pages)
npm run lint     # ESLint
npm run start    # Start production server (after build)
```

No test suite is configured. Validate changes with `npm run build`.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lucide React icons

**Hosting:** Vercel (frontend) + Google Apps Script (backend API) + Google Sheets (database)

### Data Flow

All data goes through Google Apps Script (GAS) as the sole backend:

```
Browser → /api/submit (Next.js Route) → GAS doPost(e) → Google Sheets
Browser ← /used-equipment (Server Component) ← GAS doGet(e) ← Google Sheets
```

- `lib/api/sheets.ts` — Server-side functions (`"use server"`) that fetch from GAS
- `app/api/submit/route.ts` — Proxies form submissions to GAS (has 10s AbortController timeout)
- `app/api/admin/verify/route.ts` — Server-side admin password verification (reads `ADMIN_PASSWORD` env var)
- `SCRIPT_URL` in `lib/constants.ts` — The single GAS deployment URL used for both GET and POST

### Page Structure

| Route | Type | Notes |
|-------|------|-------|
| `/` | Static | Homepage with product showcase + contact form |
| `/used-equipment` | Dynamic (SSR) | Fetches machine list from GAS on every request (`revalidate: 0`) |
| `/used-equipment/[id]` | Dynamic (SSR) | Single machine detail, `revalidate: 300` |
| `/trade-in` | Static | Trade-in / consignment request form |
| `/admin/upload` | Static (client) | Password-protected admin upload form |
| `/api/submit` | API Route | Accepts all form types; include `type: "seller_request"` for trade-in |
| `/api/admin/verify` | API Route | POST `{ password }` → validates against `ADMIN_PASSWORD` env var |

### Server vs Client Components

Pages are Server Components by default. Client interactivity is isolated to `*Client.tsx` siblings:
- `app/used-equipment/ClientView.tsx` — Filter/sort UI + inquiry modal
- `app/used-equipment/[id]/MachineDetailClient.tsx` — Detail page inquiry modal
- `app/trade-in/TradeInClient.tsx` — Trade-in form
- `lib/hooks/useContactForm.ts` — Shared form submission hook (posts to `/api/submit`)

### Key Files

- `lib/types.ts` — `Machine` and `TradingItem` interfaces
- `lib/constants.ts` — `SCRIPT_URL` (GAS endpoint) and all product data (specs, features)
- `lib/constants-ui.ts` — `CATEGORIES` array used for equipment filter tabs
- `design-system/ton-teih/MASTER.md` — Design system rules (read before building UI)
- `docs/開發需求文檔.md` — Full PRD analysis, system recommendations, and traffic growth strategy

### Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `ADMIN_PASSWORD` | Vercel Environment Variables | Admin login (server-side only) |

### Image Domains

`next/image` remote domains are whitelisted in `next.config.ts`: `images.unsplash.com`, `via.placeholder.com`, `i.meee.com.tw`. Add new domains here when new image sources are used.

## Design Rules (from `design-system/ton-teih/MASTER.md`)

- **Icons:** Lucide React only — no emojis as icons
- **Accent color in use:** Red (`#DC2626` / `red-600`) — the design system specifies blue but the actual implementation uses red throughout
- **All clickable elements** must have `cursor-pointer`
- **Transitions:** 150–300ms on all interactive elements
- **Contrast:** 4.5:1 minimum
- **Responsive breakpoints:** 375px, 768px, 1024px, 1440px
- Page layout: fixed navbar at top requires `pt-20` on page wrappers to avoid content hiding behind it

## Business Context

B2B catalog site for Ton Teih Engineering (東鐵工程有限公司), a Taiwan-based rubber/silicone molding equipment manufacturer. The used equipment section is a "leaded funnel" — buyers of used machines are upsold to new machines. The platform is intentionally a closed B2B proxy (no shopping cart, no direct purchase price displayed on some items, all inquiries routed through Ton Teih sales team).
