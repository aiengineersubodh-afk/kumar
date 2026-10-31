# ManyMorgan — Enterprise Software Engineering & Digital Transformation

> Complete company flagship website, multi-discipline service architecture, enquiry scoping engine, and secure executive admin portal.

ManyMorgan is an enterprise software engineering consultancy providing bespoke digital product development, modern web flagships, mobile applications, custom cloud architectures, and autonomous AI automation workflows.

---

## 🏛️ System Architecture

The project is structured with a decoupled, high-performance architecture:

```
E:\Vaishali
├── frontend/                     # Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide
│   ├── src/
│   │   ├── app/                  # App Router pages (Home, Services, Detail, About, Contact, Quote, Legal, Admin)
│   │   │   ├── admin/            # Secure Admin Portal (/admin/login, /admin/dashboard, /admin/enquiries, ...)
│   │   │   ├── services/         # Services overview and dynamic [slug] service detail pages
│   │   │   ├── about/            # About ManyMorgan company philosophy and standards
│   │   │   ├── contact/          # Contact information and embedded scoping portal
│   │   │   ├── get-a-quote/      # Dedicated project enquiry scoping form
│   │   │   ├── privacy/          # Privacy Policy and NDA terms
│   │   │   ├── terms/            # Terms and Conditions
│   │   │   └── not-found.tsx     # Custom 404 page
│   │   ├── components/           # Reusable UI components (Navbar, Footer, EnquiryForm, AnnouncementBanner)
│   │   └── lib/                  # Client utilities (api.ts, adminAuth.ts)
│   └── package.json
│
├── backend/                      # NestJS 12 enterprise backend with TypeScript & Modular Architecture
│   ├── src/
│   │   ├── auth/                 # Admin authentication, token management, AdminGuard
│   │   ├── common/               # StoreService (Supabase integration + persistent local JSON fallback)
│   │   ├── enquiries/            # Enquiry processing, Zod/DTO validation, anti-spam, CSV export
│   │   ├── services/             # Services catalog CRUD and publishing controller
│   │   ├── content/              # Website CMS (Hero, About, Contact, Footer, SEO metadata)
│   │   ├── faqs/                 # FAQs management
│   │   ├── announcements/        # Public announcement banners
│   │   ├── notifications/        # Admin in-app notification center
│   │   ├── dashboard/            # Real database-backed metrics and analytics
│   │   ├── email/                # Resend provider integration & development simulator
│   │   └── main.ts               # Server bootstrap (port 4000, CORS, validation)
│   ├── data/db.json              # Persistent local database store
│   └── package.json
│
├── supabase/
│   └── migrations/
│       ├── 01_initial_schema.sql # 13 relational tables, RLS policies, triggers, and indexes
│       └── 02_seed_data.sql     # Seed data for services, CMS content, FAQs, announcements, and admin
│
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git exclusions
├── package.json                  # Root orchestration scripts (concurrently)
└── README.md                     # Technical documentation
```

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- **Node.js**: v20+ (tested on Node v24.17.0)
- **npm**: v10+

### Option 1: Run Both Backend & Frontend Simultaneously (Recommended)
From the root workspace directory (`E:\Vaishali`):

```bash
npm run dev
```

This concurrently launches:
- **NestJS Backend**: `http://localhost:4000/api`
- **Next.js Frontend**: `http://localhost:3000`

### Option 2: Run Separately in Individual Terminals

**Backend:**
```bash
npm run dev:backend
# or
cd backend
npm run start:dev
```

**Frontend:**
```bash
npm run dev:frontend
# or
cd frontend
npm run dev
```

---

## 🔐 Admin Portal Credentials

A master administrator profile is pre-provisioned for immediate evaluation:

- **Portal URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@manymorgan.com`
- **Password**: `ManyMorgan2026!Admin`

> *Note: The password can be customized via the `ADMIN_PASSWORD` variable in `backend/.env` or in Supabase Auth.*

---

## 🛠️ Environment Configuration

Copy `.env.example` to `.env` in the root or `backend/.env`:

```ini
# Backend Port & URLs
PORT=4000
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Master Admin Authentication
ADMIN_PASSWORD=ManyMorgan2026!Admin

# Supabase Credentials (Optional for local development; system uses high-fidelity local JSON store if empty)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Notifications (Optional - Resend.com. System logs formatted receipt if empty)
RESEND_API_KEY=re_your_resend_api_key
BUSINESS_ALERT_EMAIL=projects@manymorgan.com
EMAIL_FROM="ManyMorgan <onboarding@resend.dev>"
```

### Resilient Safe-Mode Fallback
- If **Supabase** credentials are not supplied, the application automatically uses a local persistent JSON database (`backend/data/db.json`), seeded with production-grade ManyMorgan data.
- If **Resend** credentials are not supplied, the system automatically simulates customer acknowledgement and business alert emails in the server logs with realistic message IDs and delivery receipts.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

When connecting a production Supabase project:
1. Open your Supabase project's **SQL Editor**.
2. Run `supabase/migrations/01_initial_schema.sql` to generate:
   - `admin_profiles`
   - `services`
   - `enquiries`
   - `enquiry_notes` (private admin notes)
   - `enquiry_status_history`
   - `follow_up_reminders`
   - `website_content` (CMS key-value sections)
   - `general_faqs`
   - `announcements`
   - `notifications`
   - `communication_history`
   - `file_attachments`
   - `audit_logs`
   - Indexes, triggers (`updated_at`), and Row Level Security (RLS) policies.
3. Run `supabase/migrations/02_seed_data.sql` to populate initial services, default CMS content, FAQs, announcements, and admin user.
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`.

---

## 🌐 Public Website Capabilities

| Page / Route | Features & Content |
|---|---|
| **Home (`/`)** | Hero with CMS-driven headline, Services preview, Why ManyMorgan pillars, 4-step delivery process, Interactive tech stack matrix, FAQs accordion, Embedded scoping form, Top announcement banner. |
| **Services (`/services`)** | Overview of all 6 core engineering verticals with deliverables and technology tags. |
| **Service Details (`/services/[slug]`)** | Deep-dive pages for: `mobile-app-development`, `website-development`, `ui-ux-design`, `custom-software-development`, `ai-integration-and-automation`, `website-maintenance-and-support`. Includes benefits, roadmap, deliverables, and pre-selected enquiry scoping form. |
| **About Us (`/about`)** | ManyMorgan engineering philosophy, mission statement, architectural rigor, IP ownership guarantee. |
| **Contact Us (`/contact`)** | Direct channels (`projects@manymorgan.com`, `+1 (800) 555-0199`), HQ details, SLA terms, scoping portal. |
| **Get a Quote (`/get-a-quote`)** | High-conversion enquiry scoping form with NDA and privacy guarantees. |
| **Privacy Policy (`/privacy`)** | Comprehensive confidentiality and data handling policy. |
| **Terms & Conditions (`/terms`)** | Clear terms governing consultation and IP assignment. |
| **404 Not Found (`/_not-found`)** | Branded error screen with quick navigation return links. |

> **Prohibited items strictly removed:**
> - No `Portfolio` in any navigation or public section.
> - No `Industries` in any navigation or public section.
> - No `Resources` in any navigation or public section.
> - No `Explore Appinventiv Digital` or equivalent branding.
> - Zero fabricated client logos, fake testimonials, or false company stats.

---

## 📋 Project Enquiry Form Specifications

The enquiry form features 11 client- and server-validated fields:
1. **Full Name** (Required, min 2 chars)
2. **Work Email** (Required, valid email format)
3. **Country Calling Code & Phone Number** (Required, international country code selector)
4. **Company Name** (Optional)
5. **Service Required** (Required, selects from active engineering verticals)
6. **Estimated Project Budget** (Optional: <$15k, $15k-$35k, $35k-$75k, $75k-$150k, $150k+, Flexible)
7. **Expected Timeline** (Optional: Immediate, 1-3 mo, 3-6 mo, 6+ mo, Flexible)
8. **Project Description** (Required, min 15 chars)
9. **File Attachment** (Optional, accepts PDF/DOC/ZIP/images up to 10MB)
10. **Marketing Consent** (Optional, unchecked by default)
11. **Privacy Policy Acknowledgement** (Required with link to `/privacy`)

**Anti-Abuse & Workflow Safeguards:**
- Hidden honeypot field (`website_hp`) silently detects and filters automated bot submissions.
- Generates a human-readable unique Enquiry ID (e.g., `MM-2026-1001`).
- Dispatches an automated confirmation email to the prospective client.
- Sends an immediate alert to the configured business inbox (`projects@manymorgan.com`).
- Creates an unread in-app notification in the Admin Console.

---

## 🛡️ Admin Dashboard Features (`/admin`)

- **Role-Based Route Guard**: Blocks unauthorized access; automatically redirects unauthenticated users to `/admin/login`.
- **Real Metrics Overview**: Database-backed counts for Total Enquiries, New Enquiries, Awaiting Follow-Up, Won, Lost, and Vertical Breakdown.
- **Enquiry Management**:
  - Live search across client names, emails, company names, and enquiry numbers.
  - Filter by Service, Pipeline Status, and Priority.
  - Sorting and pagination.
  - **Export to CSV**: Downloads an instant `.csv` report of filtered records.
  - **Enquiry Details View**: Inspect full project description, contact info, and file attachments.
  - **Status Transitions**: `New` &rarr; `Contacted` &rarr; `Meeting Scheduled` &rarr; `Proposal Sent` &rarr; `Won` / `Lost` with timestamped audit entries.
  - **Private Internal Notes**: Add team notes visible exclusively to administrators.
  - **Client Communications**: Send status updates directly from the dashboard to client email addresses.
  - **Archiving**: Archive or unarchive completed/stale enquiries.
- **Services CMS**: Add, edit, publish/unpublish, and delete engineering service pages.
- **Website Content CMS**: Live editing of Home Hero headlines, CTA button labels/destinations, About content, contact information, and SEO metadata with instantaneous reflection on the public site.
- **Announcements**: Broadcast site-wide top banner alerts with active toggles and deep links.
- **Notifications Center**: Notification feed with unread count badges, mark as read, and mark all read capabilities.

---

## 🧪 Production Verification Checklist

- [x] Backend builds cleanly with `@nestjs/cli build` (0 errors).
- [x] Frontend builds cleanly with `next build` (25 static/dynamic routes prerendered).
- [x] All 4 prohibited navigation items (`Portfolio`, `Industries`, `Resources`, `Explore Appinventiv Digital`) verified absent.
- [x] End-to-end enquiry submission verified via Browser Subagent and automated API testing.
- [x] Unique ID generation (`MM-2026-XXXX`) verified.
- [x] Admin authentication verified (`admin@manymorgan.com` / `ManyMorgan2026!Admin`).
- [x] Real-time metrics and enquiry status transitions verified.
- [x] Internal private notes persisted and verified.
- [x] Dynamic CMS headline updates verified.
- [x] Responsive mobile navigation drawer verified.
