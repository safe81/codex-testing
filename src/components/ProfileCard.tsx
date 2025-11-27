import { MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types/profiles';
import VerifiedBadge from './VerifiedBadge';
import { INTEREST_OPTIONS, EXPERIENCE_LEVELS, RELATIONSHIP_TYPES } from '../data/interests';
import { SuccessButton } from './buttons';
import { useTranslation } from '../i18n/LanguageContext';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // --- Data & Compatibility ---
  const accountType = profile.accountType || (profile.type === 'SINGLE_F' || profile.type === 'SINGLE_M' ? 'USER' : profile.type) || 'USER';
  const verificationStatus = profile.verificationStatus || 'NONE';
  const relationshipType = profile.relationshipType || 'COUPLE'; 
  const experienceLevel = profile.experienceLevel || 'NEW';
  const interests = profile.interests || [];

  const relationshipLabel = RELATIONSHIP_TYPES.find(rt => rt.id === relationshipType)?.label;
  const experienceLabel = EXPERIENCE_LEVELS.find(el => el.id === experienceLevel)?.label;

  const getTypeInfo = () => {
    switch (accountType) {
        case 'COUPLE': return { label: 'Casal', color: 'bg-purple-500' };
        case 'USER':
            if (profile.type === 'SINGLE_F') return { label: 'Mulher', color: 'bg-pink-500' };
            if (profile.type === 'SINGLE_M') return { label: 'Homem', color: 'bg-blue-500' };
            return { label: 'Pessoa', color: 'bg-gray-500' };
        case 'CLUB': return { label: 'Clube', color: 'bg-orange-500' };
        case 'ORGANIZER': return { label: 'Organizador', color: 'bg-teal-500' };
        default: return { label: 'Perfil', color: 'bg-gray-500' };
    }
  };
  const typeInfo = getTypeInfo();
  
  const optimizedImageUrl = profile.mainPhotoUrl?.includes('unsplash.com')
    ? `${profile.mainPhotoUrl}&w=400&h=500&fit=crop`
    : profile.mainPhotoUrl;

  const handleNavigate = () => {
    navigate(`/profiles/${profile.id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate(); }}
      className="bg-gray-900 rounded-3xl overflow-hidden shadow-lg relative flex flex-col h-full border border-gray-800 transition-transform hover:scale-[1.02] cursor-pointer group"
    >
      {/* Image */}
      <div className="w-full aspect-[4/5] relative">
        {optimizedImageUrl ? (
          <img src={optimizedImageUrl} alt={profile.nickname} className="w-full h-full object-cover transition-opacity group-hover:opacity-90" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center transition-opacity group-hover:opacity-90">
            <User className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${typeInfo.color}`}>
          {typeInfo.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-pink-500 transition-colors">{profile.nickname}</h3>
          <VerifiedBadge verificationStatus={verificationStatus} />
        </div>

        <p className="text-gray-400 text-xs mb-3 flex-grow line-clamp-2">{profile.description ? t(profile.description) : ''}</p>

        <div className="flex items-center text-sm text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{profile.city ? `${profile.city}, ${profile.region}` : profile.region}</span>
        </div>

        {/* Lifestyle Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {relationshipLabel && <div className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md font-medium">{relationshipLabel}</div>}
          {experienceLabel && <div className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md font-medium">{experienceLabel}</div>}
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-4">
          {interests.slice(0, 3).map(interestId => {
            const interest = INTEREST_OPTIONS.find(i => i.id === interestId);
            return interest ? (
              <span key={interest.id} className="px-2 py-1 bg-emerald-900/50 text-emerald-300 text-xs rounded">
                {interest.label}
              </span>
            ) : null;
          })}
          {interests.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">+{interests.length - 3}</span>
          )}
        </div>
        
        <div className="flex-grow" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
            <span className="text-xs font-medium text-gray-400">Ativo</span>
          </div>
          {/* Note: We stopPropagation so clicking the button doesn't trigger the card click, though in this flow they do the same thing */}
          <div onClick={(e) => e.stopPropagation()}>
            <SuccessButton className="text-xs" onClick={handleNavigate}>
                {t('profile.actions.requestAccess')}
            </SuccessButton>
          </div>
        </div>
      </div>
    </div>
  );
}
