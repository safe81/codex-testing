import { useState, useEffect } from 'react';
import { mockEvents } from '../data/mockEvents';
import type { AppEvent } from '../types/events';

// This is a mock implementation that simulates fetching data.
// It can be replaced with a real Firestore query later.
export function useEvents() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      try {
        setEvents(mockEvents);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
        setLoading(false);
      }
    }, 500);
  }, []);

  return { events, loading, error };
}
