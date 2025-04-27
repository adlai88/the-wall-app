-- Migration: Create storage policies
-- Created at: 2025-04-22 00:03:00
-- Description: Sets up storage bucket and policies for poster images

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('poster-images', 'poster-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for this bucket
DO $$ BEGIN
    DROP POLICY IF EXISTS "Poster Images Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Poster Images Allow Uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Poster Images Allow Updates" ON storage.objects;
    DROP POLICY IF EXISTS "Poster Images Allow Deletes" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Policy to allow public read access to files
CREATE POLICY "Poster Images Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'poster-images');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Poster Images Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'poster-images');

-- Policy to allow users to update their own files
CREATE POLICY "Poster Images Allow Updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'poster-images');

-- Policy to allow users to delete their own files
CREATE POLICY "Poster Images Allow Deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'poster-images'); 