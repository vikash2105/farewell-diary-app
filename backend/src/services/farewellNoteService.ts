import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import { farewellNotes, diaries, FarewellNote, NewFarewellNote } from '../db/schema';
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
      // Encrypt the content before storing
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

      logger.info('New farewell note created:', {
        noteId: newNote.id,
        diaryId,
        isAnonymous,
        // Do NOT log authorEmail or other PII
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
  static async getByDiaryId(diaryId: string): Promise<Array<FarewellNote & { content: string }>> {
    try {
      const notes = await db
        .select()
        .from(farewellNotes)
        .where(eq(farewellNotes.diaryId, diaryId))
        .orderBy(desc(farewellNotes.createdAt));

      // Decrypt content for each note
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
   * Get a single note by ID (decrypted)
   */
  static async getById(noteId: string): Promise<(FarewellNote & { content: string }) | null> {
    try {
      const [note] = await db
        .select()
        .from(farewellNotes)
        .where(eq(farewellNotes.id, noteId))
        .limit(1);

      if (!note) return null;

      return {
        ...note,
        content: decrypt(note.encryptedContent),
      };
    } catch (error) {
      logger.error('Error retrieving farewell note:', error);
      throw new ApiError(500, 'Error retrieving note');
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
   * Delete a note (author OR diary owner can delete)
   * 
   * FIXED: Now allows both note author AND diary owner to delete notes
   * This gives diary owners moderation capabilities
   */
  static async delete(noteId: string, userId: string): Promise<void> {
    try {
      // First, get the note to check permissions
      const [note] = await db
        .select()
        .from(farewellNotes)
        .where(eq(farewellNotes.id, noteId))
        .limit(1);

      if (!note) {
        throw new ApiError(404, 'Note not found');
      }

      // Get the diary to check if user is the owner
      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.id, note.diaryId))
        .limit(1);

      if (!diary) {
        throw new ApiError(404, 'Associated diary not found');
      }

      // Allow deletion if user is either the note author OR the diary owner
      const isAuthor = note.authorId === userId;
      const isOwner = diary.userId === userId;

      if (!isAuthor && !isOwner) {
        throw new ApiError(
          403,
          'You can only delete your own notes or notes in your diary'
        );
      }

      // Perform the deletion
      await db
        .delete(farewellNotes)
        .where(eq(farewellNotes.id, noteId));

      logger.info('Farewell note deleted:', {
        noteId,
        deletedBy: userId,
        deletedByOwner: isOwner,
        deletedByAuthor: isAuthor,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error deleting note:', error);
      throw new ApiError(500, 'Error deleting note');
    }
  }

  /**
   * Check if user has already written a note for this diary
   */
  static async hasUserWrittenNote(diaryId: string, authorEmail: string): Promise<boolean> {
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
