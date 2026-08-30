import express from "express";
import { UserController } from "./user.controller.mjs";
import { Validate } from "../../middlewares/validate.mjs";
import { createUserSchema, verifyEmailSchema } from "./user.validator.mjs";
import { ROUTE_TYPE } from "../../config/enum.mjs";
import { UserViewController } from "./user.view.controller.mjs";

export class UserRoutes {
  constructor(routeType) {
    this.router = express.Router();
    if (routeType === ROUTE_TYPE.VIEW) {
      this.userViewController = new UserViewController();
      this.initView();
    } else {
      this.userController = new UserController();
      this.initApi();
    }
  }

  initApi = () => {
    this.router.post("/", Validate.body(createUserSchema), this.userController.create);
    this.router.post(
      "/verify-email",
      Validate.body(verifyEmailSchema),
      this.userController.verifyEmail,
    );
  };

  initView = () => {
    this.router.get("/signup", this.userViewController.showSignupForm);
    this.router.post(
      "/signup",
      Validate.bodyForView(createUserSchema),
      this.userViewController.handleSignup,
    );
    this.router.get("/signup/success", this.userViewController.showSuccessPage);

    this.router.get("/verify-email", this.userViewController.showVerifyOtpForm);
    this.router.post(
      "/verify-email",
      Validate.bodyForView(verifyEmailSchema),
      this.userViewController.handleVerifyOtp,
    );
    this.router.post("/resend-otp", this.userViewController.handleResendOtp);
  };
}
