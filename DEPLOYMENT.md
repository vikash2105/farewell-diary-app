# Deployment Guide - Farewell Diary

This guide covers deploying the Farewell Diary application to production using Render (backend) and Vercel (frontend).

## Prerequisites

- Node.js 18+ installed locally
- Git repository pushed to GitHub
- Render account (for backend)
- Vercel account (for frontend)
- Google OAuth credentials configured

## Backend Deployment (Render)

### 1. Create PostgreSQL Database

1. Log in to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `farewell-diary-db`
   - Database: `farewell_diary`
   - User: (auto-generated)
   - Region: Choose closest to your users
   - Instance Type: Free or Starter
4. Click "Create Database"
5. **Copy the Internal Database URL** - you'll need this for the backend service

### 2. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `farewell-diary-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

### 3. Configure Environment Variables

Add the following environment variables in Render:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-render-postgres-internal-url>
SESSION_SECRET=<generate-32-char-random-string>
ENCRYPTION_KEY=<exactly-32-characters-string>
JWT_SECRET=<generate-32-char-random-string>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/v1/auth/google/callback
FRONTEND_URL=https://your-app.vercel.app
API_VERSION=v1
```

**Important Notes:**
- Replace `your-app.onrender.com` with your actual Render URL
- Replace `your-app.vercel.app` with your actual Vercel URL (do this AFTER deploying frontend)
- Generate random strings for secrets using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-app.onrender.com`

### 5. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client
3. Add to **Authorized redirect URIs**:
   ```
   https://your-app.onrender.com/api/v1/auth/google/callback
   ```
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

Ensure your `frontend/vercel.json` looks like this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
cd frontend
npm install -g vercel
vercel
```

Follow the prompts:
- Link to existing project? No
- Project name: `farewell-diary`
- Directory: `./` (current directory)
- Override settings? No

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```bash
VITE_API_URL=https://your-app.onrender.com/api
```

**Important**: 
- Replace `your-app.onrender.com` with your actual Render backend URL
- Include `/api` at the end
- Do NOT include `/v1` (this is handled by the client)

### 4. Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

### 5. Update Backend FRONTEND_URL

1. Go back to Render
2. Update the `FRONTEND_URL` environment variable to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Render will automatically redeploy

## Verification Checklist

### Backend Health Check

Visit: `https://your-app.onrender.com/api/v1/health`

Expected response:
```json
{
  "success": true,
  "message": "Farewell Diary API is running",
  "timestamp": "2026-01-31T..."
}
```

### Frontend Check

1. Visit your Vercel URL
2. Click "Get Started" 
3. Should redirect to Google login
4. After login, should redirect to Dashboard

### Database Migration

After first deployment, run migrations:

```bash
# SSH into Render or use Render Shell
cd /app
npm run db:push
```

Or use the provided migration script:
```bash
npm run drizzle:migrate
```

## Common Issues

### Issue: "Session not found" or CORS errors

**Solution**: Verify these settings:

1. **Backend** (`app.ts`):
   ```typescript
   app.set('trust proxy', 1);
   
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
   }));
   
   cookie: {
     httpOnly: true,
     secure: true,
     sameSite: 'none',
   }
   ```

2. **Frontend** (`client.ts`):
   ```typescript
   withCredentials: true
   ```

### Issue: OAuth callback fails

**Solution**:
1. Check Google OAuth settings include correct callback URL
2. Verify `GOOGLE_CALLBACK_URL` in Render matches exactly
3. Ensure `FRONTEND_URL` is correct

### Issue: API calls return 404

**Solution**:
1. Check `VITE_API_URL` includes `/api` but NOT `/v1`
2. Verify backend routes are mounted correctly
3. Check Render logs for errors

### Issue: Database connection fails

**Solution**:
1. Use **Internal Database URL** from Render PostgreSQL
2. Ensure `ssl: { rejectUnauthorized: false }` is set
3. Check Render logs for connection errors

## Environment Variable Summary

### Backend (Render)

| Variable | Example | Required |
|----------|---------|----------|
| NODE_ENV | production | ✅ |
| PORT | 10000 | ✅ |
| DATABASE_URL | postgresql://... | ✅ |
| SESSION_SECRET | 32+ chars | ✅ |
| ENCRYPTION_KEY | Exactly 32 chars | ✅ |
| JWT_SECRET | 32+ chars | ✅ |
| GOOGLE_CLIENT_ID | xxx.apps.googleusercontent.com | ✅ |
| GOOGLE_CLIENT_SECRET | GOCSPX-xxx | ✅ |
| GOOGLE_CALLBACK_URL | https://your-app.onrender.com/api/v1/auth/google/callback | ✅ |
| FRONTEND_URL | https://your-app.vercel.app | ✅ |
| API_VERSION | v1 | ✅ |

### Frontend (Vercel)

| Variable | Example | Required |
|----------|---------|----------|
| VITE_API_URL | https://your-app.onrender.com/api | ✅ |

## Post-Deployment

1. Test all flows:
   - ✅ Login with Google
   - ✅ Create diary
   - ✅ Share diary link
   - ✅ Write farewell note
   - ✅ View notes
   - ✅ Update profile

2. Monitor logs:
   - Render: Dashboard → Logs
   - Vercel: Project → Logs

3. Set up custom domains (optional):
   - Render: Settings → Custom Domains
   - Vercel: Settings → Domains

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure database migrations have run
5. Check CORS and session settings

## Scaling Considerations

### Free Tier Limitations
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds

### Upgrading
- Render Starter: $7/month (no sleep)
- PostgreSQL Starter: $7/month (better performance)
- Vercel Pro: $20/month (better builds, analytics)
