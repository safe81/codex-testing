import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useCurrentProfile } from '../../hooks/useCurrentProfile';
import { useTranslation } from '../../i18n/LanguageContext';
import LanguageSelector from '../../components/settings/LanguageSelector';

export default function AccountSettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, loading } = useCurrentProfile();
  const [saving, setSaving] = useState(false);

  // Local state
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (profile) {
      setCountry(profile.country || profile.region || ''); 
      setRegion(profile.region || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', profile.id), {
        country,
        region,
        city
      });
      alert(t('settings.account.saveSuccess'));
    } catch (error) {
      console.error(error);
      alert(t('settings.account.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Info Read Only */}
      <section className="bg-gray-800 p-4 rounded-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
          {profile?.mainPhotoUrl ? (
            <img src={profile.mainPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
          )}
        </div>
        <div>
          <h2 className="font-bold text-lg">{profile?.nickname}</h2>
          <p className="text-sm text-gray-400">{profile?.accountType}</p>
          <p className="text-xs text-gray-500">{auth.currentUser?.email}</p>
        </div>
      </section>

      {/* Language */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('settings.account.language.label')}</h3>
        <LanguageSelector />
      </section>

      {/* Location */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase">{t('settings.account.location.title')}</h3>
        
        <div>
          <label className="text-xs text-gray-400 block mb-1">{t('settings.account.country')}</label>
          <input 
            type="text" 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">{t('settings.account.region')}</label>
          <input 
            type="text" 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">{t('settings.account.city')}</label>
          <input 
            type="text" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-pink-500 focus:outline-none"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? t('settings.account.saving') : t('settings.account.save')}
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl font-medium transition-all"
        >
          {t('settings.account.logout')}
        </button>
      </div>
    </div>
  );
}
