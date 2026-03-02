# House Rental Frontend (React + Vite + TypeScript)

A modern React frontend for a house rental and sharing platform with user authentication, property browsing, booking management, and messaging capabilities.

## Tech Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls

## Project Structure
```
Frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components for routes
│   ├── services/        # API integration & utility services
│   ├── context/         # Context API state management
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies & scripts
```

## Features to Implement
- [ ] **Authentication** - Register, login, logout with JWT token management
- [ ] **Property Listing** - Browse available properties with filters
- [ ] **Property Details** - View full property information and reviews
- [ ] **Booking Management** - Create, view, and manage booking requests
- [ ] **Review System** - Leave and view property reviews
- [ ] **Messaging** - Send and receive direct messages
- [ ] **User Dashboard** - Profile management and role-specific features
- [ ] **Admin Panel** - User management and system administration (if applicable)
- [ ] **Responsive Design** - Mobile-friendly UI

## Installation

### Prerequisites
- **Node.js 16+** and **npm** (or yarn/pnpm)

### Setup
1. Navigate to the Frontend folder:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file for environment variables:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Development

### Start dev server
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## API Integration

The frontend communicates with the backend at:
- **Default**: `http://localhost:8080/api`
- **Configurable via**: `VITE_API_BASE_URL` environment variable
- **Proxy**: Vite is configured to proxy `/api` requests to the backend

### Key Backend Endpoints Used
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /properties` - List all properties
- `GET /properties/{id}` - Get property details
- `POST /properties` - Create property (OWNER/ADMIN)
- `POST /bookings` - Create booking (TENANT)
- `PUT /bookings/{id}/status` - Update booking status (OWNER/ADMIN)
- `POST /reviews` - Post a review (TENANT)
- `GET /reviews/property/{propertyId}` - Get property reviews
- `POST /messages` - Send message
- `GET /messages/inbox` - Get received messages
- `GET /messages/outbox` - Get sent messages
- `GET /admin/users` - List users (ADMIN)

## Authentication Flow

1. User registers/logs in via authentication endpoints
2. Backend returns JWT token in response
3. Token is stored locally (localStorage or sessionStorage)
4. For protected routes, token is included in `Authorization: Bearer <token>` header
5. On page refresh, token is retrieved and user is re-authenticated

## Styling
Currently using vanilla CSS. You can integrate:
- **Tailwind CSS** - Utility-first CSS
- **Material-UI** - Component library
- **Bootstrap** - Popular CSS framework
- **Styled Components** - CSS-in-JS solution

## Linting
```bash
npm run lint
```

## Notes
- JWT tokens are stateless; no session management needed on frontend
- Passwords should never be stored locally; only the JWT token
- CORS should be enabled on backend to allow frontend requests
- All API requests should include proper error handling and loading states
- Implement responsive design for mobile and tablet users

## Development Tips
- Use React DevTools browser extension for debugging
- Use Vite's hot module replacement (HMR) for fast development
- Follow TypeScript strict mode for better type safety
- Organize components by feature, not by type

## Next Steps
1. Set up authentication context/provider
2. Create API service layer
3. Build core pages (Home, Login, Register, Properties, Dashboard)
4. Implement property listing with filters
5. Create booking flow
6. Add messaging system
7. Build role-specific features
