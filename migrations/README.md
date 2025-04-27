# Database Migrations

This directory contains all database migrations for The Wall App. Migrations are ordered by timestamp and should be run in sequence.

## Migration Naming Convention

Migrations follow this naming pattern:
```
YYYYMMDDHHMMSS_descriptive_name.sql
```

For example:
- `20250422000100_create_events_table.sql`
- `20250422000200_create_posters_table.sql`
- `20250422000300_create_storage_policies.sql`

## Current Migrations

1. **Create Events Table** (`20250422000100`)
   - Creates the base events table
   - Sets up indexes for efficient querying
   - Creates the shared `update_updated_at_column` trigger function

2. **Create Posters Table** (`20250422000200`)
   - Creates the posters table
   - Sets up indexes
   - Reuses the `update_updated_at_column` trigger function

3. **Create Storage Policies** (`20250422000300`)
   - Sets up the poster-images storage bucket
   - Configures access policies for the bucket
   - Handles public read access and authenticated uploads

## Running Migrations

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Run each migration in order (lowest timestamp first)
4. Verify each migration completes successfully before proceeding to the next

## Adding New Migrations

When adding new migrations:

1. Use the current date and time for the timestamp prefix
2. Include a descriptive name in the file name
3. Add header comments in the SQL file:
   ```sql
   -- Migration: [Brief title]
   -- Created at: [Timestamp]
   -- Description: [Detailed description]
   ```
4. Include both up (changes) and down (rollback) operations where possible
5. Test the migration in a development environment first

## Dependencies

Note that some migrations depend on others:
- The posters table migration depends on the events table migration (shared trigger function)
- The storage policies depend on the existence of the posters table 