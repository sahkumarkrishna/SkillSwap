# Login 400 Error - Troubleshooting Guide

## What I Found:
✅ MongoDB connection works (tested successfully)
✅ Database has 1 user: sagar@gmail.com
✅ Backend .env is configured correctly (PORT=4000)
✅ Frontend .env points to correct API URL (http://localhost:4000/api)
✅ Validation middleware is set up correctly

## Changes Made:
1. Added console.log statements in backend auth controller to see incoming requests
2. Added console.log statements in validation middleware to see validation errors
3. Added better error handling in frontend authSlice with rejectWithValue
4. Added console.log statements in frontend login action

## Steps to Debug:

### Step 1: Restart Backend Server
```bash
cd backend
npm start
```
Watch the console for:
- "Server running on port 4000"
- "MongoDB connected"

### Step 2: Restart Frontend Server
```bash
cd frontend
npm run dev
```

### Step 3: Try to Login
Use the existing user credentials:
- Email: sagar@gmail.com
- Password: (whatever password was used during registration)

### Step 4: Check Console Logs

**Backend Console** should show:
```
Validation check - Request body: { email: '...', password: '...' }
Login request body: { email: '...', password: '...' }
```

**Browser Console** should show:
```
Sending login request: { email: '...', password: '***' }
```

## Common Issues & Solutions:

### Issue 1: Empty Request Body
**Symptom**: Backend logs show `Request body: {}`
**Solution**: Make sure `app.use(express.json())` is before route definitions in server.js
**Status**: ✅ Already correct in server.js

### Issue 2: CORS Error
**Symptom**: Browser shows CORS error in console
**Solution**: Backend has `app.use(cors())` enabled
**Status**: ✅ Already enabled

### Issue 3: Wrong Password
**Symptom**: Backend logs show "Invalid credentials"
**Solution**: Try registering a new user first, then login with those credentials

### Issue 4: Email Validation Failing
**Symptom**: Validation errors show "Valid email is required"
**Solution**: Make sure email format is correct (e.g., test@example.com)

### Issue 5: Port Mismatch
**Symptom**: Connection refused or timeout
**Solution**: Verify both servers are running on correct ports
- Backend: http://localhost:4000
- Frontend: http://localhost:5173 (or whatever Vite assigns)

## Test with cURL:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"sagar@gmail.com\",\"password\":\"yourpassword\"}"
```

## If Still Not Working:
1. Check if you remember the password for sagar@gmail.com
2. Try registering a new user first at /register
3. Share the exact error message from:
   - Browser console (F12)
   - Backend terminal
   - Network tab in browser DevTools (check the request payload and response)
