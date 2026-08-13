package com.campusconnect.service;

import com.campusconnect.dto.request.EventRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Organizer;
import com.campusconnect.enums.EventStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.OrganizerRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.enums.RegistrationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;
    private final RegistrationRepository registrationRepository;
    private final com.campusconnect.repository.EventFeedbackRepository feedbackRepository;

    @Transactional(readOnly = true)
    public Page<EventResponse> getApprovedEvents(int page, int size, String category) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("eventDate").ascending());
        Page<Event> events = eventRepository.findByStatusAndCategory(
                EventStatus.APPROVED, category, pageable);
        return events.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return toResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, String organizerEmail) {
        Organizer organizer = organizerRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setCategory(request.getCategory());
        event.setOrganizer(organizer);
        event.setStatus(EventStatus.PENDING_APPROVAL);

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request, String organizerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }
        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed events cannot be edited");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setCategory(request.getCategory());
        // Reset to pending if organizer edits
        if (event.getStatus() == EventStatus.APPROVED || event.getStatus() == EventStatus.REJECTED) {
            event.setStatus(EventStatus.PENDING_APPROVAL);
        }

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long id, String organizerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }
        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed events cannot be deleted");
        }

        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByOrganizer(String email) {
        return eventRepository.findByOrganizer_Email(email)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByStatus(EventStatus status) {
        return eventRepository.findByStatus(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public EventResponse markEventCompleted(Long id, String organizerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }

        if (event.getStatus() != EventStatus.APPROVED && event.getStatus() != EventStatus.ONGOING) {
            throw new IllegalArgumentException("Only approved or ongoing events can be marked as completed");
        }

        event.setStatus(EventStatus.COMPLETED);
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse updateEventStatus(Long id, EventStatus newStatus, String remarks) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(newStatus);
        if (remarks != null) {
            event.setAdminRemarks(remarks);
        }
        return toResponse(eventRepository.save(event));
    }

    private EventResponse toResponse(Event event) {
        EventResponse res = new EventResponse();
        res.setId(event.getId());
        res.setTitle(event.getTitle());
        res.setDescription(event.getDescription());
        res.setVenue(event.getVenue());
        res.setEventDate(event.getEventDate());
        res.setRegistrationDeadline(event.getRegistrationDeadline());
        res.setMaxParticipants(event.getMaxParticipants());
        res.setStatus(event.getStatus());
        res.setCategory(event.getCategory());
        res.setBannerImagePath(event.getBannerImagePath());
        res.setAdminRemarks(event.getAdminRemarks());
        res.setCreatedAt(event.getCreatedAt());
        if (event.getOrganizer() != null) {
            res.setOrganizerId(event.getOrganizer().getId());
            res.setOrganizerName(event.getOrganizer().getFullName());
            res.setOrganizerEmail(event.getOrganizer().getEmail());
        }
        res.setRegisteredCount(
                registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.REGISTERED));
        res.setAverageRating(feedbackRepository.averageRatingByEventId(event.getId()));
        res.setFeedbackCount(feedbackRepository.countByEventId(event.getId()));
        return res;
    }
}
