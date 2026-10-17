// All the calls to YOUR Spring Boot backend (the books CRUD).
// The frontend is served by the same Spring Boot application, so both share the
// same origin (http://localhost:8080) and a relative URL is enough. No CORS needed.
const BACKEND_URL = "/api/books";

// fetch() returns a PROMISE. "await" waits for the response without freezing the page.
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  // DELETE answers 204 No Content: there is no JSON body to parse
  return response.status === 204 ? null : response.json();
}

const JSON_HEADERS = { "Content-Type": "application/json" };

// READ (all)  ->  GET /api/books
const getBooks = () => request(BACKEND_URL);

// READ (one)  ->  GET /api/books/{id}
const getBook = (id) => request(`${BACKEND_URL}/${id}`);

// CREATE  ->  POST /api/books
const createBook = (book) =>
  request(BACKEND_URL, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(book) });

// UPDATE  ->  PUT /api/books/{id}
const updateBook = (id, book) =>
  request(`${BACKEND_URL}/${id}`, { method: "PUT", headers: JSON_HEADERS, body: JSON.stringify(book) });

// DELETE  ->  DELETE /api/books/{id}
const deleteBook = (id) => request(`${BACKEND_URL}/${id}`, { method: "DELETE" });
