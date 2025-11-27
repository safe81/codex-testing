import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { useTranslation } from '../i18n/LanguageContext';

export default function SettingsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 py-4 text-center text-sm font-medium border-b-2 transition-colors ${
      isActive
        ? 'border-pink-500 text-pink-500'
        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="flex items-center h-16 px-4 relative justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-4 p-2 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">{t('settings.title')}</h1>
        </div>

        {/* Tabs */}
        <nav className="flex border-b border-gray-800">
          <NavLink to="/settings/account" className={navLinkClass}>
            {t('settings.tab.account')}
          </NavLink>
          <NavLink to="/settings/privacy" className={navLinkClass}>
            {t('settings.tab.privacy')}
          </NavLink>
          <NavLink to="/settings/security" className={navLinkClass}>
            {t('settings.tab.security')}
          </NavLink>
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        <Outlet />
      </div>
    </div>
  );
}
