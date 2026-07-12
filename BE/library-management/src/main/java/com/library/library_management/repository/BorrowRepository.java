package com.library.library_management.repository;

import com.library.library_management.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Integer> {
    void deleteByBookId(Integer bookId);
    List<Borrow> findByUserId(String userId);
}
