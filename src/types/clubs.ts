export type ClubTier = 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS';

export interface Club {
  id: string;
  name: string;
  region: string; // e.g. "Norte", "Lisboa", "Algarve"
  city: string;
  countryCode?: string; // ISO code e.g. "PT"
  address?: string;
  description?: string;
  mainPhotoUrl?: string;
  tier: ClubTier;
  isFeatured?: boolean;
}
