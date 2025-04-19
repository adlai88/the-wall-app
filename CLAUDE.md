# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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