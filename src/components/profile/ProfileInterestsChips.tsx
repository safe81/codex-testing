import { INTEREST_OPTIONS } from '../../data/interests';

interface ProfileInterestsChipsProps {
  interests?: string[];
  limit?: number;
  className?: string;
}

export default function ProfileInterestsChips({ interests, limit, className = '' }: ProfileInterestsChipsProps) {
  if (!interests || interests.length === 0) return null;

  const displayInterests = limit ? interests.slice(0, limit) : interests;
  const remaining = interests.length - displayInterests.length;

  const getLabel = (id: string) => INTEREST_OPTIONS.find(i => i.id === id)?.label || id;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayInterests.map(interestId => (
        <span 
          key={interestId} 
          className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-gray-200 border border-white/10 backdrop-blur-sm"
        >
          {getLabel(interestId)}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-2 py-1 rounded-full bg-gray-800 text-xs font-medium text-gray-400 border border-gray-700">
          +{remaining}
        </span>
      )}
    </div>
  );
}
