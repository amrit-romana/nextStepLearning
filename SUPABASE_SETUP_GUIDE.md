# Supabase Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get the SQL Script
The SQL script is in the root of your project: `SUPABASE_SETUP_SQL.sql`

### Step 2: Run in Supabase SQL Editor
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project from the list
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"** button (top-right)
5. Open the `SUPABASE_SETUP_SQL.sql` file from your project
6. Copy the entire contents
7. Paste into the Supabase SQL Editor
8. Click the **"Run"** button (bottom-right)

### Step 3: Verify
You should see:
- ✅ Created profiles table
- ✅ Created students table
- ✅ Created classes table
- ✅ Created enrollments table
- ✅ Inserted 6 default classes (Year 8, 9, 10 × Math & Science)

## What Gets Created

### Tables
1. **profiles** - Extends auth.users, stores user profile info (full_name, phone, etc.)
2. **students** - Links to profiles, stores student-specific data (school, guardian info)
3. **classes** - Mathematics/Science classes for Year 8, 9, 10
4. **enrollments** - Links students to classes, tracks payment status

### Default Classes (Price: $98/week)
- Year 8 Mathematics
- Year 8 Science
- Year 9 Mathematics
- Year 9 Science
- Year 10 Mathematics
- Year 10 Science

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:
- Users can only read/update their own profile and student records
- All users can read available classes
- Students can only see their own enrollments

## Troubleshooting

### Error: "relation 'profiles' already exists"
This is OK - it means the tables already exist. The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times.

### Error: "permission denied"
Make sure you're logged into Supabase as the project owner/admin.

### Error: "role does not exist"
Click "Disconnect" at the top of the SQL editor and try again, or refresh the page.

## After Setup

Your app should now work without the "table not found" errors. The enrollment form will:
1. ✅ Create a profile (extends auth.users automatically)
2. ✅ Create a student record linked to the profile
3. ✅ Look up the appropriate class (Year 8 Mathematics, etc.)
4. ✅ Create enrollment linking student to class
5. ✅ Redirect to payment form

## Environment Variables Needed

Make sure you have in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If you need to use service role key for admin operations, also add:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing the Flow

1. Sign up a new account at `/auth/signup`
2. Go to `/dashboard`
3. Click "Enroll" on Mathematics or Science
4. Fill in the enrollment form
5. Submit (should now work!)
6. You'll be redirected to the payment page

If you still get errors, check the browser console (F12) and let me know what the error says.
