import { MapPin, Building2 } from 'lucide-react';
import type { Club } from '../types/clubs';
import { SecondaryButton } from './buttons';
import { useTranslation } from '../i18n/LanguageContext';

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  const { t } = useTranslation();

  // Optimize Unsplash images for mobile
  const optimizedImageUrl = club.mainPhotoUrl?.includes('unsplash.com')
    ? `${club.mainPhotoUrl}&w=400&h=250&fit=crop`
    : club.mainPhotoUrl;

  const isPremium = club.tier === 'PREMIUM' || club.tier === 'PREMIUM_PLUS';

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden group transition-all hover:border-pink-500/50 hover:scale-[1.02] flex flex-col h-full">
      <div className="relative h-40 w-full bg-gray-800">
        {optimizedImageUrl ? (
          <img 
            src={optimizedImageUrl} 
            alt={club.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
             <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Clube
             </span>
        </div>

        {isPremium && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
            Premium
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-white truncate text-lg mb-1">{club.name}</h3>
        
        <p className="text-gray-400 text-xs mb-3 flex-grow">{club.description ? t(club.description) : ''}</p>

        <div className="flex items-center text-gray-400 text-xs mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{club.city} • {club.region}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-800 w-full">
            <SecondaryButton className="w-full text-xs py-2" onClick={() => console.log('Navigate to club:', club.id)}>
                Ver clube
            </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
