import { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import FeaturedEventsCarousel from '../components/FeaturedEventsCarousel';
import { useTranslation } from '../i18n/LanguageContext';
import { useCurrentProfile } from '../hooks/useCurrentProfile';

export default function EventsPage() {
  const { t } = useTranslation();
  const { events, loading, error } = useEvents();
  const { profile } = useCurrentProfile();

  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [whenFilter, setWhenFilter] = useState('ALL');
  // Country Filter State
  const [activeCountry, setActiveCountry] = useState<string>(() => {
    // 1. Try localStorage (reuse clubs filter or separate? Let's use separate for flexibility but default to same logic)
    const stored = localStorage.getItem('xlife.eventsCountryFilter');
    if (stored) return stored;

    // 2. Try user profile
    if (profile?.homeCountryCode) return profile.homeCountryCode;

    // 3. Default to PT
    return 'PT';
  });

  const handleCountryChange = (code: string) => {
    setActiveCountry(code);
    localStorage.setItem('xlife.eventsCountryFilter', code);
  };

  // Derive regions from events for the dropdown
  const regions = useMemo(() =>
    Array.from(new Set(events.map(e => e.region || e.city))).filter(Boolean).sort(),
    [events]);

  const filteredEvents = useMemo(() => {
    const userCountry = profile?.homeCountryCode || profile?.country;

    // 1. Filter logic
    const result = events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion = regionFilter === 'ALL' || event.region === regionFilter || event.city === regionFilter;

      // Mock "When" filter logic (simplified)
      let matchesWhen = true;
      const eventDate = new Date(event.date);
      const now = new Date();
      if (whenFilter === 'THIS_MONTH') {
        matchesWhen = eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      } else if (whenFilter === 'NEXT_MONTH') {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        matchesWhen = eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
      }

      // Country filter logic
      let matchesCountry = true;
      if (activeCountry !== 'ALL') {
        matchesCountry = event.countryCode === activeCountry;
      }

      return matchesSearch && matchesRegion && matchesWhen && matchesCountry;
    });

    // 2. Sort logic (Home country first if showing all)
    result.sort((a, b) => {
      const aIsHome = a.countryCode === userCountry ? 1 : 0;
      const bIsHome = b.countryCode === userCountry ? 1 : 0;
      if (aIsHome !== bIsHome) return bIsHome - aIsHome;
      return new Date(a.date).getTime() - new Date(b.date).getTime(); // Then by date
    });

    return result;
  }, [events, searchTerm, regionFilter, whenFilter, activeCountry, profile]);

  const countries = [
    { code: 'PT', label: 'Portugal' },
    { code: 'ES', label: 'Espanha' },
    { code: 'FR', label: 'França' },
    { code: 'DE', label: 'Alemanha' },
    { code: 'ALL', label: 'Todos' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('events.title')}</h1>
            <p className="text-md text-gray-400 mt-2">{t('events.subtitle')}</p>
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <input
            type="text"
            placeholder={t('events.searchPlaceholder')}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full md:w-48 p-2.5"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="ALL">{t('events.filterRegion')}: {t('events.filterWhenAll')}</option>
            {regions.map(r => <option key={r} value={r as string}>{r}</option>)}
          </select>
          <select
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full md:w-48 p-2.5"
            value={whenFilter}
            onChange={(e) => setWhenFilter(e.target.value)}
          >
            <option value="ALL">{t('events.filterWhen')}: {t('events.filterWhenAll')}</option>
            <option value="THIS_MONTH">{t('events.filterWhenThisMonth')}</option>
            <option value="NEXT_MONTH">{t('events.filterWhenNextMonth')}</option>
          </select>
        </div>

        <FeaturedEventsCarousel />

        <h2 className="text-2xl font-bold text-white mb-6 mt-12">{t('events.allEvents')}</h2>

        {loading && <p className="text-gray-400">{t('events.loading')}</p>}
        {error && <p className="text-red-500">{t('events.error')}</p>}

        {!loading && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">{t('events.emptyState')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
