import type { Profile } from '../../types/profiles';
import { useTranslation } from '../../i18n/LanguageContext';

interface MatchOverlayProps {
  profile: Profile;
  onClose: () => void;
  onGoToChat: () => void;
}

export default function MatchOverlay({ profile, onClose, onGoToChat }: MatchOverlayProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-pink-500 rounded-2xl max-w-sm w-full p-8 text-center shadow-[0_0_50px_rgba(236,72,153,0.3)] animate-bounce-in">
        <div className="text-5xl mb-4">✨</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
          {t('singles.matchOverlay.title')}
        </h2>
        <p className="text-gray-300 mb-6">
          {t('singles.matchOverlay.subtitle', { name: profile.nickname })}
        </p>

        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-500 mb-8 shadow-lg">
          <img 
            src={profile.mainPhotoUrl || 'https://via.placeholder.com/150'} 
            alt={profile.nickname} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={onGoToChat}
            className="w-full py-3 rounded-xl bg-pink-600 font-bold text-white hover:bg-pink-700 transition-colors shadow-lg"
          >
            {t('singles.matchOverlay.chatButton')}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-800 font-semibold text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {t('singles.matchOverlay.keepPlaying')}
          </button>
        </div>
      </div>
    </div>
  );
}
