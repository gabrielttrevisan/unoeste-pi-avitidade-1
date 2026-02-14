import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_LINK = "{{AUTH_LINK}}";
const AUTH_LINK_TEXT = "{{AUTH_LINK_TEXT}}";
const METADATA_TITLE = "{{TITLE}}";
const CONTENT = "{{CONTENT}}";

export default class HTMLContentBuilder {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {HTMLContentBuilder}
   */
  static create(req, res) {
    return new HTMLContentBuilder(req, res);
  }

  #isUserSignedIn = false;
  #title = "Cursemy";
  #content = "";
  #replaceAfter = new Map();
  #styles = new Set();

  /**
   * @type {import("express").Response} res
   */
  #res;

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  constructor(req, res) {
    this.#isUserSignedIn = req.session?.isUserSignedIn;
    this.#res = res;
  }

  setContent(value) {
    if (typeof value !== "string") return;

    this.#content = value;

    return this;
  }

  setTitle(value) {
    if (typeof value !== "string") return;

    this.#title = value;

    return this;
  }

  withStylesheet(path) {
    if (typeof path !== "string") return;

    this.#styles.add(`<link rel="stylesheet" href="/styles/${path}.css">`);

    return this;
  }

  /**
   * @param {string} key
   * @param {string} value
   * @returns {HTMLContentBuilder}
   */
  replace(key, value) {
    if (typeof key !== "string") return this;

    this.#replaceAfter.set(key, value ?? "");

    return this;
  }

  async render() {
    const mounted = await this.mount();

    this.#res.setHeader("Content-Type", "text/html");
    this.#res.setHeader("Cache-Control", "no-cache");
    this.#res.status(200);

    this.#res.send(mounted);
  }

  async mount() {
    const layout = await readFile(
      path.join(__dirname, "../components/layout.html"),
      "utf-8",
    );

    const withContent = layout.replaceAll(CONTENT, this.#content);
    const withTitle = withContent.replaceAll(METADATA_TITLE, this.#title);
    const withAuthLink = await this.#mountAuthLink(withTitle);
    const withStyles = withAuthLink.replaceAll(
      "{{STYLES}}",
      Array.from(this.#styles).join("") || "",
    );
    const replacedKeys = Array.from(this.#replaceAfter.entries()).reduce(
      (prev, [key, value]) => prev.replaceAll(key, value),
      withStyles,
    );

    return replacedKeys.replace(/\s{2,}/gi, " ");
  }

  /**
   *
   * @param {string} value
   * @returns {string}
   */
  async #mountAuthLink(value) {
    if (this.#isUserSignedIn) {
      const signOutButton = await readFile(
        path.join(__dirname, "../components/sign-out-button.html"),
        "utf-8",
      );

      return value
        .replaceAll(AUTH_LINK, signOutButton)
        .replaceAll(AUTH_LINK_TEXT, `<a href="/sign-out">SAIR</a>`);
    } else {
      const signInButton = await readFile(
        path.join(__dirname, "../components/sign-in-button.html"),
        "utf-8",
      );

      return value
        .replaceAll(AUTH_LINK, signInButton)
        .replaceAll(
          AUTH_LINK_TEXT,
          `<a href="/sign-in">ENTRAR</a><a href="/sign-up">CADASTRAR-SE</a>`,
        );
    }
  }
}
