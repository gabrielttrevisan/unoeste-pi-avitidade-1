import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleSignInPage(_, res, { message, code } = {}) {
  const [layout, signIn] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/layout.html"),
      "utf-8",
    ),
    readFile(
      path.join(__dirname, "../internal/components/sign-in.html"),
      "utf-8",
    ),
  ]);

  const signInContent = signIn
    .replace("{{STATUS_CODE}}", code)
    .replace("{{STATUS_MESSAGE}}", message);

  const page = layout
    .replace("{{title}}", `Cursemy - ${message}`)
    .replace("{{content}}", `${signInContent}`)
    .replace(/\s{2,}/gi, " ");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const SIGN_IN_ROUTE_MATCH = "/sign-in";
