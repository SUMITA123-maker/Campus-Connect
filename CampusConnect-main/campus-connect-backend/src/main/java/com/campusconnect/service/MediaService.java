package com.campusconnect.service;

import com.campusconnect.dto.response.MediaResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Media;
import com.campusconnect.entity.Organizer;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.enums.MediaStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.MediaRepository;
import com.campusconnect.repository.OrganizerRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;
    private final StudentRepository studentRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final long COMPRESS_THRESHOLD_BYTES = 100L * 1024 * 1024; // 100 MB

    @Transactional
    public MediaResponse uploadMedia(Long eventId, MultipartFile file, String organizerEmail) throws IOException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Organizer organizer = organizerRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        Media media = savePendingMedia(event, file);
        media.setUploadedBy(organizer);
        return toResponse(mediaRepository.save(media));
    }

    @Transactional
    public MediaResponse uploadStudentMedia(Long eventId, MultipartFile file, String studentEmail) throws IOException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (event.getStatus() != EventStatus.COMPLETED) {
            throw new IllegalArgumentException("Students can upload media only after an event is completed");
        }
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Media media = savePendingMedia(event, file);
        media.setUploadedBy(event.getOrganizer());
        media.setUploadedByStudent(student);
        return toResponse(mediaRepository.save(media));
    }

    private Media savePendingMedia(Event event, MultipartFile file) throws IOException {
        String contentType = file.getContentType() != null ? file.getContentType() : "";
        String fileType = contentType.startsWith("image") ? "IMAGE" : "VIDEO";
        boolean wasCompressed = false;
        byte[] fileBytes = file.getBytes();

        // Compress images exceeding 100 MB
        if (fileType.equals("IMAGE") && file.getSize() > COMPRESS_THRESHOLD_BYTES) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Thumbnails.of(new ByteArrayInputStream(fileBytes))
                    .size(1920, 1080)
                    .outputQuality(0.75)
                    .toOutputStream(baos);
            fileBytes = baos.toByteArray();
            wasCompressed = true;
        }

        // Save to pending/private folder
        Path pendingDir = Path.of(uploadDir, "pending", String.valueOf(event.getId()));
        Files.createDirectories(pendingDir);
        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path targetPath = pendingDir.resolve(uniqueFileName);
        Files.write(targetPath, fileBytes);

        Media media = new Media();
        media.setEvent(event);
        media.setOriginalFileName(file.getOriginalFilename());
        media.setFilePath(targetPath.toString());
        media.setFileType(fileType);
        media.setFileSizeBytes((long) fileBytes.length);
        media.setWasCompressed(wasCompressed);
        media.setStatus(MediaStatus.PENDING_APPROVAL);

        return media;
    }

    @Transactional
    public MediaResponse reviewMedia(Long mediaId, MediaStatus newStatus, String remarks) throws IOException {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        media.setStatus(newStatus);
        media.setAdminRemarks(remarks);
        media.setReviewedAt(LocalDateTime.now());

        if (newStatus == MediaStatus.APPROVED) {
            // Move file from pending to public folder
            Path publicDir = Path.of(uploadDir, "public", String.valueOf(media.getEvent().getId()));
            Files.createDirectories(publicDir);
            Path oldPath = Path.of(media.getFilePath());
            Path newPath = publicDir.resolve(oldPath.getFileName());
            Files.move(oldPath, newPath, StandardCopyOption.REPLACE_EXISTING);
            media.setFilePath(newPath.toString());
            media.setPublicUrl("/api/media/files/" + media.getEvent().getId() + "/" + newPath.getFileName());
        }

        return toResponse(mediaRepository.save(media));
    }

    public List<MediaResponse> getApprovedMedia(Long eventId) {
        List<Media> list = eventId != null
                ? mediaRepository.findByEventIdAndStatus(eventId, MediaStatus.APPROVED)
                : mediaRepository.findByStatus(MediaStatus.APPROVED);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MediaResponse> getMediaByStatus(MediaStatus status) {
        return mediaRepository.findByStatus(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MediaResponse> getOrganizerEventMedia(Long eventId, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new ResourceNotFoundException("Event not found");
        }
        return mediaRepository.findByEventId(eventId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Resource getMediaFile(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
        Path filePath = Path.of(media.getFilePath()).normalize();
        if (!Files.exists(filePath)) {
            String folder = media.getStatus() == MediaStatus.APPROVED ? "public" : "pending";
            Path storedFileName = filePath.getFileName();
            if (storedFileName != null) {
                Path uploadPath = Path.of(uploadDir, folder, String.valueOf(media.getEvent().getId()), storedFileName.toString()).normalize();
                if (Files.exists(uploadPath)) {
                    filePath = uploadPath;
                }
            }
        }
        if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            throw new ResourceNotFoundException("Media file not found");
        }
        return new FileSystemResource(filePath);
    }

    private MediaResponse toResponse(Media m) {
        MediaResponse res = new MediaResponse();
        res.setId(m.getId());
        res.setEventId(m.getEvent().getId());
        res.setEventTitle(m.getEvent().getTitle());
        res.setOriginalFileName(m.getOriginalFileName());
        res.setPublicUrl(m.getPublicUrl());
        res.setFileType(m.getFileType());
        res.setFileSizeBytes(m.getFileSizeBytes());
        res.setWasCompressed(m.isWasCompressed());
        res.setStatus(m.getStatus());
        res.setAdminRemarks(m.getAdminRemarks());
        if (m.getUploadedByStudent() != null) {
            res.setUploaderName(m.getUploadedByStudent().getFullName());
            res.setUploaderRole("STUDENT");
        } else if (m.getUploadedBy() != null) {
            res.setUploaderName(m.getUploadedBy().getFullName());
            res.setUploaderRole("ORGANIZER");
        }
        res.setUploadedAt(m.getUploadedAt());
        res.setReviewedAt(m.getReviewedAt());
        return res;
    }
}
