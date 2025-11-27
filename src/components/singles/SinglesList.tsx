import { useNavigate } from 'react-router-dom';
import type { Profile } from '../../types/profiles';
import { AGE_RANGES } from '../../data/interests';

interface SinglesListProps {
  profiles: Profile[];
  onProfileClick?: (profile: Profile) => void;
}

export default function SinglesList({ profiles, onProfileClick }: SinglesListProps) {
  const navigate = useNavigate();
  // Helper
  const getAgeLabel = (id: string | undefined) => AGE_RANGES.find(a => a.id === id)?.label || '';

  const handleItemClick = (profile: Profile) => {
    if (onProfileClick) {
      onProfileClick(profile);
    } else {
      navigate(`/profiles/${profile.id}`);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
      {profiles.map(profile => (
        <div 
          key={profile.id} 
          onClick={() => handleItemClick(profile)}
          className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative group cursor-pointer"
        >
          <div className="aspect-[3/4] w-full relative">
            <img 
              src={profile.mainPhotoUrl || 'https://via.placeholder.com/300x400'} 
              alt={profile.nickname} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="text-base font-bold flex items-center flex-wrap gap-1">
                {profile.nickname}
                {profile.ageRange && (
                  <span className="text-xs font-normal text-gray-300">
                    • {getAgeLabel(profile.ageRange)}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {profile.city || profile.region}
              </p>
              
              {/* Interests preview (2 max) */}
              <div className="flex gap-1 mt-2 overflow-hidden h-5">
                 {profile.interests?.slice(0, 2).map(i => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded border border-white/10 truncate max-w-[80px]">
                        {i}
                    </span>
                 ))}
              </div>

              {/* Verified Badge */}
              {profile.verificationStatus === 'OFFICIAL' && (
                <div className="absolute top-2 right-2 bg-blue-500/90 p-1 rounded-full shadow-sm backdrop-blur-sm">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
