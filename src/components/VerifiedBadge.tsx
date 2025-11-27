import type { VerificationStatus } from '../types/profiles';

interface VerifiedBadgeProps {
  verificationStatus?: VerificationStatus;
  size?: 'sm' | 'md'; // Added size prop
}

export default function VerifiedBadge({ verificationStatus, size = 'md' }: VerifiedBadgeProps) {
  if (verificationStatus === 'NONE' || !verificationStatus) {
    return null;
  }

  const getBadgeContent = () => {
    switch (verificationStatus) {
      case 'OFFICIAL':
        return { text: 'Oficial', icon: '✓', color: 'bg-blue-500 text-white' };
      case 'BUSINESS':
        return { text: 'Business', icon: '🏢', color: 'bg-yellow-500 text-black' };
      default:
        return null;
    }
  };

  const content = getBadgeContent();

  if (!content) {
    return null;
  }

  // Size adjustments
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const padding = size === 'sm' ? 'px-1.5 py-0' : 'px-2 py-0.5';

  return (
    <div className={`flex items-center space-x-1 ${padding} rounded-full ${textSize} font-semibold ${content.color}`}>
      <span>{content.icon}</span>
      <span>{content.text}</span>
    </div>
  );
}
