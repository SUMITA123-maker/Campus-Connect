package com.campusconnect.controller;

import com.campusconnect.dto.request.EventRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // ── PUBLIC ────────────────────────────────────────────────────
    @GetMapping("/events/public")
    public ResponseEntity<Page<EventResponse>> getPublicEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(eventService.getApprovedEvents(page, size, category));
    }

    @GetMapping("/events/public/completed")
    public ResponseEntity<List<EventResponse>> getPublicCompletedEvents() {
        return ResponseEntity.ok(eventService.getEventsByStatus(EventStatus.COMPLETED));
    }

    @GetMapping("/events/public/{id}")
    public ResponseEntity<EventResponse> getEventDetail(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/student/events/completed")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EventResponse>> getCompletedEventsForStudents() {
        return ResponseEntity.ok(eventService.getEventsByStatus(EventStatus.COMPLETED));
    }

    // ── ORGANIZER ─────────────────────────────────────────────────
    @PostMapping("/organizer/events")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, auth.getName()));
    }

    @PutMapping("/organizer/events/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request, Authentication auth) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, auth.getName()));
    }

    @DeleteMapping("/organizer/events/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, Authentication auth) {
        eventService.deleteEvent(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/organizer/events")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication auth) {
        return ResponseEntity.ok(eventService.getEventsByOrganizer(auth.getName()));
    }

    @PatchMapping("/organizer/events/{id}/complete")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> markEventCompleted(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(eventService.markEventCompleted(id, auth.getName()));
    }

    // ── ADMIN ─────────────────────────────────────────────────────
    @GetMapping("/admin/events/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getEventsByStatus(EventStatus.PENDING_APPROVAL));
    }

    @GetMapping("/admin/events/completed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getCompletedEvents() {
        return ResponseEntity.ok(eventService.getEventsByStatus(EventStatus.COMPLETED));
    }

    @GetMapping("/admin/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PatchMapping("/admin/events/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, EventStatus.APPROVED, null));
    }

    @PatchMapping("/admin/events/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> rejectEvent(
            @PathVariable Long id,
            @RequestParam String remarks) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, EventStatus.REJECTED, remarks));
    }
}
