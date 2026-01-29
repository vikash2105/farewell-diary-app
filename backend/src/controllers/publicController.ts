import { Request, Response } from 'express';
import { db } from '../db';
import { testimonials, donations } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

/**
 * Sanitize HTML to prevent XSS attacks
 */
const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Get approved testimonials for homepage
 */
export const getTestimonials = async (_req: Request, res: Response) => {
  try {
    const approvedTestimonials = await db
      .select({
        id: testimonials.id,
        name: testimonials.name,
        message: testimonials.message,
        createdAt: testimonials.createdAt,
      })
      .from(testimonials)
      .where(eq(testimonials.isApproved, true))
      .orderBy(desc(testimonials.createdAt))
      .limit(20);

    res.json({
      success: true,
      data: approvedTestimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
    });
  }
};

/**
 * Submit a new testimonial (requires moderation)
 */
export const submitTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;

    // Validate input
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name and message are required',
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Message must be 500 characters or less',
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(name.trim());
    const sanitizedMessage = sanitizeHtml(message.trim());

    // Insert testimonial (unapproved by default)
    const [newTestimonial] = await db
      .insert(testimonials)
      .values({
        userId: req.user?.id || null,
        name: sanitizedName,
        message: sanitizedMessage,
        isApproved: false, // Requires admin approval
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted for review',
      data: newTestimonial,
    });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit testimonial',
    });
  }
};

/**
 * Get public donations list
 */
export const getDonations = async (_req: Request, res: Response) => {
  try {
    const publicDonations = await db
      .select({
        id: donations.id,
        displayName: donations.displayName,
        amount: donations.amount,
        message: donations.message,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .where(eq(donations.isPublic, true))
      .orderBy(desc(donations.createdAt))
      .limit(50);

    res.json({
      success: true,
      data: publicDonations,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
    });
  }
};

/**
 * Record a donation (called after payment confirmation)
 * This should be called from a webhook or after payment verification
 */
export const recordDonation = async (req: Request, res: Response) => {
  try {
    const {
      displayName,
      amount,
      message,
      isAnonymous,
      isPublic,
      paymentProvider,
      transactionId,
    } = req.body;

    // Validate input
    if (!displayName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Display name and amount are required',
      });
    }

    // Sanitize inputs
    const sanitizedDisplayName = sanitizeHtml(displayName.trim());
    const sanitizedMessage = message ? sanitizeHtml(message.trim()) : null;

    // Insert donation record
    const [newDonation] = await db
      .insert(donations)
      .values({
        userId: req.user?.id || null,
        displayName: sanitizedDisplayName,
        amount: amount,
        message: sanitizedMessage,
        isAnonymous: isAnonymous || false,
        isPublic: isPublic !== false, // Default to true
        paymentProvider: paymentProvider || null,
        transactionId: transactionId || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: {
        id: newDonation.id,
        displayName: newDonation.displayName,
        amount: newDonation.amount,
      },
    });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record donation',
    });
  }
};
