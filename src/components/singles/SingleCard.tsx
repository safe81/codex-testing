import type { Profile } from '../../types/profiles';
import { AGE_RANGES, INTEREST_OPTIONS } from '../../data/interests';
import { useTranslation } from '../../i18n/LanguageContext';
import VerifiedBadge from '../VerifiedBadge';

type SingleCardProps = {
  profile: Profile;
};

export default function SingleCard({ profile }: SingleCardProps) {
  const { t } = useTranslation();

  const getAgeLabel = (id: string | undefined) => AGE_RANGES.find(a => a.id === id)?.label || '';
  const getInterestLabel = (id: string) => INTEREST_OPTIONS.find(i => i.id === id)?.label || id;

  const displayInterests = profile.interests?.slice(0, 5) || [];

  return (
    <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden shadow-2xl bg-gray-800 border-2 border-slate-700 select-none">
      {/* Imagem Principal */}
      <img
        src={profile.mainPhotoUrl || 'https://via.placeholder.com/400x500?text=No+Photo'}
        alt={profile.nickname}
        className="w-full h-full object-cover pointer-events-none"
        draggable="false"
      />

      {/* Overlay Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Conteúdo */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white pb-8">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold shadow-black drop-shadow-md">
              {profile.nickname}
            </h2>
            <VerifiedBadge verificationStatus={profile.verificationStatus} />
          </div>

          <div className="flex items-center gap-2 text-lg font-medium text-gray-200">
            {profile.ageRange && (
              <span>{getAgeLabel(profile.ageRange)}</span>
            )}
            {profile.ageRange && (profile.city || profile.region) && <span>•</span>}
            {(profile.city || profile.region) && (
              <span>{profile.city ? `${profile.city}, ` : ''}{profile.region}</span>
            )}
          </div>
        </div>

        {profile.description && (
          <p className="text-sm text-gray-300 line-clamp-2 mb-4 drop-shadow-sm font-light leading-relaxed">
            {t(profile.description) || profile.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {displayInterests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20 shadow-sm"
            >
              {getInterestLabel(interest)}
            </span>
          ))}
          {profile.interests && profile.interests.length > 5 && (
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20 shadow-sm">
              +{profile.interests.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
