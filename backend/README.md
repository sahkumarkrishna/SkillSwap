# SkillSwap Backend - Level 1 ✅

## Features Completed

### 1. Authentication System ✅
- Register/Login with JWT
- Password hashing (bcrypt)
- Fields: Name, Email, Password, Profile Picture

### 2. User Profile + Skills ✅
- Skills Offered & Wanted arrays
- Bio, Location, Availability
- Profile management

### 3. Skill Listing ✅
- Browse all skills
- Filter by category, level
- Search by title
- Populate user details

### 4. Skill Offer Posting ✅
- Create skill with title, description
- Level (Beginner/Intermediate/Advanced)
- Time slots and duration
- CRUD operations

### 5. Swap Request System ✅
- Send swap requests
- Status: Pending/Accepted/Rejected
- View received/sent requests
- Update request status

### 6. Image Upload ✅
- Cloudinary integration
- Profile picture upload
- 5MB limit, images only

## Architecture

**MVC Pattern:**
```
backend/
├── config/          (DB + Cloudinary)
├── models/          (User, Skill, SwapRequest)
├── controllers/     (Business logic)
├── routes/          (API endpoints)
├── middleware/      (Auth, Upload)
└── server.js
```

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Start MongoDB

4. Run server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user (auth)
- `PUT /api/users/profile` - Update profile (auth)
- `GET /api/users/:id` - Get user by ID

### Skills
- `POST /api/skills` - Create skill (auth)
- `GET /api/skills` - List skills (query: category, level, search)
- `GET /api/skills/:id` - Get skill details
- `PUT /api/skills/:id` - Update skill (auth)
- `DELETE /api/skills/:id` - Delete skill (auth)

### Swap Requests
- `POST /api/swaps` - Create swap request (auth)
- `GET /api/swaps/received` - Get received requests (auth)
- `GET /api/swaps/sent` - Get sent requests (auth)
- `PUT /api/swaps/:id/status` - Update status (auth)

### Upload
- `POST /api/upload` - Upload image (auth)

## Authentication
Include JWT token in headers:
```
Authorization: Bearer <token>
```

## Level 1 Status: ✅ COMPLETE
