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
  const [error] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/error.html"),
      "utf-8",
    ),
  ]);

  const errorContent = error
    .replace("{{STATUS_CODE}}", code)
    .replace("{{STATUS_MESSAGE}}", message);

  const page = await PageBuilder.fromRequest(req)
    .setTitle(`Cursemy - ${message}`)
    .setContent(errorContent)
    .mount();

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const ROUTE_MATCH = "";
