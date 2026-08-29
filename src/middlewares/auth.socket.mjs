import Env from "../config/env.js";
import { ApiError } from "../utils/errorHandler.mjs";
import jwt from "jsonwebtoken";

export class SocketAuthMiddleware {
  static jwtVerify = (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) next(new ApiError(401, "you are unauthorized"));
    try {
      const decodedToken = jwt.verify(token, Env.PUBLIC_KEY);
      if (!decodedToken) throw new ApiError(401, "Invalid JWT token");
      socket.user = decodedToken;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  };
}
