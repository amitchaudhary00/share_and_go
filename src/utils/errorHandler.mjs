import { STATUS_CODE } from "./httpCodes.mjs";

export class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "something went wrong",
    errors = [],
    stack = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = "Bad Request", statusCode = 400) {
    return new ApiError(statusCode, message);
  }
  static validationError(message = "Validation Failed", statusCode = 422) {
    return new ApiError(statusCode, message);
  }
  static notFound(message = "Route Not Found", statusCode = 404) {
    return new ApiError(statusCode, message);
  }
  static rateLimit(message = "Hit Rate Limit", statusCode = 429) {
    return new ApiError(statusCode, message);
  }
  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

export class ErrorResponse {
  static ErrorHandler(err, req, res, next) {
    const statusCode = err?.statusCode || 500;

    const status = STATUS_CODE[statusCode] || "UNKNOWN_EXCEPTION";

    // Known custom errors
    if (err instanceof ApiError) {
      return res.status(statusCode).json({
        success: false,
        status,
        message: err.message,
        errors: err.errors || [],
      });
    }

    // Unknown / uncaught / unexpected errors
    return res.status(500).json({
      success: false,
      status: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
    });
  }
}
