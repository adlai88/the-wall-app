# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

The Wall App is a map-based event discovery platform built with Next.js/React that allows users to discover events without registration. Key architectural patterns:

### Tech Stack
- **Frontend**: Next.js 14.1.0 + React 18.2.0
- **Database**: Supabase (PostgreSQL with real-time)
- **Maps**: Leaflet with React-Leaflet (dynamically imported to avoid SSR issues)
- **Styling**: styled-components with SSR support
- **PWA**: next-pwa for offline functionality

### Data Flow
1. Events are submitted through `/submit` page
2. API routes in `/pages/api/` handle CRUD operations
3. Events require admin approval (moderation workflow)
4. Approved events appear on map and grid views
5. Weather data is cached server-side (NodeCache)

### Key Components Structure
- `MapView.js` - Main interactive map with event markers
- `GridView.js` - Grid layout for event browsing
- `PosterView.js` - Individual event poster display
- `BottomNavigation.js` - Mobile navigation between views
- Admin components handle moderation workflow

### API Design
- All API endpoints are rate-limited
- Weather endpoint caches data for 10 minutes
- Event endpoints handle moderation states (pending/approved/rejected)
- Coordinate format: "(longitude,latitude)" string

## Code Style
- Use `styled-components` for styling
- Import order: React/Next.js, external libraries, components, hooks, utils
- Import statements should be organized by group with blank lines between
- Use async/await for async operations with try/catch blocks
- Use camelCase for variables/functions, PascalCase for components
- Prefer functional components with hooks over class components
- Handle errors with proper error logging and user feedback (toast notifications)
- Use React state for component-level state
- Include JSDoc comments for functions
- Use destructuring for props and state
- Prefer explicit null checks (if (!myVar)) over implicit

## Data Handling
- Use Supabase for data persistence
- Properly format coordinate strings as "(lng,lat)"
- API calls should be centralized in api.js
- Events have moderation states: pending, approved, rejected
- Image uploads for posters go through Supabase storage

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENWEATHERMAP_API_KEY=
```

## PWA Considerations
- Service worker handles offline functionality
- Dynamic imports for Leaflet components (SSR incompatible)
- iOS-specific "Add to Home Screen" prompts in InstallPrompt.js
- Manifest and icons in public/ directory