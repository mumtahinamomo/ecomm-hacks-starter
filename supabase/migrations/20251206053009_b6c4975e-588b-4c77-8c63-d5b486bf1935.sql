-- Add weight_lbs column to user_tryon_profiles table
ALTER TABLE public.user_tryon_profiles
ADD COLUMN weight_lbs numeric NULL;