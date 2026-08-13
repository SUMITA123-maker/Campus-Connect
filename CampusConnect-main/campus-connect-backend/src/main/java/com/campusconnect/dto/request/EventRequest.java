package com.campusconnect.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String venue;

    @NotNull @Future
    private LocalDateTime eventDate;

    private LocalDateTime registrationDeadline;

    @NotNull @Min(1)
    private Integer maxParticipants;

    @NotBlank
    private String category;
}
