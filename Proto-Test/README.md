# Mercado Hoy · Proto-Test

Independent UI redesign of `proto-ui`, focused on the mobile experience for operators and producers. No backend is required. All app files and dependencies live inside `Proto-Test`.

## Run locally

```powershell
cd C:\Users\isote\Desktop\repo\PIS2026\Proto-Test
npm install
npm run dev
```

Open [the public market](http://127.0.0.1:5174/), [the operator workspace](http://127.0.0.1:5174/operador/mercado), or [the producer workspace](http://127.0.0.1:5174/productor/mercado). The account selector changes prototype views. All other original screens are available under “Todas las pantallas” on desktop and “Más” on mobile.

## What changed

- New application shell, desktop sidebar, mobile bottom navigation, typography, colors, spacing, and responsive layouts.
- Rebuilt public-market presentation and seller workspace, retaining the original listing formats and grouping.
- A labeled **Editar precio** action for each commercial combination opens a focused bottom sheet on phones and a side panel on desktop.
- Current price, unit, decimal keyboard hint, comma/period handling, positive-price validation, save feedback, and sticky actions appear together.
- Cancel, backdrop click, and Escape protect an unsaved price. Keyboard focus stays inside the sheet and returns to the triggering control.
- **Editar características o foto** keeps the full commercial-combination editor available and carries the typed price into it.
- Seller contact details and hours expand on demand, leaving more room for prices. Search, all existing filters, favorites, pagination, photos, and deletion confirmation remain available.

## What is preserved

`src/shared.ts` and `src/shared/catalog/groupActorProducts.ts` are unchanged copies of the original domain helpers. Catalog groups, species, varieties, presentations, units, calibres, categories, publication attributes, identifiers, sort/filter logic, and grouping retain their existing contracts. The four listing formats remain: market cards with images, actor publications, directories without images, and the public smart list.

The app reuses the existing domain and supporting auth/admin flows. The new UI is implemented in `src/styles.css`, the application header and drawer shell, the market screens, the shared publication listing, and the quick-price editor. `src/supporting-views.css` retains baseline layout compatibility for supporting screens.

This is still the original **frontend prototype**: authentication and administrative actions are simulated, data changes use React state, and price edits are not written to a server. Some changes reset when leaving a screen or reloading, as in `proto-ui`. Photo URLs and fonts require network access. This work does not modify those underlying persistence or authentication contracts.

## Verification

```powershell
npm test
npm run test:browser
npm run build
```

Browser tests use installed Microsoft Edge in headless mode. They cover both seller roles, exact-combination edits, adjacent-row preservation, decimal commas, invalid prices, cancel/discard, full-editor handoff, creation, search, favorites, dependent filters, focus containment, short viewports, narrow-screen overflow, and all 24 tested original routes at mobile and desktop sizes. Unit tests check domain-source parity, publication identity, species grouping, and price-input validation.

See [ITERATIONS.md](ITERATIONS.md) for design feedback and the validation record. Screenshots are generated in the ignored `test-results` folder when browser tests run.
