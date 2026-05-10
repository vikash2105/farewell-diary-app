import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api';
import {
  clearAuthReturnUrl,
  rememberAuthReturnUrl,
  toAbsoluteFrontendUrl,
} from '../utils/authRedirect';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const currentRoute = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (isAuthenticated) {
      clearAuthReturnUrl(currentRoute);
      return;
    }

    rememberAuthReturnUrl(currentRoute);
    authApi.loginWithGoogle(toAbsoluteFrontendUrl(currentRoute));
  }, [currentRoute, isAuthenticated]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
