-- ==============================================================================
-- LabelCheck - Supabase Database Schema
-- SIH 2026 Problem Statement: PSC26034
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scans Table
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  image_url TEXT,
  compliance_score INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('compliant', 'needs_review', 'non_compliant')),
  total_declarations INTEGER DEFAULT 10,
  passed_declarations INTEGER DEFAULT 0,
  issue_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Scan Results Table (Individual Declaration Extractions)
CREATE TABLE IF NOT EXISTS public.scan_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL,
  detected_value TEXT,
  status TEXT NOT NULL CHECK (status IN ('detected', 'needs_review', 'missing')),
  confidence FLOAT DEFAULT 1.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Compliance Issues Table
CREATE TABLE IF NOT EXISTS public.compliance_issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  affected_field TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_issues ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Profiles: Users can view & update only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Scans: Users can view, insert, delete only their own scans
CREATE POLICY "Users can view own scans" ON public.scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON public.scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans" ON public.scans
  FOR DELETE USING (auth.uid() = user_id);

-- Scan Results: Users can access results through their scans
CREATE POLICY "Users can view own scan results" ON public.scan_results
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.scans WHERE public.scans.id = scan_results.scan_id AND public.scans.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own scan results" ON public.scan_results
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.scans WHERE public.scans.id = scan_results.scan_id AND public.scans.user_id = auth.uid())
  );

-- Compliance Issues: Users can access issues through their scans
CREATE POLICY "Users can view own compliance issues" ON public.compliance_issues
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.scans WHERE public.scans.id = compliance_issues.scan_id AND public.scans.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own compliance issues" ON public.compliance_issues
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.scans WHERE public.scans.id = compliance_issues.scan_id AND public.scans.user_id = auth.uid())
  );

-- 8. Auto-create profile trigger on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Storage Bucket for Product Images
-- Note: Create a bucket named 'product-images' in Supabase Storage with public access enabled.
