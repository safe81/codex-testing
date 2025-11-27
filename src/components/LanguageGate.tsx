import { useTranslation } from '../i18n/LanguageContext';
import LanguageSelector from './settings/LanguageSelector';

export default function LanguageGate() {
  const { t } = useTranslation();
  const hasLanguage = localStorage.getItem('swinger_ui_language');

  // If language is already set, don't show this gate
  if (hasLanguage) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            XLife
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Freedom to explore.</p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6">
          {t('language.gate.title') || 'Choose your language'}
        </h2>

        {/* Selector */}
        <LanguageSelector />

        {/* Footer Note */}
        <p className="text-sm text-gray-500 mt-12">
          You can change this later in settings.
        </p>
      </div>
    </div>
  );
}
