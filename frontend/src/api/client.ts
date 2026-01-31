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

export const getBaseUrl = () => API_URL;
