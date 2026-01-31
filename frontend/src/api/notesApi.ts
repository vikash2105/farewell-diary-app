import { apiClient } from './client';
import type { CreateNoteDto, ApiResponse } from '../types';

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
