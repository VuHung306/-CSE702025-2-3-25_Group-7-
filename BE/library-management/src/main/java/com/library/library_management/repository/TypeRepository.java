package com.library.library_management.repository;

import com.library.library_management.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeRepository extends JpaRepository<Type, Integer> {
    @Modifying
    @Query(value = "DELETE FROM type WHERE id NOT IN (SELECT DISTINCT Type_id FROM book_has_type)", nativeQuery = true)
    int deleteUnusedTypes();
}
