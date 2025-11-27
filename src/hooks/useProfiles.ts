import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Profile } from '../types';

function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Fetch all profiles for now to ensure we see data
        const profilesCollection = collection(db, 'profiles');
        const profilesSnapshot = await getDocs(profilesCollection);
        
        const profilesList = profilesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Profile));

        setProfiles(profilesList);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return { profiles, loading, error };
}

export default useProfiles;
