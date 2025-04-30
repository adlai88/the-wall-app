-- Migration: Add hidden field to posters table
-- Created at: 2025-04-22 00:04:00
-- Description: Adds the hidden field to the posters table with a default value of false

-- Add hidden column if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'posters' 
        AND column_name = 'hidden'
    ) THEN
        ALTER TABLE posters ADD COLUMN hidden BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create index for hidden if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE indexname = 'idx_posters_hidden'
    ) THEN
        CREATE INDEX idx_posters_hidden ON posters USING btree (hidden);
    END IF;
END $$; 