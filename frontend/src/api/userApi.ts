/**
 * User API Client
 * Handles user profile management
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const API_URL=`${BASE_URL}/api/v1`;
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
}

/**
 * Get current user's profile
 */
export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      credentials: 'include', // Include session cookie
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profile: {
  name: string;
  username?: string;
  bio?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    return {
      success: true,
      message: data.message || 'Profile updated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update profile',
    };
  }
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  file: File
): Promise<{ success: boolean; avatarUrl?: string; message: string }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`${API_URL}/user/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload avatar');
    }
    
    return {
      success: true,
      avatarUrl: data.avatarUrl,
      message: data.message || 'Avatar uploaded successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to upload avatar',
    };
  }
};

/**
 * Remove user avatar
 */
export const removeAvatar = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/user/avatar`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove avatar');
    }
    
    return {
      success: true,
      message: data.message || 'Avatar removed successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to remove avatar',
    };
  }
};

export const userApi = {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
};
