import { UserService } from "./user.service.mjs";
import { OtpService } from "../otp/otp.service.mjs";
import { OTP_TYPES } from "../../config/enum.mjs";

export class UserViewController {
  #userService;
  #otpService;

  constructor() {
    this.#userService = new UserService();
    this.#otpService = new OtpService();
  }

  showSignupForm = (req, res) => {
    res.render("pages/create-user", { errors: null, formData: null, errorMessage: null });
  };

  handleSignup = async (req, res) => {
    if (req.validationErrors) {
      return res.render("pages/create-user", {
        errors: req.validationErrors,
        formData: { name: req.body.name, email: req.body.email, mobile: req.body.mobile },
        errorMessage: null,
      });
    }

    try {
      const { user } = await this.#userService.create(req.body);
      // redirect to OTP screen instead of success — user isn't verified yet
      return res.redirect(`/user/verify-email?email=${encodeURIComponent(user.email)}`);
    } catch (err) {
      return res.render("pages/create-user", {
        errors: null,
        formData: { name: req.body.name, email: req.body.email, mobile: req.body.mobile },
        errorMessage: err.message || "Something went wrong. Please try again.",
      });
    }
  };

  showSuccessPage = (req, res) => {
    res.render("pages/signup-success");
  };

  // --- OTP screens ---

  showVerifyOtpForm = (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.redirect("/user/signup");
    }
    res.render("pages/verify-otp", { email, errors: null, errorMessage: null });
  };

  handleVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (req.validationErrors) {
      return res.render("pages/verify-otp", {
        email,
        errors: req.validationErrors,
        errorMessage: null,
      });
    }

    try {
      await this.#userService.verifyEmail({ email, otp });
      return res.redirect("/user/signup/success");
    } catch (err) {
      return res.render("pages/verify-otp", {
        email,
        errors: null,
        errorMessage: err.message || "Invalid or expired code. Please try again.",
      });
    }
  };

  handleResendOtp = async (req, res) => {
    const { email } = req.body;
    try {
      await this.#otpService.requestOtp({ identifier: email, otpType: OTP_TYPES.SIGNUP });
      return res.render("pages/verify-otp", {
        email,
        errors: null,
        errorMessage: null,
        infoMessage: "A new code has been sent to your email.",
      });
    } catch (err) {
      console.log("I got this error ", err?.message
        
      );
      return res.render("pages/verify-otp", {
        email,
        errors: null,
        errorMessage:
          err.message?.reason || "Could not resend code. Please try again shortly.",
      });
    }
  };
}
