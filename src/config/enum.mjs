export const ROUTE_TYPE = {
  VIEW: "VIEW",
  API: "API",
};

export const OTP_TYPES = {
  SIGNUP: "SIGNUP",
  LOGIN: "LOGIN",
  RESET_PASSWORD: "RESET_PASSWORD",
  CHANGE_PHONE: "CHANGE_PHONE",
  CHANGE_EMAIL: "CHANGE_EMAIL",
};

export const OTP_TYPES_ARR = Object.values(OTP_TYPES);

export const NOTIFICATION_TYPES = {
  OTP_EMAIL: "otp_email",
  OTP_SMS: "otp_sms",
};

export const NOTIFICATION_TYPES_ARR = Object.values(NOTIFICATION_TYPES);

export const EXPIRY_CHOICES = {
  HOURS_24: "hours_24",
  DAYS_3: "days_3",
  DAYS_7: "days_7",
  NEVER: "never",
};

export const NOTES_EXPIRY_MS = {
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  never: null,
};

export const EXPIRY_CHOICES_ARR = Object.values(EXPIRY_CHOICES);
