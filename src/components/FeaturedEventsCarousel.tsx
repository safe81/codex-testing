import { useEvents } from '../hooks/useEvents';
import EventCard from './EventCard';

export default function FeaturedEventsCarousel() {
  const { events, loading } = useEvents();
  const featuredEvents = events.filter(e => e.isFeatured);

  if (loading || featuredEvents.length === 0) {
    return null; // Or a loading skeleton
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4">Eventos em Destaque</h2>
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {featuredEvents.map(event => (
          <div key={event.id} className="w-80 flex-shrink-0">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
