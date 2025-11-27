// src/pages/MyReservationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useCurrentProfile } from '../hooks/useCurrentProfile';
import { getMyRegistrations, type EventRegistration } from '../services/eventService';

const ReservationCard: React.FC<{ registration: EventRegistration }> = ({ registration }) => {
    // Nota: O ID do evento está no caminho do documento, não nos dados. Precisamos de o extrair.
    // Esta é uma limitação do collectionGroup. Para este exemplo, vamos assumir que o temos.
    // Numa app real, poderíamos guardar o eventId nos dados do registo para facilitar.
    // Por agora, este componente não mostrará detalhes do evento.
    
    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="text-white">ID do Registo: {registration.id}</p>
            <p className="text-slate-300">Estado: <span className="font-bold">{registration.status}</span></p>
            <p className="text-slate-400">Pessoas: {registration.numPeople}</p>
        </div>
    );
};

const MyReservationsPage: React.FC = () => {
    const { profile } = useCurrentProfile();
    const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            getMyRegistrations(profile.id)
                .then(data => {
                    setRegistrations(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch registrations:", err);
                    setLoading(false);
                });
        }
    }, [profile]);

    if (loading) {
        return <div className="p-8 text-white">A carregar as suas reservas...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">As Minhas Reservas</h1>
            {registrations.length > 0 ? (
                <div className="space-y-4">
                    {registrations.map(reg => (
                        <ReservationCard key={reg.id} registration={reg} />
                    ))}
                </div>
            ) : (
                <p className="text-slate-400">Ainda não tem reservas para eventos.</p>
            )}
        </div>
    );
};

export default MyReservationsPage;
