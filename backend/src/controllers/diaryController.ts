import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DiaryService } from '../services/diaryService';
import { FarewellNoteService } from '../services/farewellNoteService';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';

export class DiaryController {
  /**
   * Create a new diary for the authenticated user
   */
  static async createDiary(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const { title, description, settings } = req.body;

      const diary = await DiaryService.create(
        req.user.id,
        title,
        description,
        settings
      );

      const shareableUrl = DiaryService.getShareableUrl(diary.uniqueLink);

      res.status(201).json({
        success: true,
        data: {
          diary,
          shareableUrl,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error creating diary:', error);
        res.status(500).json({
          success: false,
          error: 'Error creating diary',
        });
      }
    }
  }

  /**
   * Get the authenticated user's diary
   */
  static async getMyDiary(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const diary = await DiaryService.findByUserId(req.user.id);

      if (!diary) {
        res.json({
          success: true,
          data: null,
        });
        return;
      }

      const noteCount = await FarewellNoteService.countByDiaryId(diary.id);
      const shareableUrl = DiaryService.getShareableUrl(diary.uniqueLink);

      res.json({
        success: true,
        data: {
          diary,
          noteCount,
          shareableUrl,
        },
      });
    } catch (error) {
      logger.error('Error getting diary:', error);
      res.status(500).json({
        success: false,
        error: 'Error retrieving diary',
      });
    }
  }

  /**
   * Get diary by unique link (public access)
   */
  static async getDiaryByLink(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { link } = req.params;

      const diary = await DiaryService.validateAccess(link);

      // Don't include sensitive information for public access
      res.json({
        success: true,
        data: {
          id: diary.id,
          title: diary.title,
          description: diary.description,
          settings: diary.settings,
          uniqueLink: diary.uniqueLink,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error getting diary by link:', error);
        res.status(500).json({
          success: false,
          error: 'Error retrieving diary',
        });
      }
    }
  }

  /**
   * Get all notes for the authenticated user's diary
   */
  static async getMyDiaryNotes(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const diary = await DiaryService.findByUserId(req.user.id);

      if (!diary) {
        throw new ApiError(404, 'Diary not found');
      }

      const notes = await FarewellNoteService.getByDiaryId(diary.id);

      res.json({
        success: true,
        data: {
          notes,
          total: notes.length,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error getting diary notes:', error);
        res.status(500).json({
          success: false,
          error: 'Error retrieving notes',
        });
      }
    }
  }

  /**
   * Update diary information
   */
  static async updateDiary(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const { id } = req.params;
      const { title, description, settings } = req.body;

      const updatedDiary = await DiaryService.update(req.user.id, id, {
        title,
        description,
        settings,
      });

      res.json({
        success: true,
        data: updatedDiary,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error updating diary:', error);
        res.status(500).json({
          success: false,
          error: 'Error updating diary',
        });
      }
    }
  }

  /**
   * Regenerate unique link for diary
   */
  static async regenerateLink(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const { id } = req.params;

      const diary = await DiaryService.regenerateLink(id, req.user.id);
      const shareableUrl = DiaryService.getShareableUrl(diary.uniqueLink);

      res.json({
        success: true,
        data: {
          diary,
          shareableUrl,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error regenerating link:', error);
        res.status(500).json({
          success: false,
          error: 'Error regenerating link',
        });
      }
    }
  }
}
