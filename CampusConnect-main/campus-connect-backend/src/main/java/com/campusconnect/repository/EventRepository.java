package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import com.campusconnect.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByStatus(EventStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "organizer")
    List<Event> findByStatus(EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND (:category IS NULL OR e.category = :category)")
    Page<Event> findByStatusAndCategory(EventStatus status, String category, Pageable pageable);

    @EntityGraph(attributePaths = "organizer")
    List<Event> findByOrganizer_Email(String email);

    long countByStatus(EventStatus status);
}
