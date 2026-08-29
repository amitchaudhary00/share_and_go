import mongoose from "mongoose";
import { OTP_TYPES_ARR } from "../../../config/enum.mjs";

const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
      maxlength: 255,
    },
    otpType: {
      type: String,
      enum: OTP_TYPES_ARR,
      required: true,
      default: "SIGNUP",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    consumed: {
      type: Boolean,
      required: true,
      default: false,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// INDEXES — equivalent to your `indexes` array
otpSchema.index({ userId: 1, otpType: 1 });
otpSchema.index({ expiresAt: 1 });

export const Otp = mongoose.model("Otp", otpSchema);
