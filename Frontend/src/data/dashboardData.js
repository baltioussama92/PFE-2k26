// ── Dashboard Mock Data ──────────────────────────────────────

// ── Proprietor ───────────────────────────────────────────────
export const PROPRIETOR_STATS = [
  { id: 'earnings',  label: 'Revenus totaux',     value: '24,850',  unit: 'TND',  delta: +18.4, icon: 'TrendingUp',  color: 'indigo' },
  { id: 'listings',  label: 'Annonces actives',   value: '7',       unit: '',     delta: +2,    icon: 'Building2',   color: 'blue'   },
  { id: 'bookings',  label: 'Réservations',        value: '43',      unit: '',     delta: +11.2, icon: 'CalendarCheck',color:'emerald' },
  { id: 'messages',  label: 'Nouveaux messages',  value: '12',      unit: '',     delta: -3,    icon: 'MessageSquare',color: 'amber'  },
]

export const PROPRIETOR_PROPERTIES = [
  {
    id: 'p1', title: 'Appartement Panoramique – Lac II',
    location: 'Tunis', price: 1800, status: 'active',
    bookings: 12, rating: 4.9, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=75',
    revenue: 8400, views: 345,
  },
  {
    id: 'p2', title: 'Villa Contemporaine avec Piscine',
    location: 'La Marsa', price: 3500, status: 'active',
    bookings: 8, rating: 4.8, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=75',
    revenue: 14200, views: 589,
  },
  {
    id: 'p3', title: 'Studio Design – Centre Ville',
    location: 'Tunis', price: 850, status: 'inactive',
    bookings: 23, rating: 4.7, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=75',
    revenue: 2250, views: 210,
  },
  {
    id: 'p4', title: 'Penthouse Vue Mer – Hammamet',
    location: 'Hammamet', price: 4200, status: 'pending',
    bookings: 0, rating: null, image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&q=75',
    revenue: 0, views: 87,
  },
]

export const RECENT_BOOKINGS_PROP = [
  { id: 'b1', tenant: 'Rim Khelil',    avatar: 'https://i.pravatar.cc/32?img=47', property: 'Appartement Lac II',   dates: '12–15 Mars', amount: 5400, status: 'confirmed' },
  { id: 'b2', tenant: 'Karim Trabelsi',avatar: 'https://i.pravatar.cc/32?img=12', property: 'Villa Contemporaine',  dates: '20–27 Mars', amount: 24500,status: 'pending'   },
  { id: 'b3', tenant: 'Sonia Haddad',  avatar: 'https://i.pravatar.cc/32?img=23', property: 'Studio Centre Ville',  dates: '5–8 Avr',    amount: 2550, status: 'confirmed' },
]

// ── Tenant ────────────────────────────────────────────────────
export const UPCOMING_STAYS = [
  {
    id: 's1', property: 'Appartement Panoramique',
    location: 'Lac II, Tunis', host: 'Yasmine B.',
    checkIn:  new Date(Date.now() + 3  * 86400000).toISOString(),
    checkOut: new Date(Date.now() + 7  * 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=75',
    amount: 1800, status: 'confirmed',
  },
  {
    id: 's2', property: 'Villa avec Piscine',
    location: 'La Marsa, Tunis', host: 'Karim T.',
    checkIn:  new Date(Date.now() + 21 * 86400000).toISOString(),
    checkOut: new Date(Date.now() + 28 * 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=75',
    amount: 3500, status: 'confirmed',
  },
  {
    id: 's3', property: 'Penthouse Vue Mer',
    location: 'Hammamet', host: 'Sami R.',
    checkIn:  new Date(Date.now() + 45 * 86400000).toISOString(),
    checkOut: new Date(Date.now() + 52 * 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&q=75',
    amount: 4200, status: 'pending',
  },
]

export const SAVED_HOMES = [
  { id: 'w1', title: 'Chalet Kroumirie', location: 'Aïn Draham', price: 1500, beds: 3, baths: 2, area: 110, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&q=75', rating: 4.9 },
  { id: 'w2', title: 'Maison de Plage',  location: 'Djerba',      price: 2200, beds: 4, baths: 2, area: 160, image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&q=75', rating: 4.8 },
  { id: 'w3', title: 'Appartement Sfax', location: 'Sfax',        price: 950,  beds: 2, baths: 1, area: 75,  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=75', rating: 4.6 },
  { id: 'w4', title: 'Riad Médina',      location: 'Tunis',       price: 1100, beds: 3, baths: 2, area: 95,  image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=500&q=75', rating: 4.7 },
]

export const SEARCH_HISTORY = [
  { id: 'sh1', query: 'Appartements à Tunis',      location: 'Tunis',      price: 2000,  results: 142, timeAgo: 'Hier'         },
  { id: 'sh2', query: 'Villas avec piscine',        location: 'La Marsa',   price: 5000,  results: 38,  timeAgo: 'Il y a 2 j.'  },
  { id: 'sh3', query: 'Studios La Marsa',           location: 'La Marsa',   price: 1000,  results: 67,  timeAgo: 'Il y a 3 j.'  },
  { id: 'sh4', query: 'Chalets Aïn Draham',         location: 'Aïn Draham', price: null,  results: 14,  timeAgo: 'Il y a 5 j.'  },
  { id: 'sh5', query: 'Maisons de vacances Djerba', location: 'Djerba',     price: 3000,  results: 29,  timeAgo: 'Il y a 1 sem.'},
]

// ── Admin ─────────────────────────────────────────────────────
export const ADMIN_STATS = [
  { id: 'users',   label: 'Utilisateurs',       value: 18432,    delta: +8.3,  color: 'slate',   icon: 'Users'       },
  { id: 'props',   label: 'Propriétés totales', value: 2406,     delta: +12.1, color: 'slate',   icon: 'Building2'   },
  { id: 'revenue', label: 'Vol. Transactions',  value: '1.2M',   delta: +22.4, color: 'slate',   icon: 'TrendingUp'  },
  { id: 'reports', label: 'Signalements',       value: 7,        delta: -2,    color: 'slate',   icon: 'ShieldCheck' },
]

export const ADMIN_USERS = [
  { id: 'u1', name: 'Rim Khelil',     email: 'rim@mail.tn',    avatar: 'https://i.pravatar.cc/32?img=47', role: 'TENANT',       status: 'active', joined: '12 Jan 2026', properties: null },
  { id: 'u2', name: 'Karim Trabelsi', email: 'karim@mail.tn',  avatar: 'https://i.pravatar.cc/32?img=12', role: 'PROPRIETAIRE', status: 'active', joined: '3 Fév 2026',  properties: 5    },
  { id: 'u3', name: 'Sonia Haddad',   email: 'sonia@mail.tn',  avatar: 'https://i.pravatar.cc/32?img=23', role: 'TENANT',       status: 'banned', joined: '28 Jan 2026', properties: null },
  { id: 'u4', name: 'Hassen Farhat',  email: 'hassen@mail.tn', avatar: 'https://i.pravatar.cc/32?img=8',  role: 'PROPRIETAIRE', status: 'active', joined: '5 Mars 2026', properties: 2    },
  { id: 'u5', name: 'Nour Mejri',     email: 'nour@mail.tn',   avatar: 'https://i.pravatar.cc/32?img=55', role: 'TENANT',       status: 'active', joined: '1 Mars 2026', properties: null },
  { id: 'u6', name: 'Amal Karray',    email: 'amal@mail.tn',   avatar: 'https://i.pravatar.cc/32?img=5',  role: 'PROPRIETAIRE', status: 'active', joined: '20 Fév 2026', properties: 3    },
]

export const PENDING_PROPERTIES = [
  {
    id: 'pp1', title: 'Penthouse Vue Mer – Hammamet',
    owner: 'Sami Rais', ownerAvatar: 'https://i.pravatar.cc/32?img=33', ownerRating: 4.8,
    submittedAt: 'Il y a 2 heures', price: 4200, location: 'Hammamet',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=75',
    flagged: false,
  },
  {
    id: 'pp2', title: 'Appartement Familial – Ariana',
    owner: 'Nour Mejri', ownerAvatar: 'https://i.pravatar.cc/32?img=55', ownerRating: 4.5,
    submittedAt: 'Il y a 5 heures', price: 1200, location: 'Ariana',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=75',
    flagged: true,
  },
  {
    id: 'pp3', title: 'Villa Bizerte Plage',
    owner: 'Amal Karray', ownerAvatar: 'https://i.pravatar.cc/32?img=5', ownerRating: 4.9,
    submittedAt: 'Il y a 8 heures', price: 2800, location: 'Bizerte',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=75',
    flagged: false,
  },
]

// ── Growth chart data (placeholder) ──────────────────────────
export const GROWTH_CHART = {
  labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mars'],
  users:  [8200, 10100, 11400, 12800, 14300, 16900, 18432],
  props:  [1200, 1450,  1700,  1890,  2050,  2200,  2406 ],
}
