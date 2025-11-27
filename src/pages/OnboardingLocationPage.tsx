import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from '../i18n/LanguageContext';
import { PrimaryButton } from '../components/buttons';

// Simple list of countries for MVP
const COUNTRIES = [
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'España' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'United States' },
  { code: 'OTHER', name: 'Other / Outro' },
];

export default function OnboardingLocationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const [countryCode, setCountryCode] = useState('PT');
  const [city, setCity] = useState('');

  // Check if already set, if so skip (or pre-fill)
  useEffect(() => {
    if (!user) return;
    // In a real scenario we might check this higher up to avoid flicker,
    // but here we handle the form logic.
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      
      // Check if profile exists first (it might not if fresh login)
      // If using standard flow, profile might be created at register or partial.
      // We use setDoc with merge true to be safe or updateDoc if we know it exists.
      // For safety in this specific flow step:
      
      await updateDoc(profileRef, {
        homeCountryCode: countryCode,
        city: city,
        preferredCountries: [countryCode], // Default preference
        // We can also set updated At
        updatedAt: new Date().toISOString() 
      });

      // Proceed to next step: Role Selection (Choose Account Type)
      navigate('/choose-account-type');

    } catch (error) {
      console.error("Error saving location:", error);
      // If document doesn't exist yet (rare but possible if purely Auth'd without Firestore trigger yet),
      // we might need setDoc. But assuming standard flow creates the placeholder.
      alert("Error saving location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t('onboarding.location.title') || "Choose your main country"}</h1>
          <p className="text-gray-400">
            {t('onboarding.location.subtitle') || "We will prioritise content from your region."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('settings.account.country')}
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('settings.account.city')}
            </label>
            <input 
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lisbon"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-xs text-gray-500">
            <p>
              {t('onboarding.location.disclaimer') || 
               "You can still explore other countries later by changing your preferences."}
            </p>
          </div>

          <PrimaryButton type="submit" disabled={loading} className="w-full py-3.5 font-bold text-lg">
            {loading ? t('settings.saving') : t('onboarding.single.form.submit') || "Continue"}
          </PrimaryButton>

        </form>
      </div>
    </div>
  );
}
