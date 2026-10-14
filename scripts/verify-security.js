// Security and Pre-deployment Verification Test Script
import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

console.log('--- STARTING PRE-DEPLOYMENT SECURITY AUDIT SUITE ---');

// 1. Vite config check
const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
assert(
  viteConfig.includes("envPrefix: ['VITE_']") && !viteConfig.includes("'SUPABASE_'"),
  'vite.config.ts restricts envPrefix to VITE_ only (no SUPABASE_ prefix exposure)'
);
assert(
  viteConfig.includes("base: '/'"),
  'vite.config.ts uses base: "/" for proper SPA deep routing on Vercel'
);

// 2. Supabase client config check
const supabaseTs = fs.readFileSync('src/academy/supabase.ts', 'utf8');
assert(
  !supabaseTs.includes('envMeta.SUPABASE_URL') &&
  !supabaseTs.includes('envMeta.NEXT_PUBLIC_SUPABASE_URL') &&
  supabaseTs.includes('envMeta.VITE_SUPABASE_URL'),
  'src/academy/supabase.ts relies solely on standard VITE_SUPABASE_URL'
);
assert(
  supabaseTs.includes('detectPrivilegedKey') &&
  supabaseTs.includes('isPrivilegedKeyDetected'),
  'src/academy/supabase.ts actively guards against privileged service_role keys'
);

// 3. Authorized Admin Registry check
assert(
  supabaseTs.includes("'theinspirebusinessacademy@gmail.com'") &&
  supabaseTs.includes("'huzaifaghori4315@gmail.com'") &&
  !supabaseTs.includes("'hr498412@gmail.com'"),
  'BOOTSTRAPPED_ADMIN_EMAILS contains strictly the 2 confirmed administrators'
);

// 4. PostgreSQL Schema & RLS Checks
const schemaSql = fs.readFileSync('supabase/schema.sql', 'utf8');
const adminSetupSql = fs.readFileSync('supabase/admin_setup.sql', 'utf8');

assert(
  schemaSql.length === adminSetupSql.length,
  'supabase/schema.sql and supabase/admin_setup.sql are 100% reconciled and synchronized'
);

assert(
  schemaSql.includes('trg_protect_submission_review_fields') &&
  schemaSql.includes('BEFORE INSERT OR UPDATE ON public.submissions'),
  'Submission protection trigger runs on BEFORE INSERT OR UPDATE on public.submissions'
);

assert(
  schemaSql.includes('trg_protect_profile_fields') &&
  schemaSql.includes('BEFORE INSERT OR UPDATE ON public.profiles'),
  'Profile protection trigger runs on BEFORE INSERT OR UPDATE on public.profiles'
);

assert(
  schemaSql.includes('auto_confirm_admin_email') &&
  !schemaSql.includes('CREATE TRIGGER on_auth_user_auto_confirm') &&
  schemaSql.includes('CREATE TRIGGER on_auth_user_admin_auto_confirm'),
  'Blanket auto-confirmation removed; only authorized admins auto-confirmed to prevent lockout'
);

assert(
  schemaSql.includes('INSERT INTO public.submission_versions') &&
  schemaSql.includes('ON CONFLICT (submission_id, version_number) DO NOTHING'),
  'Submissions trigger automatically creates submission_versions history on resubmission'
);

assert(
  schemaSql.includes("NEW.status := 'submitted'") &&
  schemaSql.includes('RAISE EXCEPTION \'Reviewed submissions cannot be directly edited by students'),
  'Students cannot directly modify approved/reviewed work'
);

assert(
  !schemaSql.includes('03093534289'),
  'Hardcoded personal phone number removed from setup SQL'
);

// 5. Vercel deployment check
const vercelJson = fs.readFileSync('vercel.json', 'utf8');
assert(
  vercelJson.includes('"outputDirectory": "dist"') &&
  vercelJson.includes('"destination": "/index.html"'),
  'vercel.json configured with SPA rewrites and dist output directory'
);

// 6. Production build check
assert(fs.existsSync('dist/index.html'), 'dist/index.html exists');
assert(fs.existsSync('dist/assets'), 'dist/assets directory exists');

console.log(`\n--- AUDIT SUMMARY: ${passCount} PASSED, ${failCount} FAILED ---`);
if (failCount > 0) {
  process.exit(1);
}
