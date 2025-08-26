# NBKRIST Student Portal - AI Coding Instructions

## Architecture Overview

This is a React/TypeScript single-page app with Supabase backend that provides student portal functionality without requiring student logins. The app fetches student data (attendance, marks, personal details) from Supabase Storage using a structured file system approach.

### Core Components Structure
- **Services Layer**: `src/services/` - Business logic (studentService, blogService, adminService)
- **Storage Layer**: `studentStorageService.ts` - Handles file-based data retrieval from Supabase Storage  
- **Configuration**: `src/config/supabase.ts` - Centralized env vars and path templates
- **Types**: `src/types/` - TypeScript interfaces (student.ts, blog.ts, logo.ts)

## Key Patterns

### Data Retrieval Pattern
Student data is stored as JSON files in Supabase Storage following this structure:
```
student_data/{academic_year}/{year_sem}/{roll_number}/
├── personal_details.json
├── attendance.json  
├── mid_marks.json
└── {roll_number}.json (branch/section info)
```

Always use `fetchStudentDetails()` from `studentService.ts` - it delegates to `studentStorageService.ts` which handles caching, retries, and multipart form data parsing.

### Environment Configuration
- Environment variables are managed in `src/config/supabase.ts` with fallbacks
- Use `getEnvVar()`, `getBooleanEnvVar()`, `getNumberEnvVar()` helpers
- Required vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `VITE_SUPABASE_STORAGE_BUCKET`

### Error Handling
- Global error handler in `src/utils/errorHandler.ts` - initialized in App.tsx
- Services use try-catch with detailed logging
- UI shows graceful "No data available" for missing student records

## Development Workflows

### Build & Deploy
- Dev: `npm run dev` (Vite dev server on :8080)
- Build: `npm run build` (TypeScript compilation + Vite build)
- Deploy: `npm run deploy` (calls `build-gh-pages.sh` → gh-pages)
- The `build-gh-pages.sh` script handles env var injection for GitHub Pages

### Testing
- Unit tests: Use Vitest (see `src/utils/maskData.test.ts` example)
- Admin functions: Use `scripts/create-admin.js` for creating admin users
- Database: Run migrations in `supabase/migrations/` chronologically

### Admin System
- Plain-text password authentication (for simplicity)
- Admin routes protected by `AdminAuthGuard.tsx`
- Admin auth managed via `useAdminAuth()` hook
- Blog system with pending/published status workflow

## Project Conventions

### Service Layer Pattern
Each major feature has a dedicated service:
- `studentService.ts` → `studentStorageService.ts` (storage implementation)
- `blogService.ts` (CRUD operations)
- `adminService.ts` (authentication)

### Component Organization
- Pages in `src/pages/` for route components
- Reusable components in `src/components/`
- UI primitives in `src/components/ui/` (shadcn/ui)
- Custom hooks in `src/hooks/`

### Path Resolution Strategy
The app tries multiple path patterns when fetching student data:
1. `student_details/{academicYear}/{yearOfStudy}/{rollNumber}`
2. `{academicYear}/{yearOfStudy}/{rollNumber}`

This handles legacy data structures and new formats gracefully.

## Integration Points

### Supabase Integration
- Client setup in `src/lib/supabase.ts` with service role key for storage access
- Configuration centralized in `src/config/supabase.ts`
- Bucket existence checking on app startup
- Real-time visitor counter using Supabase realtime subscriptions

### External Dependencies
- **shadcn/ui**: Component system (configured in `components.json`)
- **React Query**: Data fetching and caching (setup in App.tsx)
- **React Router**: SPA routing with history API fallback
- **GitHub Pages**: Static hosting with custom domain support

## Critical Implementation Details

### Multipart Form Data Handling
The storage service can parse both JSON and multipart form data files (common when data is uploaded via web forms). See `processMultipartData()` in `studentStorageService.ts`.

### Caching Strategy
- In-memory cache with configurable TTL (default 5 minutes)
- Cache key: `${rollNumber}-${academicYear}-${yearSem}`
- Cache can be disabled via `VITE_ENABLE_CACHE=false`

### Security Considerations
- Service role key hardcoded in `src/lib/supabase.ts` (storage access only)
- Admin passwords stored as plain text (documented limitation)
- Student data fetched without authentication (by design)

---

## ByteRover MCP Integration
Always use `byterover-retrieve-knowledge` tool to get related context before any tasks.
Always use `byterover-store-knowledge` to store critical information after successful tasks.