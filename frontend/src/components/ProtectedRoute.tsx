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
    <div className="site-shell flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
