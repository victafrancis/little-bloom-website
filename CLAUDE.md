# Little Bloom Photography Website

React 18 + TypeScript + Vite + Tailwind site, deployed on Vercel. Serverless functions live in `api/`.

## Commands
- `npm run dev`: start the dev server (`/api` functions don't run here)
- `npm run build`: production build
- `npm run lint`: ESLint

## Releases
- Every change gets an entry at the top of `CHANGELOG.md` and a version bump in `package.json` and `package-lock.json`.

## General
- Use single quotes for all string literals
- Use named exports for components and utilities (e.g., `export function Component()`). Pages in `src/pages/` are the exception: they use default exports, which the router imports.
- Prefer const over let, avoid var
- Use arrow functions for functional components and event handlers

## TypeScript
- Enable strict type checking
- Define explicit types for component props using interfaces or type aliases
- Use type assertions sparingly, prefer proper typing
- Avoid any type, use unknown or specific types instead

## React/JSX
- Use multi-line JSX for elements with multiple props or nested children; keep simple elements on one line.
- Place closing tags on new lines with proper indentation
- Use descriptive prop names and values
- Destructure props in function parameters when possible

## Styling
- Use Tailwind CSS with the project's custom color palette
- Reference colors by name (e.g., `text-mustard`, `bg-sage`) rather than hex values
- Use semantic class names when extending Tailwind
- Group related classes logically in className strings

## File Organization
- Keep components in `src/components/` with .tsx extension
- Use `src/data/` for static data and configuration
- Place pages in `src/pages/` with routing in `src/routes/`
- Use `src/lib/` for utility functions and external service integrations

## Naming Conventions
- Use PascalCase for component names
- Use camelCase for variables, functions, and props
- Use UPPER_SNAKE_CASE for constants
- Prefix boolean props with "is" or "has" (e.g., isOpen, hasError)

## Imports
- Group imports: React first, then third-party libraries, then local imports
- Prefer named imports over default imports where possible

## Docs to read when relevant
Read these only when the task touches them:
- **Sentry/errors:** `docs/sentry-rules.md` when implementing error handling.
- **Instagram feed:** `docs/instagram-feed.md` when changing the Instagram section or its `api/instagram*` functions.
- **Galleries:** `docs/album-manager.md` when changing how gallery photos are stored, ordered or loaded (`src/lib/supabase.ts`), or the album manager.
