import { apiClient } from './client';
import type { ApiResponse } from '../types';

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
   */
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>('/user/profile');
      return response.data.data ?? null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profile: {
    name: string;
    username?: string;
    bio?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.patch<ApiResponse>('/user/profile', profile);
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update profile',
      };
    }
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (
    file: File
  ): Promise<{ success: boolean; avatarUrl?: string; message: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        avatarUrl: response.data.data?.avatarUrl,
        message: response.data.message || 'Avatar uploaded successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to upload avatar',
      };
    }
  },

  /**
   * Remove user avatar
   */
  removeAvatar: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const response = await apiClient.delete<ApiResponse>('/user/avatar');
      return {
        success: true,
        message: response.data.message || 'Avatar removed successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to remove avatar',
      };
    }
  },
};
