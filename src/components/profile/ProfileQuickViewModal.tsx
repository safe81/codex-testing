import React, { useRef } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Profile } from '../../types/profiles';
import ProfileInfoSummary from './ProfileInfoSummary';
import ProfileInterestsChips from './ProfileInterestsChips';
import VerifiedBadge from '../VerifiedBadge';
import { User, Users, Building2, X } from 'lucide-react';
import { blockUser, reportUser } from '../../services/safety';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';

type ProfileQuickViewModalProps = {
  profile: Profile | null;
  open: boolean;
  onClose: () => void;
  mode: 'SINGLE' | 'COUPLE';
  onLike?: (profile: Profile) => void;
  onPass?: (profile: Profile) => void;
  onOpenChat?: (profile: Profile) => void;
  onViewFullProfile?: (profile: Profile) => void; // New prop for Couples/Clubs
  showSafetyActions?: boolean;
};

export default function ProfileQuickViewModal({
  profile,
  open,
  onClose,
  mode,
  onLike,
  onPass,
  onOpenChat,
  onViewFullProfile,
  showSafetyActions = false
}: ProfileQuickViewModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [user] = useAuthState(auth);

  if (!open || !profile) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Helper for placeholder icon
  let PlaceholderIcon = User;
  if (profile.accountType === 'COUPLE') PlaceholderIcon = Users;
  if (profile.accountType === 'CLUB') PlaceholderIcon = Building2;

  const handleBlock = async () => {
    if (!user) return;
    if (confirm(t('safety.block.confirmTitle'))) {
        try {
            await blockUser(user.uid, profile.id);
            alert(t('safety.block.success'));
            onClose();
        } catch (e) {
            console.error(e);
            alert("Erro ao bloquear utilizador.");
        }
    }
  };

  const handleReport = async () => {
      if (!user) return;
      if(confirm(t('safety.report.profile.title'))) {
          try {
              await reportUser(user.uid, profile.id);
              alert(t('safety.report.profile.success'));
              onClose();
          } catch (e) {
              console.error(e);
              alert("Erro ao denunciar utilizador.");
          }
      }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-gray-900 w-full max-w-md h-full max-h-[85vh] md:h-auto rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-800 relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Image Area */}
          <div className="relative w-full aspect-[4/5] bg-gray-800">
            {profile.mainPhotoUrl ? (
              <img 
                src={profile.mainPhotoUrl} 
                alt={profile.nickname} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <PlaceholderIcon size={64} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
            
            {/* Content Overlay (Bottom of image) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-gray-900 to-transparent">
               <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">
                    {profile.nickname}
                  </h2>
                  <VerifiedBadge verificationStatus={profile.verificationStatus} />
               </div>
               
               <ProfileInfoSummary profile={profile} className="mb-3" />
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 pt-2 space-y-6 bg-gray-900">
            
            {/* About */}
            {profile.description && (
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">{t('profile.aboutTitle')}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t(profile.description) || profile.description}
                </p>
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">{t('profile.interestsTitle')}</h4>
                <ProfileInterestsChips interests={profile.interests} />
              </div>
            )}

            {/* Safety Actions (Text Links) */}
            {showSafetyActions && (
                <div className="pt-4 border-t border-gray-800 flex justify-center gap-6">
                    <button onClick={handleBlock} className="text-xs text-red-400 hover:text-red-300 uppercase font-bold tracking-wide">
                        {t('safety.block.button')}
                    </button>
                    <button onClick={handleReport} className="text-xs text-gray-500 hover:text-gray-300 uppercase font-bold tracking-wide">
                        {t('safety.report.profile.title')}
                    </button>
                </div>
            )}
            
            {/* Padding for sticky footer */}
            <div className="h-20"></div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-center gap-6 z-20">
          {mode === 'SINGLE' ? (
            <>
              <button 
                onClick={() => onPass && onPass(profile)}
                className="w-14 h-14 rounded-full bg-gray-800 border-2 border-red-500/50 text-red-500 flex items-center justify-center text-2xl hover:bg-red-500/10 hover:scale-105 transition-all shadow-lg"
              >
                ✕
              </button>
              
              {/* If it's a match or logic allows chat */}
              {onOpenChat && (
                  <button 
                    onClick={() => onOpenChat(profile)}
                    className="w-12 h-12 rounded-full bg-gray-800 border border-gray-600 text-blue-400 flex items-center justify-center hover:bg-blue-500/10 transition-all"
                    title={t('profile.actions.sendMessage')}
                  >
                    💬
                  </button>
              )}

              <button 
                onClick={() => onLike && onLike(profile)}
                className="w-14 h-14 rounded-full bg-gray-800 border-2 border-green-500/50 text-green-500 flex items-center justify-center text-2xl hover:bg-green-500/10 hover:scale-105 transition-all shadow-lg"
              >
                ❤️
              </button>
            </>
          ) : (
            /* COUPLE MODE ACTIONS */
            <>
               {onViewFullProfile && (
                   <button 
                    onClick={() => onViewFullProfile(profile)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold text-sm transition-colors border border-gray-700"
                   >
                     Ver Perfil Completo
                   </button>
               )}
               
               {onOpenChat && (
                   <button 
                    onClick={() => onOpenChat(profile)}
                    className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg"
                   >
                     {t('profile.actions.sendMessage')}
                   </button>
               )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
