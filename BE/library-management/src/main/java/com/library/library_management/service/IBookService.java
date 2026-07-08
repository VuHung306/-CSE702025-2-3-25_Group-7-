package com.library.library_management.service;

import com.library.library_management.dto.request.BookCreationRequest;
import com.library.library_management.dto.request.BookUpdateRequest;
import com.library.library_management.entity.Book;

import java.util.List;
import java.util.Optional;

public interface IBookService {
    List<Book> getAllBooks();

    Optional<Book> getBook(Integer bookId);

    Book createBook(BookCreationRequest request);

    Book updateBook(Integer bookId, BookUpdateRequest request);

    void deleteBook(Integer bookId, String userId);
}
