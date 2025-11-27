import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import useProfiles from '../hooks/useProfiles';
import { GhostButton } from '../components/buttons';
import { RELATIONSHIP_TYPES, EXPERIENCE_LEVELS, AGE_RANGES } from '../data/interests';
import type { RelationshipType, ExperienceLevel, AgeRange } from '../types/profiles';
import { useTranslation } from '../i18n/LanguageContext';
import { auth } from '../services/firebase';

// Mapping old filter types to the new AccountType equivalent for simpler logic
type FilterType = 'ALL' | 'COUPLE' | 'SINGLE_F' | 'SINGLE_M';

export default function ExplorePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  
  // Filters
  const [relationshipFilter, setRelationshipFilter] = useState<RelationshipType | 'ALL'>('ALL');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel | 'ALL'>('ALL');
  const [ageFilter, setAgeFilter] = useState<AgeRange | 'ALL'>('ALL');
  const [orientationFilter, setOrientationFilter] = useState<'ALL' | 'HETERO' | 'SHE_BI' | 'HE_BI' | 'BOTH_BI' | 'GAY_LESBIAN'>('ALL');
  
  // Auto-filter state
  const [autoFromProfile, setAutoFromProfile] = useState<boolean>(true);

  const { profiles, loading, error } = useProfiles();

  // Get current user profile from the loaded profiles list
  const currentProfile = profiles.find(p => p.id === auth.currentUser?.uid);

  useEffect(() => {
    if (!currentProfile) return;

    const prefs = currentProfile.searchPreferences;
    const shouldAutoApply = prefs?.autoApplyOnExplore ?? true;

    // Using setTimeout to avoid synchronous setState calls in effect
    setTimeout(() => {
      setAutoFromProfile(shouldAutoApply);

      if (!shouldAutoApply || !prefs) return;

      // Apply age filter from preferences
      if (prefs.preferredAgeRanges && prefs.preferredAgeRanges.length === 1) {
        setAgeFilter(prefs.preferredAgeRanges[0]);
      } else {
        setAgeFilter('ALL');
      }
    }, 0);

  }, [currentProfile]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('ALL');
    setRelationshipFilter('ALL');
    setExperienceFilter('ALL');
    setAgeFilter('ALL');
    setOrientationFilter('ALL');
    setAutoFromProfile(false); // If clearing, we probably want manual control
  };

  // Filter profiles based on all criteria
  const filteredProfiles = profiles.filter((profile) => {
    // Exclude own profile
    if (profile.id === auth.currentUser?.uid) return false;

    // Privacy Check: visibleInExplore
    // Default to true if undefined
    if (profile.privacySettings?.visibleInExplore === false) return false;

    // Block Check (if available in current profile context)
    if (currentProfile?.blockedUserIds?.includes(profile.id)) return false;
    // Mutual block check (requires profile to have loaded blockedUserIds, which might be restricted by rules, but logic here is safe)
    if (profile.blockedUserIds?.includes(currentProfile?.id || '')) return false;

    // 1. Search Term Filter
    const searchTermLower = searchTerm.toLowerCase();
    const nickname = profile.nickname?.toLowerCase() || '';
    const region = profile.region?.toLowerCase() || '';
    const city = profile.city?.toLowerCase() || '';
    const description = profile.description ? t(profile.description)?.toLowerCase() : '';

    const matchesSearch = 
      nickname.includes(searchTermLower) ||
      region.includes(searchTermLower) ||
      city.includes(searchTermLower) ||
      description.includes(searchTermLower);

    if (!matchesSearch) return false;

    // 2. Type/Account Filter (Legacy + New)
    if (filter !== 'ALL') {
       const pType = profile.type; 
       const pAccount = profile.accountType; 

       if (filter === 'COUPLE' && pType !== 'COUPLE' && pAccount !== 'COUPLE') return false;
       if (filter === 'SINGLE_F' && pType !== 'SINGLE_F') return false; 
       if (filter === 'SINGLE_M' && pType !== 'SINGLE_M') return false;
    }

    // 3. Relationship Type Filter
    if (relationshipFilter !== 'ALL') {
      if (profile.relationshipType !== relationshipFilter) return false;
    }

    // 4. Experience Level Filter
    if (experienceFilter !== 'ALL') {
      if (profile.experienceLevel !== experienceFilter) return false;
    }

    // 5. Age Filter
    if (ageFilter !== 'ALL') {
      if (!profile.ageRange || profile.ageRange !== ageFilter) return false;
    }

    // 6. Orientation Filter
    if (orientationFilter !== 'ALL') {
        const interests = profile.interests || [];
        const hasTag = (tags: string[]) => tags.some(tag => interests.includes(tag));
    
        switch (orientationFilter) {
          case 'HETERO': if (!hasTag(['hetero_only'])) return false; break;
          case 'SHE_BI': if (!hasTag(['she_bi'])) return false; break;
          case 'HE_BI': if (!hasTag(['he_bi'])) return false; break;
          case 'BOTH_BI': if (!hasTag(['both_bi'])) return false; break;
          case 'GAY_LESBIAN': if (!hasTag(['same_gender'])) return false; break;
        }
    }

    // 7. Auto-Preferences Filter
    if (autoFromProfile && currentProfile?.searchPreferences) {
        const prefs = currentProfile.searchPreferences;
    
        const isCouple = profile.accountType === 'COUPLE' || profile.type === 'COUPLE';
        const isSingleF = profile.type === 'SINGLE_F'; // AccountType 'USER' needs refinement for gender, relying on type
        const isSingleM = profile.type === 'SINGLE_M';
        const isGroup = profile.relationshipType === 'GROUP';
    
        let matchType = false;
        const anyTypePref =
          prefs.lookingForCouples ||
          prefs.lookingForSingleWomen ||
          prefs.lookingForSingleMen ||
          prefs.lookingForGroups;
    
        if (anyTypePref) {
          if (prefs.lookingForCouples && isCouple) matchType = true;
          if (prefs.lookingForSingleWomen && isSingleF) matchType = true;
          if (prefs.lookingForSingleMen && isSingleM) matchType = true;
          if (prefs.lookingForGroups && isGroup) matchType = true;
    
          if (!matchType) return false;
        }
    
        // Auto Age Filter (only if manual age filter is not set, or we treat manual as override)
        // Here we treat auto-apply as an ADDITIONAL strict filter if enabled.
        // If manual age filter is ALL, we apply preference. If manual is set, we respect manual.
        if (ageFilter === 'ALL' && prefs.preferredAgeRanges && prefs.preferredAgeRanges.length > 0) {
          if (!profile.ageRange || !prefs.preferredAgeRanges.includes(profile.ageRange)) {
            return false;
          }
        }
    
        // Auto Orientation Filter
        if (orientationFilter === 'ALL' && prefs.preferredOrientationTags && prefs.preferredOrientationTags.length > 0) {
          const interests = profile.interests || [];
          const hasAnyPreferredTag = prefs.preferredOrientationTags.some(tag =>
            interests.includes(tag),
          );
          if (!hasAnyPreferredTag) return false;
        }
      }

    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t('header.explore')}</h1>
          <p className="text-md text-gray-400 mt-2">Descobre casais e singles compatíveis contigo.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, região, cidade..."
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-full pl-12 pr-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Primary Filters (Tabs) */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === 'ALL' ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-900 text-gray-400 border-gray-700'}`}>Todos</button>
          <button onClick={() => setFilter('COUPLE')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === 'COUPLE' ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-900 text-gray-400 border-gray-700'}`}>Casais</button>
          <button onClick={() => setFilter('SINGLE_F')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === 'SINGLE_F' ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-900 text-gray-400 border-gray-700'}`}>Mulheres</button>
          <button onClick={() => setFilter('SINGLE_M')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === 'SINGLE_M' ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-900 text-gray-400 border-gray-700'}`}>Homens</button>
        </div>

        {/* Secondary Filters (Dropdowns & Toggles) */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 mb-8 space-y-4">
            
            {/* Top Row: Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Relationship Type */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Relação</label>
                    <select 
                        value={relationshipFilter}
                        onChange={(e) => setRelationshipFilter(e.target.value as RelationshipType | 'ALL')}
                        className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    >
                        <option value="ALL">Todos</option>
                        {RELATIONSHIP_TYPES.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Experience Level */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Experiência</label>
                    <select 
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value as ExperienceLevel | 'ALL')}
                        className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    >
                        <option value="ALL">Todos</option>
                        {EXPERIENCE_LEVELS.map(l => (
                            <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                    </select>
                </div>

                {/* Age Range */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Idade</label>
                    <select 
                        value={ageFilter}
                        onChange={(e) => setAgeFilter(e.target.value as AgeRange | 'ALL')}
                        className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    >
                        <option value="ALL">Todos</option>
                        {AGE_RANGES.map(r => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                    </select>
                </div>

                {/* Orientation */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Orientação</label>
                    <select 
                        value={orientationFilter}
                        onChange={(e) => setOrientationFilter(e.target.value as 'ALL' | 'HETERO' | 'SHE_BI' | 'HE_BI' | 'BOTH_BI' | 'GAY_LESBIAN')}
                        className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    >
                        <option value="ALL">Todos</option>
                        <option value="HETERO">Hetero apenas</option>
                        <option value="SHE_BI">Ela bi</option>
                        <option value="HE_BI">Ele bi</option>
                        <option value="BOTH_BI">Ambos bi</option>
                        <option value="GAY_LESBIAN">Gay / Lésbico</option>
                    </select>
                </div>
            </div>

            {/* Bottom Row: Auto-Toggle + Clear */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
                
                {currentProfile && (
                    <div className="flex items-center gap-2" title="Usa as tuas preferências de perfil para filtrar resultados">
                        <button
                            type="button"
                            onClick={() => setAutoFromProfile(prev => !prev)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            autoFromProfile ? 'bg-emerald-600' : 'bg-gray-700'
                            }`}
                        >
                            <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                autoFromProfile ? 'translate-x-4' : 'translate-x-1'
                            }`}
                            />
                        </button>
                        <span className={`text-xs font-medium ${autoFromProfile ? 'text-emerald-400' : 'text-gray-500'}`}>
                            Filtro automático
                        </span>
                    </div>
                )}

                <GhostButton onClick={clearFilters} className="text-xs text-gray-500 hover:text-white ml-auto">
                    Limpar filtros
                </GhostButton>
            </div>
        </div>

        {/* Content State Handling */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-3xl h-80 animate-pulse border border-gray-800 overflow-hidden">
                <div className="h-56 bg-gray-800"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-800 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-400 font-medium">Erro ao carregar perfis</p>
            <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <div key={profile.id} onClick={() => navigate(`/profiles/${profile.id}`)} className="cursor-pointer">
                    <ProfileCard profile={profile} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-4xl mb-4">👻</p>
                <p className="text-gray-400 font-medium">
                  {profiles.length > 0
                    ? 'Nenhum perfil corresponde à tua pesquisa.'
                    // TODO: Translate
                    : 'Ainda não existem perfis para mostrar.'}
                </p>
                {profiles.length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="mt-6 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
