package com.campusconnect.service;

import com.campusconnect.dto.request.AttendanceRequest;
import com.campusconnect.dto.response.AttendanceResponse;
import com.campusconnect.entity.Attendance;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Organizer;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceForEvent(Long eventId, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }

        return attendanceRepository.findByEventId(eventId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void markBulkAttendance(Long eventId, List<AttendanceRequest> requests, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Organizer organizer = organizerRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }

        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new IllegalArgumentException("Attendance cannot be changed after the event is completed");
        }

        for (AttendanceRequest req : requests) {
            Student student = studentRepository.findById(req.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + req.getStudentId()));

            Attendance attendance = attendanceRepository
                    .findByStudentIdAndEventId(student.getId(), eventId)
                    .orElse(new Attendance());

            attendance.setStudent(student);
            attendance.setEvent(event);
            attendance.setStatus(req.getStatus());
            attendance.setMarkedAt(LocalDateTime.now());
            attendance.setMarkedBy(organizer);
            attendanceRepository.save(attendance);
        }
    }

    private AttendanceResponse toResponse(Attendance a) {
        AttendanceResponse res = new AttendanceResponse();
        res.setId(a.getId());
        res.setStudentId(a.getStudent().getId());
        res.setStudentName(a.getStudent().getFullName());
        res.setStudentCollegeId(a.getStudent().getCollegeId());
        res.setEventId(a.getEvent().getId());
        res.setEventTitle(a.getEvent().getTitle());
        res.setStatus(a.getStatus());
        res.setMarkedAt(a.getMarkedAt());
        return res;
    }
}
