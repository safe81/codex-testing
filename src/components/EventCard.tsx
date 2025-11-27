// src/components/EventCard.tsx
import type { AppEvent } from '../types/events';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
    event: AppEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const formattedDate = event.date ? format(new Date(event.date), "d MMM") : '';

    return (
        <Link to={`/events/${event.id}`} className="block bg-slate-800 rounded-lg overflow-hidden group">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${event.coverImageUrl || 'https://via.placeholder.com/400x200'})` }}></div>
            <div className="p-4">
                <p className="text-sm text-rose-400 font-semibold">{formattedDate}</p>
                <h3 className="font-bold text-white mt-1 truncate group-hover:text-rose-300">{event.title}</h3>
                <div className="flex items-center text-slate-400 text-sm mt-2">
                    <MapPin size={14} className="mr-1" />
                    <span>{event.city}</span>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
