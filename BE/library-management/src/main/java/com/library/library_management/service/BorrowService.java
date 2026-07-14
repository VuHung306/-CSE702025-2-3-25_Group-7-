package com.library.library_management.service;

import com.library.library_management.dto.request.BorrowCreationRequest;
import com.library.library_management.entity.Book;
import com.library.library_management.entity.Borrow;
import com.library.library_management.entity.User;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.BorrowRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowService {
    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<Borrow> getAllBorrows() {
        return borrowRepository.findAll();
    }

    public Borrow borrowBook(BorrowCreationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        LocalDateTime borrowDate = LocalDateTime.parse(request.getBorrowDate());
        LocalDateTime dueDate = LocalDateTime.parse(request.getDueDate());
        long loanDays = ChronoUnit.DAYS.between(borrowDate.toLocalDate(), dueDate.toLocalDate());
        if (borrowDate.toLocalDate().isBefore(java.time.LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Borrow date cannot be in the past");
        }
        if (loanDays < 1 || loanDays > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Return date must be from 1 to 30 days after the borrow date");
        }

        Borrow borrow = new Borrow();
        borrow.setUser(user);
        borrow.setBook(book);
        borrow.setQuantity(request.getQuantity());
        borrow.setBorrowtime(borrowDate);
        borrow.setDuedate(dueDate);
        borrow.setReturntime(null);
        borrow.setFineamount(BigDecimal.ZERO);
        borrow.setStatus(false);
        book.setStatus(false);
        bookRepository.save(book);

        return borrowRepository.save(borrow);
    }

    public Borrow returnBook(Integer borrowId) {
        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));

        LocalDateTime returnTime = LocalDateTime.now();
        borrow.setReturntime(returnTime);
        borrow.setStatus(true);

        BigDecimal fine = BigDecimal.ZERO;

        if (returnTime.isAfter(borrow.getDuedate())) {
            long lateDays = ChronoUnit.DAYS.between(
                    borrow.getDuedate(),
                    returnTime
            );

            if (lateDays == 0) {
                lateDays = 1;
            }

            fine = BigDecimal.valueOf(lateDays).multiply(BigDecimal.valueOf(5000));
        }

        borrow.setFineamount(fine);

        borrow.getBook().setStatus(true);
        bookRepository.save(borrow.getBook());

        return borrowRepository.save(borrow);
    }
}
