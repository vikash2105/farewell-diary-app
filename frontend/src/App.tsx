import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { authApi } from './api';
import { useAuthStore } from './stores/authStore';

// Pages
import Dashboard from './pages/Dashboard';
import PublicDiary from './pages/PublicDiary';
import WriteFarewellNote from './pages/WriteFarewellNote';
import NotFound from './pages/NotFound';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import CreateDiary from './pages/CreateDiary';
import ViewNotes from './pages/ViewNotes';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.data.data ?? null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setUser, setLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/diary/:link" element={<PublicDiary />} />
          <Route
            path="/write/:link"
            element={
              <ProtectedRoute>
                <WriteFarewellNote />
              </ProtectedRoute>
            }
          />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateDiary />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <ViewNotes />
              </ProtectedRoute>
            }
          />

          {/* 404 Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
