import { Request, Response } from "express";
import { DiaryService } from "../services/diaryService";
import { FarewellNoteService } from "../services/farewellNoteService";
import { ApiError } from "../middleware/errorHandler";

export class DiaryController {
  static async createDiary(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Authentication required");

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
    if (!req.user) throw new ApiError(401, "Authentication required");

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

  static async getDiaryByLinkForPublic(req: Request, res: Response): Promise<void> {
    const diary = await DiaryService.validateAccess(req.params.link);

    // 🔐 DO NOT expose diary content
    res.json({
      success: true,
      data: {
        isActive: diary.isActive,
      },
    });
  }

  static async getMyDiaryNotes(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const diary = await DiaryService.findByUserId(req.user.id);
    if (!diary) throw new ApiError(404, "Diary not found");

    const notes = await FarewellNoteService.getByDiaryId(diary.id);

    res.json({
      success: true,
      data: { notes, total: notes.length },
    });
  }

  static async updateDiary(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const diary = await DiaryService.update(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({ success: true, data: diary });
  }

  static async regenerateLink(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Authentication required");

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
