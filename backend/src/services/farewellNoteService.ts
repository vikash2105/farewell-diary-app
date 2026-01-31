import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { farewellNotes } from "../db/schema";
import { ApiError } from "../middleware/errorHandler";
import { encrypt, decrypt } from "../utils/encryption";

export class FarewellNoteService {
  // 🔐 OWNER ACCESS — DECRYPT CONTENT
  static async getByDiaryId(diaryId: string, isOwner = false) {
    const notes = await db
      .select()
      .from(farewellNotes)
      .where(eq(farewellNotes.diaryId, diaryId));

    if (!isOwner) {
      // Public viewers never see content
      return notes.map(({ encryptedContent, ...rest }) => rest);
    }

    // Owner sees decrypted content
    return notes.map((note) => ({
      ...note,
      content: decrypt(note.encryptedContent),
    }));
  }

  static async countByDiaryId(diaryId: string): Promise<number> {
    const notes = await db
      .select({ id: farewellNotes.id })
      .from(farewellNotes)
      .where(eq(farewellNotes.diaryId, diaryId));

    return notes.length;
  }

  static async hasUserWrittenNote(diaryId: string, authorEmail?: string) {
    if (!authorEmail) return false;

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
    authorId: string | null | undefined,
    authorName: string,
    authorEmail: string | null | undefined,
    content: string,
    fontStyle?: string,
    isAnonymous?: boolean
  ) {
    if (!content || !content.trim()) {
      throw new ApiError(400, "Note content cannot be empty");
    }

    const encrypted = encrypt(content);

    const [note] = await db
      .insert(farewellNotes)
      .values({
        diaryId,
        authorId: authorId ?? null,
        authorName,
        authorEmail: authorEmail ?? null,
        encryptedContent: encrypted, // 🔐 FIXED
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
