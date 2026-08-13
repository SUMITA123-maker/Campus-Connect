package com.campusconnect.repository;

import com.campusconnect.entity.Registration;
import com.campusconnect.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    @EntityGraph(attributePaths = {"student", "event"})
    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Registration> findByStudentEmail(String email);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Registration> findByEventId(Long eventId);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Registration> findByEventIdAndStatus(Long eventId, RegistrationStatus status);
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
}
