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
   * (Redirects browser → backend → Google)
   */
  loginWithGoogle: () => {
    window.location.href = `${getBaseUrl()}/auth/google`;
  },
};
