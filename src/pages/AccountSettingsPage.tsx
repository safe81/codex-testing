import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useTranslation } from '../i18n/LanguageContext';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = auth.currentUser;
  const [feedback, setFeedback] = useState<{ type: 'info' | 'error'; message: string } | null>(null);

  const handleAction = (featureName: string) => {
    // This is a placeholder for the actual implementation.
    // In a real app, this would open a modal or navigate to a new page.
    setFeedback({ type: 'info', message: t('settings.account.feedback.notImplemented', { featureName }) });
    // Hide feedback after a few seconds
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        {/* Top Bar */}
        <div className="flex items-center p-4 border-b border-gray-800">
          <button 
            onClick={() => navigate('/settings')} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Voltar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold pr-10">
            Definições da Conta
          </h1>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className="px-4 pt-4">
            <div className={`w-full text-center p-3 rounded-lg text-sm ${
              feedback.type === 'info' ? 'bg-blue-900/50 border border-blue-700 text-blue-200' : 'bg-red-900/50 border border-red-700 text-red-200'
            }`}>
              {feedback.message}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="px-4 py-6 space-y-8">
          
          {/* Email Section */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-pink-500">Email</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-3">
              <p className="text-gray-300">
                {user?.email || 'Não autenticado'}
              </p>
            </div>
            <button
              onClick={() => handleAction('Alterar email')}
              className="text-sm font-medium text-pink-500 hover:text-pink-400 transition-colors px-2 py-1 rounded-lg hover:bg-gray-800"
            >
              Alterar email
            </button>
          </section>

          {/* Password Section */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-pink-500">Palavra-passe</h2>
            <button
              onClick={() => handleAction('Alterar palavra-passe')}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-xl transition-colors text-left flex justify-between items-center group"
            >
              <span>Alterar palavra-passe</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </section>

          {/* Delete Account Section */}
          <section className="pt-4 border-t border-gray-800">
            <h2 className="text-lg font-semibold mb-2 text-red-500">Apagar Conta</h2>
            <p className="text-gray-400 text-sm mb-4">
              Esta ação irá apagar permanentemente a sua conta e o seu perfil. Não poderá recuperar os seus dados.
            </p>
            <button
              onClick={() => handleAction('Apagar conta')}
              className="w-full py-3 px-4 bg-red-900/20 hover:bg-red-900/30 border border-red-900/50 text-red-400 font-medium rounded-xl transition-colors"
            >
              Apagar a minha conta
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
