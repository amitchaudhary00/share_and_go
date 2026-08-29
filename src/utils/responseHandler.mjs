import Env from "../config/env.js";
import { STATUS_CODE } from "./httpCodes.mjs";

export class ApiResponse {
  constructor(statusCode, message = "success", data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  setTokenAndSend = ({ res = null, redirectUrl = null }) => {
    res.cookie("access_token", this.data.access_token, {
      httpOnly: true,
      secure: Env.NODE_ENV !== "development",
      sameSite: "strict", // Changed from 'strict' to 'lax' to allow OAuth redirects
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    console.log("redirect", redirectUrl);
    if (redirectUrl) {
      res.redirect(redirectUrl);
    } else {
      this.send(res);
    }
  };

  send = (res) => {
    const response = {
      success: this.success,
      status: STATUS_CODE[this.statusCode] || "UNKNOWN_EXCEPTION",
      message: this.message,
      data: this.data,
    };
    res.status(this.statusCode).json(response);
  };
}
