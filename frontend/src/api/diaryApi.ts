import { apiClient } from './client';
import type {
  Diary,
  PublicDiary,
  DashboardDiary,
  FarewellNote,
  CreateDiaryDto,
  ApiResponse,
} from '../types';

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
    apiClient.get<ApiResponse<DashboardDiary[]>>('/diary'),

  /**
   * Get public diary by link (for contributors - returns minimal data)
   * Returns PublicDiary with only: title, description, isActive, ownerName
   */
  getByLink: (link: string) =>
    apiClient.get<ApiResponse<PublicDiary>>(`/diary/${link}`),

  /**
   * Get notes for current user's diary (optionally for specific diary)
   */
  getMyNotes: (diaryId?: string) =>
    apiClient.get<
      ApiResponse<{ notes: FarewellNote[]; total: number; diary?: Diary }>
    >(diaryId ? `/diary/me/notes?diaryId=${diaryId}` : '/diary/me/notes'),

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
