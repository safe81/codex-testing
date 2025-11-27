import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Pages - Public
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Pages - Onboarding
import OnboardingPage from './pages/OnboardingPage';
import SingleOnboardingPage from './pages/SingleOnboardingPage';

// Pages - Settings Hub
import AccountSettingsPage from './pages/settings/AccountSettingsPage';
import PrivacySettingsPage from './pages/settings/PrivacySettingsPage';
import SecuritySettingsPage from './pages/settings/SecuritySettingsPage';

// Pages - Singles Area
import SinglesHomePage from './pages/SinglesHomePage';
import SinglesExplorePage from './pages/SinglesExplorePage';
import SinglesPreferencesPage from './pages/SinglesPreferencesPage';
import SinglesMatchesPage from './pages/SinglesMatchesPage';
import SinglesChatPage from './pages/SinglesChatPage';

// Pages - Couples/Main Area
import ExplorePage from './pages/ExplorePage';
import ExploreSinglesPage from './pages/ExploreSinglesPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import MyReservationsPage from './pages/MyReservationsPage';

// Pages - Legacy/Misc
import ChooseAccountTypePage from './pages/ChooseAccountTypePage';

// Components - Debug
import { DebugTools } from './components/DebugTools';

// Layouts & Components
import RequireAuth from './components/RequireAuth';
import MainLayout from './components/MainLayout';
import SinglesLayout from './components/SinglesLayout';
import SettingsLayout from './layouts/SettingsLayout';

export default function App() {
  useEffect(() => {
    console.log('[DEBUG] App mounted – routes are configured');
  }, []);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding & Account Setup (Protected) */}
        <Route path="/choose-account-type" element={<RequireAuth><ChooseAccountTypePage /></RequireAuth>} />
        <Route path="/onboarding" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
        <Route path="/onboarding-single" element={<RequireAuth><SingleOnboardingPage /></RequireAuth>} />

        {/* Settings Hub (Shared, Protected) */}
        <Route path="/settings" element={<RequireAuth><SettingsLayout /></RequireAuth>}>
          <Route index element={<Navigate to="account" replace />} />
          <Route path="account" element={<AccountSettingsPage />} />
          <Route path="privacy" element={<PrivacySettingsPage />} />
          <Route path="security" element={<SecuritySettingsPage />} />
        </Route>

        {/* DEV TOOLS ROUTE */}
        <Route path="/dev/debug" element={<RequireAuth><DebugTools /></RequireAuth>} />

        {/* Singles Area (Protected, Singles Only) */}
        <Route path="/singles" element={<RequireAuth allowedAccountTypes={['USER']}><SinglesLayout /></RequireAuth>}>
          <Route index element={<SinglesHomePage />} />
          <Route path="explore" element={<SinglesExplorePage />} />
          <Route path="preferences" element={<SinglesPreferencesPage />} />
          <Route path="matches" element={<SinglesMatchesPage />} />
          <Route path="chat/:conversationId" element={<SinglesChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Shared Profile Detail Route */}
        <Route path="/profiles/:userId" element={<RequireAuth><ProfileDetailPage /></RequireAuth>} />

        {/* Couples/Main Area (Protected, Couples/Clubs/Organizers) */}
        <Route element={<RequireAuth allowedAccountTypes={['COUPLE', 'CLUB', 'ORGANIZER']}><MainLayout /></RequireAuth>}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/singles" element={<ExploreSinglesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<RequireAuth><Navigate to="/" replace /></RequireAuth>} />
      </Routes>
    </>
  );
}
