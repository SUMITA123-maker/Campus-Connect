package com.campusconnect.entity;

import com.campusconnect.enums.MediaStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "media", indexes = {
    @Index(name = "idx_media_event", columnList = "event_id"),
    @Index(name = "idx_media_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_organizer_id")
    private Organizer uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_student_id")
    private Student uploadedByStudent;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String filePath;

    private String publicUrl;

    @Column(length = 10)
    private String fileType;

    private Long fileSizeBytes;
    private boolean wasCompressed = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MediaStatus status = MediaStatus.PENDING_APPROVAL;

    @Column(columnDefinition = "TEXT")
    private String adminRemarks;

    private LocalDateTime uploadedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;
}
