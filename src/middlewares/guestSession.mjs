
import { randomBytes } from "crypto";

export function guestSession(req, res, next) {
  if (req.user) return next();

  if (!req.cookies?.guestId) {
    const guestId = randomBytes(16).toString("hex");
    res.cookie("guestId", guestId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
    req.guestId = guestId;
  } else {
    req.guestId = req.cookies.guestId;
  }

  next();
}
