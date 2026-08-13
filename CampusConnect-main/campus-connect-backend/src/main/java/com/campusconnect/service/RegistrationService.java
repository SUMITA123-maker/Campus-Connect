package com.campusconnect.service;

import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Registration;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.enums.RegistrationStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;

    @Transactional
    public RegistrationResponse register(Long eventId, String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new IllegalArgumentException("Event is not open for registration");
        }
        if (registrationRepository.existsByStudentIdAndEventId(student.getId(), eventId)) {
            throw new IllegalArgumentException("Already registered for this event");
        }

        long currentCount = registrationRepository
                .countByEventIdAndStatus(eventId, RegistrationStatus.REGISTERED);
        if (currentCount >= event.getMaxParticipants()) {
            throw new IllegalArgumentException("Event is full");
        }

        Registration reg = new Registration();
        reg.setStudent(student);
        reg.setEvent(event);
        reg.setStatus(RegistrationStatus.REGISTERED);

        return toResponse(registrationRepository.save(reg));
    }

    @Transactional
    public void cancelRegistration(Long eventId, String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Registration reg = registrationRepository
                .findByStudentIdAndEventId(student.getId(), eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
        reg.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(reg);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations(String studentEmail) {
        return registrationRepository.findByStudentEmail(studentEmail)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private RegistrationResponse toResponse(Registration r) {
        RegistrationResponse res = new RegistrationResponse();
        res.setId(r.getId());
        res.setEventId(r.getEvent().getId());
        res.setEventTitle(r.getEvent().getTitle());
        res.setEventVenue(r.getEvent().getVenue());
        res.setEventDate(r.getEvent().getEventDate());
        res.setStudentId(r.getStudent().getId());
        res.setStudentName(r.getStudent().getFullName());
        res.setStudentCollegeId(r.getStudent().getCollegeId());
        res.setStatus(r.getStatus());
        res.setRegisteredAt(r.getRegisteredAt());
        return res;
    }
}
