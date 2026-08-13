package com.campusconnect.dto.request;

import com.campusconnect.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRequest {
    @NotNull
    private Long studentId;
    @NotNull
    private AttendanceStatus status;
}
