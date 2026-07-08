package com.library.library_management.controller;

import com.library.library_management.dto.request.BorrowCreationRequest;
import com.library.library_management.entity.Borrow;
import com.library.library_management.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/borrows")
@RestController
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping("/borrow")
    public Borrow borrowBook(@RequestBody BorrowCreationRequest request) {
        return borrowService.borrowBook(request);
    }

    @PutMapping("/return/{borrowId}")
    public Borrow returnBook(@PathVariable Integer borrowId) {
        return borrowService.returnBook(borrowId);
    }
}
