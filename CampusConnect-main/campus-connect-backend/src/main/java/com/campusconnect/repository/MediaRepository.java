package com.campusconnect.repository;

import com.campusconnect.entity.Media;
import com.campusconnect.enums.MediaStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    @EntityGraph(attributePaths = {"event", "uploadedBy", "uploadedByStudent"})
    Optional<Media> findById(Long id);
    @EntityGraph(attributePaths = {"event", "uploadedBy", "uploadedByStudent"})
    List<Media> findByStatus(MediaStatus status);
    @EntityGraph(attributePaths = {"event", "uploadedBy", "uploadedByStudent"})
    List<Media> findByEventIdAndStatus(Long eventId, MediaStatus status);
    @EntityGraph(attributePaths = {"event", "uploadedBy", "uploadedByStudent"})
    List<Media> findByEventId(Long eventId);
    long countByStatus(MediaStatus status);
}
