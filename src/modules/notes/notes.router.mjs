import express from "express";
import { guestSession } from "../../middlewares/guestSession.mjs";
import { NotesViewController } from "./notes.view.controller.mjs";
import { createNoteSchema } from "./notes.validator.mjs";
import { Validate } from "../../middlewares/validate.mjs";
import { ROUTE_TYPE } from "../../config/enum.mjs";

export class NoteRoutes {
  #notesViewController;
  constructor(routeType) {
    this.router = express.Router();

    if (routeType === ROUTE_TYPE.VIEW) {
      this.#notesViewController = new NotesViewController();
      this.initView();
    } else {
      this.initApi();
    }
  }

  initApi = () => {};

  initView = () => {
    this.router.use(guestSession);
    this.router.get("/", this.#notesViewController.list);
    this.router.get("/create", this.#notesViewController.renderCreateForm);
    this.router.post(
      "/",
      Validate.bodyForView(createNoteSchema),
      this.#notesViewController.create,
    );
    this.router.get("/:id", this.#notesViewController.view);
    this.router.post("/:id/delete", this.#notesViewController.delete);
    this.router.get("/share/:token", this.#notesViewController.viewShared);
  };
}
