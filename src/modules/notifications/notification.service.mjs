import logger from "../../config/logger.mjs";
import models from "../../db/index.db.mjs";
import { MailService } from "../../utils/mailer.service.mjs";

export class NotificationService {
  constructor() {
    this.notification = models.notification;
    this.mailService = new MailService();
  }

  scheduleEmailNotificationQueue = async () => {
    const pending = await this.notification
      .find({ status: "pending", type: "otp_email" })
      .sort({ createdAt: 1 })
      .limit(50); // batch size per run

    for (const notification of pending) {
      try {
        const data = JSON.parse(notification.payload);

        if (notification.type === "otp_email") {
          await this.mailService.sendMail({
            to: notification.recipient,
            subject: "Your verification code",
            text: `Your OTP is ${data.code}. It expires in 5 minutes.`,
            html: `<p>Your OTP is <b>${data.code}</b>. It expires in 5 minutes.</p>`,
          });
        }

        // delete on success — no need to retain the plain code once delivered
        await notification.deleteOne();
      } catch (err) {
        notification.attempts += 1;
        notification.lastError = err.message;
        notification.status = notification.attempts >= 3 ? "failed" : "pending"; // give up after 3 tries
        await notification.save();
        logger.error("Error while sending email notifications", notification);
      }
    }

    return { processed: pending.length };
  };
}
