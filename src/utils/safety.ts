import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Unblocks a user by removing their ID from the current user's blockedUserIds list.
 * @param currentUserId The ID of the user performing the action.
 * @param targetUserId The ID of the user to unblock.
 */
export const unblockUser = async (currentUserId: string, targetUserId: string): Promise<void> => {
  const userDocRef = doc(db, 'profiles', currentUserId);
  await updateDoc(userDocRef, {
    blockedUserIds: arrayRemove(targetUserId)
  });
};
