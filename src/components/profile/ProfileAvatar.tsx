import { User, Users, Building2, CalendarDays } from 'lucide-react';
import type { Profile } from '../../types/profiles';
import VerifiedBadge from '../VerifiedBadge';

interface ProfileAvatarProps {
  profile: Profile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export default function ProfileAvatar({ profile, size = 'md', showBadge = true, className = '' }: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  // Placeholder Logic
  let PlaceholderIcon = User;
  if (profile.accountType === 'COUPLE') PlaceholderIcon = Users;
  if (profile.accountType === 'CLUB') PlaceholderIcon = Building2;
  if (profile.accountType === 'ORGANIZER') PlaceholderIcon = CalendarDays;

  // Account Type Badge Logic
  const getBadge = () => {
    if (!showBadge) return null;
    
    const badgeBase = "absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm border border-gray-900";

    if (profile.accountType === 'COUPLE') return <span className={`${badgeBase} bg-purple-500`}>Casal</span>;
    if (profile.accountType === 'CLUB') return <span className={`${badgeBase} bg-orange-500`}>Clube</span>;
    if (profile.accountType === 'ORGANIZER') return <span className={`${badgeBase} bg-teal-500`}>Org</span>;
    
    if (profile.accountType === 'USER') {
        if (profile.gender === 'F') return <span className={`${badgeBase} bg-pink-500`}>Ela</span>;
        if (profile.gender === 'M') return <span className={`${badgeBase} bg-blue-500`}>Ele</span>;
        return <span className={`${badgeBase} bg-gray-500`}>Single</span>;
    }
    return null;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center`}>
        {profile.mainPhotoUrl ? (
          <img 
            src={profile.mainPhotoUrl} 
            alt={profile.nickname} 
            className="w-full h-full object-cover"
          />
        ) : (
          <PlaceholderIcon className="w-1/2 h-1/2 text-gray-500" />
        )}
      </div>
      
      {getBadge()}
      
      {profile.verificationStatus === 'OFFICIAL' && (
        <div className="absolute -top-1 -right-1">
            <VerifiedBadge verificationStatus="OFFICIAL" size={size === 'sm' ? 'sm' : 'md'} />
        </div>
      )}
    </div>
  );
}
