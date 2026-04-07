# Quick Reference Guide - Profile Page Components

## 📁 File Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── profile/                    ← NEW DIRECTORY
│   │   │   ├── ProfileHeader.jsx       ← NEW (370 lines)
│   │   │   ├── RoleSwitcher.jsx        ← NEW (60 lines)
│   │   │   ├── GuestView.jsx           ← NEW (280 lines)
│   │   │   ├── HostView.jsx            ← NEW (450 lines)
│   │   │   └── ProfileSettings.jsx     ← NEW (130 lines)
│   │   └── ui/
│   │       └── Navbar.tsx
│   ├── pages/
│   │   └── ProfilePage.jsx             ← UPDATED (complete rewrite)
│   └── services/
│       └── profileMockData.ts          ← NEW (200 lines)
├── PROFILE_PAGE_REDESIGN.md            ← NEW (Documentation)
└── ...
```

---

## 🎯 Component Quick Reference

### **ProfileHeader**
**Location**: `components/profile/ProfileHeader.jsx`
**Purpose**: Display user info and verification status
**Key Props**: 
- `user`, `role`, `onEdit`, `totalStaysCompleted`, `trustScore`, `isSuperHost`

```jsx
<ProfileHeader
  user={user}
  role="GUEST"
  onEdit={handleEditProfile}
  totalStaysCompleted={5}
  trustScore={85}
  isSuperHost={false}
/>
```

---

### **RoleSwitcher**
**Location**: `components/profile/RoleSwitcher.jsx`
**Purpose**: Switch between Guest and Host modes
**Key Props**: `currentRole`, `isHost`, `onRoleChange`, `onBecomeHost`

```jsx
<RoleSwitcher
  currentRole={displayRole}
  isHost={true}
  onRoleChange={handleRoleChange}
  onBecomeHost={handleBecomeHost}
/>
```

---

### **GuestView**
**Location**: `components/profile/GuestView.jsx`
**Purpose**: Display guest bookings, reviews, and wishlist
**Key Props**: `user`, `bookings`, `reviews`, `wishlist`
**Subsections**:
- BookingOverviewSection
- ReviewsSection
- WishlistSection

```jsx
<GuestView
  user={user}
  bookings={MOCK_GUEST_BOOKINGS}
  reviews={MOCK_GUEST_REVIEWS}
  wishlist={MOCK_WISHLIST}
/>
```

---

### **HostView**
**Location**: `components/profile/HostView.jsx`
**Purpose**: Display host dashboard and management tools
**Key Props**: `user`, `stats`, `listings`, `earnings`, `reviews`, `onAddListing`
**Subsections**:
- DashboardSummary
- ListingsSection
- EarningsSection
- HostReviewsSection
- CalendarSection

```jsx
<HostView
  user={user}
  stats={MOCK_HOST_STATS}
  listings={MOCK_HOST_LISTINGS}
  earnings={MOCK_HOST_EARNINGS}
  reviews={MOCK_HOST_REVIEWS}
  onAddListing={() => navigate('/add-property')}
/>
```

---

### **ProfileSettings**
**Location**: `components/profile/ProfileSettings.jsx`
**Purpose**: Sidebar with settings menu
**Key Props**: `onSettingClick`, `isOpen`
**Menu Items**:
1. Edit Profile
2. Account Settings
3. Security
4. Notifications
5. Payment Methods
6. Privacy & Safety
7. Help & Support
8. Logout

```jsx
<ProfileSettings
  onSettingClick={handleSettingClick}
  isOpen={true}
/>
```

---

### **EditProfileModal**
**Location**: `pages/ProfilePage.jsx` (embedded)
**Purpose**: Modal for editing profile information
**Fields**: Name, Username, Email, Bio, Avatar
**Features**: Image compression, validation, success/error feedback

```jsx
{isEditModalOpen && (
  <EditProfileModal
    user={user}
    onSave={() => setIsEditModalOpen(false)}
    onCancel={() => setIsEditModalOpen(false)}
    onUserUpdate={onUserUpdate}
  />
)}
```

---

## 📊 State Management

### **ProfilePage State**
```javascript
// Role switching
const [displayRole, setDisplayRole] = useState('GUEST')  // Persisted to localStorage
const [isEditModalOpen, setIsEditModalOpen] = useState(false)
```

### **LocalStorage Keys**
```javascript
DISPLAY_ROLE_KEY = 'displayRole'      // Current display role (GUEST/HOST)
USER_STORAGE_KEY = 'user'              // User object
AUTH_TOKEN_KEY = 'authToken'          // Auth token
ROLE_STORAGE_KEY = 'userRole'         // Actual user role from backend
```

---

## 🎨 Tailwind Classes Used

### **Backgrounds**
- `bg-white` - Cards and containers
- `bg-slate-50` - Page background
- `bg-gradient-to-b from-slate-50 to-white` - Main wrapper
- `bg-gradient-to-br from-primary-400 to-primary-600` - Avatar, badges

### **Typography**
- `text-xs` - Small labels (10px)
- `text-sm` - Body text (14px)
- `text-lg` - Headings (18px)
- `text-xl` - Section title (20px)
- `text-3xl` - Page title (30px)

### **Spacing**
- `gap-3` to `gap-6` - Between items
- `p-4` to `p-8` - Internal padding
- `mb-6` to `mt-8` - Margins
- `px-4` `py-2` - Compact elements

### **Rounded Corners**
- `rounded-lg` - Small elements (8px)
- `rounded-xl` - Medium elements (12px)
- `rounded-2xl` - Large cards (16px)
- `rounded-full` - Circles (50%)

### **Colors**
- `text-slate-900` - Primary text
- `text-slate-600` - Secondary text
- `text-primary-600` - Accent color
- `bg-slate-100` - Light background
- `border-slate-200` - Borders

---

## 🔄 Data Flow

### **Guest Mode Data Flow**
```
ProfilePage
  ├── Fetch: MOCK_GUEST_BOOKINGS
  ├── Fetch: MOCK_GUEST_REVIEWS
  └── Fetch: MOCK_WISHLIST
      ↓
    GuestView
      ├── BookingOverviewSection
      ├── ReviewsSection
      └── WishlistSection
```

### **Host Mode Data Flow**
```
ProfilePage
  ├── Fetch: MOCK_HOST_STATS
  ├── Fetch: MOCK_HOST_LISTINGS
  ├── Fetch: MOCK_HOST_EARNINGS
  └── Fetch: MOCK_HOST_REVIEWS
      ↓
    HostView
      ├── DashboardSummary
      ├── ListingsSection
      ├── EarningsSection
      ├── HostReviewsSection
      └── CalendarSection
```

---

## 🎬 Animation Patterns

### **Entrance Animations**
```jsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
```

### **Hover Effects**
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### **Modal Animations**
```jsx
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.95, opacity: 0 }}
>
```

---

## 🎨 Color Palette Reference

### **Status Colors**
| Status | Color | Tailwind | Use Case |
|--------|-------|----------|----------|
| Success | Green | `emerald-600` | Completed, Verified |
| Pending | Amber | `amber-600` | Awaiting action |
| Error | Red | `red-600` | Cancelled, Failed |
| Info | Blue | `blue-600` | Upcoming, Info |
| Primary | Brown | `primary-600` | Accents, CTAs |

### **Neutral Colors**
| Use | Color | Tailwind |
|-----|-------|----------|
| Text (main) | Dark Gray | `slate-900` |
| Text (secondary) | Gray | `slate-600` |
| Text (tertiary) | Light Gray | `slate-500` |
| Border | Light Gray | `slate-200` |
| Background | Off-white | `slate-50` |

---

## 📱 Responsive Breakpoints

### **Tailwind Breakpoints Used**
```
sm: 640px   - Small screens
md: 768px   - Medium screens
lg: 1024px  - Large screens (settings sidebar appears)
```

### **Layout Changes**
| Screen | Layout | Sidebar | Grid |
|--------|--------|---------|------|
| Mobile | 1 col | Hidden | 1 col |
| Tablet | 2-3 col | Optional | 2 col |
| Desktop | 3 col (3/1) | Visible | 2-3 col |

---

## 🔌 API Integration Points

### **Guest Bookings**
```javascript
// Replace:
MOCK_GUEST_BOOKINGS
// With:
const bookings = await bookingService.getMine()
```

### **Host Listings**
```javascript
// Replace:
MOCK_HOST_LISTINGS
// With:
const listings = await propertyService.listMine()
```

### **Host Earnings**
```javascript
// Need API endpoint:
const earnings = await earningsService.getHostEarnings()
```

### **Reviews**
```javascript
// Replace:
MOCK_GUEST_REVIEWS, MOCK_HOST_REVIEWS
// With:
const reviews = await reviewService.getForUser(userId)
```

---

## 🧪 Testing Checklist

- [ ] Switch between Guest and Host modes without page reload
- [ ] Edit profile picture with compression
- [ ] Save profile changes and see updates
- [ ] View bookings with correct statuses
- [ ] View earnings history
- [ ] View listings with proper grid layout
- [ ] View reviews from guests/hosts
- [ ] Mobile responsive (< 640px width)
- [ ] Tablet responsive (640-1024px)
- [ ] Desktop responsive (> 1024px)
- [ ] All animations play smoothly
- [ ] Settings sidebar clicks work
- [ ] Logout clears localStorage
- [ ] Try role switching multiple times
- [ ] Check z-index layering of modal

---

## 🐛 Debugging Tips

### **Check localStorage**
```javascript
console.log(localStorage.getItem('displayRole'))
console.log(localStorage.getItem('user'))
```

### **Inspect Component State**
```javascript
console.log('displayRole:', displayRole)
console.log('isEditModalOpen:', isEditModalOpen)
console.log('user:', user)
```

### **Verify Props**
Add console logs in child components:
```javascript
export default function GuestView({ user, bookings, reviews, wishlist }) {
  console.log('GuestView props:', { user, bookings, reviews, wishlist })
  // ...
}
```

---

## 📚 Component Import Template

```javascript
// Copy-paste template for new pages using these components
import ProfileHeader from '../components/profile/ProfileHeader'
import RoleSwitcher from '../components/profile/RoleSwitcher'
import GuestView from '../components/profile/GuestView'
import HostView from '../components/profile/HostView'
import ProfileSettings from '../components/profile/ProfileSettings'
import {
  MOCK_GUEST_BOOKINGS,
  MOCK_GUEST_REVIEWS,
  MOCK_WISHLIST,
  MOCK_HOST_STATS,
  MOCK_HOST_LISTINGS,
  MOCK_HOST_EARNINGS,
  MOCK_HOST_REVIEWS,
} from '../services/profileMockData'
```

---

This guide provides everything needed to understand, maintain, and extend the Profile Page components!

