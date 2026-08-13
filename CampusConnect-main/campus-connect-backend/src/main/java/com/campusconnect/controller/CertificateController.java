package com.campusconnect.controller;

import com.campusconnect.dto.request.CertificateGenerationRequest;
import com.campusconnect.dto.response.CertificateResponse;
import com.campusconnect.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/organizer/events/{eventId}/certificates/generate")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> generateCertificatesForSelectedStudents(
            @PathVariable Long eventId,
            @RequestBody CertificateGenerationRequest request,
            Authentication auth) {
        certificateService.generateCertificatesForSelectedStudents(eventId, request.getStudentIds(), auth.getName());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/certificates/{certId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> verifyCertificate(@PathVariable Long certId) {
        return ResponseEntity.ok(certificateService.verifyCertificate(certId));
    }

    @GetMapping("/admin/events/{eventId}/certificates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CertificateResponse>> getCertificatesForEvent(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(certificateService.getAllCertificatesForEvent(eventId));
    }

    @GetMapping("/organizer/events/{eventId}/certificates")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<CertificateResponse>> getOrganizerCertificatesForEvent(
            @PathVariable Long eventId,
            Authentication auth) {
        return ResponseEntity.ok(certificateService.getOrganizerCertificatesForEvent(eventId, auth.getName()));
    }

    @GetMapping("/organizer/certificates/{certId}/download")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Resource> downloadOrganizerCertificate(
            @PathVariable Long certId, Authentication auth) {
        Resource file = certificateService.getOrganizerCertificateFile(certId, auth.getName());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    @GetMapping("/student/certificates")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(Authentication auth) {
        return ResponseEntity.ok(certificateService.getCertificatesForStudent(auth.getName()));
    }

    @GetMapping("/student/certificates/{certId}/download")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable Long certId, Authentication auth) {
        Resource file = certificateService.getCertificateFile(certId, auth.getName());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }
}
