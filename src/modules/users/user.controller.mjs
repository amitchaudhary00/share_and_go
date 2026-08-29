import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ApiResponse } from "../../utils/responseHandler.mjs";
import { UserService } from "./user.service.mjs";

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  create = asyncHandler(async (req, res) => {
    const result = await this.userService.create(req.body);
    return new ApiResponse(201, "User created successfully", result).send(res);
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const result = await this.userService.verifyEmail(req.body)
    return new ApiResponse(200, "Otp Verified", result).send(res)
  })
}
