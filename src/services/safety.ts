import { doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function blockUser(currentUserId: string, targetUserId: string): Promise<void> {
  try {
    const userRef = doc(db, 'profiles', currentUserId);
    await updateDoc(userRef, {
      blockedUserIds: arrayUnion(targetUserId)
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
}

export async function unblockUser(currentUserId: string, targetUserId: string): Promise<void> {
  try {
    const userRef = doc(db, 'profiles', currentUserId);
    await updateDoc(userRef, {
      blockedUserIds: arrayRemove(targetUserId)
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
}

export async function reportUser(
  reporterUserId: string, 
  reportedUserId: string, 
  reason: string = 'other'
): Promise<void> {
  try {
    await addDoc(collection(db, 'reports'), {
      reporterUserId,
      reportedUserId,
      type: 'PROFILE',
      reason,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error reporting user:", error);
    throw error;
  }
}
