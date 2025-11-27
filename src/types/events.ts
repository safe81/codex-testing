export interface AppEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string for simplicity
  city: string;
  region?: string;
  countryCode?: string; // ISO code e.g. "PT"
  isFeatured?: boolean;
  coverImageUrl?: string;
  clubId?: string; // If associated with a club
  tags?: string[]; // e.g., ['soft', 'party', 'pool']
}
