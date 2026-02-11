import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import getHomePage, { ROUTE_MATCH } from "./router/home.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3004;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get(ROUTE_MATCH, getHomePage);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});
