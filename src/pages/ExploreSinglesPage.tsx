import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Profile } from '../types/profiles';
import SingleCard from '../components/singles/SingleCard';
import { useTranslation } from '../i18n/LanguageContext';

export default function ExploreSinglesPage() {
  const { t } = useTranslation();
  const [singles, setSingles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSingles() {
      try {
        const q = query(
          collection(db, 'profiles'),
          where('accountType', '==', 'USER'),
          where('isSingleZone', '==', true),
          where('visibleToCouples', '==', true)
        );

        const snapshot = await getDocs(q);
        const results: Profile[] = [];
        snapshot.forEach((doc) => {
          results.push(doc.data() as Profile);
        });
        setSingles(results);
      } catch (error) {
        console.error("Error loading singles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSingles();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white pb-20">
      <h1 className="text-2xl font-bold mb-6">Explorar Singles</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {singles.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-10">
            Não foram encontrados singles disponíveis de momento.
          </p>
        ) : (
          singles.map((single) => (
            <div key={single.id} className="bg-gray-800 rounded-3xl p-4 shadow-lg flex flex-col space-y-4">
              {/* Reuse the card visual */}
              <div className="h-[400px] w-full relative rounded-2xl overflow-hidden">
                 <SingleCard profile={single} />
              </div>
              
              {/* Action Button for Couples */}
              <button
                disabled={!single.allowMessagesFromCouples}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  single.allowMessagesFromCouples
                    ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                    if (single.allowMessagesFromCouples) {
                        console.log("Open chat WIP");
                    }
                }}
              >
                {single.allowMessagesFromCouples 
                  ? t('profile.actions.sendMessage') 
                  : 'Não aceita mensagens'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
