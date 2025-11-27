import type { AppEvent } from '../types/events';

export const mockEvents: AppEvent[] = [
  {
    id: 'evt1',
    title: 'Noite de Verão na Piscina',
    description: 'Uma festa exclusiva à beira da piscina com cocktails refrescantes e música ambiente.',
    date: '2024-08-15T21:00:00Z',
    city: 'Lisboa',
    region: 'Lisboa',
    countryCode: 'PT',
    isFeatured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1578940829379-1c595b1ead66?auto=format&fit=crop&q=80&w=800',
    clubId: 'mock_club1',
    tags: ['piscina', 'festa', 'exclusivo'],
  },
  {
    id: 'evt2',
    title: 'Baile de Máscaras Misterioso',
    description: 'Traga a sua máscara e deixe-se envolver pelo mistério de uma noite elegante.',
    date: '2024-08-22T22:00:00Z',
    city: 'Porto',
    region: 'Porto',
    countryCode: 'PT',
    isFeatured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1596700249549-3c35b803a56b?auto=format&fit=crop&q=80&w=800',
    tags: ['mistério', 'elegante'],
  },
  // International event
  {
    id: 'evt_es_1',
    title: 'Fiesta de la Luna',
    description: 'Una noche mágica bajo la luna llena en Barcelona.',
    date: '2024-09-10T23:00:00Z',
    city: 'Barcelona',
    countryCode: 'ES',
    isFeatured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97d89b?auto=format&fit=crop&q=80&w=800',
    tags: ['fiesta', 'noche'],
  }
];
