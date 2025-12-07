-- Add new columns to user_tryon_profiles for tracking user info and product interest
ALTER TABLE user_tryon_profiles 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS interested_product_id uuid REFERENCES products(id),
ADD COLUMN IF NOT EXISTS interested_product_name text;

-- Create unique constraint on user_id to enable upsert (one profile per user)
CREATE UNIQUE INDEX IF NOT EXISTS user_tryon_profiles_user_id_unique 
ON user_tryon_profiles(user_id) 
WHERE user_id IS NOT NULL;

-- Enable real-time updates for the table
ALTER PUBLICATION supabase_realtime ADD TABLE user_tryon_profiles;

-- Update RLS policy: Allow authenticated users to read all profiles (for cross-project access)
CREATE POLICY "Service role can read all profiles"
ON user_tryon_profiles
FOR SELECT
TO service_role
USING (true);