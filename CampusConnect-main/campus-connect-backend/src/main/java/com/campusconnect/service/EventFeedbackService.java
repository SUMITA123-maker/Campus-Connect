package com.campusconnect.service;

import com.campusconnect.dto.request.EventFeedbackRequest;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventFeedback;
import com.campusconnect.entity.Student;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.enums.RegistrationStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventFeedbackRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventFeedbackService {
    private final EventFeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;

    @Transactional
    public void submit(Long eventId, EventFeedbackRequest request, String studentEmail) {
        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (event.getStatus() != EventStatus.COMPLETED) {
            throw new IllegalArgumentException("Feedback is available after an event is completed");
        }
        boolean registered = registrationRepository.findByStudentIdAndEventId(student.getId(), eventId)
                .map(registration -> registration.getStatus() == RegistrationStatus.REGISTERED)
                .orElse(false);
        if (!registered) {
            throw new IllegalArgumentException("Only registered students can give feedback for this event");
        }
        if (feedbackRepository.existsByStudentIdAndEventId(student.getId(), eventId)) {
            throw new IllegalArgumentException("You have already submitted feedback for this event");
        }

        EventFeedback feedback = new EventFeedback();
        feedback.setStudent(student);
        feedback.setEvent(event);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment() == null ? null : request.getComment().trim());
        feedbackRepository.save(feedback);
    }
}
