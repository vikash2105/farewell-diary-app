import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { authApi } from './api/client';
import { useAuthStore } from './stores/authStore';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PublicDiary from './pages/PublicDiary';
import WriteFarewellNote from './pages/WriteFarewellNote';
import NotFound from './pages/NotFound';

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
          <Route path="/" element={<Landing />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/diary/:link" element={<PublicDiary />} />
          <Route path="/diary/:link/write" element={<WriteFarewellNote />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
