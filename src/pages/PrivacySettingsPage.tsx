import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacySettingsPage() {
  const navigate = useNavigate();

  // 1. Visibility State (multiselect chips)
  const [hiddenFrom, setHiddenFrom] = useState<string[]>([]);

  // 2. Toggles State
  const [hideNonMatchingMembers, setHideNonMatchingMembers] = useState(false);
  const [restrictRequests, setRestrictRequests] = useState(false);
  const [restrictMessages, setRestrictMessages] = useState(false);
  const [onlyContacts, setOnlyContacts] = useState(false);
  const [blockInvites, setBlockInvites] = useState(false);

  const visibilityOptions = [
    'Lady',
    'Man',
    'Couple FM',
    'Couple FF',
    'Couple MM',
    'Other'
  ];

  const toggleHiddenFrom = (option: string) => {
    if (hiddenFrom.includes(option)) {
      setHiddenFrom(hiddenFrom.filter(item => item !== option));
    } else {
      setHiddenFrom([...hiddenFrom, option]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        {/* Top Bar */}
        <div className="flex items-center p-4 border-b border-gray-800">
          <button 
            onClick={() => navigate('/settings')} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold pr-10">
            Privacidade
          </h1>
        </div>

        {/* Content Area */}
        <div className="px-4 py-6 space-y-8">
          
          {/* Visibility Section */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-1">Visibilidade</h2>
            <p className="text-sm text-gray-400 mb-4">Esconder o meu perfil de:</p>
            
            <div className="flex flex-wrap gap-2">
              {visibilityOptions.map((option) => {
                const isActive = hiddenFrom.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleHiddenFrom(option)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      isActive
                        ? 'bg-pink-600 border-pink-600 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Privacy Toggles Section */}
          <section>
            <div className="space-y-1">
              {/* Toggle Row 1 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm text-gray-200 pr-4">Membros que não correspondem aos critérios de pesquisa</span>
                <input
                  type="checkbox"
                  checked={hideNonMatchingMembers}
                  onChange={(e) => setHideNonMatchingMembers(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-900"
                />
              </div>

              {/* Toggle Row 2 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm text-gray-200 pr-4">Pedidos de contacto – Apenas membros que correspondem aos critérios</span>
                <input
                  type="checkbox"
                  checked={restrictRequests}
                  onChange={(e) => setRestrictRequests(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-900"
                />
              </div>

              {/* Toggle Row 3 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm text-gray-200 pr-4">Mensagens – Apenas membros que correspondem aos critérios</span>
                <input
                  type="checkbox"
                  checked={restrictMessages}
                  onChange={(e) => setRestrictMessages(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-900"
                />
              </div>

              {/* Toggle Row 4 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm text-gray-200 pr-4">Apenas contactos</span>
                <input
                  type="checkbox"
                  checked={onlyContacts}
                  onChange={(e) => setOnlyContacts(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-900"
                />
              </div>

              {/* Toggle Row 5 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                <span className="text-sm text-gray-200 pr-4">Convites – Bloquear convites de grupos</span>
                <input
                  type="checkbox"
                  checked={blockInvites}
                  onChange={(e) => setBlockInvites(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-900"
                />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
