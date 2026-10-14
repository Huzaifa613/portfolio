# Inspire Business Academy — Supabase Architecture & Migration Audit

## 1. Active Backend Architecture (100% Supabase)

- **Authentication**: Supabase Auth (`@supabase/supabase-js`)
  - Email/Password Sign-In, Student Registration, Password Reset, Google OAuth, and Session Persistence (`src/academy/AcademyAuthContext.tsx`).
  - Dedicated Admin Login at `/admin/login` (`src/admin/AdminLogin.tsx`) and Student Login at `/academy/login` (`src/academy/AcademyLogin.tsx`).
- **Database**: Supabase PostgreSQL (`public` schema)
  - Tables: `profiles`, `admins`, `assignments`, `submissions`, `submission_files`, `submission_marks_history`, `delete_requests`, `public_portfolios`, `attendance`, `announcements`.
  - Provisioning & Setup SQL: `supabase/admin_setup.sql` and `supabase/schema.sql`.
- **File Storage**: Supabase Storage
  - Private bucket `academy-submissions` for student assignments and portfolio uploads (accessed via signed URLs).
  - Public bucket `public-portfolios` for admin-approved public showcase previews, with automatic fallback to `public.submission_files`.
- **Authorization & Security**: PostgreSQL Row Level Security (RLS)
  - Enforced across all 10 tables and both Storage buckets via `public.is_admin()` and `public.protect_profile_fields()`.
- **Offline Student Productivity App**:
  - Browser `localStorage` + `IndexedDB` (`src/screens/**`, `src/store/**`, `src/lib/db.ts`) preserved intact.

## 2. Configured Administrator Accounts

1. **Primary Admin 1**: `theinspirebusinessacademy@gmail.com` (`ADMIN-01` — Adeel Bhatti)
2. **Primary Admin 2**: `huzaifaghori4315@gmail.com` (`ADMIN-02` — Huzaifa Ghori)
3. **Legacy Admin Allowlist**: `hr498412@gmail.com`
