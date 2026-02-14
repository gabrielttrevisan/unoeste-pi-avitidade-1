import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import HTMLContent from "../internal/builder/page.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleSignInPage(req, res) {
  const [signInContent] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/sign-in.html"),
      "utf-8",
    ),
  ]);

  HTMLContent.create(req, res)
    .setTitle("Cursemy - Acesse sua conta")
    .setContent(signInContent)
    .stylesheet("sign-in")
    .render();
}

export const SIGN_IN_ROUTE_MATCH = "/sign-in";
