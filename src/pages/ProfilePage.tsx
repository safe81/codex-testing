import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Profile } from '../types/profiles';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [nickname, setNickname] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Subscribe to profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const ref = doc(db, 'profiles', user.uid);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Profile;
          setProfile(data);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('Failed to load profile');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update local state when profile loads
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || '');
      setCity(profile.city || '');
      setRegion(profile.region || '');
      setDescription(profile.description || '');
    }
  }, [profile]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setSaveError('Not authenticated');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const ref = doc(db, 'profiles', user.uid);
      await setDoc(
        ref,
        {
          nickname: nickname.trim(),
          city: city.trim(),
          region: region.trim(),
          description: description.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setSaveError('Erro ao guardar alterações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="h-8 w-48 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4 pt-6">
            <div className="h-12 w-full bg-gray-800 rounded-xl animate-pulse"></div>
            <div className="h-12 w-full bg-gray-800 rounded-xl animate-pulse"></div>
            <div className="h-24 w-full bg-gray-800 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <p className="text-gray-400 text-center mb-4">
          Nenhum perfil encontrado.
        </p>
        <a 
          href="/onboarding" 
          className="px-6 py-2 bg-pink-600 rounded-full font-semibold hover:bg-pink-500 transition-colors"
        >
          Criar Perfil
        </a>
      </div>
    );
  }

  // Determine profile type label for display
  const getTypeLabel = (profile: Profile) => {
    if (profile.accountType === 'USER') {
      switch (profile.gender) {
        case 'F': return 'Mulher';
        case 'M': return 'Homem';
        case 'NB': return 'Não-binário';
        default: return 'Single';
      }
    } else if (profile.accountType === 'COUPLE') {
      return 'Casal';
    } else if (profile.accountType === 'CLUB') {
      return 'Clube';
    } else if (profile.accountType === 'ORGANIZER') {
      return 'Organizador';
    }
    return 'Perfil';
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Top Section: Avatar & Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {profile.mainPhotoUrl ? (
              <img 
                src={profile.mainPhotoUrl} 
                alt={profile.nickname} 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-900 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center border-4 border-gray-900 shadow-xl">
                <span className="text-3xl font-bold text-white opacity-70">
                  {profile.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Edit photo button placeholder */}
            <button className="absolute bottom-0 right-0 p-1.5 bg-gray-800 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>
          
          <h1 className="text-2xl font-semibold text-white mb-1">{profile.nickname}</h1>
          <p className="text-sm text-gray-400">
            {getTypeLabel(profile)} • {profile.city || 'Sem cidade'}, {profile.region}
          </p>

          {/* Preferences Button for Singles */}
          {profile.accountType === 'USER' && (
            <Link 
              to="/singles/preferences"
              className="mt-4 px-4 py-2 bg-gray-800 rounded-full text-xs font-bold text-gray-300 hover:bg-gray-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Preferências
            </Link>
          )}
        </div>

        {/* Middle Section: Editable Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Alcunha
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder={profile.accountType === 'USER' ? "O teu nome de utilizador" : "A vossa alcunha"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Ex: Lisboa"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Região
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Ex: Lisboa e Vale do Tejo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 ml-1">
              {profile.accountType === 'USER' ? "Sobre Ti" : "Sobre Vocês"}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
              placeholder={profile.accountType === 'USER' ? "Escreve algo sobre ti e o que procuras..." : "Escrevam algo sobre o que procuram..."}
            />
          </div>
        </div>

        {/* Bottom Section: Actions */}
        <div className="mt-8 space-y-4">
          {saveError && (
            <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
              {saveError}
            </div>
          )}
          
          {saveSuccess && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-900/50 rounded-lg text-emerald-400 text-sm text-center animate-fade-in">
              Alterações guardadas com sucesso!
            </div>
          )}

          <button
            className={`w-full py-3.5 rounded-full font-bold text-black transition-all shadow-lg ${
              saving 
                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                : 'bg-emerald-500 hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-[0.98]'
            }`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'A guardar...' : 'Guardar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
