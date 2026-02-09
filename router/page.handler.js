import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handleRequestError from "./error.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} PageContext
 * @prop {string} url
 * @prop {import("http").IncomingMessage} req
 * @prop {import("http").ServerResponse} res
 */

/**
 * @param {PageContext} context
 */
export default function handleRequestPage({ res, url, ...context }) {
  let fileName = null;

  if (["/", "/index.html"].includes(url)) fileName = "index";
  else if (url.match(/\/curso\/([a-z0-9]{16,16})/gi)) fileName = "curso";
  else
    return handleRequestError({
      ...context,
      res,
      statusCode: 404,
      statusMessage: "Página não encontrada",
    });

  const file = readFileSync(
    path.join(__dirname, `../public/${fileName}.html`),
    "utf-8",
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(file);
}
