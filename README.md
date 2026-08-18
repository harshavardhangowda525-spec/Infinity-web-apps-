# Infinity Web & Apps

**Websites. Mobile Apps. Digital Growth.**

A premium, production-ready company website with a full admin dashboard and
persistent database backend for Infinity Web & Apps — a digital development
company specializing in websites, mobile apps, and digital growth.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer
Motion · Supabase (PostgreSQL + Auth) · Recharts**.

---

## ✨ Features

**Public site**
- Animated hero with a live "website + app being built" visual, floating tech
  chips, and an SVG digital-connections network background
- Scroll-triggered reveals, animated statistics counters, page transitions, a
  branded loading animation, hover-animated service cards, and glowing
  gradients — all GPU-friendly and fully respecting `prefers-reduced-motion`
- Services, Why-Choose-Us, filterable Portfolio, Pricing, Testimonials, and a
  validated Contact/Lead form
- About, Pricing, Projects, Services, Privacy, and Terms pages
- SEO metadata, sitemap, robots, Open Graph, responsive on desktop/tablet/mobile

**Persistent backend (Supabase / PostgreSQL)**
- Relational schema: `profiles`, `leads`, `clients`, `follow_ups`, `projects`,
  `services`, `pricing`, `testimonials`, `site_settings`, `activity_logs`
- Row Level Security on every table, indexes, `updated_at` triggers, an
  auto-provisioned `project-images` storage bucket
- All important data survives refresh, restart, logout, and redeploy — nothing
  critical relies on `localStorage`

**Authentication**
- Email/password login & signup, Google OAuth, password reset + update flows
- Secure Supabase-managed sessions (passwords are never stored in plaintext)
- Protected `/admin` routes guarded by both middleware and a server-side check
- Friendly, safe auth error messages

**Admin dashboard (`/admin`)**
- Stats: total contacted, new / interested / follow-up / converted / rejected
  leads, plus conversion rate, success %, follow-up %, and rejection %
- Pie (lead status), bar (monthly leads), and line (conversions over time) charts
- **Leads**: search, filter, change status, notes, follow-up dates, delete,
  and one-click convert-to-client
- **Clients**: full CRUD with search, status filter, notes, follow-up dates
- **Projects**: full CRUD, public/hidden toggle, featured flag — changes appear
  on the public site immediately
- **Content & Pricing**: edit pricing, testimonials, company info, hero copy,
  and company statistics without touching code

**Security**
- RLS + role-based access (`profiles.role = 'admin'` or an `ADMIN_EMAILS` allow-list)
- Server-side + client-side (zod) validation, honeypot + IP rate limiting on the
  contact endpoint, service-role key kept strictly server-only

---

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [app.supabase.com](https://app.supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql)
   (creates tables, RLS policies, triggers, and the storage bucket).
3. Optionally run [`supabase/seed.sql`](supabase/seed.sql) for starter content.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in from **Supabase → Project Settings → API**:

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public key | public, guarded by RLS |
| `NEXT_PUBLIC_SITE_URL` | your site URL | e.g. `http://localhost:3000` |
| `SUPABASE_SERVICE_ROLE_KEY` | service-role key | **server-only, secret** |
| `ADMIN_EMAILS` | comma-separated | emails allowed into `/admin` |

> The site still builds and previews **without** these — it renders seeded
> fallback content and disables DB writes — so nothing breaks before you connect
> Supabase.

### 4. Enable Google OAuth (optional)

In Supabase → **Authentication → Providers → Google**, add your Google OAuth
credentials and set the redirect URL to `${NEXT_PUBLIC_SITE_URL}/auth/callback`.

### 5. Make yourself an admin

Sign up through `/login`, then either:
- add your email to `ADMIN_EMAILS`, **or**
- set your row's role in SQL:
  `update public.profiles set role = 'admin' where email = 'you@example.com';`

### 6. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run typecheck
npm run lint
```

---

## 🧱 Project structure

```
src/
  app/
    (site)/            # public marketing site (Navbar + Footer layout)
    (auth)/            # login, reset-password, update-password
    admin/             # protected dashboard (layout guards every route)
    api/contact/       # rate-limited lead submission endpoint
    auth/callback/     # OAuth / email-confirm handler
  components/
    site/  motion/  auth/  admin/
  lib/
    supabase/          # browser, server, admin (service-role), middleware clients
    data.ts            # public data access with graceful fallback
    analytics.ts       # dashboard stat computation
    validations.ts     # zod schemas
    types.ts  env.ts  fallback.ts  rate-limit.ts  auth.ts  utils.ts
supabase/
  schema.sql  seed.sql
```

---

## 🔒 Security notes

- The service-role key is imported only through `src/lib/supabase/admin.ts`,
  which is marked `server-only` — a build error is thrown if it ever reaches a
  client bundle.
- Every table has RLS enabled. Anonymous users may **only** insert a `new` lead
  and read published public content; everything else requires an admin.
- The contact endpoint validates input server-side, drops honeypot bots, and
  rate-limits to 5 submissions per IP per 10 minutes.

---

## ☁️ Deploy

Deploy to any Next.js host (e.g. Vercel):
1. Push this repo.
2. Add the same environment variables in your host's dashboard.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain and add
   `${domain}/auth/callback` to Supabase's allowed redirect URLs.

---

## ✅ Manual test checklist

- [ ] Sign up, confirm email, log in, log out
- [ ] Password reset → email link → set new password
- [ ] Visit `/admin` while logged out → redirected to `/login`
- [ ] Submit the contact form → success state → lead appears in `/admin`
- [ ] Refresh / reopen browser → data persists
- [ ] Add / edit / delete clients, projects, pricing, testimonials
- [ ] Toggle a project public/hidden → reflects on `/projects`
- [ ] Edit hero/company/stats in Content → reflects on the homepage
- [ ] Resize to mobile → nav drawer, layouts, and forms all work
- [ ] Dashboard stat percentages and charts compute correctly
