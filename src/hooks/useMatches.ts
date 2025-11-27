import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Match } from '../types/matching';
import type { Profile } from '../types/profiles';

export interface MatchWithProfile {
  match: Match;
  profile: Profile;
}

export function useMatches(currentUserId: string | undefined) {
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    async function fetchMatches() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'matches'),
          where('userIds', 'array-contains', currentUserId),
          orderBy('lastActivityAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const results: MatchWithProfile[] = [];

        for (const matchDoc of snapshot.docs) {
          const matchData = matchDoc.data() as Match;
          const otherUserId = matchData.userIds.find(id => id !== currentUserId);

          if (otherUserId) {
            const profileRef = doc(db, 'profiles', otherUserId);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              results.push({
                match: { ...matchData, id: matchDoc.id },
                profile: profileSnap.data() as Profile,
              });
            }
          }
        }

        setMatches(results);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [currentUserId]);

  return { matches, loading };
}
