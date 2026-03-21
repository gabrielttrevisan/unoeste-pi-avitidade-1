import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import HTMLContentBuilder from "../internal/builder/html-content.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleAdminPage(req, res) {
  const [form] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/course-form.html"),
      "utf-8",
    ),
  ]);

  HTMLContentBuilder.create(req, res)
    .setTitle("Cursemy")
    .setContent(form)
    .withStylesheet("admin")
    .render();
}

export const ADMIN_ROUTE_MATCH = "/admin";
