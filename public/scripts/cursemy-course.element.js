class CursemyCourseElement extends HTMLElement {
  #shadow;
  /** @type {HTMLElement|null} */
  #starsElement = null;
  /** @type {HTMLAnchorElement|null} */
  #link = null;
  /** @type {HTMLImageElement|null} */
  #thumbnail = null;
  /** @type {HTMLElement|null} */
  #card = null;

  #quantity = 1;
  #price = 0;
  #maxVacancies = 50;

  /** @type {HTMLInputElement|null} */
  #inputSlug = null;
  /** @type {HTMLInputElement|null} */
  #inputPrice = null;
  /** @type {HTMLInputElement|null} */
  #inputQuantity = null;
  /** @type {HTMLOutputElement|null} */
  #outputPrice = null;
  /** @type {HTMLOutputElement|null} */
  #outputVacancies = null;
  /** @type {HTMLButtonElement|null} */
  #submitButton = null;
  /** @type {HTMLButtonElement|null} */
  #addButton = null;
  /** @type {HTMLButtonElement|null} */
  #subButton = null;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });

    this.#init();
  }

  #init() {
    /** @type {HTMLTemplateElement|null} */
    const template = document.getElementById("cursemy-course");

    if (!template) {
      throw Error("Missing CursmyCardElement template");
    }

    const templateContent = template.content;
    const node = document.importNode(templateContent, true);

    this.#shadow.appendChild(node);

    this.#starsElement = this.#shadow.querySelector(
      ".cursemy-card__content-ranking-stars",
    );
    this.#link = this.#shadow.querySelector("#cursemy-card-link");
    this.#thumbnail = this.#shadow.querySelector(
      ".cursemy-card__image-box img",
    );
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

  get discountedPrice() {
    const raw = this.getAttribute("discounted-price");
    const parsed = raw ? parseFloat(raw) : 0;

    if (isNaN(parsed)) return 0;

    return parsed;
  }

  get vacancies() {
    const raw = this.getAttribute("vacancies");
    const parsed = raw ? parseInt(raw) : 0;

    if (isNaN(parsed)) return 0;

    return parsed;
  }

  static get observedAttributes() {
    return [
      "stars",
      "image-path",
      "slug",
      "highlight",
      "discounted-price",
      "vacancies",
    ];
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
        };
        this.#thumbnail.src = `/images/thumbnails/${slug}.webp`;
      } else {
        this.#thumbnail.src = `/images/placeholder.webp`;
      }
    }

    if (this.#card) {
      this.#card.classList.remove("--loading");

      if (this.highlight) {
        this.#card.classList.add("--highlight");
      }
    }

    const price = this.discountedPrice;
    const vacancies = this.vacancies;
    const inputPrice = this.#shadow.querySelector(
      "input[type='hidden'][name='total']",
    );
    const inputQuantity = this.#shadow.querySelector(
      "input[type='text'][name='quantity']",
    );
    const inputSlug = this.#shadow.querySelector(
      "input[type='hidden'][name='slug']",
    );
    const outputPrice = this.#shadow.querySelector("output.form__output-total");
    const outputVacancies = this.#shadow.querySelector(
      "output.form__output-vacancies",
    );
    const submitButton = this.#shadow.querySelector("button[type='submit']");
    const subButton = this.#shadow.querySelector(
      "button.form-field__number-sub",
    );
    const addButton = this.#shadow.querySelector(
      "button.form-field__number-add",
    );

    if (
      !price ||
      !inputPrice ||
      !inputQuantity ||
      !inputSlug ||
      !slug ||
      !outputPrice ||
      !submitButton ||
      !subButton ||
      !addButton ||
      !vacancies ||
      !outputVacancies
    )
      return;

    this.#price = price;

    this.#inputPrice = inputPrice;
    this.#inputPrice.value = this.#price;

    this.#maxVacancies = vacancies;

    this.#inputQuantity = inputQuantity;
    this.#inputQuantity.value = this.#quantity;

    this.#inputSlug = inputSlug;
    this.#inputSlug.value = slug;

    this.#outputPrice = outputPrice;
    this.#outputPrice.textContent = this.#maskCurrency(price);

    this.#outputVacancies = outputVacancies;
    this.#outputVacancies.textContent = this.#maskVacancies(this.#quantity);

    this.#addButton = addButton;
    this.#addButton.addEventListener("click", () => {
      this.#quantity += 1;

      if (this.#quantity > this.#maxVacancies)
        this.#quantity = this.#maxVacancies;

      const total = this.#quantity * this.#price;
      const formatted = this.#maskCurrency(total);

      this.#inputPrice.value = total;
      this.#inputQuantity.value = this.#quantity;
      this.#outputPrice.textContent = formatted;
      this.#outputVacancies.textContent = this.#maskVacancies(this.#quantity);
    });

    this.#subButton = subButton;
    this.#subButton.addEventListener("click", () => {
      this.#quantity -= 1;

      if (this.#quantity <= 0) this.#quantity = 1;

      const total = this.#quantity * this.#price;
      const formatted = this.#maskCurrency(total);

      this.#inputPrice.value = total;
      this.#inputQuantity.value = this.#quantity;
      this.#outputPrice.textContent = formatted;
      this.#outputVacancies.textContent = this.#maskVacancies(this.#quantity);
    });

    this.#submitButton = submitButton;
    this.#submitButton.disabled = false;
  }

  #maskCurrency(value) {
    return new Intl.NumberFormat("pt-br", {
      currency: "BRL",
    }).format(value);
  }

  #maskVacancies(value) {
    if (value === 1) return "1 vaga";

    return `${value} vagas`;
  }
}

customElements.define("cursemy-course", CursemyCourseElement);
