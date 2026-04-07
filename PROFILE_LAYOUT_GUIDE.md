# Profile Page Layout & Visual Guide

## 🎨 Visual Layout Structure

### **Desktop Layout (1024px+)**

```
┌──────────────────────────────────────────────────────────────────┐
│                        NAVBAR (fixed top)                        │
└──────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                                                           │
│                      PROFILE HEADER                      │
│          [Avatar] [Name] [Location] [Stats]              │
│                                                           │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                    ROLE SWITCHER                          │
│      [ Guest Mode ] [ Host Mode ]                         │
└───────────────────────────────────────────────────────────┘

┌─────────────────────────────────┬─────────────────────────┐
│                                 │                         │
│     CONTENT AREA (3 cols)      │  SETTINGS SIDEBAR       │
│     - Guest View               │  (sticky)               │
│       • Bookings              │                         │
│       • Reviews               │  [Edit Profile]         │
│       • Wishlist              │  [Settings]             │
│                               │  [Security]             │
│     OR                         │  [Notifications]        │
│                               │  [Payments]             │
│     - Host View                │  [Privacy]              │
│       • Dashboard              │  [Help]                 │
│       • Listings               │  [Logout]               │
│       • Earnings               │                         │
│       • Reviews                │  Quick Stats            │
│       • Calendar               │                         │
│                                 │                         │
└─────────────────────────────────┴─────────────────────────┘
```

### **Tablet Layout (640px - 1024px)**

```
┌──────────────────────────────────────────────────────┐
│           NAVBAR (fixed top)                        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│         PROFILE HEADER (responsive)                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│    ROLE SWITCHER (full width)                       │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                                                      │
│        CONTENT AREA (2 columns)                     │
│                                                      │
│  [Guest/Host View - Left]                           │
│                                                      │
│  [Settings - Right or below]                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### **Mobile Layout (< 640px)**

```
┌──────────────────────┐
│   NAVBAR (fixed)     │
└──────────────────────┘

┌──────────────────────┐
│ PROFILE HEADER       │
│ (stacked vertical)   │
│ [Avatar centered]    │
│ [Name]               │
│ [Stats]              │
└──────────────────────┘

┌──────────────────────┐
│ ROLE SWITCHER        │
│ (full width tabs)    │
└──────────────────────┘

┌──────────────────────┐
│ CONTENT AREA         │
│ (single column)      │
│ [Bookings/Listings]  │
│ [Reviews]            │
│ [Earnings]           │
│ [Wishlist]           │
└──────────────────────┘

┌──────────────────────┐
│ SETTINGS (bottom)    │
│ (hamburger menu or   │
│  scrollable list)    │
└──────────────────────┘
```

---

## 📐 Component Dimensions

### **ProfileHeader**
- Height: 280px (desktop), 320px (mobile)
- Padding: 32px (desktop), 24px (mobile)
- Grid: 1 col (mobile) → 3 cols (desktop)
- Avatar: 112px (desktop), 96px (mobile)

### **RoleSwitcher**
- Height: 64px
- Padding: 24px
- Display: Tabs (host) or CTA (non-host)

### **GuestView / HostView**
- Max-width: 100% (responsive)
- Grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- Gap: 24px between items
- Card height: varies by content

### **ProfileSettings Sidebar**
- Width: 320px (desktop), hidden (mobile)
- Position: Sticky top (24px)
- Display: none on screens < 1024px
- Padding: 24px

### **EditProfileModal**
- Max-width: 448px
- Modal overlay: fullscreen with backdrop blur
- Position: centered

---

## 🎯 Spacing & Sizing System

### **Container Widths**
```
Mobile:   100% - 16px (padding)
Tablet:   640px - 48px (padding)
Desktop:  1280px (max-w-7xl)
```

### **Common Sizes**
| Size | Usage | Value |
|------|-------|-------|
| xs | Small text, labels | 12px |
| sm | Body text | 14px |
| base | Default text | 16px |
| lg | Section heading | 18px |
| xl | Page title | 20px |
| 2xl | Large heading | 24px |
| 3xl | Hero heading | 30px |

### **Common Gaps**
| Gap | Value | Usage |
|-----|-------|-------|
| gap-2 | 8px | Tight spacing |
| gap-3 | 12px | Normal spacing |
| gap-4 | 16px | Comfortable spacing |
| gap-6 | 24px | Large spacing |

### **Common Padding**
| Pad | Value | Usage |
|-----|-------|-------|
| p-3 | 12px | Small cards |
| p-4 | 16px | Normal cards |
| p-6 | 24px | Large sections |
| p-8 | 32px | Hero sections |

---

## 🎨 Color Usage Guidelines

### **Background Colors**
```
Page Background:    bg-gradient-to-b from-slate-50 to-white
Card Background:    bg-white
Hover Background:   bg-slate-50 or bg-slate-100
Input Background:   bg-slate-50 or bg-slate-100
```

### **Text Colors**
```
Primary Text:       text-slate-900 (color: #0f172a)
Secondary Text:     text-slate-600 (color: #475569)
Tertiary Text:      text-slate-500 (color: #64748b)
Light Text:         text-slate-400 (color: #94a3b8)
Accent Text:        text-primary-600
```

### **Border Colors**
```
Light Border:       border-slate-200
Medium Border:      border-slate-300
Status Borders:     border-emerald-200, border-amber-200, border-red-200
```

### **Status Indicator Colors**
```
Success/Completed:  bg-emerald-50, text-emerald-700, border-emerald-200
Pending/Upcoming:   bg-amber-50, text-amber-700, border-amber-200
Cancelled/Error:    bg-red-50, text-red-700, border-red-200
Info/Progress:      bg-blue-50, text-blue-700, border-blue-200
Primary/Active:     bg-primary-50, text-primary-700, border-primary-200
```

---

## 📊 Component Size Breakdown

### **ProfileHeader Components**
```
┌─ Avatar (112px x 112px)
├─ Badge (small, 32px x 32px)
├─ Name (text 2xl)
├─ Username (text sm)
└─ Stats Grid
   ├─ Card 1 (verification status)
   ├─ Card 2 (member since)
   ├─ Card 3 (trust score/stays)
   └─ Card 4 (bio - full width)
```

### **Listing Card Dimensions**
```
Card: 100% of container
Image: 300px height
Content: 96px padding
Grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
```

### **Booking Card Dimensions**
```
Card: 100% width
Image: 64px x 64px (thumbnail)
Height: ~120px
Layout: Flex (horizontal)
```

### **Review Card Dimensions**
```
Card: 100% width
Height: auto (min 80px)
Padding: 16px
Border: 1px solid slate-200
```

---

## 🔄 Animation Timings

### **Entrance Animations**
```
Initial delay:     0s, 0.1s, 0.2s (staggered)
Duration:          0.3s - 0.4s
Y offset:          16px → 0px (slide up)
Opacity:           0 → 1
Easing:            ease-in-out (default)
```

### **Hover Animations**
```
Scale:             1 → 1.05 (5% larger)
Duration:          0.2s
Easing:            ease-in-out
```

### **Tap/Click Animations**
```
Scale:             1 → 0.98 (2% smaller)
Duration:          0.15s
Easing:            ease-in-out
```

### **Modal Animations**
```
Entering:          scale 0.95 → 1, opacity 0 → 1
Duration:          0.2s
Exiting:           scale 1 → 0.95, opacity 1 → 0
Duration:          0.15s
```

---

## 📱 Breakpoint-Specific Styling

### **sm (640px)**
```
ProfileHeader:  Single column, centered
Tabs:           Full width, horizontal scroll if needed
Grid:           2 columns
Font:           Slightly reduced
Padding:        Reduced by 25%
```

### **md (768px)**
```
ProfileHeader:  2 columns
Tabs:           Centered, flexible width
Grid:           2-3 columns
Layout:         More generous spacing
```

### **lg (1024px)**
```
ProfileHeader:  3 columns (full flex)
Tabs:           Left-aligned
Grid:           3 columns
Sidebar:        Appears (320px)
Main content:   Adjusted for sidebar
```

---

## 🎯 Z-Index Layering

```
Modal Backdrop:     z-40
Modal Content:      z-50
Navbar:             z-30 (if fixed)
Sticky Sidebar:     z-10
Regular Content:    z-0
```

---

## 📏 Accessibility Sizing

### **Touch Targets**
- Minimum: 44px x 44px
- Recommended: 48px x 48px
- Padding around clickables: 8px minimum

### **Text Sizing**
- Minimum readable: 14px
- Large text preferred: 16px+
- Headings: maintain hierarchy with scale

### **Color Contrast**
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Status indicators: both color + icon/text

---

## 🎨 Icon Sizing

```
Inline text:        w-4 h-4 (16px)
Small icons:        w-5 h-5 (20px)
Medium icons:       w-6 h-6 (24px)
Large icons:        w-12 h-12 (48px)
Hero icons:         w-16 h-16 (64px)
```

---

## 📊 Grid Systems

### **Main Content Grid**
```
Desktop:    grid-cols-3 (3/1 split with settings)
Tablet:     grid-cols-2 (2/1 or full)
Mobile:     grid-cols-1 (single column)
Gap:        gap-6 (24px)
```

### **Listing Grid**
```
Desktop:    grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Tablet:     grid-cols-2
Mobile:     grid-cols-1
Gap:        gap-4 (16px)
```

### **Stats Grid**
```
Compact:    grid-cols-2 sm:grid-cols-3 lg:grid-cols-6
Mobile:     2 columns
Tablet:     3 columns
Desktop:    6 columns (if space)
Gap:        gap-4 (16px)
```

---

## 🔍 Overflow Handling

```
Long text:          Truncate with ellipsis
Long lists:         Scrollable max-h-96
Mobile overflow:    Full width, no horizontal scroll
Modal overflow:     Scroll only content, not header/footer
```

---

This visual guide provides all the layout specifications needed for implementing, maintaining, or extending the Profile Page design!

