import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import handleHomePage, { HOME_ROUTE_MATCH } from "./router/home.page.js";
import handleErrorPage from "./router/error.page.js";
import handleCoursePage, { COURSE_ROUTE_MATCH } from "./router/course.page.js";
import handlePurchaseAction, {
  PURCHASE_ACTION_MATCH,
} from "./router/purchase.action.js";
import handleSignInPage, {
  SIGN_IN_ROUTE_MATCH,
} from "./router/sign-in.page.js";
import handleSignInAction, {
  SIGN_IN_ACTION_MATCH,
} from "./router/sign-in.action.js";
import auth from "./middleware/auth.js";
import handleSignOutAction, {
  SIGN_OUT_ACTION_MATCH,
} from "./router/sign-out.action.js";
import handleSignUpPage, {
  SIGN_UP_ROUTE_MATCH,
} from "./router/sign-up.page.js";
import handleSignUpAction, {
  SIGN_UP_ACTION_MATCH,
} from "./router/sign-up.action.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3004;

const app = express();

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: 2048 * 1000,
    cacheControl: true,
  }),
);

const DURATION_24H = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "amU493JyureF830Ku_sd-23ASkj",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: DURATION_24H,
    },
  }),
);

app.get(HOME_ROUTE_MATCH, handleHomePage);
app.get(COURSE_ROUTE_MATCH, auth, handleCoursePage);
app.get(SIGN_IN_ROUTE_MATCH, handleSignInPage);
app.get(SIGN_UP_ROUTE_MATCH, handleSignUpPage);

app.get(SIGN_OUT_ACTION_MATCH, auth, handleSignOutAction);

app.use(
  express.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded",
  }),
);

app.post(PURCHASE_ACTION_MATCH, auth, handlePurchaseAction);
app.post(SIGN_IN_ACTION_MATCH, handleSignInAction);
app.post(SIGN_UP_ACTION_MATCH, handleSignUpAction);

app.use((req, res) => {
  handleErrorPage(req, res, { code: 404, message: "Página não encontrada" });
});

app.listen(PORT, () => {
  console.log(`🔥 Listening on PORT ${PORT}...`);
});
