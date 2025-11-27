// src/pages/ProfileDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { MapPin, CheckCircle } from 'lucide-react';

// (As funções helper e o SkeletonLoader mantêm-se como no prompt anterior)
const calculateAge = (birthDate: string): number | null => {
    try {
        const birthday = new Date(birthDate);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch { return null; }
};

const SkeletonLoader = () => (
    <div className="max-w-4xl mx-auto p-4 animate-pulse">
        <div className="w-full h-96 bg-slate-800/80 rounded-xl mb-6"></div>
        <div className="h-10 bg-slate-800/80 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-slate-800/80 rounded w-1/4 mb-8"></div>
        <div className="h-20 bg-slate-800/80 rounded w-full mb-8"></div>
    </div>
);


const ProfileDetailPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { profile, loading, error } = useProfile(userId);

    // TODO: Integrar com os serviços reais de swipe, chat e safety
    const handleLike = () => console.log("Ação: Gostar");
    const handleMessage = () => console.log("Ação: Enviar Mensagem");
    const handleBlock = () => console.log("Ação: Bloquear");
    const handleReport = () => console.log("Ação: Denunciar");

    if (loading) {
        return <div className="min-h-screen bg-slate-950 text-white p-8"><SkeletonLoader /></div>;
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-400 bg-red-900/30 border border-red-500/40 rounded-lg px-4 py-3 text-center mb-6">
                    {error || "Este perfil não foi encontrado."}
                </p>
                <button onClick={() => navigate(-1)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                    Voltar
                </button>
            </div>
        );
    }

    const age = profile.birthDate ? calculateAge(profile.birthDate) : null;
    const location = [profile.city, profile.country?.toUpperCase()].filter(Boolean).join(', ');

    return (
        <>
            <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-200 mb-6">
                        &larr; Voltar
                    </button>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Hero com Avatar */}
                        <div className="relative p-6 md:p-8 bg-slate-800/50">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700">
                                    <img
                                        src={profile.mainPhotoUrl || 'https://via.placeholder.com/150'}
                                        alt={profile.nickname}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center gap-4 justify-center sm:justify-start">
                                        <h1 className="text-4xl font-bold text-white">{profile.nickname}</h1>
                                    </div>
                                    <p className="text-xl text-slate-300 mt-1">{age ? `${age} anos` : ''}</p>
                                    {location && (
                                        <div className="flex items-center text-slate-400 mt-2 justify-center sm:justify-start">
                                            <MapPin className="w-5 h-5 mr-2" />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow"></div>
                                {profile.verified && (
                                    <span className="flex items-center gap-1 text-cyan-400 self-start sm:self-center">
                                        <CheckCircle size={18} /> Verificado
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Galeria de Fotos */}
                            {/* TODO: Adicionar galeria de fotos aqui */}

                            {/* Sobre */}
                            {profile.bio && (
                                <div className="mt-8">
                                    <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-3">Sobre</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                                </div>
                            )}

                            {/* Interesses */}
                            {profile.interests && profile.interests.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-sm uppercase tracking-wider font-semibold text-slate-500 mb-3">Interesses</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.interests.map((interest: string) => (
                                            <span key={interest} className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-medium">{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botões de Ação */}
                            <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap gap-4">
                                <button onClick={handleLike} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-6 rounded-lg">Gostar</button>
                                <button onClick={handleMessage} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg">Mensagem</button>
                                <button onClick={handleBlock} className="flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 px-4 rounded-lg">Bloquear</button>
                                <button onClick={handleReport} className="flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 px-4 rounded-lg">Denunciar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileDetailPage;
