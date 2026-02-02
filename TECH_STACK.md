# Tutoring Business Website - Tech Stack & Architecture

## Executive Summary
A modern, scalable ed-tech platform for Year 8-10 students with secure authentication, student dashboards, and admin management.

---

## Tech Stack Recommendation

### Frontend
- **Framework**: Next.js 14+ (React)
  - App Router for modern routing
  - Server-side rendering for SEO (public pages)
  - Static generation for performance
- **UI/Styling**: Tailwind CSS + shadcn/ui
  - Pre-built components for ed-tech aesthetic
  - Responsive design out of the box
- **State Management**: Zustand (lightweight)
- **HTTP Client**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication Client**: Supabase Auth UI or custom

### Backend
- **Database**: Supabase (PostgreSQL) - Recommended for MVP
  - Real-time capabilities
  - Built-in auth
  - Row-level security (RLS)
  - Simple pricing ($5-25/month)
  - Alternative: PocketBase (self-hosted, unlimited)

- **API**: Next.js API Routes
  - Serverless functions
  - Easy integration with Supabase
  - No separate backend server needed

### Authentication & Security
- Supabase Auth (JWT-based)
- Row-Level Security (RLS) for data isolation
- Role-based access control (RBAC)
  - student
  - admin
- Password hashing (built-in)
- Session management (JWT in cookies/localStorage)

### File Storage
- Supabase Storage (for PDFs, notes)
- Max 1GB per file, suitable for study materials

### Payment Processing (Optional)
- Stripe or Payfast (South Africa)
- Square (US/Canada)
- PayPal
- Manual enrollment with invoice system (MVP)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│             Public Website (Next.js)                │
│   Landing | About | Courses | Pricing | FAQ | Blog  │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐     ┌───────▼──────────┐
│  Student Auth    │     │  Admin Auth      │
│  Login/Signup    │     │  (Dashboard)     │
└───────┬──────────┘     └───────┬──────────┘
        │                         │
┌───────▼──────────────────────────▼──────────┐
│         Supabase PostgreSQL Database        │
│  - Users (auth)                             │
│  - Students (profile, entrance number)      │
│  - Classes (Year 8/9/10)                    │
│  - Enrollments (payments, access)           │
│  - Study Materials (PDFs, videos)           │
│  - Class Schedule & Zoom Links              │
└──────────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────┐
│      Supabase Storage & Real-time Sub.       │
│  - File uploads/downloads                    │
│  - Live notifications                        │
└──────────────────────────────────────────────┘
```

---

## Database Schema Overview

**Core Tables:**
1. `auth.users` - Managed by Supabase Auth
2. `profiles` - User extended info (name, phone)
3. `students` - Student-specific data
4. `classes` - Course offerings (Year 8/9/10)
5. `enrollments` - Student-class mapping + payment status
6. `study_materials` - PDFs, notes, videos
7. `class_schedule` - Timetable + Zoom links
8. `entrance_numbers` - Generated per student per class

---

## Key Features Implementation

### 1. Authentication Flow
```
User Signs Up
  ↓
Email Verification (Supabase)
  ↓
Payment Processing (Stripe/Manual)
  ↓
Generate Entrance Number
  ↓
Access Student Dashboard
```

### 2. Row-Level Security (RLS)
- Students can only see their own data
- Admins can see all data
- Study materials filtered by enrollment

### 3. Real-time Updates
- Supabase Realtime for live notifications
- Admin updates materials → Students see instantly

---

## Deployment Stack

### Option 1: Vercel (Recommended for MVP)
- Host Next.js frontend
- Free tier available
- $0-10/month pro tier
- Auto deployments from Git

### Option 2: Self-hosted (VPS)
- DigitalOcean/Linode ($5-20/month)
- Full control
- Requires DevOps knowledge

### Database Hosting
- **Supabase Cloud**: $5-25/month (included)
- **PocketBase**: Self-hosted (free)

### Domain
- Namecheap / Cloudflare ($10-15/year)

---

## Cost Breakdown (Monthly)
| Component | Cost | Notes |
|-----------|------|-------|
| Supabase | $5-25 | Scales with usage |
| Vercel | Free-$20 | Free tier usually sufficient |
| Domain | $1-2 | Annual cost amortized |
| Stripe | 2.9% + $0.30/transaction | Only if using payment processing |
| **Total** | **$6-47/month** | Highly scalable |

---

## Security Considerations

✅ HTTPS/TLS enforced
✅ Row-Level Security on all tables
✅ Password hashing (bcrypt via Supabase)
✅ JWT tokens with expiration
✅ CSRF protection (Next.js built-in)
✅ Entrance numbers not easily guessable (UUID)
✅ Payment verification before access
✅ Admin actions audited (optional)

---

## Scalability

**Current capacity (Supabase Free):**
- Up to 500MB database
- 2GB file storage
- Suitable for 1000+ students initially

**Growth path:**
- Year 1-2: Free/Pro tier ($5-25/month)
- Year 2-3: Scale to $100-500/month as needed
- Multi-region replication (Premium)

---

## Development Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Setup & Schema | 1-2 days | DB, auth, API endpoints |
| Public Pages | 2-3 days | Landing, courses, pricing |
| Student Auth | 1 day | Login, signup, RLS |
| Dashboard | 3-4 days | Materials, schedule, entrance number |
| Admin Panel | 3-4 days | Class mgmt, uploads, student mgmt |
| Testing & Deploy | 2-3 days | QA, deployment, monitoring |
| **Total** | **2-3 weeks** | Production-ready MVP |

---

## Tech Stack Summary

```
Frontend:  Next.js 14 + Tailwind + shadcn/ui
Backend:   Supabase (PostgreSQL)
Auth:      Supabase Auth (JWT)
Storage:   Supabase Storage
Hosting:   Vercel (frontend) + Supabase (backend)
```

This stack is:
- ✅ Cost-effective ($10-50/month)
- ✅ Scalable (handles 10k+ concurrent users)
- ✅ Developer-friendly (quick to build)
- ✅ Secure (enterprise-grade)
- ✅ Maintainable (modern standards)
