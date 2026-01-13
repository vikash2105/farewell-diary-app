# 🌹 Farewell Diary

A production-grade, full-stack emotional platform where users can create private diaries and receive heartfelt farewell notes from friends. Built with modern tech stack and industry best practices.

## 📋 Overview

**Farewell Diary** allows users to:
- Create a personal farewell diary with a unique shareable link
- Share the link with friends who can write farewell notes
- All notes are encrypted and private - only the diary owner can read them
- Friends can write but cannot see other notes
- Beautiful handwriting-style fonts for emotional expression
- Secure Google OAuth authentication

## 🏗 Architecture

This project follows a **completely separated frontend and backend** architecture:

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Security**: Helmet, CORS, Rate Limiting, AES Encryption
- **Session Storage**: PostgreSQL (connect-pg-simple)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand + TanStack Query
- **Routing**: React Router v6

## 📁 Project Structure

```
farewell-diary-app/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── db/            # Database schema & migrations
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── app.ts         # Express app setup
│   │   └── index.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   └── README.md
│
└── frontend/               # React + Vite app
    ├── src/
    │   ├── api/           # API client
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── stores/        # State management
    │   ├── types/         # TypeScript types
    │   ├── App.tsx        # Main app
    │   └── main.tsx       # Entry point
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **Google Cloud Console** project (for OAuth)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd farewell-diary-app
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env and add your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - SESSION_SECRET (random 32+ character string)
# - JWT_SECRET (random 32+ character string)
# - ENCRYPTION_KEY (exactly 32 characters)
# - GOOGLE_CLIENT_ID (from Google Console)
# - GOOGLE_CLIENT_SECRET (from Google Console)
# - GOOGLE_CALLBACK_URL
# - FRONTEND_URL

# Create PostgreSQL database
createdb farewell_diary

# Generate and run migrations
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

Backend will run at `http://localhost:5000`

### 3. Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env:
# VITE_API_URL=http://localhost:5000/api/v1
# VITE_FRONTEND_URL=http://localhost:5173

# Start development server
npm run dev
```

Frontend will run at `http://localhost:5173`

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/v1/auth/google/callback`
   - Production: `https://your-api-domain.com/api/v1/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to backend `.env`

## 🔐 Security Features

1. **Authentication**
   - Google OAuth 2.0 for secure login
   - Session-based authentication
   - Secure cookie settings

2. **Data Protection**
   - Farewell notes encrypted at rest (AES encryption)
   - Environment variables for secrets
   - PostgreSQL for secure data storage

3. **API Security**
   - Helmet.js for HTTP headers
   - CORS protection
   - Rate limiting (100 requests per 15 minutes)
   - Input validation with Zod
   - SQL injection prevention (Drizzle ORM)

4. **Access Control**
   - Diary owners can ONLY read notes
   - Friends can ONLY write notes
   - Link-based diary access
   - One note per user per diary

## 📊 Database Schema

### Users
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- name (VARCHAR)
- profilePicture (TEXT)
- googleId (VARCHAR, UNIQUE)
- isActive (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)
```

### Diaries
```sql
- id (UUID, PK)
- userId (UUID, FK → users)
- uniqueLink (VARCHAR, UNIQUE)
- title (VARCHAR)
- description (TEXT)
- settings (JSONB)
- isActive (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)
```

### Farewell Notes
```sql
- id (UUID, PK)
- diaryId (UUID, FK → diaries)
- authorId (UUID, FK → users)
- authorName (VARCHAR)
- authorEmail (VARCHAR)
- encryptedContent (TEXT)  # AES encrypted
- fontStyle (VARCHAR)
- isAnonymous (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)
```

## 🛣 API Endpoints

### Authentication
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - OAuth callback
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Diary Management
- `POST /api/v1/diary` - Create diary
- `GET /api/v1/diary/me` - Get my diary
- `GET /api/v1/diary/:link` - Get public diary info
- `GET /api/v1/diary/me/notes` - Get all my notes
- `PUT /api/v1/diary/:id` - Update diary
- `POST /api/v1/diary/:id/regenerate-link` - New link

### Farewell Notes
- `POST /api/v1/notes/:link` - Create note
- `GET /api/v1/notes/:link/check` - Check if wrote note
- `DELETE /api/v1/notes/:id` - Delete note

## 🎯 User Flow

1. **User Registration/Login**
   - Click "Get Started" → Google OAuth → Redirected to Dashboard

2. **Create Diary**
   - Fill in title and description → Get unique shareable link

3. **Share Link**
   - Copy link → Send to friends

4. **Friend Writes Note**
   - Friend clicks link → Login with Google → Write farewell note
   - Choose font style (default, handwriting, serif, cursive)
   - Option to post anonymously

5. **View Notes**
   - Owner views all notes in dashboard
   - Notes displayed with chosen font styles
   - See author name (or "Anonymous") and timestamp

## 🌐 Deployment

### Backend Deployment (Recommended: Railway, Render, Fly.io)

```bash
# Build
npm run build

# Set environment variables in hosting platform
# Deploy dist/ folder
```

### Frontend Deployment (Recommended: Vercel, Netlify)

```bash
# Build
npm run build

# Deploy dist/ folder
```

### Environment Variables Checklist

**Backend:**
- ✅ DATABASE_URL
- ✅ SESSION_SECRET
- ✅ JWT_SECRET
- ✅ ENCRYPTION_KEY
- ✅ GOOGLE_CLIENT_ID
- ✅ GOOGLE_CLIENT_SECRET
- ✅ GOOGLE_CALLBACK_URL
- ✅ FRONTEND_URL
- ✅ NODE_ENV=production

**Frontend:**
- ✅ VITE_API_URL
- ✅ VITE_FRONTEND_URL

## 🧪 Development

### Backend Development

```bash
cd backend
npm run dev          # Start with hot reload
npm run build       # Compile TypeScript
npm run lint        # Run ESLint
npm run format      # Format with Prettier
npm test           # Run tests
```

### Frontend Development

```bash
cd frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run format      # Format with Prettier
```

## 📈 Production Best Practices

1. **Security**
   - Use strong secrets (min 32 characters)
   - Enable HTTPS
   - Set secure cookie flags
   - Rate limiting configured
   - Input validation on all endpoints

2. **Performance**
   - Database indexes on frequently queried fields
   - Connection pooling
   - Frontend code splitting
   - Asset optimization

3. **Monitoring**
   - Application logs (Winston)
   - Error tracking
   - Performance monitoring
   - Database query logging

4. **Backup**
   - Regular database backups
   - Encrypted backup storage
   - Disaster recovery plan

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d farewell_diary
```

**Google OAuth not working**
- Verify credentials in .env match Google Console
- Check callback URL is correctly configured
- Ensure OAuth consent screen is published

**Frontend can't connect to backend**
- Check backend is running on correct port
- Verify VITE_API_URL in frontend .env
- Check CORS configuration in backend

## 🎨 Customization

### Adding New Font Styles

1. Add font to `frontend/index.html`
2. Update Tailwind config
3. Add option to `CreateNoteDto` type
4. Update font selector in WriteFarewellNote page

### Changing Theme Colors

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: { ... },  // Change these values
  secondary: { ... }
}
```

## 📝 License

MIT License - Feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check individual README files in `/backend` and `/frontend`
- Review troubleshooting sections
- Create an issue in the repository

---

**Made with ❤️ for preserving precious memories**
