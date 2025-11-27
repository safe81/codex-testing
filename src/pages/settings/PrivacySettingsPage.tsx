import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useCurrentProfile } from '../../hooks/useCurrentProfile';
import { useTranslation } from '../../i18n/LanguageContext';
import type { PrivacySettings } from '../../types/profiles';

export default function PrivacySettingsPage() {
  const { t } = useTranslation();
  const { profile, loading } = useCurrentProfile();
  const [saving, setSaving] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacySettings>({});

  useEffect(() => {
    if (profile) {
      setPrivacy(profile.privacySettings || {
        visibleInExplore: true,
        visibleInSingles: profile.isSingleZone || false,
        showCountry: true,
        showRegion: true,
        showCity: true,
        hideExactLocation: false,
        allowMessagesFromMatchesOnly: false,
        allowMessagesFromSingles: true,
        allowMessagesFromCouples: true,
        blurPhotosForStrangers: false
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', profile.id), {
        privacySettings: privacy
      });
      alert(t('settings.privacy.saveSuccess'));
    } catch (error) {
      console.error(error);
      alert(t('settings.privacy.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Where Appear */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">{t('settings.privacy.whereAppear.title')}</h3>
        <div className="space-y-3 bg-gray-800 p-4 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t('settings.privacy.visibleInExplore')}</span>
            <input 
              type="checkbox" 
              checked={privacy.visibleInExplore} 
              onChange={(e) => update('visibleInExplore', e.target.checked)}
              className="w-5 h-5 accent-pink-600"
            />
          </label>
          {profile?.isSingleZone && (
            <label className="flex items-center justify-between cursor-pointer">
              <span>{t('settings.privacy.visibleInSingles')}</span>
              <input 
                type="checkbox" 
                checked={privacy.visibleInSingles} 
                onChange={(e) => update('visibleInSingles', e.target.checked)}
                className="w-5 h-5 accent-pink-600"
              />
            </label>
          )}
        </div>
      </section>

      {/* Location Display */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">{t('settings.privacy.location.title')}</h3>
        <div className="space-y-3 bg-gray-800 p-4 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t('settings.privacy.showCountry')}</span>
            <input 
              type="checkbox" 
              checked={privacy.showCountry} 
              onChange={(e) => update('showCountry', e.target.checked)}
              className="w-5 h-5 accent-pink-600"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t('settings.privacy.showRegion')}</span>
            <input 
              type="checkbox" 
              checked={privacy.showRegion} 
              onChange={(e) => update('showRegion', e.target.checked)}
              className="w-5 h-5 accent-pink-600"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t('settings.privacy.showCity')}</span>
            <input 
              type="checkbox" 
              checked={privacy.showCity} 
              onChange={(e) => update('showCity', e.target.checked)}
              className="w-5 h-5 accent-pink-600"
            />
          </label>
          <div className="border-t border-gray-700 pt-2 mt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-yellow-500">{t('settings.privacy.hideExactLocation')}</span>
              <input 
                type="checkbox" 
                checked={privacy.hideExactLocation} 
                onChange={(e) => update('hideExactLocation', e.target.checked)}
                className="w-5 h-5 accent-pink-600"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Messaging */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">{t('settings.privacy.messages.title')}</h3>
        <div className="space-y-3 bg-gray-800 p-4 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t('settings.privacy.allowMessagesFromMatchesOnly')}</span>
            <input 
              type="checkbox" 
              checked={privacy.allowMessagesFromMatchesOnly} 
              onChange={(e) => update('allowMessagesFromMatchesOnly', e.target.checked)}
              className="w-5 h-5 accent-pink-600"
            />
          </label>
          
          {!privacy.allowMessagesFromMatchesOnly && (
            <>
              <label className="flex items-center justify-between cursor-pointer">
                <span>{t('settings.privacy.allowMessagesFromSingles')}</span>
                <input 
                  type="checkbox" 
                  checked={privacy.allowMessagesFromSingles} 
                  onChange={(e) => update('allowMessagesFromSingles', e.target.checked)}
                  className="w-5 h-5 accent-pink-600"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>{t('settings.privacy.allowMessagesFromCouples')}</span>
                <input 
                  type="checkbox" 
                  checked={privacy.allowMessagesFromCouples} 
                  onChange={(e) => update('allowMessagesFromCouples', e.target.checked)}
                  className="w-5 h-5 accent-pink-600"
                />
              </label>
            </>
          )}
        </div>
      </section>

      {/* Photos */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">{t('settings.privacy.photos.title')}</h3>
        <div className="space-y-3 bg-gray-800 p-4 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <span>{t('settings.privacy.blurPhotosForStrangers')}</span>
            <input 
              type="checkbox" 
              checked={privacy.blurPhotosForStrangers} 
              onChange={(e) => update('blurPhotosForStrangers', e.target.checked)}
              className="w-5 h-5 accent-pink-600"
            />
          </label>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
      >
        {saving ? t('settings.privacy.saving') : t('settings.privacy.save')}
      </button>
    </div>
  );
}
