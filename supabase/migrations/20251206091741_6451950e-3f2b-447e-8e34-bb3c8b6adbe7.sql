-- Create catalogs table for storing user digital catalogs
CREATE TABLE public.catalogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'classic',
  hero_image_url TEXT,
  pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;

-- Users can view their own catalogs
CREATE POLICY "Users can view their own catalogs"
ON public.catalogs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own catalogs
CREATE POLICY "Users can create their own catalogs"
ON public.catalogs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own catalogs
CREATE POLICY "Users can update their own catalogs"
ON public.catalogs
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own catalogs
CREATE POLICY "Users can delete their own catalogs"
ON public.catalogs
FOR DELETE
USING (auth.uid() = user_id);

-- Allow public read access for shared catalogs (via catalogId in URL)
CREATE POLICY "Allow public catalog viewing"
ON public.catalogs
FOR SELECT
TO anon
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_catalogs_updated_at
BEFORE UPDATE ON public.catalogs
FOR EACH ROW
EXECUTE FUNCTION public.update_tryon_profile_updated_at();