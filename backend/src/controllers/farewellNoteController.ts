import { Request, Response } from "express";
import { FarewellNoteService } from "../services/farewellNoteService";
import { DiaryService } from "../services/diaryService";
import { ApiError } from "../middleware/errorHandler";

export class FarewellNoteController {
  static async createNote(req: Request, res: Response): Promise<void> {
    const diary = await DiaryService.validateAccess(req.params.link);

    let authorId: string | null = null;
    let authorName: string;
    let authorEmail: string | null = null;
    let isAnonymous = false;

    if (req.user) {
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

      authorId = req.user.id;
      authorName = req.user.name;
      authorEmail = req.user.email;
      // Allow authenticated users to choose to be displayed as anonymous
      isAnonymous = !!req.body.isAnonymous;
    } else {
      // Unauthenticated / Anonymous contribution
      if (!req.body.authorName || req.body.authorName.trim().length === 0) {
        throw new ApiError(400, "Name is required for guest contributions");
      }
      authorName = req.body.authorName;
      // For unauthenticated users, we don't have an ID or email
      authorId = null;
      authorEmail = null;
      // They are technically anonymous in terms of account linking,
      // but they provided a display name.
      // logic: isAnonymous flag usually means "hide my name".
      // But here, for unauthenticated users, they provide a name to be shown.
      // So isAnonymous should be false (because we want to show the provided name).
      // Unless they explicitly checked "Stay Anonymous" (if we add that feature).
      // For now, let's assume if they provide a name, they want it shown.
      isAnonymous = !!req.body.isAnonymous;
    }

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
