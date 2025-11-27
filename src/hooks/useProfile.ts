// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';

interface ProfileHookResult {
  profile: DocumentData | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = (userId: string | undefined): ProfileHookResult => {
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Flag para evitar set state em componente desmontado
    let isMounted = true; 

    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      console.log(`[DEBUG HOOK] useProfile loading profileId=${userId}`);
      setLoading(true);

      try {
        const profileDocRef = doc(db, 'profiles', userId);
        const docSnap = await getDoc(profileDocRef);

        if (isMounted) {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
            console.log(`[DEBUG HOOK] useProfile loaded profileId=${userId}`, docSnap.data());
          } else {
            console.warn(`[DEBUG HOOK] useProfile: No profile found for profileId=${userId}`);
            setError('Este perfil não foi encontrado.');
            setProfile(null);
          }
        }
      } catch (err) {
        console.error(`[ERROR HOOK] useProfile error for profileId=${userId}`, err);
        if (isMounted) {
          setError('Ocorreu um erro ao carregar o perfil.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { profile, loading, error };
};
