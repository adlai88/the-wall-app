-- Migration: Create posters table
-- Created at: 2025-04-22 00:02:00
-- Description: Creates the posters table with indexes and reuses the update_updated_at_column trigger

-- Drop existing trigger if it exists
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posters_updated_at') THEN
        DROP TRIGGER update_posters_updated_at ON posters;
    END IF;
END $$;

DROP TABLE IF EXISTS posters;

-- Create posters table
CREATE TABLE posters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    coordinates TEXT NOT NULL,
    category TEXT NOT NULL,
    display_until DATE NOT NULL,
    poster_image TEXT,
    hidden BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for coordinates
CREATE INDEX idx_posters_coordinates ON posters USING btree (coordinates);

-- Create index for status
CREATE INDEX idx_posters_status ON posters USING btree (status);

-- Create index for hidden
CREATE INDEX idx_posters_hidden ON posters USING btree (hidden);

-- Create index for moderation_status
CREATE INDEX idx_posters_moderation_status ON posters USING btree (moderation_status);

-- Create trigger using existing update_updated_at_column function
CREATE TRIGGER update_posters_updated_at
    BEFORE UPDATE ON posters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 