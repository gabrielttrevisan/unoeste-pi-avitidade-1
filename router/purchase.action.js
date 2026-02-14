import handleErrorPage from "./error.page.js";
import COURSES from "../data/courses.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function handlePurchaseAction(req, res) {
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

  if (!req.body)
    return handleErrorPage(req, res, {
      code: 400,
      message: "Requisição inválida",
    });

  const { quantity, slug: formSlug } = req.body;

  if (!quantity || formSlug !== slug)
    return handleErrorPage(req, res, {
      code: 400,
      message: "Requisição inválida",
    });

  if (quantity > course.vacancies)
    return handleErrorPage(req, res, {
      code: 400,
      message: "Vagas insuficientes",
    });

  course.vacancies -= quantity;

  res.redirect(`/curso/${slug}`);
}

export const PURCHASE_ACTION_MATCH = "/purchase/:slug";
