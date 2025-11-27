import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Profile } from '../../types/profiles';
import type { SwipeDirection } from '../../types/matching';
import SingleCard from './SingleCard';

type SingleDeckProps = {
  deck: Profile[];
  loading: boolean;
  error?: Error | null; // Made optional to match prompt suggestion
  onSwipe: (profile: Profile, direction: SwipeDirection) => Promise<void>;
  onOpenProfile?: (profile: Profile) => void; // New prop
};

export default function SingleDeck({ deck, loading, error, onSwipe, onOpenProfile }: SingleDeckProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [swiping, setSwiping] = useState(false);

  const currentProfile = deck[0];

  const handleSwipeAction = async (direction: SwipeDirection) => {
    if (swiping || !currentProfile) return;
    setSwiping(true);
    try {
      await onSwipe(currentProfile, direction);
    } finally {
      setSwiping(false);
    }
  };

  // Use passed handler or default to navigation (backward compatibility)
  const handleCardClick = () => {
    if (onOpenProfile && currentProfile) {
        onOpenProfile(currentProfile);
    } else if (currentProfile) {
        navigate(`/profiles/${currentProfile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-sm mx-auto bg-gray-800 rounded-3xl animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-700 mb-4"></div>
        <p className="text-gray-500 font-medium">{t('singles.home.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-sm mx-auto text-center p-6">
        <p className="text-red-400 mb-4 font-medium">⚠️ {t('singles.home.error')}</p>
        <p className="text-xs text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-sm mx-auto text-center p-8 bg-gray-800 rounded-3xl border border-gray-700 shadow-xl">
        <div className="text-6xl mb-6 animate-bounce">👀</div>
        <h3 className="text-2xl font-bold text-white mb-3">{t('singles.home.emptyDeck')}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">{t('singles.home.emptyDeckSubtitle')}</p>
        
        <div className="space-y-3 w-full">
            <button 
                onClick={() => navigate('/singles/explore')}
                className="w-full py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
                {t('singles.home.ctaExplore')}
            </button>
            <button 
                onClick={() => navigate('/singles/preferences')}
                className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
                {t('singles.home.ctaPreferences')}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
      <div className="w-full relative group cursor-pointer" onClick={handleCardClick}>
        <SingleCard profile={currentProfile} />
      </div>

      <div className="flex items-center justify-center gap-8 pt-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleSwipeAction('PASS'); }}
          disabled={swiping}
          aria-label={t('singles.home.actions.pass')}
          className="w-16 h-16 rounded-full bg-gray-900 border-2 border-gray-600 text-red-500 flex items-center justify-center text-3xl hover:bg-red-500/10 hover:border-red-500 hover:scale-110 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✕
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); handleSwipeAction('LIKE'); }}
          disabled={swiping}
          aria-label={t('singles.home.actions.like')}
          className="w-16 h-16 rounded-full bg-gray-900 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center text-3xl hover:bg-emerald-500/10 hover:scale-110 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
