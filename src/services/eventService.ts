// src/services/eventService.ts
import { 
    doc, 
    runTransaction,
    collectionGroup,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import type { Timestamp, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Profile } from '../types/profiles';

export interface EventRegistration {
    id: string;
    profileId: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'WAITLIST';
    numPeople: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    note?: string;
}

/**
 * Pede uma reserva ou convite para um evento.
 * @param {DocumentData} event - O objeto completo do evento.
 * @param {Profile} profile - O perfil do utilizador que faz o registo.
 * @param {number} numPeople - O número de pessoas para o registo (1 para single, 2 para casal).
 * @param {string} [note] - Uma nota opcional para o organizador.
 * @returns {Promise<{success: boolean, status: EventRegistration['status']}>} - O resultado do pedido.
 */
export const requestEventRegistration = async (
    event: DocumentData,
    profile: Profile,
    numPeople: number,
    note?: string
): Promise<{success: boolean, status: EventRegistration['status']}> => {
    
    const registrationRef = doc(db, `events/${event.id}/registrations`, profile.id);
    const eventRef = doc(db, 'events', event.id);

    try {
        let newStatus: EventRegistration['status'] = 'PENDING';
        
        await runTransaction(db, async (transaction) => {
            const eventDoc = await transaction.get(eventRef);
            if (!eventDoc.exists()) {
                throw new Error("Evento não encontrado.");
            }
            
            const eventData = eventDoc.data();
            const confirmedCount = eventData.confirmedCount || 0;
            const maxGuests = eventData.maxGuests;

            // Determina o estado inicial da reserva
            if (eventData.autoApprove) {
                if (maxGuests && (confirmedCount + numPeople) > maxGuests) {
                    newStatus = 'WAITLIST'; // Fica em lista de espera se exceder a capacidade
                } else {
                    newStatus = 'CONFIRMED';
                }
            } else {
                newStatus = 'PENDING';
            }

            // Cria o documento de registo
            transaction.set(registrationRef, {
                profileId: profile.id,
                status: newStatus,
                numPeople,
                note: note || '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Atualiza os contadores no evento principal
            if (newStatus === 'CONFIRMED') {
                transaction.update(eventRef, { confirmedCount: confirmedCount + numPeople });
            } else if (newStatus === 'PENDING') {
                const pendingCount = eventData.pendingCount || 0;
                transaction.update(eventRef, { pendingCount: pendingCount + 1 }); // Contamos por registo, não por pessoa
            }
        });

        console.log(`[DEBUG EVENT] Registo para o evento ${event.id} criado com sucesso com o estado: ${newStatus}`);
        return { success: true, status: newStatus };

    } catch (error) {
        console.error("[ERROR EVENT] Falha ao criar registo de evento:", error);
        return { success: false, status: 'REJECTED' }; // REJECTED pode não ser o melhor, mas indica falha
    }
};

/**
 * Busca a lista das minhas reservas.
 * @param {string} profileId - O ID do perfil do utilizador.
 * @returns {Promise<EventRegistration[]>}
 */
export const getMyRegistrations = async (profileId: string): Promise<EventRegistration[]> => {
    const q = query(collectionGroup(db, 'registrations'), where('profileId', '==', profileId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventRegistration));
}
