import { useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Profile, AgeRange, Gender } from '../types/profiles';
import { AGE_RANGES } from '../data/interests';

export function DebugTools() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Helper to generate random Portuguese name
  const getRandomName = (gender: Gender) => {
    const maleNames = ['João', 'Pedro', 'Tiago', 'Rui', 'André', 'Miguel', 'Carlos', 'Nuno', 'Gonçalo', 'Diogo', 'Ricardo', 'Hugo', 'Vasco', 'Luís', 'Bruno', 'Manuel', 'António', 'José'];
    const femaleNames = ['Ana', 'Maria', 'Sofia', 'Inês', 'Joana', 'Beatriz', 'Carolina', 'Marta', 'Rita', 'Cláudia', 'Mariana', 'Teresa', 'Francisca', 'Patrícia', 'Catarina', 'Isabel', 'Helena'];
    const nbNames = ['Alex', 'Dani', 'Jordan', 'Casey', 'Sam', 'Cris', 'Robin'];
    const lastNames = ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Almeida', 'Pinto'];
    
    let first = '';
    if (gender === 'M') first = maleNames[Math.floor(Math.random() * maleNames.length)];
    else if (gender === 'F') first = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    else first = nbNames[Math.floor(Math.random() * nbNames.length)];

    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
  };

  const seedSingles = async (count: number) => {
    if (!confirm(`Criar ${count} singles de teste?`)) return;
    
    setLoading(true);
    setMessage('A criar singles...');

    try {
      const cities = ['Lisboa', 'Porto', 'Coimbra', 'Faro', 'Braga', 'Aveiro', 'Viseu', 'Setúbal', 'Évora', 'Leiria'];
      const regions = ['Lisboa', 'Norte', 'Centro', 'Algarve', 'Norte', 'Centro', 'Centro', 'Lisboa', 'Alentejo', 'Centro'];
      
      const photosMale = [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&h=600&fit=crop'
      ];

      const photosFemale = [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop'
      ];

      const interestsList = ['Viagens', 'Cinema', 'Praia', 'Jantares', 'Desporto', 'Música', 'Dança', 'Leitura', 'Fotografia', 'Natureza', 'Jogos', 'Vinho'];

      for (let i = 0; i < count; i++) {
        // Random gender distribution (45% M, 45% F, 10% NB)
        const randG = Math.random();
        let gender: Gender = 'F';
        if (randG < 0.45) gender = 'M';
        else if (randG > 0.90) gender = 'NB';

        const cityIdx = Math.floor(Math.random() * cities.length);
        
        // Select photo based on gender (reuse M/F photos for NB for now)
        const photoArray = gender === 'M' ? photosMale : photosFemale;
        
        // Select random age range from available constants
        const ageRangeIds = AGE_RANGES.map(r => r.id);
        const ageRange = ageRangeIds[Math.floor(Math.random() * ageRangeIds.length)] as AgeRange;

        // Random interests (3 to 5)
        const shuffledInterests = [...interestsList].sort(() => 0.5 - Math.random());
        const selectedInterests = shuffledInterests.slice(0, 3 + Math.floor(Math.random() * 3));

        const newProfile: Partial<Profile> = {
          accountType: 'USER',
          nickname: getRandomName(gender),
          gender: gender,
          ageRange: ageRange,
          city: cities[cityIdx],
          region: regions[cityIdx],
          description: `Olá! Sou single (${gender}) e procuro conhecer pessoas novas na zona de ${cities[cityIdx]}. Gosto de ${selectedInterests[0].toLowerCase()} e ${selectedInterests[1].toLowerCase()}.`,
          mainPhotoUrl: photoArray[Math.floor(Math.random() * photoArray.length)],
          interests: selectedInterests,
          verificationStatus: Math.random() > 0.3 ? 'OFFICIAL' : 'NONE',
          privacySettings: {
            visibleInSingles: true,
            visibleInExplore: true,
            allowMessagesFromSingles: true,
            allowMessagesFromCouples: true,
            showCity: true,
            showRegion: true,
            showCountry: true
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Create with a random ID using doc()
        const newDocRef = doc(collection(db, 'profiles'));
        await setDoc(newDocRef, { ...newProfile, id: newDocRef.id });
      }
      setMessage(`Sucesso! ${count} singles criados com diversidade.`);
    } catch (error) {
      console.error(error);
      setMessage(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Ferramentas de Debug (DEV ONLY)</h1>
      
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Gerar Dados de Teste</h2>
        <p className="text-gray-400 text-sm">
          Cria perfis falsos na base de dados para testar a aplicação.
        </p>
        
        {message && (
          <div className={`p-3 rounded text-sm ${message.includes('Erro') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => seedSingles(10)} 
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 py-3 px-4 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'A criar...' : 'Criar 10 Singles (Diversos)'}
          </button>
          
          <button 
            onClick={() => seedSingles(50)} 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'A criar...' : 'Criar 50 Singles (Diversos)'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-4">
          Gera perfis com diferentes idades (18-60+), géneros e regiões para testar todos os filtros.
        </p>
      </div>
    </div>
  );
}
