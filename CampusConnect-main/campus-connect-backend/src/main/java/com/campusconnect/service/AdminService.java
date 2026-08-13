package com.campusconnect.service;

import com.campusconnect.dto.response.DashboardStatsResponse;
import com.campusconnect.enums.CertificateStatus;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.enums.MediaStatus;
import com.campusconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OrganizerRepository organizerRepository;
    private final EventRepository eventRepository;
    private final MediaRepository mediaRepository;
    private final CertificateRepository certificateRepository;
    private final RegistrationRepository registrationRepository;

    public DashboardStatsResponse getStats() {
        return DashboardStatsResponse.builder()
                .totalEvents(eventRepository.count())
                .pendingEvents(eventRepository.countByStatus(EventStatus.PENDING_APPROVAL))
                .approvedEvents(eventRepository.countByStatus(EventStatus.APPROVED))
                .totalUsers(userRepository.count())
                .totalStudents(studentRepository.count())
                .totalOrganizers(organizerRepository.count())
                .pendingMedia(mediaRepository.countByStatus(MediaStatus.PENDING_APPROVAL))
                .pendingCertificates(certificateRepository.findByStatus(CertificateStatus.GENERATED).size())
                .totalRegistrations(registrationRepository.count())
                .build();
    }
}
