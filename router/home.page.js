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
export default async function handleHomePage(req, res) {
  const [cursemyCardTemplate, data] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/cursemy-card.html"),
      "utf-8",
    ),
    readFile(path.join(__dirname, "../internal/data/home.html"), "utf-8"),
  ]);

  PageBuilder.create(req, res)
    .setTitle("Cursemy")
    .setContent(`${cursemyCardTemplate}${data}`)
    .mountAndSend();
}

export const HOME_ROUTE_MATCH = "";
