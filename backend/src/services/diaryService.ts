import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { diaries, Diary, NewDiary } from '../db/schema';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';
import { generateUniqueLink, generateShareableUrl } from '../utils/linkGenerator';

export class DiaryService {
  /**
   * Find diary by ID
   */
  static async findById(id: string): Promise<Diary | null> {
    try {
      const [diary] = await db.select().from(diaries).where(eq(diaries.id, id)).limit(1);
      return diary || null;
    } catch (error) {
      logger.error('Error finding diary by ID:', error);
      throw new ApiError(500, 'Error retrieving diary');
    }
  }

  /**
   * Find diary by unique link
   */
  static async findByLink(uniqueLink: string): Promise<Diary | null> {
    try {
      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.uniqueLink, uniqueLink))
        .limit(1);
      return diary || null;
    } catch (error) {
      logger.error('Error finding diary by link:', error);
      throw new ApiError(500, 'Error retrieving diary');
    }
  }

  /**
   * Find diary by user ID
   */
  static async findByUserId(userId: string): Promise<Diary | null> {
    try {
      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.userId, userId))
        .limit(1);
      return diary || null;
    } catch (error) {
      logger.error('Error finding diary by user ID:', error);
      throw new ApiError(500, 'Error retrieving diary');
    }
  }

  /**
   * Create a new diary for a user
   */
  static async create(
    userId: string,
    title: string,
    description?: string,
    settings?: any
  ): Promise<Diary> {
    try {
      // Check if user already has a diary
      const existingDiary = await this.findByUserId(userId);
      if (existingDiary) {
        throw new ApiError(400, 'User already has a diary');
      }

      // Generate unique link
      let uniqueLink = generateUniqueLink();
      let attempts = 0;
      const maxAttempts = 10;

      // Ensure the link is truly unique
      while (attempts < maxAttempts) {
        const existing = await this.findByLink(uniqueLink);
        if (!existing) break;
        uniqueLink = generateUniqueLink();
        attempts++;
      }

      if (attempts === maxAttempts) {
        throw new ApiError(500, 'Failed to generate unique link');
      }

      // Create diary
      const [newDiary] = await db
        .insert(diaries)
        .values({
          userId,
          uniqueLink,
          title,
          description,
          settings: settings || {},
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      logger.info('New diary created:', {
        diaryId: newDiary.id,
        userId,
        uniqueLink,
      });

      return newDiary;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating diary:', error);
      throw new ApiError(500, 'Error creating diary');
    }
  }

  /**
   * Update diary information
   */
  static async update(
    id: string,
    userId: string,
    updates: Partial<Diary>
  ): Promise<Diary> {
    try {
      const [updatedDiary] = await db
        .update(diaries)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(and(eq(diaries.id, id), eq(diaries.userId, userId)))
        .returning();

      if (!updatedDiary) {
        throw new ApiError(404, 'Diary not found or unauthorized');
      }

      logger.info('Diary updated:', { diaryId: id });
      return updatedDiary;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating diary:', error);
      throw new ApiError(500, 'Error updating diary');
    }
  }

  /**
   * Get shareable URL for a diary
   */
  static getShareableUrl(uniqueLink: string): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return generateShareableUrl(uniqueLink, frontendUrl);
  }

  /**
   * Validate diary access
   */
  static async validateAccess(uniqueLink: string): Promise<Diary> {
    const diary = await this.findByLink(uniqueLink);

    if (!diary) {
      throw new ApiError(404, 'Diary not found');
    }

    if (!diary.isActive) {
      throw new ApiError(403, 'This diary is no longer active');
    }

    return diary;
  }

  /**
   * Deactivate diary
   */
  static async deactivate(id: string, userId: string): Promise<void> {
    try {
      await this.update(id, userId, { isActive: false });
      logger.info('Diary deactivated:', { diaryId: id });
    } catch (error) {
      logger.error('Error deactivating diary:', error);
      throw new ApiError(500, 'Error deactivating diary');
    }
  }

  /**
   * Regenerate unique link for a diary
   */
  static async regenerateLink(id: string, userId: string): Promise<Diary> {
    try {
      let uniqueLink = generateUniqueLink();
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const existing = await this.findByLink(uniqueLink);
        if (!existing) break;
        uniqueLink = generateUniqueLink();
        attempts++;
      }

      if (attempts === maxAttempts) {
        throw new ApiError(500, 'Failed to generate unique link');
      }

      return await this.update(id, userId, { uniqueLink });
    } catch (error) {
      logger.error('Error regenerating diary link:', error);
      throw new ApiError(500, 'Error regenerating link');
    }
  }
}
