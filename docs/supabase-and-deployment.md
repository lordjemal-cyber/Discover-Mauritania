# Supabase and deployment runbook

## What is prepared in this repository

- The initial PostgreSQL schema is in `supabase/migrations/202611160001_initial_schema.sql` and has been applied to the Supabase project `Discover Mauritania` (`koukbzaifvsqbwfdjqpb`).
- It models published trips, localized text in Arabic, English, French, Spanish, Simplified Chinese, Japanese and German, a primary departure and its price/capacity, media links, allow-listed administrators, and future enquiries.
- The live project now has six public tables, all with Row Level Security enabled: `tours`, `tour_translations`, `departures`, `tour_media`, `admin_users`, and `inquiries`. They currently contain no rows.
- Public visitors can read published trip information; only an authenticated account listed in `admin_users` can change trip content. The admin allow-list is currently empty. The first owner account must be created in Supabase Auth, then its UUID added to `admin_users` before anyone can edit.
- This workspace has a local `.env.local` containing only the project URL and publishable key; `.env.local` is ignored by Git. Never use a secret/service-role key in browser code or commit environment files.
- `/admin` now verifies the Supabase user and the `is_site_admin` database function on the server before rendering the editor. Unauthenticated visitors see only the sign-in screen; authenticated users outside the allow-list receive a not-found response. Database policies also reject writes from non-admins.
- The `tour-media` public bucket is configured for JPG, PNG and WebP images plus MP4/WebM video, with uploads restricted to allow-listed admins. The admin editor uploads images directly to Supabase Storage. The contact enquiry table is ready, but the contact form remains disabled until a privacy notice and end-to-end delivery flow are approved.

The schema, tables, RLS, and media bucket have been confirmed in the live project. The owner account is not created yet, so admin sign-in and media uploads still need an end-to-end check after allow-listing.

## Create and connect a Supabase project

1. Create a Supabase project in your own account. The Free tier has a 500 MB database and 1 GB file storage, pauses after a week of low activity, and does not include automatic backups or an uptime SLA. Check the [current limits and terms](https://supabase.com/pricing) before relying on it for revenue-critical bookings.
2. In the Supabase SQL editor, apply the migration file above once.
3. In Authentication, create the owner account. Keep public sign-ups disabled.
4. Copy the owner's user UUID from Authentication and add only that account to the allow-list:

   ```sql
   insert into public.admin_users (user_id)
   values ('OWNER-AUTH-USER-UUID');
   ```

5. Copy Project URL and the publishable key into `.env.local` using `.env.example` as a template. Do not copy any service-role/secret key into this project, a `NEXT_PUBLIC_` variable, GitHub, or a message.
6. Add the same two variables in the hosting provider's environment settings for production and preview. Restrict Supabase Authentication's redirect URLs to your actual local and deployed domains.
7. Add the remaining confirmed tours and all seven language versions in `/admin`. Unverified prices, seats, dates, image rights, or itinerary claims should not be published.

## Hosting choice

Use GitHub as source control and CI; this repository is public, so do not commit secrets or environment files. Do not use GitHub Pages as the business website host. This is an interactive Next.js application with an authenticated admin surface and is a commercial tourism business. [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) says it is not allowed as free hosting for an online business/e-commerce site; [Vercel Hobby](https://vercel.com/docs/plans/hobby) is limited to personal, non-commercial use. [Netlify supports this Next.js app](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/) and says its Free tier can host commercial projects, but it has 300 monthly credits and [pauses sites at the limit](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/). That makes it a no-purchase MVP option, not a reliability guarantee for a business income source.

The repository contains `netlify.toml` for Node 24.13.0 and a GitHub Actions workflow that checks dependencies, TypeScript, and the production build. To go live, import this repository in Netlify, enter the two Supabase public environment variables, and deploy. The repository and Supabase project are connected locally; no production hosting environment or domain has been configured from this workspace.

Before launch, add a custom domain and test the deployed site, admin sign-in, database policies, multilingual pages, image rights/loading, WhatsApp handoff, mobile layouts, and contact/booking process. If the free-tier pause/credit limits are unacceptable, choose a paid plan only after reviewing actual expected traffic and budget; no plan has been purchased or activated here.

## Release checklist

- [x] Apply the initial migration and verify the six tables, RLS, and `tour-media` bucket in Supabase.
- [ ] Create one owner login, add its UUID to `admin_users`, and confirm unlisted users cannot edit.
- [ ] Verify public reads and admin writes with RLS enabled.
- [ ] Verify admin edits persist across browsers and redeploys.
- [ ] Confirm every published trip's title, route, itinerary, language, price, availability, and media rights.
- [ ] Have fluent reviewers approve all seven language versions and place-name spellings.
- [ ] Decide and implement real enquiry delivery before describing the form as a booking/contact channel.
- [ ] Add actual file upload, replacement, validation, and media deletion UX if administrators need to upload media rather than paste links.
- [ ] Deploy preview, test it on desktop/mobile in RTL Arabic and LTR English/Spanish, then connect the production domain.
- [ ] Set a budget/usage alert with Supabase and the host; understand what happens at each free limit.
