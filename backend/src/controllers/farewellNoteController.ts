import { Request, Response } from 'express';
import { FarewellNoteService } from '../services/farewellNoteService';
import { DiaryService } from '../services/diaryService';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';

export class FarewellNoteController {
  /**
   * Create a farewell note for a diary
   */
  static async createNote(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required to write a note');
      }

      const { link } = req.params;
      const { content, fontStyle, isAnonymous } = req.body;

      const diary = await DiaryService.validateAccess(link);

      // Prevent diary owner from writing to their own diary
      if (diary.userId === req.user.id) {
        throw new ApiError(403, 'You cannot write a note to your own diary');
      }

      const hasWritten = await FarewellNoteService.hasUserWrittenNote(
        diary.id,
        req.user.email
      );

      if (hasWritten) {
        throw new ApiError(400, 'You have already written a note to this diary');
      }

      const note = await FarewellNoteService.create(
        diary.id,
        req.user.id,
        req.user.name,
        req.user.email,
        content,
        fontStyle,
        isAnonymous
      );

      res.status(201).json({
        success: true,
        data: {
          id: note.id,
          message: 'Your farewell note has been saved successfully',
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error creating note:', error);
        res.status(500).json({
          success: false,
          error: 'Error saving your note',
        });
      }
    }
  }

  /**
   * Check if current user has written a note
   */
  static async checkUserNote(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.json({
          success: true,
          data: { hasWritten: false, isOwner: false },
        });
        return;
      }

      const { link } = req.params;

      const diary = await DiaryService.findByLink(link);
      if (!diary) {
        throw new ApiError(404, 'Diary not found');
      }

      const hasWritten = await FarewellNoteService.hasUserWrittenNote(
        diary.id,
        req.user.email
      );

      res.json({
        success: true,
        data: {
          hasWritten,
          isOwner: diary.userId === req.user.id,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error checking user note:', error);
        res.status(500).json({
          success: false,
          error: 'Error checking note status',
        });
      }
    }
  }

  /**
   * Delete a note (author only)
   */
  static async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const { id } = req.params;

      await FarewellNoteService.delete(id, req.user.id);

      res.json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        logger.error('Error deleting note:', error);
        res.status(500).json({
          success: false,
          error: 'Error deleting note',
        });
      }
    }
  }
}
