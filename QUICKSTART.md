# Quick Start Guide 🚀

Get the Farewell Diary application running in under 10 minutes!

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed (`psql --version`)
- [ ] npm or yarn installed (`npm --version`)

## Step 1: Database Setup (2 minutes)

```bash
# Open PostgreSQL
psql postgres

# Create database
CREATE DATABASE farewell_diary;
CREATE USER farewell_user WITH PASSWORD 'devpassword123';
GRANT ALL PRIVILEGES ON DATABASE farewell_diary TO farewell_user;

# Exit
\q
```

## Step 2: Google OAuth Setup (3 minutes)

1. Go to https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Credentials → Create OAuth 2.0 Client ID
4. Set Authorized redirect URIs:
   ```
   http://localhost:5000/api/v1/auth/google/callback
   ```
5. Copy Client ID and Client Secret

## Step 3: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL (from Step 1)
# - GOOGLE_CLIENT_ID (from Step 2)
# - GOOGLE_CLIENT_SECRET (from Step 2)
# - Generate secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example .env:
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://farewell_user:devpassword123@localhost:5432/farewell_diary
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
API_VERSION=v1
EOF

# Run migrations
npm run db:push
```

## Step 4: Frontend Setup (1 minute)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

## Step 5: Start Development (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 6: Verify (1 minute)

1. Open http://localhost:5173
2. Click "Get Started"
3. Login with Google
4. You should see the Dashboard!

## Verification Checklist

Run the verification script:
```bash
./verify.sh
```

Or manually check:
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can login with Google
- [ ] Can create a diary
- [ ] Can view dashboard

## Common Issues

### "Port 5000 already in use"
```bash
lsof -ti:5000 | xargs kill -9
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql "postgresql://farewell_user:devpassword123@localhost:5432/farewell_diary"
```

### "Google OAuth not working"
- Verify Client ID and Secret in `.env`
- Check callback URL matches exactly
- Ensure cookies are enabled

## Next Steps

✅ **You're all set!** The application is running.

Now you can:
1. 📖 Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide
2. 🚀 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. 🐛 Check [FIXES.md](./FIXES.md) to see what was fixed
4. 💻 Start building features!

## Need Help?

- **Development Guide**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Documentation**: See README.md
- **Issues**: Check console logs and error messages

---

**Total Setup Time: ~10 minutes** ⏱️

Enjoy building with Farewell Diary! 💝
