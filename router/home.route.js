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
export default async function getHomePage(req, res) {
  const [layout, cursemyCardTemplate, data] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/layout.html"),
      "utf-8",
    ),
    readFile(
      path.join(__dirname, "../internal/components/cursemy-card.html"),
      "utf-8",
    ),
    readFile(path.join(__dirname, "../internal/data/home.html"), "utf-8"),
  ]);

  const page = layout
    .replace("{{title}}", "Cursemy")
    .replace("{{content}}", `${cursemyCardTemplate}${data}`)
    .replace(/\s{2,}/gi, " ");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const ROUTE_MATCH = "";
