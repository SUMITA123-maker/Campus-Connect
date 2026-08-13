package com.campusconnect.controller;

import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/student/events/{eventId}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RegistrationResponse> register(
            @PathVariable Long eventId, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registrationService.register(eventId, auth.getName()));
    }

    @PatchMapping("/student/events/{eventId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> cancel(@PathVariable Long eventId, Authentication auth) {
        registrationService.cancelRegistration(eventId, auth.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<RegistrationResponse>> myRegistrations(Authentication auth) {
        return ResponseEntity.ok(registrationService.getMyRegistrations(auth.getName()));
    }

    @GetMapping("/organizer/events/{eventId}/registrations")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<RegistrationResponse>> eventRegistrations(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(eventId));
    }
}
