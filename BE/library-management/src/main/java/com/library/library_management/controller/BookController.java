package com.library.library_management.controller;

import com.library.library_management.dto.request.BookCreationRequest;
import com.library.library_management.dto.request.BookDeleteRequest;
import com.library.library_management.dto.request.BookUpdateRequest;
import com.library.library_management.entity.Book;
import com.library.library_management.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/books")
@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping("/")
     public List<Book> getALlBook(){
        return bookService.getAllBooks();
    }
    @GetMapping("/{bookId}")
    Optional<Book> getBook(@PathVariable("bookId") Integer bookId){
        return bookService.getBook(bookId);
    }

    @PostMapping
    Book createBook(@RequestBody BookCreationRequest request){
        return bookService.createBook(request);
    }

    @PutMapping("/{bookId}")
    Book updateBook(@PathVariable("bookId") Integer bookId,
                    @RequestBody BookUpdateRequest request){
        return bookService.updateBook(bookId, request);
    }

    @DeleteMapping("/{bookId}")
    String deleteBook(@PathVariable("bookId") Integer bookId,
                      @RequestBody BookDeleteRequest request){
        bookService.deleteBook(bookId, request.getUserId());
        return "Book has been deleted";
    }
}
