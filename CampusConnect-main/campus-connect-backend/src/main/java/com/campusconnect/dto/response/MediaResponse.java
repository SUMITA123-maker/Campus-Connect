package com.campusconnect.dto.response;

import com.campusconnect.enums.MediaStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MediaResponse {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String originalFileName;
    private String publicUrl;
    private String fileType;
    private Long fileSizeBytes;
    private boolean wasCompressed;
    private MediaStatus status;
    private String adminRemarks;
    private String uploaderName;
    private String uploaderRole;
    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;
}
