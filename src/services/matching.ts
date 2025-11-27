// src/services/matching.ts - Refatorado para ser o novo serviço principal
import { doc, getDoc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import type { Profile } from '../types/profiles';

/**
 * Lida com a ação de "gostar" ou "passar" um perfil.
 * Apenas "likes" são persistidos no Firestore.
 * Verifica se um "like" resulta num novo match.
 * 
 * @param {Profile} fromProfile - O perfil do utilizador que faz a ação.
 * @param {Profile} toProfile - O perfil do utilizador que recebe a ação.
 * @param {'LIKE' | 'PASS'} direction - A direção do swipe.
 * @returns {Promise<{ isMatch: boolean; matchId?: string }>} - Retorna se a ação resultou num match e o ID do match.
 */
export const handleSwipe = async (
  fromProfile: Profile,
  toProfile: Profile,
  direction: 'LIKE' | 'PASS'
): Promise<{ isMatch:boolean; matchId?: string }> => {
  if (direction === 'PASS') {
    // Não persistimos 'PASS' no Firestore por agora para economizar escritas.
    // A lógica de remover o card do deck é suficiente.
    console.log(`[DEBUG SWIPE] PASS de ${fromProfile.id} para ${toProfile.id}`);
    return { isMatch: false };
  }

  // A partir daqui, a lógica é apenas para LIKES
  const fromId = fromProfile.id;
  const toId = toProfile.id;
  const context = fromProfile.accountType === 'USER' ? 'SINGLES' : 'COUPLES'; // Determina o contexto

  console.log(`[DEBUG SWIPE] LIKE de ${fromId} para ${toId} no contexto ${context}`);

  // 1. Registar o like (ID não ordenado: from_to)
  const likeId = `${fromId}_${toId}`;
  const likeRef = doc(db, 'likes', likeId);
  await setDoc(likeRef, {
    fromProfileId: fromId,
    toProfileId: toId,
    context,
    createdAt: serverTimestamp(),
  }, { merge: true });

  // 2. Verificar se já existe um like no sentido inverso (to_from)
  const reverseLikeId = `${toId}_${fromId}`;
  const reverseLikeSnap = await getDoc(doc(db, 'likes', reverseLikeId));

  if (reverseLikeSnap.exists()) {
    console.log(`[DEBUG SWIPE] Match detectado entre ${fromId} e ${toId}`);
    
    // 3. Criar o match (ID ordenado para garantir unicidade)
    const [a, b] = [fromId, toId].sort();
    const matchId = `${a}_${b}`;
    const matchRef = doc(db, 'matches', matchId);
    
    try {
        await runTransaction(db, async (transaction) => {
            const matchSnap = await transaction.get(matchRef);
            if (!matchSnap.exists()) {
                console.log(`[DEBUG SWIPE] A criar novo match: ${matchId}`);
                transaction.set(matchRef, {
                    id: matchId,
                    profileIds: [a, b],
                    context,
                    createdAt: serverTimestamp(),
                    lastActivityAt: serverTimestamp(),
                });
                
                // TODO: Adicionar lógica para incrementar contadores nos perfis se necessário
            } else {
                 console.log(`[DEBUG SWIPE] Match ${matchId} já existe. A atualizar timestamp.`);
                 transaction.update(matchRef, { lastActivityAt: serverTimestamp() });
            }
        });
        return { isMatch: true, matchId };
    } catch (error) {
        console.error("[ERROR SWIPE] Falha na transação de criação de match:", error);
        return { isMatch: false };
    }
  }

  return { isMatch: false };
};
