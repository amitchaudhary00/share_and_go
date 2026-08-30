import express from "express";
import { NoteRoutes } from "../../modules/notes/notes.router.mjs";
import { ROUTE_TYPE } from "../../config/enum.mjs";
import { UserRoutes } from "../../modules/users/user.router.mjs";

export class InitializedV1TemplateRoutes {
  #userRoutes;
  #notesRoutes;
  constructor() {
    this.router = express.Router();
    this.#userRoutes = new UserRoutes(ROUTE_TYPE.VIEW).router;
    this.#notesRoutes = new NoteRoutes(ROUTE_TYPE.VIEW).router;
    this.init();
  }
  init = () => {
    this.router.get("/", (req, res) => {
      res.status(200).render("index");
    });
    this.router.use("/user", this.#userRoutes);
    this.router.use("/notes", this.#notesRoutes);
  };
}
