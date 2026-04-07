// Mock data for Profile Page - Guest, Host, and shared features

// ── GUEST SECTION MOCK DATA ──────────────────────────────────

export const MOCK_GUEST_BOOKINGS = [
  {
    id: 1,
    propertyTitle: 'Luxury Villa with Ocean View',
    location: 'Casablanca, Morocco',
    propertyImage: 'https://images.unsplash.com/photo-1570129477492-45e003008e2e?w=400&h=300&fit=crop',
    checkIn: '2025-05-10',
    checkOut: '2025-05-15',
    status: 'upcoming',
    totalPrice: 2250,
    nights: 5,
  },
  {
    id: 2,
    propertyTitle: 'Cozy Mountain Cabin',
    location: 'Ifrane, Morocco',
    propertyImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    checkIn: '2025-02-01',
    checkOut: '2025-02-07',
    status: 'completed',
    totalPrice: 900,
    nights: 5,
  },
  {
    id: 3,
    propertyTitle: 'Modern City Apartment',
    location: 'Rabat, Morocco',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    checkIn: '2025-01-15',
    checkOut: '2025-01-20',
    status: 'completed',
    totalPrice: 600,
    nights: 5,
  },
  {
    id: 4,
    propertyTitle: 'Beachfront Bungalow',
    location: 'Essaouira, Morocco',
    propertyImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    checkIn: '2024-12-20',
    checkOut: '2024-12-25',
    status: 'completed',
    totalPrice: 1400,
    nights: 5,
  },
]

export const MOCK_GUEST_REVIEWS = [
  {
    hostName: 'Ahmed Hassan',
    date: '2025-02-10',
    rating: 5,
    comment: 'Amazing stay! The cabin was pristine and the views were breathtaking. Would definitely book again.',
  },
  {
    hostName: 'Fatima Moreaux',
    date: '2025-01-25',
    rating: 5,
    comment: 'Perfect location for exploring the city. The apartment was clean and comfortable. Highly recommended!',
  },
  {
    hostName: 'Mohamed Ben',
    date: '2024-12-30',
    rating: 4,
    comment: 'Great experience! Only minor issue was the beach was a bit crowded during our stay.',
  },
]

export const MOCK_WISHLIST = [
  {
    id: 1,
    title: 'Desert Eco Lodge',
    location: 'Merzouga, Morocco',
    price: 220,
    image: 'https://images.unsplash.com/photo-1551632786-de41ec0ac1d5?w=400&h=300&fit=crop',
    rating: 4.7,
  },
  {
    id: 2,
    title: 'Historic Riad in Medina',
    location: 'Marrakech, Morocco',
    price: 350,
    image: 'https://images.unsplash.com/photo-1590080876-e5b46f310b7b?w=400&h=300&fit=crop',
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Coastal Retreat',
    location: 'Tangier, Morocco',
    price: 280,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    rating: 4.8,
  },
]

// ── HOST SECTION MOCK DATA ────────────────────────────────────

export const MOCK_HOST_STATS = {
  totalListings: 4,
  totalBookings: 32,
  responseRate: 98,
  acceptanceRate: 94,
  totalEarnings: 18500,
  monthlyEarnings: 4200,
  averageRating: 4.8,
}

export const MOCK_HOST_LISTINGS = [
  {
    id: 1,
    title: 'Luxury Villa with Ocean View',
    location: 'Casablanca, Morocco',
    price: 450,
    image: 'https://images.unsplash.com/photo-1570129477492-45e003008e2e?w=400&h=300&fit=crop',
    status: 'active',
    views: 1240,
    bookings: 8,
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Modern City Apartment',
    location: 'Rabat, Morocco',
    price: 120,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    status: 'active',
    views: 856,
    bookings: 12,
    rating: 4.7,
  },
  {
    id: 3,
    title: 'Cozy Mountain Cabin',
    location: 'Ifrane, Morocco',
    price: 180,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    status: 'active',
    views: 645,
    bookings: 7,
    rating: 4.8,
  },
  {
    id: 4,
    title: 'Beachfront Bungalow',
    location: 'Essaouira, Morocco',
    price: 280,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    status: 'inactive',
    views: 432,
    bookings: 5,
    rating: 4.6,
  },
]

export const MOCK_HOST_EARNINGS = [
  {
    id: 1,
    bookingTitle: 'Ocean View Villa - 5 nights',
    date: '2025-04-01',
    amount: 2250,
  },
  {
    id: 2,
    bookingTitle: 'City Apartment - 3 nights',
    date: '2025-03-25',
    amount: 360,
  },
  {
    id: 3,
    bookingTitle: 'Mountain Cabin - 4 nights',
    date: '2025-03-20',
    amount: 720,
  },
  {
    id: 4,
    bookingTitle: 'Beachfront Bungalow - 7 nights',
    date: '2025-03-15',
    amount: 1960,
  },
  {
    id: 5,
    bookingTitle: 'Ocean View Villa - 5 nights',
    date: '2025-03-10',
    amount: 2250,
  },
  {
    id: 6,
    bookingTitle: 'City Apartment - 2 nights',
    date: '2025-03-05',
    amount: 240,
  },
  {
    id: 7,
    bookingTitle: 'Mountain Cabin - 3 nights',
    date: '2025-02-28',
    amount: 540,
  },
  {
    id: 8,
    bookingTitle: 'Beachfront Bungalow - 6 nights',
    date: '2025-02-22',
    amount: 1680,
  },
  {
    id: 9,
    bookingTitle: 'Ocean View Villa - 4 nights',
    date: '2025-02-15',
    amount: 1800,
  },
  {
    id: 10,
    bookingTitle: 'City Apartment - 4 nights',
    date: '2025-02-10',
    amount: 480,
  },
]

export const MOCK_HOST_REVIEWS = [
  {
    id: 1,
    guestName: 'Sophie Martin',
    propertyTitle: 'Luxury Villa with Ocean View',
    date: '2025-04-02',
    rating: 5,
    comment: 'Exceptional property! The views are stunning and cleanliness impeccable. Host was very responsive. Highly recommend!',
  },
  {
    id: 2,
    guestName: 'James Wilson',
    propertyTitle: 'Modern City Apartment',
    date: '2025-03-26',
    rating: 5,
    comment: 'Perfect location, extremely comfortable. Everything we needed for a great city break. Will be back!',
  },
  {
    id: 3,
    guestName: 'Maria Garcia',
    propertyTitle: 'Cozy Mountain Cabin',
    date: '2025-03-21',
    rating: 4,
    comment: 'Beautiful cabin with great amenities. Minor issue with heating but was resolved quickly.',
  },
  {
    id: 4,
    guestName: 'Tom Anderson',
    propertyTitle: 'Beachfront Bungalow',
    date: '2025-03-16',
    rating: 5,
    comment: 'Amazing experience! The beach access is convenient and the property is well-maintained. Excellent!',
  },
  {
    id: 5,
    guestName: 'Emma Johnson',
    propertyTitle: 'Ocean View Villa',
    date: '2025-03-11',
    rating: 4,
    comment: 'Wonderful stay. The villa is beautiful and well-equipped. Would love to return.',
  },
]
