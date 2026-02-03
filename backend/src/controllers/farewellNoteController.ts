// backend/src/controllers/farewellNoteController.ts
import { Request, Response } from "express";
import { FarewellNoteService } from "../services/farewellNoteService";
import { DiaryService } from "../services/diaryService";
import { ApiError } from "../middleware/errorHandler";

export class FarewellNoteController {
  static async createNote(req: Request, res: Response): Promise<void> {
    // ✅ FIXED: Now requires authentication - validated by middleware
    if (!req.user || !req.user.id) {
      throw new ApiError(401, "Authentication required to submit a note");
    }

    const diary = await DiaryService.validateAccess(req.params.link);

    // Prevent users from writing notes to their own diary
    if (diary.userId === req.user.id) {
      throw new ApiError(403, "Cannot write note to your own diary");
    }

    // Check if user has already written a note for this diary
    if (
      await FarewellNoteService.hasUserWrittenNote(
        diary.id,
        req.user.email
      )
    ) {
      throw new ApiError(400, "You already submitted a note");
    }

    // ✅ SIMPLIFIED: Only authenticated users can submit notes
    const authorId = req.user.id;
    const authorName = req.user.name;
    const authorEmail = req.user.email;
    const isAnonymous = !!req.body.isAnonymous;

    const note = await FarewellNoteService.create(
      diary.id,
      authorId,
      authorName,
      authorEmail,
      req.body.content,
      req.body.fontStyle,
      isAnonymous
    );

    res.status(201).json({
      success: true,
      data: { id: note.id },
      message: "Farewell note submitted successfully"
    });
  }

  static async checkUserNote(req: Request, res: Response): Promise<void> {
    const diary = await DiaryService.findByLink(req.params.link);
    if (!diary) throw new ApiError(404, "Diary not found");

    const hasWritten = (req.user && req.user.id)
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
    if (!req.user || !req.user.id) throw new ApiError(401, "Authentication required");

    await FarewellNoteService.delete(req.params.id, req.user.id);

    res.json({ success: true, message: "Note deleted" });
  }
}
