# Skills Page - Request Button Guide

## ✅ Request Button is Already Implemented!

### Location
The Request button appears in the **Skills page** (`/skills`) on each skill card.

### When it Shows
- **Visible**: When viewing skills created by OTHER users
- **Hidden**: When viewing YOUR OWN skills (shows Edit/Delete buttons instead)

### How to Use
1. Go to `/skills` page
2. Browse skills created by other users
3. Click the **"Request"** button (blue/purple gradient button with TrendingUp icon)
4. A swap request will be created automatically

### What Happens When You Click Request
1. Creates a swap request in the database
2. Sets the skill owner as the mentor
3. Sends a notification to the skill owner
4. Sends an email to the skill owner
5. Increments the request counter on the skill
6. Shows success toast notification

### Button Appearance
- **Desktop**: Shows icon + "Request" text
- **Mobile**: Shows only icon (responsive design)
- **Colors**: Blue to purple gradient
- **Icon**: TrendingUp arrow icon

### View Your Requests
After clicking Request, you can view all your swap requests at:
- `/swaps` - Swap Requests page
- Shows both sent and received requests
- Can track request status (Pending/Accepted/Rejected)

### Code Location
- **Frontend**: `frontend/src/pages/Skills.jsx` (line ~520)
- **Handler**: `handleRequest()` function
- **Backend**: `backend/controllers/swapController.js` - `createSwapRequest()`

### Testing
1. Login as a user
2. Go to Skills page
3. Click "All Skills" button (not "My Skills")
4. Find a skill created by another user
5. Click the "Request" button at the bottom right of the skill card
6. Check `/swaps` page to see your request

## Button States

### For Your Own Skills:
```
[Edit] [Delete]
```

### For Other Users' Skills:
```
[Heart] [Request]
```

The Request button is fully functional and ready to use!
