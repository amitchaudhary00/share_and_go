import Env from "../config/env.js";
import { ApiError } from "../utils/errorHandler.mjs";

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (Env.NODE_ENV === "development") return callback(null, true);
    if (Env.CORS_ORIGINS.includes(origin)) return callback(null, true);
    return callback(ApiError.badRequest(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
