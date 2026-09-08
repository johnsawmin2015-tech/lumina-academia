# Lumina Academia

A role-oriented academic timetable management demo built with React, TypeScript, and Vite. The interface is branded as **Academic Suite** for UCS Mandalay and provides separate admin and student experiences for schedules, approvals, analytics, profiles, and learning resources.

> [!IMPORTANT]
> The current application is a frontend prototype. Authentication, registration, schedules, and resources use mock or browser-local data. A Supabase client, generated types, and a database migration are included, but the feature pages are not yet wired to Supabase.

## Features

### Administration

- Dashboard summaries for total, draft, pending, approved, and locked schedules
- Schedule creation, editing, deletion, approval, rejection, and locking actions
- Inline detection of overlapping rooms, instructors, and year/section classes
- Validation that prevents classes from overlapping the 12:00-13:00 lunch break
- Deterministic timetable generation from a predefined curriculum and room list
- Table and card timetable views with year, section, and day filters
- Analytics for room usage, instructor workload, schedule status, day and year distribution, peak time, and timetable density

### Students

- Demo student sign-in and client-side role-aware routes
- Timetable view initially limited to the signed-in student's year and section
- Upcoming-class panel and weekly schedule summaries
- Profile page with computed class, subject, instructor, room, and busiest-day statistics
- Searchable, subject-grouped learning-resource catalog
- UI-level resource access window: after 16:00 and before 09:00 on weekdays, with unrestricted weekend access

### Interface

- Responsive light and dark themes with the preference stored in the browser
- Animated transitions and responsive dashboard layouts
- Reusable Radix UI and shadcn-style components
- Toast notifications, dialogs, form validation, and loading states

## Tech Stack

| Area | Technologies |
| --- | --- |
| Application | React 18, TypeScript, Vite 5, SWC |
| Routing and state | React Router 6, React Context, TanStack Query |
| UI and styling | Tailwind CSS 3, Radix UI, class-variance-authority, Lucide React |
| Forms and validation | React Hook Form, Zod |
| Motion and charts | Framer Motion, Recharts |
| Backend scaffold | Supabase JavaScript client, PostgreSQL migration, row-level security policies |
| Quality tooling | ESLint, Vitest, Testing Library, jsdom |

## Getting Started

### Prerequisites

- Node.js
- npm

The repository does not currently declare a specific Node.js engine version.

### Installation

```bash
git clone https://github.com/johnsawmin2015-tech/lumina-academia.git
cd lumina-academia
npm ci
npm run dev
```

The Vite development server is configured for [http://localhost:8080](http://localhost:8080).

### Demo Accounts

These credentials are hard-coded for the current demo and must not be reused for a real deployment.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@university.edu` | `admin123` |
| Student | `student@university.edu` | `student123` |

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Build using Vite's development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the repository |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## Configuration

The generated Supabase client reads the following Vite environment variables:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are consumed by `src/integrations/supabase/client.ts`. `VITE_SUPABASE_PROJECT_ID` is present in the repository environment configuration, while the Supabase project reference is also recorded in `supabase/config.toml`.

Because variables prefixed with `VITE_` are exposed to browser code, never place a Supabase service-role key or another private secret in them. Keep environment-specific values out of new commits.

### Supabase Schema Scaffold

The included migration defines:

- `app_role` values for admins and students
- `user_roles`, `profiles`, `schedules`, and `resources` tables
- Profile creation and `updated_at` triggers
- Helper functions for role, year, and section lookup
- Row-level security policies for admin management and student-scoped reads

This schema is not currently the application's active data source.

## How Data Works Today

| Concern | Current implementation |
| --- | --- |
| Authentication | Hard-coded demo credentials in `AuthContext`; the selected user is saved under `academic_auth` in `localStorage` |
| Schedules | Seeded from `src/data/mockData.ts` and persisted under `academic_schedules` in `localStorage` |
| Registration | Form validation, simulated delay, success notification, and redirect only |
| Learning resources | In-file mock metadata filtered by the demo student's year and section |
| Resource access | Client-clock UI check; no server-side enforcement |
| Supabase | Client, generated database types, config, and migration scaffold only |

## Project Structure

```text
.
├── public/                         # Static assets
├── src/
│   ├── components/
│   │   ├── admin/                  # Schedule forms, approvals, conflicts, and stats
│   │   ├── auth/                   # Client-side protected-route wrapper
│   │   ├── layout/                 # Admin/student shells, header, theme controls
│   │   ├── timetable/              # Table and card timetable components
│   │   └── ui/                     # Reusable interface primitives
│   ├── contexts/                   # Authentication and theme state
│   ├── data/                       # Mock users and schedules
│   ├── integrations/supabase/      # Generated Supabase client and types
│   ├── lib/                        # Scheduling, conflict, access, and utility logic
│   ├── pages/                      # Landing, admin, student, and not-found routes
│   ├── test/                       # Vitest setup and current example test
│   ├── types/                      # Application domain types
│   ├── App.tsx                     # Providers and route map
│   └── main.tsx                    # React entry point
├── supabase/                       # Supabase config and migration
├── package.json                    # Dependencies and scripts
├── tailwind.config.ts              # Tailwind theme configuration
├── vite.config.ts                  # Vite development/build configuration
└── vitest.config.ts                # Test configuration
```

## Routes

| Access | Route | Purpose |
| --- | --- | --- |
| Public | `/` | Landing page |
| Public | `/admin/login` | Admin demo sign-in |
| Public | `/student/login` | Student demo sign-in |
| Public | `/student/register` | Simulated student registration |
| Admin | `/admin/dashboard` | Overview and schedule creation |
| Admin | `/admin/schedules` | Timetable management |
| Admin | `/admin/approvals` | Pending approval and lock workflow |
| Admin | `/admin/analytics` | Scheduling analytics |
| Student | `/student/timetable` | Student timetable and upcoming class |
| Student | `/student/profile` | Profile and schedule summary |
| Student | `/student/resources` | Time-gated mock resource catalog |

## Testing and Verification

Run the local checks before opening a pull request:

```bash
npm run lint
npm test
npm run build
```

The test suite currently contains only a placeholder assertion, so a passing test command does not validate the scheduling, authentication, resource-access, or approval flows.

## Deployment Notes

Create the static production bundle with:

```bash
npm run build
```

Vite writes the build output to `dist/`. No hosting-platform configuration is currently included. Because the application uses `BrowserRouter`, a static host must rewrite unknown application routes to `index.html`.

## Current Limitations

- Authentication and role checks run entirely in the browser and are not a security boundary.
- Student registration does not create or persist an account.
- Schedule changes are local to one browser and are not synchronized between users or devices.
- The Supabase schema and client are not connected to the current UI data flow.
- Resource entries are mock metadata; the displayed download buttons are not connected to files or URLs.
- Resource time restrictions depend on the user's device clock and are enforced only by disabling UI controls.
- The auto-scheduler is deterministic, not AI-driven; the current admin button invokes it specifically for Year 2, Class A.
- Newly created schedules start as drafts, but there is no implemented draft-to-pending submission action.
- Only one placeholder unit test is included, and no CI workflow is present.
- Both npm and Bun lockfiles are committed; contributors should agree on one package manager to avoid dependency drift.
- The HTML title, description, and social metadata still contain Lovable placeholders.

## Contributing

Keep changes focused, avoid committing credentials, and run the lint, test, and build commands before submitting a pull request. Functional changes should include tests for the affected scheduling or access-control behavior.

## License

This repository does not currently include a license file.
