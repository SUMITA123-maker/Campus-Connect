package com.campusconnect.entity;

import com.campusconnect.enums.CertificateStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_cert_student_event",
        columnNames = {"student_id", "event_id"}
    )
)
@Getter @Setter @NoArgsConstructor
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CertificateStatus status = CertificateStatus.NOT_GENERATED;

    private String filePath;

    @Column(unique = true, length = 50)
    private String certificateNumber;

    private LocalDateTime generatedAt;
    private LocalDateTime verifiedAt;
}
