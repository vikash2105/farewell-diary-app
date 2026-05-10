import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { diaries } from "../db/schema";
import { logger } from "../utils/logger";
import { ApiError } from "../middleware/errorHandler";
import { generateUniqueLink, generateShareableUrl } from "../utils/linkGenerator";
import { env } from "../config/env";

export class DiaryService {
  static async findById(id: string) {
    try {
      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.id, id))
        .limit(1);

      return diary ?? null;
    } catch (error) {
      logger.error("Error finding diary by ID", error);
      throw new ApiError(500, "Error retrieving diary");
    }
  }

  static async findByLink(uniqueLink: string) {
    try {
      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.uniqueLink, uniqueLink))
        .limit(1);

      return diary ?? null;
    } catch (error) {
      logger.error("Error finding diary by link", error);
      throw new ApiError(500, "Error retrieving diary");
    }
  }

  /**
   * Find all diaries by user ID (supports up to 4 diaries per user)
   */
  static async findAllByUserId(userId: string) {
    try {
      const userDiaries = await db
        .select()
        .from(diaries)
        .where(eq(diaries.userId, userId))
        .orderBy(diaries.createdAt);

      return userDiaries;
    } catch (error) {
      logger.error("Error finding diaries by user ID", error);
      throw new ApiError(500, "Error retrieving diaries");
    }
  }

  /**
   * Find single diary by user ID (legacy - for backwards compatibility)
   * Returns the FIRST diary if multiple exist
   */
  static async findByUserId(userId: string) {
    try {
      const [diary] = await db
        .select()
        .from(diaries)
        .where(eq(diaries.userId, userId))
        .limit(1);

      return diary ?? null;
    } catch (error) {
      logger.error("Error finding diary by user ID", error);
      throw new ApiError(500, "Error retrieving diary");
    }
  }

  /**
   * Count diaries for a user
   */
  static async countByUserId(userId: string): Promise<number> {
    try {
      const userDiaries = await this.findAllByUserId(userId);
      return userDiaries.length;
    } catch (error) {
      logger.error("Error counting diaries", error);
      throw new ApiError(500, "Error counting diaries");
    }
  }

  static async create(
    userId: string,
    title: string,
    description?: string,
    settings: Record<string, any> = {}
  ) {
    // ✅ NEW BUSINESS RULE: Users can create up to 4 diaries
    const existingCount = await this.countByUserId(userId);
    if (existingCount >= 4) {
      throw new ApiError(400, "Maximum diary limit reached. You can create up to 4 diaries.");
    }

    let uniqueLink = "";
    for (let i = 0; i < 10; i++) {
      uniqueLink = generateUniqueLink();
      if (!(await this.findByLink(uniqueLink))) break;
      if (i === 9) {
        throw new ApiError(500, "Failed to generate unique link");
      }
    }

    try {
      const [diary] = await db
        .insert(diaries)
        .values({
          userId,
          uniqueLink,
          title,
          description,
          settings,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      logger.info("Diary created", { diaryId: diary.id, userId, totalDiaries: existingCount + 1 });
      return diary;
    } catch (error) {
      logger.error("Error creating diary", error);
      throw new ApiError(500, "Error creating diary");
    }
  }

  static async update(
    id: string,
    userId: string,
    updates: Partial<typeof diaries.$inferInsert>
  ) {
    const [updated] = await db
      .update(diaries)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(diaries.id, id), eq(diaries.userId, userId)))
      .returning();

    if (!updated) {
      throw new ApiError(404, "Diary not found or unauthorized");
    }

    return updated;
  }

  static async delete(id: string, userId: string): Promise<void> {
    try {
      const deleted = await db
        .delete(diaries)
        .where(and(eq(diaries.id, id), eq(diaries.userId, userId)))
        .returning({ id: diaries.id });

      if (!deleted.length) {
        throw new ApiError(404, "Diary not found or unauthorized");
      }

      logger.info("Diary deleted", { diaryId: id, userId });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error("Error deleting diary", error);
      throw new ApiError(500, "Error deleting diary");
    }
  }

  static async validateAccess(uniqueLink: string) {
    const diary = await this.findByLink(uniqueLink);

    if (!diary) {
      throw new ApiError(404, "Diary not found");
    }

    if (!diary.isActive) {
      throw new ApiError(403, "Diary is inactive");
    }

    return diary;
  }

  static getShareableUrl(uniqueLink: string): string {
    return generateShareableUrl(uniqueLink, env.FRONTEND_URL);
  }

  static async deactivate(id: string, userId: string): Promise<void> {
    await this.update(id, userId, { isActive: false });
  }

  static async regenerateLink(id: string, userId: string) {
    let uniqueLink = "";

    for (let i = 0; i < 10; i++) {
      uniqueLink = generateUniqueLink();
      if (!(await this.findByLink(uniqueLink))) break;
      if (i === 9) {
        throw new ApiError(500, "Failed to generate unique link");
      }
    }

    return this.update(id, userId, { uniqueLink });
  }
}
