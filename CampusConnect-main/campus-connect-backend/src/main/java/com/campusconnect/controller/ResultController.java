package com.campusconnect.controller;

import com.campusconnect.dto.request.ResultRequest;
import com.campusconnect.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/events/{eventId}/results")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ORGANIZER')")
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    public ResponseEntity<Void> uploadResults(
            @PathVariable Long eventId,
            @RequestBody List<ResultRequest> results,
            Authentication auth) {
        resultService.uploadResults(eventId, results, auth.getName());
        return ResponseEntity.ok().build();
    }
}
