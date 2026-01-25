import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import { farewellNotes, FarewellNote, diaries } from '../db/schema';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';
import { encrypt, decrypt } from '../utils/encryption';

export class FarewellNoteService {
  /**
   * Create a new farewell note
   */
  static async create(
    diaryId: string,
    authorId: string | null,
    authorName: string,
    authorEmail: string,
    content: string,
    fontStyle: string = 'default',
    isAnonymous: boolean = false
  ): Promise<FarewellNote> {
    try {
      const encryptedContent = encrypt(content);

      const [newNote] = await db
        .insert(farewellNotes)
        .values({
          diaryId,
          authorId,
          authorName: isAnonymous ? 'Anonymous' : authorName,
          authorEmail,
          encryptedContent,
          fontStyle,
          isAnonymous,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      logger.info('New farewell note created', {
        noteId: newNote.id,
        diaryId,
        isAnonymous,
      });

      return newNote;
    } catch (error) {
      logger.error('Error creating farewell note:', error);
      throw new ApiError(500, 'Error creating note');
    }
  }

  /**
   * Get all notes for a diary (decrypted)
   */
  static async getByDiaryId(
    diaryId: string
  ): Promise<Array<FarewellNote & { content: string }>> {
    try {
      const notes = await db
        .select()
        .from(farewellNotes)
        .where(eq(farewellNotes.diaryId, diaryId))
        .orderBy(desc(farewellNotes.createdAt));

      return notes.map((note) => ({
        ...note,
        content: decrypt(note.encryptedContent),
      }));
    } catch (error) {
      logger.error('Error retrieving farewell notes:', error);
      throw new ApiError(500, 'Error retrieving notes');
    }
  }

  /**
   * Count notes for a diary
   */
  static async countByDiaryId(diaryId: string): Promise<number> {
    try {
      const notes = await db
        .select()
        .from(farewellNotes)
        .where(eq(farewellNotes.diaryId, diaryId));

      return notes.length;
    } catch (error) {
      logger.error('Error counting notes:', error);
      throw new ApiError(500, 'Error counting notes');
    }
  }

  /**
   * Delete a note (author OR diary owner)
   */
  static async delete(noteId: string, userId: string): Promise<void> {
    try {
      const [note] = await db
        .select()
        .from(farewellNotes)
        .where(eq(farewellNotes.id, noteId))
        .limit(1);

      if (!note) throw new ApiError(404, 'Note not found');

      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.id, note.diaryId))
        .limit(1);

      if (!diary) throw new ApiError(404, 'Diary not found');

      const isAuthor = note.authorId === userId;
      const isOwner = diary.userId === userId;

      if (!isAuthor && !isOwner) {
        throw new ApiError(403, 'Not allowed to delete this note');
      }

      await db.delete(farewellNotes).where(eq(farewellNotes.id, noteId));

      logger.info('Farewell note deleted', {
        noteId,
        deletedBy: userId,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error deleting note:', error);
      throw new ApiError(500, 'Error deleting note');
    }
  }

  /**
   * Check if user already wrote a note
   */
  static async hasUserWrittenNote(
    diaryId: string,
    authorEmail: string
  ): Promise<boolean> {
    try {
      const [note] = await db
        .select()
        .from(farewellNotes)
        .where(
          and(
            eq(farewellNotes.diaryId, diaryId),
            eq(farewellNotes.authorEmail, authorEmail)
          )
        )
        .limit(1);

      return !!note;
    } catch (error) {
      logger.error('Error checking user note:', error);
      return false;
    }
  }
}
