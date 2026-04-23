# Spare-parts UI redesign — tracked checklist

**Scope:** Visual and UX refresh only (automotive spare-parts aesthetic). Same React app, routes, and backend integration unless explicitly noted.

**API stance:** See [API changes](#api-changes-vs-repurposing-endpoints) — default is **repurpose existing endpoints**; no backend work required for v1.

**Theme mode:** **Light only** — no dark mode toggle. `.dark` CSS removed from `src/index.css`; root never gets `class="dark"`; Sonner uses `theme="light"`. Tailwind keeps `darkMode: ['class']` so any stray `dark:` utilities stay inert.

---

## Design foundation

- [x] **Tailwind theme** — charcoal header (`header`), red CTA (`primary` / legacy `wine`), light page background; see `src/index.css`
- [x] **CSS variables** — spare-parts palette in `src/index.css` (`:root` only)
- [ ] **Typography** — heading/body scale for hero, sections, product titles
- [ ] **Components** — `button`, `card`, `badge`, `input`, `select` variants match new system
- [ ] **Document tokens** — short table in this file or in `tailwind.config.ts` comment block (hex + usage)

## Global chrome

- [x] **Navigation** — header chrome + branding (“Precision Parts Kenya”); category labels still data-driven / legacy paths where applicable
- [x] **Footer** — parts-oriented copy + quick links (featured, offers, brands); header color tokens
- [ ] **Breadcrumbs** — styling on category / product flows

## Mobile & side drawers (retain)

**Decision:** Keep the **sheet / side-drawer** patterns for a highly mobile-optimized experience. The redesign should **restyle** these surfaces, not remove them.

- [ ] **Cart drawer** — `cart-sidebar.tsx` (`Sheet`); full-width on small screens, max width on `sm+`; update colors, typography, spacing to new theme; preserve open/close and line-item interactions
- [ ] **Categories / navigation** — `CategoriesSidebarPermanent`, `Navigation.tsx`; on mobile, keep slide-over or equivalent pattern if present; ensure tap targets ≥ 44px and scroll inside drawer works
- [ ] **Listing filters** — on narrow viewports, prefer **filter in a drawer/sheet** (if not already) so the product grid stays primary; desktop can keep inline sidebar
- [ ] **Z-index & overlap** — floating WhatsApp/call buttons must not cover drawer close controls; test `Sheet` overlay vs `FloatingContactButtons`
- [ ] **Focus trap & ESC** — rely on existing Radix `Sheet` behavior; verify after theme changes

## WhatsApp ordering (must keep)

- [x] **Floating actions** — `FloatingContactButtons.tsx`: call button uses `header`; WhatsApp unchanged; keep `wa.me` behavior
- [ ] **Product cards** — `product-card.tsx` / `ProductGridCardActions.tsx`: keep “Order via WhatsApp” using `buildWhatsAppProductOrderUrl`
- [ ] **Product page** — `Product.tsx`: keep WhatsApp order CTA; **consolidate** hardcoded `254790831798` to `WHATSAPP_ORDER_NUMBER` from `@/lib/whatsapp` (single source of truth)
- [ ] **Optional:** `VITE_WHATSAPP_NUMBER` env + fallback to current number for easier deploys
- [ ] **Message copy** — update `buildWhatsAppProductOrderUrl` / PDP message strings from “drinks” tone to “parts order” tone (still same `Product` fields)

## Pages

- [ ] **Home** — hero (parts imagery + headline); category grid; featured/deals sections; optional **part-finder UI shell** (dropdowns + CTA — visual only or link to search/category)
- [ ] **Category / listing** — sidebar filter layout; sort row; grid cards; promo banner band (optional)
- [ ] **Product detail** — gallery, price, CTAs; “specifications” layout (map existing `description`, tags, `skus`, brand, etc.); **compatibility** block as placeholder or disabled until API exists
- [ ] **Cart** — line items + summary sidebar + checkout CTA styling
- [ ] **Checkout** — same flow; themed forms and buttons
- [ ] **Account / orders / contact / offers / featured / brands / origin** — theme pass; copy where drink-specific

## Polish

- [ ] **Loaders & skeletons** — match dark/light sections
- [ ] **Age verification** — remove or replace if inappropriate for parts (product flag `requiresAgeVerification` may still exist; decide UX)
- [ ] **DevTools / PerformanceMonitor** — non-intrusive in dev; no layout clash with new floating buttons
- [ ] **Accessibility** — contrast on red CTAs; focus states; `aria-label`s on icon-only buttons

## Done criteria

- [ ] Main paths (home → category → product → cart → checkout) work without console errors
- [ ] WhatsApp opens with correct prefilled message and number
- [ ] No accidental removal of API calls or route definitions

---

## API changes vs repurposing endpoints

### Default (v1 UI redesign): **no API changes**

You can **repurpose** what you already expose:

| Existing concept | Spare-parts UI mapping |
|------------------|------------------------|
| `Category` | Part category (e.g. Brakes, Engine) |
| `SubCategory` | Sub-type under category |
| `Product` | Part listing (name, description, image, price, brand, tags…) |
| `ProductSKU` | Part number / variant + price |
| `search`, `getProductsByCategory`, featured, new-arrivals | Same endpoints; different labels and layout |
| Orders + `user-id` header | Unchanged if checkout stays as-is |

The frontend only changes **labels, grouping, and layout** — the JSON shape stays the same.

### When you *would* extend the API (later phases)

Add or change backends only if you need **real** behavior beyond cosmetics:

- **Vehicle fitment** (year/make/model/engine) — new tables + endpoints or query params; filter products by compatibility
- **OEM / cross-reference numbers** — new fields or related entities
- **Fitment “check” on PDP** — endpoint that accepts vehicle id + product id and returns boolean
- **Industrial facets** — dedicated filter endpoints if you outgrow client-side filtering on full product lists

Until those exist, the **part finder** on the home page should stay a **visual shell**, link to search/category, or clearly say “coming soon” — avoid implying guaranteed fitment.

---

## Reference files (WhatsApp & API)

- `src/lib/whatsapp.ts` — `WHATSAPP_ORDER_NUMBER`, `buildWhatsAppProductOrderUrl`
- `src/components/FloatingContactButtons.tsx`
- `src/services/api.ts` — all current REST paths
- `src/hooks/useApi.ts` — React Query keys

---

## Changelog

| Date | Note |
|------|------|
| 2026-04-13 | Initial checklist |
