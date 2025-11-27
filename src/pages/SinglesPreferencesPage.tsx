import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useCurrentProfile } from '../hooks/useCurrentProfile';
import { useTranslation } from '../i18n/LanguageContext';
import { INTEREST_OPTIONS, AGE_RANGES } from '../data/interests';
import type { SearchPreferences, Gender, AgeRange } from '../types/profiles';

export default function SinglesPreferencesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, loading } = useCurrentProfile();
  const [saving, setSaving] = useState(false);
  
  // Local state for form
  const [prefs, setPrefs] = useState<SearchPreferences>({});

  // Initialize state when profile loads
  useEffect(() => {
    if (profile && profile.searchPreferences) {
      setPrefs(profile.searchPreferences);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', profile.id), {
        searchPreferences: prefs
      });
      navigate('/singles'); // Or explore
    } catch (err) {
      console.error("Error saving preferences:", err);
      alert(t('singles.preferences.saveError'));
    } finally {
      setSaving(false);
    }
  };

  // Helpers to toggle array items
  const toggleGender = (g: Gender) => {
    setPrefs(prev => {
      const current = prev.preferredGenders || [];
      const updated = current.includes(g) 
        ? current.filter(item => item !== g)
        : [...current, g];
      return { ...prev, preferredGenders: updated };
    });
  };

  const toggleAgeRange = (r: AgeRange) => {
    setPrefs(prev => {
      const current = prev.preferredAgeRanges || [];
      const updated = current.includes(r)
        ? current.filter(item => item !== r)
        : [...current, r];
      return { ...prev, preferredAgeRanges: updated };
    });
  };

  const toggleInterest = (i: string) => {
    setPrefs(prev => {
      const current = prev.preferredInterests || [];
      const updated = current.includes(i)
        ? current.filter(item => item !== i)
        : [...current, i];
      return { ...prev, preferredInterests: updated };
    });
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            {t('singles.preferences.title')}
          </h1>
          <p className="text-gray-400">{t('singles.preferences.subtitle')}</p>
        </header>

        {/* Auto Apply Toggles */}
        <section className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('singles.preferences.autoApply.explore')}</span>
            <input 
              type="checkbox" 
              checked={prefs.autoApplyOnSinglesExplore || false}
              onChange={(e) => setPrefs({...prefs, autoApplyOnSinglesExplore: e.target.checked})}
              className="w-5 h-5 accent-pink-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('singles.preferences.autoApply.swipe')}</span>
            <input 
              type="checkbox" 
              checked={prefs.autoApplyOnSinglesSwipe || false}
              onChange={(e) => setPrefs({...prefs, autoApplyOnSinglesSwipe: e.target.checked})}
              className="w-5 h-5 accent-pink-600 rounded"
            />
          </div>
        </section>

        {/* Genders */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">{t('singles.preferences.genders.label')}</h3>
          <div className="flex gap-3">
            {(['F', 'M', 'NB'] as Gender[]).map(g => (
              <button
                key={g}
                onClick={() => toggleGender(g)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  prefs.preferredGenders?.includes(g)
                    ? 'bg-pink-600 border-pink-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                {g === 'F' ? t('gender.female') : g === 'M' ? t('gender.male') : t('gender.nonBinary')}
              </button>
            ))}
          </div>
        </section>

        {/* Age Ranges */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">{t('singles.preferences.ageRanges.label')}</h3>
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map(r => (
              <button
                key={r.id}
                onClick={() => toggleAgeRange(r.id as AgeRange)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  prefs.preferredAgeRanges?.includes(r.id as AgeRange)
                    ? 'bg-pink-600 border-pink-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                {t(`ageRange.${r.id}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Region */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase">{t('singles.preferences.region.label')}</h3>
          <div className="flex items-center space-x-2 mb-2">
             <input 
              type="checkbox"
              checked={prefs.preferSameRegion || false}
              onChange={(e) => setPrefs({...prefs, preferSameRegion: e.target.checked})}
              className="w-4 h-4 accent-pink-600"
             />
             <span className="text-sm">{t('singles.preferences.preferSameRegion')}</span>
          </div>
          {/* Simple text input for region preference (could be multi-select in future) */}
          {/* Using preferredRegions[0] as simple single region input for now */}
          <input 
            type="text"
            placeholder={t('singles.preferences.region.placeholder')}
            value={prefs.preferredRegions?.[0] || ''}
            onChange={(e) => setPrefs({...prefs, preferredRegions: [e.target.value]})}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500"
          />
        </section>

        {/* Extra Filters */}
        <section className="space-y-3 bg-gray-800 p-4 rounded-xl">
           <div className="flex items-center justify-between">
            <span className="text-sm">{t('singles.preferences.onlyVerified')}</span>
            <input 
              type="checkbox" 
              checked={prefs.onlyVerified || false}
              onChange={(e) => setPrefs({...prefs, onlyVerified: e.target.checked})}
              className="w-5 h-5 accent-pink-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('singles.preferences.onlyWithPhoto')}</span>
            <input 
              type="checkbox" 
              checked={prefs.onlyWithPhoto || false}
              onChange={(e) => setPrefs({...prefs, onlyWithPhoto: e.target.checked})}
              className="w-5 h-5 accent-pink-600 rounded"
            />
          </div>
        </section>

        {/* Interests */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">{t('singles.preferences.interests.label')}</h3>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(i => (
              <button
                key={i.id}
                onClick={() => toggleInterest(i.id)}
                className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                  prefs.preferredInterests?.includes(i.id)
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? t('singles.preferences.saving') : t('singles.preferences.saveButton')}
        </button>
      </div>
    </div>
  );
}
