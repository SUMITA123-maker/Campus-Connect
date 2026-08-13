package com.campusconnect.dto.response;

import com.campusconnect.enums.CertificateStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CertificateResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCollegeId;
    private Long eventId;
    private String eventTitle;
    private CertificateStatus status;
    private String certificateNumber;
    private LocalDateTime generatedAt;
    private LocalDateTime verifiedAt;
}
