package com.library.library_management.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow")
public class Borrow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "borrowtime")
    private LocalDateTime borrowtime;

    @Column(name = "returntime")
    private LocalDateTime returntime;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "duedate")
    private LocalDateTime duedate;

    @Column(name = "fineamount", precision = 10, scale = 2)
    private BigDecimal fineamount;

    @Column(name = "status")
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    public Borrow() {
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getBorrowtime() {
        return borrowtime;
    }

    public void setBorrowtime(LocalDateTime borrowtime) {
        this.borrowtime = borrowtime;
    }

    public LocalDateTime getReturntime() {
        return returntime;
    }

    public void setReturntime(LocalDateTime returntime) {
        this.returntime = returntime;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getDuedate() {
        return duedate;
    }

    public void setDuedate(LocalDateTime duedate) {
        this.duedate = duedate;
    }

    public BigDecimal getFineamount() {
        return fineamount;
    }

    public void setFineamount(BigDecimal fineamount) {
        this.fineamount = fineamount;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
