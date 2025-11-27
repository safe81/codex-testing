import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Move ToggleRow component outside to prevent re-creation on render
const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-800">
    <span className="text-sm text-gray-200 pr-4">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 accent-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-900"
    />
  </div>
);

export default function NotificationsSettingsPage() {
  const navigate = useNavigate();

  // General
  const [newMessages, setNewMessages] = useState(true);
  const [contactRequests, setContactRequests] = useState(true);
  const [comments, setComments] = useState(true);
  const [tags, setTags] = useState(true);

  // Members
  const [speedDatesTravels, setSpeedDatesTravels] = useState(false);
  const [newLikeMinded, setNewLikeMinded] = useState(true);
  const [likeMindedNearby, setLikeMindedNearby] = useState(true);
  const [likeMindedTravelling, setLikeMindedTravelling] = useState(false);

  // Groups
  const [groupUpdates, setGroupUpdates] = useState(true);
  const [newGroupMembers, setNewGroupMembers] = useState(false);

  // Parties
  const [newNearbyParties, setNewNearbyParties] = useState(true);
  const [partyUpdates, setPartyUpdates] = useState(true);
  const [contactsGoingParties, setContactsGoingParties] = useState(true);
  const [hostingParties, setHostingParties] = useState(true);

  // Other
  const [communityNews, setCommunityNews] = useState(true);

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
            Notificações
          </h1>
        </div>

        {/* Content Area */}
        <div className="px-4 py-2 pb-8">
          
          <div className="mt-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Geral</h2>
            <ToggleRow label="Novas mensagens" checked={newMessages} onChange={setNewMessages} />
            <ToggleRow label="Pedidos de contacto" checked={contactRequests} onChange={setContactRequests} />
            <ToggleRow label="Comentários" checked={comments} onChange={setComments} />
            <ToggleRow label="Tags / Menções" checked={tags} onChange={setTags} />
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Membros</h2>
            <ToggleRow label="Membros, speed dates & viagens" checked={speedDatesTravels} onChange={setSpeedDatesTravels} />
            <ToggleRow label="Novos membros compatíveis" checked={newLikeMinded} onChange={setNewLikeMinded} />
            <ToggleRow label="Membros compatíveis por perto" checked={likeMindedNearby} onChange={setLikeMindedNearby} />
            <ToggleRow label="Membros compatíveis a viajar para a tua zona" checked={likeMindedTravelling} onChange={setLikeMindedTravelling} />
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Grupos</h2>
            <ToggleRow label="Atualizações de grupos" checked={groupUpdates} onChange={setGroupUpdates} />
            <ToggleRow label="Novos membros no grupo" checked={newGroupMembers} onChange={setNewGroupMembers} />
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Festas</h2>
            <ToggleRow label="Novas festas por perto" checked={newNearbyParties} onChange={setNewNearbyParties} />
            <ToggleRow label="Atualizações de festas (interessado/vou)" checked={partyUpdates} onChange={setPartyUpdates} />
            <ToggleRow label="Festas onde os teus contactos vão" checked={contactsGoingParties} onChange={setContactsGoingParties} />
            <ToggleRow label="Festas que organizas" checked={hostingParties} onChange={setHostingParties} />
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Comunidade</h2>
            <ToggleRow label="Notícias da comunidade" checked={communityNews} onChange={setCommunityNews} />
          </div>

        </div>
      </div>
    </div>
  );
}
