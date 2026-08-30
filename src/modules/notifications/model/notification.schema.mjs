import mongoose from "mongoose";
import { NOTIFICATION_TYPES_ARR } from "../../../config/enum.mjs";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    type: {
      type: String, 
      enum: NOTIFICATION_TYPES_ARR,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
      maxlength: 255,
    },
    payload: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastError: {
      type: String,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = mongoose.model("Notification", notificationSchema);
