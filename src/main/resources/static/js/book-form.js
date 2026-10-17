// Form used to create a book (page 1) and to edit a book (detail page).
// - book: existing book to edit, or null for an empty form
// - onSubmit(data): async function that sends the data to the backend
// - onCancel: optional, shows a Cancel button
function createBookForm({ book = null, submitLabel = "Save book", onSubmit, onCancel }) {
  const form = el("form", "panel form-panel");
  const grid = el("div", "form-grid");

  const fields = [
    { name: "title", label: "Title", type: "text" },
    { name: "author", label: "Author", type: "text" },
    { name: "isbn", label: "ISBN", type: "text" },
    { name: "publicationYear", label: "Publication year", type: "number" },
  ];

  fields.forEach((field) => {
    const label = el("label", "field");
    const input = el("input");
    input.name = field.name;
    input.type = field.type;
    input.required = true;
    if (field.type === "number") {
      input.min = "1000"; // same limits as the backend validation
      input.max = "2100";
    }
    if (book) input.value = book[field.name];
    label.append(el("span", null, field.label), input);
    grid.append(label);
  });

  const message = el("p", "error");
  message.hidden = true;

  const submitButton = el("button", "btn", submitLabel);
  submitButton.type = "submit";
  const actions = el("div", "form-actions");
  actions.append(submitButton);

  if (onCancel) {
    const cancelButton = el("button", "btn btn--ghost", "Cancel");
    cancelButton.type = "button";
    cancelButton.addEventListener("click", onCancel);
    actions.append(cancelButton);
  }

  form.append(grid, message, actions);

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stops the browser from reloading the page
    const data = {
      title: form.title.value.trim(),
      author: form.author.value.trim(),
      isbn: form.isbn.value.trim(),
      publicationYear: Number(form.publicationYear.value),
    };

    submitButton.disabled = true;
    message.hidden = true;
    try {
      await onSubmit(data);
    } catch (error) {
      message.textContent = "Could not save the book. Check the data and make sure the backend is running.";
      message.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });

  return form;
}
