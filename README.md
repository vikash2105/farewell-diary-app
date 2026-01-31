# Farewell Diary 💌

> A private, secure platform for preserving farewell messages from loved ones.

Farewell Diary allows you to create a personal diary where friends and family can leave heartfelt farewell messages. Perfect for preserving memories, milestone events, or simply collecting well-wishes from the people who matter most.

## ✨ Features

- **🔐 Secure Authentication** - Google OAuth integration
- **💝 Private Diaries** - Create and manage multiple farewell diaries
- **🔗 Shareable Links** - Unique, secure links for contributors
- **📝 Rich Notes** - Multiple font styles and anonymous option
- **👤 User Profiles** - Customizable profiles with avatar support
- **📱 Responsive Design** - Works perfectly on all devices
- **🎨 Beautiful UI** - Modern, clean interface with Tailwind CSS
- **🛡️ Privacy First** - Encrypted data, rate limiting, and XSS protection

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd farewell-diary-app
   ```

2. **Follow the development guide**
   ```bash
   # See DEVELOPMENT.md for detailed setup instructions
   open DEVELOPMENT.md
   ```

3. **Start developing**
   ```bash
   # Backend
   cd backend && npm install && npm run dev
   
   # Frontend (new terminal)
   cd frontend && npm install && npm run dev
   ```

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to Render + Vercel.

## 📖 Documentation

- **[Development Guide](./DEVELOPMENT.md)** - Complete local setup instructions
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment to Render + Vercel
- **[API Documentation](#api-documentation)** - API endpoints reference

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Server state management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Passport** - OAuth authentication
- **Express Session** - Session management
- **Zod** - Schema validation
- **Winston** - Logging
- **Helmet** - Security headers

## 📁 Project Structure

```
farewell-diary-app/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── db/            # Database schema
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utilities
│   └── package.json
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── api/          # API client
│   │   ├── stores/       # State management
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── DEVELOPMENT.md         # Development setup guide
├── DEPLOYMENT.md          # Production deployment guide
└── README.md             # This file
```

## 🔧 Environment Variables

### Backend (.env)

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/farewell_diary
SESSION_SECRET=your-session-secret
ENCRYPTION_KEY=exactly-32-chars
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
API_VERSION=v1
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:5000/api
```

See `.env.example` files in each directory for complete documentation.

## API Documentation

### Base URLs

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-app.onrender.com/api`

### Endpoints

#### Authentication (`/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/google` | Start Google OAuth | Public |
| GET | `/google/callback` | OAuth callback | Public |
| GET | `/me` | Get current user | Required |
| POST | `/logout` | Logout user | Required |

#### Diaries (`/v1/diary`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create diary | Required |
| GET | `/` | Get user's diaries | Required |
| GET | `/me` | Get user's diary details | Required |
| GET | `/me/notes` | Get all notes | Required |
| GET | `/:link` | Get public diary | Public |
| PUT | `/:id` | Update diary | Required |
| POST | `/:id/regenerate-link` | Regenerate share link | Required |

#### Notes (`/v1/notes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/:link` | Create farewell note | Required |
| GET | `/:link/check` | Check if user wrote note | Optional |
| DELETE | `/:id` | Delete note | Required |

#### User (`/user`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get user profile | Required |
| PATCH | `/profile` | Update profile | Required |
| POST | `/avatar` | Upload avatar | Required |
| DELETE | `/avatar` | Remove avatar | Required |

#### Public (`/public`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/testimonials` | Get testimonials | Public |
| POST | `/testimonials` | Submit testimonial | Optional |
| GET | `/donations` | Get donations | Public |
| POST | `/donations` | Record donation | Optional |

## 🛠️ Development Commands

### Backend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Lint code
npm run format       # Format code
npm run db:push      # Push schema to database
npm run drizzle:generate  # Generate migrations
npm run drizzle:migrate   # Run migrations
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
```

## 🔒 Security Features

- **Session-based Authentication** - Secure session management with PostgreSQL
- **CSRF Protection** - Built-in protection against cross-site request forgery
- **XSS Prevention** - Input sanitization and Content Security Policy
- **Rate Limiting** - Protection against abuse and DDoS
- **Data Encryption** - Sensitive data encrypted at rest
- **Secure Cookies** - HttpOnly, Secure, SameSite cookies
- **SQL Injection Prevention** - Parameterized queries with Drizzle ORM

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for preserving precious memories
- Inspired by the need to keep farewell messages safe and accessible
- Thanks to all contributors and supporters

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/farewell-diary/issues)
- **Email**: support@farewelldiary.com
- **Documentation**: See [DEVELOPMENT.md](./DEVELOPMENT.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Made with ❤️ for preserving precious memories**
