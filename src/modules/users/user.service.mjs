import models from "../../db/index.db.mjs";
import { ApiError } from "../../utils/errorHandler.mjs";
import logger from "../../config/logger.mjs";
import { OtpService } from "../otp/otp.service.mjs";
import { OTP_TYPES } from "../../config/enum.mjs";

export class UserService {
  #users;
  #otpService;
  constructor() {
    this.#users = models.users;
    this.#otpService = new OtpService();
  }

  create = async (userDto = {}) => {
    const { name, email, mobile, password } = userDto || {};
    const existingUser = await this.#users.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      throw ApiError.badRequest("User already exists");
    }
    const newUser = await this.#users.create({
      name,
      email,
      passwordHash: password,
      mobile,
    });

    if (!newUser) {
      logger.error("Error creating user");
      throw ApiError.internal();
    }

    const otp = await this.#otpService.requestOtp({
      userId: newUser.id,
      identifier: newUser.email,
      otpType: OTP_TYPES.SIGNUP,
    });

    return { user: newUser, otpExpiresAt: otp.expiresAt };
  };

  verifyEmail = async (userDto = {}) => {
    const { email, userId, otp } = userDto;
    const existingUser = await this.#users.findOne({
      $or: [{ email }, { _id: userId }],
    });

    if (!existingUser) {
      logger.error("User not found (doesn't exist in our system)");
      throw ApiError.badRequest("Email verification failed.");
    }
    return await this.#otpService.verifyOtp(existingUser.id, OTP_TYPES.SIGNUP, otp);
  };
}
