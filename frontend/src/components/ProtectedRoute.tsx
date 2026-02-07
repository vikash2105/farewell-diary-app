import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api';

type ProtectedRouteProps = {
  children: React.ReactNode;
  useGoogleRedirect?: boolean;
};

export default function ProtectedRoute({ children, useGoogleRedirect = false }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && useGoogleRedirect) {
      const callbackUrl = `${window.location.origin}${location.pathname}${location.search}`;
      authApi.loginWithGoogle(callbackUrl);
    }
  }, [isAuthenticated, location.pathname, location.search, useGoogleRedirect]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (useGoogleRedirect) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return <Navigate to="/" replace />;
}