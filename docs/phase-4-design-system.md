# Discover Mauritania — design system, revised direction

## Purpose

The site is a tourism sales journey, not a generic destination brochure. Every main section moves a visitor toward a useful next step: understand the journey, check its details, ask for a quote, and only then confirm a booking directly.

The user rejected the first visual direction as too weak and requested a more distinctive and professional presentation, with interconnected pages and a management area. This version replaces the previous homepage direction.

## Visual direction

- **Art direction:** photographic editorial travel journal with cinematic contrast. Use authentic Mauritanian scenes, restrained gold accents, deep night-green panels, warm paper backgrounds, oversized serif titles, quiet captions and strong route cards.
- **Palette:** night `#101D1A`, forest `#183A32`, secondary forest `#245448`, warm paper `#F8F6F0`, sand `#EFE8DB`, muted gold `#C8A66A`.
- **Typography:** Georgia for editorial display text; system sans-serif stacks with Arabic-capable fallbacks. Fonts are not remotely downloaded or bundled; exact system face varies by device.
- **Interaction:** prominent quote/plan CTA, clear hover movement, destination photographs with overlays, dates/prices surfaced only if entered, and a three-step enquiry flow.
- **Responsive:** fluid typography, horizontally composed cards at desktop, stacked image cards and forms on small screens; RTL is set at the locale root and local navigation uses logical CSS properties where applicable.

## Avoiding false claims

- The UI contains no example prices, dated departures, seats remaining, fabricated guest reviews, or performance awards.
- When no price or schedule has been entered, the public page says to request details.
- The contact form is still a prototype and says it does not send messages until a real provider is connected and delivery is tested.
- Tour detail pages do not confirm a booking. The copy says a direct written confirmation is needed.

## Photos

Three real, Mauritania-specific images are referenced remotely from Wikimedia. Each image's own description page and license were checked and each photo displays a credit. Full attribution records are in `docs/media-attribution.md`.

## Localization

The same page structure is available in Arabic, English, French, Spanish, Simplified Chinese, Japanese and German under `/ar`, `/en`, `/fr`, `/es`, `/zh`, `/ja` and `/de`. All localized site copy is kept in `content/locales.ts`; there is one `content` directory.

## Administration prototype

`/admin` provides editable fields for trip title, summary, route, itinerary lines, price, currency, duration, season/date, seat count, photo URL and video URL. Saving writes to this browser's localStorage; public cards and detail panels in this browser read those edits. This is a UI prototype, without authentication, server database, cross-user sync, file uploads, booking ingestion, or access control. It must not be published for public use as an operational dashboard.

Production management requires an agreed, secure authentication approach, server persistence, media storage, backup/recovery, and an audited booking/contact flow. This prototype does not start those paid services.
