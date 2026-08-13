package com.campusconnect.controller;

import com.campusconnect.dto.response.MediaResponse;
import com.campusconnect.enums.MediaStatus;
import com.campusconnect.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/organizer/events/{eventId}/media")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<MediaResponse> uploadMedia(
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file,
            Authentication auth) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mediaService.uploadMedia(eventId, file, auth.getName()));
    }

    @GetMapping("/organizer/events/{eventId}/media")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<MediaResponse>> getOrganizerEventMedia(
            @PathVariable Long eventId,
            Authentication auth) {
        return ResponseEntity.ok(mediaService.getOrganizerEventMedia(eventId, auth.getName()));
    }

    @PostMapping("/student/events/{eventId}/media")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<MediaResponse> uploadStudentMedia(
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file,
            Authentication auth) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mediaService.uploadStudentMedia(eventId, file, auth.getName()));
    }

    @GetMapping("/media/gallery")
    public ResponseEntity<List<MediaResponse>> getPublicGallery(
            @RequestParam(required = false) Long eventId) {
        return ResponseEntity.ok(mediaService.getApprovedMedia(eventId));
    }

    @GetMapping("/admin/media/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MediaResponse>> getPendingMedia() {
        return ResponseEntity.ok(mediaService.getMediaByStatus(MediaStatus.PENDING_APPROVAL));
    }

    @GetMapping("/admin/media/{id}/file")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> getAdminMediaFile(@PathVariable Long id) throws IOException {
        Resource resource = mediaService.getMediaFile(id);
        String contentType = Files.probeContentType(resource.getFile().toPath());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(resource);
    }

    @PatchMapping("/admin/media/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MediaResponse> approveMedia(@PathVariable Long id) throws IOException {
        return ResponseEntity.ok(mediaService.reviewMedia(id, MediaStatus.APPROVED, null));
    }

    @PatchMapping("/admin/media/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MediaResponse> rejectMedia(
            @PathVariable Long id,
            @RequestParam String remarks) throws IOException {
        return ResponseEntity.ok(mediaService.reviewMedia(id, MediaStatus.REJECTED, remarks));
    }

    // Serve public media files
    @GetMapping("/media/files/{eventId}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable Long eventId, @PathVariable String filename) {
        Path filePath = Path.of("./uploads/public/" + eventId + "/" + filename);
        Resource resource = new FileSystemResource(filePath);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
