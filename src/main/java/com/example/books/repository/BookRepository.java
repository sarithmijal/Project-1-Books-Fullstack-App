package com.example.books.repository;

import com.example.books.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

// Extending JpaRepository gives us save, findAll, findById, deleteById,
// existsById and more, without writing any SQL.
public interface BookRepository extends JpaRepository<Book, Long> {
}
