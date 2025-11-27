import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useConversationMessages } from '../hooks/useConversationMessages';
import { useTranslation } from '../i18n/LanguageContext';
import type { Profile } from '../types/profiles';
import type { Conversation } from '../types/matching';

export default function SinglesChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  
  const { messages, loading } = useConversationMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Conversation Details & Check Permissions
  useEffect(() => {
    if (!user || !conversationId) return;

    async function checkAccess() {
      try {
        const convRef = doc(db, 'conversations', conversationId!);
        const convSnap = await getDoc(convRef);

        if (!convSnap.exists()) {
          console.error("Conversation not found");
          navigate('/singles/matches');
          return;
        }

        const convData = convSnap.data() as Conversation;
        if (!convData.userIds.includes(user!.uid)) {
          alert(t('singles.chat.noAccess'));
          navigate('/singles');
          return;
        }

        // Fetch other user profile
        const otherUserId = convData.userIds.find(id => id !== user!.uid);
        if (otherUserId) {
          const profileRef = doc(db, 'profiles', otherUserId);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setOtherProfile(profileSnap.data() as Profile);
          }
        }
      } catch (err) {
        console.error("Error checking chat access:", err);
      }
    }

    checkAccess();
  }, [conversationId, user, navigate, t]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !conversationId) return;

    setSending(true);
    try {
      const text = inputText.trim();
      
      // 1. Add message to subcollection
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        senderId: user.uid,
        text,
        createdAt: serverTimestamp(),
      });

      // 2. Update conversation lastMessage
      await setDoc(doc(db, 'conversations', conversationId), {
        lastMessage: {
          text,
          senderId: user.uid,
          createdAt: serverTimestamp(),
        },
        lastActivityAt: serverTimestamp(),
      }, { merge: true });

      setInputText('');
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading || !otherProfile) {
    return <div className="h-screen bg-gray-900 text-white flex items-center justify-center">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-10">
        <button onClick={() => navigate('/singles/matches')} className="mr-4 p-2 text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3">
          <img 
            src={otherProfile.mainPhotoUrl || 'https://via.placeholder.com/40'} 
            alt={otherProfile.nickname} 
            className="w-10 h-10 rounded-full object-cover border border-gray-700"
          />
          <div>
            <h2 className="font-bold text-sm">{otherProfile.nickname}</h2>
            <p className="text-xs text-gray-400">{otherProfile.city || otherProfile.region}</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>{t('singles.chat.emptyState')}</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  isMe 
                    ? 'bg-pink-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 px-3 py-3 bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('singles.chat.input.placeholder')}
            className="flex-1 bg-gray-800 border-none text-white rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-600 focus:outline-none placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={sending || !inputText.trim()}
            className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
