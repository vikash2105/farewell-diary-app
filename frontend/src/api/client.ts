import axios from 'axios';
import type {
  User,
  Diary,
  FarewellNote,
  CreateDiaryDto,
  CreateNoteDto,
  ApiResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= AUTH API =================
export const authApi = {
  getCurrentUser: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  logout: () => apiClient.post<ApiResponse>('/auth/logout'),

  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
};

// ================= DIARY API =================
export const diaryApi = {
  create: (data: CreateDiaryDto) =>
    apiClient.post<ApiResponse<{ diary: Diary; shareableUrl: string }>>(
      '/diary',
      data
    ),

  getMy: () =>
    apiClient.get<ApiResponse<{ diary: Diary; noteCount: number; shareableUrl: string }>>(
      '/diary/me'
    ),

  getByLink: (link: string) =>
    apiClient.get<ApiResponse<Diary>>(`/diary/${link}`),

  getMyNotes: () =>
    apiClient.get<ApiResponse<{ notes: FarewellNote[]; total: number }>>(
      '/diary/me/notes'
    ),

  update: (id: string, data: Partial<CreateDiaryDto>) =>
    apiClient.put<ApiResponse<Diary>>(`/diary/${id}`, data),

  regenerateLink: (id: string) =>
    apiClient.post<ApiResponse<{ diary: Diary; shareableUrl: string }>>(
      `/diary/${id}/regenerate-link`
    ),
};

// ================= NOTES API =================
export const notesApi = {
  create: (link: string, data: CreateNoteDto) =>
    apiClient.post<ApiResponse<{ id: string; message: string }>>(
      `/notes/${link}`,
      data
    ),

  checkUserNote: (link: string) =>
    apiClient.get<ApiResponse<{ hasWritten: boolean; isOwner: boolean }>>(
      `/notes/${link}/check`
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse>(`/notes/${id}`),
};

export default apiClient;
