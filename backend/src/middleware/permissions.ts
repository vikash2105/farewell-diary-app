/**
 * Permission Middleware
 * Verifies user has permission to access specific resources
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { diaries, farewellNotes } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Extend Request type to include diary and permissions
 */
declare global {
  namespace Express {
    interface Request {
      diary?: any;
      permissions?: {
        isOwner: boolean;
        isContributor?: boolean;
      };
    }
  }
}

/**
 * Verify user owns the diary
 * Use this middleware on routes where only the diary owner should have access
 */
export const verifyDiaryOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { diaryId } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const diary = await db
      .select()
      .from(diaries)
      .where(and(
        eq(diaries.id, diaryId),
        eq(diaries.userId, userId)
      ))
      .limit(1);

    if (!diary.length) {
      res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not own this diary'
      });
      return;
    }

    req.diary = diary[0];
    req.permissions = { isOwner: true };
    next();
  } catch (error) {
    console.error('Error verifying diary owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Verify user can access diary (owner or contributor)
 * Use this on routes where both owners and contributors should have access
 */
export const verifyDiaryAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { uniqueLink } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    // Get diary by unique link
    const diary = await db
      .select()
      .from(diaries)
      .where(eq(diaries.uniqueLink, uniqueLink))
      .limit(1);

    if (!diary.length) {
      res.status(404).json({ error: 'Diary not found' });
      return;
    }

    const isOwner = diary[0].userId === userId;

    // Check if user is a contributor
    const contribution = await db
      .select()
      .from(farewellNotes)
      .where(and(
        eq(farewellNotes.diaryId, diary[0].id),
        eq(farewellNotes.authorId, userId)
      ))
      .limit(1);

    const isContributor = contribution.length > 0;

    if (!isOwner && !isContributor) {
      res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this diary'
      });
      return;
    }

    req.diary = diary[0];
    req.permissions = { isOwner, isContributor };
    next();
  } catch (error) {
    console.error('Error verifying diary access:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Verify user can write to diary
 * Checks if diary is active and user hasn't exceeded note limit
 */
export const verifyCanWrite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { diaryId } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    // Check if diary exists and is active
    const diary = await db
      .select()
      .from(diaries)
      .where(eq(diaries.id, diaryId))
      .limit(1);

    if (!diary.length || !diary[0].isActive) {
      res.status(404).json({ 
        error: 'Diary not found or inactive',
        message: 'This diary is not accepting new notes'
      });
      return;
    }

    // Check if user has reached note limit (max 50 notes per user per diary)
    const noteCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(farewellNotes)
      .where(and(
        eq(farewellNotes.diaryId, diaryId),
        eq(farewellNotes.authorId, userId)
      ));

    if (noteCount[0].count >= 50) {
      res.status(429).json({ 
        error: 'Note limit reached',
        message: 'You have reached the maximum number of notes for this diary'
      });
      return;
    }

    req.diary = diary[0];
    next();
  } catch (error) {
    console.error('Error verifying write permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
