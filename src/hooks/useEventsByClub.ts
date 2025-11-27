import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { AppEvent } from '../types/events';
import { db } from '../services/firebase';

interface UseEventsByClubResult {
  events: AppEvent[];
  loading: boolean;
}

export const useEventsByClub = (clubId: string | undefined): UseEventsByClubResult => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const eventsRef = collection(db, 'events');
        const q = query(
          eventsRef,
          where('clubId', '==', clubId),
          where('startDate', '>=', Timestamp.now())
        );

        const querySnapshot = await getDocs(q);
        const clubEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.startDate?.toDate().toISOString() || '',
            coverImageUrl: data.coverPhotoUrl || data.coverImageUrl // Handle both potential field names
          } as AppEvent;
        });
        setEvents(clubEvents);

      } catch (err) {
        console.error(`[ERROR] useEventsByClub:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [clubId]);

  return { events, loading };
};
