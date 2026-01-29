import { Request, Response } from "express";
import { FarewellNoteService } from "../services/farewellNoteService";
import { DiaryService } from "../services/diaryService";
import { logger } from "../utils/logger";
import { ApiError } from "../middleware/errorHandler";

export class FarewellNoteController {
  static async createNote(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Authentication required");

    const diary = await DiaryService.validateAccess(req.params.link);

    if (diary.userId === req.user.id) {
      throw new ApiError(403, "Cannot write note to your own diary");
    }

    if (
      await FarewellNoteService.hasUserWrittenNote(
        diary.id,
        req.user.email
      )
    ) {
      throw new ApiError(400, "You already submitted a note");
    }

    const note = await FarewellNoteService.create(
      diary.id,
      req.user.id,
      req.user.name,
      req.user.email,
      req.body.content,
      req.body.fontStyle,
      req.body.isAnonymous
    );

    res.status(201).json({
      success: true,
      data: { id: note.id },
    });
  }

  static async checkUserNote(req: Request, res: Response): Promise<void> {
    const diary = await DiaryService.findByLink(req.params.link);
    if (!diary) throw new ApiError(404, "Diary not found");

    const hasWritten = req.user
      ? await FarewellNoteService.hasUserWrittenNote(
          diary.id,
          req.user.email
        )
      : false;

    res.json({
      success: true,
      data: {
        hasWritten,
        isOwner: req.user?.id === diary.userId,
      },
    });
  }

  static async deleteNote(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new ApiError(401, "Authentication required");

    await FarewellNoteService.delete(req.params.id, req.user.id);

    res.json({ success: true, message: "Note deleted" });
  }
}
