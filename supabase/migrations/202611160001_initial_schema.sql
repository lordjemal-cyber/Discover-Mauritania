-- Discover Mauritania: first production data model.
-- Apply once in the Supabase SQL editor. Public writes are restricted to enquiries;
-- tour and media changes require an allow-listed authenticated admin.

create table if not exists public.tours (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null default '',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tour_translations (
  tour_slug text not null references public.tours(slug) on delete cascade,
  locale text not null check (locale in ('ar', 'en', 'fr', 'es', 'zh', 'ja', 'de')),
  title text not null,
  summary text not null default '',
  route text not null default '',
  itinerary jsonb not null default '[]'::jsonb check (jsonb_typeof(itinerary) = 'array'),
  destinations jsonb not null default '[]'::jsonb check (jsonb_typeof(destinations) = 'array'),
  inclusions jsonb not null default '[]'::jsonb check (jsonb_typeof(inclusions) = 'array'),
  faqs jsonb not null default '[]'::jsonb check (jsonb_typeof(faqs) = 'array'),
  updated_at timestamptz not null default now(),
  primary key (tour_slug, locale)
);

create table if not exists public.departures (
  id uuid primary key default gen_random_uuid(),
  tour_slug text not null references public.tours(slug) on delete cascade,
  is_primary boolean not null default true,
  label text not null default '',
  starts_on date,
  ends_on date,
  duration text not null default '',
  price numeric(12, 2) check (price is null or price >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'EUR', 'MRU')),
  group_size_limit integer check (group_size_limit is null or group_size_limit > 0),
  capacity integer check (capacity is null or capacity >= 0),
  seats_available integer check (seats_available is null or seats_available >= 0),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (capacity is null or seats_available is null or seats_available <= capacity)
);
create unique index if not exists departures_one_primary_per_tour
  on public.departures (tour_slug) where is_primary = true;

create table if not exists public.tour_media (
  id uuid primary key default gen_random_uuid(),
  tour_slug text not null references public.tours(slug) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  sort_order integer not null default 0,
  external_url text,
  storage_path text,
  alt_text jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  check ((external_url is not null) <> (storage_path is not null)),
  unique (tour_slug, media_type, sort_order)
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  tour_slug text references public.tours(slug) on delete set null,
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text not null check (char_length(trim(phone)) between 5 and 40),
  travel_date date,
  travelers integer not null check (travelers between 1 and 20),
  message text not null check (char_length(trim(message)) between 5 and 5000),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists departures_public_lookup on public.departures (tour_slug, is_public, created_at desc);
create index if not exists tour_media_public_lookup on public.tour_media (tour_slug, is_published, media_type, sort_order);
create index if not exists inquiries_status_created on public.inquiries (status, created_at desc);
create index if not exists inquiries_tour_slug_lookup on public.inquiries (tour_slug);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users u
    where u.user_id = (select auth.uid()) and u.is_active = true
  );
$$;

revoke all on function public.is_site_admin() from public, anon;
grant execute on function public.is_site_admin() to authenticated;

create or replace function public.admin_save_tour(
  p_slug text,
  p_category text,
  p_locale text,
  p_translation jsonb,
  p_departure jsonb,
  p_media jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  media_item jsonb;
  media_index integer := 0;
  clean_url text;
begin
  if not public.is_site_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if p_locale not in ('ar', 'en', 'fr', 'es', 'zh', 'ja', 'de') then
    raise exception 'Unsupported locale';
  end if;

  insert into public.tours (slug, category, is_published, updated_at)
  values (p_slug, p_category, true, now())
  on conflict (slug) do update set category = excluded.category, is_published = true, updated_at = now();

  insert into public.tour_translations (
    tour_slug, locale, title, summary, route, itinerary, destinations, inclusions, faqs, updated_at
  ) values (
    p_slug,
    p_locale,
    left(coalesce(p_translation->>'title', ''), 180),
    left(coalesce(p_translation->>'subtitle', ''), 1000),
    left(coalesce(p_translation->>'route', ''), 500),
    coalesce(p_translation->'itinerary', '[]'::jsonb),
    coalesce(p_translation->'destinations', '[]'::jsonb),
    coalesce(p_translation->'included', '[]'::jsonb),
    coalesce(p_translation->'faqs', '[]'::jsonb),
    now()
  ) on conflict (tour_slug, locale) do update set
    title = excluded.title,
    summary = excluded.summary,
    route = excluded.route,
    itinerary = excluded.itinerary,
    destinations = excluded.destinations,
    inclusions = excluded.inclusions,
    faqs = excluded.faqs,
    updated_at = now();

  insert into public.departures (
    tour_slug, is_primary, label, duration, price, currency,
    group_size_limit, capacity, seats_available, is_public, updated_at
  ) values (
    p_slug,
    true,
    left(coalesce(p_departure->>'label', ''), 120),
    left(coalesce(p_departure->>'duration', ''), 80),
    nullif(p_departure->>'price', '')::numeric,
    coalesce(nullif(p_departure->>'currency', ''), 'USD'),
    nullif(p_departure->>'group_size_limit', '')::integer,
    nullif(p_departure->>'capacity', '')::integer,
    nullif(p_departure->>'seats_available', '')::integer,
    true,
    now()
  ) on conflict (tour_slug) where is_primary = true do update set
    label = excluded.label,
    duration = excluded.duration,
    price = excluded.price,
    currency = excluded.currency,
    group_size_limit = excluded.group_size_limit,
    capacity = excluded.capacity,
    seats_available = excluded.seats_available,
    is_public = true,
    updated_at = now();

  delete from public.tour_media where tour_slug = p_slug;
  for media_item in select value from jsonb_array_elements(coalesce(p_media, '[]'::jsonb))
  loop
    if media_item->>'media_type' not in ('image', 'video') then
      raise exception 'Unsupported media type';
    end if;
    clean_url := nullif(media_item->>'url', '');
    if clean_url is null or clean_url !~ '^https://' then
      raise exception 'Media URL must use HTTPS';
    end if;
    insert into public.tour_media (tour_slug, media_type, sort_order, external_url, alt_text, is_published)
    values (
      p_slug,
      media_item->>'media_type',
      media_index,
      clean_url,
      coalesce(media_item->'alt_text', '{}'::jsonb),
      true
    );
    media_index := media_index + 1;
  end loop;
end;
$$;

revoke all on function public.admin_save_tour(text, text, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.admin_save_tour(text, text, text, jsonb, jsonb, jsonb) to authenticated;

alter table public.tours enable row level security;
alter table public.tour_translations enable row level security;
alter table public.departures enable row level security;
alter table public.tour_media enable row level security;
alter table public.admin_users enable row level security;
alter table public.inquiries enable row level security;

create policy "Published tours are public" on public.tours for select to anon, authenticated using (is_published = true);
create policy "Admins manage tours" on public.tours for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

create policy "Published tour translations are public" on public.tour_translations for select to anon, authenticated using (
  exists (select 1 from public.tours t where t.slug = tour_slug and t.is_published = true)
);
create policy "Admins manage tour translations" on public.tour_translations for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

create policy "Public departures of published tours" on public.departures for select to anon, authenticated using (
  is_public and exists (select 1 from public.tours t where t.slug = tour_slug and t.is_published = true)
);
create policy "Admins manage departures" on public.departures for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

create policy "Published media of published tours" on public.tour_media for select to anon, authenticated using (
  is_published and exists (select 1 from public.tours t where t.slug = tour_slug and t.is_published = true)
);
create policy "Admins manage media" on public.tour_media for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

create policy "Admin can inspect own allowlist row" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));

create policy "Public can submit new enquiries" on public.inquiries for insert to anon, authenticated with check (status = 'new');
create policy "Admins read enquiries" on public.inquiries for select to authenticated using (public.is_site_admin());
create policy "Admins update enquiries" on public.inquiries for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

-- Remove project-level default grants first; RLS does not replace table privileges.
revoke all on table public.tours, public.tour_translations, public.departures, public.tour_media, public.admin_users, public.inquiries from anon, authenticated;
grant select on public.tours, public.tour_translations, public.departures, public.tour_media to anon, authenticated;
grant insert, update, delete on public.tours, public.tour_translations, public.departures, public.tour_media to authenticated;
grant select on public.admin_users to authenticated;
grant insert (tour_slug, full_name, email, phone, travel_date, travelers, message) on public.inquiries to anon, authenticated;
grant select, update on public.inquiries to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tour-media', 'tour-media', true, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'])
on conflict (id) do nothing;

create policy "Admins list tour media objects" on storage.objects for select to authenticated using (bucket_id = 'tour-media' and public.is_site_admin());
create policy "Admins upload tour media objects" on storage.objects for insert to authenticated with check (bucket_id = 'tour-media' and public.is_site_admin());
create policy "Admins replace tour media objects" on storage.objects for update to authenticated using (bucket_id = 'tour-media' and public.is_site_admin()) with check (bucket_id = 'tour-media' and public.is_site_admin());
create policy "Admins delete tour media objects" on storage.objects for delete to authenticated using (bucket_id = 'tour-media' and public.is_site_admin());
