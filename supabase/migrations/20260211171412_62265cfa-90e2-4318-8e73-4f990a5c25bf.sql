
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('donor', 'ngo', 'volunteer', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  food_type TEXT NOT NULL DEFAULT 'veg',
  quantity INTEGER NOT NULL DEFAULT 1,
  expiry_time TIMESTAMPTZ,
  cooking_time TIMESTAMPTZ,
  image_url TEXT,
  pickup_address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned',
  pickup_time TIMESTAMPTZ,
  delivery_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ratings table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_user UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES public.donations(id),
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Impact logs table
CREATE TABLE public.impact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meals_served INTEGER NOT NULL DEFAULT 0,
  food_saved_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  co2_reduced_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
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

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies: donations
CREATE POLICY "Donors can view own donations" ON public.donations FOR SELECT USING (
  donor_id = auth.uid() OR ngo_id = auth.uid() OR public.has_role(auth.uid(), 'ngo') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Donors can create donations" ON public.donations FOR INSERT WITH CHECK (donor_id = auth.uid());
CREATE POLICY "Donors can update own donations" ON public.donations FOR UPDATE USING (donor_id = auth.uid());
CREATE POLICY "Donors can delete pending donations" ON public.donations FOR DELETE USING (donor_id = auth.uid() AND status = 'pending');

-- RLS Policies: deliveries
CREATE POLICY "View deliveries" ON public.deliveries FOR SELECT USING (
  volunteer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.donations d WHERE d.id = donation_id AND (d.donor_id = auth.uid() OR d.ngo_id = auth.uid()))
);
CREATE POLICY "Volunteers can update deliveries" ON public.deliveries FOR UPDATE USING (volunteer_id = auth.uid());
CREATE POLICY "Insert deliveries" ON public.deliveries FOR INSERT WITH CHECK (volunteer_id = auth.uid());

-- RLS Policies: alerts
CREATE POLICY "Users view own alerts" ON public.alerts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own alerts" ON public.alerts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);

-- RLS Policies: ratings
CREATE POLICY "View ratings" ON public.ratings FOR SELECT USING (rated_by = auth.uid() OR rated_user = auth.uid());
CREATE POLICY "Create ratings" ON public.ratings FOR INSERT WITH CHECK (rated_by = auth.uid());

-- RLS Policies: impact_logs
CREATE POLICY "Anyone authenticated can view impact" ON public.impact_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own impact" ON public.impact_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- Storage bucket for food images
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true);

CREATE POLICY "Anyone can view food images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
CREATE POLICY "Authenticated users can upload food images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own food images" ON storage.objects FOR DELETE USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
