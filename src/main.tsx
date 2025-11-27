import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext.tsx';

// --- Seed Imports ---
import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import type { Profile, Gender, AgeRange } from './types/profiles';
import { AGE_RANGES } from './data/interests';

// --- Helper Functions for Random Data ---
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

const getRandomCoupleName = () => {
  return `${getRandomName('F').split(' ')[0]} & ${getRandomName('M').split(' ')[0]}`;
};

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

const photosCouple = [
  'https://images.unsplash.com/photo-1621255476629-873b88b2e379?w=500&h=600&fit=crop',
  'https://images.unsplash.com/photo-1542596594-649edbc13630?w=500&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516575334481-f85287c2c81d?w=500&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=500&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518536630857-41b4b0a4305f?w=500&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=500&h=600&fit=crop'
];

const interestsList = ['Viagens', 'Cinema', 'Praia', 'Jantares', 'Desporto', 'Música', 'Dança', 'Leitura', 'Fotografia', 'Natureza', 'Jogos', 'Vinho'];

// --- SEED FUNCTION EXPOSED TO WINDOW ---
/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).seedFullDatabase = async () => {
  console.log('🚀 Starting full database seed (100 Singles + 100 Couples)...');
  
  const singlesCount = 100;
  const couplesCount = 100;
  let createdCount = 0;

  try {
    // 1. Seed Singles
    for (let i = 0; i < singlesCount; i++) {
      const randG = Math.random();
      let gender: Gender = 'F';
      if (randG < 0.45) gender = 'M';
      else if (randG > 0.90) gender = 'NB';

      const cityIdx = Math.floor(Math.random() * cities.length);
      const photoArray = gender === 'M' ? photosMale : photosFemale;
      const ageRangeIds = AGE_RANGES.map(r => r.id);
      const ageRange = ageRangeIds[Math.floor(Math.random() * ageRangeIds.length)] as AgeRange;
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

      const newDocRef = doc(collection(db, 'profiles'));
      await setDoc(newDocRef, { ...newProfile, id: newDocRef.id });
      createdCount++;
    }
    console.log(`✅ Created ${singlesCount} singles.`);

    // 2. Seed Couples
    for (let i = 0; i < couplesCount; i++) {
      const cityIdx = Math.floor(Math.random() * cities.length);
      const ageRangeIds = AGE_RANGES.map(r => r.id);
      const ageRange = ageRangeIds[Math.floor(Math.random() * ageRangeIds.length)] as AgeRange;
      const shuffledInterests = [...interestsList].sort(() => 0.5 - Math.random());
      const selectedInterests = shuffledInterests.slice(0, 3 + Math.floor(Math.random() * 3));

      const newProfile: Partial<Profile> = {
        accountType: 'COUPLE',
        nickname: getRandomCoupleName(),
        relationshipType: 'COUPLE',
        ageRange: ageRange,
        city: cities[cityIdx],
        region: regions[cityIdx],
        description: `Somos um casal divertido da zona de ${cities[cityIdx]}. Procuramos amizades e experiências novas.`,
        mainPhotoUrl: photosCouple[Math.floor(Math.random() * photosCouple.length)],
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

      const newDocRef = doc(collection(db, 'profiles'));
      await setDoc(newDocRef, { ...newProfile, id: newDocRef.id });
      createdCount++;
    }
    console.log(`✅ Created ${couplesCount} couples.`);

    const finalMessage = `🎉 SUCCESS! Created ${createdCount} profiles total. Refresh the page.`;
    console.log(finalMessage);
    alert(finalMessage);

  } catch (error) {
    console.error('Seed error:', error);
    alert('Error seeding database. Check console.');
  }
};
/* eslint-enable @typescript-eslint/no-explicit-any */

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
