import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Club } from '../types';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const snap = await getDocs(collection(db, 'clubs'));
        const list: Club[] = snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Club, 'id'>),
        }));
        setClubs(list);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return { clubs, loading, error };
}
