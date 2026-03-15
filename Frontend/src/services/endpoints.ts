export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  properties: {
    list: '/listings',
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
  },
  users: {
    me: '/users/me',
    updateMe: '/users/me',
  },
  admin: {
    users: '/admin/users',
    banUser: (id: number | string) => `/admin/users/${id}/ban`,
    bookings: '/admin/bookings',
  },
} as const
