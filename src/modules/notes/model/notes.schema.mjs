import mongoose from "mongoose";

const { Schema } = mongoose;

const notesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null, // null for guest notes
    },
    guestId: {
      type: String,
      default: null, // null for logged-in user notes
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    expiresAt: {
      type: Date,
      default: null, // null = never expires (logged-in users, by default)
    },
  },
  {
    timestamps: true,
  },
);

notesSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notes = mongoose.model("Notes", notesSchema);
