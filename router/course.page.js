import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import handleError from "./error.page.js";
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

  const [layout, cursemyCourseTemplate, courseContentRaw] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/layout.html"),
      "utf-8",
    ),
    readFile(
      path.join(__dirname, "../internal/components/cursemy-course.html"),
      "utf-8",
    ),
    readFile(
      path.join(__dirname, "../internal/components/course.html"),
      "utf-8",
    ),
  ]);

  const courseContent = courseContentRaw
    .replaceAll("{{COURSE_TITLE}}", course.title)
    .replaceAll("{{COURSE_AUTHOR}}", course.author)
    .replaceAll("{{COURSE_RATINGS_COUNT}}", course.rankings.count)
    .replaceAll("{{COURSE_FULL_PRICE}}", course.price.full)
    .replaceAll("{{COURSE_PRICE_WITH_DISCOUNT}}", course.price.discounted)
    .replaceAll("{{COURSE_START_AT}}", course.startAt)
    .replaceAll("{{COURSE_DURATION}}", course.duration)
    .replaceAll("{{COURSE_SLUG}}", slug)
    .replaceAll("{{COURSE_STARS}}", course.rankings.stars)
    .replaceAll("{{COURSE_HIGHLIGHT}}", course.highlight)
    .replaceAll("{{COURSE_VACANCIES}}", course.vacancies ?? 0)
    .replaceAll("{{COURSE_LEVEL}}", course.level ?? 0)
    .replaceAll("{{COURSE_PRICE}}", course.price.raw)
    .replaceAll(
      "{{COURSE_DESCRIPTION}}",
      course.description ?? "Lorem ipsum dolor sit amet",
    );

  const page = layout
    .replace("{{title}}", `Cursemy - ${course.title}`)
    .replace("{{content}}", `${cursemyCourseTemplate}${courseContent}`)
    .replace(/\s{2,}/gi, " ");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(page);
}

export const COURSE_ROUTE_MATCH = "/curso/:slug";
