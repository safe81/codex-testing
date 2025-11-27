export interface InterestOption {
  id: string;
  label: string;
  icon?: string;
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'soft_swap', label: 'Soft swap' },
  { id: 'full_swap', label: 'Full swap' },
  { id: 'voyeur', label: 'Voyeur' },
  { id: 'exhibitionist', label: 'Exibicionismo' },
  { id: 'parties', label: 'Festas privadas' },
  { id: 'kink', label: 'Kink / BDSM light' },
  { id: 'online', label: 'Conversa Online' },
  { id: 'friendship', label: 'Amizade' },
  { id: 'Viagens', label: 'Viagens' },
  { id: 'Jantares', label: 'Jantares' },
  { id: 'Cinema', label: 'Cinema' },
  { id: 'Massagens', label: 'Massagens' },
  { id: 'Festas', label: 'Festas' },
  { id: 'Dança', label: 'Dança' },
  { id: 'Cocktails', label: 'Cocktails' },
  { id: 'Praia', label: 'Praia' },
  { id: 'Vinho', label: 'Vinho' },
  { id: 'Golf', label: 'Golf' },
  { id: 'Spa', label: 'Spa' },
  { id: 'Leitura', label: 'Leitura' },
  { id: 'Natureza', label: 'Natureza' },
  { id: 'Surf', label: 'Surf' },
  { id: 'Yoga', label: 'Yoga' },
  { id: 'Campismo', label: 'Campismo' },
  { id: 'Jogos', label: 'Jogos' },
  { id: 'Séries', label: 'Séries' },
  { id: 'Culinária', label: 'Culinária' },
  { id: 'Tecnologia', label: 'Tecnologia' },
  { id: 'História', label: 'História' },
  { id: 'Motos', label: 'Motos' },
  { id: 'Rock', label: 'Rock' },
  { id: 'Cerveja', label: 'Cerveja' },
  { id: 'Fotografia', label: 'Fotografia' },
  { id: 'Passeios', label: 'Passeios' },
  { id: 'Arte', label: 'Arte' },
  { id: 'Museus', label: 'Museus' },
  { id: 'Cruzeiros', label: 'Cruzeiros' },
  { id: 'Dança de Salão', label: 'Dança de Salão' },
  { id: 'Jantares Gourmet', label: 'Jantares Gourmet' },
  { id: 'Desporto', label: 'Desporto' },
  { id: 'Saúde', label: 'Saúde' },
  { id: 'Fitness', label: 'Fitness' },
  { id: 'Campo', label: 'Campo' },
  { id: 'Vinhos', label: 'Vinhos' },
  { id: 'Gastronomia Alentejana', label: 'Gastronomia Alentejana' },
  { id: 'Moda', label: 'Moda' },
  { id: 'Design', label: 'Design' },
  { id: 'Festas Exclusivas', label: 'Festas Exclusivas' },
  { id: 'Meditação', label: 'Meditação' },
  { id: 'Música', label: 'Música' },
  { id: 'Negócios', label: 'Negócios' },
  { id: 'Networking', label: 'Networking' },
  { id: 'Gaming', label: 'Gaming' },
  { id: 'Música Eletrónica', label: 'Música Eletrónica' },

  // Orientation / Preference tags
  { id: 'hetero_only', label: 'Hetero apenas' },
  { id: 'she_bi', label: 'Ela bi / bi-curiosa' },
  { id: 'he_bi', label: 'Ele bi / bi-curioso' },
  { id: 'both_bi', label: 'Ambos bi' },
  { id: 'same_gender', label: 'Gay / Lésbico' },
];

export const EXPERIENCE_LEVELS = [
  { id: 'NEW', label: 'Novato' },
  { id: 'SOFT_SWAP', label: 'Soft Swap' },
  { id: 'FULL_SWAP', label: 'Full Swap' },
  { id: 'HOTWIFING', label: 'Hotwifing' },
  { id: 'CUCKHOLDING', label: 'Cuckolding' },
  { id: 'STAG_VIXEN', label: 'Stag & Vixen' },
  { id: 'UNICORN_HUNTERS', label: 'Unicorn Hunters' },
  { id: 'POLYAMORY', label: 'Poliamor' },
  { id: 'THREESOME', label: 'Threesome' },
  { id: 'GROUP_SEX', label: 'Group Sex' },
  { id: 'ORGY', label: 'Orgia' },
  { id: 'GANGBANG', label: 'Gangbang' },
  { id: 'EXHIBITIONISM', label: 'Exibicionismo' },
  { id: 'VOYEURISM', label: 'Voyeurismo' },
  { id: 'BDSM', label: 'BDSM' },
];

export const RELATIONSHIP_TYPES = [
  { id: 'SINGLE', label: 'Single' },
  { id: 'COUPLE', label: 'Casal' },
  { id: 'GROUP', label: 'Grupo' },
];

export const AGE_RANGES = [
  { id: 'UNDER_30', label: 'Até 30' },
  { id: 'AGE_30_39', label: '30–39' },
  { id: 'AGE_40_49', label: '40–49' },
  { id: 'AGE_50_59', label: '50–59' },
  { id: 'AGE_60_PLUS', label: '60+' },
];

// Alias para compatibilidade com código que faz `import { interests }`
export const interests = INTEREST_OPTIONS;
