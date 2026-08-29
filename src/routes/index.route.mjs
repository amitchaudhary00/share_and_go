import express from "express";
import { InitializedV1Routes } from "./v1Route/v1.route.mjs";
import { ApiResponse } from "../utils/responseHandler.mjs";
import { InitializedV1TemplateRoutes } from "./templateRoutes/v1.template.route.mjs";
export class InitializedRoutes {
  constructor() {
    this.router = express.Router();
    this.v1Route = new InitializedV1Routes().router;
    this.v1TemplateRoute = new InitializedV1TemplateRoutes().router;
    this.init();
  }
  init = () => {
    this.router.use("/api/v1", this.v1Route);
    this.router.use("/", this.v1TemplateRoute);
    this.healthCheck();
  };

  healthCheck = () => {
    this.router.get("/health-check", (req, res) => {
      return new ApiResponse(200, "Server is up and running").send(res);
    });
  };
}
