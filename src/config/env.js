require("dotenv").config();
const path = require("node:path");
const fs = require("node:fs");

// __dirname is already available natively in CommonJS — no need to derive it

class Env {
  // App
  static PORT = Number(process.env.PORT) || 4000;
  static NODE_ENV = process.env.NODE_ENV || "development";
  static TEMPLATE_ENGINE_PATH = path.join(__dirname, "../", "/views");

  // Database
  static MONGODB_URI = process.env.MONGODB_URI;
  static MAX_POOL = Number(process.env.MAX_POOL) || 10;
  static MIN_POOL = Number(process.env.MIN_POOL) || 2;
  static SOCKET_TIMEOUT = Number(process.env.SOCKET_TIMEOUT) || 45000;

  // PINO LOGGER
  static LOG_LEVEL = process.env.LOG_LEVEL || "info";

  // IP allow list
  static IP_ALLOW_LIST = ["192.168.0.56", "192.168.0.21"];
  static CORS_ORIGINS = ["https://localhost:3000"];
  // Rate limiting
  static API_WINDOW_RATE_LIMIT = {
    windowMs: Number(process.env.WINDOW_LIMIT_MS) || 15 * 60 * 1000, // 15 min
    limit: Number(process.env.WINDOW_LIMIT) || 10000,
    message: "Too many requests please try again after 15 minutes",
  };

  // Password hashing
  static HASH_SALT = 12;

  // JWT key paths
  static KEYS_PATH = path.resolve(__dirname, "../../keys");
  static PRIVATE_KEY_PATH = path.resolve(__dirname, "../../keys/private.key");
  static PUBLIC_KEY_PATH = path.resolve(__dirname, "../../keys/public.key");

  // Loaded lazily via getters below, not at class-definition time
  static get PUBLIC_KEY() {
    return fs.readFileSync(Env.PUBLIC_KEY_PATH, { encoding: "utf-8" });
  }

  static get PRIVATE_KEY() {
    return fs.readFileSync(Env.PRIVATE_KEY_PATH, { encoding: "utf-8" });
  }

  // Static assets
  static USER_PROFILE_PATH = path.resolve(__dirname, "../../assets");
  static DEFAULT_PROFILE = "defaultProfile.jpg";

  // Google OAuth
  static GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  static GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  static GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
  static CLIENT_URL = process.env.CLIENT_URL;

  // SMTP - GMAIL, OUTLOOK ...
  static MAIL_HOST = process.env.MAIL_HOST;
  static MAIL_USER = process.env.MAIL_USER;
  static MAIL_PORT = process.env.MAIL_PORT;
  static MAIL_PASS = process.env.MAIL_PASS;
  static MAIL_FROM = process.env.MAIL_FROM;

  static validate() {
    const required = ["MONGODB_URI", "MAX_POOL", "MIN_POOL"];
    const missing = required.filter((key) => !Env[key]);
    if (missing.length) {
      throw new Error(`Missing required env vars: ${missing.join(", ")}`);
    }
  }
}

module.exports = Env;
