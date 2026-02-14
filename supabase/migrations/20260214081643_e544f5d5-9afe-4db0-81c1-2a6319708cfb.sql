
-- ═══════════════════════════════════════════════════════════════
-- UniSched Premium Academic Suite - Production Database Schema
-- ═══════════════════════════════════════════════════════════════

-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- 2. User Roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  student_id TEXT,
  year INTEGER CHECK (year BETWEEN 1 AND 5),
  class_section TEXT CHECK (class_section IN ('A', 'B', 'C')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 5),
  class_section TEXT NOT NULL CHECK (class_section IN ('A', 'B', 'C')),
  day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
  time_slot_start TEXT NOT NULL,
  time_slot_end TEXT NOT NULL,
  subject TEXT NOT NULL,
  instructor TEXT NOT NULL,
  room TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'locked')),
  notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 5. Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  file_url TEXT,
  file_size TEXT,
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 5),
  class_section TEXT NOT NULL CHECK (class_section IN ('A', 'B', 'C')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS (Security Definer - avoids RLS recursion)
-- ═══════════════════════════════════════════════════════════════

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get student's year from profile
CREATE OR REPLACE FUNCTION public.get_student_year(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT year FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Get student's class section from profile
CREATE OR REPLACE FUNCTION public.get_student_section(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT class_section FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

-- user_roles: only admins can manage
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- profiles: users read own, admins read all
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System inserts profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- schedules: admins full access, students see approved/locked for their year/section
CREATE POLICY "Admins full access to schedules"
  ON public.schedules FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view approved schedules"
  ON public.schedules FOR SELECT
  TO authenticated
  USING (
    status IN ('approved', 'locked')
    AND year = public.get_student_year(auth.uid())
    AND class_section = public.get_student_section(auth.uid())
  );

-- resources: admins full access, students read matching year/section
CREATE POLICY "Admins full access to resources"
  ON public.resources FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students view own resources"
  ON public.resources FOR SELECT
  TO authenticated
  USING (
    year = public.get_student_year(auth.uid())
    AND class_section = public.get_student_section(auth.uid())
  );
