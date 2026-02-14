import USERS from "../data/users.js";
import handleErrorPage from "./error.page.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleSignUpAction(req, res) {
  if (!req.body)
    return handleErrorPage(req, res, {
      code: 400,
      message: "Requisição inválida",
    });

  const { email, password, name, confirmPassword } = req.body;

  if (
    !isEmailValid(email) ||
    !isPasswordValid(password, confirmPassword) ||
    !isNameValid(name)
  )
    return res.redirect("/sign-up");

  if (USERS.has(email)) return res.redirect("/sign-up");

  USERS.set(email, {
    name,
    pass: password,
  });

  res.redirect("/sign-in");
}

export const SIGN_UP_ACTION_MATCH = "/sign-up";

/**
 * @param {string|null|undefined} email
 * @returns {boolean}
 */
function isEmailValid(email) {
  return (
    email &&
    email.match(/([a-z][a-z\-\.0-9]+[a-z0-9])@([a-z][a-z0-9\.][a-z])/i) !== null
  );
}

/**
 * @param {string|null|undefined} pass
 * @param {string|null|undefined} confirm
 * @returns {boolean}
 */
function isPasswordValid(pass, confirm) {
  return (
    pass && confirm && pass === confirm && pass.match(/(.){8,16}/i) !== null
  );
}

/**
 * @param {string|null|undefined} name
 * @returns {boolean}
 */
function isNameValid(name) {
  return name && name.match(/([a-z\-]{2,})\s+([a-z\-]{2,})/i) !== null;
}
