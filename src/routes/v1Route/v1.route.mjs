import express from "express";
import { UserRoutes } from "../../modules/users/user.router.mjs";
import { NotificationRoutes } from "../../modules/notifications/notification.router.mjs";

export class InitializedV1Routes {
  constructor() {
    this.router = express.Router();
    this.userRoutes = new UserRoutes().router;
    this.notification = new NotificationRoutes().router;
    this.init();
  }
  init = () => {
    this.router.use("/users", this.userRoutes);
    this.router.use("/notification", this.notification);
  };
}
