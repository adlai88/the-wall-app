-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-posters', 'event-posters', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-posters');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-posters');

-- Policy to allow users to update their own files (optional)
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-posters');

-- Policy to allow users to delete their own files (optional)
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-posters'); 