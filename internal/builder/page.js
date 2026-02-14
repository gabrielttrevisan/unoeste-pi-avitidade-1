import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_LINK = "{{AUTH_LINK}}";
const METADATA_TITLE = "{{TITLE}}";
const CONTENT = "{{CONTENT}}";

export default class PageBuilder {
  /**
   * @param {import("express").Request} req
   * @returns {PageBuilder}
   */
  static fromRequest(req) {
    return new PageBuilder(req);
  }

  #isUserSignedIn = false;
  #title = "Cursemy";
  #content = "";
  #replacements = new Map();

  /**
   * @param {import("express").Request} req
   */
  constructor(req) {
    this.#isUserSignedIn = req.session?.isUserSignedIn;
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

  /**
   *
   * @param {string} key
   * @param {string} value
   * @returns {PageBuilder}
   */
  replace(key, value) {
    if (typeof value !== "string" || typeof key !== "string") return;

    this.#replacements.set(key, value);

    return this;
  }

  async mount() {
    const layout = await readFile(
      path.join(__dirname, "../components/layout.html"),
      "utf-8",
    );

    const withContent = layout.replaceAll(CONTENT, this.#content);
    const withTitle = withContent.replaceAll(METADATA_TITLE, this.#title);
    const withAuthLink = await this.#mountAuthLink(withTitle);
    const replacedKeys = Array.from(this.#replacements.entries()).reduce(
      (prev, [key, value]) => prev.replaceAll(key, value),
      withAuthLink,
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

      return value.replaceAll(AUTH_LINK, signOutButton);
    } else {
      const signInButton = await readFile(
        path.join(__dirname, "../components/sign-in-button.html"),
        "utf-8",
      );

      return value.replaceAll(AUTH_LINK, signInButton);
    }
  }
}
