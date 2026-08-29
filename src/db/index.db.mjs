import { Notification } from "../modules/notifications/model/notification.schema.mjs";
import { Otp } from "../modules/otp/model/otp.schema.mjs";
import { Users } from "../modules/users/model/users.schema.mjs";
const models = {
  users: Users,
  otp: Otp,
  notification: Notification,
};

export default models;
