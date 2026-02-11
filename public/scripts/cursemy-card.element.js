class CursemyCardElement extends HTMLElement {
  #shadow;
  /** @type {HTMLElement|null} */
  #starsElement = null;
  /** @type {HTMLAnchorElement|null} */
  #link = null;
  /** @type {HTMLImageElement|null} */
  #thumbnail = null;
  /** @type {HTMLElement|null} */
  #card = null;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#init();
  }

  #init() {
    /** @type {HTMLTemplateElement|null} */
    const template = document.getElementById("cursemy-card");

    if (!template) {
      throw Error("Missing CursmyCardElement template");
    }

    const templateContent = template.content;
    const node = document.importNode(templateContent, true)

    this.#shadow.appendChild(node);

    this.#starsElement = this.#shadow.querySelector(".cursemy-card__content-ranking-stars");
    this.#link = this.#shadow.querySelector("#cursemy-card-link");
    this.#thumbnail = this.#shadow.querySelector(".cursemy-card__image-box img");
    this.#card = this.#shadow.querySelector(".cursemy-card");
  }

  get stars() {
    const raw = this.getAttribute("stars");
    const parsedStars = parseFloat(raw);

    if (isNaN(parsedStars)) return 0;

    return parsedStars;
  }

  get slug() {
    return this.getAttribute("slug");
  }

  get imagePath() {
    return this.getAttribute("image-path");
  }

  get highlight() {
    const raw = this.getAttribute("highlight");
    const parsed = ["true", "", "highlight"].includes(raw);

    return parsed;
  }

  static get observedAttributes() {
    return ["stars", "image-path", "slug", "highlight"]
  }

  connectedCallback() {
    if (this.#starsElement) {
      this.#starsElement.style.setProperty("--stars", this.stars.toString());
    }

    const slug = this.slug;

    if (slug && this.#link) {
      this.#link.href = `/curso/${slug}`;
    }

    if (this.#thumbnail) {
      const imagePath = this.imagePath;

      if (imagePath) {
        this.#thumbnail.src = `/images/thumbnails/${imagePath}`;
      } else if (slug) {
        this.#thumbnail.onerror = () => {
          this.#thumbnail.src = `/images/placeholder.webp`;
        }
        this.#thumbnail.src = `/images/thumbnails/${slug}.webp`;
      } else {
        this.#thumbnail.src = `/images/placeholder.webp`;
      }
    }

    if (this.#card) {
      this.#card.classList.remove("--loading");

      if (this.highlight) {
        this.#card.classList.add("--highlight")
      }
    }
  }
}

customElements.define("cursemy-card", CursemyCardElement);
