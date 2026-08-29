import cron from "node-cron";
import { NotificationService } from "../modules/notifications/notification.service.mjs";

export function startScheduler() {
  const notifications = new NotificationService();
  // cleanup expired OTPs — every 5 minutes
  cron.schedule(
    "*/5 * * * *",
    async () => {
      try {
        const result = await notifications.scheduleEmailNotificationQueue();
        console.log(`[cron] Otp send successfully for: ${result.processed}`);
      } catch (err) {
        console.error("[cron] Failed to send otp:", err.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );

  console.log("Scheduler started");
}
