# Farewell Diary - Backend API

Production-grade backend API for Farewell Diary application built with Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM.

## 🏗 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Session Store**: connect-pg-simple
- **Validation**: Zod
- **Encryption**: crypto-js
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── passport.ts   # Passport Google OAuth setup
│   ├── controllers/      # Route controllers
│   │   ├── authController.ts
│   │   ├── diaryController.ts
│   │   └── farewellNoteController.ts
│   ├── db/              # Database
│   │   ├── schema.ts    # Drizzle ORM schema
│   │   ├── index.ts     # Database connection
│   │   └── migrations/  # Database migrations
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── routes/          # API routes
│   │   ├── authRoutes.ts
│   │   ├── diaryRoutes.ts
│   │   ├── farewellNoteRoutes.ts
│   │   └── index.ts
│   ├── services/        # Business logic
│   │   ├── userService.ts
│   │   ├── diaryService.ts
│   │   └── farewellNoteService.ts
│   ├── utils/           # Utilities
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   ├── linkGenerator.ts
│   │   └── validation.ts
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Entry point
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── .gitignore
├── drizzle.config.ts    # Drizzle configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`**
   
   Required variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Random secret for sessions (min 32 chars)
   - `JWT_SECRET`: Random secret for JWT (min 32 chars)
   - `ENCRYPTION_KEY`: Random key for note encryption (min 32 chars)
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `GOOGLE_CALLBACK_URL`: OAuth callback URL
   - `FRONTEND_URL`: Frontend application URL

5. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb farewell_diary
   
   # Or via psql
   psql -U postgres
   CREATE DATABASE farewell_diary;
   ```

6. **Generate and run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/v1/auth/google/callback`
   - Production: `https://your-domain.com/api/v1/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

## 📊 Database Schema

### Users Table
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `name` (VARCHAR)
- `profilePicture` (TEXT)
- `googleId` (VARCHAR, UNIQUE)
- `isActive` (BOOLEAN)
- `createdAt`, `updatedAt` (TIMESTAMP)

### Diaries Table
- `id` (UUID, PK)
- `userId` (UUID, FK)
- `uniqueLink` (VARCHAR, UNIQUE)
- `title` (VARCHAR)
- `description` (TEXT)
- `settings` (JSONB)
- `isActive` (BOOLEAN)
- `createdAt`, `updatedAt` (TIMESTAMP)

### Farewell Notes Table
- `id` (UUID, PK)
- `diaryId` (UUID, FK)
- `authorId` (UUID, FK, nullable)
- `authorName` (VARCHAR)
- `authorEmail` (VARCHAR)
- `encryptedContent` (TEXT)
- `fontStyle` (VARCHAR)
- `isAnonymous` (BOOLEAN)
- `createdAt`, `updatedAt` (TIMESTAMP)

### Sessions Table
- Managed by `connect-pg-simple`
- Auto-created on first run

## 🛣 API Endpoints

### Authentication
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - OAuth callback
- `GET /api/v1/auth/me` - Get current user (protected)
- `GET /api/v1/auth/status` - Check auth status
- `POST /api/v1/auth/logout` - Logout (protected)

### Diary
- `POST /api/v1/diary` - Create diary (protected)
- `GET /api/v1/diary/me` - Get my diary (protected)
- `GET /api/v1/diary/me/notes` - Get all notes (protected)
- `GET /api/v1/diary/:link` - Get diary by link (public)
- `PUT /api/v1/diary/:id` - Update diary (protected)
- `POST /api/v1/diary/:id/regenerate-link` - Regenerate link (protected)

### Farewell Notes
- `POST /api/v1/notes/:link` - Create note (protected)
- `GET /api/v1/notes/:link/check` - Check if user wrote note
- `DELETE /api/v1/notes/:id` - Delete note (protected)

### Health
- `GET /api/v1/health` - Health check

## 🔒 Security Features

1. **Authentication**
   - Google OAuth 2.0
   - Session-based authentication
   - Secure session storage in PostgreSQL

2. **Data Protection**
   - Farewell notes encrypted at rest (AES)
   - Secure password hashing (bcrypt)
   - HTTPS recommended for production

3. **API Security**
   - Helmet.js for HTTP headers
   - CORS protection
   - Rate limiting
   - Input validation with Zod
   - SQL injection prevention (Drizzle ORM)

4. **Access Control**
   - Diary owners can only read their notes
   - Friends can only write, not read
   - Link-based access validation

## 🧪 Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build           # Compile TypeScript to JavaScript
npm start              # Run production build

# Database
npm run db:generate     # Generate migrations from schema
npm run db:migrate      # Run migrations
npm run db:push        # Push schema directly (dev only)
npm run db:studio      # Open Drizzle Studio

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format with Prettier
npm test              # Run tests
```

## 🌐 Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong secrets (min 32 characters)
   - Enable SSL (`DB_SSL=true`)
   - Set secure CORS origins

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Database**
   - Run migrations: `npm run db:migrate`
   - Set up connection pooling
   - Enable SSL for database connection

4. **Server**
   - Use process manager (PM2, systemd)
   - Set up reverse proxy (Nginx)
   - Enable HTTPS
   - Configure firewall

5. **Monitoring**
   - Check logs in `logs/` directory
   - Monitor error rates
   - Set up alerting

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Environment | `production` |
| `PORT` | No | Server port | `5000` |
| `DATABASE_URL` | Yes | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Yes | Session encryption key | Random 32+ chars |
| `JWT_SECRET` | Yes | JWT signing key | Random 32+ chars |
| `ENCRYPTION_KEY` | Yes | Note encryption key | Random 32 chars |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Secret | From Google Console |
| `GOOGLE_CALLBACK_URL` | Yes | OAuth callback URL | `http://localhost:5000/api/v1/auth/google/callback` |
| `FRONTEND_URL` | Yes | Frontend application URL | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window | `100` |
| `LOG_LEVEL` | No | Logging level | `info` |

## 🐛 Troubleshooting

**Database connection failed**
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify database exists

**Google OAuth not working**
- Verify Google credentials in .env
- Check callback URL matches Google Console
- Ensure OAuth consent screen is configured

**Session issues**
- Check SESSION_SECRET is set
- Verify sessions table exists
- Clear browser cookies

**Rate limiting errors**
- Adjust RATE_LIMIT_MAX_REQUESTS
- Check if behind proxy (trust proxy setting)

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Support

For issues or questions, please create an issue in the repository.
