# Inspire Business Academy — Supabase Security Specification (`security_spec.md`)

## 1. Data Invariants & PostgreSQL Row Level Security (RLS)

1. **Identity & Role Integrity (`public.profiles` & `public.admins`)**:
   - A student can only read (`SELECT`) and update (`UPDATE`) their own profile row (`auth.uid() = id`).
   - A student cannot list or read another student's profile (PII isolation for `email`, `phone`, `admission_date`).
   - During profile `UPDATE`, the `BEFORE UPDATE` trigger `public.protect_profile_fields()` prevents any non-admin user from modifying `role`, `is_active`, `is_approved`, `approval_status`, `skill`, or `admission_date`.
   - Only `public.is_admin()` (verified against `public.admins`, `public.profiles` where `role IN ('admin', 'super_admin') AND is_active = true`, and authorized admin emails) can read/manage all student profiles.
2. **Submission Immutability (`public.submissions`, `public.submission_files`, & Storage bucket `academy-submissions`)**:
   - A student can `INSERT` a submission only with `student_id = auth.uid()`.
   - Once created, a student has **ZERO** `UPDATE` or `DELETE` permissions on `public.submissions`, `public.submission_files`, or `storage.objects` in `academy-submissions`.
   - A student can `SELECT` only their own non-deleted submissions (`auth.uid() = student_id AND is_deleted = false`).
   - Only an authenticated Admin (`public.is_admin()`) can `UPDATE` review fields (`status`, `rating`, `marks`, `max_marks`, `feedback`, `reviewed_by`, `reviewed_at`, `is_deleted`, `updated_at`).
3. **Delete Request Integrity (`public.delete_requests`)**:
   - A student can `INSERT` and `SELECT` delete requests only where `auth.uid() = student_id`.
   - A student cannot `UPDATE` or `DELETE` a delete request. Only an Admin (`public.is_admin()`) can `UPDATE` a delete request to `'approved'` or `'rejected'`.
4. **Marks Audit Log (`public.submission_marks_history`)**:
   - Only `public.is_admin()` can `INSERT` marks history records; students can only read history for their own submissions (`auth.uid() = student_id`).
5. **Public Portfolio Showcase (`public.public_portfolios` & Storage bucket `public-portfolios`)**:
   - Contains zero private PII (no email or phone); only approved public showcase items (`is_public = true`) can be read by public visitors.
   - Only `public.is_admin()` can create, update, or delete public portfolio showcase records.
6. **Student Attendance (`public.attendance`)**:
   - Only `public.is_admin()` can mark or update attendance records; students can only read their own attendance records (`auth.uid() = student_id`).
7. **Academy Announcements (`public.announcements`)**:
   - Only `public.is_admin()` can create, update, or delete announcements; visitors and students can read published announcements (`is_published = true`).
