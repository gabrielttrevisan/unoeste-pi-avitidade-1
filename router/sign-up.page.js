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
export default async function handleSignUpPage(req, res) {
  const [signUpContent] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/sign-up.html"),
      "utf-8",
    ),
  ]);

  const page = await PageBuilder.fromRequest(req)
    .setTitle("Cursemy - Acesse sua conta")
    .setContent(signUpContent)
    .mount();

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const SIGN_UP_ROUTE_MATCH = "/sign-up";
