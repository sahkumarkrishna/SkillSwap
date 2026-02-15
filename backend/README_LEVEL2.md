# SkillSwap Backend - Level 2 ✅

## Level 1 Features ✅
1. ✅ Authentication System (JWT + bcrypt)
2. ✅ User Profile + Skills
3. ✅ Skill Listing (Browse, Filter, Search)
4. ✅ Skill Offer Posting
5. ✅ Swap Request System
6. ✅ Image Upload (Cloudinary)

## Level 2 Features ✅ (Professional)

### 6. Swap Session Scheduling ✅
- Schedule sessions after swap acceptance
- Date/time selection
- Duration tracking
- Meeting link integration
- Session status (Scheduled/Completed/Cancelled)

### 7. Real-Time Chat (Socket.io) ✅
- Private chat rooms per swap request
- Real-time messaging
- File sharing support
- Message history

### 8. Reviews + Ratings System ✅
- Rate mentors (1-5 stars)
- Written feedback
- Average rating calculation
- Review history

### 9. Dashboard System ✅
**User Dashboard:**
- Active swaps
- Pending requests
- Completed swaps
- Skill posts

**Mentor Dashboard:**
- Incoming requests
- Upcoming sessions
- Ratings & reviews
- Average rating

### 10. Notifications System ✅
- New request alerts
- Session reminders
- Review notifications
- Message alerts
- Email notifications
- Real-time Socket.io notifications

## Architecture

```
backend/
├── config/
│   ├── db.js
│   ├── cloudinary.js
│   ├── email.js          (NEW)
│   └── socket.js         (NEW)
├── models/
│   ├── User.js
│   ├── Skill.js
│   ├── SwapRequest.js
│   ├── Session.js        (NEW)
│   ├── Message.js        (NEW)
│   ├── Review.js         (NEW)
│   └── Notification.js   (NEW)
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── skillController.js
│   ├── swapController.js
│   ├── uploadController.js
│   ├── sessionController.js      (NEW)
│   ├── messageController.js      (NEW)
│   ├── reviewController.js       (NEW)
│   ├── dashboardController.js    (NEW)
│   └── notificationController.js (NEW)
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── skills.js
│   ├── swaps.js
│   ├── upload.js
│   ├── sessions.js       (NEW)
│   ├── messages.js       (NEW)
│   ├── reviews.js        (NEW)
│   ├── dashboard.js      (NEW)
│   └── notifications.js  (NEW)
├── middleware/
│   ├── auth.js
│   └── upload.js
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

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

3. Start MongoDB

4. Run server:
```bash
npm run dev
```

## API Endpoints

### Sessions
- `POST /api/sessions` - Create session (auth)
- `GET /api/sessions` - Get user sessions (auth)
- `PUT /api/sessions/:id/status` - Update session status (auth)

### Messages (Real-time Chat)
- `POST /api/messages` - Send message (auth)
- `GET /api/messages/:swapRequestId` - Get chat history (auth)

### Reviews
- `POST /api/reviews` - Create review (auth)
- `GET /api/reviews/:userId` - Get user reviews

### Dashboard
- `GET /api/dashboard/user` - User dashboard (auth)
- `GET /api/dashboard/mentor` - Mentor dashboard (auth)

### Notifications
- `GET /api/notifications` - Get notifications (auth)
- `PUT /api/notifications/:id/read` - Mark as read (auth)
- `PUT /api/notifications/read-all` - Mark all as read (auth)

## Socket.io Events

### Client → Server
- `join_chat` - Join chat room
- `send_message` - Send message

### Server → Client
- `receive_message` - Receive message

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }
});
```

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (Real-time)
- JWT Authentication
- Nodemailer (Email)
- Cloudinary (Images)
- Multer (File uploads)

## Level 2 Status: ✅ COMPLETE - PROFESSIONAL PROJECT
