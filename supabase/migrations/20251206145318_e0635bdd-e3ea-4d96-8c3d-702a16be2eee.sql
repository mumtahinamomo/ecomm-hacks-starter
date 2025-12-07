-- Create storage bucket for virtual try-on results
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tryon-results', 'tryon-results', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to tryon-results bucket
CREATE POLICY "Public read access for tryon-results"
ON storage.objects FOR SELECT
USING (bucket_id = 'tryon-results');

-- Allow authenticated users to upload to tryon-results
CREATE POLICY "Authenticated users can upload tryon results"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tryon-results' AND auth.uid() IS NOT NULL);

-- Allow users to update their own tryon results
CREATE POLICY "Users can update their own tryon results"
ON storage.objects FOR UPDATE
USING (bucket_id = 'tryon-results' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own tryon results
CREATE POLICY "Users can delete their own tryon results"
ON storage.objects FOR DELETE
USING (bucket_id = 'tryon-results' AND auth.uid()::text = (storage.foldername(name))[1]);