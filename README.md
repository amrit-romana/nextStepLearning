# StudyHub - Tutoring Platform

A modern, scalable online tutoring platform for Year 8, 9, and 10 students with secure authentication, student dashboards, and admin management.

## Features

### 🌐 Public Website
- **Landing Page**: Hero section with CTAs and benefits
- **Courses Page**: Browse Year 8/9/10 classes
- **Pricing**: Transparent monthly pricing
- **FAQ**: Common questions answered
- **Contact**: Get in touch with support
- **Responsive Design**: Works on all devices

### 👤 Student Features
- **Email/Password Authentication**: Secure signup & login
- **Dashboard**: View enrolled classes at a glance
- **Enrollments**: Browse and enroll in classes
- **Payment Processing**: Secure payment gateway
- **Entrance Numbers**: Unique ID per enrollment
- **Study Materials**: Access PDFs, videos, notes
- **Class Schedule**: View timetables & Zoom links
- **Recorded Sessions**: Watch past classes anytime

### 👨‍💼 Admin Features
- **Class Management**: Create, edit, delete classes
- **Student Management**: View all students and their enrollments
- **Material Upload**: Upload study resources
- **Schedule Management**: Manage class times and Zoom links
- **Payment Tracking**: View payment status
- **Analytics**: Student and enrollment statistics
- **Data Export**: CSV export of students

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage |
| **State Management** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Hosting** | Vercel (recommended) |

## Quick Start

### 1. Clone & Setup
```bash
# Navigate to project
cd /Users/romana/Documents/tutoring

# Install dependencies
npm install
```

### 2. Create Supabase Project
- Go to https://supabase.com
- Create new project (free tier available)
- Copy project URL and anon key
- Create `.env.local` file with credentials

### 3. Setup Database
```bash
# Install Supabase CLI
npm install -g supabase
 
# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push schema
supabase db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js pages & layouts
│   ├── page.tsx           # Landing page
│   ├── pricing/           # Pricing page
│   ├── faq/               # FAQ page
│   ├── contact/           # Contact page
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Student dashboard
│   └── admin/             # Admin panel
├── components/            # Reusable components
├── lib/                   # Utilities & config
│   ├── supabase/         # Supabase client
│   └── store/            # State management
├── styles/               # Global CSS
└── types/                # TypeScript types
```

## Database Schema

### Core Tables
- **profiles** - User extended info
- **students** - Student-specific data
- **classes** - Course offerings
- **enrollments** - Student-class mappings
- **entrance_numbers** - Unique IDs per enrollment
- **class_schedule** - Timetables & Zoom links
- **study_materials** - PDFs, videos, notes
- **announcements** - Class announcements

### Security
- Row-Level Security (RLS) on all tables
- Students can only see their own data
- Admins have full access
- Entrance numbers are not easily guessable

## User Roles & Access

### Public Users
- Browse landing page
- View course catalog
- Read FAQ & contact form

### Students (Logged In)
- View enrolled classes
- Access study materials
- Join Zoom classes
- View entrance numbers
- Download resources

### Admins
- Manage all classes
- View all students
- Upload materials
- Manage schedules
- View payments & analytics

## Deployment

### Vercel (Recommended - 5 minutes)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Import GitHub repo
# 4. Add env variables
# 5. Deploy
```

**Cost**: Free tier or $20/month for Pro

### Self-Hosted (DigitalOcean)
- Follow guide in `DEPLOYMENT_GUIDE.md`
- **Cost**: $5-20/month for VPS

### Railway
- One-click deployment
- **Cost**: $7-25/month

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Optional:
```env
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

## Authentication Flow

```
Sign Up → Email Verification → Browse Classes → 
Enroll → Payment → Entrance Number → Dashboard
```

### Entrance Numbers
- Generated upon successful payment
- Format: `YEAR-RANDOM` (e.g., `9-A7K3M2`)
- Unique per student per class
- Required for class access

## API Architecture

All API routes are Next.js API Routes (serverless):
- No separate backend needed
- Direct Supabase integration
- Built-in error handling

## Security Features

✅ HTTPS/TLS encryption
✅ Password hashing (bcrypt)
✅ JWT token authentication
✅ Row-Level Security policies
✅ CSRF protection
✅ SQL injection prevention
✅ Secure HTTP headers

## Performance Optimization

- Next.js static generation for public pages
- Image optimization with next/image
- Database query optimization with indexes
- Caching strategies
- Supabase connection pooling

## Monitoring & Analytics

Track:
- User signup/login rates
- Class enrollment trends
- Payment success rates
- Student engagement
- Study material access

Setup (future):
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics dashboard

## Testing

Run tests:
```bash
npm test
```

Test coverage:
- Authentication flows
- Database queries
- Payment processing
- Admin operations

## Troubleshooting

### Issue: Can't connect to database
**Solution**: 
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Test connection in Supabase dashboard

### Issue: Login fails
**Solution**:
- Check email is verified
- Reset password if needed
- Clear browser cache

### Issue: Materials not loading
**Solution**:
- Verify file uploaded to Supabase Storage
- Check CORS settings
- Verify file permissions

See `DEPLOYMENT_GUIDE.md` for more troubleshooting.

## Development Roadmap

### Phase 1 (MVP - Current)
- ✅ Landing page & public site
- ✅ Student authentication
- ✅ Enrollment & payments
- ✅ Study materials
- ✅ Admin dashboard

### Phase 2 (Q2 2025)
- Live chat support
- Progress tracking
- Assignments system
- Email notifications
- Student certificates

### Phase 3 (Q3 2025)
- Mobile app (iOS/Android)
- Parent access portal
- Advanced analytics
- API for integrations
- Multi-language support

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - See LICENSE file

## Support

- **Email**: support@studyhub.com
- **Documentation**: See docs/ folder
- **GitHub Issues**: Report bugs

## Author

Created by: Your Name
Last Updated: January 2026

---

## Quick Reference

### Admin Login
Access admin panel at `/admin` with admin credentials

### Create First Class
1. Go to `/admin/classes`
2. Click "New Class"
3. Fill in details
4. Submit

### Upload Materials
1. Go to `/admin/materials`
2. Select class
3. Upload file or add link
4. Submit

### View Students
1. Go to `/admin/students`
2. Click on student name
3. View enrollments

### Generate Entrance Number
- Automatically generated after payment
- View in student dashboard

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)

---

**Status**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: January 18, 2026
# nextStepLearning
