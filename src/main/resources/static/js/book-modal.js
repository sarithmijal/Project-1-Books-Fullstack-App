// Book details inside a modal (overlay) with the Back, Edit and Delete buttons.
// Opened when the user clicks a card. "onChanged" is called after editing or
// deleting so the list behind the modal refreshes.

async function showBookModal(bookId, { onChanged } = {}) {
  const modal = openModal({ label: "Book details" });
  modal.body.replaceChildren(createLoading("Loading details..."));

  try {
    const book = await getBook(bookId); // GET /api/books/{id}
    if (!modal.isOpen()) return; // the user closed the modal while it was loading
    renderBook(modal, book, onChanged);
  } catch (error) {
    if (!modal.isOpen()) return;
    const actions = el("div", "actions");
    actions.append(createBackButton(modal));
    modal.body.replaceChildren(
      el("p", "error", "Could not load this book. Make sure the backend is running and the book still exists."),
      actions
    );
  }
}

function createBookFacts(book) {
  const facts = [
    ["ID", book.id],
    ["ISBN", book.isbn],
    ["Publication year", book.publicationYear],
  ];
  const list = el("dl", "facts");
  facts.forEach(([label, value]) => {
    const item = el("div");
    item.append(el("dt", null, label), el("dd", null, String(value)));
    list.append(item);
  });
  return list;
}

function renderBook(modal, book, onChanged) {
  const picture = el("img", "detail__image");
  picture.src = coverUrl(book);
  picture.alt = `Cover of ${book.title}`;
  // If the real cover does not exist, draw our own
  picture.addEventListener("error", () => (picture.src = generatedCover(book)), { once: true });

  const info = el("div");
  info.append(el("p", "card__subtitle", "Book"));
  info.append(el("h2", "detail__title", book.title));
  info.append(el("p", "detail__genus", `Written by ${book.author}`));

  const factsPanel = el("section", "panel");
  factsPanel.append(el("h3", null, "Details"), createBookFacts(book));

  // --- Edit form (hidden until the user presses "Edit") ---
  const editSection = el("div");
  editSection.hidden = true;
  editSection.append(
    createBookForm({
      book,
      submitLabel: "Save changes",
      onCancel: () => (editSection.hidden = true),
      onSubmit: async (data) => {
        await updateBook(book.id, data); // PUT /api/books/{id}
        renderBook(modal, await getBook(book.id), onChanged); // show the saved data
        if (onChanged) await onChanged(); // refresh the cards behind the modal
      },
    })
  );

  // --- Delete confirmation (hidden until the user presses "Delete") ---
  const confirmBox = el("div", "panel confirm");
  confirmBox.hidden = true;
  const confirmError = el("p", "error");
  confirmError.hidden = true;
  const yesButton = el("button", "btn btn--danger", "Yes, delete");
  yesButton.type = "button";
  const cancelButton = el("button", "btn btn--ghost", "Cancel");
  cancelButton.type = "button";
  const confirmActions = el("div", "form-actions");
  confirmActions.append(yesButton, cancelButton);
  confirmBox.append(el("p", null, `Delete "${book.title}"? This cannot be undone.`), confirmError, confirmActions);

  // --- Main buttons ---
  const editButton = el("button", "btn", "Edit");
  editButton.type = "button";
  const deleteButton = el("button", "btn btn--danger", "Delete");
  deleteButton.type = "button";
  const actions = el("div", "actions");
  actions.append(editButton, deleteButton, createBackButton(modal));

  editButton.addEventListener("click", () => (editSection.hidden = !editSection.hidden));

  deleteButton.addEventListener("click", () => {
    editSection.hidden = true;
    actions.hidden = true;
    confirmBox.hidden = false;
  });

  cancelButton.addEventListener("click", () => {
    confirmBox.hidden = true;
    confirmError.hidden = true;
    actions.hidden = false;
  });

  yesButton.addEventListener("click", async () => {
    yesButton.disabled = true;
    try {
      await deleteBook(book.id); // DELETE /api/books/{id}
      modal.close();
      if (onChanged) await onChanged();
    } catch (error) {
      confirmError.textContent = "Could not delete this book. Is the backend running?";
      confirmError.hidden = false;
      yesButton.disabled = false;
    }
  });

  info.append(factsPanel, actions, editSection, confirmBox);

  const layout = el("section", "detail");
  layout.append(picture, info);
  modal.body.replaceChildren(layout);
  modal.body.scrollTop = 0;
}
