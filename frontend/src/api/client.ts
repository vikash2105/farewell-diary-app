import axios from 'axios';

/**
 * IMPORTANT:
 * - Production (Vercel):
 *   https://farewell-diary-app.onrender.com
 * - Local:
 *   http://localhost:5000
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // REQUIRED for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ===========================
   AUTH API
=========================== */
export const authApi = {
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
};

/* ===========================
   USER API
=========================== */
export const userApi = {
  getProfile: () => apiClient.get('/users/profile'),

  updateProfile: (data: {
    name?: string;
    username?: string;
    bio?: string;
  }) => apiClient.put('/users/profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  removeAvatar: () => apiClient.delete('/users/avatar'),
};

export const getBaseUrl = () => API_URL;
