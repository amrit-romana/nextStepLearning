/**
 * DATABASE SETUP INSTRUCTIONS
 * 
 * This file documents how to set up your Supabase database.
 * 
 * STEPS:
 * 1. Go to your Supabase dashboard: https://app.supabase.com
 * 2. Select your project
 * 3. Go to SQL Editor (left sidebar)
 * 4. Click "New Query"
 * 5. Paste the SQL from /supabase/migrations/001_initial_schema.sql
 * 6. Click "Run" button
 * 
 * OR use the Supabase CLI:
 * npx supabase migration up --local
 * 
 * QUICK SETUP - Run this SQL in Supabase SQL Editor:
 */

const setupSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  school TEXT,
  guardian_name TEXT,
  guardian_email TEXT,
  guardian_phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  year_level INTEGER NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  capacity INTEGER DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year_level, subject)
);

-- 4. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  transaction_id TEXT,
  entrance_number TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);

-- Insert default classes
INSERT INTO classes (name, year_level, subject, price, description, status)
VALUES 
  ('Year 8 Mathematics', 8, 'Mathematics', 98.00, 'Mathematics for Year 8', 'active'),
  ('Year 8 Science', 8, 'Science', 98.00, 'Science for Year 8', 'active'),
  ('Year 9 Mathematics', 9, 'Mathematics', 98.00, 'Mathematics for Year 9', 'active'),
  ('Year 9 Science', 9, 'Science', 98.00, 'Science for Year 9', 'active'),
  ('Year 10 Mathematics', 10, 'Mathematics', 98.00, 'Mathematics for Year 10', 'active'),
  ('Year 10 Science', 10, 'Science', 98.00, 'Science for Year 10', 'active')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Students can read own record" ON students
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can update own record" ON students
  FOR UPDATE USING (auth.uid() = user_id);

-- Classes policies
CREATE POLICY "Everyone can read classes" ON classes
  FOR SELECT USING (true);

-- Enrollments policies
CREATE POLICY "Students can read own enrollments" ON enrollments
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

console.log('✅ See the SQL above to run in Supabase SQL Editor')
