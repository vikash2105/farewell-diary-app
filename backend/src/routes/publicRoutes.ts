import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getTestimonials,
  submitTestimonial,
  getDonations,
  recordDonation,
} from '../controllers/publicController';

const router = Router();

// Rate limiting for public endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 submissions per hour
  message: 'Too many submissions. Please try again later.',
});

/**
 * Optional authentication middleware
 * Doesn't fail if user not logged in
 */
const authenticateOptional = (req: any, _res: any, next: any) => {
  // User will be available in req.user if logged in via session
  // Otherwise, req.user will be undefined
  next();
};

// GET endpoints (no auth required)
router.get('/testimonials', publicLimiter, getTestimonials);
router.get('/donations', publicLimiter, getDonations);

// POST endpoints (rate limited, optional auth)
router.post(
  '/testimonials',
  submissionLimiter,
  authenticateOptional,
  submitTestimonial
);

// Donation recording (should be protected or called from webhook)
// For now, using optional auth - in production, this should be webhook-based
router.post(
  '/donations',
  submissionLimiter,
  authenticateOptional,
  recordDonation
);

export default router;
