import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';
import type { AccountType, RelationshipType, ExperienceLevel, AgeRange, SearchPreferences, Profile } from '../types/profiles';
import { INTEREST_OPTIONS, EXPERIENCE_LEVELS, RELATIONSHIP_TYPES, AGE_RANGES } from '../data/interests';
import { PrimaryButton } from '../components/buttons';

function OnboardingPage() {
  const navigate = useNavigate();
  const [user, authLoading] = useAuthState(auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [error, setError] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(''); // Changed to empty string to show placeholder

  const [formData, setFormData] = useState({
    nickname: '',
    accountType: 'COUPLE' as AccountType,
    relationshipType: 'COUPLE' as RelationshipType,
    experienceLevel: 'SOFT_SWAP' as ExperienceLevel,
    interests: [] as string[],
    ageRange: 'UNDER_30' as AgeRange,
    region: '',
    city: '',
    description: '',
    searchPreferences: {
      autoApplyOnExplore: true,
      lookingForCouples: true,
      lookingForSingleWomen: true,
      lookingForSingleMen: false,
      lookingForGroups: false,
      preferredAgeRanges: [] as AgeRange[],
      preferredOrientationTags: [] as string[],
    } as SearchPreferences,
  });

  // Check if user already has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (authLoading || !user) return;

      try {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profile = docSnap.data() as Profile;
          
          // If profile exists and has a nickname, assume onboarding is complete
          if (profile.nickname) {
            if (profile.accountType === 'USER') {
               navigate('/singles', { replace: true });
            } else {
               navigate('/explore', { replace: true });
            }
          }
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests };
    });
  };

  const handleAgeRangePreferenceToggle = (rangeId: AgeRange) => {
    setFormData(prev => {
      const currentRanges = prev.searchPreferences.preferredAgeRanges || [];
      const newRanges = currentRanges.includes(rangeId)
        ? currentRanges.filter(r => r !== rangeId)
        : [...currentRanges, rangeId];
      
      return {
        ...prev,
        searchPreferences: {
          ...prev.searchPreferences,
          preferredAgeRanges: newRanges,
        },
      };
    });
  };

  const handleLookingForToggle = (key: keyof SearchPreferences) => {
    if (key === 'autoApplyOnExplore' || key === 'preferredAgeRanges' || key === 'preferredOrientationTags') return;
    
    setFormData(prev => ({
      ...prev,
      searchPreferences: {
        ...prev.searchPreferences,
        [key]: !prev.searchPreferences[key],
      },
    }));
  };
  
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      setPhotoFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('Erro: Utilizador não autenticado.');
      setLoading(false);
      return;
    }

    if (!formData.nickname || !formData.region || !photoFile) {
      setError('Por favor preencha todos os campos obrigatórios e adicione uma foto.');
      setLoading(false);
      return;
    }

    try {
      let photoUrl = '';

      if (photoFile) {
        const imageRef = ref(storage, `profile-images/${user.uid}/main.jpg`);
        await uploadBytes(imageRef, photoFile);
        photoUrl = await getDownloadURL(imageRef);
      }

      // Default preferences logic if none selected
      const finalSearchPreferences = { ...formData.searchPreferences };
      if (!finalSearchPreferences.preferredAgeRanges || finalSearchPreferences.preferredAgeRanges.length === 0) {
         finalSearchPreferences.preferredAgeRanges = [formData.ageRange];
      }

      const userProfile = {
        id: user.uid,
        ...formData,
        searchPreferences: finalSearchPreferences,
        verificationStatus: 'NONE',
        isPrivate: false,
        verificationLevel: 0,
        subscriptionPlan: 'FREE',
        mainPhotoUrl: photoUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'profiles', user.uid), userProfile);
      navigate('/explore');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Erro ao criar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full space-y-8 bg-gray-800 p-8 rounded-xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Complete o seu Perfil</h1>
          <p className="text-gray-400">Estes detalhes ajudam a comunidade a encontrar-vos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">{error}</div>}

          {/* Photo Upload */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden hover:border-pink-500 transition-colors relative"
            >
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <span className="text-sm text-gray-400">Adicionar Foto Principal</span>
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-pink-600 p-2 rounded-full m-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoSelect} 
            />
            <p className="text-xs text-gray-500 mt-2">* Foto principal obrigatória</p>
          </div>

          {/* Basic Info Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Alcunha (Nome do Perfil) *</label>
              <input type="text" name="nickname" required value={formData.nickname} onChange={handleChange} placeholder="Ex: CasalAventureiro" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Conta *</label>
              <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-600 focus:outline-none">
                <option value="COUPLE">Casal</option>
                <option value="USER">Pessoa</option>
                <option value="CLUB">Clube</option>
                <option value="ORGANIZER">Organizador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Faixa Etária</label>
              <select name="ageRange" value={formData.ageRange} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-600 focus:outline-none">
                {AGE_RANGES.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Região / Distrito *</label>
              <input type="text" name="region" required value={formData.region} onChange={handleChange} placeholder="Ex: Lisboa" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-600 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cidade (Opcional)</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Ex: Cascais" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-600 focus:outline-none" />
            </div>
          </section>

          {/* Lifestyle Section */}
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Relação</label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_TYPES.map(rt => (
                  <button type="button" key={rt.id} onClick={() => setFormData(prev => ({ ...prev, relationshipType: rt.id as RelationshipType }))} className={`px-4 py-2 rounded-lg text-sm transition-colors ${formData.relationshipType === rt.id ? 'bg-pink-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'}`}>
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nível de Experiência</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map(el => (
                  <button type="button" key={el.id} onClick={() => setFormData(prev => ({ ...prev, experienceLevel: el.id as ExperienceLevel }))} className={`px-4 py-2 rounded-lg text-sm transition-colors ${formData.experienceLevel === el.id ? 'bg-pink-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'}`}>
                    {el.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Interests Section */}
          <section>
            <label className="block text-sm font-medium text-gray-300 mb-2">Interesses & Orientação</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <button type="button" key={interest.id} onClick={() => handleInterestToggle(interest.id)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${formData.interests.includes(interest.id) ? 'bg-emerald-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'}`}>
                  {interest.label}
                </button>
              ))}
            </div>
          </section>

          {/* Search Preferences Section */}
          <section className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
              O que procuram?
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              Estas preferências serão usadas para sugerir filtros automaticamente na página Explorar.
            </p>

            {/* Looking For Types */}
            <div>
              <span className="block text-xs text-gray-400 mb-2">Tipo de perfis</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'lookingForCouples', label: 'Casais' },
                  { key: 'lookingForSingleWomen', label: 'Singles femininas' },
                  { key: 'lookingForSingleMen', label: 'Singles masculinos' },
                  { key: 'lookingForGroups', label: 'Grupos' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleLookingForToggle(opt.key as keyof SearchPreferences)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      formData.searchPreferences[opt.key as keyof SearchPreferences]
                        ? 'bg-pink-600 text-white font-semibold'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Preference */}
            <div>
              <span className="block text-xs text-gray-400 mb-2">Faixa etária desejada</span>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map(range => {
                  const active = formData.searchPreferences.preferredAgeRanges?.includes(range.id as AgeRange);
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => handleAgeRangePreferenceToggle(range.id as AgeRange)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        active ? 'bg-emerald-600 text-white font-semibold' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <PrimaryButton type="submit" disabled={loading} className="w-full">
            {loading ? 'A guardar...' : 'Guardar e Continuar'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;
