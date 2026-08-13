package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "results",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_result_student_event",
        columnNames = {"student_id", "event_id"}
    )
)
@Getter @Setter @NoArgsConstructor
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(length = 20)
    private String position;

    private Double score;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private LocalDateTime uploadedAt = LocalDateTime.now();
}
