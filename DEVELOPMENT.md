# Development Setup Guide

This guide will help you set up the Farewell Diary application for local development.

## Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher
- **npm** or **yarn**
- **Git**

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd farewell-diary-app

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# Setup frontend (in new terminal)
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## Detailed Setup

### 1. Database Setup

#### Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Login to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE farewell_diary;
CREATE USER farewell_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE farewell_diary TO farewell_user;

# Exit
\q
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: Web application
   - Name: Farewell Diary Dev
   - Authorized JavaScript origins: 
     - `http://localhost:5173`
   - Authorized redirect URIs: 
     - `http://localhost:5000/api/v1/auth/google/callback`
6. Copy **Client ID** and **Client Secret**

### 3. Backend Configuration

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://farewell_user:your_password@localhost:5432/farewell_diary

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=<generate-random-32-chars>
ENCRYPTION_KEY=<exactly-32-characters!!!>
JWT_SECRET=<generate-random-32-chars>

# From Google OAuth
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

FRONTEND_URL=http://localhost:5173
API_VERSION=v1
```

#### Generate Secrets

```bash
# Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key (exactly 32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Run Database Migrations

```bash
npm run drizzle:generate
npm run drizzle:migrate
```

Or use push for development:
```bash
npm run db:push
```

### 4. Frontend Configuration

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```bash
VITE_API_URL=http://localhost:5000/api
```

**Important**: 
- Use `.env.local` (not `.env`) for local overrides
- Include `/api` but NOT `/v1`

### 5. Run Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 6. Verify Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/v1/health
   ```
   
   Expected response:
   ```json
   {
     "success": true,
     "message": "Farewell Diary API is running",
     "timestamp": "..."
   }
   ```

2. **Frontend**
   - Open `http://localhost:5173`
   - Click "Get Started"
   - Should redirect to Google OAuth
   - After login, should redirect to Dashboard

## Project Structure

```
farewell-diary-app/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app configuration
│   │   ├── index.ts            # Server entry point
│   │   ├── config/
│   │   │   ├── env.ts          # Environment validation
│   │   │   └── passport.ts     # Passport OAuth config
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── db/                 # Database schema & connection
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   ├── api/
│   │   │   └── client.ts       # API client (axios)
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── stores/             # Zustand state management
│   │   └── types/              # TypeScript types
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## API Routes

### Auth Routes (`/api/v1/auth/*`)
- `GET /google` - Start Google OAuth
- `GET /google/callback` - OAuth callback
- `GET /me` - Get current user
- `POST /logout` - Logout

### Diary Routes (`/api/v1/diary/*`)
- `POST /` - Create diary
- `GET /` - Get user's diaries
- `GET /me` - Get user's diary with stats
- `GET /me/notes` - Get all notes for user's diary
- `GET /:link` - Get public diary (for writing notes)
- `PUT /:id` - Update diary
- `POST /:id/regenerate-link` - Regenerate share link

### Notes Routes (`/api/v1/notes/*`)
- `POST /:link` - Create note for diary
- `GET /:link/check` - Check if user wrote note
- `DELETE /:id` - Delete note

### User Routes (`/api/user/*`)
- `GET /profile` - Get user profile
- `PATCH /profile` - Update profile
- `POST /avatar` - Upload avatar
- `DELETE /avatar` - Remove avatar

### Public Routes (`/api/public/*`)
- `GET /testimonials` - Get approved testimonials
- `POST /testimonials` - Submit testimonial
- `GET /donations` - Get public donations
- `POST /donations` - Record donation

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `backend/src/`
   - Server auto-restarts (tsx watch)
   - Check console for errors

2. **Frontend Changes**
   - Edit files in `frontend/src/`
   - Vite HMR updates automatically
   - Check browser console

### Database Changes

```bash
# 1. Modify schema in backend/src/db/schema.ts
# 2. Generate migration
npm run drizzle:generate

# 3. Apply migration
npm run drizzle:migrate

# OR for development, push directly
npm run db:push
```

### Adding New Routes

1. **Backend:**
   ```typescript
   // 1. Add controller in src/controllers/
   // 2. Add route in src/routes/
   // 3. Mount in src/app.ts or src/routes/index.ts
   ```

2. **Frontend:**
   ```typescript
   // 1. Add API function in src/api/client.ts
   // 2. Add page component in src/pages/
   // 3. Add route in src/App.tsx
   ```

## Testing

### Manual Testing

1. **Auth Flow**
   - Login with Google
   - Logout
   - Check session persistence

2. **Diary Flow**
   - Create diary
   - Get shareable link
   - Open link in incognito
   - Write note
   - View notes as owner

3. **Profile Flow**
   - Update name/bio
   - Upload avatar
   - Remove avatar

### API Testing (Postman/Thunder Client)

Import this collection:
```json
{
  "name": "Farewell Diary API",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:5000/api/v1/health"
    },
    {
      "name": "Get Current User",
      "method": "GET",
      "url": "http://localhost:5000/api/v1/auth/me",
      "headers": {
        "Cookie": "farewell.sid=<your-session-cookie>"
      }
    }
  ]
}
```

## Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
psql "postgresql://farewell_user:your_password@localhost:5432/farewell_diary"
```

### OAuth Not Working

1. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Verify callback URL in Google Console matches `.env`
3. Ensure `FRONTEND_URL` is correct in backend `.env`
4. Check cookies are enabled in browser

### CORS Errors

1. Verify `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
2. Check `withCredentials: true` in frontend API client
3. Ensure backend CORS is configured correctly in `app.ts`

### Session Not Persisting

1. Check `SESSION_SECRET` is set
2. Verify `trust proxy` is set in `app.ts`
3. Ensure cookies are not being blocked
4. Check session table exists in database

## Best Practices

### Code Style

```bash
# Backend linting
cd backend
npm run lint
npm run format

# Frontend linting
cd frontend
npm run lint
npm run format
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

### Environment Variables

- Never commit `.env` files
- Always update `.env.example` when adding new vars
- Use descriptive variable names
- Validate env vars on startup (see `backend/src/config/env.ts`)

## Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Passport.js Docs](http://www.passportjs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## Getting Help

1. Check console logs (backend and frontend)
2. Review this guide
3. Check existing issues
4. Ask for help in discussions

## Next Steps

After setup:
1. ✅ Create your first diary
2. ✅ Share the link
3. ✅ Write a test note
4. ✅ Explore the codebase
5. ✅ Make your first contribution!
