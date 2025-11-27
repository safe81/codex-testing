// src/hooks/useClub.ts
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';

interface ClubHookResult {
  club: DocumentData | null;
  loading: boolean;
  error: string | null;
}

export const useClub = (clubId: string | undefined): ClubHookResult => {
  const [club, setClub] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchClub = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      console.log(`[DEBUG HOOK] useClub loading clubId=${clubId}`);
      setLoading(true);

      try {
        const clubDocRef = doc(db, 'clubs', clubId);
        const docSnap = await getDoc(clubDocRef);

        if (isMounted) {
          if (docSnap.exists()) {
            setClub(docSnap.data());
            console.log(`[DEBUG HOOK] useClub loaded clubId=${clubId}`);
          } else {
            console.warn(`[DEBUG HOOK] useClub: No club found for clubId=${clubId}`);
            setError('Este clube não foi encontrado.');
          }
        }
      } catch (err) {
        console.error(`[ERROR HOOK] useClub error for clubId=${clubId}`, err);
        if (isMounted) {
          setError('Ocorreu um erro ao carregar o clube.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClub();

    return () => {
      isMounted = false;
    };
  }, [clubId]);

  return { club, loading, error };
};
