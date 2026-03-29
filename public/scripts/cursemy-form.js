/**
 * @typedef {Object} Components
 * @prop {Toast} toast
 * @prop {CursemyList} list
 * @prop {CursemyForm} form
 */

class Toast {
  #region;

  constructor() {
    const region = document.getElementById("toast-region");

    if (!region) throw new Error("Unable to initialize toast");

    this.#region = region;
  }

  show(message, type) {
    const toast = document.createElement("div");

    toast.innerHTML = message;
    toast.classList.add("m-toast", `--${type}`);

    this.#region.prepend(toast);

    setTimeout(() => this.#region.removeChild(toast), 2000);
  }

  error(message) {
    this.show(message, "error");
  }

  success(message) {
    this.show(message, "success");
  }
}

class CursemyForm {
  /** @type {HTMLFormElement} */
  #form;
  /** @type {Components} */
  #view;
  #levels;

  /**
   *
   * @param {string} [id]
   * @param {Components} view
   */
  constructor(id = "course-form", view) {
    const form = document.getElementById(id);

    if (!form) throw new Error("Unable to initialize CursemyForm");

    this.#form = form;
    this.#view = view;
    this.#levels = [];

    this.#init();
  }

  #init() {
    this.#form.addEventListener("submit", (e) => this.#handleSubmit(e));

    const validationByName = this.validationByName;

    Array.from(this.#form.elements).forEach((element) => {
      const name = element.getAttribute("name");
      const validate = validationByName[name];

      if (name && validate)
        element.addEventListener("input", () => {
          const result = validate(element.value, this.values);

          if (typeof result === "string") element.setCustomValidity(result);
          else element.setCustomValidity("");

          element.reportValidity();
        });
    });

    const select = this.#form.querySelector("select[name='level']");

    if (select)
      fetch("http://localhost:3004/level", {
        headers: {
          Accept: "application/json",
        },
      })
        .catch(() => this.#error())
        .then((response) => response.json())
        .then((response) => {
          if (
            !response ||
            !response.data ||
            !Array.isArray(response.data) ||
            response.error
          ) {
            this.#error();
            return;
          }

          response.data.forEach((level) => {
            const option = document.createElement("option");

            option.value = level.id;
            option.textContent = `${level.name[0].toUpperCase()}${level.name.slice(1)}`;

            select.appendChild(option);
            this.#levels.push(level.id);
          });
        });
  }

  #error() {
    this.#form.classList.add("--invalid");
  }

  #validateId() {
    return true;
  }

  #validateSlug(value) {
    return (
      /^[a-z0-9\-]+$/i.test(value) ||
      "Slug inválido. Deve conter apenas letra, número ou hífen."
    );
  }

  #validateTitle(value) {
    return (
      /^[^]{8,}$/i.test(value) ||
      "Título inválido. Deve ter pelo menos 8 caracteres."
    );
  }

  #validateDesc(value) {
    return (
      /^[^]{32,}$/i.test(value) ||
      "Descrição inválida. Deve ter pelo menos 32 caracteres."
    );
  }

  #validateAvailableSpots(value) {
    const errorMessage = "Vagas inválida. Deve variar entre 1 e 999.";

    if (!value) return errorMessage;

    const parsed = parseInt(value);

    if (isNaN(parsed)) return errorMessage;

    return (parsed > 0 && parsed < 1000) || errorMessage;
  }

  #validateDurationCount(value, values) {
    const errorMessage = "Duração inválida. Deve variar entre 1 e 99.";

    if (!value) return errorMessage;

    const parsed = parseInt(value);

    if (isNaN(parsed)) return errorMessage;

    const period = values.durationPeriod;

    if (!period) return errorMessage;

    if (period === "hour") return (parsed > 0 && parsed < 200) || errorMessage;

    if (period === "week") return (parsed > 0 && parsed < 149) || errorMessage;

    if (period === "month") return (parsed > 0 && parsed < 37) || errorMessage;

    return errorMessage;
  }
  #validateDurationPeriod(value) {
    const errorMessage = "Período inválido. Selecione um período válido.";

    if (!value) return errorMessage;
  }

  #validateLevel(value) {
    const errorMessage = "Nível inválido. Selecione um nível válido.";

    if (!value) return errorMessage;

    const parsed = parseInt(value);

    if (isNaN(parsed)) return errorMessage;

    if (!this.#levels.includes(parsed)) return errorMessage;

    return true;
  }

  #validateStartAt(value) {
    const errorMessage =
      "A data inicial deve ser informada e ser depois de hoje.";

    if (!value) return errorMessage;

    const match = value.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/);

    if (!match) return errorMessage;

    const [, year, month, day] = match;

    const date = new Date(
      parseInt(year),
      parseInt(month),
      parseInt(day),
      0,
      0,
      0,
      1,
    );

    if (date <= new Date()) return errorMessage;

    return true;
  }

  #getStartAt(value) {
    const fallback = null;

    if (!value) return fallback;

    const match = value.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/);

    if (!match) return fallback;

    const [, year, month, day] = match;

    const date = new Date(parseInt(year), parseInt(month), parseInt(day));

    return date;
  }

  #validatePrice(value) {
    const errorMessage = "O preço não deve ser 0 ou não numérico";

    if (!value) return errorMessage;

    const parsed = parseFloat(value.replace(/,/g, "."));

    if (isNaN(parsed)) return errorMessage;

    if (parsed === 0) return errorMessage;

    return true;
  }

  #validateDiscount(value, values) {
    const errorMessage =
      "O preço com desconto não deve ser 0 e não deve ser igual ou menor que o valor original";

    if (!value || !values || !values.price) return errorMessage;

    const parsed = parseFloat(value.replace(/,/g, "."));
    const parsedPrice = parseFloat(values.price.replace(/,/g, "."));

    if (isNaN(parsed) || isNaN(parsedPrice)) return errorMessage;

    if (parsed === 0 || parsed >= parsedPrice) return errorMessage;

    return true;
  }

  #validateAuthor(value) {
    const errorMessage =
      "Nome do responsável deve conter pelo menos 4 caracteres";

    if (!value) return errorMessage;

    return /^[^]{4,}$/.test(value);
  }

  get validationByName() {
    return {
      id: () => this.#validateId(),
      slug: (value) => this.#validateSlug(value),
      desc: (value) => this.#validateDesc(value),
      durationPeriod: (value) => this.#validateDurationPeriod(value),
      durationCount: (value, values) =>
        this.#validateDurationCount(value, values),
      title: (value) => this.#validateTitle(value),
      level: (value) => this.#validateLevel(value),
      availableSpots: (value) => this.#validateAvailableSpots(value),
      startAt: (value) => this.#validateStartAt(value),
      price: (value, values) => this.#validatePrice(value, values),
      discount: (value, values) => this.#validateDiscount(value, values),
      author: (value) => this.#validateAuthor(value),
    };
  }

  get values() {
    return Array.from(this.#form.elements).reduce(
      (prev, cur) => ({
        ...prev,
        [cur.getAttribute("name")]: cur.value.trim(),
      }),
      {},
    );
  }

  #getDuration(durationPeriod, durationCount) {
    const isPlural = parseInt(durationCount) > 1 ? true : false;

    if (durationPeriod === "hour") return isPlural ? "horas" : "hora";

    if (durationPeriod === "week") return isPlural ? "semanas" : "semana";

    if (durationPeriod === "month") return isPlural ? "meses" : "mês";

    return "";
  }

  edit(course) {
    const inputId = this.#form.elements.namedItem("id");
    const inputSlug = this.#form.elements.namedItem("slug");
    const inputTitle = this.#form.elements.namedItem("title");
    const inputDesc = this.#form.elements.namedItem("desc");
    const inputAuthor = this.#form.elements.namedItem("author");
    const inputStartAt = this.#form.elements.namedItem("startAt");
    /** @type {HTMLSelectElement} */
    const inputLevel = this.#form.elements.namedItem("level");
    const inputSpots = this.#form.elements.namedItem("availableSpots");
    /** @type {HTMLInputElement} */
    const inputHighlight = this.#form.elements.namedItem("isHighlight");
    const inputDurCount = this.#form.elements.namedItem("durationCount");
    const inputDurPeriod = this.#form.elements.namedItem("durationPeriod");
    const inputPrice = this.#form.elements.namedItem("price");
    const inputDisc = this.#form.elements.namedItem("discount");

    inputId.value = course.id;
    inputSlug.value = course.slug;
    inputDesc.value = course.description;
    inputAuthor.value = course.author;
    inputDisc.value = course.priceWithDiscount.toLocaleString("en-us");
    inputPrice.value = course.price.toLocaleString("en-us");
    inputHighlight.checked = [true, "true"].includes(course.isHighlight);
    inputLevel.value = course.level.id;
    inputSpots.value = course.spotsAvailable;
    inputTitle.value = course.title;

    const startAt = new Date(course.startAt);

    inputStartAt.value = `${startAt.getFullYear()}-${(startAt.getMonth() + 1).toString().padStart(2, "0")}-${startAt.getDate().toString().padStart(2, "0")}`;

    const [, count, rawPeriod] = course.duration.match(/^\s*(\d+)\s*(\w+)\s*$/);

    inputDurCount.value = parseInt(count);

    if (rawPeriod.match(/(m[êe]s)/)) inputDurPeriod.value = "month";
    else if (rawPeriod.match(/(semana)/)) inputDurPeriod.value = "week";
    else if (rawPeriod.match(/(hora)/)) inputDurPeriod.value = "hour";

    this.#form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /**
   * @param {SubmitEvent} e
   */
  #handleSubmit(e) {
    e.preventDefault();

    const elements = Array.from(this.#form.elements);
    const values = this.values;
    const validationByName = this.validationByName;

    for (const element of elements) {
      const validate = validationByName[element.getAttribute("name")];

      if (!validate) continue;

      const value = element.value.trim();
      const result = validate(value, values);

      if (typeof result === "string") {
        element.setCustomValidity(result);
      } else element.setCustomValidity("");

      element.reportValidity();
    }

    if (this.#form.checkValidity()) {
      const formData = new FormData(this.#form);
      /** @type {HTMLButtonElement} */
      const submit = this.#form.querySelector("[type='submit']");
      const id = formData.get("id");

      if (!submit)
        this.#view.toast.show("Eita, pai. Deu algo errado.", "error");

      submit.disabled = true;

      const body = JSON.stringify({
        author: formData.get("author"),
        description: formData.get("desc"),
        duration: `${formData.get("durationCount")} ${this.#getDuration(formData.get("durationPeriod"), formData.get("durationCount"))}`,
        isHighlight: ["true", true, "on"].includes(formData.get("isHighlight")),
        levelId: parseInt(formData.get("level")),
        price: parseFloat(formData.get("price")),
        priceWithDiscount: parseFloat(formData.get("discount")),
        slug: formData.get("slug"),
        spotsAvailable: parseInt(formData.get("availableSpots")),
        startAt: this.#getStartAt(formData.get("startAt")),
        title: formData.get("title"),
      });

      if (id) {
        fetch("http://localhost:3004/course/" + id, {
          method: "PUT",
          body,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.error) {
              if (response.error.message)
                this.#view.toast.error(response.error.message);
            } else {
              this.#view.toast.success(
                `Curso #${id} editado com sucesso.<br/>ID:${response.data.id}`,
              );
              this.#form.reset();
              this.#view.list.render();
            }
          })
          .finally(() => (submit.disabled = false));
      } else {
        fetch("http://localhost:3004/course", {
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.error) {
              if (response.error.message)
                this.#view.toast.error(response.error.message);
            } else {
              this.#view.toast.success(
                `Curso criado com sucesso.<br/>ID:${response.data.id}`,
              );
              this.#form.reset();
              this.#view.list.render();
            }
          })
          .finally(() => (submit.disabled = false));
      }
    }
  }
}

class CursemyList {
  #tableBody;
  /** @type {Components} */
  #view;

  /**
   * @param {Components} view
   */
  constructor(view) {
    const tableBody = document.querySelector("#courses tbody");

    if (!tableBody) throw Error("Unable to initialize CursemyList");

    this.#tableBody = tableBody;
    this.#view = view;

    this.render();
  }

  render() {
    this.#tableBody.innerHTML = "";

    fetch("http://localhost:3004/course?limit=1000")
      .then((response) => response.json())
      .then((response) => {
        if (response.error) this.#view.toast.error(response.error.message);
        else {
          if (!response.data || !Array.isArray(response.data))
            this.#view.toast.error("Eita, pai. Deu merda");

          for (const course of response.data) {
            const tr = document.createElement("tr");

            const id = document.createElement("td");
            const slug = document.createElement("td");
            const author = document.createElement("td");
            const level = document.createElement("td");
            const startAt = document.createElement("td");
            const availableSpots = document.createElement("td");
            const actions = document.createElement("td");

            const deleteBtn = document.createElement("button");
            const editBtn = document.createElement("button");

            id.textContent = course.id;
            slug.textContent = course.slug;
            slug.classList.add("--w150");
            author.textContent = course.author;
            author.classList.add("--w150");
            level.innerHTML = `<span class="m-level">${course.level.name}</span>`;
            startAt.textContent = new Date(course.startAt).toLocaleDateString(
              "pt-br",
              {
                dateStyle: "short",
              },
            );
            availableSpots.textContent = course.spotsAvailable;

            editBtn.type = "button";
            editBtn.textContent = "Editar";
            editBtn.classList.add("m-action-btn", "--edit");

            editBtn.addEventListener("click", (e) => {
              e.preventDefault();

              this.#view.form.edit(course);
            });

            deleteBtn.type = "button";
            deleteBtn.textContent = "Deletar";
            deleteBtn.classList.add("m-action-btn", "--delete");

            deleteBtn.addEventListener("click", (e) => {
              e.preventDefault();

              fetch("http://localhost:3004/course/" + course.id, {
                method: "DELETE",
              })
                .catch(() =>
                  this.#view.toast.error("Não rolou não. Dá seu jeito"),
                )
                .then((response) => response.json())
                .then((response) => {
                  if (response.data) {
                    this.#view.toast.success(
                      "Curso #" + course.id + " deletado com sucesso",
                    );
                    this.#tableBody.removeChild(tr);
                  } else if (response.error) {
                    this.#view.toast.error(
                      response.error.message ??
                        "Erro ao deletar curso #" + course.id,
                    );
                  }
                });
            });

            actions.append(editBtn, deleteBtn);

            tr.append(
              id,
              slug,
              author,
              level,
              startAt,
              availableSpots,
              actions,
            );

            this.#tableBody.appendChild(tr);
          }
        }
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  /** @type {Components} */
  const components = { form: null, list: null, toast: new Toast() };

  components.form = new CursemyForm(undefined, components);
  components.list = new CursemyList(components);
});
