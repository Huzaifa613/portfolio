import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Splash } from './screens/Splash';
import { Home } from './screens/Home';
import { Skills } from './screens/Skills';
import { Tasks } from './screens/Tasks';
import { Reports } from './screens/Reports';
import { Portfolio } from './screens/Portfolio';
import { Targets } from './screens/Targets';
import { DailyReportForm } from './screens/DailyReportForm';
import { WeeklyReportForm } from './screens/WeeklyReportForm';
import { MonthlyReportForm } from './screens/MonthlyReportForm';
import { ReportHistory } from './screens/ReportHistory';
import { Learning } from './screens/Learning';
import { Settings } from './screens/Settings';
import { Courses } from './screens/Courses';
import { CourseDetail } from './screens/CourseDetail';
import { Games } from './screens/Games';
import { QuizBattle } from './screens/games/QuizBattle';
import { PuzzleChallenge } from './screens/games/PuzzleChallenge';
import { MemoryGame } from './screens/games/MemoryGame';
import { EnemyShooter } from './screens/games/EnemyShooter';
import { BubbleShooter } from './screens/games/BubbleShooter';
import { Profile } from './screens/Profile';
import { Search } from './screens/Search';
import { ShortcutVault } from './screens/ShortcutVault';
import { Chatbot } from './screens/Chatbot';
import { BottomNav } from './components/BottomNav';
import { ScreenWrapper } from './components/ScreenWrapper';
import { setupNotifications } from './lib/notifications';

// Safe Add-On Modules (src/academy/** & src/admin/**)
import { AcademyAuthProvider } from './academy/AcademyAuthContext';
import { AcademyProtectedRoute } from './academy/AcademyProtectedRoute';
import { AcademyLogin } from './academy/AcademyLogin';
import { AcademyHub } from './academy/AcademyHub';
import { SubmitWork } from './academy/SubmitWork';
import { MySubmissions } from './academy/MySubmissions';
import { AcademyProfile } from './academy/AcademyProfile';
import { PublicPortfolioPortal } from './academy/PublicPortfolioPortal';
import { StudentAttendance } from './academy/StudentAttendance';
import { StudentNotifications } from './academy/StudentNotifications';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminStudents } from './admin/AdminStudents';
import { AdminStudentDetail } from './admin/AdminStudentDetail';

function NotFoundScreen({ defaultPath = '/home' }: { defaultPath?: string }) {
  const navigate = useNavigate();
  return (
    <ScreenWrapper className="bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center max-w-xs w-full space-y-3">
        <p className="text-3xl font-extrabold text-blue-900">404</p>
        <h1 className="text-base font-bold text-gray-900">Page Not Found</h1>
        <p className="text-xs text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(defaultPath, { replace: true })}
            className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Return to Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/academy', { replace: true })}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
          >
            Open Student Portal
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Existing Offline App Routes (No Login Required) */}
      <Route path="/" element={<Splash />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/daily" element={<DailyReportForm />} />
      <Route path="/reports/weekly" element={<WeeklyReportForm />} />
      <Route path="/reports/monthly" element={<MonthlyReportForm />} />
      <Route path="/reports/history" element={<ReportHistory />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/targets" element={<Targets />} />
      <Route path="/learning" element={<Learning />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/games" element={<Games />} />
      <Route path="/games/quiz" element={<QuizBattle />} />
      <Route path="/games/puzzle" element={<PuzzleChallenge />} />
      <Route path="/games/memory" element={<MemoryGame />} />
      <Route path="/games/shooter" element={<EnemyShooter />} />
      <Route path="/games/bubble" element={<BubbleShooter />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/shortcuts" element={<ShortcutVault />} />
      <Route path="/chatbot" element={<Chatbot />} />

      {/* Public Visitor Showcase & Verification (No Login Required) */}
      <Route path="/public-portfolio" element={<PublicPortfolioPortal />} />
      <Route path="/academy/public-portfolio" element={<PublicPortfolioPortal />} />

      {/* Student Portal Routes (/academy/*) */}
      <Route path="/login" element={<Navigate to="/academy/login" replace />} />
      <Route path="/academy/login" element={<AcademyLogin />} />
      <Route
        path="/academy"
        element={
          <AcademyProtectedRoute allowedRoles={['student', 'admin']}>
            <AcademyHub />
          </AcademyProtectedRoute>
        }
      />
      <Route
        path="/academy/submit"
        element={
          <AcademyProtectedRoute allowedRoles={['student', 'admin']}>
            <SubmitWork />
          </AcademyProtectedRoute>
        }
      />
      <Route
        path="/academy/submissions"
        element={
          <AcademyProtectedRoute allowedRoles={['student', 'admin']}>
            <MySubmissions />
          </AcademyProtectedRoute>
        }
      />
      <Route
        path="/academy/profile"
        element={
          <AcademyProtectedRoute allowedRoles={['student', 'admin']}>
            <AcademyProfile />
          </AcademyProtectedRoute>
        }
      />
      <Route
        path="/academy/attendance"
        element={
          <AcademyProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentAttendance />
          </AcademyProtectedRoute>
        }
      />
      <Route
        path="/academy/notifications"
        element={
          <AcademyProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentNotifications />
          </AcademyProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundScreen defaultPath="/home" />} />
    </Routes>
  );
}

// Safe URL normalizer: If opened via direct path URL (e.g. /admin or /admin/login) without hash,
// normalize immediately to HashRouter format so HashRouter routes properly.
if (typeof window !== 'undefined') {
  const pathname = window.location.pathname;
  if (pathname && pathname !== '/' && !window.location.hash) {
    const search = window.location.search || '';
    window.location.replace(`${window.location.origin}/#${pathname}${search}`);
  } else if (window.location.hash && !window.location.hash.startsWith('#/')) {
    window.location.hash = '#/' + window.location.hash.slice(1);
  }
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
      <Route
        path="/admin/students"
        element={
          <AdminLayout>
            <AdminStudents />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/students/:id"
        element={
          <AdminLayout>
            <AdminStudentDetail />
          </AdminLayout>
        }
      />
      <Route
        path="*"
        element={
          <AdminLayout>
            <NotFoundScreen defaultPath="/admin" />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

function AppContainer() {
  const location = useLocation();

  // Route directly to Admin Console if path is /admin or starts with /admin/
  const isAdminRoute =
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/') ||
    (typeof window !== 'undefined' &&
      (window.location.hash === '#/admin' || window.location.hash.startsWith('#/admin/')));

  if (isAdminRoute) {
    return <AdminRoutes />;
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-gray-900 overflow-hidden relative">
      <div className="w-full max-w-[400px] h-[100dvh] sm:max-h-[850px] sm:h-[90vh] bg-white relative overflow-hidden flex flex-col shadow-2xl sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800">
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <AppRoutes />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <AcademyAuthProvider>
      <HashRouter>
        <AppContainer />
      </HashRouter>
    </AcademyAuthProvider>
  );
}
