import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Env from "../../../config/env.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    passwordHash: {
      type: String,
      required: false,
      select: false, // never returned by default — Mongoose equivalent of defaultScope exclude
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      required: true,
      default: "active",
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// INSTANCE METHOD — verify password
userSchema.methods.verifyPassword = async function (candidatePassword) {
  if (!candidatePassword || !this.passwordHash) {
    return false;
  }
  try {
    return await bcrypt.compare(candidatePassword.trim(), this.passwordHash);
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
};

// HOOK — hash password before save (equivalent to beforeSave)
userSchema.pre("save", async function () {
  if (this.isModified("passwordHash") && this.passwordHash) {
    try {
      const trimmed = this.passwordHash.trim();
      if (trimmed) {
        this.passwordHash = await bcrypt.hash(trimmed, Env.HASH_SALT);
      }
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }
});

export const Users = mongoose.model("User", userSchema);
