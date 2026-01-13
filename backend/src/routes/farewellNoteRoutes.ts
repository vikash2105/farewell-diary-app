import { Router } from 'express';
import { FarewellNoteController } from '../controllers/farewellNoteController';
import { isAuthenticated, optionalAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { createFarewellNoteSchema } from '../utils/validation';

const router = Router();

/**
 * @route   POST /api/v1/notes/:link
 * @desc    Create a farewell note for a diary
 * @access  Private (must be logged in)
 */
router.post(
  '/:link',
  isAuthenticated,
  validateBody(createFarewellNoteSchema),
  FarewellNoteController.createNote
);

/**
 * @route   GET /api/v1/notes/:link/check
 * @desc    Check if user has written a note
 * @access  Public (optional auth)
 */
router.get('/:link/check', optionalAuth, FarewellNoteController.checkUserNote);

/**
 * @route   DELETE /api/v1/notes/:id
 * @desc    Delete a farewell note
 * @access  Private
 */
router.delete('/:id', isAuthenticated, FarewellNoteController.deleteNote);

export default router;
