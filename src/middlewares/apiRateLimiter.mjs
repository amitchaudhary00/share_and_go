import { rateLimit } from "express-rate-limit";
import { STATUS_CODE } from "../utils/httpCodes.mjs";
import Env from "../config/env.js";

export const apiRateLimiter = rateLimit({
  windowMs: Env.API_WINDOW_RATE_LIMIT.windowMs,
  limit: Env.API_WINDOW_RATE_LIMIT.limit,
  // skip the rate limiting for ip
  skip: (req, res) => Env.IP_ALLOW_LIST.includes(req.ip),

  handler: (req, res, next) => {
    console.log("rate limit exceeded");
    return res.status(429).json({
      errorCode: STATUS_CODE[429],
      success: false,
      message: Env.API_WINDOW_RATE_LIMIT.message,
    });
  },
});

export const otpIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10, // generous — just stops obvious abuse/bots
  message: { success: false, message: "Too many requests, slow down." },
});