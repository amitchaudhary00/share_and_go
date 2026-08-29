import { asyncHandler } from "../../utils/asyncHandler.mjs";
import { ApiResponse } from "../../utils/responseHandler.mjs";
import { NotificationService } from "./notification.service.mjs";

export class NotificationController {
  #notificationService;
  constructor() {
    this.#notificationService = new NotificationService();
  }

  scheduleMail = asyncHandler(async (req, res) => {
    const result = await this.#notificationService.scheduleEmailNotificationQueue();
    return new ApiResponse(200, "Email sent successfully", result).send(res);
  });
}
