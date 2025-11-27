import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { Profile } from '../types/profiles';
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  pt,
  en,
  es,
  fr,
  de,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [user] = useAuthState(auth);
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const stored = localStorage.getItem('swinger_ui_language');
    if (stored && ['pt', 'en', 'es', 'fr', 'de'].includes(stored)) {
      return stored as SupportedLanguage;
    }
    return 'en'; // Default to English if no language is set
  });

  // Sync language from profile on login
  useEffect(() => {
    const syncLanguageFromProfile = async () => {
      if (user) {
        try {
          const profileRef = doc(db, 'profiles', user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as Profile;
            if (profileData.uiLanguage && ['pt', 'en', 'es', 'fr', 'de'].includes(profileData.uiLanguage)) {
              setLanguageState(profileData.uiLanguage as SupportedLanguage);
              localStorage.setItem('swinger_ui_language', profileData.uiLanguage);
            }
          }
        } catch (error) {
          console.error("Error syncing language from profile:", error);
        }
      }
    };
    syncLanguageFromProfile();
  }, [user]);

  const setLanguage = async (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('swinger_ui_language', lang);
    
    // If logged in, update profile
    if (user) {
        try {
            const profileRef = doc(db, 'profiles', user.uid);
            await updateDoc(profileRef, { uiLanguage: lang });
        } catch (error) {
            console.error("Error updating language preference:", error);
        }
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
