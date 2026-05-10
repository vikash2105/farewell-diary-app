// frontend/src/api/authApi.ts
import { apiClient, getBaseUrl } from './client';
import type { User, ApiResponse } from '../types';
import {
  isProtectedRoute,
  isSafeInternalRoute,
  rememberAuthReturnUrl,
} from '../utils/authRedirect';

export const authApi = {
  /**
   * Get currently logged-in user
   */
  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  /**
   * Logout user
   */
  logout: () =>
    apiClient.post<ApiResponse>('/auth/logout', undefined, {
      skipAuthRedirect: true,
    } as any),

  /**
   * Start Google OAuth login
   * 
   * @param callbackUrl - Optional URL to redirect to after login
   *                      If not provided, defaults to /dashboard
   * 
   * @example
   * // Default - redirect to dashboard
   * authApi.loginWithGoogle();
   * 
   * @example
   * // Custom callback - redirect to specific page
   * authApi.loginWithGoogle(`${window.location.origin}/write/${link}`);
   */
  loginWithGoogle: (callbackUrl?: string) => {
    const baseUrl = getBaseUrl();
    
    if (callbackUrl) {
      try {
        const parsedCallback = new URL(callbackUrl);
        const callbackRoute = `${parsedCallback.pathname}${parsedCallback.search}${parsedCallback.hash}`;

        if (
          parsedCallback.origin === window.location.origin &&
          isSafeInternalRoute(callbackRoute) &&
          isProtectedRoute(callbackRoute)
        ) {
          rememberAuthReturnUrl(callbackRoute);
        }
      } catch {
        // Invalid callback URLs are ignored by the backend and should not be stored locally.
      }

      // If callback URL provided, encode it and pass to OAuth
      const encodedCallback = encodeURIComponent(callbackUrl);
      window.location.href = `${baseUrl}/auth/google?callbackUrl=${encodedCallback}`;
    } else {
      // Default behavior - redirect to dashboard after login
      window.location.href = `${baseUrl}/auth/google`;
    }
  },
};
