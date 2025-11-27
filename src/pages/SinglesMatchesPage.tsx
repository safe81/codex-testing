import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

import { db } from '../services/firebase';
import { useCurrentProfile } from '../hooks/useCurrentProfile';
import { useTranslation } from '../i18n/LanguageContext';
import VerifiedBadge from '../components/VerifiedBadge';
import type { Profile } from '../types/profiles';

type MatchItem = {
  id: string;          // ID do documento em singles_matches (vamos usar como conversationId)
  otherUser: Profile;  // Perfil do outro utilizador
};

export default function SinglesMatchesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile: currentProfile } = useCurrentProfile();

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatches() {
      if (!currentProfile?.id) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Buscar todos os matches onde o utilizador atual participa
        const q = query(
          collection(db, 'singles_matches'),
          where('userIds', 'array-contains', currentProfile.id)
        );

        const snapshot = await getDocs(q);
        const items: MatchItem[] = [];

        for (const matchDoc of snapshot.docs) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = matchDoc.data() as any;
          const userIds: string[] = data.userIds || [];

          // 2. Descobrir o outro utilizador deste match
          const otherUserId = userIds.find((id) => id !== currentProfile.id);
          if (!otherUserId) continue;

          // 3. Carregar o perfil do outro utilizador
          const otherProfileSnap = await getDoc(doc(db, 'profiles', otherUserId));
          if (!otherProfileSnap.exists()) continue;

          const otherProfileData = otherProfileSnap.data() as Profile;

          // Garantir que o campo id existe no objeto de perfil
          const otherProfile: Profile = {
            ...otherProfileData,
            id: otherUserId,
          };

          items.push({
            id: matchDoc.id,
            otherUser: otherProfile,
          });
        }

        setMatches(items);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error('[SinglesMatchesPage] Error loading matches', e);
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [currentProfile?.id]);

  // --- UI STATES ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          {t('singles.matches.loading')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">
            ⚠️ {t('singles.home.error')}
          </p>
          <p className="text-xs text-gray-500 break-all">{error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">💞</div>
          <h1 className="text-2xl font-bold mb-2">
            {t('singles.matches.title')}
          </h1>
          <p className="text-gray-400 mb-6">
            {t('singles.matches.empty')}
          </p>
          <button
            onClick={() => navigate('/singles')}
            className="w-full py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-colors"
          >
            {t('singles.matches.goSwipe')}
          </button>
        </div>
      </div>
    );
  }

  // --- LISTA DE MATCHES ---

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-4 pb-24">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {t('singles.matches.title')}
          </h1>
          <p className="text-gray-400 text-sm">
            {t('singles.matches.listTitle')}
          </p>
        </div>

        <div className="space-y-4">
          {matches.map(({ id, otherUser }) => (
            <button
              key={id}
              onClick={() => navigate(`/singles/chat/${id}`)}
              className="w-full flex items-center gap-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-2xl p-3 text-left transition-colors"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                <img
                  src={
                    otherUser.mainPhotoUrl ||
                    'https://via.placeholder.com/80x80?text=No+Photo'
                  }
                  alt={otherUser.nickname || 'Match'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold truncate">
                    {otherUser.nickname || 'User'}
                  </span>
                  <VerifiedBadge verificationStatus={otherUser.verificationStatus} />
                </div>

                <div className="text-xs text-gray-400 mb-1 truncate">
                  {(otherUser.city || otherUser.region) && (
                    <span>
                      {otherUser.city
                        ? `${otherUser.city}${otherUser.region ? ', ' : ''}`
                        : ''}
                      {otherUser.region}
                    </span>
                  )}
                </div>

                {otherUser.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {otherUser.description}
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center">
                <span className="text-pink-400 text-xs font-semibold">
                  {t('singles.matchOverlay.chatButton')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
