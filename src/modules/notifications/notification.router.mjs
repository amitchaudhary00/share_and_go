import express from "express";
import { NotificationService } from "./notification.service.mjs";
import { NotificationController } from "./notification.controller.mjs";

export class NotificationRoutes {
  constructor() {
    this.router = express.Router();
    this.notificationController = new NotificationController();
    this.init();
  }

  init = () => {
    this.router.get("/schedule-email", this.notificationController.scheduleMail);
  };
}
