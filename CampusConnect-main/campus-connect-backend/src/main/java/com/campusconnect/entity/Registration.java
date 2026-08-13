package com.campusconnect.entity;

import com.campusconnect.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_student_event",
        columnNames = {"student_id", "event_id"}
    )
)
@Getter @Setter @NoArgsConstructor
public class Registration {

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
    @Column(nullable = false, length = 20)
    private RegistrationStatus status = RegistrationStatus.REGISTERED;

    @Column(updatable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    private String additionalInfo;
}
