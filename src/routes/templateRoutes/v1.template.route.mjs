import express from "express";

export class InitializedV1TemplateRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }
  init = () => {
    this.router.get("/", (req, res) => {
      res.render("index");
    });
    this.router.get("/signup", (req, res) => {
      res.render("pages/create-user");
    });
  };
}
