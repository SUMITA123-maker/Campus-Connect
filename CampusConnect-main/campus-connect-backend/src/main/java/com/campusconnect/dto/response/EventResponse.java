package com.campusconnect.dto.response;

import com.campusconnect.enums.EventStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime eventDate;
    private LocalDateTime registrationDeadline;
    private Integer maxParticipants;
    private EventStatus status;
    private String category;
    private String bannerImagePath;
    private String adminRemarks;
    private LocalDateTime createdAt;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private long registeredCount;
    private double averageRating;
    private long feedbackCount;
}
