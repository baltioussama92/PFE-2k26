export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  properties: {
    list: '/properties',
    byId: (id: number | string) => `/properties/${id}`,
  },
  bookings: {
    listMine: '/bookings/me',
    create: '/bookings',
    updateStatus: (id: number | string) => `/bookings/${id}/status`,
  },
  reviews: {
    create: '/reviews',
    listByProperty: (propertyId: number | string) => `/reviews/property/${propertyId}`,
  },
  messages: {
    send: '/messages',
    inbox: '/messages/inbox',
    outbox: '/messages/outbox',
  },
  admin: {
    users: '/admin/users',
    updateUserRole: (id: number | string) => `/admin/users/${id}/role`,
    deleteUser: (id: number | string) => `/admin/users/${id}`,
  },
} as const
