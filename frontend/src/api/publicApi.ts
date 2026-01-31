import { apiClient } from './client';
import type { ApiResponse } from '../types';

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
   * Fetch approved testimonials for homepage
   */
  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Testimonial[]>>('/public/testimonials');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  /**
   * Submit a new testimonial (requires moderation)
   */
  submitTestimonial: async (
    name: string,
    message: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<ApiResponse>('/public/testimonials', { name, message });
      return {
        success: true,
        message: response.data.message || 'Testimonial submitted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to submit testimonial',
      };
    }
  },

  /**
   * Fetch public donations for supporters section
   */
  getDonations: async (): Promise<Donation[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Donation[]>>('/public/donations');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  /**
   * Record a donation
   */
  recordDonation: async (donation: {
    displayName: string;
    amount: string;
    message?: string;
    isAnonymous?: boolean;
    isPublic?: boolean;
    paymentProvider?: string;
    transactionId?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<ApiResponse>('/public/donations', donation);
      return {
        success: true,
        message: response.data.message || 'Thank you for your donation!',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to record donation',
      };
    }
  },
};
