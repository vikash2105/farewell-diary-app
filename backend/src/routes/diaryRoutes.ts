import { Router } from 'express';
import { DiaryController } from '../controllers/diaryController';
import { isAuthenticated, optionalAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { createDiarySchema } from '../utils/validation';
import { z } from 'zod';

const router = Router();

/**
 * @route   POST /api/v1/diary
 * @desc    Create a new diary
 * @access  Private
 */
router.post(
  '/',
  isAuthenticated,
  validateBody(createDiarySchema),
  DiaryController.createDiary
);

/**
 * @route   GET /api/v1/diary/me
 * @desc    Get current user's diary
 * @access  Private
 */
router.get('/me', isAuthenticated, DiaryController.getMyDiary);

/**
 * @route   GET /api/v1/diary/me/notes
 * @desc    Get all notes for current user's diary
 * @access  Private
 */
router.get('/me/notes', isAuthenticated, DiaryController.getMyDiaryNotes);

/**
 * @route   GET /api/v1/diary/:link
 * @desc    Get diary by unique link
 * @access  Public
 */
router.get('/:link', optionalAuth, DiaryController.getDiaryByLink);

/**
 * @route   PUT /api/v1/diary/:id
 * @desc    Update diary
 * @access  Private
 */
router.put(
  '/:id',
  isAuthenticated,
  validateBody(
    z.object({
      title: z.string().min(3).max(255).optional(),
      description: z.string().max(1000).optional(),
      settings: z.object({}).optional(),
    })
  ),
  DiaryController.updateDiary
);

/**
 * @route   POST /api/v1/diary/:id/regenerate-link
 * @desc    Regenerate unique link for diary
 * @access  Private
 */
router.post('/:id/regenerate-link', isAuthenticated, DiaryController.regenerateLink);

export default router;
