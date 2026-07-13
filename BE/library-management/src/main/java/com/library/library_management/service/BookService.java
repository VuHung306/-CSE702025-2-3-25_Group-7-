package com.library.library_management.service;

import com.library.library_management.dto.request.BookCreationRequest;
import com.library.library_management.dto.request.BookUpdateRequest;
import com.library.library_management.entity.Book;
import com.library.library_management.entity.User;
import com.library.library_management.entity.Type;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.BorrowRepository;
import com.library.library_management.repository.UserRepository;
import com.library.library_management.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.HashSet;

@Service
public class BookService implements IBookService{
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private TypeRepository typeRepository;

    private void checkAdminOrLibrarian(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        String roleName = user.getRole().getName();

        if (!roleName.equalsIgnoreCase("ADMIN") && !roleName.equalsIgnoreCase("LIBRARIAN")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bạn không có quyền thực hiện chức năng này");
        }
    }

    @Override
    public List<Book> getAllBooks() {
        List<Book> books = bookRepository.findAllWithTypes();
        return books;
    }

    @Override
    public Optional<Book> getBook(Integer bookId) {
        Optional<Book> books = bookRepository.findById(bookId);
        return books;
    }

    @Override
    public Book createBook(BookCreationRequest request) {

        checkAdminOrLibrarian(request.getUserId());

        String name = request.getName();
        String author = request.getAuthor();
        LocalDate release_day = LocalDate.parse(request.getRelease_day());
        Boolean status = request.getStatus();
        String isbn = request.getIsbn();
        String publisher = request.getPublisher();

        Book book = new Book(name, author, release_day, status, isbn, publisher);

        if (request.getTypeIds() != null && !request.getTypeIds().isEmpty()) {
            List<Type> types = typeRepository.findAllById(request.getTypeIds());
            if (types.size() != request.getTypeIds().size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more categories do not exist");
            }
            book.setTypes(new HashSet<>(types));
        }

        bookRepository.save(book);

        return book;
    }

    @Override
    public Book updateBook(Integer bookId, BookUpdateRequest request) {

        checkAdminOrLibrarian(request.getUserId());

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setAuthor(request.getAuthor());
        book.setRelease_day(LocalDate.parse(request.getRelease_day()));
        book.setStatus(request.getStatus());
        book.setIsbn(request.getIsbn());
        book.setPublisher(request.getPublisher());

        return bookRepository.save(book);
    }

    @Override
    @Transactional
    public void deleteBook(Integer bookId, String userId){
        checkAdminOrLibrarian(userId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Book not found"));
        // Remove dependent rows first so MySQL foreign-key constraints do not
        // block deletion of a book that has categories or borrow records.
        borrowRepository.deleteByBookId(bookId);
        bookRepository.deleteTypeLinksByBookId(bookId);
        bookRepository.delete(book);
        // A category created only for this book should not remain in the
        // category dropdown after the book is deleted.
        typeRepository.deleteUnusedTypes();
    }
}
