import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.mjs";
import { generateKeyPairSync } from "node:crypto";
import fs from "node:fs";
import Env from "../config/env.js";

export class JwtHelper {
  static generateJwt = (payload) => {
    if (!payload) throw new Error("No payload found to generate jwt token");
    if (!Env.PRIVATE_KEY) throw new Error("No private key found to generate jwt token");
    const token = jwt.sign(payload, Env.PRIVATE_KEY, {
      algorithm: "RS256",
      // expiresIn: "15m",
      expiresIn: "15d",
    });
    if (!token) throw new Error("Jwt token generation failed");
    return token;
  };

  static verifyJWT = (req, res, next) => {
    try {
      const token = req.cookies.access_token || req.headers?.authorization?.split(" ")[1];
      if (!token) throw new ApiError(401, "unauthorized request");
      const decodedToken = jwt.verify(token, Env.PUBLIC_KEY);
      if (!decodedToken) throw new ApiError(401, "unauthorized request");
      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };

  static generateKeys = () => {
    if (fs.existsSync(Env.PRIVATE_KEY_PATH) && fs.existsSync(Env.PUBLIC_KEY_PATH)) return;

    if (!fs.existsSync(Env.KEYS_PATH)) {
      fs.mkdirSync(Env.KEYS_PATH, { recursive: true });
    }
    const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    if (privateKey) {
      fs.writeFileSync(
        Env.PRIVATE_KEY_PATH,
        privateKey.export({ type: "pkcs8", format: "pem" }),
      );
    }
    if (publicKey) {
      fs.writeFileSync(
        Env.PUBLIC_KEY_PATH,
        publicKey.export({ type: "spki", format: "pem" }),
      );
    }
  };
}
