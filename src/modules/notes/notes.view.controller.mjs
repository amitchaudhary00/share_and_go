import { NoteService } from "./notes.service.mjs";

export class NotesViewController {
  #noteService;

  constructor() {
    this.#noteService = new NoteService();
  }

  renderCreateForm = (req, res) => {
    return res.render("pages/create-notes", { errors: null, old: {} });
  };

  create = async (req, res) => {
    if (req.validationErrors) {
      return res.render("pages/create-notes", {
        errors: req.validationErrors,
        old: req.body,
      });
    }

    const note = await this.#noteService.create({
      userId: req.user?._id,
      guestId: req.guestId,
      title: req.body.title,
      content: req.body.content,
    });
    return res.redirect(`/notes/${note._id}`);
  };

  view = async (req, res) => {
    const note = await this.#noteService.getById(req.params.id, {
      userId: req.user?._id,
      guestId: req.guestId,
    });

    return res.render("pages/view-notes", { note, isOwner: !!note, isGuest: !req.user });
  };

  viewShared = async (req, res) => {
    const note = await this.#noteService.getByShareToken(req.params.token);
    return res.render("pages/view-notes", { note, isOwner: false, isGuest: true });
  };

  list = async (req, res) => {
    const notes = await this.#noteService.getAllForOwner({
      userId: req.user?._id,
      guestId: req.guestId,
    });
    return res.render("pages/list-notes", { notes });
  };

  delete = async (req, res) => {
    await this.#noteService.deleteById(req.params.id, {
      userId: req.user?._id,
      guestId: req.guestId,
    });
    return res.redirect("/notes");
  };
}
