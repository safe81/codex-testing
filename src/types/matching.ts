import { Timestamp } from 'firebase/firestore';

// Updated to include PASS which maps to DISLIKE logic but is clearer in UI context
export type SwipeDirection = 'LIKE' | 'DISLIKE' | 'PASS';

export interface Swipe {
  id?: string;
  fromUserId: string;
  toUserId: string;
  direction: SwipeDirection;
  createdAt: Timestamp;
}

export interface Match {
  id: string;
  userIds: [string, string]; // IDs sorted alphabetically
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
}

export interface Conversation {
  id: string;
  userIds: [string, string];
  createdAt: Timestamp | string; // Allow string for easier mock/client handling
  updatedAt?: Timestamp | string; // Added optional updatedAt
  lastActivityAt: Timestamp | string;
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: Timestamp;
  };
}
