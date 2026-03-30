export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  properties: {
    list: '/listings',
    mine: '/listings/owner/me',
    search: '/listings/search',
    byId: (id: number | string) => `/listings/${id}`,
  },
  bookings: {
    listMine: '/bookings/me',
    listOwner: '/bookings/owner',
    create: '/bookings',
    updateStatus: (id: number | string) => `/bookings/${id}/status`,
    delete: (id: number | string) => `/bookings/${id}`,
  },
  reviews: {
    create: '/reviews',
    listByProperty: (propertyId: number | string) => `/reviews/listing/${propertyId}`,
  },
  messages: {
    send: '/messages',
    inbox: '/messages/inbox',
    outbox: '/messages/sent',
    conversations: '/messages/conversations',
    conversation: (userId: number | string) => `/messages/conversations/${userId}`,
  },
  users: {
    me: '/users/me',
    updateMe: '/users/me',
    search: (query: string) => `/users/search?q=${encodeURIComponent(query)}`,
  },
  wishlist: {
    list: '/wishlist',
    add: (listingId: number | string) => `/wishlist/${listingId}`,
    remove: (listingId: number | string) => `/wishlist/${listingId}`,
  },
  dashboard: {
    tenantSummary: '/dashboard/tenant/summary',
    hostSummary: '/dashboard/host/summary',
    adminSummary: '/dashboard/admin/summary',
  },
  admin: {
    users: '/admin/users',
    blockUser: (id: number | string) => `/admin/users/${id}/block`,
    bookings: '/admin/bookings',
    pendingListings: '/admin/pending-listings',
    verifyProperty: (id: number | string) => `/admin/properties/${id}/verify`,
    growthMetrics: '/admin/growth-metrics',
  },
  connections: {
    list: '/connections',
    pending: '/connections/pending',
    request: '/connections/request',
    accept: (id: number | string) => `/connections/${id}/accept`,
  },
} as const
