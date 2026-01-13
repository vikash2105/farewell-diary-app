# Farewell Diary - Frontend

Modern, production-grade frontend for Farewell Diary built with React, TypeScript, Vite, and TailwindCSS.

## 🎨 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom + Lucide Icons
- **Notifications**: Sonner
- **Date Formatting**: date-fns

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client and endpoints
│   │   └── client.ts   # Axios instance & API functions
│   ├── components/     # Reusable components
│   │   ├── ProtectedRoute.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── NoteCard.tsx
│   │   └── CreateDiaryModal.tsx
│   ├── pages/          # Page components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── PublicDiary.tsx
│   │   ├── WriteFarewellNote.tsx
│   │   └── NotFound.tsx
│   ├── stores/         # Zustand stores
│   │   └── authStore.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_FRONTEND_URL=http://localhost:5173
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 📱 Features

### Pages

1. **Landing Page** (`/`)
   - Hero section with call-to-action
   - Feature showcase
   - Google OAuth login

2. **Dashboard** (`/dashboard`)
   - View personal diary
   - Display all received farewell notes
   - Copy shareable link
   - Regenerate diary link
   - Manage diary settings

3. **Public Diary** (`/diary/:link`)
   - View diary information
   - Check if user already wrote a note
   - Button to write farewell note

4. **Write Farewell Note** (`/diary/:link/write`)
   - Rich text input
   - Font style selection (default, handwriting, serif, cursive)
   - Anonymous posting option
   - Form validation

### Components

- **ProtectedRoute**: Guards authenticated routes
- **LoadingScreen**: Full-screen loading indicator
- **NoteCard**: Displays individual farewell notes
- **CreateDiaryModal**: Modal for creating new diary

### State Management

- **Auth Store (Zustand)**: User authentication state
- **React Query**: Server state, caching, and synchronization

## 🎨 Design System

### Colors

- **Primary**: Rose/Pink shades for emotional warmth
- **Secondary**: Neutral grays for text and borders

### Fonts

- **Default**: Inter (modern sans-serif)
- **Handwriting**: Caveat (casual script)
- **Serif**: Merriweather (classic elegance)
- **Cursive**: Dancing Script (flowing style)

### Components

All styled with TailwindCSS utility classes:
- `.btn` - Button base
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outlined button
- `.card` - Card container
- `.input` - Form input
- `.textarea` - Text area

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server with HMR

# Building
npm run build           # Build for production
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

## 🏗 Build & Deployment

### Production Build

```bash
npm run build
```

Output will be in the `dist/` directory.

### Environment Variables for Production

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_FRONTEND_URL=https://yourdomain.com
```

### Deployment Options

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
```

## 🔐 Authentication Flow

1. User clicks "Get Started" or "Login with Google"
2. Redirects to backend `/auth/google`
3. User authenticates with Google
4. Google redirects to backend callback
5. Backend creates session and redirects to `/dashboard`
6. Frontend checks auth status and displays user data

## 📊 API Integration

All API calls are centralized in `src/api/client.ts`:

```typescript
// Example usage in components
import { diaryApi } from '@/api/client';

const { data } = useQuery({
  queryKey: ['myDiary'],
  queryFn: async () => {
    const res = await diaryApi.getMy();
    return res.data.data;
  },
});
```

## 🎯 Key Features Implementation

### Protected Routes
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### State Persistence
- Auth state persists via backend sessions
- React Query caches server data
- Automatic refetching on window focus

### Error Handling
- Toast notifications for user feedback
- Axios interceptors for global error handling
- Fallback UI for error states

## 🐛 Troubleshooting

**API calls failing**
- Check backend is running
- Verify VITE_API_URL is correct
- Check browser console for CORS errors

**Authentication not working**
- Clear browser cookies
- Check backend Google OAuth configuration
- Verify session cookie settings

**Styles not loading**
- Run `npm install`
- Restart dev server
- Check TailwindCSS configuration

## 📝 Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting
- Functional components with hooks
- Custom hooks for reusable logic

## 🔄 Future Enhancements

- [ ] Dark mode support
- [ ] Email notifications
- [ ] Note editing/deletion
- [ ] Diary themes
- [ ] Export notes as PDF
- [ ] Multi-language support

## 📄 License

MIT License

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting
4. Submit a pull request

---

For backend documentation, see `../backend/README.md`
