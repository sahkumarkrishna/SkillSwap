# Deployment Checklist for Render

## Pre-Deployment

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster
- [ ] Create database user with password
- [ ] Whitelist all IP addresses (0.0.0.0/0) for Render
- [ ] Get connection string
- [ ] Test connection locally

### 2. Cloudinary Setup
- [ ] Create Cloudinary account
- [ ] Get Cloud Name
- [ ] Get API Key
- [ ] Get API Secret
- [ ] Test upload locally

### 3. Email Setup (Gmail)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password
- [ ] Test email sending locally

### 4. Code Preparation
- [ ] All environment variables in .env.example
- [ ] Update CORS settings in server.js ✓
- [ ] Test build locally: `cd frontend && npm run build`
- [ ] Test backend locally: `cd backend && npm start`
- [ ] Commit all changes to Git

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy on Render
1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect GitHub repository
4. Select your SkillSwap repository
5. Render will detect `render.yaml` automatically
6. Click "Apply"

### 3. Configure Environment Variables
Go to each service and add:

**Backend Service:**
- MONGO_URI: `mongodb+srv://...`
- CLOUDINARY_CLOUD_NAME: `your_cloud_name`
- CLOUDINARY_API_KEY: `your_api_key`
- CLOUDINARY_API_SECRET: `your_api_secret`
- EMAIL_USER: `your_email@gmail.com`
- EMAIL_PASS: `your_app_password`

**Frontend Service:**
- Variables are auto-set from render.yaml

### 4. Wait for Deployment
- Backend will deploy first (5-10 minutes)
- Frontend will deploy after (3-5 minutes)
- Check logs for any errors

### 5. Create Admin User
1. Go to Backend service in Render
2. Click "Shell" tab
3. Run: `cd backend && npm run create-admin`
4. Note the admin credentials

## Post-Deployment

### 1. Test Application
- [ ] Visit frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test admin login
- [ ] Test skill creation
- [ ] Test image upload
- [ ] Test chat functionality
- [ ] Test notifications

### 2. Update URLs (if needed)
If Render assigns different URLs:
1. Update `CLIENT_URL` in backend environment variables
2. Update `VITE_API_URL` and `VITE_SOCKET_URL` in frontend
3. Redeploy services

### 3. Security
- [ ] Change default admin password
- [ ] Verify JWT secrets are auto-generated
- [ ] Check MongoDB IP whitelist
- [ ] Test CORS settings

## Troubleshooting

### Backend Issues
- Check logs in Render dashboard
- Verify MongoDB connection string
- Verify all environment variables are set
- Check if port 5000 is used

### Frontend Issues
- Check build logs
- Verify API URL is correct
- Check browser console for errors
- Verify CORS settings

### Database Issues
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user permissions
- Test connection string locally first

## URLs After Deployment
- Frontend: https://skillswap-frontend.onrender.com
- Backend: https://skillswap-backend.onrender.com
- API: https://skillswap-backend.onrender.com/api
- Health Check: https://skillswap-backend.onrender.com/health

## Important Notes
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier for production use
- Keep environment variables secure
- Regular backups of MongoDB database recommended
