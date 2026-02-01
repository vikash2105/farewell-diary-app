import { Request, Response } from "express";
import { FarewellNoteService } from "../services/farewellNoteService";
import { DiaryService } from "../services/diaryService";
import { ApiError } from "../middleware/errorHandler";

export class FarewellNoteController {
  static async createNote(req: Request, res: Response): Promise<void> {
    const diary = await DiaryService.validateAccess(req.params.link);
    const user = req.user;

    let authorId: string | null = null;
    let authorName: string;
    let authorEmail: string | null = null;

    if (user) {
      // Authenticated User
      if (diary.userId === user.id) {
        throw new ApiError(403, "Cannot write note to your own diary");
      }

      if (
        await FarewellNoteService.hasUserWrittenNote(
          diary.id,
          user.email
        )
      ) {
        throw new ApiError(400, "You already submitted a note");
      }

      authorId = user.id;
      authorName = user.name;
      authorEmail = user.email;
    } else {
      // Anonymous / Guest User
      authorName = req.body.authorName;
      if (!authorName || authorName.trim().length < 2) {
        throw new ApiError(400, "Please provide your name to submit a note");
      }
    }

    const note = await FarewellNoteService.create(
      diary.id,
      authorId,
      authorName,
      authorEmail,
      req.body.content,
      req.body.fontStyle,
      false // FORCE NON-ANONYMOUS
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
