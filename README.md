# Lúma — Shopify theme

Custom Shopify **Online Store 2.0** theme for **Lúma**, a single-product brand selling an at-home **microcurrent face-sculpting device** (high-ticket dropship) to the South African market.

Built by [WebFlow Studio](https://github.com/ComplyHubsa). Connected to Shopify via the **GitHub theme integration** — every push to `main` syncs into the connected store.

## Connect this repo to your Shopify store
1. In Shopify admin → **Online Store → Themes**.
2. Click **Add theme → Connect from GitHub**.
3. Authorise GitHub, pick `ComplyHubsa/Shopifystore`, branch `main`.
4. The theme appears in your theme library. **Customize** to set the logo, menus, colours and add product images.
5. **Publish** when ready (requires a paid plan to go live).

Pushes to `main` auto-sync. Edits made in the Shopify theme editor are committed *back* to this repo by the integration.

## Local development (optional)
```bash
npm i -g @shopify/cli
shopify theme dev --store jhtpvf-ea.myshopify.com   # live preview
shopify theme check                                  # lint the theme
shopify theme push                                   # push without GitHub
```

## Structure
```
layout/        theme.liquid, password.liquid
sections/      header, footer, hero, benefits, how-to, testimonials, faq,
               newsletter, image-with-text, main-product, main-collection,
               main-cart, main-page, main-404, main-search, etc.
               + header-group.json / footer-group.json (section groups)
snippets/      product-card, social-icons
templates/     *.json (OS 2.0 JSON templates) + page.contact.json
assets/        base.css (settings-driven CSS variables), global.js (cart/variants)
config/        settings_schema.json, settings_data.json
locales/       en.default.json
```

## Brand / theming
Brand name, colours, fonts, logo, social links and the free-shipping threshold are
all theme settings (Customize → Theme settings) — no code edits needed to rebrand.

## The product
**Lúma Microcurrent Face Sculptor** — at-home microcurrent device, R899. See
`docs/product.md` for launch copy, pricing, compliance notes and sourcing.
