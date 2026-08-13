package com.campusconnect.controller;

import com.campusconnect.dto.request.EventFeedbackRequest;
import com.campusconnect.service.EventFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/events")
@RequiredArgsConstructor
public class EventFeedbackController {
    private final EventFeedbackService feedbackService;

    @PostMapping("/{eventId}/feedback")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> submitFeedback(@PathVariable Long eventId,
                                                @Valid @RequestBody EventFeedbackRequest request,
                                                Authentication auth) {
        feedbackService.submit(eventId, request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
