package com.library.library_management.repository;

import com.library.library_management.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.types")
    List<Book> findAllWithTypes();

    @Modifying
    @Query(value = "DELETE FROM book_has_type WHERE Book_id = :bookId", nativeQuery = true)
    void deleteTypeLinksByBookId(@Param("bookId") Integer bookId);
}
