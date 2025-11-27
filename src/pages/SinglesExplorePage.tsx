import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCurrentProfile } from '../hooks/useCurrentProfile';
import { useTranslation } from '../i18n/LanguageContext';
import SinglesFiltersBar from '../components/singles/SinglesFiltersBar';
import type { SinglesFilters } from '../components/singles/SinglesFiltersBar';
import SinglesList from '../components/singles/SinglesList';
import type { Profile } from '../types/profiles';
import ProfileQuickViewModal from '../components/profile/ProfileQuickViewModal';
import { useNavigate } from 'react-router-dom';

export default function SinglesExplorePage() {
  const { t } = useTranslation();
  const { profile: currentProfile } = useCurrentProfile();
  const navigate = useNavigate();
  
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick View State
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<SinglesFilters>({
    genders: [],
    ageRanges: [],
    region: '',
    onlyVerified: false,
    onlyWithPhoto: false,
    onlyMyCountry: false // Default
  });

  const [initialized, setInitialized] = useState(false);

  // 1. Initialize filters from preferences once profile loads
  useEffect(() => {
    if (currentProfile && currentProfile.searchPreferences && !initialized) {
      const prefs = currentProfile.searchPreferences;
      if (prefs.autoApplyOnSinglesExplore) {
        setFilters({
          genders: prefs.preferredGenders || [],
          ageRanges: prefs.preferredAgeRanges || [],
          region: (prefs.preferSameRegion ? currentProfile.region : prefs.preferredRegions?.[0]) || '',
          onlyVerified: prefs.onlyVerified || false,
          onlyWithPhoto: prefs.onlyWithPhoto || false,
          onlyMyCountry: false // Can add preference for this later
        });
      }
      setInitialized(true);
    }
  }, [currentProfile, initialized]);

  // 2. Fetch ALL singles
  useEffect(() => {
    async function fetch() {
      if (!currentProfile) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, 'profiles'),
          where('accountType', '==', 'USER')
        );
        
        const snap = await getDocs(q);
        const candidates: Profile[] = [];
        const blocked = new Set(currentProfile.blockedUserIds || []);

        snap.forEach(doc => {
          const p = doc.data() as Profile;
          
          // 1. Never show self
          if (doc.id === currentProfile.id) return;

          // 2. I blocked them
          if (blocked.has(doc.id)) return;

          // 3. They blocked me
          if (p.blockedUserIds?.includes(currentProfile.id)) return;

          // 4. Privacy
          if (p.privacySettings?.visibleInSingles === false) return;

          candidates.push(p);
        });

        setAllProfiles(candidates);
      } catch (err) {
        console.error("Error loading explore profiles:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (currentProfile) fetch();
  }, [currentProfile]);

  // 3. Apply Filters
  useEffect(() => {
    if (!currentProfile) return;

    let result = allProfiles;

    // Country Logic
    const userCountry = currentProfile.homeCountryCode || currentProfile.country;
    const preferredCountries = currentProfile.preferredCountries || (userCountry ? [userCountry] : []);

    if (filters.onlyMyCountry) {
        // Strict filter: Only profiles from preferred countries (or home country)
        result = result.filter(p => {
            const pCountry = p.homeCountryCode || p.country;
            return pCountry && preferredCountries.includes(pCountry);
        });
    } else {
        // Sort: Profiles from preferred countries first
        result = [...result].sort((a, b) => {
            const aCountry = a.homeCountryCode || a.country;
            const bCountry = b.homeCountryCode || b.country;
            const aIsPreferred = aCountry && preferredCountries.includes(aCountry) ? 1 : 0;
            const bIsPreferred = bCountry && preferredCountries.includes(bCountry) ? 1 : 0;
            return bIsPreferred - aIsPreferred;
        });
    }

    if (filters.genders.length > 0) {
      result = result.filter(p => p.gender && filters.genders.includes(p.gender));
    }

    if (filters.ageRanges.length > 0) {
      result = result.filter(p => p.ageRange && filters.ageRanges.includes(p.ageRange));
    }

    if (filters.region.trim()) {
      const term = filters.region.toLowerCase();
      result = result.filter(p => p.region?.toLowerCase().includes(term) || p.city?.toLowerCase().includes(term));
    }

    if (filters.onlyVerified) {
      result = result.filter(p => p.verificationStatus === 'OFFICIAL' || p.verificationStatus === 'BUSINESS');
    }

    if (filters.onlyWithPhoto) {
      result = result.filter(p => !!p.mainPhotoUrl);
    }

    setFilteredProfiles(result);
  }, [allProfiles, filters, currentProfile]);

  const handleClear = () => {
    setFilters({
      genders: [],
      ageRanges: [],
      region: '',
      onlyVerified: false,
      onlyWithPhoto: false,
      onlyMyCountry: false
    });
  };

  const openQuickView = (p: Profile) => {
    setSelectedProfile(p);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    setSelectedProfile(null);
  };

  const handleOpenSinglesChatFromProfile = async (targetProfile: Profile) => {
    if (!currentProfile) return;
    
    try {
        const [a, b] = [currentProfile.id, targetProfile.id].sort();
        const matchId = `${a}_${b}`;
        
        const matchRef = doc(db, 'singles_matches', matchId);
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
             closeQuickView();
             navigate(`/singles/chat/${matchId}`);
        } else {
            alert(t('settings.messaging.restricted.matchesOnly') || "Só podes enviar mensagem a quem tens match.");
        }
    } catch (error) {
        console.error("Error checking match:", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-white">{t('singles.explore.loading')}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('singles.explore.title')}</h1>
        <p className="text-gray-400 text-sm">{t('singles.explore.subtitle')}</p>
      </div>

      <SinglesFiltersBar 
        filters={filters} 
        onChange={setFilters} 
        onClear={handleClear} 
      />

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {t('singles.explore.empty')}
        </div>
      ) : (
        <SinglesList 
            profiles={filteredProfiles} 
            onProfileClick={openQuickView} 
        />
      )}

      <ProfileQuickViewModal
        profile={selectedProfile}
        open={quickViewOpen && !!selectedProfile}
        onClose={closeQuickView}
        mode="SINGLE"
        onOpenChat={handleOpenSinglesChatFromProfile}
        showSafetyActions
      />
    </div>
  );
}
