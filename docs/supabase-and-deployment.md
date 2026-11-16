# Supabase and deployment runbook

## What is prepared in this repository

- The initial PostgreSQL schema is in `supabase/migrations/202611160001_initial_schema.sql`.
- It models published trips, localized text in Arabic, English, French, Spanish, Simplified Chinese, Japanese and German, a primary departure and its price/capacity, media links, allow-listed administrators, and future enquiries.
- Row Level Security is enabled. Public visitors can read published trip information; only an authenticated account listed in `admin_users` can change trip content. The browser receives only Supabase's publishable key. Never use a secret/service-role key in the app.
- `/admin` is a local-only editor while running without Supabase in development. When deployed without configuration, edits are locked. With Supabase configured, password sign-in and the admin allow-list are required; edits use the `admin_save_tour` database function.
- Media fields currently accept HTTPS image/video links. The schema creates a private-admin upload policy and bucket, but the app does **not** yet upload files. Contact forms do **not** submit enquiries or send email.

The database has not been created or migrated in a cloud account. Applying SQL, login, saves, RLS, and public reads have not been tested against a live project.

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

Use GitHub as the private/source repository and CI; do not use GitHub Pages as the business website host. This is an interactive Next.js application with an authenticated admin surface and is a commercial tourism business. [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) says it is not allowed as free hosting for an online business/e-commerce site; [Vercel Hobby](https://vercel.com/docs/plans/hobby) is limited to personal, non-commercial use. [Netlify supports this Next.js app](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/) and says its Free tier can host commercial projects, but it has 300 monthly credits and [pauses sites at the limit](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/). That makes it a no-purchase MVP option, not a reliability guarantee for a business income source.

The repository contains `netlify.toml` for Node 24.13.0 and a GitHub Actions workflow that checks dependencies, TypeScript, and the production build. To go live, push this repository to a GitHub account you control, import it in Netlify, enter the two Supabase public environment variables, and deploy. No hosting account, repository, Supabase account, domain, or production deployment has been connected from this workspace.

Before launch, add a custom domain and test the deployed site, admin sign-in, database policies, multilingual pages, image rights/loading, WhatsApp handoff, mobile layouts, and contact/booking process. If the free-tier pause/credit limits are unacceptable, choose a paid plan only after reviewing actual expected traffic and budget; no plan has been purchased or activated here.

## Release checklist

- [ ] Apply migration to a non-production Supabase project and confirm SQL completes.
- [ ] Create one owner login; confirm unlisted users cannot edit.
- [ ] Verify public reads and admin writes with RLS enabled.
- [ ] Verify admin edits persist across browsers and redeploys.
- [ ] Confirm every published trip's title, route, itinerary, language, price, availability, and media rights.
- [ ] Have fluent reviewers approve all seven language versions and place-name spellings.
- [ ] Decide and implement real enquiry delivery before describing the form as a booking/contact channel.
- [ ] Add actual file upload, replacement, validation, and media deletion UX if administrators need to upload media rather than paste links.
- [ ] Deploy preview, test it on desktop/mobile in RTL Arabic and LTR English/Spanish, then connect the production domain.
- [ ] Set a budget/usage alert with Supabase and the host; understand what happens at each free limit.
