-- Create table for storing user try-on profiles with body metrics
CREATE TABLE public.user_tryon_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  height_cm INTEGER NOT NULL,
  gender TEXT,
  shoulder_width_cm INTEGER,
  chest_cm INTEGER,
  waist_cm INTEGER,
  hip_cm INTEGER,
  selfie_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_tryon_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tryon_profiles
CREATE POLICY "Users can view their own profiles"
ON public.user_tryon_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles"
ON public.user_tryon_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
ON public.user_tryon_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles"
ON public.user_tryon_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Allow anonymous/guest users to insert profiles (for guest flow)
CREATE POLICY "Allow guest inserts"
ON public.user_tryon_profiles
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_tryon_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_tryon_profiles_updated_at
BEFORE UPDATE ON public.user_tryon_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_tryon_profile_updated_at();

-- Create storage bucket for user selfies
INSERT INTO storage.buckets (id, name, public) VALUES ('user-selfies', 'user-selfies', true);

-- Storage policies for user-selfies bucket
CREATE POLICY "Anyone can upload selfies"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'user-selfies');

CREATE POLICY "Anyone can view selfies"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user-selfies');

CREATE POLICY "Users can update their own selfies"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'user-selfies');

CREATE POLICY "Users can delete their own selfies"
ON storage.objects
FOR DELETE
USING (bucket_id = 'user-selfies');