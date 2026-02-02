# Supabase Configuration - Step by Step Guide

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Sign Up"
3. Choose signup method (GitHub, Google, email)
4. Verify email

## Step 2: Create New Project

1. Click "New Project"
2. Fill in project details:
   - **Name**: `tutoring-platform` (or your choice)
   - **Database Password**: Create strong password (save this!)
   - **Region**: Choose closest to your location
   - **Plan**: Select "Free" for MVP

3. Click "Create New Project"
4. Wait for project to initialize (2-3 minutes)

## Step 3: Get Credentials

1. Once project is ready, go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: `eyJxxx...` (starts with "eyJ")
   - **Service Role Key**: Keep this secret!

## Step 4: Enable Required Extensions

1. Go to **SQL Editor**
2. Run this query:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Step 5: Push Database Schema

### Option A: Using CLI (Recommended)

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push schema
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > types/supabase.ts
```

### Option B: Manual SQL

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy entire content of `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL editor
5. Click "Run"
6. Wait for completion

## Step 6: Enable Authentication

1. Go to **Authentication → Providers**
2. Make sure "Email" is enabled
3. Go to **Settings** (in Auth section)
4. Configure:
   - Site URL: `http://localhost:3000` (dev) or your domain
   - Redirect URLs: Add your app URLs
   - JWT expiration: 3600 (1 hour) - adjust as needed

## Step 7: Create Admin User

1. Go to **Authentication → Users**
2. Click "Invite**
3. Enter admin email
4. Wait for invitation email
5. Accept invitation and set password

### Make Admin Account

1. Go to **SQL Editor**
2. Run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## Step 8: Create Storage Bucket

1. Go to **Storage → Buckets**
2. Click "New Bucket"
3. Name: `study-materials`
4. **Make it public** (required for downloads)
5. Click "Create Bucket"

## Step 9: Configure CORS

1. Go to **Storage → Settings**
2. Click "Edit"
3. Add allowed origins:
   - `http://localhost:3000` (dev)
   - `https://yourdomain.com` (prod)
   - `https://*.vercel.app` (for Vercel)

## Step 10: Create Environment File

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Replace with your actual values from Step 3.

## Step 11: Verify Setup

Run this command:
```bash
npm run dev
```

Then:
1. Go to http://localhost:3000
2. Try signing up with a test account
3. Check if you receive verification email
4. Complete email verification
5. Try logging in

## Step 12: Create Sample Data

Go to **SQL Editor** and run:

```sql
-- Insert sample classes
INSERT INTO classes (name, year_level, subject, description, price, capacity) VALUES
('Year 8 Mathematics', 8, 'Mathematics', 'Core maths curriculum for Year 8', 299.99, 20),
('Year 8 English', 8, 'English', 'Literature and writing skills', 299.99, 20),
('Year 9 Science', 9, 'Science', 'Physics, Chemistry, Biology', 349.99, 20),
('Year 9 Mathematics', 9, 'Mathematics', 'Algebra and geometry', 349.99, 20),
('Year 10 English', 10, 'English', 'Advanced literature', 399.99, 20),
('Year 10 Chemistry', 10, 'Chemistry', 'GCSE Chemistry prep', 399.99, 15);
```

## Step 13: Add Class Schedule

```sql
-- Add sample schedule for Year 8 Math
INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, zoom_link, notes)
SELECT id, 'Monday', '18:00', '19:00', 'https://zoom.us/j/123456789', 'Live session'
FROM classes WHERE name = 'Year 8 Mathematics' LIMIT 1;

INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time, zoom_link, notes)
SELECT id, 'Thursday', '18:00', '19:00', 'https://zoom.us/j/123456789', 'Live session'
FROM classes WHERE name = 'Year 8 Mathematics' LIMIT 1;
```

## Troubleshooting

### Issue: Can't sign up
**Solution**:
- Check Email provider is enabled
- Verify site URL in Auth settings

### Issue: Storage bucket not accessible
**Solution**:
- Make sure bucket is public
- Check CORS settings
- Verify bucket name in code

### Issue: Can't access admin features
**Solution**:
- Verify role is 'admin' in profiles table
- Check RLS policies allow admin access

### Issue: Database error when pushing
**Solution**:
- Make sure CLI project is linked correctly
- Try running SQL manually in editor
- Check project is in active state

## Important Notes

⚠️ **Never commit `.env.local` to Git**
- Add to `.gitignore`
- Use GitHub Secrets for CI/CD

🔒 **Keep keys secret**
- Anon key: OK to expose (used in frontend)
- Service role key: NEVER expose (backend only)

📊 **Monitor usage**
- Free tier: 500MB database, 1GB storage
- Upgrade as needed ($25-100/month)

## Next Steps

1. ✅ Database setup complete
2. Now: Run `npm run dev`
3. Test signup/login flow
4. Create sample classes
5. Test enrollment & payment
6. Deploy to production

---

Need help? Check `DEPLOYMENT_GUIDE.md` for more details.
