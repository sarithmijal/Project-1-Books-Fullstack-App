// Page 1: book cards loaded from YOUR Spring Boot backend, with REAL-TIME search.
// The "input" event fires on every keystroke, so the list updates instantly.

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const emptyMessage = document.getElementById("empty");
const resultsCount = document.getElementById("results-count");
const errorBox = document.getElementById("error");
const toggleFormButton = document.getElementById("toggle-form");
const formSection = document.getElementById("form-section");

let allBooks = []; // the books received from the backend

function renderBooks(books) {
  // One card per book, using the shared template
  const cards = books.map((book) =>
    createCard({
      image: coverUrl(book),
      fallbackImage: generatedCover(book), // used if there is no real cover
      title: book.title,
      subtitle: `ISBN ${book.isbn}`,
      description: `Written by ${book.author}. Published in ${book.publicationYear}.`,
      badges: [String(book.publicationYear)],
      imageFit: "contain",
      // Clicking the card opens the details in a modal (overlay) on top of this page
      onClick: () => showBookModal(book.id, { onChanged: loadBooks }),
    })
  );

  grid.replaceChildren(...cards);
  resultsCount.textContent = `${books.length} ${books.length === 1 ? "book" : "books"}`;

  emptyMessage.hidden = books.length > 0;
  emptyMessage.textContent = allBooks.length === 0 ? "No books yet. Add the first one with the button above." : "No books match your search.";
}

function filterBooks() {
  const query = searchInput.value.trim().toLowerCase();

  const matches = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query) ||
      String(book.publicationYear).includes(query)
  );

  renderBooks(matches);
}

// GET /api/books
async function loadBooks() {
  resultsCount.textContent = "Loading books...";
  try {
    allBooks = await getBooks();
    errorBox.hidden = true;
    filterBooks(); // keeps the current search text applied
  } catch (error) {
    grid.replaceChildren();
    emptyMessage.hidden = true;
    resultsCount.textContent = "";
    errorBox.textContent =
      "Could not connect to the backend. Make sure PostgreSQL is running and the Spring Boot application is started.";
    errorBox.hidden = false;
  }
}

// POST /api/books (called by the form)
async function handleCreate(bookData) {
  await createBook(bookData);
  formSection.hidden = true;
  toggleFormButton.textContent = "+ Add book";
  form.reset();
  await loadBooks();
}

const form = createBookForm({ submitLabel: "Add book", onSubmit: handleCreate });
formSection.append(form);

toggleFormButton.addEventListener("click", () => {
  formSection.hidden = !formSection.hidden;
  toggleFormButton.textContent = formSection.hidden ? "+ Add book" : "Close form";
});

// Real-time: runs on every keystroke
searchInput.addEventListener("input", filterBooks);

loadBooks();
