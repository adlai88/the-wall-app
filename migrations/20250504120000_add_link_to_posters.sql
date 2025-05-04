-- Migration: Add link field to posters table
-- Created at: 2025-05-04 12:00:00
-- Description: Adds an optional link (TEXT) field to the posters table for event or poster URLs.

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posters' AND column_name = 'link'
    ) THEN
        ALTER TABLE posters ADD COLUMN link TEXT;
    END IF;
END $$; 