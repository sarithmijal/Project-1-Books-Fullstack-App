# Books App – Backend, Database and Page 1

A small full-stack project: a **Spring Boot REST API** connected to **PostgreSQL**, plus a **Vanilla JavaScript** frontend (Page 1) served by the same application.

- Backend: Java 21, Spring Boot 3.5, Spring Web, Spring Data JPA, Validation
- Database: PostgreSQL
- Frontend: HTML, CSS and plain JavaScript (no frameworks, no libraries)

## Features

- Full CRUD for books (create, read, update, delete).
- Card layout with a responsive CSS Grid: 4 columns on large screens, 3 by default, 2 on tablets and 1 on phones.
- Real-time search: results are filtered on every keystroke (title, author, ISBN or year).
- Clicking a card opens a modal overlay with the book details and the buttons **Edit**, **Delete** and **Back**.
- Book covers are loaded from Open Library by ISBN, with a generated cover as fallback.

## Requirements

- JDK 21
- PostgreSQL (tested with 17)
- IntelliJ IDEA (or any IDE with Maven support)
- Internet connection (to download Maven dependencies and book covers)

## Database setup

The database itself is **not** stored in this repository. You only need to create an empty one; the `books` table is created automatically by Hibernate on the first run (`spring.jpa.hibernate.ddl-auto=update`).

1. Make sure PostgreSQL is running.
2. Create the database (using pgAdmin or `psql`):

   ```sql
   CREATE DATABASE books_db;
   ```

3. Open `src/main/resources/application.properties` and set **your** PostgreSQL password:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/books_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

   Do not commit your real password.

## Run the project

1. Open the project folder in IntelliJ (`File > Open`) and wait for Maven to download the dependencies.
2. Check that the project SDK is JDK 21 (`File > Project Structure > Project`).
3. Run `BooksApplication` (green ▶ next to `main`).
4. Open **http://localhost:8080** in your browser.

The frontend is served by Spring Boot from `src/main/resources/static`, so there is no separate frontend server and no CORS configuration is needed.

## Optional: sample data

Run this in pgAdmin (Query Tool on `books_db`) after the first start, once the table exists:

```sql
INSERT INTO books (title, author, isbn, publication_year) VALUES
('Clean Code', 'Robert C. Martin', '9780132350884', 2008),
('Effective Java', 'Joshua Bloch', '9780134685991', 2018),
('The Pragmatic Programmer', 'Andrew Hunt and David Thomas', '9780135957059', 2019),
('Design Patterns', 'Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides', '9780201633610', 1994);
```

If your column names differ, check the table in pgAdmin (`books_db > Schemas > public > Tables > books`). You can also create books from the **+ Add book** button in the app.

## REST API

Base URL: `http://localhost:8080/api/books`

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | `/api/books`       | List all books      |
| GET    | `/api/books/{id}`  | Get one book        |
| POST   | `/api/books`       | Create a book       |
| PUT    | `/api/books/{id}`  | Update a book       |
| DELETE | `/api/books/{id}`  | Delete a book       |

Example body for POST / PUT:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "publicationYear": 2008
}
```

## Project structure

```
books-app/
├── pom.xml
└── src/main/
    ├── java/com/example/books/
    │   ├── BooksApplication.java      # entry point
    │   ├── model/Book.java            # JPA entity
    │   ├── repository/BookRepository.java
    │   └── controller/BookController.java   # REST endpoints
    └── resources/
        ├── application.properties
        └── static/                    # Page 1 (frontend)
            ├── index.html
            ├── css/styles.css
            └── js/                    # card, modal, API client, page logic
```

## Common problems

- **Unsupported JDK / cannot compile for JVM target 21**: set the project SDK to JDK 21.
- **Password authentication failed**: wrong password in `application.properties`.
- **database "books_db" does not exist**: run `CREATE DATABASE books_db;`.
- **Port 8080 already in use**: stop the other running application.
- **"Could not connect to the backend"** in the page: PostgreSQL is stopped or the application is not running.

## Possible improvements

Pagination, DTOs, global error handling (`@ControllerAdvice`), unit and integration tests, authentication, database migrations with Flyway.