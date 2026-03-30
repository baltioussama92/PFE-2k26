export const adminStats = [
  { key: 'totalUsers', label: 'Total Users', value: 24890, trend: '+12.5%', positive: true },
  { key: 'totalHosts', label: 'Total Hosts', value: 4120, trend: '+6.2%', positive: true },
  { key: 'totalGuests', label: 'Total Guests', value: 20770, trend: '+14.1%', positive: true },
  { key: 'activeListings', label: 'Active Listings', value: 5820, trend: '+4.8%', positive: true },
  { key: 'totalBookings', label: 'Total Bookings', value: 16840, trend: '+9.3%', positive: true },
  { key: 'reportsPending', label: 'Reports Pending', value: 37, trend: '-8.0%', positive: true },
]

export const bookingsSeries = [36, 42, 40, 55, 61, 58, 69, 73, 78, 82, 76, 91]

export const bookingMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const recentActivities = [
  { id: 'act_1', title: 'Host listing approved', description: 'Modern Loft in Barcelona approved by admin', time: '3 min ago' },
  { id: 'act_2', title: 'Suspicious account suspended', description: 'User U-3091 was suspended after report review', time: '20 min ago' },
  { id: 'act_3', title: 'Large booking completed', description: 'Booking BK-1128 completed for 12 nights', time: '1 hour ago' },
  { id: 'act_4', title: 'Report resolved', description: 'Harassment report closed with warning issued', time: '2 hours ago' },
]

export const users = [
  { id: 'U-1001', name: 'Lina Carter', email: 'lina.carter@example.com', role: 'Guest', status: 'Active' },
  { id: 'U-1002', name: 'Noah Bennett', email: 'noah.bennett@example.com', role: 'Host', status: 'Active' },
  { id: 'U-1003', name: 'Ava Simmons', email: 'ava.simmons@example.com', role: 'Guest', status: 'Suspended' },
  { id: 'U-1004', name: 'Mason Hayes', email: 'mason.hayes@example.com', role: 'Host', status: 'Active' },
  { id: 'U-1005', name: 'Ethan Price', email: 'ethan.price@example.com', role: 'Guest', status: 'Active' },
  { id: 'U-1006', name: 'Nora Brooks', email: 'nora.brooks@example.com', role: 'Host', status: 'Active' },
  { id: 'U-1007', name: 'Mila Reed', email: 'mila.reed@example.com', role: 'Guest', status: 'Active' },
]

export const houses = [
  { id: 'H-301', title: 'Skyline Penthouse', host: 'Noah Bennett', location: 'New York', price: 285, status: 'Pending' },
  { id: 'H-302', title: 'Coastal Family Villa', host: 'Nora Brooks', location: 'Lisbon', price: 220, status: 'Approved' },
  { id: 'H-303', title: 'Old Town Studio', host: 'Mason Hayes', location: 'Prague', price: 110, status: 'Pending' },
  { id: 'H-304', title: 'Desert Modern House', host: 'Sofia Hart', location: 'Marrakesh', price: 195, status: 'Approved' },
  { id: 'H-305', title: 'Lake View Cabin', host: 'Clara Wells', location: 'Zurich', price: 175, status: 'Pending' },
]

export const bookings = [
  { id: 'BK-901', guest: 'Lina Carter', host: 'Noah Bennett', house: 'Skyline Penthouse', checkIn: '2026-04-12', checkOut: '2026-04-16', status: 'Pending' },
  { id: 'BK-902', guest: 'Mila Reed', host: 'Nora Brooks', house: 'Coastal Family Villa', checkIn: '2026-04-10', checkOut: '2026-04-14', status: 'Accepted' },
  { id: 'BK-903', guest: 'Ethan Price', host: 'Mason Hayes', house: 'Old Town Studio', checkIn: '2026-03-27', checkOut: '2026-03-30', status: 'Rejected' },
  { id: 'BK-904', guest: 'Ava Simmons', host: 'Sofia Hart', house: 'Desert Modern House', checkIn: '2026-03-20', checkOut: '2026-03-25', status: 'Completed' },
]

export const reports = [
  { id: 'RP-001', reporter: 'Lina Carter', reportedUser: 'Mason Hayes', reason: 'Misleading listing details', date: '2026-03-18', status: 'Open' },
  { id: 'RP-002', reporter: 'Nora Brooks', reportedUser: 'Ava Simmons', reason: 'Damaged property complaint', date: '2026-03-17', status: 'Under Review' },
  { id: 'RP-003', reporter: 'Mila Reed', reportedUser: 'Noah Bennett', reason: 'Late check-in support issue', date: '2026-03-15', status: 'Resolved' },
]

export const usersGrowth = [4200, 5300, 6100, 7600, 9200, 10400, 12100, 13900, 15200, 16800, 18400, 20100]

export const monthlyBookings = [120, 160, 180, 220, 250, 280, 320, 350, 380, 410, 445, 490]

export const popularCities = [
  { city: 'Paris', value: 24 },
  { city: 'Barcelona', value: 19 },
  { city: 'Lisbon', value: 17 },
  { city: 'Dubai', value: 14 },
  { city: 'Marrakesh', value: 11 },
]

export const listingDistribution = [
  { label: 'Apartments', percent: 42 },
  { label: 'Villas', percent: 28 },
  { label: 'Studios', percent: 17 },
  { label: 'Cabins', percent: 13 },
]

export const settingsDefaults = {
  platformName: 'Maskan Rentals',
  contactEmail: 'admin@maskanrentals.com',
  notifications: {
    bookingAlerts: true,
    userReports: true,
    weeklyDigest: false,
  },
  security: {
    twoFactorRequired: true,
    sessionTimeout: 30,
  },
}
