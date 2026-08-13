package com.campusconnect.repository;

import com.campusconnect.entity.EventFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EventFeedbackRepository extends JpaRepository<EventFeedback, Long> {
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    @Query("select coalesce(avg(f.rating), 0) from EventFeedback f where f.event.id = :eventId")
    double averageRatingByEventId(Long eventId);

    long countByEventId(Long eventId);
}
