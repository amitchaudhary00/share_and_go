import { NOTES_EXPIRY_MS } from "../../config/enum.mjs";
import logger from "../../config/logger.mjs";
import models from "../../db/index.db.mjs";
import { ApiError } from "../../utils/errorHandler.mjs";
import { randomBytes } from "crypto";
import { sanitizeNoteContent } from "../../utils/sanitizeNoteContent.mjs";

export class NoteService {
  #Notes;
  constructor() {
    this.#Notes = models.notes;
  }

  create = async ({
    userId,
    guestId,
    content,
    title = new Date().toLocaleDateString(),
  }) => {
    const cleanContent = sanitizeNoteContent(content);
    if (!userId && !guestId) {
      logger.error("Guest user id and User id not found to create notes.");
      throw ApiError.unAuthorized("You Are Unauthorized");
    }
    const note = await this.#Notes.create({
      user: userId || null,
      guestId: userId ? null : guestId,
      title,
      content: cleanContent,
    });

    return note;
  };

  share = async ({ userId, guestId, noteId, expiryChoice }) => {
    if (!userId && !guestId) {
      logger.error("Guest user id and User id not found to share notes.");
      throw ApiError.unAuthorized("You Are Unauthorized");
    }
    if (noteId) {
      logger.error("Notes id not found to share notes.");
      throw ApiError.badRequest("Notes id is required");
    }

    const shareToken = randomBytes(16).toString("hex");
    const durationMs = NOTES_EXPIRY_MS[expiryChoice] ?? null;
    const expiresAt = durationMs ? new Date(Date.now() + durationMs) : null;
    const filter = userId ? { _id: noteId, user: userId } : { _id: noteId, guestId };
    const note = await this.#Notes.find(filter);
    if (!note) {
      logger.error("Note not found to share.");
      throw ApiError.notFound("Note doesn't exist.");
    }
    note.shareToken = shareToken;
    note.expiresAt = expiresAt;
    await note.save();
    return note;
  };

  getById = async (noteId, { userId, guestId }) => {
    if (!userId && !guestId) {
      logger.error("Guest user id and User id not found to find notes.");
      throw ApiError.unAuthorized("You Are Unauthorized");
    }
    if (!noteId) {
      logger.error("Notes id not found to find notes.");
      throw ApiError.badRequest("Notes id is required");
    }
    const filter = userId ? { _id: noteId, user: userId } : { _id: noteId, guestId };

    const note = await this.#Notes.findOne(filter);
    if (!note) {
      logger.error("Note not found.");
      throw ApiError.notFound("Note doesn't exist.");
    }
    return note;
  };

  getByShareToken = async (shareToken) => {
    const note = this.#Notes.findOne({ shareToken });
    if (!note) {
      logger.error("Note not found.");
      throw ApiError.notFound("Note doesn't exist.");
    }
    return note;
  };

  getAllForOwner = async ({ userId, guestId }) => {
    const filter = userId ? { user: userId } : { guestId };
    return this.#Notes.find(filter).sort({ createdAt: -1 });
  };

  deleteById = async (noteId, { userId, guestId }) => {
    if (!userId && !guestId) {
      logger.error("Guest user id and User id not found to delete notes.");
      throw ApiError.unAuthorized("You Are Unauthorized");
    }
    if (!noteId) {
      logger.error("Notes id not found to delete notes.");
      throw ApiError.badRequest("Notes id is required");
    }
    const filter = userId ? { _id: noteId, user: userId } : { _id: noteId, guestId };

    const note = await this.#Notes.findOne(filter);
    if (!note) {
      logger.error("Note not found to delete.");
      throw ApiError.notFound("Note doesn't exist.");
    }
    await note.deleteOne();
    return true;
  };
}
