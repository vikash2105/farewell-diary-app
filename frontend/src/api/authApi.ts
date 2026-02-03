// frontend/src/api/authApi.ts
import { apiClient, getBaseUrl } from './client';
import type { User, ApiResponse } from '../types';

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
    apiClient.post<ApiResponse>('/auth/logout'),

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
   * authApi.loginWithGoogle(`${window.location.origin}/diary/${link}/write`);
   */
  loginWithGoogle: (callbackUrl?: string) => {
    const baseUrl = getBaseUrl();
    
    if (callbackUrl) {
      // If callback URL provided, encode it and pass to OAuth
      const encodedCallback = encodeURIComponent(callbackUrl);
      window.location.href = `${baseUrl}/auth/google?callbackUrl=${encodedCallback}`;
    } else {
      // Default behavior - redirect to dashboard after login
      window.location.href = `${baseUrl}/auth/google`;
    }
  },
};
