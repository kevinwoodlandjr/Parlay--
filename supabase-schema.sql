-- ================================================
-- Supabase SQL Schema for NBA Parlay Generator
-- Run this in: Supabase Dashboard → SQL Editor
-- ================================================

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parlays table
CREATE TABLE IF NOT EXISTS parlays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  legs JSONB NOT NULL DEFAULT '[]',
  wager DECIMAL(10,2) NOT NULL DEFAULT 10,
  parlay_odds INTEGER NOT NULL DEFAULT 0,
  potential_payout DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'placed', 'won', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parlays ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies - Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own parlays" ON parlays
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parlays" ON parlays
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parlays" ON parlays
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own parlays" ON parlays
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Index for faster queries
CREATE INDEX IF NOT EXISTS idx_parlays_user_id ON parlays(user_id);
CREATE INDEX IF NOT EXISTS idx_parlays_status ON parlays(status);
CREATE INDEX IF NOT EXISTS idx_parlays_created ON parlays(created_at DESC);
