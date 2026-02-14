import handleErrorPage from "./error.page.js";
import COURSES from "../data/courses.js";
import USERS from "../data/users.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleSignOutAction(req, res) {
  req.session?.destroy?.();
  res.redirect("/");
}

export const SIGN_OUT_ACTION_MATCH = "/sign-out";
