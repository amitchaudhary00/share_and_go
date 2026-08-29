import nodemailer from "nodemailer";
import Env from "../config/env.js";

export class MailService {
  constructor() {
    this.transporter = this.createTransport();
  }

  createTransport = () => {
    const isGmail =
      Env.MAIL_HOST?.toLowerCase().includes("gmail") ||
      Env.MAIL_USER?.toLowerCase().includes("@gmail.com");

    const transporterConfig = {
      host: Env.MAIL_HOST,
      port: Number(Env.MAIL_PORT) || 587,
      secure: Number(Env.MAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: Env.MAIL_USER,
        pass: Env.MAIL_PASS,
      },
      ...(isGmail && {
        service: "gmail",
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
      }),
    };

    return nodemailer.createTransport(transporterConfig);
  };

  sendMail = async ({ to, subject, text, html }) => {
    try {
      await this.transporter.verify();
      console.log("SMTP connection verified successfully");

      const mailOptions = {
        from: Env.MAIL_FROM,
        to,
        subject,
        text,
        html,
      };

      console.log("Sending email to:", to);
      console.log("From:", Env.MAIL_FROM);
      console.log("Subject:", subject);

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result.messageId);
      return result;
    } catch (error) {
      console.error("Email sending failed:", error.message);

      // Provide specific error guidance
      if (error.code === "EAUTH") {
        console.error(`
                    === GMAIL AUTHENTICATION ERROR ===
                    This error occurs when Gmail credentials are invalid. Please check:

                    1. FOR GMAIL USERS:
                    - Enable 2-Factor Authentication on your Google account
                    - Generate an App Password (not your regular Gmail password)
                    - Use the App Password in MAIL_PASS environment variable
                    - Go to: https://myaccount.google.com/apppasswords

                    2. ENVIRONMENT VARIABLES:
                    - MAIL_HOST=smtp.gmail.com
                    - MAIL_PORT=587
                    - MAIL_USER=your-email@gmail.com
                    - MAIL_PASS=your-16-character-app-password
                    - MAIL_FROM=your-email@gmail.com

                    3. ALTERNATIVE SOLUTIONS:
                    - Use OAuth2 instead of App Password
                    - Use a different email service (SendGrid, Mailgun, etc.)
                    - Enable "Less secure app access" (not recommended)

                    Current config: Host=${Env.MAIL_HOST}, Port=${Env.MAIL_PORT}, User=${Env.MAIL_USER}
                    === END ERROR GUIDE ===
            `);
      }

      throw error;
    }
  };
}
