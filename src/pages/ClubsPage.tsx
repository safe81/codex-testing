import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import type { Club } from '../types/clubs';
import ClubCard from '../components/ClubCard';
import { useTranslation } from '../i18n/LanguageContext';
import { useCurrentProfile } from '../hooks/useCurrentProfile';

export default function ClubsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clubs, loading, error } = useClubs();
  const { profile } = useCurrentProfile();

  // Country Filter State
  const [activeCountry, setActiveCountry] = useState<string>(() => {
    // 1. Try localStorage
    const stored = localStorage.getItem('xlife.clubsCountryFilter');
    if (stored) return stored;

    // 2. Try user profile
    if (profile?.homeCountryCode) return profile.homeCountryCode;

    // 3. Default to PT
    return 'PT';
  });

  const handleCountryChange = (code: string) => {
    setActiveCountry(code);
    localStorage.setItem('xlife.clubsCountryFilter', code);
  };

  // Filter logic
  const filteredClubs = useMemo(() => {
    const userCountry = profile?.homeCountryCode || profile?.country;

    // Sort function: User's country first, then others
    const sortClubs = (a: Club, b: Club) => {
      const aIsHome = a.countryCode === userCountry ? 1 : 0;
      const bIsHome = b.countryCode === userCountry ? 1 : 0;
      if (aIsHome !== bIsHome) return bIsHome - aIsHome;
      return a.name.localeCompare(b.name);
    };

    let result = [...clubs];

    if (activeCountry !== 'ALL') {
      // Filter strictly by country
      result = result.filter(c => c.countryCode === activeCountry);
    }

    return result.sort(sortClubs);
  }, [clubs, profile, activeCountry]);

  // Split premium vs others from the FILTERED list
  const premiumClubs = useMemo(
    () => filteredClubs.filter(c => c.tier === 'PREMIUM_PLUS' || c.tier === 'PREMIUM'),
    [filteredClubs]
  );

  const otherClubs = useMemo(
    () => filteredClubs.filter(c => c.tier === 'FREE'),
    [filteredClubs]
  );

  // Group by region for the non-premium list
  const clubsByRegion = useMemo(() => {
    const map: Record<string, Club[]> = {};
    for (const club of otherClubs) {
      const region = club.region || 'Outros';
      if (!map[region]) map[region] = [];
      map[region].push(club);
    }
    return map;
  }, [otherClubs]);

  const handleClubClick = (clubId: string) => {
    navigate(`/profiles/${clubId}`);
  };

  const countries = [
    { code: 'PT', label: 'Portugal' },
    { code: 'ES', label: 'Espanha' },
    { code: 'FR', label: 'França' },
    { code: 'DE', label: 'Alemanha' },
    { code: 'ALL', label: 'Todos' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('header.clubs')}</h1>
            <p className="text-md text-gray-400 mt-2">
              Descobre clubes selecionados {activeCountry === 'ALL' ? 'em todo o mundo' : `em ${countries.find(c => c.code === activeCountry)?.label}`}.
            </p>
          </div>

          {/* Country Selector */}
          <div className="flex flex-wrap gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-800 self-start sm:self-center">
            {countries.map(c => (
              <button
                key={c.code}
                onClick={() => handleCountryChange(c.code)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCountry === c.code
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {c.code === 'ALL' ? 'Todos' : c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-52 animate-pulse border border-gray-800"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-400 font-medium">Erro ao carregar clubes</p>
            <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Featured / Premium section - Carousel Style */}
            {premiumClubs.length > 0 && (
              <section className="mt-6 mb-12">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">🔥</span> Top Clubs
                </h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {premiumClubs.map(club => (
                    <div key={club.id} className="w-72 flex-shrink-0 cursor-pointer" onClick={() => handleClubClick(club.id)}>
                      <ClubCard club={club} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* List by region - Grid Style */}
            <section className="space-y-12">
              {Object.entries(clubsByRegion).length > 0 ? (
                Object.entries(clubsByRegion).map(([region, regionClubs]) => (
                  <div key={region}>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 border-l-4 border-pink-600 pl-3">
                      {region}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {regionClubs.map(club => (
                        <div key={club.id} onClick={() => handleClubClick(club.id)} className="cursor-pointer">
                          <ClubCard club={club} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                /* Only show empty state if truly empty */
                clubs.length > 0 && filteredClubs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-gray-400">Não há clubes neste filtro. Tenta ver "Todos".</p>
                  </div>
                ) : null
              )}

              {clubs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-4xl mb-4">🏛️</p>
                  <p className="text-gray-400 font-medium">
                    {t('clubs.emptyState')}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
