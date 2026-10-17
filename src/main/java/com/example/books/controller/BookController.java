package com.example.books.controller;

import com.example.books.model.Book;
import com.example.books.repository.BookRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController: every method returns JSON
// @RequestMapping: all routes start with /api/books
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookRepository repository;

    // Spring injects the repository automatically (dependency injection)
    public BookController(BookRepository repository) {
        this.repository = repository;
    }

    // READ (all)  ->  GET /api/books
    @GetMapping
    public List<Book> getAll() {
        return repository.findAll();
    }

    // READ (one)  ->  GET /api/books/1
    @GetMapping("/{id}")
    public ResponseEntity<Book> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE  ->  POST /api/books
    @PostMapping
    public ResponseEntity<Book> create(@Valid @RequestBody Book book) {
        book.setId(null); // the database generates the id, ignore any id sent by the client
        Book saved = repository.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // UPDATE  ->  PUT /api/books/1
    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id,
                                       @Valid @RequestBody Book data) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setTitle(data.getTitle());
                    existing.setAuthor(data.getAuthor());
                    existing.setIsbn(data.getIsbn());
                    existing.setPublicationYear(data.getPublicationYear());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE  ->  DELETE /api/books/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
