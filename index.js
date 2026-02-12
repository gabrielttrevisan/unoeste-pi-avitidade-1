import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import handleHomeContent, { HOME_ROUTE_MATCH } from "./router/home.handler.js";
import handleError from "./router/error.handler.js";
import handleCourse, { COURSE_ROUTE_MATCH } from "./router/course.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3004;

const app = express();

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: 2048 * 1000,
  }),
);

app.get(HOME_ROUTE_MATCH, handleHomeContent);
app.get(COURSE_ROUTE_MATCH, handleCourse);

app.use((req, res) => {
  handleError(req, res, { code: 404, message: "Página não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});
