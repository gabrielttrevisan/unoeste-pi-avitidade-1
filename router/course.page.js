import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import handleErrorPage from "./error.page.js";
import COURSES from "../data/courses.js";
import PageBuilder from "../internal/builder/page.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handleCoursePage(req, res) {
  const slug = req.params.slug;

  if (!slug)
    return handleErrorPage(req, res, {
      code: 404,
      message: "Página não encontrada",
    });

  const course = COURSES[slug];

  if (!course)
    return handleErrorPage(req, res, {
      code: 404,
      message: "Página não encontrada",
    });

  const [cursemyCourseTemplate, courseContent] = await Promise.all([
    readFile(
      path.join(__dirname, "../internal/components/cursemy-course.html"),
      "utf-8",
    ),
    readFile(
      path.join(__dirname, "../internal/components/course.html"),
      "utf-8",
    ),
  ]);

  PageBuilder.create(req, res)
    .setTitle(`Cursemy - ${course.title}`)
    .setContent(`${cursemyCourseTemplate}${courseContent}`)
    .replace("{{COURSE_SLUG}}", slug)
    .replace("{{COURSE_TITLE}}", course.title)
    .replace("{{COURSE_AUTHOR}}", course.author)
    .replace("{{COURSE_RATINGS_COUNT}}", course.rankings.count)
    .replace("{{COURSE_FULL_PRICE}}", course.price.full)
    .replace("{{COURSE_PRICE_WITH_DISCOUNT}}", course.price.discounted)
    .replace("{{COURSE_START_AT}}", course.startAt)
    .replace("{{COURSE_DURATION}}", course.duration)
    .replace("{{COURSE_STARS}}", course.rankings.stars)
    .replace("{{COURSE_HIGHLIGHT}}", course.highlight)
    .replace("{{COURSE_VACANCIES}}", course.vacancies ?? 0)
    .replace("{{COURSE_LEVEL}}", course.level ?? 0)
    .replace("{{COURSE_PRICE}}", course.price.raw)
    .replace(
      "{{COURSE_DESCRIPTION}}",
      course.description ?? "Lorem ipsum dolor sit amet",
    )
    .mountAndSend();
}

export const COURSE_ROUTE_MATCH = "/curso/:slug";
