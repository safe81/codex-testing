// src/pages/ClubDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClub } from '../hooks/useClub';
import { useEventsByClub } from '../hooks/useEventsByClub';
import EventCard from '../components/EventCard';

// Skeleton Loader
const SkeletonLoader = () => (
    <div className="max-w-5xl mx-auto p-4 animate-pulse">
        <div className="h-64 bg-slate-800/80 rounded-2xl mb-6"></div>
        <div className="h-24 bg-slate-800/80 rounded w-full mb-6"></div>
        <div className="h-48 bg-slate-800/80 rounded w-full"></div>
    </div>
);

const ClubDetailPage: React.FC = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const navigate = useNavigate();
    const { club, loading: clubLoading, error: clubError } = useClub(clubId);
    const { events, loading: eventsLoading } = useEventsByClub(clubId);

    if (clubLoading) {
        return <div className="min-h-screen bg-slate-950 text-white p-8"><SkeletonLoader /></div>;
    }

    if (clubError || !club) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-400 bg-red-900/30 border border-red-500/40 rounded-lg px-4 py-3 text-center mb-6">{clubError || "Clube não encontrado."}</p>
                <button onClick={() => navigate(-1)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Voltar</button>
            </div>
        );
    }

    // TODO: Adicionar lógica de tier visual para clubes
    // const tier = club.tier || 'FREE_CLUB';

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="relative h-56 md:h-80 w-full">
                <img src={club.coverPhotoUrl || 'https://via.placeholder.com/1500x500'} alt={`${club.name} cover`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Header */}
                <div className="relative -mt-16 sm:-mt-24">
                    {/* ... (código do header do clube mantido) ... */}
                </div>

                {/* Corpo da página */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {/* Descrição, Regras, etc. */}
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-3">Sobre o Clube</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{club.description}</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {/* Contactos e Links */}
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-3">Informações</h2>
                            {/* ... (Links website, mapa, etc.) ... */}
                        </div>
                    </div>
                </div>

                {/* Eventos Futuros */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Próximos Eventos</h2>
                    {eventsLoading ? (
                        <p>A carregar eventos...</p>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg">
                            <p className="text-slate-400">Não há eventos futuros agendados para este clube.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClubDetailPage;
