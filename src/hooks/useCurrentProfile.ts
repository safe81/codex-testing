import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { Profile } from '../types/profiles';

export function useCurrentProfile() {
  const [user, loadingAuth] = useAuthState(auth);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (loadingAuth) return;
    
    if (!user) {
      const t = setTimeout(() => {
         setProfile(null);
         setLoadingProfile(false);
      }, 0);
      return () => clearTimeout(t);
    }

    // setLoadingProfile(true); // Removed to avoid synchronous setState warning
    
    const unsub = onSnapshot(doc(db, 'profiles', user.uid), 
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as Profile);
        } else {
          setProfile(null);
        }
        setLoadingProfile(false);
      },
      (err) => {
        console.error("Error fetching current profile:", err);
        setError(err);
        setLoadingProfile(false);
      }
    );

    return () => unsub();
  }, [user, loadingAuth]);

  return { profile, loading: loadingAuth || loadingProfile, error };
}
