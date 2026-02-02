# System Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDYHUB PLATFORM                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────────────┬────────────────┐
│   PUBLIC WEBSITE    │  STUDENT DASHBOARD   │   ADMIN PANEL  │
│   (No Login)        │  (Authenticated)     │ (Admin Only)   │
├─────────────────────┼──────────────────────┼────────────────┤
│ • Landing Page      │ • View Classes       │ • Dashboard    │
│ • Course Catalog    │ • Enrollment        │ • Classes      │
│ • Pricing           │ • Materials         │ • Students     │
│ • FAQ               │ • Schedules         │ • Materials    │
│ • Contact           │ • Entrance # View   │ • Analytics    │
└─────────────────────┴──────────────────────┴────────────────┘
                             ↓
                    ┌─────────────────┐
                    │  NEXT.JS LAYER  │
                    │  (Frontend)     │
                    │                 │
                    │ • App Router    │
                    │ • Pages         │
                    │ • Components    │
                    │ • Client-side   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │  SUPABASE LAYER │
                    │  (Backend)      │
                    │                 │
                    │ • PostgreSQL    │
                    │ • Auth          │
                    │ • Storage       │
                    │ • Real-time     │
                    └────────┬────────┘
                             ↓
        ┌────────────────────┴────────────────────┐
        │                                         │
   ┌────▼─────┐                        ┌────────▼────┐
   │ DATABASE  │                        │  STORAGE    │
   │           │                        │             │
   │ • Users   │                        │ • Materials │
   │ • Classes │                        │ • PDFs      │
   │ • Enroll. │                        │ • Videos    │
   │ • Matls.  │                        │ • Notes     │
   └───────────┘                        └─────────────┘
```

---

## Data Flow Diagrams

### User Sign Up Flow

```
┌─────────────┐
│ User Visits │
│  /auth/     │
│  signup     │
└──────┬──────┘
       ↓
┌──────────────────┐
│ Enter Email &    │
│ Password         │
└──────┬───────────┘
       ↓
┌──────────────────────────────┐
│ Supabase Auth Signs Up User  │
│ - Hash password (bcrypt)     │
│ - Create auth user           │
│ - Generate JWT token         │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Create Profile Record        │
│ - Store name, email, role    │
│ - Set role = 'student'       │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Create Student Record        │
│ - Link to user               │
│ - Initialize fields          │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Send Verification Email      │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Show: "Check Your Email"     │
│ Page                         │
└──────────────────────────────┘
```

### Enrollment Flow

```
┌──────────────────┐
│ Student Logged In│
└────────┬─────────┘
         ↓
┌──────────────────────┐
│ Browse Classes       │
│ GET /classes         │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Select Class         │
│ View Price & Details │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Click "Enroll"       │
│ POST /enrollments    │
└────────┬─────────────┘
         ↓
┌──────────────────────────────┐
│ Create Enrollment Record     │
│ - Status: pending            │
│ - Payment: pending           │
│ - Temporary entrance #       │
└────────┬─────────────────────┘
         ↓
┌──────────────────────────────┐
│ Redirect to Payment Page     │
│ /dashboard/payment/[id]      │
└────────┬─────────────────────┘
         ↓
┌──────────────────────────────┐
│ Student Enters Card Details  │
└────────┬─────────────────────┘
         ↓
┌──────────────────────────────┐
│ Process Payment              │
│ (Stripe/Payfast simulation)  │
└────────┬─────────────────────┘
         ↓
    ┌────┴────┐
    │          │
  YES         NO
    │          │
    ↓          ↓
┌──────┐   ┌────────┐
│Update│   │Payment │
│Status│   │Failed  │
│      │   │        │
│:     │   └────────┘
│Com-  │
│pleted│
│      │
│Gen.  │
│Entc# │
└───┬──┘
    ↓
┌──────────────────────────────┐
│ Show Success Page with       │
│ Entrance Number              │
│ e.g., Y9-A7K3M2              │
└────────┬─────────────────────┘
         ↓
┌──────────────────────────────┐
│ Redirect to Dashboard        │
│ /dashboard                   │
└──────────────────────────────┘
```

### Student Dashboard Flow

```
┌───────────────────┐
│ Student Logs In   │
│ Authenticated ✓   │
└────────┬──────────┘
         ↓
┌──────────────────────────────────┐
│ Fetch Student Profile Data       │
│ GET /api/student/[id]            │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ Load Enrollments                 │
│ WHERE payment_status='completed' │
│ AND is_active=true               │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ Calculate Stats                  │
│ - Active classes: count          │
│ - Pending: count                 │
│ - Total enrolled: count          │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ Display Dashboard with           │
│ - Quick stats                    │
│ - Active classes cards           │
│ - Pending enrollments            │
│ - Action buttons                 │
└────────┬─────────────────────────┘
         ↓
    ┌────┴─────────────────┐
    │                      │
┌───▼──────┐      ┌───────▼───┐
│Click on  │      │Enroll in  │
│Class →   │      │More Classes
│          │      │    →
│View      │      │Enrollment
│Details   │      │Page
└──────────┘      └───────────┘
    ↓                   ↓
┌─────────────┐  ┌──────────────┐
│Materials    │  │Browse Classes│
│Schedule     │  │Select & Pay  │
│Zoom Links   │  └──────────────┘
└─────────────┘
```

### Admin Management Flow

```
┌────────────────────┐
│ Admin Logs In      │
│ role='admin' ✓     │
└────────┬───────────┘
         ↓
┌────────────────────────────────┐
│ Admin Dashboard                │
│ /admin                         │
│                                │
│ • Total Students              │
│ • Active Classes              │
│ • Total Enrollments           │
│ • Completed Payments          │
└────────┬───────────────────────┘
         ↓
    ┌─────┴──────────────┬──────────┐
    │                    │          │
┌───▼──────┐  ┌────────▼──┐  ┌────▼────┐
│Manage    │  │View       │  │Manage   │
│Classes   │  │Students   │  │Materials│
│          │  │           │  │         │
│•Create  │  │•List all  │  │•Upload  │
│•Edit    │  │•View      │  │•Link    │
│•Delete  │  │  details  │  │•Delete  │
└──────────┘  │•View      │  └─────────┘
              │  enroll.  │
              │•Export    │
              │  CSV      │
              └───────────┘
```

---

## Database Relationship Diagram

```
┌──────────────────┐
│  auth.users      │ (Supabase managed)
│  (JWT tokens)    │
└────────┬─────────┘
         │ id
         │
         ↓
┌──────────────────────┐
│  profiles            │
├──────────────────────┤
│ id (PK)              │
│ email                │
│ full_name            │
│ phone                │
│ role ('student'/'a') │
│ avatar_url           │
│ created_at           │
└─┬────────────────────┘
  │
  ├──────────────────────┐
  │                      │
  ↓                      ↓
┌──────────────┐    ┌─────────────┐
│ students     │    │ study_      │
│              │    │ materials   │
│ id (PK)      │    │             │
│ user_id (FK) │    │ id (PK)     │
│ school       │    │ class_id(FK)│
│ DOB          │    │ created_by  │
│ status       │    │ (FK)        │
└──┬───────────┘    └─────────────┘
   │
   │ student_id
   ↓
┌─────────────────────────┐
│ enrollments             │
├─────────────────────────┤
│ id (PK)                 │
│ student_id (FK)         │
│ class_id (FK) ──┐       │
│ entrance_number │       │
│ payment_status  │       │
│ is_active       │       │
│ payment_date    │       │
└─────────────────┼───────┘
                  │
                  ↓
          ┌───────────────┐
          │ classes       │
          ├───────────────┤
          │ id (PK)       │
          │ name          │
          │ year_level    │
          │ subject       │
          │ price         │
          │ capacity      │
          │ status        │
          └───┬───────────┘
              │
              │ class_id
              ├────────────────┐
              │                │
              ↓                ↓
          ┌──────────┐   ┌─────────────┐
          │ class_   │   │ entrance_   │
          │ schedule │   │ numbers     │
          │          │   │             │
          │ id (PK)  │   │ id (PK)     │
          │ day_week │   │ enum_id(FK) │
          │ time     │   │ created_at  │
          │ zoom_url │   └─────────────┘
          └──────────┘
```

---

## Authentication & Authorization

```
┌──────────────────────────────────┐
│ User Login / Sign Up             │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Supabase Auth (JWT Tokens)           │
│ - Validates email & password         │
│ - Creates JWT token                  │
│ - Stores in browser localStorage     │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Check User Role from profiles table  │
│ - role = 'student' → /dashboard      │
│ - role = 'admin' → /admin            │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Row-Level Security (RLS) Policies    │
│ - Students see only their data       │
│ - Admins see all data                │
│ - Database enforces automatically    │
└──────────────────────────────────────┘

EXAMPLE RLS POLICY:

CREATE POLICY "Students can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
```

---

## Payment Processing Flow

```
┌────────────────────┐
│ Enrollment Created │
│ Payment: pending   │
└────────┬───────────┘
         ↓
┌────────────────────────────┐
│ Redirect to Payment Page   │
│ Show Order Summary         │
│ - Class name               │
│ - Price                    │
│ - Billing info             │
└────────┬───────────────────┘
         ↓
┌────────────────────────────┐
│ Student Enters Card Info   │
│ (Test: 4242 4242...)       │
└────────┬───────────────────┘
         ↓
┌────────────────────────────────┐
│ Submit Payment                 │
│ POST /api/payment/process      │
└────────┬───────────────────────┘
         ↓
┌────────────────────────────────┐
│ Stripe/Payfast Charges Card    │
└─────────┬──────────────────────┘
          │
     ┌────┴────┐
     │          │
   OK           DECLINED
     │          │
     ↓          ↓
┌─────────┐  ┌────────────┐
│Update   │  │Show Error  │
│:        │  │Retry       │
│payment_ │  │Payment     │
│status=  │  └────────────┘
│complete │
│         │
│Generate │
│entrance │
│number:  │
│Y9-xxx   │
└────┬────┘
     ↓
┌────────────────────────────┐
│ Update is_active = TRUE    │
│ Send Confirmation Email    │
│ Show Success Page          │
└────────┬───────────────────┘
         ↓
┌────────────────────────────┐
│ Student Can Now Access:    │
│ - Materials                │
│ - Schedule                 │
│ - Zoom Links               │
│ - Entrance Number          │
└────────────────────────────┘
```

---

## Real-time Updates Architecture

```
┌─────────────────────────────┐
│ Admin Uploads New Material  │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ INSERT into study_materials table   │
│ - class_id                          │
│ - title                             │
│ - file_url                          │
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Supabase Real-time Subscription     │
│ (Connected students listening)      │
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ BROADCAST to all students:          │
│ "New material available: Chapter 1" │
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Student's Dashboard Updates Live    │
│ (No page refresh needed!)           │
└─────────────────────────────────────┘
```

---

## Security & Data Privacy

```
┌──────────────────────────────────────┐
│ All Requests → HTTPS/TLS Encrypted   │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ JWT Token Verification               │
│ - Check signature                    │
│ - Check expiration (1 hour)          │
│ - Get user ID                        │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Row-Level Security (RLS)             │
│ - Database enforces policies         │
│ - Even admins can't bypass           │
│ - Per-table, per-operation           │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Query Examples:                      │
│                                      │
│ SELECT * FROM enrollments            │
│ WHERE student_id IN (                │
│   SELECT id FROM students            │
│   WHERE user_id = auth.uid()         │
│ )                                    │
│                                      │
│ Only returns user's own enrollments! │
└──────────────────────────────────────┘
```

---

## Deployment Architecture

### Development
```
Browser → localhost:3000 → Next.js Dev Server → Supabase
```

### Production (Vercel)
```
Browser → https://yourdomain.com → Vercel (Edge) → 
Supabase Cloud (Multiple Regions)
```

### Production (Self-hosted)
```
Browser → https://yourdomain.com → Nginx → 
PM2 (Node.js) → Supabase Cloud
```

---

## Scalability Path

```
MONTH 1-3:
Free Tier
• 500MB Database
• 1GB Storage
• Can handle 100-500 users

MONTH 3-6:
Upgrade to Pro ($25/month)
• 10GB Database
• 100GB Storage  
• Can handle 500-5000 users

MONTH 6-12:
Team Plan ($100/month)
• Unlimited Database
• Unlimited Storage
• Can handle 5000-50000 users

YEAR 2+:
Enterprise Plan (custom pricing)
• Dedicated infrastructure
• Custom features
• 24/7 support
```

---

This architecture is designed to be:
- ✅ Secure (JWT, RLS, HTTPS)
- ✅ Scalable (cloud-based)
- ✅ Maintainable (clear separation)
- ✅ Performant (indexed queries)
- ✅ Real-time (Supabase subscriptions)

---

**Generated**: January 18, 2026
