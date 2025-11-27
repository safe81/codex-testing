import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentProfile } from '../hooks/useCurrentProfile';
import { useSinglesDeck } from '../hooks/useSinglesDeck';
import { handleSwipe } from '../services/matching'; // Importa a nova função
import SingleDeck from '../components/singles/SingleDeck';
import MatchOverlay from '../components/singles/MatchOverlay';
import type { SwipeDirection } from '../types/matching';
import type { Profile } from '../types/profiles';
import ProfileQuickViewModal from '../components/profile/ProfileQuickViewModal';
import { useTranslation } from '../i18n/LanguageContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function SinglesHomePage() {
  const { profile: currentProfile } = useCurrentProfile(); // Renomeado para clareza
  const { deck, loading, error, removeTopCard } = useSinglesDeck(currentProfile);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Quick View State
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const onSwipe = async (targetProfile: Profile, direction: SwipeDirection) => {
    if (!currentProfile) return;

    // Fecha o modal se o swipe vier de lá
    if (quickViewOpen) setQuickViewOpen(false);

    try {
      // Usa a nova função de serviço unificada
      const result = await handleSwipe(currentProfile, targetProfile, direction === 'DISLIKE' ? 'PASS' : direction);
      
      if (result.isMatch) {
        console.log("[DEBUG UI] É um Match! A mostrar overlay.", targetProfile);
        setMatchedProfile(targetProfile);
      }
      
      // Remove o card do topo do deck independentemente de ser match ou não
      removeTopCard();
    } catch (err) {
      console.error("Ocorreu um erro ao processar o swipe:", err);
      // Opcional: mostrar um toast/erro ao utilizador
    }
  };

  const openQuickView = (p: Profile) => {
    setSelectedProfile(p);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    setSelectedProfile(null);
  };

  const handleOpenChatFromProfile = async (targetProfile: Profile) => {
    if (!currentProfile) return;
    
    try {
        const [a, b] = [currentProfile.id, targetProfile.id].sort();
        const matchId = `${a}_${b}`;
        
        // Verifica na nova coleção 'matches'
        const matchRef = doc(db, 'matches', matchId);
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
             closeQuickView();
             navigate(`/singles/chat/${matchId}`);
        } else {
            // Pode ser melhor usar um toast em vez de alert
            alert(t('settings.messaging.restricted.matchesOnly') || "É necessário um match para conversar.");
        }
    } catch (error) {
        console.error("Erro ao verificar o match:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center pt-8">
      <SingleDeck 
        deck={deck} 
        loading={loading} 
        error={error} 
        onSwipe={onSwipe}
        onOpenProfile={openQuickView} 
      />

      {matchedProfile && (
        <MatchOverlay 
          profile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onGoToChat={() => {
            setMatchedProfile(null);
            // Navega para a página de lista de matches
            navigate('/singles/matches');
          }}
        />
      )}

      <ProfileQuickViewModal
        profile={selectedProfile}
        open={quickViewOpen && !!selectedProfile}
        onClose={closeQuickView}
        mode="SINGLE"
        onLike={(p) => onSwipe(p, 'LIKE')}
        onPass={(p) => onSwipe(p, 'PASS')}
        onOpenChat={handleOpenChatFromProfile}
        showSafetyActions
      />
    </div>
  );
}
