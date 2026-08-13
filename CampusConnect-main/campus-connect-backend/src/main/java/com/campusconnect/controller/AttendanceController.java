package com.campusconnect.controller;

import com.campusconnect.dto.request.AttendanceRequest;
import com.campusconnect.dto.response.AttendanceResponse;
import com.campusconnect.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/events/{eventId}/attendance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ORGANIZER')")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceResponse>> getAttendance(
            @PathVariable Long eventId,
            Authentication auth) {
        return ResponseEntity.ok(attendanceService.getAttendanceForEvent(eventId, auth.getName()));
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> markBulkAttendance(
            @PathVariable Long eventId,
            @RequestBody List<AttendanceRequest> requests,
            Authentication auth) {
        attendanceService.markBulkAttendance(eventId, requests, auth.getName());
        return ResponseEntity.ok().build();
    }
}
