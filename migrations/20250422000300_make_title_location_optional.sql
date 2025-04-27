-- Migration: Make title and location optional
-- Created at: 2025-04-22 00:03:00
-- Description: Modifies the posters table to make title and location fields optional

-- Modify title column to be nullable
ALTER TABLE posters ALTER COLUMN title DROP NOT NULL;

-- Modify location column to be nullable
ALTER TABLE posters ALTER COLUMN location DROP NOT NULL; 