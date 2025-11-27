import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Profile } from '../types/profiles';
import type { Swipe } from '../types/matching';

export function useSinglesDeck(currentProfile: Profile | null) {
  const [deck, setDeck] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDeck() {
      if (!currentProfile) {
        setLoading(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Fetch swipes to exclude
        const swipesRef = collection(db, 'singles_swipes');
        const swipesQuery = query(swipesRef, where('fromUserId', '==', currentProfile.id));
        const swipesSnapshot = await getDocs(swipesQuery);
        const swipedUserIds = new Set(
          swipesSnapshot.docs.map(doc => (doc.data() as Swipe).toUserId)
        );

        // 2. Fetch Candidates (USER only)
        const profilesRef = collection(db, 'profiles');
        const profilesQuery = query(
            profilesRef, 
            where('accountType', '==', 'USER')
        );
        
        const profilesSnapshot = await getDocs(profilesQuery);
        
        const candidates: Profile[] = [];
        const blocked = new Set(currentProfile.blockedUserIds || []);
        const prefs = currentProfile.searchPreferences;
        const applyPrefs = prefs?.autoApplyOnSinglesSwipe;

        // Country Logic
        const userCountry = currentProfile.homeCountryCode || currentProfile.country;
        
        // Determine if we should filter STRICTLY by country or just prioritize
        // Ideally this comes from a preference toggle, e.g. prefs.onlyMyCountry
        // For now, let's assume if preferSameRegion is true, we might imply country too, 
        // OR we can check preferredCountries if available.
        const preferredCountries = currentProfile.preferredCountries || (userCountry ? [userCountry] : []);
        const strictCountryFilter = false; // Can be exposed in UI later

        profilesSnapshot.forEach((doc) => {
          const p = doc.data() as Profile;
          
          // --- CORE EXCLUSION LOGIC ---
          if (doc.id === currentProfile.id) return;
          if (swipedUserIds.has(doc.id)) return;
          if (blocked.has(doc.id)) return;
          if (p.blockedUserIds?.includes(currentProfile.id)) return;
          if (p.privacySettings?.visibleInSingles === false) return;

          // --- PREFERENCES LOGIC ---
          if (applyPrefs) {
            if (prefs?.preferredGenders?.length && p.gender && !prefs.preferredGenders.includes(p.gender)) return;
            if (prefs?.preferredAgeRanges?.length && p.ageRange && !prefs.preferredAgeRanges.includes(p.ageRange)) return;
            
            if (prefs?.onlyVerified && p.verificationStatus !== 'OFFICIAL' && p.verificationStatus !== 'BUSINESS') return;
            if (prefs?.onlyWithPhoto && !p.mainPhotoUrl) return;

            // Region logic
            if (prefs?.preferSameRegion && p.region && currentProfile.region && p.region !== currentProfile.region) return;
            if (prefs?.preferredRegions?.length) {
               const regionMatch = prefs.preferredRegions.some(r => p.region?.includes(r) || p.city?.includes(r));
               if (!regionMatch && !prefs.preferSameRegion) return; 
            }
          }
          
          // --- COUNTRY FILTER (Strict Check if enabled, otherwise used for sort) ---
          const profileCountry = p.homeCountryCode || p.country;
          if (strictCountryFilter && profileCountry && !preferredCountries.includes(profileCountry)) {
              return;
          }

          candidates.push(p);
        });

        // --- SORTING LOGIC ---
        // Prioritize:
        // 1. Same Country
        // 2. Random shuffle (within same bucket)
        
        // Separate into buckets
        const sameCountryCandidates: Profile[] = [];
        const otherCandidates: Profile[] = [];

        candidates.forEach(p => {
            const pCountry = p.homeCountryCode || p.country;
            if (userCountry && pCountry === userCountry) {
                sameCountryCandidates.push(p);
            } else {
                otherCandidates.push(p);
            }
        });

        // Shuffle buckets independently
        const shuffle = (array: Profile[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Combine: Same Country First
        const sortedDeck = [...shuffle(sameCountryCandidates), ...shuffle(otherCandidates)];

        setDeck(sortedDeck);
      } catch (err) {
        console.error("Error fetching singles deck:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeck();
  }, [currentProfile]);

  const removeTopCard = () => {
    setDeck(prev => prev.slice(1));
  };

  return { deck, loading, error, removeTopCard };
}
