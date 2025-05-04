-- Migration: Add event_start_date and event_end_date to posters table
-- Created at: 2025-05-04 00:01:00
-- Description: Adds event_start_date (required for events) and event_end_date (optional) to the posters table for supporting event-specific date ranges.

-- Add event_start_date column if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posters' AND column_name = 'event_start_date'
    ) THEN
        ALTER TABLE posters ADD COLUMN event_start_date DATE;
    END IF;
END $$;

-- Add event_end_date column if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posters' AND column_name = 'event_end_date'
    ) THEN
        ALTER TABLE posters ADD COLUMN event_end_date DATE;
    END IF;
END $$; 