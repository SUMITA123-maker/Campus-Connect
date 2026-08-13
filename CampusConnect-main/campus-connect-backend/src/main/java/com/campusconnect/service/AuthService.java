package com.campusconnect.service;

import com.campusconnect.config.JwtService;
import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.RegisterRequest;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.entity.Organizer;
import com.campusconnect.entity.Student;
import com.campusconnect.entity.User;
import com.campusconnect.enums.UserRole;
import com.campusconnect.repository.OrganizerRepository;
import com.campusconnect.repository.StudentRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OrganizerRepository organizerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userId(user.getId())
                .build();
    }

    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (studentRepository.existsByCollegeId(request.getCollegeId())) {
            throw new IllegalArgumentException("College ID already registered");
        }

        Student student = new Student();
        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setCollegeId(request.getCollegeId());
        student.setDepartment(request.getDepartment());
        student.setSemester(request.getSemester());
        student.setPhone(request.getPhone());
        student.setRole(UserRole.STUDENT);

        Student saved = studentRepository.save(student);
        String token = jwtService.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .role("STUDENT")
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .userId(saved.getId())
                .build();
    }

    public AuthResponse registerOrganizer(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Organizer organizer = new Organizer();
        organizer.setFullName(request.getFullName());
        organizer.setEmail(request.getEmail());
        organizer.setPassword(passwordEncoder.encode(request.getPassword()));
        organizer.setDepartment(request.getDepartment());
        organizer.setContactPhone(request.getContactPhone());
        organizer.setBio(request.getBio());
        organizer.setRole(UserRole.ORGANIZER);

        Organizer saved = organizerRepository.save(organizer);
        String token = jwtService.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .role("ORGANIZER")
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .userId(saved.getId())
                .build();
    }

    public AuthResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return AuthResponse.builder()
                .role(user.getRole().name())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userId(user.getId())
                .build();
    }
}
