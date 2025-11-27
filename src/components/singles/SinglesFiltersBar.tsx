import { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { AGE_RANGES } from '../../data/interests';
import type { Gender, AgeRange } from '../../types/profiles';

export interface SinglesFilters {
  genders: Gender[];
  ageRanges: AgeRange[];
  region: string;
  onlyVerified: boolean;
  onlyWithPhoto: boolean;
  onlyMyCountry: boolean; // NEW: Country filter
}

interface SinglesFiltersBarProps {
  filters: SinglesFilters;
  onChange: (f: SinglesFilters) => void;
  onClear: () => void;
}

export default function SinglesFiltersBar({ filters, onChange, onClear }: SinglesFiltersBarProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const updateFilter = <K extends keyof SinglesFilters>(key: K, value: SinglesFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArray = <T extends string>(current: T[], item: T): T[] => {
    return current.includes(item) ? current.filter(i => i !== item) : [...current, item];
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-white">Filtros</h2>
        <div className="flex gap-3">
          <button onClick={onClear} className="text-xs text-gray-400 hover:text-white underline">
            {t('singles.explore.filters.clear')}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 mt-4 border-t border-gray-700 pt-4 animate-fade-in">
          {/* Country Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
             <span className="text-sm font-medium text-gray-300">Only profiles from my country</span>
             <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={filters.onlyMyCountry}
                  onChange={(e) => updateFilter('onlyMyCountry', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
             </label>
          </div>

          {/* Genders */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('singles.preferences.genders.label')}</label>
            <div className="flex gap-2">
              {(['F', 'M', 'NB'] as Gender[]).map(g => (
                <button
                  key={g}
                  onClick={() => updateFilter('genders', toggleArray(filters.genders, g))}
                  className={`px-3 py-1 rounded text-sm border ${
                    filters.genders.includes(g) 
                      ? 'bg-pink-600 border-pink-600 text-white' 
                      : 'bg-gray-900 border-gray-600 text-gray-400'
                  }`}
                >
                  {g === 'F' ? t('gender.female') : g === 'M' ? t('gender.male') : t('gender.nonBinary')}
                </button>
              ))}
            </div>
          </div>

          {/* Ages */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('singles.preferences.ageRanges.label')}</label>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map(range => (
                <button
                  key={range.id}
                  onClick={() => updateFilter('ageRanges', toggleArray(filters.ageRanges, range.id as AgeRange))}
                  className={`px-3 py-1 rounded text-xs border ${
                    filters.ageRanges.includes(range.id as AgeRange)
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : 'bg-gray-900 border-gray-600 text-gray-400'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('singles.preferences.region.label')}</label>
            <input 
              type="text" 
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              placeholder="Ex: Lisboa"
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.onlyVerified}
                onChange={(e) => updateFilter('onlyVerified', e.target.checked)}
                className="accent-pink-600"
              />
              <span className="text-sm text-gray-300">{t('singles.preferences.onlyVerified')}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.onlyWithPhoto}
                onChange={(e) => updateFilter('onlyWithPhoto', e.target.checked)}
                className="accent-pink-600"
              />
              <span className="text-sm text-gray-300">{t('singles.preferences.onlyWithPhoto')}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
