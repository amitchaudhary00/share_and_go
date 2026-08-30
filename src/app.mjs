import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { apiRateLimiter } from "./middlewares/apiRateLimiter.mjs";
import { ApiError, ErrorResponse } from "./utils/errorHandler.mjs";
import { corsOptions } from "./middlewares/cors.mjs";
import { InitializedRoutes } from "./routes/index.route.mjs";
import { dbInstance } from "./db/dbConnection.mjs";
import Env from "./config/env.js";
import { devApiLogs, prodApiLogs } from "./config/morgan.mjs";
import { startScheduler } from "./utils/scheduler.mjs";
import CONFIG from "./views/config.js";

class App {
  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initTemplateEngine();
    this.initRoutes();
    this.initDatabase();
    startScheduler();
  }

  initMiddlewares() {
    this.app.set("trust proxy", 1); //study
    this.app.use(urlencoded({ extended: true }));
    this.app.use("/assets", express.static(Env.USER_PROFILE_PATH));
    this.app.use(
      helmet({
        crossOriginOpenerPolicy: {
          policy: "same-origin-allow-popups",
        },
        // contentSecurityPolicy: {
        //   directives: {
        //     defaultSrc: ["'self'"],

        //     scriptSrc: ["'self'", "https://esm.sh", "https://cdn.jsdelivr.net"],

        //     styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],

        //     connectSrc: ["'self'", "https://esm.sh", "https://cdn.jsdelivr.net"],

        //     imgSrc: ["'self'", "data:", "https:"],

        //     fontSrc: ["'self'", "https://cdn.jsdelivr.net"],

        //   },
        // },
      }),
    );
    this.app.use(cookieParser());
    this.app.disable("etag"); //study
    this.app.disable("x-powered-by"); //study
    this.app.use(cors(corsOptions));
    this.app.use(compression());
    this.app.use(Env.NODE_ENV === "production" ? prodApiLogs : devApiLogs);
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(apiRateLimiter);
  }

  initTemplateEngine = () => {
    this.app.set("view engine", "ejs");
    this.app.set("views", CONFIG.TEMPLATE_ENGINE_PATH);
    this.app.use(express.static(CONFIG.TEMPLATE_ENGINE_PUBLIC));
  };

  initRoutes = () => {
    const ApiRouter = new InitializedRoutes().router;
    this.app.use(ApiRouter);
    this.app.use((req, res, next) => {
      if (req.originalUrl.startsWith("/api")) {
        next(ApiError.notFound());
      } else {
        res.status(404).render("pages/404");
      }
    });
    this.app.use(ErrorResponse.ErrorHandler);
  };

  initDatabase = async () => {
    await dbInstance.db_connect();
  };

  getInstance() {
    return this.app;
  }
}

export default App;
