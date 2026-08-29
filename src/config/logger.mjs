import pino from "pino";
import Env from "./env.js";

const isProd = Env.NODE_ENV === "production";

const logger = pino({
  level: Env.LOG_LEVEL,

  // Pretty logs only in development
  transport: !isProd
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

export default logger;
