import handleErrorPage from "./error.page.js";
import USERS from "../data/users.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleSignInAction(req, res) {
  if (!req.body)
    return handleErrorPage(req, res, {
      code: 400,
      message: "Requisição inválida",
    });

  const { email, password } = req.body;

  if (!email || !password)
    return handleErrorPage(req, res, {
      code: 400,
      message: "Requisição inválida",
    });

  const user = USERS.get(email);

  if (!user || user.pass !== password) return res.redirect("/sign-in");

  req.session.isUserSignedIn = true;

  res.redirect("/");
}

export const SIGN_IN_ACTION_MATCH = "/sign-in";
