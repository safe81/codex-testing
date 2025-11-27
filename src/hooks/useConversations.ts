import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Conversation } from '../types/matching';
import type { Profile } from '../types/profiles';

export interface ConversationWithProfile {
  conversation: Conversation;
  otherProfile: Profile;
}

export function useConversations(currentUserId: string | undefined) {
  const [conversations, setConversations] = useState<ConversationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
        setLoading(false); // Stop loading if no user
        return;
    }

    async function fetchConversations() {
      setLoading(true);
      try {
        // We now use 'singles_matches' for the Singles area
        // Note: For now, we are reusing the 'conversations' type/structure logic but fetching from 'singles_matches'
        // Ideally, 'singles_matches' documents would contain 'userIds' array for 'array-contains' query
        // The service update ensured 'userIds' is present in 'singles_matches'.
        
        const q = query(
          collection(db, 'singles_matches'),
          where('userIds', 'array-contains', currentUserId),
          // orderBy('lastActivityAt', 'desc') // Might fail if index is missing, handle gracefully or remove temporarily
        );

        const snapshot = await getDocs(q);
        const results: ConversationWithProfile[] = [];

        for (const matchDoc of snapshot.docs) {
           // We treat the match doc as the base for "conversation" for now.
           // In a full implementation, you might separate Matches from Chat Conversations (only created on first message).
           // Here we assume Match = Conversation starter.
          const matchData = matchDoc.data();
          
          // Construct a Conversation-like object
          const conversation: Conversation = { 
              id: matchDoc.id,
              userIds: matchData.userIds,
              createdAt: matchData.createdAt?.toString() || new Date().toISOString(),
              updatedAt: matchData.lastActivityAt?.toString() || new Date().toISOString(),
              lastActivityAt: matchData.lastActivityAt?.toString() || new Date().toISOString(), // Added lastActivityAt
              // lastMessage: undefined // No messages yet typically
           };

          const otherUserId = conversation.userIds.find(id => id !== currentUserId);

          if (otherUserId) {
            const profileRef = doc(db, 'profiles', otherUserId);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              results.push({
                conversation,
                otherProfile: profileSnap.data() as Profile,
              });
            }
          }
        }
        
        // Sort manually if orderBy query fails or to be safe
        // results.sort((a, b) => ...);

        setConversations(results);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [currentUserId]);

  return { conversations, loading };
}
