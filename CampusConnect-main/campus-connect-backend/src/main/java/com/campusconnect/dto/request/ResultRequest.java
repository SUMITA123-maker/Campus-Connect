package com.campusconnect.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResultRequest {
    @NotNull
    private Long studentId;
    private String position;
    private Double score;
    private String remarks;
}
