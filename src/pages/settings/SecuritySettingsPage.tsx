import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useCurrentProfile } from '../../hooks/useCurrentProfile';
import { useTranslation } from '../../i18n/LanguageContext';
import { unblockUser } from '../../utils/safety';
import type { SafetySettings } from '../../types/profiles';

export default function SecuritySettingsPage() {
  const { t } = useTranslation();
  const { profile, loading } = useCurrentProfile();
  const [safety, setSafety] = useState<SafetySettings>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setSafety(profile.safetySettings || {
        showSafetyTipsOnLogin: true,
        allowScreenshotWarning: true
      });
    }
  }, [profile]);

  const handleSaveTips = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', profile.id), {
        safetySettings: safety
      });
    } catch (error) {
      console.error(error);
      alert(t('settings.security.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (targetId: string) => {
    if (!profile) return;
    if (window.confirm(t('safety.unblock.confirmTitle'))) {
      try {
        await unblockUser(profile.id, targetId);
        // UI updates automatically via useCurrentProfile subscription
        alert(t('safety.unblock.success'));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      
      {/* Safety Tips Section */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">{t('settings.security.tips.title')}</h3>
        <div className="bg-gray-800 rounded-xl p-6 space-y-4 border border-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔞</span>
            <p className="text-sm text-gray-300">{t('settings.security.tips.adultOnly')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <p className="text-sm text-gray-300">{t('settings.security.tips.consent')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕵️</span>
            <p className="text-sm text-gray-300">{t('settings.security.tips.discretion')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📸</span>
            <p className="text-sm text-gray-300">{t('settings.security.tips.photos')}</p>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-700">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">{t('settings.security.tips.showOnLogin')}</span>
              <input 
                type="checkbox" 
                checked={safety.showSafetyTipsOnLogin} 
                onChange={(e) => {
                  setSafety(prev => ({ ...prev, showSafetyTipsOnLogin: e.target.checked }));
                  // Auto-save this preference slightly delayed or just require button
                }}
                className="w-5 h-5 accent-pink-600"
              />
            </label>
            <button 
              onClick={handleSaveTips}
              disabled={saving}
              className="mt-3 text-xs text-pink-500 hover:text-pink-400 font-bold uppercase"
            >
              {saving ? t('settings.account.saving') : t('settings.account.save')}
            </button>
          </div>
        </div>
      </section>

      {/* Blocked Users */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">{t('settings.security.blocked.title')}</h3>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          {!profile?.blockedUserIds || profile.blockedUserIds.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">{t('settings.security.blocked.empty')}</p>
          ) : (
            <div className="space-y-3">
              {profile.blockedUserIds.map(uid => (
                <div key={uid} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">🚫</div>
                    <span className="text-sm font-mono text-gray-300 truncate w-32">{uid}</span>
                  </div>
                  <button 
                    onClick={() => handleUnblock(uid)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded transition-colors"
                  >
                    {t('settings.security.blocked.unblock')}
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4 text-center">
            {t('settings.security.blocked.info')}
          </p>
        </div>
      </section>

    </div>
  );
}
