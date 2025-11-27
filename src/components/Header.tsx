import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSelector from './settings/LanguageSelector';
import { auth } from '../services/firebase';

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const handleBack = () => {
      navigate(-1);
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm text-white p-4 shadow-md sticky top-0 z-40 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
             <button onClick={handleBack} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Voltar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
            <Link to="/explore" className="text-2xl font-bold text-pink-500">
            XLife
            </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/explore" className="text-base hover:text-pink-500 transition-colors">
            {t('header.explore')}
          </Link>
          <Link to="/events" className="text-base hover:text-pink-500 transition-colors">
            {t('header.events')}
          </Link>
          <Link to="/clubs" className="text-base hover:text-pink-500 transition-colors">
            {t('header.clubs')}
          </Link>
          <Link to="/settings" className="text-base hover:text-pink-500 transition-colors">
            {t('header.settings')}
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
             <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
               Language
             </button>
             {/* Simple Dropdown for desktop header */}
             <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2 hidden group-hover:block">
                <LanguageSelector small className="flex-col" />
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
