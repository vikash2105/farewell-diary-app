import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { farewellNotes } from "../db/schema";
import { ApiError } from "../middleware/errorHandler";

export class FarewellNoteService {
  static async getByDiaryId(diaryId: string) {
    return db
      .select()
      .from(farewellNotes)
      .where(eq(farewellNotes.diaryId, diaryId));
  }

  static async countByDiaryId(diaryId: string): Promise<number> {
    const notes = await db
      .select({ id: farewellNotes.id })
      .from(farewellNotes)
      .where(eq(farewellNotes.diaryId, diaryId));

    return notes.length;
  }

  static async hasUserWrittenNote(diaryId: string, authorEmail: string) {
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
  }

  static async create(
    diaryId: string,
    authorId: string,
    authorName: string,
    authorEmail: string,
    content: string,
    fontStyle?: string,
    isAnonymous?: boolean
  ) {
    if (!content || !content.trim()) {
      throw new ApiError(400, "Note content cannot be empty");
    }

    const [note] = await db
      .insert(farewellNotes)
      .values({
        diaryId,
        authorId,
        authorName,
        authorEmail,
        encryptedContent: content,
        fontStyle: fontStyle ?? "default",
        isAnonymous: !!isAnonymous,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return note;
  }

  static async delete(noteId: string, userId: string): Promise<void> {
    const deleted = await db
      .delete(farewellNotes)
      .where(
        and(
          eq(farewellNotes.id, noteId),
          eq(farewellNotes.authorId, userId)
        )
      )
      .returning();

    if (!deleted.length) {
      throw new ApiError(404, "Note not found or unauthorized");
    }
  }
}
