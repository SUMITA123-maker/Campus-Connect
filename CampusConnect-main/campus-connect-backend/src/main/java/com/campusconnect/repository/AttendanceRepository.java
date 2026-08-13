package com.campusconnect.repository;

import com.campusconnect.entity.Attendance;
import com.campusconnect.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @EntityGraph(attributePaths = {"student", "event"})
    List<Attendance> findByEventId(Long eventId);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Attendance> findByEventIdAndStatus(Long eventId, AttendanceStatus status);
    @EntityGraph(attributePaths = {"student", "event"})
    Optional<Attendance> findByStudentIdAndEventId(Long studentId, Long eventId);
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
}
