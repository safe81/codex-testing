// src/hooks/useEvent.ts
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';

interface EventHookResult {
  event: DocumentData | null;
  loading: boolean;
  error: string | null;
}

export const useEvent = (eventId: string | undefined): EventHookResult => {
  const [event, setEvent] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      console.log(`[DEBUG HOOK] useEvent loading eventId=${eventId}`);
      setLoading(true);
      
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(eventDocRef);

        if (isMounted) {
          if (docSnap.exists()) {
            setEvent(docSnap.data());
            console.log(`[DEBUG HOOK] useEvent loaded eventId=${eventId}`);
          } else {
            console.warn(`[DEBUG HOOK] useEvent: No event found for eventId=${eventId}`);
            setError('Este evento não foi encontrado.');
          }
        }
      } catch (err) {
        console.error(`[ERROR HOOK] useEvent error for eventId=${eventId}`, err);
        if (isMounted) {
          setError('Ocorreu um erro ao carregar o evento.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  return { event, loading, error };
};
