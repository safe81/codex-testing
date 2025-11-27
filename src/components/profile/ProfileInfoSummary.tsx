import { MapPin } from 'lucide-react';
import type { Profile } from '../../types/profiles';
import { AGE_RANGES } from '../../data/interests';

interface ProfileInfoSummaryProps {
  profile: Profile;
  compact?: boolean;
  className?: string;
}

export default function ProfileInfoSummary({ profile, compact = false, className = '' }: ProfileInfoSummaryProps) {
  const getAgeLabel = (id: string | undefined) => AGE_RANGES.find(a => a.id === id)?.label || '';

  // Privacy checks
  const showCity = profile.privacySettings?.showCity !== false;
  const showRegion = profile.privacySettings?.showRegion !== false;
  
  const locationParts = [];
  if (showCity && profile.city) locationParts.push(profile.city);
  if (showRegion && profile.region) locationParts.push(profile.region);
  const locationString = locationParts.join(', ');

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <h3 className={`font-bold text-white ${compact ? 'text-lg' : 'text-2xl'}`}>
          {profile.nickname}
        </h3>
        {profile.ageRange && (
          <span className={`font-normal text-gray-400 ${compact ? 'text-sm' : 'text-lg'}`}>
            • {getAgeLabel(profile.ageRange)}
          </span>
        )}
      </div>

      {locationString && (
        <div className="flex items-center text-gray-400 mt-1 text-sm">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          <span className="truncate">{locationString}</span>
        </div>
      )}
    </div>
  );
}
