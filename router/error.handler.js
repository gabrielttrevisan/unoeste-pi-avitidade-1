import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} ErrorContext
 * @prop {number} statusCode
 * @prop {string} statusMessage
 * @prop {import("http").IncomingMessage} req
 * @prop {import("http").ServerResponse} res
 */

/**
 * @param {ErrorContext} context
 */
export default function handleRequestError({ res, statusCode, statusMessage }) {
  const error = readFileSync(
    path.join(__dirname, "../public/error.html"),
    "utf-8",
  );
  const content = error
    .replace(/{{STATUS_CODE}}/gi, statusCode.toString())
    .replace(/{{STATUS_MESSAGE}}/gi, statusMessage);

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html");
  res.end(content);
}
