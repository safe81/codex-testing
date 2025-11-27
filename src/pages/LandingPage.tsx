import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UiLanguage = 'pt' | 'en' | 'es' | 'fr' | 'de';

export default function LandingPage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState<UiLanguage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('DEBUG: LandingPage carregada');
  }, []);

  const persistSelection = () => {
    if (!language) {
      setError('Escolhe a língua antes de continuar.');
      return false;
    }

    localStorage.setItem('xlife.uiLanguage', language);
    setError(null);
    return true;
  };

  const handleEnter = () => {
    if (!persistSelection()) return;
    navigate('/login');
  };

  const handleRegister = () => {
    if (!persistSelection()) return;
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] to-[#02010b] flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-10">
        <div>
          <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_0_25px_rgba(236,72,153,0.7)]">
            XLife
          </h1>
          <p className="mt-4 text-gray-300">
            Escolhe a língua da aplicação antes de entrar.
          </p>
        </div>

        {/* Língua da interface */}
        <div className="space-y-4">
          <h2 className="text-xs tracking-[0.3em] text-gray-400 uppercase">
            Língua da interface
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { code: 'pt', label: 'Português' },
              { code: 'en', label: 'Inglês' },
              { code: 'es', label: 'Espanhol' },
              { code: 'fr', label: 'Francês' },
              { code: 'de', label: 'Alemão' },
            ].map((l) => {
              const isActive = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code as UiLanguage)}
                  className={`px-5 py-2.5 rounded-full border text-sm transition
                    ${isActive
                      ? 'border-emerald-400/80 bg-emerald-500/10 text-white'
                      : 'border-gray-700/80 bg-black/20 text-gray-300 hover:border-emerald-400/60'
                    }`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Erro */}
        {error && (
          <p className="text-sm text-pink-400 font-medium">{error}</p>
        )}

        {/* Botões */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={handleEnter}
            className="px-10 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/40 hover:brightness-110 transition"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={handleRegister}
            className="px-10 py-3 rounded-full border border-gray-600 bg-black/40 text-gray-100 font-semibold hover:border-pink-500/70 hover:text-white transition"
          >
            Registar
          </button>
        </div>
      </div>
    </div>
  );
}
