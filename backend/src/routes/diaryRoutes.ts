import { Router } from 'express';
import { DiaryController } from '../controllers/diaryController';
import { isAuthenticated } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validator';
import { createDiarySchema, uuidSchema } from '../utils/validation';
import { sanitizeInput } from '../middleware/sanitize';
import { limitRequestSize, LIMITS } from '../middleware/requestSizeLimit';
import { z } from 'zod';

const router = Router();

/**
 * @route   POST /api/v1/diary
 * @desc    Create a new diary
 * @access  Private
 * 
 * UPDATED: Added sanitization and request size limit
 */
router.post(
  '/',
  isAuthenticated,
  limitRequestSize(LIMITS.DIARY),
  sanitizeInput,
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
 * @route   GET /api/v1/diaries
 * @desc    Get all diaries for current user (for dashboard)
 * @access  Private
 */
router.get('/', isAuthenticated, DiaryController.getUserDiaries);

/**
 * @route   GET /api/v1/diary/me/notes
 * @desc    Get all notes for current user's diary
 * @access  Private
 */
router.get('/me/notes', isAuthenticated, DiaryController.getMyDiaryNotes);

/**
 * @route   GET /api/v1/diary/:link
 * @desc    Get diary info for public contributors (write-only view)
 * @access  Public
 * 
 * UPDATED: Now returns minimal data only (title, description)
 * Does NOT return: id, uniqueLink, settings, userId
 */
router.get('/:link', DiaryController.getDiaryByLinkForPublic);

/**
 * @route   PUT /api/v1/diary/:id
 * @desc    Update diary
 * @access  Private
 * 
 * UPDATED: Added sanitization and request size limit
 */
router.put(
  '/:id',
  isAuthenticated,
  limitRequestSize(LIMITS.DIARY),
  sanitizeInput,
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
 * @route   DELETE /api/v1/diary/:id
 * @desc    Permanently delete a diary owned by the current user
 * @access  Private
 *
 * Notes are deleted by the database foreign key cascade.
 */
router.delete(
  '/:id',
  isAuthenticated,
  validateParams(z.object({ id: uuidSchema })),
  DiaryController.deleteDiary
);

/**
 * @route   POST /api/v1/diary/:id/regenerate-link
 * @desc    Regenerate unique link for diary
 * @access  Private
 */
router.post('/:id/regenerate-link', isAuthenticated, DiaryController.regenerateLink);

export default router;
