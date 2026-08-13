package com.campusconnect.repository;

import com.campusconnect.entity.Certificate;
import com.campusconnect.enums.CertificateStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    @EntityGraph(attributePaths = {"student", "event"})
    List<Certificate> findByStudentEmail(String email);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Certificate> findByStudentEmailAndStatus(String email, CertificateStatus status);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Certificate> findByStatus(CertificateStatus status);
    @EntityGraph(attributePaths = {"student", "event"})
    Optional<Certificate> findByStudentIdAndEventId(Long studentId, Long eventId);
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    @EntityGraph(attributePaths = {"student", "event"})
    List<Certificate> findByEventId(Long eventId);
}
