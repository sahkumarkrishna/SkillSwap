# SkillSwap Frontend

React + Vite + Tailwind CSS + Redux Toolkit frontend for SkillSwap platform.

## Features

### Level 1 (Basic)
- ✅ Authentication (Login/Register)
- ✅ User Profile Management
- ✅ Skills CRUD
- ✅ Swap Requests
- ✅ Image Upload

### Level 2 (Intermediate)
- ✅ Real-time Chat (Socket.io)
- ✅ Session Management
- ✅ Reviews & Ratings
- ✅ Dashboard with Stats
- ✅ Notifications

### Level 3 (Advanced)
- ✅ Skill Recommendations
- ✅ Credit Wallet System
- ✅ Video Integration
- ✅ Admin Panel
- ✅ Community Forum
- ✅ Badges & Certificates

## Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **Axios** - HTTP Client
- **Socket.io Client** - Real-time Communication

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── common/          # Reusable components
│   └── features/        # Feature-specific components
├── pages/               # Page components
├── store/
│   └── slices/          # Redux slices
├── services/            # API & Socket services
└── utils/               # Helper functions
```

## Pages

- `/` - Home/Landing
- `/login` - Login
- `/register` - Register
- `/dashboard` - User Dashboard
- `/skills` - Skills Management
- `/sessions` - Session History
- `/chat` - Real-time Chat
- `/forum` - Community Forum
- `/wallet` - Credit Wallet
- `/profile` - User Profile
- `/admin` - Admin Panel

## Redux Slices

1. **authSlice** - Authentication & User
2. **skillsSlice** - Skills Management
3. **walletSlice** - Credit System
4. **notificationsSlice** - Notifications
5. **sessionsSlice** - Sessions
6. **swapsSlice** - Swap Requests
7. **reviewsSlice** - Reviews
8. **messagesSlice** - Chat Messages
9. **badgesSlice** - Badges
10. **certificatesSlice** - Certificates
11. **forumSlice** - Forum Posts
12. **adminSlice** - Admin Operations

## API Integration

All API calls use Axios with JWT token interceptor:

```javascript
import api from './services/api';

// Automatically includes Authorization header
const response = await api.get('/skills');
```

## Real-time Features

Socket.io integration for:
- Live chat messages
- Real-time notifications
- Session updates

## Credit System

- Earn 10 credits/hour teaching
- Spend 10 credits/hour learning
- 50 free credits on signup
- Auto credit transfer on session completion
