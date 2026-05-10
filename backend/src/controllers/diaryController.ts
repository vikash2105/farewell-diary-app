import { Request, Response } from "express";
import { DiaryService } from "../services/diaryService";
import { FarewellNoteService } from "../services/farewellNoteService";
import { ApiError } from "../middleware/errorHandler";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class DiaryController {
  static async createDiary(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    const { title, description, settings } = req.body;

    const diary = await DiaryService.create(
      req.user.id,
      title,
      description,
      settings
    );

    res.status(201).json({
      success: true,
      data: {
        diary,
        shareableUrl: DiaryService.getShareableUrl(diary.uniqueLink),
      },
    });
  }

  static async getMyDiary(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    const diary = await DiaryService.findByUserId(req.user.id);
    if (!diary) {
      res.json({ success: true, data: null });
      return;
    }

    const noteCount = await FarewellNoteService.countByDiaryId(diary.id);

    res.json({
      success: true,
      data: {
        diary,
        noteCount,
        shareableUrl: DiaryService.getShareableUrl(diary.uniqueLink),
      },
    });
  }

  static async getUserDiaries(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    // ✅ FIXED: Return ALL user diaries (up to 4)
    const userDiaries = await DiaryService.findAllByUserId(req.user.id);
    
    if (userDiaries.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // Get note counts for all diaries
    const diariesWithCounts = await Promise.all(
      userDiaries.map(async (diary) => {
        const noteCount = await FarewellNoteService.countByDiaryId(diary.id);
        return {
          id: diary.id,
          title: diary.title,
          description: diary.description,
          contributorCount: noteCount,
          totalNotes: noteCount,
          updatedAt: diary.updatedAt,
          uniqueLink: diary.uniqueLink,
          isActive: diary.isActive,
        };
      })
    );

    res.json({
      success: true,
      data: diariesWithCounts,
    });
  }

  static async getDiaryByLinkForPublic(req: Request, res: Response): Promise<void> {
    const diary = await DiaryService.validateAccess(req.params.link);

    // Fetch owner name for trust-building context
    const [owner] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, diary.userId))
      .limit(1);

    // ✅ Return minimal data for public contributors
    // Include owner name to build trust and context
    res.json({
      success: true,
      data: {
        title: diary.title,
        description: diary.description,
        isActive: diary.isActive,
        ownerName: owner?.name || 'Someone special', // Fallback if owner not found
      },
    });
  }

  static async getMyDiaryNotes(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    let diary;
    const diaryId = req.query.diaryId as string;

    if (diaryId) {
      diary = await DiaryService.findById(diaryId);
      if (!diary || diary.userId !== req.user.id) {
        throw new ApiError(404, "Diary not found or unauthorized");
      }
    } else {
      diary = await DiaryService.findByUserId(req.user.id);
    }

    if (!diary) throw new ApiError(404, "Diary not found");

    // Pass true to decrypt content for owner
    const notes = await FarewellNoteService.getByDiaryId(diary.id, true);

    res.json({
      success: true,
      data: { notes, total: notes.length, diary },
    });
  }

  static async updateDiary(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    const diary = await DiaryService.update(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({ success: true, data: diary });
  }

  static async regenerateLink(req: Request, res: Response): Promise<void> {
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    const diary = await DiaryService.regenerateLink(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: {
        diary,
        shareableUrl: DiaryService.getShareableUrl(diary.uniqueLink),
      },
    });
  }
}
