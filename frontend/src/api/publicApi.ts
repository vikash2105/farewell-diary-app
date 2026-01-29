/**
 * Public API Client
 * Handles calls to public endpoints (no authentication required)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

/**
 * Fetch approved testimonials for homepage
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await fetch(`${API_URL}/api/public/testimonials`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

/**
 * Submit a new testimonial (requires moderation)
 */
export const submitTestimonial = async (
  name: string,
  message: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/public/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, message }),
      credentials: 'include', // Include cookies if logged in
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit testimonial');
    }
    
    return {
      success: true,
      message: data.message || 'Testimonial submitted successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to submit testimonial',
    };
  }
};

/**
 * Fetch public donations for supporters section
 */
export const getDonations = async (): Promise<Donation[]> => {
  try {
    const response = await fetch(`${API_URL}/api/public/donations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

/**
 * Record a donation
 * NOTE: In production, this should be called from payment webhook
 */
export const recordDonation = async (donation: {
  displayName: string;
  amount: string;
  message?: string;
  isAnonymous?: boolean;
  isPublic?: boolean;
  paymentProvider?: string;
  transactionId?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/public/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donation),
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to record donation');
    }
    
    return {
      success: true,
      message: data.message || 'Thank you for your donation!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to record donation',
    };
  }
};

export const publicApi = {
  getTestimonials,
  submitTestimonial,
  getDonations,
  recordDonation,
};
