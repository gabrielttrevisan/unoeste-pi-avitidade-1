import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
export default function handleRequest(req, res) {
  const method = req.method;

  if (!method || method !== "GET") {
    const error = readFileSync(
      path.join(__dirname, "./public/error.html"),
      "utf-8",
    );
    const content = error
      .replace(/{{STATUS_CODE}}/gi, "405")
      .replace(/{{STATUS_MESSAGE}}/gi, "Método não permitido");

    res.statusCode = 405;
    res.setHeader("Content-Type", "text/html");
    res.end(content);

    return;
  }
}
