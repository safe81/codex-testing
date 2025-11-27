export type AccountType = 'USER' | 'COUPLE' | 'CLUB' | 'ORGANIZER';
export type VerificationStatus = 'NONE' | 'OFFICIAL' | 'BUSINESS';
export type SubscriptionPlan = 'FREE' | 'PREMIUM' | 'LIFETIME_PREMIUM' | 'CLUB_PRO';

// New types for interests and lifestyle
export type RelationshipType = 'SINGLE' | 'COUPLE' | 'GROUP';
export type ExperienceLevel = 'SOFT_SWAP' | 'FULL_SWAP' | 'HOTWIFING' | 'CUCKHOLDING' | 'STAG_VIXEN' | 'UNICORN_HUNTERS' | 'POLYAMORY' | 'THREESOME' | 'GROUP_SEX' | 'ORGY' | 'GANGBANG' | 'EXHIBITIONISM' | 'VOYEURISM' | 'BDSM';
export type AgeRange = 'UNDER_30' | 'AGE_30_39' | 'AGE_40_49' | 'AGE_50_59' | 'AGE_60_PLUS';
export type Gender = 'F' | 'M' | 'NB';
export type UILanguage = 'pt' | 'en' | 'es' | 'de' | 'fr';

export interface SearchPreferences {
  autoApplyOnExplore?: boolean;
  lookingForCouples?: boolean;
  lookingForSingleWomen?: boolean;
  lookingForSingleMen?: boolean;
  lookingForGroups?: boolean;
  preferredAgeRanges?: AgeRange[];
  preferredOrientationTags?: string[];

  // SINGLES – new filters
  preferredGenders?: Gender[];
  preferredRegions?: string[];
  preferSameRegion?: boolean;
  preferredInterests?: string[];

  autoApplyOnSinglesExplore?: boolean;
  autoApplyOnSinglesSwipe?: boolean;

  onlyVerified?: boolean;
  onlyWithPhoto?: boolean;
}

export interface PrivacySettings {
  // Visibilidade geral
  visibleInExplore?: boolean;
  visibleInSingles?: boolean;

  // Localização
  showCountry?: boolean;
  showRegion?: boolean;
  showCity?: boolean;
  hideExactLocation?: boolean;

  // Mensagens e contactos
  allowMessagesFromMatchesOnly?: boolean;
  allowMessagesFromSingles?: boolean;
  allowMessagesFromCouples?: boolean;

  // Fotos
  blurPhotosForStrangers?: boolean;
}

export interface SafetySettings {
  showSafetyTipsOnLogin?: boolean;
  allowScreenshotWarning?: boolean;
}

/**
 * @deprecated The `type` property is deprecated. Use `accountType` instead.
 */
export type ProfileType = 'COUPLE' | 'SINGLE_F' | 'SINGLE_M' | 'CLUB';

export interface Profile {
  id: string;
  nickname: string;
  region: string;
  isPrivate: boolean;
  verificationLevel: 0 | 1 | 2;
  subscriptionPlan: SubscriptionPlan;
  createdAt: string | object;
  updatedAt: string | object;

  // Account status fields
  accountType?: AccountType;
  verificationStatus?: VerificationStatus;

  // Language and Region
  uiLanguage?: UILanguage;
  homeCountryCode?: string;
  preferredCountries?: string[];

  // Safety fields
  blockedUserIds?: string[];
  privacySettings?: PrivacySettings;
  safetySettings?: SafetySettings;

  // Lifestyle fields
  relationshipType?: RelationshipType;
  experienceLevel?: ExperienceLevel;
  interests?: string[]; // e.g., ['soft_swap', 'voyeur', 'parties']
  ageRange?: AgeRange;

  // SINGLE-SPECIFIC FIELDS
  gender?: Gender;             // género do single
  isSingleZone?: boolean;      // true se este perfil pertence ao "mundo singles"

  // Controlo da relação com casais
  visibleToCouples?: boolean;          // se true, casais podem encontrar este single
  allowMessagesFromCouples?: boolean;  // se false, casais não podem iniciar conversa

  // Search Preferences
  searchPreferences?: SearchPreferences;

  // Optional legacy and specific fields
  type?: ProfileType; // Kept for backward compatibility
  country?: string; // Added country
  city?: string;
  description?: string;
  mainPhotoUrl?: string;
}
