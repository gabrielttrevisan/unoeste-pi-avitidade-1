import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import PageBuilder from "../internal/builder/page.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleSignInPage(
  req,
  res,
  { message, code } = {},
) {
  const [signIn] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/sign-in.html"),
      "utf-8",
    ),
  ]);

  const signInContent = signIn
    .replace("{{STATUS_CODE}}", code)
    .replace("{{STATUS_MESSAGE}}", message);

  const page = await PageBuilder.fromRequest(req)
    .setTitle("Cursemy - Acesse sua conta")
    .setContent(signInContent)
    .mount();

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const SIGN_IN_ROUTE_MATCH = "/sign-in";
