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

  static async create(
    userId: string,
    title: string,
    description?: string,
    settings: Record<string, any> = {}
  ) {
    const existing = await this.findByUserId(userId);
    if (existing) {
      throw new ApiError(400, "User already has a diary");
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

      logger.info("Diary created", { diaryId: diary.id, userId });
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
