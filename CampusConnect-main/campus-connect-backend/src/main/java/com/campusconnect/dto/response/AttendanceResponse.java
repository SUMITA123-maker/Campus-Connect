package com.campusconnect.dto.response;

import com.campusconnect.enums.AttendanceStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCollegeId;
    private Long eventId;
    private String eventTitle;
    private AttendanceStatus status;
    private LocalDateTime markedAt;
}
