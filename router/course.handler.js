import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import handleError from "./error.handler.js";
import COURSES from "../data/courses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleCourse(req, res) {
  const slug = req.params.slug;

  if (!slug)
    return handleError(req, res, {
      code: 404,
      message: "Página não encontrada",
    });

  const course = COURSES[slug];

  if (!course)
    return handleError(req, res, {
      code: 404,
      message: "Página não encontrada",
    });

  const [layout, cursemyCardTemplate] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/layout.html"),
      "utf-8",
    ),
    readFile(
      path.join(__dirname, "../internal/components/cursemy-card.html"),
      "utf-8",
    ),
  ]);

  const page = layout
    .replace("{{title}}", `Cursemy - ${course.title}`)
    .replace("{{content}}", `${cursemyCardTemplate}`)
    .replace(/\s{2,}/gi, " ");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const COURSE_ROUTE_MATCH = "/curso/:slug";
