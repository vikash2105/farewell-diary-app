// frontend/src/api/client.ts
import axios from 'axios';

/**
 * IMPORTANT:
 * - In production (Vercel), VITE_API_URL must be:
 *   https://farewell-diary-app.onrender.com
 * - In local dev:
 *   http://localhost:5000
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 REQUIRED for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ✅ FIXED: Add 401 response interceptor for authentication handling
 * 
 * This interceptor catches all 401 Unauthorized responses and:
 * 1. Saves the current page state to sessionStorage
 * 2. Redirects to Google OAuth login with callback URL
 * 3. After login, user is returned to where they were
 */
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Only handle 401 errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const requiresAuth =
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/create') ||
        currentPath.startsWith('/profile') ||
        currentPath.startsWith('/notes') ||
        currentPath.startsWith('/write');

      // Redirect only when the user is on an authenticated route.
      // Public routes (/, /diary/:link) should never force OAuth on a 401.
      if (requiresAuth) {
        // Save current location for post-login redirect
        sessionStorage.setItem('auth_redirect_after_login', currentPath);
        
        // Construct callback URL for OAuth
        const callbackUrl = encodeURIComponent(`${window.location.origin}${currentPath}`);
        
        // Redirect to Google OAuth with callback
        window.location.href = `${BASE_URL}/api/v1/auth/google?callbackUrl=${callbackUrl}`;
        
        // Return a rejected promise to stop further error handling
        return new Promise(() => {}); // Never resolves - we're redirecting
      }
    }
    
    // For all other errors, pass them through
    return Promise.reject(error);
  }
);

export const getBaseUrl = () => API_URL;
