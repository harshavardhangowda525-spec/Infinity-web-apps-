-- ============================================================================
-- Infinity Web & Apps — Seed data
-- ----------------------------------------------------------------------------
-- Optional starter content so the public site looks complete on first deploy.
-- Safe to run multiple times (uses stable slugs / keys with upsert).
-- ============================================================================

-- ---- services --------------------------------------------------------------
insert into public.services (title, slug, description, icon, features, sort_order) values
  ('Website Development', 'website-development',
   'Modern, responsive and conversion-focused websites for businesses.',
   'Globe', array['Responsive design','SEO ready','CMS integration','Blazing fast'], 1),
  ('Mobile App Development', 'mobile-app-development',
   'Custom Android / iOS applications designed around business requirements.',
   'Smartphone', array['Native & cross-platform','Push notifications','App store launch','Offline support'], 2),
  ('Digital Growth', 'digital-growth',
   'Digital marketing, SEO, social media and online growth solutions.',
   'TrendingUp', array['SEO strategy','Social media','Paid campaigns','Analytics'], 3),
  ('Business Solutions', 'business-solutions',
   'Custom dashboards, booking systems, CRM systems and other business tools.',
   'LayoutDashboard', array['Custom dashboards','Booking systems','CRM tools','Automations'], 4)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  features = excluded.features,
  sort_order = excluded.sort_order;

-- ---- pricing ---------------------------------------------------------------
insert into public.pricing (name, price_label, price_amount, currency, period, description, features, highlighted, sort_order) values
  ('Websites', 'Starting from ₹4,999', 4999, 'INR', 'one-time',
   'Modern, responsive websites that convert visitors into customers.',
   array['Up to 5 pages','Responsive design','Contact form','Basic SEO','1 month support'], false, 1),
  ('Mobile Apps', 'Starting from ₹55,000', 55000, 'INR', 'one-time',
   'Custom Android & iOS apps built around your business.',
   array['Native experience','Custom features','App store launch','Push notifications','3 months support'], true, 2),
  ('Digital Growth', 'Custom pricing', null, 'INR', 'monthly',
   'Tailored digital marketing and growth engagements.',
   array['SEO & content','Social media','Paid ads','Monthly reporting','Dedicated manager'], false, 3)
on conflict do nothing;

-- ---- projects (portfolio) --------------------------------------------------
insert into public.projects (title, slug, category, description, image_url, live_url, tags, is_public, featured, sort_order) values
  ('Aurora Cafe Website', 'aurora-cafe',
   'Website',
   'A warm, modern website with online reservations for a boutique cafe.',
   'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80',
   'https://example.com', array['Website','Booking'], true, true, 1),
  ('FitPulse Mobile App', 'fitpulse-app',
   'Mobile App',
   'A cross-platform fitness app with workout tracking and reminders.',
   'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
   null, array['Mobile App','iOS','Android'], true, true, 2),
  ('LedgerFlow CRM', 'ledgerflow-crm',
   'Business Solution',
   'A custom CRM dashboard for a growing services company.',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
   'https://example.com', array['Dashboard','CRM'], true, false, 3),
  ('BloomMart Store', 'bloommart-store',
   'Website',
   'A conversion-focused e-commerce storefront for a local retailer.',
   'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
   'https://example.com', array['Website','E-commerce'], true, false, 4)
on conflict (slug) do nothing;

-- ---- testimonials ----------------------------------------------------------
insert into public.testimonials (author, role, company, quote, rating, sort_order) values
  ('Priya Sharma', 'Founder', 'Aurora Cafe',
   'Infinity Web & Apps rebuilt our online presence beautifully. Reservations doubled within a month.', 5, 1),
  ('Rahul Verma', 'CEO', 'FitPulse',
   'They delivered a polished mobile app on time and understood exactly what our users needed.', 5, 2),
  ('Ananya Iyer', 'Operations Lead', 'LedgerFlow',
   'The custom CRM dashboard saved our team hours every week. Fantastic, responsive support.', 5, 3)
on conflict do nothing;

-- ---- admin allow-list ------------------------------------------------------
-- Emails listed here are treated as administrators by RLS (is_admin()), and any
-- matching signup is auto-promoted to the 'admin' role. Add your admin email(s).
-- Keep this in sync with the app's ADMIN_EMAILS env var.
insert into public.admin_emails (email) values
  ('akagaminodfshanks@gmail.com')
on conflict (email) do nothing;

-- Promote any already-registered profile whose email is allow-listed.
update public.profiles p
set role = 'admin'
from public.admin_emails a
where lower(p.email) = lower(a.email) and p.role <> 'admin';

-- ---- site_settings ---------------------------------------------------------
insert into public.site_settings (key, value, is_public) values
  ('company', jsonb_build_object(
     'name','Infinity Web & Apps',
     'tagline','Websites. Mobile Apps. Digital Growth.',
     'email','hello@infinitywebapps.com',
     'phone','+91 00000 00000',
     'address','India',
     'socials', jsonb_build_object(
        'twitter','https://twitter.com',
        'linkedin','https://linkedin.com',
        'instagram','https://instagram.com',
        'github','https://github.com'
     )
   ), true),
  ('hero', jsonb_build_object(
     'title','Infinity Web & Apps',
     'subtitle','Websites. Mobile Apps. Digital Growth.',
     'body','Build a stronger digital presence with modern websites, powerful mobile applications, and digital solutions designed to help businesses grow.'
   ), true),
  ('stats', jsonb_build_object(
     'projects', 120,
     'clients', 80,
     'years', 6,
     'satisfaction', 98
   ), true)
on conflict (key) do update set value = excluded.value, is_public = excluded.is_public;
