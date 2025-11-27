import { useTranslation } from '../i18n/LanguageContext';
import type { SupportedLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('pt')}
        className={`px-2 py-1 text-sm rounded-md ${
          language === 'pt' ? 'font-bold text-white' : 'text-gray-400'
        }`}
      >
        PT
      </button>
      <span className="text-gray-500">|</span>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 text-sm rounded-md ${
          language === 'en' ? 'font-bold text-white' : 'text-gray-400'
        }`}
      >
        EN
      </button>
    </div>
  );
}
