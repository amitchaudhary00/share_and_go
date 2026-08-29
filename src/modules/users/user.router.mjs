import express from "express";
import { UserController } from "./user.controller.mjs";
import { Validate } from "../../middlewares/validate.mjs";
import { createUserSchema, verifyEmailSchema } from "./user.validator.mjs";

export class UserRoutes {
  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.init();
  }

  init = () => {
    this.router.post("/", Validate.body(createUserSchema), this.userController.create);
    this.router.post("/verify-email", Validate.body(verifyEmailSchema), this.userController.verifyEmail)
  };
}
