package com.library.library_management.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity

public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "author")
    private String author;

    @Column(name = "release_day")
    private LocalDate release_day;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "publisher")
    private String publisher;

    public Book( String name, String author, LocalDate release_day, Boolean status, String isbn, String publisher) {
        this.name = name;
        this.author = author;
        this.release_day = release_day;
        this.status = status;
        this.isbn = isbn;
        this.publisher = publisher;
    }

    public Book() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDate getRelease_day() {
        return release_day;
    }

    public void setRelease_day(LocalDate release_day) {
        this.release_day = release_day;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
}
