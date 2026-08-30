import crypto from "crypto";
import bcrypt from "bcrypt";
import models from "../../db/index.db.mjs";
import { ApiError } from "../../utils/errorHandler.mjs";
import logger from "../../config/logger.mjs";
import { NOTIFICATION_TYPES } from "../../config/enum.mjs";

export class OtpService {
  #OTP_TTL_MINUTES = 5;
  #SALT_ROUNDS = 10;
  #MAX_VERIFY_ATTEMPTS = 5;
  #MAX_REQUESTS_PER_WINDOW = 5;
  #RATE_LIMIT_WINDOW_HOURS = 12;
  #otp;
  #notification;
  #user;

  constructor() {
    this.#otp = models.otp;
    this.#notification = models.notification;
    this.#user = models.users;
  }

  #generateOtp = async () => {
    const code = crypto.randomInt(100000, 1000000).toString();
    if (!code) {
      logger.error("Error in crypto - generate otp service");
      throw ApiError.internal();
    }
    const otpHash = await bcrypt.hash(code, this.#SALT_ROUNDS);
    if (!otpHash) {
      logger.error("Error in bcrypt - generate otp service");
      throw ApiError.internal();
    }
    const expiresAt = new Date(Date.now() + this.#OTP_TTL_MINUTES * 60 * 1000);

    return { code, otpHash, expiresAt };
  };

  requestOtp = async ({ userId, identifier, otpType }) => {
    if (!userId || !identifier) {
      const existingUser = await this.#user.findOne({
        $or: [{ _id: userId }, { email: identifier }, { mobile: identifier }],
      });
      if (!existingUser) {
        throw ApiError.badRequest("User not found");
      }
      userId = existingUser.id;
      identifier = existingUser.email;
    }

    const rateLimit = await this.#checkRateLimit(userId, otpType);
    if (!rateLimit.allowed) {
      throw ApiError.rateLimit({
        reason: "Too many OTP requests. Please try again later.",
        retryAfter: rateLimit.retryAfter,
      });
    }

    await this.#otp.updateMany(
      { userId, otpType, consumed: false },
      { $set: { consumed: true } },
    );

    const { code, otpHash, expiresAt } = await this.#generateOtp();

    const createdOtp = await this.#otp.create({
      userId,
      otpHash,
      otpType,
      expiresAt,
    });

    if (!createdOtp) {
      logger.error("Failed to create OTP in request otp service.");
      throw ApiError.internal();
    }

    // enqueue delivery — this is the "queue push" replacing BullMQ's queue.add()
    await this.#notification.create({
      type: NOTIFICATION_TYPES.OTP_EMAIL,
      recipient: identifier,
      payload: JSON.stringify({ code }),
    });

    return { expiresAt };
  };

  verifyOtp = async (userId, otpType, receivedOtp) => {
    
    const record = await this.#otp
      .findOne({ userId, otpType, consumed: false })
      .sort({ createdAt: -1 });

    if (!record) {
      logger.error(
        `No Otp found of userId:${userId} otpType:${otpType} receivedOtp:${receivedOtp}`,
      );
      throw ApiError.badRequest("Invalid otp");
    }

    if (record.expiresAt < new Date()) {
      logger.error(
        `Otp expired of userId:${userId} otpType:${otpType} receivedOtp:${receivedOtp}`,
      );
      throw ApiError.badRequest("Invalid otp");
    }

    if (record.attempts >= this.#MAX_VERIFY_ATTEMPTS) {
      logger.error(
        `Too many otp attempts of userId:${userId} otpType:${otpType} receivedOtp:${receivedOtp}`,
      );
      throw ApiError.badRequest("Too many attempts");
    }

    const isMatch = await bcrypt.compare(receivedOtp, record.otpHash);

    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      throw ApiError.badRequest("Invalid otp");
    }

    record.consumed = true;
    await record.save();
    return { valid: true };
  };

  #checkRateLimit = async (userId, otpType) => {
    const windowStart = new Date(
      Date.now() - this.#RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
    );

    const recentCount = await this.#otp.countDocuments({
      userId,
      otpType,
      createdAt: { $gte: windowStart },
    });

    if (recentCount >= this.#MAX_REQUESTS_PER_WINDOW) {
      const oldestInWindow = await this.#otp
        .findOne({ userId, otpType, createdAt: { $gte: windowStart } })
        .sort({ createdAt: 1 });

      const retryAfter = new Date(
        oldestInWindow.createdAt.getTime() +
          this.#RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
      );

      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  };
}
