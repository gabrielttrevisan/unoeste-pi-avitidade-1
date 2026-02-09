import path from "path";
import { fileURLToPath } from "url";
import handleRequestError from "./router/error.handler.js";
import handleRequestPage from "./router/page.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
export default function handleRequest(req, res) {
  const method = req.method;

  if (!method || method !== "GET")
    return handleRequestError({
      req,
      res,
      statusCode: 405,
      statusMessage: "Método não permitido",
    });

  const url = req.url;

  console.log(`REQUESTED URL ${url}`);

  if (!url)
    return handleRequestError({
      res,
      req,
      statusCode: 400,
      statusMessage: "Requisição mal-formada",
    });

  handleRequestPage({ res, req, url });
}
