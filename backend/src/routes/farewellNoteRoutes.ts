import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { FarewellNoteController } from '../controllers/farewellNoteController';
import { isAuthenticated, optionalAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { createFarewellNoteSchema } from '../utils/validation';
import { sanitizeInput } from '../middleware/sanitize';
import { limitRequestSize, LIMITS } from '../middleware/requestSizeLimit';

const router = Router();

/**
 * Rate limiter specifically for note creation
 * More restrictive than global rate limit to prevent spam
 * 
 * Limits: 5 notes per 15 minutes per IP
 * This prevents abuse while allowing legitimate use
 */
const noteCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 notes per window
  message: 'Too many notes created from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip successful requests (only count failures)
  skipSuccessfulRequests: false,
  // Skip failed requests (count all attempts)
  skipFailedRequests: false,
});

/**
 * @route   POST /api/v1/notes/:link
 * @desc    Create a farewell note for a diary
 * @access  Private (must be logged in)
 * 
 * Middleware stack:
 * 1. limitRequestSize - Prevent large payloads (10KB max)
 * 2. noteCreationLimiter - Prevent spam (5 notes per 15 min)
 * 3. isAuthenticated - Require login
 * 4. sanitizeInput - Strip HTML tags for XSS prevention
 * 5. validateBody - Validate schema with Zod
 * 6. FarewellNoteController.createNote - Handle request
 */
router.post(
  '/:link',
  limitRequestSize(LIMITS.NOTE),
  noteCreationLimiter,
  optionalAuth,
  sanitizeInput,
  validateBody(createFarewellNoteSchema),
  FarewellNoteController.createNote
);

/**
 * @route   GET /api/v1/notes/:link/check
 * @desc    Check if user has written a note
 * @access  Public (optional auth)
 * 
 * Returns:
 * - hasWritten: boolean (whether current user wrote a note)
 * - isOwner: boolean (whether current user owns the diary)
 */
router.get('/:link/check', optionalAuth, FarewellNoteController.checkUserNote);

/**
 * @route   DELETE /api/v1/notes/:id
 * @desc    Delete a farewell note
 * @access  Private (author or diary owner)
 * 
 * UPDATED: Now allows both note author AND diary owner to delete
 */
router.delete('/:id', isAuthenticated, FarewellNoteController.deleteNote);

export default router;
