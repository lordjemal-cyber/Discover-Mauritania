# Site map and content editor

## Visitor pages

All visitor routes have Arabic, English, French, Spanish, Simplified Chinese, Japanese and German variants. The language menu shows each name in its own writing system, an English label, and a country flag. English uses the UK flag; Arabic uses Mauritania's flag to connect the language choice to the destination.

The newly added translations are launch drafts. Have fluent speakers review cultural phrasing, place-name transliteration, and booking terminology before publishing to paying travelers.

1. **Home** (`/[locale]`): destination introduction, featured trips, selected places, and booking guidance.
2. **Trips** (`/[locale]/tours`): cards for the three currently configured trip concepts: Adrar, the iron-ore train, and Banc d'Arguin. Cards show image, route, duration and a confirmed price or a request-a-quote label.
3. **Trip detail** (`/[locale]/tours/[slug]`): gallery, route, duration, group size, departure, price, itinerary, destinations, inclusions, FAQs, and a WhatsApp link when those details are available.
4. **Destinations** (`/[locale]/destinations`), plus **About**, **FAQ**, and **Contact**.

The floating WhatsApp button opens `https://wa.me/22247315321` with a localized message. It opens WhatsApp; it does not create a booking or record the inquiry. The contact form is not connected to message delivery.

## Admin editor

`/admin` groups trip-card details, pricing and availability, itinerary and trip facts, and media links. Localized text is edited independently for all seven supported languages. Price, currency, duration, departure label, seat counts, group size and media links are shared across languages.

Without Supabase credentials, development mode offers a localStorage preview only. It is not shared across browsers and is deliberately disabled for deployed builds. With the public Supabase project URL/key configured, the editor requires password login and an active account in `public.admin_users`; it loads and saves records using the database policies. Do not publish until the migration and admin allow-list are configured and tested on the actual Supabase project.

The editor currently accepts external HTTPS image/video links. The database has a Storage bucket and admin policies prepared, but no upload UI is implemented. It has a database model for inquiries, but the public form neither inserts rows nor sends messages; no booking notification system exists.

Only three trips are included as initial concepts. Add the real full itinerary inventory and owner-confirmed prices, seasonal dates, capacities, media, inclusions, and language copy before treating the catalog as complete. Do not show guessed availability.

## Media credits

Starter destination photography has individual source/license records in [media-attribution.md](media-attribution.md). Check any source and license again before launch. New files or URLs added by an administrator must be licensed for commercial use, with creator/source credit recorded as required.

## Operational setup

See [supabase-and-deployment.md](supabase-and-deployment.md) for the migration, owner allow-list setup, hosting constraints, deployment steps, and remaining launch checks.
