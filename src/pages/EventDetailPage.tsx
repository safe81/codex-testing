// src/pages/EventDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const EventDetailPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [user] = useAuthState(auth);
    const { event, loading, error } = useEvent(eventId);

    const [isInterested, setIsInterested] = useState(false);
    const [interestLoading, setInterestLoading] = useState(true);

    // Verifica o estado de "interesse" do utilizador
    useEffect(() => {
        if (user && eventId) {
            const interestRef = doc(db, `events/${eventId}/attendees`, user.uid);
            getDoc(interestRef).then(docSnap => {
                setIsInterested(docSnap.exists());
                setInterestLoading(false);
            });
        }
    }, [user, eventId]);

    const handleInterestToggle = async () => {
        if (!user || !eventId) return;

        setInterestLoading(true);
        const interestRef = doc(db, `events/${eventId}/attendees`, user.uid);

        if (isInterested) {
            await deleteDoc(interestRef);
            setIsInterested(false);
        } else {
            await setDoc(interestRef, {
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            setIsInterested(true);
        }
        setInterestLoading(false);
    };

    if (loading) {
        return <div className="p-8 text-white">A carregar evento...</div>;
    }

    if (error || !event) {
        return <div className="p-8 text-red-400">{(error || "Evento não encontrado.")}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            {/* ... (código do layout da página mantido, similar ao do prompt anterior) ... */}

            {/* Botão de Ação "Tenho Interesse" */}
            <div className="max-w-5xl mx-auto px-4">
                <button
                    onClick={handleInterestToggle}
                    disabled={interestLoading}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${isInterested
                        ? 'bg-green-700 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                >
                    {interestLoading ? 'Aguarde...' : isInterested ? 'Interesse Registado ✓' : 'Tenho Interesse'}
                </button>
            </div>
        </div>
    );
};

export default EventDetailPage;
