package com.campusconnect.service;

import com.campusconnect.dto.request.ResultRequest;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Result;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.ResultRepository;
import com.campusconnect.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public void uploadResults(Long eventId, List<ResultRequest> requests, String organizerEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        for (ResultRequest req : requests) {
            Student student = studentRepository.findById(req.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + req.getStudentId()));

            Result result = resultRepository
                    .findByStudentIdAndEventId(student.getId(), eventId)
                    .orElse(new Result());

            result.setStudent(student);
            result.setEvent(event);
            result.setPosition(req.getPosition());
            result.setScore(req.getScore());
            result.setRemarks(req.getRemarks());
            result.setUploadedAt(LocalDateTime.now());
            resultRepository.save(result);
        }
    }
}
