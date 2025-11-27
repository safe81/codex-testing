
export interface Profile {
  id: string;
  name: string;
  age?: number;
  location: string;
  interests: string[];
  imageUrl: string;
  type?: 'COUPLE' | 'SINGLE_F' | 'SINGLE_M'; // Added type for more variety
  description?: string;
}

export const mockProfiles: Profile[] = [
  // CASAIS
  {
    id: '1',
    name: 'Ana & Ricardo',
    age: 34,
    location: 'Lisboa, Portugal',
    interests: ['Viagens', 'Jantares', 'Cinema', 'Massagens'],
    imageUrl: 'https://images.unsplash.com/photo-1621255476629-873b88b2e379?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Casal divertido que adora explorar novos lugares e experiências gastronómicas.'
  },
  {
    id: '2',
    name: 'Joana & Pedro',
    age: 29,
    location: 'Porto, Portugal',
    interests: ['Festas', 'Dança', 'Cocktails', 'Praia'],
    imageUrl: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1974&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Adoramos a vida noturna e dançar até o amanhecer. Procuramos casais com a mesma energia.'
  },
  {
    id: '3',
    name: 'Sofia & Miguel',
    age: 42,
    location: 'Cascais, Portugal',
    interests: ['Vinho', 'Golf', 'Spa', 'Leitura'],
    imageUrl: 'https://images.unsplash.com/photo-1516575334481-f85287c2c81d?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Apreciadores de um bom vinho e momentos relaxantes. Buscamos conexões intelectuais e amizades duradouras.'
  },
  {
    id: '4',
    name: 'Marta & Tiago',
    age: 38,
    location: 'Algarve, Portugal',
    interests: ['Natureza', 'Surf', 'Yoga', 'Campismo'],
    imageUrl: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?q=80&w=1887&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Espíritos livres em conexão com a natureza. Praticantes de surf e yoga.'
  },
  {
    id: '5',
    name: 'Beatriz & André',
    age: 26,
    location: 'Coimbra, Portugal',
    interests: ['Jogos', 'Séries', 'Culinária', 'Tecnologia'],
    imageUrl: 'https://images.unsplash.com/photo-1518536630857-41b4b0a4305f?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Geeks apaixonados por tecnologia e cultura pop. Adoramos cozinhar juntos.'
  },
  {
    id: '6',
    name: 'Carla & Jorge',
    age: 45,
    location: 'Braga, Portugal',
    interests: ['História', 'Motos', 'Rock', 'Cerveja'],
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Fãs de rock clássico e passeios de moto. Gostamos de descobrir a história local.'
  },
  {
    id: '7',
    name: 'Inês & Rui',
    age: 31,
    location: 'Sintra, Portugal',
    interests: ['Fotografia', 'Passeios', 'Arte', 'Museus'],
    imageUrl: 'https://images.unsplash.com/photo-1623943362141-8664f33b1e39?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Amantes das artes e da fotografia. Sintra é o nosso cenário perfeito.'
  },
  {
    id: '8',
    name: 'Cláudia & Fernando',
    age: 50,
    location: 'Funchal, Madeira',
    interests: ['Cruzeiros', 'Dança de Salão', 'Jantares Gourmet'],
    imageUrl: 'https://images.unsplash.com/photo-1569974498991-d3c12a5f04f95?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Gostamos de viajar e apreciar a boa gastronomia. A vida é para ser celebrada.'
  },
  {
    id: '9',
    name: 'Patrícia & Hugo',
    age: 33,
    location: 'Aveiro, Portugal',
    interests: ['Praia', 'Desporto', 'Saúde', 'Fitness'],
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2080&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'Casal fitness que adora treinar e passar dias na praia.'
  },
  {
    id: '10',
    name: 'Vera & Nuno',
    age: 36,
    location: 'Évora, Portugal',
    interests: ['Campo', 'Vinhos', 'Gastronomia Alentejana'],
    imageUrl: 'https://images.unsplash.com/photo-1548263594-a71c3f35d488?q=80&w=2070&auto=format&fit=crop',
    type: 'COUPLE',
    description: 'A calma do Alentejo define-nos. Apreciadores dos pequenos prazeres da vida.'
  },

  // SINGLES (MULHERES)
  {
    id: '11',
    name: 'Mariana',
    age: 28,
    location: 'Lisboa, Portugal',
    interests: ['Moda', 'Design', 'Festas Exclusivas'],
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    type: 'SINGLE_F',
    description: 'Designer de moda, adoro eventos sociais e conhecer pessoas criativas.'
  },
  {
    id: '12',
    name: 'Catarina',
    age: 32,
    location: 'Porto, Portugal',
    interests: ['Yoga', 'Meditação', 'Natureza'],
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop',
    type: 'SINGLE_F',
    description: 'Em busca de equilíbrio e conexão com a natureza. Praticante dedicada de yoga.'
  },
  {
    id: '13',
    name: 'Isabel',
    age: 40,
    location: 'Faro, Portugal',
    interests: ['Música', 'Dança', 'Cinema'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    type: 'SINGLE_F',
    description: 'Apaixonada por música ao vivo e cinema independente. Adoro dançar.'
  },

  // SINGLES (HOMENS)
  {
    id: '14',
    name: 'Ricardo',
    age: 35,
    location: 'Lisboa, Portugal',
    interests: ['Desporto', 'Negócios', 'Networking'],
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
    type: 'SINGLE_M',
    description: 'Empreendedor focado em negócios e desporto. Gosto de expandir a minha rede de contactos.'
  },
  {
    id: '15',
    name: 'David',
    age: 30,
    location: 'Braga, Portugal',
    interests: ['Tecnologia', 'Gaming', 'Música Eletrónica'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    type: 'SINGLE_M',
    description: 'Programador e gamer. Fã de festivais de música eletrónica e novas tecnologias.'
  }
];
