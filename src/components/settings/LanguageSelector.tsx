import { useTranslation } from '../../i18n/LanguageContext';
import type { SupportedLanguage } from '../../i18n/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
  small?: boolean;
}

export default function LanguageSelector({ className = '', small = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useTranslation();

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center justify-center transition-all rounded-lg border ${
            language === lang.code
              ? 'bg-pink-600 border-pink-600 text-white shadow-lg transform scale-105'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
          } ${small ? 'p-1.5 text-sm' : 'px-4 py-3 gap-3 text-lg w-full sm:w-auto'}`}
          title={lang.label}
        >
          <span className={small ? 'text-lg' : 'text-2xl'}>{lang.flag}</span>
          {!small && <span className="font-medium">{lang.label}</span>}
        </button>
      ))}
    </div>
  );
}
