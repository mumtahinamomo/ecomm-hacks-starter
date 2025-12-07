CREATE POLICY "Allow anon read access"
ON user_tryon_profiles
FOR SELECT
TO anon
USING (true);