package com.campusconnect.dto.response;

import com.campusconnect.enums.RegistrationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationResponse {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String eventVenue;
    private LocalDateTime eventDate;
    private Long studentId;
    private String studentName;
    private String studentCollegeId;
    private RegistrationStatus status;
    private LocalDateTime registeredAt;
}
