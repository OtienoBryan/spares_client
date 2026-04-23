## Key review findings first

- **Domain coupling is still mixed:** many pages still assume drink/alcohol semantics (`alcoholContent`, “wine/beer/spirits”, “popular wines”), so spare-parts UX is only partially migrated.
- **Home is too large (`Home.tsx` ~1600 lines):** high regression risk and hard to maintain; should be split into section components.
- **Payload-shape fragility exists:** pages handle `product.category` as both object and string; this increases runtime edge cases.
- **Auth/account is mock-heavy:** `UserContext` login/register is simulated while orders are real API calls; this is inconsistent behavior.
- **API debugging noise is high:** `api.ts` and contexts log heavily, which obscures real errors in dev and may leak details.

---

## API payload vs UI dependency map (page-by-page)

### `/` Home
- **API payload dependent**
  - `GET /categories` (tile/category display, shop-by-parts DB-driven ordering fields)
  - `GET /products/featured`
  - `GET /products`
  - `GET /products/popular-wines` (legacy endpoint)
  - `GET /products/search?q=...`
  - Product fields: `name`, `image`, `price`, `originalPrice`, `skus`, `brand`, `stock`, `category`, `isOnOffer` (dynamic)
- **UI-design dependent**
  - Hero layout, overlay part finder, shop-by-parts tile visual style
  - Section naming/copy, banners, card styling, spacing, motion

### `/category/:category` Category
- **API payload dependent**
  - `GET /categories`
  - `GET /subcategories` (route param can map to subcategory)
  - `GET /products/category/:id` (preferred)
  - Fallback via category name lookup
  - Uses category/subcategory IDs and product price/stock/rating/SKU-ish fields
- **UI-design dependent**
  - Filter panel UX, cards, breadcrumbs, labels, sort UI, pagination visuals

### `/product/:slug` Product detail
- **API payload dependent**
  - `GET /products` + slug mapping to product ID (via hook logic)
  - `GET /products/:id`
  - `GET /products/category/:categoryId` for related items
  - Product gallery, SKU pricing, stock, brand, description, tags, ratings
- **UI-design dependent**
  - PDP information architecture (spec blocks, fitment placeholder, CTA hierarchy)
  - Gallery layout, sticky buy box behavior, trust blocks

### `/offers`
- **API payload dependent**
  - `GET /products`
  - Depends on `isOnOffer` convention (`1 | "1" | true`)
- **UI-design dependent**
  - Offer badges, promo card design, section copy

### `/featured`
- **API payload dependent**
  - `GET /products/featured`
- **UI-design dependent**
  - Featured hero/filter chips/card treatments

### `/brands` and `/brands/:brandName`
- **API payload dependent**
  - `GET /products`
  - Uses `brand` to build index and filtered views
- **UI-design dependent**
  - Brand list UX, search/filter presentation

### `/origin` and `/origin/:country`
- **API payload dependent**
  - `GET /products`
  - Uses `origin` values
- **UI-design dependent**
  - Origin directory UI and empty/error states

### `/cart`
- **API payload dependent**
  - No fetch; depends on cart item structure created from product payload (`price`, `skus`, `stock`, `image`, etc.)
- **UI-design dependent**
  - Drawer/cart page layout, quantity controls, summary panel

### `/checkout`
- **API payload dependent**
  - Mutation: `POST /orders` (plus `user-id` header)
  - Requires order payload contract (`items`, totals, addresses, payment method)
- **UI-design dependent**
  - Form layout, validation feedback styling, payment method UX

### `/orders`
- **API payload dependent**
  - `GET /orders/my-orders` (with `user-id` header)
- **UI-design dependent**
  - Table/list design, status chips, search/filter visuals

### `/account`
- **API payload dependent**
  - Indirectly depends on orders loaded in `UserContext`; profile is local/mock
- **UI-design dependent**
  - Tabs/profile forms/rewards styling

### `/contact`
- **API payload dependent**
  - None currently (local form handling only)
- **UI-design dependent**
  - Form layout, map/contact cards, copy

### `/sitemap.xml` page + `api/sitemap.xml.ts`
- **API payload dependent**
  - Client page uses `getProducts/getCategories`
  - Serverless endpoint fetches products/categories from backend base URL
- **UI-design dependent**
  - Minimal (mostly generated output and page scaffold)

### `NotFound`, `Index`
- Mostly UI-only.

---

## Page-by-page implementation plan (spare-parts migration)

### Phase 0 — Foundation (do first)
1. **Create `site`/`contact` config single-source**
   - company name, short name, phone display/tel, WhatsApp number, default SEO strings.
2. **Normalize shared payload adapters**
   - product/category mappers so pages stop checking object/string variants ad hoc.
3. **Split `Home.tsx` into modules**
   - `HeroWithFinder`, `ShopByPartsGrid`, `OffersSection`, `FeaturedSection`, `SeoSchemas`.

### Phase 1 — Revenue-critical path
1. **Home**
   - Keep current DB-driven shop-by-parts.
   - Remove legacy “popular wines” dependence or rename endpoint/hook usage.
2. **Category**
   - Replace alcohol-specific filters with parts-oriented filters (brand, price, availability, maybe part type).
3. **Product**
   - Replace alcohol-oriented labels/spec blocks with parts specs.
   - Keep add-to-cart + WhatsApp CTA prominent.
4. **Cart + Checkout**
   - Ensure terminology is parts-specific.
   - Validate order payload unchanged (UI-only if backend unchanged).

### Phase 2 — Discovery/support pages
1. **Offers / Featured / Brands / Origin**
   - Rename and reposition to parts semantics.
   - Keep payload usage but update copy/schema.
2. **Contact / Account / Orders**
   - Align copy, labels, and status wording with spare-parts workflow.

### Phase 3 — SEO/schema cleanup
1. Replace remaining drink/alcohol metadata and JSON-LD on all pages.
2. Align sitemap generator descriptions/routes with spare-parts language.
3. Validate canonical/OG/Twitter values from env config.

### Phase 4 — Hardening
1. Reduce debug logs in `api.ts` and contexts.
2. Standardize query options (`cacheTime` -> `gcTime` if you fully align with React Query v5).
3. Add smoke tests for:
   - home -> category -> product -> cart -> checkout
   - shop-by-parts category ordering from DB fields
   - WhatsApp CTA consistency

---

## Immediate next 3 tasks I recommend

1. **Home modularization** (highest risk reducer).
2. **Category + Product copy/filter overhaul** (largest domain mismatch).
3. **Global SEO/schema sweep** (removes stale drinks branding everywhere).

If you want, I can start implementing **Phase 0 + Phase 1** in that exact order now.