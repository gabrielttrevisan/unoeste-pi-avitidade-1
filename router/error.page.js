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
export default async function handleErrorPage(
  req,
  res,
  { message, code } = {},
) {
  const [errorContent] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/error.html"),
      "utf-8",
    ),
  ]);

  PageBuilder.create(req, res)
    .setTitle(`Cursemy - ${message}`)
    .setContent(errorContent)
    .replace("{{STATUS_CODE}}", code)
    .replace("{{STATUS_MESSAGE}}", message)
    .mountAndSend();
}

export const ROUTE_MATCH = "";
