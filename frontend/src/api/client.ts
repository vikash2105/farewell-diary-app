import axios from 'axios';
import type {
  User,
  Diary,
  FarewellNote,
  CreateDiaryDto,
  CreateNoteDto,
  ApiResponse,
} from '../types';

/**
 * API CLIENT CONFIGURATION
 * 
 * IMPORTANT - Environment Variables:
 * 
 * LOCAL DEVELOPMENT:
 * VITE_API_URL=http://localhost:5000/api
 * 
 * PRODUCTION (Vercel):
 * VITE_API_URL=https://your-backend.onrender.com/api
 * 
 * The base URL should include /api but NOT the version number
 * Version is handled by individual endpoint paths
 */

// Get base API URL from environment
// In local dev: http://localhost:5000/api
// In production: https://your-backend.onrender.com/api
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

/**
 * Main API client for versioned endpoints (/api/v1/*)
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE}/v1`,
  withCredentials: true, // Required for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Public API client for non-versioned public endpoints (/api/public/*)
 */
export const publicApiClient = axios.create({
  baseURL: `${API_BASE}/public`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * User API client for user-specific endpoints (/api/user/*)
 */
export const userApiClient = axios.create({
  baseURL: `${API_BASE}/user`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= AUTH API ================= */
export const authApi = {
  /**
   * Get currently logged-in user
   * GET /api/v1/auth/me
   */
  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout: () =>
    apiClient.post<ApiResponse>('/auth/logout'),

  /**
   * Start Google OAuth login
   * Redirects browser → backend → Google → callback → dashboard
   */
  loginWithGoogle: () => {
    window.location.href = `${API_BASE}/v1/auth/google`;
  },
};

/* ================= DIARY API ================= */
export const diaryApi = {
  /**
   * Create a diary
   * POST /api/v1/diary
   */
  create: (data: CreateDiaryDto) =>
    apiClient.post<
      ApiResponse<{ diary: Diary; shareableUrl: string }>
    >('/diary', data),

  /**
   * Get current user's diary
   * GET /api/v1/diary/me
   */
  getMy: () =>
    apiClient.get<
      ApiResponse<{
        diary: Diary;
        noteCount: number;
        shareableUrl: string;
      }>
    >('/diary/me'),

  /**
   * Get all user's diaries (for dashboard)
   * GET /api/v1/diary
   */
  getUserDiaries: () =>
    apiClient.get<ApiResponse<Array<{
      id: string;
      title: string;
      description: string | null;
      contributorCount: number;
      totalNotes: number;
      updatedAt: string;
      uniqueLink: string;
    }>>>('/diary'),

  /**
   * Get public diary by link (write-only view)
   * GET /api/v1/diary/:link
   */
  getByLink: (link: string) =>
    apiClient.get<ApiResponse<Diary>>(`/diary/${link}`),

  /**
   * Get notes for current user's diary
   * GET /api/v1/diary/me/notes
   */
  getMyNotes: () =>
    apiClient.get<
      ApiResponse<{ notes: FarewellNote[]; total: number }>
    >('/diary/me/notes'),

  /**
   * Update diary
   * PUT /api/v1/diary/:id
   */
  update: (id: string, data: Partial<CreateDiaryDto>) =>
    apiClient.put<ApiResponse<Diary>>(`/diary/${id}`, data),

  /**
   * Regenerate diary share link
   * POST /api/v1/diary/:id/regenerate-link
   */
  regenerateLink: (id: string) =>
    apiClient.post<
      ApiResponse<{ diary: Diary; shareableUrl: string }>
    >(`/diary/${id}/regenerate-link`),
};

/* ================= NOTES API ================= */
export const notesApi = {
  /**
   * Create a farewell note
   * POST /api/v1/notes/:link
   */
  create: (link: string, data: CreateNoteDto) =>
    apiClient.post<
      ApiResponse<{ id: string; message: string }>
    >(`/notes/${link}`, data),

  /**
   * Check if current user has written a note / is owner
   * GET /api/v1/notes/:link/check
   */
  checkUserNote: (link: string) =>
    apiClient.get<
      ApiResponse<{ hasWritten: boolean; isOwner: boolean }>
    >(`/notes/${link}/check`),

  /**
   * Delete a note
   * DELETE /api/v1/notes/:id
   */
  delete: (id: string) =>
    apiClient.delete<ApiResponse>(`/notes/${id}`),
};

/* ================= USER API ================= */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
}

export const userApi = {
  /**
   * Get current user's profile
   * GET /api/user/profile
   */
  getProfile: () =>
    userApiClient.get<ApiResponse<UserProfile>>('/profile'),

  /**
   * Update user profile
   * PATCH /api/user/profile
   */
  updateProfile: (profile: {
    name: string;
    username?: string;
    bio?: string;
  }) =>
    userApiClient.patch<ApiResponse<UserProfile>>('/profile', profile),

  /**
   * Upload user avatar
   * POST /api/user/avatar
   */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return userApiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Remove user avatar
   * DELETE /api/user/avatar
   */
  removeAvatar: () =>
    userApiClient.delete<ApiResponse>('/avatar'),
};

/* ================= PUBLIC API ================= */
export interface Testimonial {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  displayName: string;
  amount: string;
  message?: string;
  createdAt: string;
}

export const publicApi = {
  /**
   * Fetch approved testimonials
   * GET /api/public/testimonials
   */
  getTestimonials: () =>
    publicApiClient.get<ApiResponse<Testimonial[]>>('/testimonials'),

  /**
   * Submit a new testimonial
   * POST /api/public/testimonials
   */
  submitTestimonial: (name: string, message: string) =>
    publicApiClient.post<ApiResponse>('/testimonials', { name, message }),

  /**
   * Fetch public donations
   * GET /api/public/donations
   */
  getDonations: () =>
    publicApiClient.get<ApiResponse<Donation[]>>('/donations'),

  /**
   * Record a donation
   * POST /api/public/donations
   */
  recordDonation: (donation: {
    displayName: string;
    amount: string;
    message?: string;
    isAnonymous?: boolean;
    isPublic?: boolean;
    paymentProvider?: string;
    transactionId?: string;
  }) =>
    publicApiClient.post<ApiResponse>('/donations', donation),
};

export default apiClient;
