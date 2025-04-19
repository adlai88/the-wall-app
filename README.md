# The Wall App

A social event discovery platform that helps users find and share local events.

## Features

- Interactive map view for discovering events
- Create and submit events with location data
- Search and filter events by keywords
- Weather integration
- Admin moderation interface
- Mobile-friendly responsive design

## Tech Stack

- Next.js for frontend and API routes
- React and styled-components for UI
- Leaflet for interactive maps
- Supabase for backend database and authentication
- Serverless architecture

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```
npm run build
npm run start
```

## Project Structure

- `/src/components` - React components
- `/src/pages` - Next.js pages and API routes
- `/src/lib` - Utility libraries
- `/src/services` - External service integrations
- `/migrations` - Database migration scripts
- `/docs` - Project documentation