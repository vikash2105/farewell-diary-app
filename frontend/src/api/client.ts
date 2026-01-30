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
 * IMPORTANT:
 * - In production (Vercel), VITE_API_URL must be:
 *   https://farewell-diary-app.onrender.com/api/v1
 * - In local dev:
 *   http://localhost:5000/api/v1
 */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 REQUIRED for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= AUTH API ================= */
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
    window.location.href = `${API_URL}/auth/google`;
  },
};

/* ================= DIARY API ================= */
export const diaryApi = {
  /**
   * Create a diary
   */
  create: (data: CreateDiaryDto) =>
    apiClient.post<
      ApiResponse<{ diary: Diary; shareableUrl: string }>
    >('/diary', data),

  /**
   * Get current user's diary
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
   */
  getUserDiaries: () =>
    apiClient.get<ApiResponse<Diary[]>>('/diaries'),

  /**
   * Get public diary by link (write-only view)
   */
  getByLink: (link: string) =>
    apiClient.get<ApiResponse<Diary>>(`/diary/${link}`),

  /**
   * Get notes for current user's diary
   */
  getMyNotes: () =>
    apiClient.get<
      ApiResponse<{ notes: FarewellNote[]; total: number }>
    >('/diary/me/notes'),

  /**
   * Update diary
   */
  update: (id: string, data: Partial<CreateDiaryDto>) =>
    apiClient.put<ApiResponse<Diary>>(`/diary/${id}`, data),

  /**
   * Regenerate diary share link
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
   */
  create: (link: string, data: CreateNoteDto) =>
    apiClient.post<
      ApiResponse<{ id: string; message: string }>
    >(`/notes/${link}`, data),

  /**
   * Check if current user has written a note / is owner
   */
  checkUserNote: (link: string) =>
    apiClient.get<
      ApiResponse<{ hasWritten: boolean; isOwner: boolean }>
    >(`/notes/${link}/check`),

  /**
   * Delete a note
   */
  delete: (id: string) =>
    apiClient.delete<ApiResponse>(`/notes/${id}`),
};

export default apiClient;
